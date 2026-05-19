import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    useMultiFileAuthState
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import express from 'express';
import cors from 'cors';
import QRCode from 'qrcode';
import axios from 'axios';
import pino from 'pino';
import { usePostgresAuthState } from './usePostgresAuthState.js';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '../backend/.env' });
dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 7860;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory storage for sessions and QR codes
const sessions = new Map();
const qrCodes = new Map();
const sessionStatus = new Map();

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'WhatsApp Bridge is running (Baileys v7)', uptime: process.uptime() });
});

async function startSession(userId) {
    // Prevent duplicate sessions
    if (sessions.has(userId)) {
        const existingSock = sessions.get(userId);
        try { existingSock.end(); } catch(e) {}
        sessions.delete(userId);
    }

    const { state, saveCreds } = await usePostgresAuthState(userId);
    const { version } = await fetchLatestBaileysVersion();

    sessionStatus.set(userId, 'connecting');

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ['Chrome (Linux)', 'Chrome', '120.0.0'],
        printQRInTerminal: false,
        generateHighQualityLinkPreview: false,
        syncFullHistory: false,
    });

    sessions.set(userId, sock);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log(`[QR] Generating for user: ${userId}`);
            const qrDataURL = await QRCode.toDataURL(qr);
            qrCodes.set(userId, qrDataURL);
            sessionStatus.set(userId, 'qr');
        }

        if (connection === 'close') {
            const statusCode = (lastDisconnect?.error)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log(`[Session] Closed for ${userId}. Code: ${statusCode}. Reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) {
                sessionStatus.set(userId, 'connecting');
                setTimeout(() => startSession(userId), 3000);
            } else {
                sessions.delete(userId);
                qrCodes.delete(userId);
                sessionStatus.set(userId, 'idle');
            }
        } else if (connection === 'open') {
            console.log(`[Session] Connected for ${userId}`);
            qrCodes.delete(userId);
            sessionStatus.set(userId, 'ready');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        
        for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;

            const sender = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

            if (!text) continue;

            // Group messages ko IGNORE karo
            if (sender.endsWith('@g.us')) {
                console.log(`[Group] Ignoring group message from: ${sender}`);
                continue;
            }

            console.log(`[Message] From ${sender}: ${text}`);
                
            try {
                const response = await axios.post(`${BACKEND_URL}/api/v1/whatsapp/bridge`, {
                    user_id: userId,
                    sender: sender,
                    text: text
                });

                if (response.data && response.data.reply) {
                    await sock.sendMessage(sender, { text: response.data.reply });
                }
            } catch (error) {
                console.error('[Backend Error]', error.message);
            }
        }
    });

    return sock;
}

// ============ REST API Endpoints ============

app.post('/connect', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    console.log(`[API] Connect request for user: ${userId}`);
    startSession(userId).catch(err => console.error('[Session Error]', err.message));
    res.json({ status: 'initializing', message: 'Session started. Poll /qr/:userId for QR code.' });
});

app.get('/qr/:userId', async (req, res) => {
    const { userId } = req.params;
    let currentStatus = sessionStatus.get(userId) || 'idle';
    const qr = qrCodes.get(userId) || null;

    if (currentStatus === 'idle' && !sessions.has(userId)) {
        console.log(`[Auto-Recovery] Restarting session for user: ${userId}`);
        sessionStatus.set(userId, 'connecting');
        currentStatus = 'connecting';
        startSession(userId).catch(err => console.error('[Auto-Recovery Error]', err.message));
    }

    res.json({ status: currentStatus, qr: qr, userId: userId });
});

app.get('/status/:userId', (req, res) => {
    const { userId } = req.params;
    const currentStatus = sessionStatus.get(userId) || 'idle';
    res.json({ connected: currentStatus === 'ready', status: currentStatus });
});

app.post('/disconnect', (req, res) => {
    const { userId } = req.body;
    if (sessions.has(userId)) {
        try { sessions.get(userId).end(); } catch(e) {}
        sessions.delete(userId);
        qrCodes.delete(userId);
        sessionStatus.set(userId, 'idle');
    }
    res.json({ status: 'disconnected' });
});

app.post('/clear-session', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    if (sessions.has(userId)) {
        try { sessions.get(userId).end(); } catch(e) {}
        sessions.delete(userId);
    }
    qrCodes.delete(userId);
    sessionStatus.set(userId, 'idle');
    
    try {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
        await pool.query('DELETE FROM whatsapp_auth WHERE id LIKE $1', [`${userId}-%`]);
        await pool.end();
        console.log(`[Clear] Wiped session data for user: ${userId}`);
        res.json({ status: 'cleared', message: 'Session data cleared. You can now reconnect for a fresh QR.' });
    } catch (err) {
        console.error('[Clear Error]', err.message);
        res.json({ status: 'cleared_memory', message: 'Cleared in-memory. DB clear may have failed.' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`WhatsApp Bridge Service running on http://localhost:${PORT}`);
});

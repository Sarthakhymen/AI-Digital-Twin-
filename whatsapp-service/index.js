const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const axios = require('axios');
const pino = require('pino');
const path = require('path');
const { usePostgresAuthState } = require('./usePostgresAuthState');
require('dotenv').config({ path: '../backend/.env' }); // try loading backend env if missing
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 7860;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Groups ko ignore karo - sirf personal/individual chats pe reply karo

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory storage for sessions and QR codes
const sessions = new Map();
const qrCodes = new Map();      // userId -> qrDataURL
const sessionStatus = new Map(); // userId -> 'connecting' | 'qr' | 'ready' | 'error'

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'WhatsApp Bridge is running', uptime: process.uptime() });
});

async function startSession(userId) {
    // Prevent duplicate sessions
    if (sessions.has(userId)) {
        const existingSock = sessions.get(userId);
        try { existingSock.end(); } catch(e) {}
        sessions.delete(userId);
    }

    // Use Postgres instead of ephemeral local files
    // const sessionDir = path.join(__dirname, 'auth', userId);
    // const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
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
        printQRInTerminal: false,
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

            // Group messages ko IGNORE karo (group JID @g.us se end hota hai)
            if (sender.endsWith('@g.us')) {
                console.log(`[Group] Ignoring group message from: ${sender}`);
                continue;
            }

            console.log(`[Message] From ${sender}: ${text}`);
                
            try {
                // Send to backend AI bridge
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

// ============ REST API Endpoints (No WebSocket needed!) ============

// Start a new WhatsApp session
app.post('/connect', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    console.log(`[API] Connect request for user: ${userId}`);
    // Fire-and-forget: don't await, respond immediately
    startSession(userId).catch(err => console.error('[Session Error]', err.message));
    res.json({ status: 'initializing', message: 'Session started. Poll /qr/:userId for QR code.' });
});

// Get QR code for a user (Frontend polls this every 2 seconds)
// Auto-restart session if idle (handles Render restarts where in-memory sessions are wiped)
app.get('/qr/:userId', async (req, res) => {
    const { userId } = req.params;
    let currentStatus = sessionStatus.get(userId) || 'idle';
    const qr = qrCodes.get(userId) || null;

    // If idle and not already starting, auto-restart session (Render restart recovery)
    if (currentStatus === 'idle' && !sessions.has(userId)) {
        console.log(`[Auto-Recovery] Restarting session for user: ${userId}`);
        sessionStatus.set(userId, 'connecting');
        currentStatus = 'connecting';
        startSession(userId).catch(err => console.error('[Auto-Recovery Error]', err.message));
    }

    res.json({ 
        status: currentStatus, 
        qr: qr,
        userId: userId
    });
});

// Get connection status
app.get('/status/:userId', (req, res) => {
    const { userId } = req.params;
    const currentStatus = sessionStatus.get(userId) || 'idle';
    const isConnected = currentStatus === 'ready';
    res.json({ connected: isConnected, status: currentStatus });
});

// Disconnect a session
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`WhatsApp Bridge Service running on http://localhost:${PORT}`);
});

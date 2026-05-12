const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const axios = require('axios');
const pino = require('pino');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 3001;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

app.use(express.json());

// Multi-session storage (for different owners)
const sessions = new Map();

async function startSession(userId) {
    const sessionDir = path.join(__dirname, 'auth', userId);
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

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
            io.emit('qr', { userId, qr: qrDataURL });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(`[Session] Closed for ${userId}. Reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) startSession(userId);
            else sessions.delete(userId);
        } else if (connection === 'open') {
            console.log(`[Session] Connected for ${userId}`);
            io.emit('ready', { userId });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        
        for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;

            const sender = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

            if (text) {
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
        }
    });

    return sock;
}

// REST Endpoints
app.get('/status/:userId', (req, res) => {
    const { userId } = req.params;
    const isConnected = sessions.has(userId) && sessions.get(userId).ws?.readyState === 1;
    res.json({ connected: isConnected });
});

app.post('/connect', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    await startSession(userId);
    res.json({ status: 'initializing' });
});

server.listen(PORT, () => {
    console.log(`WhatsApp Bridge running on port ${PORT}`);
});

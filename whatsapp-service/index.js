const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace with your frontend URL
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.WHATSAPP_SERVICE_PORT || 3001;
const BACKEND_URL = process.env.BACKEND_URL || 'https://ai-digital-twin-2le9.onrender.com';


const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './sessions'
    }),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('User connected to WhatsApp Socket');
});

client.on('qr', (qr) => {
    console.log('🔄 QR Code generated');
    qrcode.generate(qr, { small: true });
    io.emit('qr', qr); // Send QR to frontend
});

client.on('ready', () => {
    console.log('✅ WhatsApp Client is ready!');
    io.emit('ready', { message: 'WhatsApp is connected!' });
});

client.on('authenticated', () => {
    console.log('✅ Authenticated');
    io.emit('authenticated', true);
});

client.on('message', async (msg) => {
    // 1. IMPORTANT: Check if message is from the owner themselves
    if (msg.fromMe) {
        console.log('Owner is typing, AI staying quiet.');
        return;
    }

    // 2. Ignore groups
    if (msg.from.includes('@g.us')) return;

    console.log(`📩 Message from ${msg.from}: ${msg.body}`);

    try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/whatsapp/process`, {
            from: msg.from,
            body: msg.body
        });

        if (response.data && response.data.response) {
            msg.reply(response.data.response);
        }
    } catch (error) {
        console.error('❌ Backend Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('👉 Make sure your Python backend is running on http://localhost:8000');
        }
    }
});


// Start the client
client.initialize();

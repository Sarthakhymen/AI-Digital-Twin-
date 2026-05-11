import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, PhoneOff, History, Sparkles, Volume2 } from 'lucide-react';
import axios from 'axios';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import { Room, RoomEvent, VideoPresets } from 'livekit-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const VoiceAgent = () => {
    const [status, setStatus] = useState('idle'); // idle, connecting, active, error
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [history, setHistory] = useState([]);
    const [room, setRoom] = useState(null);
    
    // Siri-like Orb Animation Variants
    const orbVariants = {
        idle: {
            scale: [1, 1.1, 1],
            opacity: 0.8,
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        },
        active: {
            scale: [1, 1.3, 1.1, 1.4, 1],
            opacity: 1,
            boxShadow: "0 0 50px rgba(99, 102, 241, 0.8)",
            transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
        },
        connecting: {
            rotate: 360,
            scale: [1, 0.8, 1],
            transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
        }
    };

    const startCall = async () => {
        setStatus('connecting');
        try {
            // 1. Get Token from backend
            const participantName = `User_${Math.floor(Math.random() * 1000)}`;
            const roomName = "VoiceRoom_1";
            
            const { data } = await axios.get(`${API_URL}/api/voice/token`, {
                params: { participant_name: participantName, room_name: roomName }
            });

            // 2. Connect to LiveKit Room
            const newRoom = new Room({
                adaptiveStream: true,
                dynacast: true,
            });

            await newRoom.connect(data.url, data.token);
            setRoom(newRoom);
            
            // 3. Enable Audio
            await newRoom.localParticipant.setMicrophoneEnabled(true);
            
            setStatus('active');
            setAiResponse("Connected! I'm listening...");

            // 4. Handle Audio Events
            newRoom.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
                // We can use this to animate the orb based on who is talking
            });

        } catch (err) {
            console.error("Call Error:", err);
            setStatus('error');
            setAiResponse("Could not connect to voice server.");
        }
    };

    const endCall = async () => {
        if (room) {
            await room.disconnect();
            setRoom(null);
        }
        setStatus('idle');
        setTranscript('');
        setAiResponse('');
    };

    return (
        <Box sx={{ 
            minHeight: 'calc(100vh - 80px)', 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 8,
            px: 2
        }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '60px' }}
            >
                <Typography variant="h3" fontWeight="800" sx={{ 
                    background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Voice AI Twin
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Real-time human-like conversation powered by Groq & LiveKit
                </Typography>
            </motion.div>

            {/* Siri-like Orb Container */}
            <Box sx={{ position: 'relative', mb: 12, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AnimatePresence>
                    {status !== 'idle' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 2, opacity: 0.2 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{
                                position: 'absolute',
                                width: '200px',
                                height: '200px',
                                borderRadius: '50%',
                                background: status === 'active' ? 'radial-gradient(circle, #6366f1, transparent)' : 'radial-gradient(circle, #9333ea, transparent)',
                                filter: 'blur(50px)',
                                zIndex: 0
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* The Orb */}
                <motion.div
                    variants={orbVariants}
                    animate={status === 'connecting' ? "connecting" : status === 'active' ? "active" : "idle"}
                    style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, #4f46e5, #312e81)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        zIndex: 1,
                        position: 'relative',
                        boxShadow: '0 0 40px rgba(79, 70, 229, 0.4)',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}
                    onClick={status === 'idle' ? startCall : endCall}
                >
                    {status === 'idle' ? (
                        <Mic color="white" size={60} />
                    ) : status === 'connecting' ? (
                        <Sparkles color="white" size={60} />
                    ) : (
                        <PhoneOff color="#ff4444" size={60} />
                    )}
                </motion.div>

                <Typography variant="h6" sx={{ 
                    position: 'absolute', 
                    bottom: '-60px', 
                    color: status === 'active' ? '#818cf8' : 'rgba(255,255,255,0.5)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                }}>
                    {status === 'idle' ? 'Start Conversation' : status === 'connecting' ? 'Connecting...' : 'On Call'}
                </Typography>
            </Box>

            {/* Live Feedback Area */}
            <Box sx={{ maxWidth: '600px', width: '100%', mb: 4 }}>
                <AnimatePresence mode="wait">
                    {status === 'active' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <Paper sx={{ 
                                p: 4, 
                                borderRadius: 5, 
                                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Volume2 className="animate-bounce" color="#818cf8" />
                                </Box>
                                <Typography variant="body1" sx={{ color: 'white', fontSize: '1.2rem', lineHeight: 1.6 }}>
                                    {aiResponse || "I'm ready to talk. Say something!"}
                                </Typography>
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Instruction for first use */}
            {status === 'idle' && (
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 4 }}>
                    Tap the orb to start a real-time voice session.
                </Typography>
            )}
        </Box>
    );
};

export default VoiceAgent;

export default VoiceAgent;

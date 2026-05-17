import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, IconButton, Alert, AlertTitle, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, PhoneOff, Sparkles, Volume2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Room, RoomEvent, VideoPresets } from 'livekit-client';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const VoiceAgent = () => {
    const { user, userFeatures } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useState(new URLSearchParams(window.location.search));
    const isWidget = searchParams.get('widget') === 'true';
    const [status, setStatus] = useState('idle'); // idle, connecting, active, error
    const [aiResponse, setAiResponse] = useState('');
    const roomRef = useRef(null);

    const isLocked = !userFeatures?.voice_agent;
    const isExpired = user?.subscription_status === 'expired';

    const orbVariants = {
        idle: {
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        },
        connecting: {
            scale: [1, 1.2, 1],
            rotate: 360,
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
        },
        active: {
            scale: [1, 1.1, 0.9, 1.1, 1],
            transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const startCall = async () => {
        if ((isExpired || isLocked) && !isWidget) return;

        setStatus('connecting');
        try {
            const tokenResponse = await axios.get(`${API_URL}/api/voice/token`, {
                params: {
                    participant_name: user?.full_name || 'Guest User',
                    room_name: `room-${user?.id || 'guest'}`
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const { token, url } = tokenResponse.data;
            const room = new Room({
                adaptiveStream: true,
                dynacast: true,
                videoCaptureDefaults: {
                    resolution: VideoPresets.h720.resolution,
                },
            });

            roomRef.current = room;

            room.on(RoomEvent.ParticipantConnected, (participant) => {
                console.log('Participant connected:', participant.identity);
            });

            room.on(RoomEvent.Disconnected, () => {
                setStatus('idle');
                roomRef.current = null;
            });

            room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
                // Potential visualization logic
            });

            await room.connect(url, token);
            await room.localParticipant.setMicrophoneEnabled(true);
            
            setStatus('active');
        } catch (error) {
            console.error('Failed to start call:', error);
            setStatus('idle');
            alert('Could not connect to Voice AI. Please check your microphone permissions and try again.');
        }
    };

    const endCall = async () => {
        if (roomRef.current) {
            await roomRef.current.disconnect();
            roomRef.current = null;
        }
        setStatus('idle');
    };

    useEffect(() => {
        return () => {
            if (roomRef.current) {
                roomRef.current.disconnect();
            }
        };
    }, []);

    if (!isWidget && !user) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10, px: 4 }}>
                <Box sx={{
                    p: 4, textAlign: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '20px',
                    backdropFilter: 'blur(10px)',
                    maxWidth: 360
                }}>
                    <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', mb: 1.5 }}>Login Required</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>Please login to use the Voice AI Twin.</Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/login')}
                        sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', textTransform: 'none', borderRadius: '10px', fontFamily: '"Outfit", sans-serif' }}
                    >
                        Login Now
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 4,
            pb: 8,
        }}>
            {(isExpired || isLocked) && !isWidget && (
                <Box sx={{ maxWidth: '600px', width: '100%', mb: 4 }}>
                    <Alert
                        severity={isExpired ? 'error' : 'warning'}
                        sx={{
                            borderRadius: '14px',
                            background: isExpired ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                            border: `1px solid ${isExpired ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                            color: 'white',
                            '& .MuiAlert-icon': { color: isExpired ? '#EF4444' : '#F59E0B' }
                        }}
                    >
                        <AlertTitle sx={{ color: isExpired ? '#EF4444' : '#F59E0B', fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
                            {isExpired ? 'Subscription Expired' : 'Feature Locked'}
                        </AlertTitle>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
                            {isExpired
                                ? 'Your trial or subscription has expired. Please upgrade to Pro to continue using Voice AI.'
                                : 'Voice AI is a Pro feature. Upgrade your plan to unlock real-time human-like voice conversations.'
                            }
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                background: isExpired ? '#EF4444' : '#F59E0B',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontFamily: '"Outfit", sans-serif',
                                borderRadius: '8px',
                                '&:hover': { filter: 'brightness(1.1)' }
                            }}
                            onClick={() => navigate('/pricing')}
                        >
                            Upgrade Now
                        </Button>
                    </Alert>
                </Box>
            )}
            
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '52px', filter: (isExpired || isLocked) && !isWidget ? 'blur(4px)' : 'none' }}
            >
                <Typography variant="h3" fontWeight="800" sx={{
                    fontFamily: '"Outfit", sans-serif',
                    background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Voice AI Twin
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Outfit", sans-serif' }}>
                    Real-time human-like conversation powered by Groq &amp; LiveKit
                </Typography>
            </motion.div>

            {/* Siri-like Orb Container */}
            <Box sx={{ 
                position: 'relative', 
                mb: 12, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                filter: (isExpired || isLocked) && !isWidget ? 'blur(8px) grayscale(1)' : 'none',
                pointerEvents: (isExpired || isLocked) && !isWidget ? 'none' : 'auto'
            }}>
                <AnimatePresence>
                    {status !== 'idle' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 2.2, opacity: [0.1, 0.2, 0.1] }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity }}
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
                            <Box sx={{
                                p: 4,
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.04)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                textAlign: 'center'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Volume2 color="#818cf8" />
                                </Box>
                                <Typography variant="body1" sx={{ color: 'white', fontSize: '1.1rem', lineHeight: 1.6, fontFamily: '"Outfit", sans-serif' }}>
                                    {aiResponse || 'Listening for your voice...'}
                                </Typography>
                            </Box>
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

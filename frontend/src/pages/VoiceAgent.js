import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Square, MessageSquare, History, Sparkles } from 'lucide-react';
import axios from 'axios';
import { Box, Typography, IconButton, Paper, Avatar } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const VoiceAgent = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [history, setHistory] = useState([]);
    
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Siri-like Orb Animation Variants
    const orbVariants = {
        idle: {
            scale: [1, 1.1, 1],
            opacity: 0.8,
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        },
        recording: {
            scale: [1, 1.3, 1.1, 1.4, 1],
            opacity: 1,
            boxShadow: "0 0 40px rgba(99, 102, 241, 0.6)",
            transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
        },
        processing: {
            rotate: 360,
            scale: [1, 0.9, 1],
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await sendAudioToBackend(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTranscript('Listening...');
            setAiResponse('');
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Please allow microphone access to use the voice agent.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);
            
            // Stop all tracks in the stream
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const sendAudioToBackend = async (audioBlob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice.webm');

        try {
            const response = await axios.post(`${API_URL}/api/v1/process-voice`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { transcript, ai_response, audio_base64 } = response.data;
            
            setTranscript(transcript);
            setAiResponse(ai_response);
            setHistory(prev => [{ type: 'user', text: transcript }, { type: 'ai', text: ai_response }, ...prev]);
            
            // Play AI Audio
            const audio = new Audio(`data:audio/mp3;base64,${audio_base64}`);
            audio.play();
            
        } catch (err) {
            console.error("Error processing voice:", err);
            setAiResponse("Sorry, I encountered an error. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: 'calc(100vh - 80px)', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 8,
            px: 2
        }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '40px' }}
            >
                <Typography variant="h3" fontWeight="800" sx={{ 
                    background: 'linear-gradient(90deg, #4f46e5, #9333ea)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Aura Voice Assistant
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Your premium AI twin in real-time. Just talk.
                </Typography>
            </motion.div>

            {/* Siri-like Orb Container */}
            <Box sx={{ position: 'relative', mb: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Background Glow */}
                <AnimatePresence>
                    {(isRecording || isProcessing) && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0.3 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{
                                position: 'absolute',
                                width: '200px',
                                height: '200px',
                                borderRadius: '50%',
                                background: isProcessing ? 'linear-gradient(to right, #9333ea, #ec4899)' : 'linear-gradient(to right, #6366f1, #a855f7)',
                                filter: 'blur(40px)',
                                zIndex: 0
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* The Orb */}
                <motion.div
                    variants={orbVariants}
                    animate={isProcessing ? "processing" : isRecording ? "recording" : "idle"}
                    style={{
                        width: '160px',
                        height: '160px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, #6366f1, #4338ca)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        zIndex: 1,
                        position: 'relative',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}
                    onClick={isRecording ? stopRecording : startRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isRecording ? (
                        <Square color="white" size={48} />
                    ) : isProcessing ? (
                        <Sparkles color="white" size={48} className="animate-pulse" />
                    ) : (
                        <Mic color="white" size={48} />
                    )}
                </motion.div>

                <Typography variant="caption" sx={{ 
                    position: 'absolute', 
                    bottom: '-40px', 
                    color: isRecording ? '#ef4444' : 'text.secondary',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Tap to Speak'}
                </Typography>
            </Box>

            {/* Transcript & Response Area */}
            <Box sx={{ maxWidth: '600px', w: '100%', mb: 4 }}>
                <AnimatePresence mode="wait">
                    {(transcript || aiResponse) && (
                        <motion.div
                            key="status-area"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Paper elevation={0} sx={{ 
                                p: 3, 
                                borderRadius: 4, 
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                mb: 4
                            }}>
                                {transcript && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="primary" fontWeight="700">YOU SAID</Typography>
                                        <Typography variant="body1" fontWeight="500">{transcript}</Typography>
                                    </Box>
                                )}
                                {aiResponse && (
                                    <Box>
                                        <Typography variant="caption" color="secondary" fontWeight="700">AURA REPLIED</Typography>
                                        <Typography variant="body1" sx={{ color: '#1e293b', lineHeight: 1.6 }}>{aiResponse}</Typography>
                                    </Box>
                                )}
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* History Section */}
            {history.length > 0 && (
                <Box sx={{ maxWidth: '800px', w: '100%', px: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <History size={20} /> Recent Conversation
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {history.slice(0, 6).map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Paper elevation={0} sx={{ 
                                    p: 2, 
                                    borderRadius: 3, 
                                    maxWidth: '80%',
                                    alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                    ml: msg.type === 'user' ? 'auto' : 0,
                                    backgroundColor: msg.type === 'user' ? '#4f46e5' : 'white',
                                    color: msg.type === 'user' ? 'white' : 'text.primary',
                                    border: msg.type === 'ai' ? '1px solid #e2e8f0' : 'none'
                                }}>
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Paper>
                            </motion.div>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default VoiceAgent;

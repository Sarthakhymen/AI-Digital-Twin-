import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, Alert } from '@mui/material';
import { WhatsApp, CheckCircle, Sync, ErrorOutline } from '@mui/icons-material';
import { io } from 'socket.io-client';
import api from '../services/api';

const BRIDGE_URL = process.env.REACT_APP_WHATSAPP_BRIDGE_URL || 'http://localhost:3001';

const WhatsAppScanner = ({ twinId }) => {
  const [qr, setQr] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, connecting, qr, ready, error
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get current user ID to manage their specific session
    api.get('/auth/me').then(res => {
      setUserId(res.data.id);
    }).catch(err => console.error("Auth error", err));
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = io(BRIDGE_URL);

    socket.on('connect', () => {
      console.log("Connected to WhatsApp Bridge");
      // Request a connection for this user
      api.post(`${BRIDGE_URL}/connect`, { userId: String(userId) })
        .then(() => setStatus('connecting'))
        .catch(() => setStatus('error'));
    });

    socket.on('qr', (data) => {
      if (data.userId === String(userId)) {
        setQr(data.qr);
        setStatus('qr');
      }
    });

    socket.on('ready', (data) => {
      if (data.userId === String(userId)) {
        setStatus('ready');
        setQr(null);
      }
    });

    socket.on('disconnect', () => {
      console.log("Disconnected from bridge");
    });

    return () => socket.disconnect();
  }, [userId]);

  const getStatusDisplay = () => {
    switch (status) {
      case 'connecting':
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CircularProgress size={24} sx={{ mb: 1 }} />
            <Typography variant="body2">Connecting to WhatsApp service...</Typography>
          </Box>
        );
      case 'qr':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              Scan this QR with your WhatsApp
            </Typography>
            <Box 
              component="img" 
              src={qr} 
              alt="WhatsApp QR Code" 
              sx={{ width: 200, height: 200, p: 1, bgcolor: 'white', borderRadius: 2, boxShadow: 1, mb: 1 }} 
            />
            <Typography variant="caption" display="block" color="text.secondary">
              Open WhatsApp > Linked Devices > Link a Device
            </Typography>
          </Box>
        );
      case 'ready':
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircle sx={{ fontSize: 48, color: '#25D366', mb: 1 }} />
            <Typography variant="h6" color="#25D366" sx={{ fontWeight: 600 }}>
              WhatsApp Connected!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your AI Digital Twin is now live on WhatsApp.
            </Typography>
            <Button 
              size="small" 
              variant="outlined" 
              color="error" 
              sx={{ mt: 2, borderRadius: 10 }}
              onClick={() => setStatus('idle')} // In a real app, this would call logout
            >
              Disconnect
            </Button>
          </Box>
        );
      case 'error':
        return (
          <Alert severity="error" icon={<ErrorOutline />} sx={{ borderRadius: 2 }}>
            Bridge service is offline. Please try again later.
          </Alert>
        );
      default:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <WhatsApp sx={{ fontSize: 40, color: '#25D366', mb: 1, opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Initialize connection to generate QR code.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Sync />}
              onClick={() => setUserId(userId)} // Trigger reconnect
              sx={{ mt: 1, bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' } }}
            >
              Connect WhatsApp
            </Button>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          bgcolor: 'rgba(37, 211, 102, 0.05)', 
          borderRadius: 3, 
          border: '1px solid rgba(37, 211, 102, 0.2)',
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {getStatusDisplay()}
      </Paper>
    </Box>
  );
};

export default WhatsAppScanner;

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, Alert } from '@mui/material';
import { WhatsApp, CheckCircle, Sync, ErrorOutline } from '@mui/icons-material';
import api from '../services/api';
import axios from 'axios';

const BRIDGE_URL = process.env.REACT_APP_WHATSAPP_BRIDGE_URL || process.env.REACT_APP_WHATSAPP_SERVICE_URL || 'https://sarthak5481-ai-digital-twin2.hf.space';

const WhatsAppScanner = ({ twinId }) => {
  const [qr, setQr] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, connecting, qr, ready, error
  const [userId, setUserId] = useState(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    // Get current user ID
    api.get('/auth/me').then(res => {
      setUserId(res.data.id);
    }).catch(err => console.error("Auth error", err));

    // Cleanup polling on unmount
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const startPolling = (uid) => {
    // Clear any existing polling
    if (pollingRef.current) clearInterval(pollingRef.current);

    // Poll every 2 seconds for QR code / status updates
    pollingRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${BRIDGE_URL}/qr/${uid}`);
        const data = res.data;

        if (data.status === 'qr' && data.qr) {
          setQr(data.qr);
          setStatus('qr');
        } else if (data.status === 'ready') {
          setQr(null);
          setStatus('ready');
          // Stop polling once connected
          if (pollingRef.current) clearInterval(pollingRef.current);
        } else if (data.status === 'connecting') {
          setStatus('connecting');
        }
      } catch (err) {
        console.error('Polling error:', err.message);
        // Don't immediately show error - bridge might be waking up
      }
    }, 2000);
  };

  const handleConnect = async () => {
    if (!userId) return;
    
    setStatus('connecting');
    const uid = String(userId);
    // Fire-and-forget: don't wait for POST to complete
    axios.post(`${BRIDGE_URL}/connect`, { userId: uid }).catch(err => {
      console.error('Connect error:', err.message);
    });
    // Start polling immediately for QR code
    startPolling(uid);
  };

  const handleDisconnect = async () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    try {
      await axios.post(`${BRIDGE_URL}/disconnect`, { userId: String(userId) });
    } catch(e) {}
    setStatus('idle');
    setQr(null);
  };

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
              Open WhatsApp &gt; Linked Devices &gt; Link a Device
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
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </Box>
        );
      case 'error':
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Alert severity="error" icon={<ErrorOutline />} sx={{ borderRadius: 2, mb: 2 }}>
              Bridge service is waking up or offline. Please try again.
            </Alert>
            <Button 
              variant="contained" 
              startIcon={<Sync />}
              onClick={handleConnect}
              sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' } }}
            >
              Retry Connection
            </Button>
          </Box>
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
              onClick={handleConnect}
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

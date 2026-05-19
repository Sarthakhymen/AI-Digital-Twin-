import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, Alert } from '@mui/material';
import { WhatsApp, CheckCircle, Sync, ErrorOutline } from '@mui/icons-material';
import api from '../services/api';
import axios from 'axios';

const BRIDGE_URL = process.env.REACT_APP_WHATSAPP_BRIDGE_URL || process.env.REACT_APP_WHATSAPP_SERVICE_URL || 'https://whatsapp-bridge-4w1c.onrender.com';

const WhatsAppScanner = ({ twinId }) => {
  const [qr, setQr] = useState(null);
  const [qrVisible, setQrVisible] = useState(true); // for fade animation
  const [status, setStatus] = useState('idle');
  const [userId, setUserId] = useState(null);
  const pollingRef = useRef(null);
  const lastQrRef = useRef(null); // track last QR to avoid unnecessary re-renders

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
    if (pollingRef.current) clearInterval(pollingRef.current);

    let attempts = 0;
    let qrPauseTimeout = null; // pause timer when QR is shown

    const doPoll = async () => {
      try {
        const res = await axios.get(`${BRIDGE_URL}/qr/${uid}`, { timeout: 10000 });
        const data = res.data;

        if (data.status === 'qr' && data.qr) {
          // Only update if QR actually changed
          if (data.qr !== lastQrRef.current) {
            lastQrRef.current = data.qr;
            setQrVisible(false);
            setTimeout(() => {
              setQr(data.qr);
              setQrVisible(true);
            }, 200);
          }
          setStatus('qr');
          attempts = 0;

          // ✅ PAUSE POLLING for 18 seconds — user ko scan karne ka time do!
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (qrPauseTimeout) clearTimeout(qrPauseTimeout);
          qrPauseTimeout = setTimeout(() => {
            // 18 sec baad resume — check karo connected hua ya naya QR chahiye
            pollingRef.current = setInterval(doPoll, 5000);
          }, 18000);

        } else if (data.status === 'ready') {
          setQr(null);
          setStatus('ready');
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (qrPauseTimeout) clearTimeout(qrPauseTimeout);
        } else if (data.status === 'connecting' || data.status === 'idle') {
          setStatus('connecting');
          attempts++;
          if (attempts > 45) {
            setStatus('error');
            if (pollingRef.current) clearInterval(pollingRef.current);
          }
        }
      } catch (err) {
        console.error('Polling error:', err.message);
        attempts++;
        if (attempts > 30) {
          setStatus('error');
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      }
    };

    // Start polling every 5 seconds until QR is received
    pollingRef.current = setInterval(doPoll, 5000);
    doPoll(); // immediate first call
  };

  const handleConnect = async () => {
    if (!userId) return;
    
    setStatus('connecting');
    const uid = String(userId);
    
    try {
      // Wait for the connect request to succeed before polling
      await axios.post(`${BRIDGE_URL}/connect`, { userId: uid });
      startPolling(uid);
    } catch (err) {
      console.error('Connect error:', err.message);
      // If the POST fails (e.g. 502 from Render waking up), we can still try to poll just in case it woke up and processed it,
      // but it's safer to just show the error and ask them to retry.
      startPolling(uid); // Keep polling anyway, because render might be waking up!
    }
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
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Connecting to WhatsApp service...</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Waking up secure bridge. This may take up to 60 seconds if the service is asleep. Please wait.
            </Typography>
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
              sx={{ 
                width: 200, height: 200, p: 1, bgcolor: 'white', borderRadius: 2, boxShadow: 1, mb: 1,
                opacity: qrVisible ? 1 : 0,
                transition: 'opacity 0.2s ease-in-out'
              }} 
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

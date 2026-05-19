import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, Alert, TextField, Tabs, Tab } from '@mui/material';
import { WhatsApp, CheckCircle, Sync, ErrorOutline, PhoneAndroid, QrCode2 } from '@mui/icons-material';
import api from '../services/api';
import axios from 'axios';

const BRIDGE_URL = process.env.REACT_APP_WHATSAPP_BRIDGE_URL || process.env.REACT_APP_WHATSAPP_SERVICE_URL || 'https://whatsapp-bridge-4w1c.onrender.com';

const WhatsAppScanner = ({ twinId }) => {
  const [qr, setQr] = useState(null);
  const [qrVisible, setQrVisible] = useState(true);
  const [status, setStatus] = useState('idle');
  const [userId, setUserId] = useState(null);
  const [tab, setTab] = useState(0); // 0 = pairing code, 1 = QR
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pairingCode, setPairingCode] = useState(null);
  const pollingRef = useRef(null);
  const lastQrRef = useRef(null);

  useEffect(() => {
    api.get('/auth/me').then(res => {
      setUserId(res.data.id);
    }).catch(err => console.error("Auth error", err));

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // ============ PAIRING CODE METHOD ============
  const handlePairConnect = async () => {
    if (!userId || !phoneNumber.trim()) return;
    
    setStatus('connecting');
    setPairingCode(null);
    const uid = String(userId);
    const cleanPhone = phoneNumber.replace(/[\s\-\+]/g, '');
    
    try {
      // Clear old sessions first
      await axios.post(`${BRIDGE_URL}/clear-session`, { userId: uid }).catch(() => {});
      
      // Start pairing
      await axios.post(`${BRIDGE_URL}/pair`, { userId: uid, phoneNumber: cleanPhone });
      
      // Poll for pairing code
      startPairingPoll(uid);
    } catch (err) {
      console.error('Pair connect error:', err.message);
      startPairingPoll(uid);
    }
  };

  const startPairingPoll = (uid) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    let attempts = 0;

    const doPoll = async () => {
      try {
        const res = await axios.get(`${BRIDGE_URL}/pair-status/${uid}`, { timeout: 10000 });
        const data = res.data;

        if (data.status === 'pairing' && data.code) {
          // Format code: XXXX-XXXX
          const formatted = data.code.length === 8 
            ? `${data.code.slice(0,4)}-${data.code.slice(4)}` 
            : data.code;
          setPairingCode(formatted);
          setStatus('pairing');
          attempts = 0;
        } else if (data.status === 'ready') {
          setPairingCode(null);
          setStatus('ready');
          if (pollingRef.current) clearInterval(pollingRef.current);
        } else if (data.status === 'connecting') {
          setStatus('connecting');
          attempts++;
          if (attempts > 40) {
            setStatus('error');
            if (pollingRef.current) clearInterval(pollingRef.current);
          }
        }
      } catch (err) {
        attempts++;
        if (attempts > 30) {
          setStatus('error');
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      }
    };

    pollingRef.current = setInterval(doPoll, 3000);
    doPoll();
  };

  // ============ QR CODE METHOD ============
  const startPolling = (uid) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    let attempts = 0;
    let qrPauseTimeout = null;

    const doPoll = async () => {
      try {
        const res = await axios.get(`${BRIDGE_URL}/qr/${uid}`, { timeout: 10000 });
        const data = res.data;

        if (data.status === 'qr' && data.qr) {
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
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (qrPauseTimeout) clearTimeout(qrPauseTimeout);
          qrPauseTimeout = setTimeout(() => {
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
        attempts++;
        if (attempts > 30) {
          setStatus('error');
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      }
    };

    pollingRef.current = setInterval(doPoll, 5000);
    doPoll();
  };

  const handleConnect = async () => {
    if (!userId) return;
    setStatus('connecting');
    const uid = String(userId);
    try {
      await axios.post(`${BRIDGE_URL}/connect`, { userId: uid });
      startPolling(uid);
    } catch (err) {
      startPolling(uid);
    }
  };

  const handleDisconnect = async () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    try {
      await axios.post(`${BRIDGE_URL}/disconnect`, { userId: String(userId) });
    } catch(e) {}
    setStatus('idle');
    setQr(null);
    setPairingCode(null);
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'connecting':
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CircularProgress size={24} sx={{ mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Connecting to WhatsApp service...</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Waking up secure bridge. This may take up to 60 seconds. Please wait.
            </Typography>
          </Box>
        );

      case 'pairing':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              Enter this code in WhatsApp
            </Typography>
            <Box sx={{
              py: 2, px: 4, my: 2, mx: 'auto',
              bgcolor: '#1a1a2e', borderRadius: 3,
              border: '2px solid #25D366',
              display: 'inline-block',
              boxShadow: '0 0 20px rgba(37,211,102,0.15)'
            }}>
              <Typography variant="h3" sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontWeight: 700,
                color: '#25D366',
                letterSpacing: 6,
                fontSize: { xs: '2rem', sm: '2.5rem' }
              }}>
                {pairingCode}
              </Typography>
            </Box>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              WhatsApp → Settings → Linked Devices → Link a Device → Link with phone number instead
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5, fontWeight: 600 }}>
              Enter the code shown above when prompted
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
              size="small" variant="outlined" color="error" 
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
              variant="contained" startIcon={<Sync />}
              onClick={tab === 0 ? handlePairConnect : handleConnect}
              sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' } }}
            >
              Retry Connection
            </Button>
          </Box>
        );

      default:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {tab === 0 ? (
              // Pairing Code Tab
              <Box>
                <PhoneAndroid sx={{ fontSize: 40, color: '#25D366', mb: 1, opacity: 0.7 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Enter your WhatsApp phone number with country code
                </Typography>
                <TextField
                  size="small"
                  placeholder="e.g. 919876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  sx={{ 
                    mb: 2, width: '100%', maxWidth: 280,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.05)'
                    }
                  }}
                  helperText="Country code + number (no + or spaces)"
                />
                <br />
                <Button 
                  variant="contained" startIcon={<PhoneAndroid />}
                  onClick={handlePairConnect}
                  disabled={!phoneNumber.trim()}
                  sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' }, borderRadius: 2 }}
                >
                  Get Pairing Code
                </Button>
              </Box>
            ) : (
              // QR Code Tab
              <Box>
                <WhatsApp sx={{ fontSize: 40, color: '#25D366', mb: 1, opacity: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Initialize connection to generate QR code.
                </Typography>
                <Button 
                  variant="contained" startIcon={<Sync />}
                  onClick={handleConnect}
                  sx={{ mt: 1, bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' } }}
                >
                  Connect via QR
                </Button>
              </Box>
            )}
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
        {/* Tab Switcher - only show when idle */}
        {(status === 'idle') && (
          <Tabs 
            value={tab} 
            onChange={(_, v) => setTab(v)}
            sx={{ 
              mb: 2, minHeight: 36,
              '& .MuiTab-root': { minHeight: 36, py: 0.5, fontSize: '0.8rem' }
            }}
          >
            <Tab icon={<PhoneAndroid sx={{ fontSize: 16 }} />} iconPosition="start" label="Pairing Code" />
            <Tab icon={<QrCode2 sx={{ fontSize: 16 }} />} iconPosition="start" label="QR Scan" />
          </Tabs>
        )}
        {getStatusDisplay()}
      </Paper>
    </Box>
  );
};

export default WhatsAppScanner;

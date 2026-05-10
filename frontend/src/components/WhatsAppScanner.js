import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert } from '@mui/material';
import { io } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import { WhatsApp, CheckCircle, Refresh } from '@mui/icons-material';

const WhatsAppScanner = ({ twinId }) => {
  const [qrCode, setQrCode] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Connect to our WhatsApp Bridge Service
    const socket = io(process.env.REACT_APP_WHATSAPP_SERVICE_URL || 'http://localhost:3001');

    socket.on('connect', () => {
      console.log('Connected to WhatsApp service');
      setIsLoading(false);
    });

    socket.on('qr', (qr) => {
      console.log('Received QR Code');
      setQrCode(qr);
      setIsConnected(false);
    });

    socket.on('ready', () => {
      console.log('WhatsApp is ready!');
      setIsConnected(true);
      setQrCode(null);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Could not connect to WhatsApp Service. Make sure it is running.');
      setIsLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box sx={{ mt: 2 }}>
      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Connecting to bridge service...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      ) : isConnected ? (
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd', borderRadius: 2, border: '1px solid #90caf9' }}>
          <CheckCircle sx={{ fontSize: 48, color: '#2e7d32', mb: 1 }} />
          <Typography variant="h6" color="primary">WhatsApp Connected!</Typography>
          <Typography variant="body2" color="text.secondary">
            Your Digital Twin is now live on your WhatsApp number.
          </Typography>
        </Paper>
      ) : qrCode ? (
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2, border: '1px dashed #ccc' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Step 4: Scan to Link WhatsApp
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'white', display: 'inline-block', borderRadius: 2, mb: 2 }}>
            <QRCodeSVG value={qrCode} size={200} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Open WhatsApp on your phone {'>'} Linked Devices {'>'} Link a Device
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />} 
            size="small"
            onClick={() => window.location.reload()}
          >
            Refresh QR
          </Button>
        </Paper>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <WhatsApp sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
          <Typography color="text.secondary">Waiting for QR Code...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default WhatsAppScanner;

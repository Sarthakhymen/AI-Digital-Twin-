import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { WhatsApp, Timer } from '@mui/icons-material';

const WhatsAppScanner = ({ twinId }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          bgcolor: 'rgba(37, 211, 102, 0.05)', 
          borderRadius: 3, 
          border: '1px dashed rgba(37, 211, 102, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Coming Soon Badge */}
        <Box sx={{ position: 'absolute', top: 20, right: -35, transform: 'rotate(45deg)', width: 150, zIndex: 1 }}>
          <Chip 
            label="COMING SOON" 
            color="success" 
            size="small" 
            sx={{ fontWeight: 'bold', fontSize: '10px', borderRadius: 0, width: '100%' }} 
          />
        </Box>

        <WhatsApp sx={{ fontSize: 48, color: '#25D366', mb: 2, opacity: 0.8 }} />
        
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          WhatsApp Integration
        </Typography>
        
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'white', 
            display: 'inline-block', 
            borderRadius: 2, 
            mb: 2, 
            position: 'relative',
            filter: 'blur(4px)',
            opacity: 0.3,
            userSelect: 'none'
          }}
        >
          {/* Dummy QR Code Pattern */}
          <Box sx={{ width: 160, height: 160, display: 'flex', flexWrap: 'wrap' }}>
            {Array.from({ length: 64 }).map((_, i) => (
              <Box 
                key={i} 
                sx={{ 
                  width: 20, height: 20, 
                  bgcolor: Math.random() > 0.5 ? '#000' : 'transparent' 
                }} 
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
          <Timer fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            We are working on a stable, 24/7 cloud connection for WhatsApp.
          </Typography>
        </Box>
        
        <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.disabled' }}>
          Expected Release: Next Update
        </Typography>
      </Paper>
    </Box>
  );
};

export default WhatsAppScanner;

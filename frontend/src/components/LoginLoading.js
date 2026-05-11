import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Backdrop } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AutoAwesome, Shield, Speed, CloudDone } from '@mui/icons-material';

const steps = [
  { message: "Securing your connection...", icon: <Shield sx={{ color: '#10B981' }} /> },
  { message: "Verifying credentials...", icon: <AutoAwesome sx={{ color: '#6366F1' }} /> },
  { message: "Optimizing AI engine...", icon: <Speed sx={{ color: '#F59E0B' }} /> },
  { message: "Launching Digital Twin...", icon: <CloudDone sx={{ color: '#3B82F6' }} /> }
];

const LoginLoading = ({ open }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (open) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setCurrentStep(0);
    }
  }, [open]);

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: '#fff',
        flexDirection: 'column',
        backdropFilter: 'blur(12px)',
        background: 'rgba(15, 23, 42, 0.9)'
      }}
    >
      <Box sx={{ 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        maxWidth: '300px'
      }}>
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Box sx={{ 
            position: 'relative', 
            display: 'inline-flex',
            mb: 4
          }}>
            <CircularProgress 
              size={80} 
              thickness={2} 
              sx={{ color: '#6366F1' }} 
            />
            <Box
              sx={{
                top: 0, left: 0, bottom: 0, right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AutoAwesome sx={{ fontSize: 32, color: '#818CF8' }} />
            </Box>
          </Box>
        </motion.div>

        <Box sx={{ height: '60px', position: 'relative', width: '100%', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px' 
              }}
            >
              {steps[currentStep].icon}
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                {steps[currentStep].message}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>
        
        <Typography variant="body2" sx={{ color: '#94A3B8', mt: 1 }}>
          Wait, we are logging you in...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoginLoading;

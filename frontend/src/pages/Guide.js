import React, { useState } from 'react';
import { 
  Box, Typography, Container, Button, Paper, 
  Grid
} from '@mui/material';
import { 
  Login, 
  Dashboard as DashboardIcon, 
  BusinessCenter, 
  SmartToy, 
  Bolt, 
  Code,
  ArrowForward,
  ArrowBack,
  Info
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const steps = [
  {
    title: 'Login & Signup',
    description: 'Sabse pehle apna account create karein ya login karein. Aap Google account se bhi turant sign-in kar sakte hain.',
    image: '/media_ad89a055-0077-490e-a948-07d7895bc0a5_1778465080036.png',
    icon: <Login />,
    color: '#6366F1'
  },
  {
    title: 'Dashboard Access',
    description: 'Login ke baad aap seedhe Dashboard pe aayenge, jo aapka control center hai.',
    image: null, // No specific image for dashboard general view requested, using a placeholder or icon
    icon: <DashboardIcon />,
    color: '#8B5CF6'
  },
  {
    title: 'Add Your Business',
    description: 'Business section mein jayein aur "+ ADD BUSINESS" button pe click karke apne business ki details fill karein.',
    image: '/media_ad89a055-0077-490e-a948-07d7895bc0a5_1778465080345.png',
    icon: <BusinessCenter />,
    color: '#EC4899'
  },
  {
    title: 'Create Digital Twin',
    description: 'Dashboard pe aakar "CREATE TWIN" button dabayein, apna business select karein aur required details bharein.',
    image: '/media_ad89a055-0077-490e-a948-07d7895bc0a5_1778465080645.png',
    icon: <SmartToy />,
    color: '#F59E0B'
  },
  {
    title: 'Activate & Train AI',
    description: 'Apne naye Digital Twin pe click karein, use "Activate" karein, aur page ke bottom mein training files (PDF/Docs) upload karein.',
    image: null,
    icon: <Bolt />,
    color: '#10B981'
  },
  {
    title: 'Copy & Paste Script',
    description: 'Ab apna unique script tag copy karein aur apni website ki HTML file mein <body> tag ke andar paste kar dein.',
    image: null,
    icon: <Code />,
    color: '#3B82F6'
  }
];

const BillboardStep = ({ step, index, active }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    style={{ width: '100%' }}
  >
    <Box sx={{ 
      p: 4, 
      borderRadius: '24px', 
      bgcolor: 'rgba(15, 23, 42, 0.8)', 
      border: `2px solid ${step.color}`,
      boxShadow: `0 0 20px ${step.color}44`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* LED Grid Effect Overlay */}
      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '10px 10px',
        pointerEvents: 'none'
      }} />

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={step.image ? 7 : 12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ 
              p: 1.5, borderRadius: '12px', bgcolor: `${step.color}22`, color: step.color,
              display: 'flex', border: `1px solid ${step.color}44`
            }}>
              {step.icon}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', textShadow: `0 0 10px ${step.color}` }}>
              {index + 1}. {step.title}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#CBD5E1', lineHeight: 1.6, mb: 4 }}>
            {step.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Paper sx={{ 
              p: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 2
            }}>
              <Info sx={{ color: step.color }} />
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                {index === 5 ? 'Copy the code from your Twin settings page.' : 'Required for optimal performance.'}
              </Typography>
            </Paper>
          </Box>
        </Grid>
        
        {step.image && (
          <Grid item xs={12} md={5}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ 
                p: 1, bgcolor: 'white', borderRadius: '16px', 
                boxShadow: `0 10px 30px ${step.color}33`,
                border: `4px solid ${step.color}`
              }}>
                <img 
                  src={step.image} 
                  alt={step.title} 
                  style={{ width: '100%', borderRadius: '8px', display: 'block' }} 
                />
              </Box>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </Box>
  </motion.div>
);

const Guide = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <Box sx={{ 
      bgcolor: '#020617', 
      minHeight: '100vh', 
      color: 'white',
      backgroundImage: 'linear-gradient(to bottom, #020617, #0F172A)',
      pb: 10
    }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ pt: 15 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Typography variant="h2" sx={{ 
              fontWeight: 900, 
              mb: 2, 
              letterSpacing: -2,
              background: 'linear-gradient(to right, #6366F1, #EC4899, #F59E0B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.3))'
            }}>
              STEP-BY-STEP WORKFLOW
            </Typography>
            <Typography variant="h6" sx={{ color: '#94A3B8', maxWidth: 600, mx: 'auto' }}>
              Follow this LED guide to integrate your AI Digital Twin into your website in minutes.
            </Typography>
          </motion.div>
        </Box>

        {/* LED Progress Bar */}
        <Box sx={{ mb: 6, display: 'flex', gap: 1, justifyContent: 'center' }}>
          {steps.map((_, idx) => (
            <Box 
              key={idx}
              sx={{ 
                width: 40, height: 8, borderRadius: 4, 
                bgcolor: idx <= currentStep ? steps[currentStep].color : 'rgba(255,255,255,0.1)',
                boxShadow: idx <= currentStep ? `0 0 10px ${steps[currentStep].color}` : 'none',
                transition: 'all 0.4s ease'
              }}
            />
          ))}
        </Box>

        {/* Billboard Container */}
        <Box sx={{ minHeight: 450, display: 'flex', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            <BillboardStep 
              key={currentStep} 
              step={steps[currentStep]} 
              index={currentStep}
            />
          </AnimatePresence>
        </Box>

        {/* Controls */}
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={prevStep}
            disabled={currentStep === 0}
            sx={{ 
              color: 'white', borderColor: 'rgba(255,255,255,0.2)', px: 4, py: 1.5,
              borderRadius: '100px', textTransform: 'none', fontWeight: 700,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'white' }
            }}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            endIcon={currentStep === steps.length - 1 ? <Bolt /> : <ArrowForward />}
            onClick={nextStep}
            variant="contained"
            sx={{ 
              bgcolor: steps[currentStep].color, px: 6, py: 1.5,
              borderRadius: '100px', textTransform: 'none', fontWeight: 800,
              boxShadow: `0 0 20px ${steps[currentStep].color}88`,
              '&:hover': { bgcolor: steps[currentStep].color, filter: 'brightness(1.1)' }
            }}
          >
            {currentStep === steps.length - 1 ? 'Start Launching' : 'Next Step'}
          </Button>
        </Box>

        {/* Script Preview at the end */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '60px' }}
          >
            <Box sx={{ 
              p: 4, borderRadius: '32px', bgcolor: 'black', border: '1px solid #10B981',
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.1)'
            }}>
              <Typography variant="h5" sx={{ color: '#10B981', fontWeight: 900, mb: 3 }}>
                Example Script Integration
              </Typography>
              <Paper sx={{ 
                p: 3, bgcolor: '#0F172A', fontFamily: 'monospace', color: '#CBD5E1',
                borderRadius: '16px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <code style={{ color: '#F472B6' }}>&lt;!DOCTYPE html&gt;</code><br />
                <code>&lt;html&gt;</code><br />
                <code>  &lt;body&gt;</code><br />
                <code>    &lt;h1&gt;Welcome to My Site&lt;/h1&gt;</code><br />
                <code style={{ color: '#10B981' }}>    &lt;!-- Copy paste below this --&gt;</code><br />
                <code style={{ color: '#F59E0B' }}>    &lt;script src="https://api.digitaltwin.ai/widget.js" data-id="YOUR_ID"&gt;&lt;/script&gt;</code><br />
                <code>  &lt;/body&gt;</code><br />
                <code>&lt;/html&gt;</code>
              </Paper>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default Guide;

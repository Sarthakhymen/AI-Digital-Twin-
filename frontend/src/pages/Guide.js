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

// --- Interactive Animations Components ---
const SmartphoneFrame = ({ children, color }) => (
  <Box sx={{
    width: '100%',
    maxWidth: 260,
    height: 480,
    margin: '0 auto',
    bgcolor: '#0f172a',
    borderRadius: '36px',
    border: `8px solid #1e293b`,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0 0 40px ${color}44`,
  }}>
    <Box sx={{
      position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
      width: '40%', height: 24, bgcolor: '#1e293b',
      borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: 10
    }} />
    <Box sx={{ p: 3, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {children}
    </Box>
  </Box>
);

const Step1Anim = () => (
  <SmartphoneFrame color="#6366F1">
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: '#6366F1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Login sx={{ color: 'white' }} />
      </motion.div>
      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>Welcome Back</Typography>
      <Box sx={{ width: '100%', mt: 2 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} style={{ height: 36, background: '#334155', borderRadius: 8, marginBottom: 12 }} />
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} style={{ height: 36, background: '#334155', borderRadius: 8, marginBottom: 20 }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }} style={{ height: 40, background: '#6366F1', borderRadius: 20 }} />
      </Box>
    </Box>
  </SmartphoneFrame>
);

const Step2Anim = () => (
  <SmartphoneFrame color="#8B5CF6">
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Dashboard</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <motion.div initial={{ height: 0 }} animate={{ height: 60 }} style={{ flex: 1, background: '#8B5CF6', borderRadius: 8 }} />
        <motion.div initial={{ height: 0 }} animate={{ height: 40 }} transition={{ delay: 0.2 }} style={{ flex: 1, background: '#334155', borderRadius: 8 }} />
        <motion.div initial={{ height: 0 }} animate={{ height: 80 }} transition={{ delay: 0.3 }} style={{ flex: 1, background: '#334155', borderRadius: 8 }} />
      </Box>
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ height: 70, background: '#1e293b', borderRadius: 12, border: '1px solid #334155' }} />
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} style={{ height: 70, background: '#1e293b', borderRadius: 12, border: '1px solid #334155' }} />
    </Box>
  </SmartphoneFrame>
);

const Step3Anim = () => (
  <SmartphoneFrame color="#EC4899">
    <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ height: 90, background: '#1e293b', borderRadius: 16, border: '2px dashed #EC4899', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BusinessCenter sx={{ color: '#EC4899', fontSize: 36 }} />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ height: 16, width: '60%', background: '#334155', borderRadius: 4, margin: '0 auto' }} />
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }} style={{ marginTop: 'auto', height: 40, background: '#EC4899', borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: 12 }}>+ ADD BUSINESS</motion.div>
    </Box>
  </SmartphoneFrame>
);

const Step4Anim = () => (
  <SmartphoneFrame color="#F59E0B">
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} style={{ background: '#334155', p: 2, borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SmartToy sx={{ color: '#F59E0B', fontSize: 50 }} />
      </motion.div>
      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>Generating Twin...</Typography>
      <Box sx={{ width: '100%', height: 6, background: '#334155', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, repeat: Infinity }} style={{ height: '100%', background: '#F59E0B' }} />
      </Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} style={{ width: '100%', height: 40, background: '#1e293b', borderRadius: 8, border: '1px solid #334155' }} />
    </Box>
  </SmartphoneFrame>
);

const Step5Anim = () => (
  <SmartphoneFrame color="#10B981">
    <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <Bolt sx={{ color: '#10B981', fontSize: 60 }} />
        </motion.div>
      </Box>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} style={{ padding: 12, background: '#1e293b', borderRadius: 12 }}>
         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Box style={{ width: 24, height: 24, background: '#10B981', borderRadius: 4 }} />
            <Box style={{ height: 24, flex: 1, background: '#334155', borderRadius: 4 }} />
         </Box>
         <Box style={{ height: 8, width: '100%', background: '#334155', borderRadius: 2 }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ marginTop: 8 }}>
         <Box style={{ height: 40, width: '100%', background: '#10B981', borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#020617', fontSize: 12, fontWeight: 'bold' }}>TRAINING COMPLETE</Box>
      </motion.div>
    </Box>
  </SmartphoneFrame>
);

const Step6Anim = () => (
  <SmartphoneFrame color="#3B82F6">
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 16, background: '#1e293b', borderRadius: 8, border: '1px solid #334155' }}>
        <Typography variant="caption" sx={{ color: '#3B82F6', fontFamily: 'monospace', wordBreak: 'break-all' }}>&lt;script src="twin.js"&gt;&lt;/script&gt;</Typography>
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 0.95, 1], backgroundColor: ['#3B82F6', '#2563EB', '#3B82F6'] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ height: 40, borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: 12, cursor: 'pointer' }}
      >
        COPY SCRIPT
      </motion.div>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
          <Code sx={{ color: '#3B82F6', fontSize: 50, opacity: 0.5 }} />
        </motion.div>
      </Box>
    </Box>
  </SmartphoneFrame>
);


const steps = [
  {
    title: 'Login & Signup',
    description: 'Sabse pehle apna account create karein ya login karein. Aap Google account se bhi turant sign-in kar sakte hain.',
    animation: <Step1Anim />,
    icon: <Login />,
    color: '#6366F1'
  },
  {
    title: 'Dashboard Access',
    description: 'Login ke baad aap seedhe Dashboard pe aayenge, jo aapka control center hai.',
    animation: <Step2Anim />,
    icon: <DashboardIcon />,
    color: '#8B5CF6'
  },
  {
    title: 'Add Your Business',
    description: 'Business section mein jayein aur "+ ADD BUSINESS" button pe click karke apne business ki details fill karein.',
    animation: <Step3Anim />,
    icon: <BusinessCenter />,
    color: '#EC4899'
  },
  {
    title: 'Create Digital Twin',
    description: 'Dashboard pe aakar "CREATE TWIN" button dabayein, apna business select karein aur required details bharein.',
    animation: <Step4Anim />,
    icon: <SmartToy />,
    color: '#F59E0B'
  },
  {
    title: 'Activate & Train AI',
    description: 'Apne naye Digital Twin pe click karein, use "Activate" karein, aur page ke bottom mein training files (PDF/Docs) upload karein.',
    animation: <Step5Anim />,
    icon: <Bolt />,
    color: '#10B981'
  },
  {
    title: 'Copy & Paste Script',
    description: 'Ab apna unique script tag copy karein aur apni website ki HTML file mein <body> tag ke andar paste kar dein.',
    animation: <Step6Anim />,
    icon: <Code />,
    color: '#3B82F6'
  }
];

const BillboardStep = ({ step, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
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
        <Grid item xs={12} md={7}>
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
        
        {/* Dynamic Animation Widget instead of Image */}
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {step.animation}
          </motion.div>
        </Grid>
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
        <Box sx={{ mb: 6, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {steps.map((_, idx) => (
            <Box 
              key={idx}
              onClick={() => setCurrentStep(idx)}
              sx={{ 
                width: 40, height: 8, borderRadius: 4, cursor: 'pointer',
                bgcolor: idx <= currentStep ? steps[idx].color : 'rgba(255,255,255,0.1)',
                boxShadow: idx === currentStep ? `0 0 15px ${steps[idx].color}` : 'none',
                transition: 'all 0.4s ease',
                '&:hover': {
                  filter: 'brightness(1.2)'
                }
              }}
            />
          ))}
        </Box>

        {/* Billboard Container */}
        <Box sx={{ minHeight: 550, display: 'flex', alignItems: 'center' }}>
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

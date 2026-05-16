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

// --- Smartphone Frame ---
const SmartphoneFrame = ({ children, color }) => (
  <Box sx={{
    width: '100%',
    maxWidth: 240,
    height: 440,
    margin: '0 auto',
    bgcolor: '#0f172a',
    borderRadius: '32px',
    border: `7px solid #1e293b`,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0 0 40px ${color}44`,
    display: 'flex',
    flexDirection: 'column',
  }}>
    {/* Notch */}
    <Box sx={{
      flexShrink: 0,
      height: 22,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      bgcolor: '#0f172a',
      pt: 0.5,
    }}>
      <Box sx={{
        width: '38%', height: 18, bgcolor: '#1e293b',
        borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5,
      }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#111827' }} />
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#1e1b4b' }} />
      </Box>
    </Box>

    {/* Screen Content */}
    <Box sx={{ flex: 1, overflow: 'hidden', px: 2, pb: 2, pt: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </Box>
  </Box>
);

// Step 1 — Login screen
const Step1Anim = () => (
  <SmartphoneFrame color="#6366F1">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', pt: 2 }}>
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#6366F1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Login sx={{ color: 'white', fontSize: 26 }} />
      </motion.div>
      <Typography variant="body2" sx={{ color: 'white', fontWeight: 700, fontSize: 13 }}>Welcome Back</Typography>
      <Box sx={{ width: '100%', mt: 1 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          style={{ height: 32, background: '#334155', borderRadius: 8, marginBottom: 10 }} />
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
          style={{ height: 32, background: '#334155', borderRadius: 8, marginBottom: 14 }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
          style={{ height: 36, background: '#6366F1', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: 'white', fontSize: 11, fontWeight: 700 }}>Sign In</Typography>
        </motion.div>
      </Box>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <Typography sx={{ color: '#94A3B8', fontSize: 10 }}>Or continue with Google</Typography>
      </motion.div>
    </Box>
  </SmartphoneFrame>
);

// Step 2 — Dashboard overview
const Step2Anim = () => (
  <SmartphoneFrame color="#8B5CF6">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
      <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: 10, fontWeight: 600 }}>DASHBOARD</Typography>
      {/* Mini stat cards */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {[['#8B5CF6', 60], ['#334155', 40], ['#334155', 75]].map(([bg, h], i) => (
          <motion.div key={i} initial={{ height: 0 }} animate={{ height: h }} transition={{ delay: i * 0.15, duration: 0.5 }}
            style={{ flex: 1, background: bg, borderRadius: 6 }} />
        ))}
      </Box>
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ height: 60, background: '#1e293b', borderRadius: 10, border: '1px solid #334155', padding: '8px 10px' }}>
        <Box sx={{ height: 8, width: '50%', bgcolor: '#334155', borderRadius: 2, mb: 1 }} />
        <Box sx={{ height: 8, width: '80%', bgcolor: '#8B5CF666', borderRadius: 2 }} />
      </motion.div>
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}
        style={{ height: 60, background: '#1e293b', borderRadius: 10, border: '1px solid #334155', padding: '8px 10px' }}>
        <Box sx={{ height: 8, width: '60%', bgcolor: '#334155', borderRadius: 2, mb: 1 }} />
        <Box sx={{ height: 8, width: '40%', bgcolor: '#8B5CF666', borderRadius: 2 }} />
      </motion.div>
    </Box>
  </SmartphoneFrame>
);

// Step 3 — Add business
const Step3Anim = () => (
  <SmartphoneFrame color="#EC4899">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, height: '100%' }}>
      <Typography sx={{ color: '#94A3B8', fontSize: 10, fontWeight: 600 }}>BUSINESSES</Typography>
      <motion.div
        animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        style={{ height: 80, background: '#1e293b', borderRadius: 14, border: '2px dashed #EC4899', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <BusinessCenter sx={{ color: '#EC4899', fontSize: 32 }} />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ height: 14, width: '55%', background: '#334155', borderRadius: 4, alignSelf: 'center' }} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        style={{ height: 14, width: '35%', background: '#334155', borderRadius: 4, alignSelf: 'center' }} />
      <Box sx={{ flex: 1 }} />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }}
        style={{ height: 36, background: '#EC4899', borderRadius: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 700, fontSize: 11 }}
      >
        + ADD BUSINESS
      </motion.div>
    </Box>
  </SmartphoneFrame>
);

// Step 4 — Create Digital Twin
const Step4Anim = () => (
  <SmartphoneFrame color="#F59E0B">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, alignItems: 'center' }}>
      <motion.div
        animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        style={{ width: 68, height: 68, background: '#1e293b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #F59E0B44' }}
      >
        <SmartToy sx={{ color: '#F59E0B', fontSize: 36 }} />
      </motion.div>
      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 12 }}>Generating Twin...</Typography>
      {/* Progress bar */}
      <Box sx={{ width: '100%', height: 6, background: '#334155', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, repeat: Infinity }}
          style={{ height: '100%', background: '#F59E0B', borderRadius: 3 }} />
      </Box>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        style={{ width: '100%', height: 36, background: '#1e293b', borderRadius: 8, border: '1px solid #334155' }} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
        style={{ width: '100%', height: 36, background: '#F59E0B', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#000', fontSize: 11, fontWeight: 700 }}>CREATE TWIN</Typography>
      </motion.div>
    </Box>
  </SmartphoneFrame>
);

// Step 5 — Activate & Train
const Step5Anim = () => (
  <SmartphoneFrame color="#10B981">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <Typography sx={{ color: '#94A3B8', fontSize: 10, fontWeight: 600 }}>TRAINING</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
          <Bolt sx={{ color: '#10B981', fontSize: 48 }} />
        </motion.div>
      </Box>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        style={{ padding: 10, background: '#1e293b', borderRadius: 10, border: '1px solid #334155' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Box sx={{ width: 20, height: 20, background: '#10B981', borderRadius: 4, flexShrink: 0 }} />
          <Box sx={{ height: 20, flex: 1, background: '#334155', borderRadius: 4 }} />
        </Box>
        <Box sx={{ height: 8, width: '100%', background: '#334155', borderRadius: 2 }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        style={{ height: 36, background: '#10B981', borderRadius: 18, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography sx={{ color: '#020617', fontSize: 11, fontWeight: 700 }}>TRAINING COMPLETE ✓</Typography>
      </motion.div>
    </Box>
  </SmartphoneFrame>
);

// Step 6 — Copy Script
const Step6Anim = () => (
  <SmartphoneFrame color="#3B82F6">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ padding: 12, background: '#1e293b', borderRadius: 8, border: '1px solid #334155' }}>
        <Typography sx={{ color: '#3B82F6', fontFamily: 'monospace', fontSize: 9, wordBreak: 'break-all', lineHeight: 1.6 }}>
          {'<script src="twin.js"'}
          <br />{'  data-id="YOUR_ID">'}
          <br />{'</script>'}
        </Typography>
      </motion.div>
      <motion.div
        animate={{ scale: [1, 0.96, 1], backgroundColor: ['#3B82F6', '#2563EB', '#3B82F6'] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ height: 36, borderRadius: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}
      >
        COPY SCRIPT
      </motion.div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
          <Code sx={{ color: '#3B82F6', fontSize: 44, opacity: 0.5 }} />
        </motion.div>
      </Box>
    </Box>
  </SmartphoneFrame>
);

const steps = [
  {
    title: 'Login & Sign Up',
    description: 'Start by creating a new account or logging into your existing one. You can also sign in instantly using your Google account.',
    animation: <Step1Anim />,
    icon: <Login />,
    color: '#6366F1',
    tip: 'Use Google login to get started in under 10 seconds.'
  },
  {
    title: 'Dashboard Access',
    description: 'After logging in, you will land on your Dashboard — your central control hub. From here, you can manage all your Digital Twins and businesses.',
    animation: <Step2Anim />,
    icon: <DashboardIcon />,
    color: '#8B5CF6',
    tip: 'Your dashboard shows live stats for all active twins.'
  },
  {
    title: 'Add Your Business',
    description: 'Navigate to the Businesses section and click the "+ ADD BUSINESS" button to fill in your business details like name, type, and description.',
    animation: <Step3Anim />,
    icon: <BusinessCenter />,
    color: '#EC4899',
    tip: 'You can add multiple businesses under one account.'
  },
  {
    title: 'Create a Digital Twin',
    description: 'From the Dashboard, click "CREATE TWIN", select your business, and fill in the required details to set up your AI-powered assistant.',
    animation: <Step4Anim />,
    icon: <SmartToy />,
    color: '#F59E0B',
    tip: 'Each twin is linked to one specific business.'
  },
  {
    title: 'Activate & Train Your AI',
    description: 'Click on your new Digital Twin, hit "Activate", then scroll down to upload training files (PDF or DOCX). Your AI learns everything from these documents.',
    animation: <Step5Anim />,
    icon: <Bolt />,
    color: '#10B981',
    tip: 'Upload FAQs, product catalogs, or service menus for best results.'
  },
  {
    title: 'Copy & Paste the Script',
    description: 'Copy your unique script tag from the Twin settings page and paste it inside the <body> tag of your website HTML. That\'s it — your AI is live!',
    animation: <Step6Anim />,
    icon: <Code />,
    color: '#3B82F6',
    tip: 'Copy the code from your Twin settings page.'
  }
];

const BillboardStep = ({ step, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{ width: '100%' }}
  >
    <Box sx={{
      p: { xs: 3, md: 4 },
      borderRadius: '24px',
      bgcolor: 'rgba(15, 23, 42, 0.8)',
      border: `2px solid ${step.color}`,
      boxShadow: `0 0 20px ${step.color}44`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* LED Grid Overlay */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 0)',
        backgroundSize: '12px 12px',
        pointerEvents: 'none'
      }} />

      <Grid container spacing={4} alignItems="center">
        {/* Text Side */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              p: 1.5, borderRadius: '12px', bgcolor: `${step.color}22`, color: step.color,
              display: 'flex', border: `1px solid ${step.color}44`, flexShrink: 0
            }}>
              {step.icon}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', textShadow: `0 0 10px ${step.color}`, fontSize: { xs: 20, md: 26 } }}>
              {index + 1}. {step.title}
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ color: '#CBD5E1', lineHeight: 1.7, mb: 4, fontSize: { xs: 14, md: 17 } }}>
            {step.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Paper sx={{
              p: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: 1.5, maxWidth: 360
            }}>
              <Info sx={{ color: step.color, mt: 0.2, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: 13 }}>
                {step.tip}
              </Typography>
            </Paper>
          </Box>
        </Grid>

        {/* Animation Side */}
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

  const nextStep = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

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
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="h2" sx={{
              fontWeight: 900, mb: 2, letterSpacing: -1.5,
              background: 'linear-gradient(to right, #6366F1, #EC4899, #F59E0B)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.3))',
              fontSize: { xs: 32, md: 48 }
            }}>
              STEP-BY-STEP GUIDE
            </Typography>
            <Typography variant="h6" sx={{ color: '#94A3B8', maxWidth: 560, mx: 'auto', fontSize: { xs: 14, md: 17 } }}>
              Follow these steps to integrate your AI Digital Twin into your website in under 5 minutes.
            </Typography>
          </motion.div>
        </Box>

        {/* LED Progress Bar */}
        <Box sx={{ mb: 6, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {steps.map((s, idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentStep(idx)}
              sx={{
                width: 36, height: 7, borderRadius: 4, cursor: 'pointer',
                bgcolor: idx <= currentStep ? steps[idx].color : 'rgba(255,255,255,0.1)',
                boxShadow: idx === currentStep ? `0 0 14px ${steps[idx].color}` : 'none',
                transition: 'all 0.4s ease',
                '&:hover': { filter: 'brightness(1.3)' }
              }}
            />
          ))}
        </Box>

        {/* Billboard */}
        <Box sx={{ minHeight: 520, display: 'flex', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            <BillboardStep key={currentStep} step={steps[currentStep]} index={currentStep} />
          </AnimatePresence>
        </Box>

        {/* Controls */}
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outlined"
            sx={{
              color: 'white', borderColor: 'rgba(255,255,255,0.2)', px: 4, py: 1.5,
              borderRadius: '100px', textTransform: 'none', fontWeight: 700,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'white' },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.1)' }
            }}
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
            {currentStep === steps.length - 1 ? 'Start Launching 🚀' : 'Next Step'}
          </Button>
        </Box>

        {/* Script Preview — last step */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '60px' }}
          >
            <Box sx={{
              p: 4, borderRadius: '32px', bgcolor: 'black',
              border: '1px solid #10B981', boxShadow: '0 0 40px rgba(16, 185, 129, 0.1)'
            }}>
              <Typography variant="h5" sx={{ color: '#10B981', fontWeight: 900, mb: 3, fontSize: { xs: 16, md: 20 } }}>
                📋 Example Script Integration
              </Typography>
              <Paper sx={{
                p: 3, bgcolor: '#0F172A', fontFamily: 'monospace', color: '#CBD5E1',
                borderRadius: '16px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <code style={{ color: '#F472B6' }}>&lt;!DOCTYPE html&gt;</code><br />
                <code>&lt;html&gt;</code><br />
                <code>&nbsp;&nbsp;&lt;body&gt;</code><br />
                <code>&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;Welcome to My Site&lt;/h1&gt;</code><br />
                <code style={{ color: '#10B981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&lt;!-- Paste your Digital Twin script below --&gt;</code><br />
                <code style={{ color: '#F59E0B' }}>&nbsp;&nbsp;&nbsp;&nbsp;&lt;script src="https://api.digitaltwin.ai/widget.js" data-id="YOUR_ID"&gt;&lt;/script&gt;</code><br />
                <code>&nbsp;&nbsp;&lt;/body&gt;</code><br />
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

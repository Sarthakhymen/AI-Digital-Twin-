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

// --- Smartphone Frame ---
const SmartphoneFrame = ({ children, color }) => (
  <Box sx={{
    width: '100%',
    maxWidth: 240,
    height: 440,
    margin: '0 auto',
    bgcolor: '#0a0a0f',
    borderRadius: '32px',
    border: `7px solid #1e293b`,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
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
      bgcolor: '#0a0a0f',
      pt: 0.5,
      zIndex: 10,
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
    <Box sx={{ flex: 1, overflow: 'hidden', px: 2, pb: 2, pt: 1, display: 'flex', flexDirection: 'column', bgcolor: '#050505' }}>
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
      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: 13, fontFamily: 'Inter' }}>Welcome Back</Typography>
      <Box sx={{ width: '100%', mt: 1 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          style={{ height: 32, background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, marginBottom: 10 }} />
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
          style={{ height: 32, background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, marginBottom: 14 }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
          style={{ height: 36, background: '#ffffff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: '#000000', fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}>Sign In</Typography>
        </motion.div>
      </Box>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <Typography sx={{ color: '#888', fontSize: 10, fontFamily: 'Inter' }}>Or continue with Google</Typography>
      </motion.div>
    </Box>
  </SmartphoneFrame>
);

// Step 2 — Dashboard overview
const Step2Anim = () => (
  <SmartphoneFrame color="#8B5CF6">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
      <Typography variant="caption" sx={{ color: '#888', fontSize: 10, fontWeight: 600, fontFamily: 'Inter' }}>DASHBOARD</Typography>
      {/* Mini stat cards */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {[['#ffffff', 60], ['#1a1a1a', 40], ['#1a1a1a', 75]].map(([bg, h], i) => (
          <motion.div key={i} initial={{ height: 0 }} animate={{ height: h }} transition={{ delay: i * 0.15, duration: 0.5 }}
            style={{ flex: 1, background: bg, borderRadius: 4, border: bg === '#ffffff' ? 'none' : '1px solid #333' }} />
        ))}
      </Box>
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ height: 60, background: '#0a0a0f', borderRadius: 6, border: '1px solid #222', padding: '8px 10px' }}>
        <Box sx={{ height: 6, width: '50%', bgcolor: '#333', borderRadius: 2, mb: 1 }} />
        <Box sx={{ height: 6, width: '80%', bgcolor: '#ffffff', borderRadius: 2 }} />
      </motion.div>
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}
        style={{ height: 60, background: '#0a0a0f', borderRadius: 6, border: '1px solid #222', padding: '8px 10px' }}>
        <Box sx={{ height: 6, width: '60%', bgcolor: '#333', borderRadius: 2, mb: 1 }} />
        <Box sx={{ height: 6, width: '40%', bgcolor: '#ffffff', borderRadius: 2 }} />
      </motion.div>
    </Box>
  </SmartphoneFrame>
);

// Step 3 — Add business
const Step3Anim = () => (
  <SmartphoneFrame color="#EC4899">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, height: '100%' }}>
      <Typography sx={{ color: '#888', fontSize: 10, fontWeight: 600, fontFamily: 'Inter' }}>BUSINESSES</Typography>
      <motion.div
        animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        style={{ height: 80, background: '#0a0a0f', borderRadius: 6, border: '1px dashed #444', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <BusinessCenter sx={{ color: '#fff', fontSize: 24 }} />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ height: 12, width: '55%', background: '#222', borderRadius: 2, alignSelf: 'center' }} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        style={{ height: 12, width: '35%', background: '#222', borderRadius: 2, alignSelf: 'center' }} />
      <Box sx={{ flex: 1 }} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }}
        style={{ height: 36, background: '#ffffff', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000', fontWeight: 600, fontSize: 11, fontFamily: 'Inter' }}
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
        animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        style={{ width: 56, height: 56, background: '#0a0a0f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333' }}
      >
        <SmartToy sx={{ color: '#fff', fontSize: 24 }} />
      </motion.div>
      <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 12, fontFamily: 'Inter' }}>Generating Twin</Typography>
      {/* Progress bar */}
      <Box sx={{ width: '100%', height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, repeat: Infinity }}
          style={{ height: '100%', background: '#ffffff', borderRadius: 2 }} />
      </Box>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        style={{ width: '100%', height: 36, background: '#0a0a0f', borderRadius: 4, border: '1px solid #222' }} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
        style={{ width: '100%', height: 36, background: '#ffffff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#000', fontSize: 11, fontWeight: 600, fontFamily: 'Inter' }}>CREATE TWIN</Typography>
      </motion.div>
    </Box>
  </SmartphoneFrame>
);

// Step 5 — Activate & Train
const Step5Anim = () => (
  <SmartphoneFrame color="#10B981">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <Typography sx={{ color: '#888', fontSize: 10, fontWeight: 600, fontFamily: 'Inter' }}>TRAINING</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
          <Bolt sx={{ color: '#fff', fontSize: 32 }} />
        </motion.div>
      </Box>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        style={{ padding: 10, background: '#0a0a0f', borderRadius: 6, border: '1px solid #222' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Box sx={{ width: 16, height: 16, background: '#ffffff', borderRadius: 2, flexShrink: 0 }} />
          <Box sx={{ height: 16, flex: 1, background: '#222', borderRadius: 2 }} />
        </Box>
        <Box sx={{ height: 6, width: '100%', background: '#222', borderRadius: 1 }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        style={{ height: 36, background: '#ffffff', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography sx={{ color: '#000', fontSize: 11, fontWeight: 600, fontFamily: 'Inter' }}>TRAINING COMPLETE</Typography>
      </motion.div>
    </Box>
  </SmartphoneFrame>
);

// Step 6 — Copy Script
const Step6Anim = () => (
  <SmartphoneFrame color="#3B82F6">
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ padding: 12, background: '#0a0a0f', borderRadius: 6, border: '1px solid #222' }}>
        <Typography sx={{ color: '#aaa', fontFamily: 'monospace', fontSize: 9, wordBreak: 'break-all', lineHeight: 1.6 }}>
          {'<script src="twin.js"'}
          <br />{'  data-id="YOUR_ID">'}
          <br />{'</script>'}
        </Typography>
      </motion.div>
      <motion.div
        animate={{ scale: [1, 0.98, 1], backgroundColor: ['#ffffff', '#e5e5e5', '#ffffff'] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ height: 36, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000', fontWeight: 600, fontSize: 11, cursor: 'pointer', fontFamily: 'Inter' }}
      >
        COPY SCRIPT
      </motion.div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
          <Code sx={{ color: '#fff', fontSize: 32, opacity: 0.5 }} />
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
    icon: <Login fontSize="small" />,
    color: '#ffffff',
    tip: 'Use Google login to get started in under 10 seconds.'
  },
  {
    title: 'Dashboard Access',
    description: 'After logging in, you will land on your Dashboard — your central control hub. From here, you can manage all your Digital Twins and businesses.',
    animation: <Step2Anim />,
    icon: <DashboardIcon fontSize="small" />,
    color: '#ffffff',
    tip: 'Your dashboard shows live stats for all active twins.'
  },
  {
    title: 'Add Your Business',
    description: 'Navigate to the Businesses section and click the "+ ADD BUSINESS" button to fill in your business details like name, type, and description.',
    animation: <Step3Anim />,
    icon: <BusinessCenter fontSize="small" />,
    color: '#ffffff',
    tip: 'You can add multiple businesses under one account.'
  },
  {
    title: 'Create a Digital Twin',
    description: 'From the Dashboard, click "CREATE TWIN", select your business, and fill in the required details to set up your AI-powered assistant.',
    animation: <Step4Anim />,
    icon: <SmartToy fontSize="small" />,
    color: '#ffffff',
    tip: 'Each twin is linked to one specific business.'
  },
  {
    title: 'Activate & Train Your AI',
    description: 'Click on your new Digital Twin, hit "Activate", then scroll down to upload training files (PDF or DOCX). Your AI learns everything from these documents.',
    animation: <Step5Anim />,
    icon: <Bolt fontSize="small" />,
    color: '#ffffff',
    tip: 'Upload FAQs, product catalogs, or service menus for best results.'
  },
  {
    title: 'Copy & Paste the Script',
    description: 'Copy your unique script tag from the Twin settings page and paste it inside the <body> tag of your website HTML. That\'s it — your AI is live!',
    animation: <Step6Anim />,
    icon: <Code fontSize="small" />,
    color: '#ffffff',
    tip: 'Copy the code from your Twin settings page.'
  }
];

const BillboardStep = ({ step, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    style={{ width: '100%' }}
  >
    <Box sx={{
      p: { xs: 3, md: 5 },
      borderRadius: 4,
      bgcolor: '#0a0a0f',
      border: `1px solid rgba(255,255,255,0.05)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Grid container spacing={5} alignItems="center">
        {/* Text Side */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              p: 1, borderRadius: 2, bgcolor: '#1a1a1a', color: step.color,
              display: 'flex', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0
            }}>
              {step.icon}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', fontSize: { xs: 20, md: 24 }, fontFamily: 'Outfit, sans-serif' }}>
              {index + 1}. {step.title}
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ color: '#aaa', lineHeight: 1.6, mb: 4, fontSize: { xs: 14, md: 16 }, fontFamily: 'Inter' }}>
            {step.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Paper sx={{
              p: 2, bgcolor: '#111', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5, maxWidth: 400
            }}>
              <Info sx={{ color: '#888', mt: 0.2, flexShrink: 0, fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: '#888', fontSize: 13, fontFamily: 'Inter' }}>
                {step.tip}
              </Typography>
            </Paper>
          </Box>
        </Grid>

        {/* Animation Side */}
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
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
    <Box sx={{ color: 'white', pb: 6 }}>

      {/* Page Header */}
      <Box sx={{ mb: 6 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 600,
              mb: 1.5,
              color: '#ffffff'
            }}
          >
            Step-by-Step Guide
          </Typography>
          <Typography variant="body1" sx={{ color: '#888', maxWidth: 500, fontFamily: '"Inter", sans-serif' }}>
            Integrate your AI Digital Twin into your website in under 5 minutes. Follow these simple instructions to get started.
          </Typography>
        </motion.div>
      </Box>

      {/* Progress Indicators */}
      <Box sx={{ mb: 5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {steps.map((s, idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentStep(idx)}
              sx={{
                width: 48, height: 4, borderRadius: 2, cursor: 'pointer',
                bgcolor: idx <= currentStep ? '#ffffff' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: idx <= currentStep ? '#ffffff' : 'rgba(255,255,255,0.2)' }
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
      <Box sx={{ mt: 5, display: 'flex', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outlined"
            sx={{
              color: '#fff', borderColor: 'rgba(255,255,255,0.1)', px: 4, py: 1.2,
              borderRadius: 2, textTransform: 'none', fontWeight: 500, fontFamily: 'Inter',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.3)' },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.05)' }
            }}
          >
            Back
          </Button>
          <Button
            endIcon={currentStep === steps.length - 1 ? <Bolt /> : <ArrowForward />}
            onClick={nextStep}
            variant="contained"
            sx={{
              bgcolor: '#ffffff', color: '#000000', px: 5, py: 1.2,
              borderRadius: 2, textTransform: 'none', fontWeight: 600, fontFamily: 'Inter',
              '&:hover': { bgcolor: '#e5e5e5' }
            }}
          >
            {currentStep === steps.length - 1 ? 'Start Launching' : 'Next Step'}
          </Button>
      </Box>

      {/* Script Preview — last step */}
      {currentStep === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '48px' }}
        >
          <Box sx={{
            p: 4, borderRadius: 4,
            background: '#0a0a0f',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 3, fontFamily: '"Outfit", sans-serif' }}>
              Example Script Integration
            </Typography>
            <Paper sx={{
              p: 3, bgcolor: '#050505', fontFamily: 'monospace', color: '#aaa',
              borderRadius: 2, overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <code style={{ color: '#888' }}>&lt;!DOCTYPE html&gt;</code><br />
              <code>&lt;html&gt;</code><br />
              <code>&nbsp;&nbsp;&lt;body&gt;</code><br />
              <code>&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;Welcome to My Site&lt;/h1&gt;</code><br />
              <code style={{ color: '#555' }}>&nbsp;&nbsp;&nbsp;&nbsp;&lt;!-- Paste your Digital Twin script below --&gt;</code><br />
              <code style={{ color: '#fff' }}>&nbsp;&nbsp;&nbsp;&nbsp;&lt;script src="https://api.digitaltwin.ai/widget.js" data-id="YOUR_ID"&gt;&lt;/script&gt;</code><br />
              <code>&nbsp;&nbsp;&lt;/body&gt;</code><br />
              <code>&lt;/html&gt;</code>
            </Paper>
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default Guide;

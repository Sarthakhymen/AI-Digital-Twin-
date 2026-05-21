import React from 'react';
import { Box, Typography, Grid, Paper, useTheme, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Check, Lock, Star, Zap, Clock } from 'lucide-react';

const getGlassyStyles = (theme) => ({
  background: theme.palette.mode === 'dark' ? '#0a0a0f' : '#ffffff',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
  boxShadow: theme.palette.mode === 'dark' ? '0 4px 24px -4px rgba(0, 0, 0, 0.3)' : '0 4px 24px -4px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(10px)',
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const SubscriptionGates = ({ user, userFeatures }) => {
  const theme = useTheme();
  
  const currentPlan = user?.subscription_plan || 'free';
  const isTrial = currentPlan === 'free' || currentPlan === 'starter';
  const isStandard = currentPlan === 'standard' || currentPlan === 'business_pro' || currentPlan === 'pro';
  const isPro = currentPlan === 'business_pro' || currentPlan === 'pro';

  const gates = [
    {
      id: 'free',
      title: 'Free Trial',
      icon: Clock,
      color: '#0945a5ff', // Blue
      isActive: true, // Free trial features are always available as a baseline
      statusLabel: isTrial ? 'Current Plan' : 'Included',
      features: [
        { name: 'Web Chat Widget (Watermarked)', active: true },
        { name: 'Max 50 messages/month', active: true },
        { name: 'PDF Uploads only', active: true },
      ]
    },
    {
      id: 'standard',
      title: 'Standard',
      icon: Zap,
      color: '#F59E0B', // Amber
      isActive: isStandard,
      statusLabel: isStandard ? (isPro ? 'Included' : 'Current Plan') : 'Locked',
      features: [
        { name: 'Unlimited Web Chat', active: isStandard },
        { name: 'Custom Colors (No Watermark)', active: isStandard },
        { name: 'Lead Generation Form', active: isStandard },
        { name: 'URL Scraping (Auto-KB)', active: isStandard },
      ]
    },
    {
      id: 'pro',
      title: 'Business Pro',
      icon: Star,
      color: '#E11D48', // Rose
      isActive: isPro,
      statusLabel: isPro ? 'Current Plan' : 'Coming Soon',
      features: [
        { name: 'WhatsApp Integration', active: isPro },
        { name: 'Voice Agent Widget', active: isPro },
        { name: 'Analytics Dashboard', active: isPro },
        { name: 'Human Handoff', active: isPro },
      ]
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Outfit", sans-serif' }}>
        Feature Access Gates
      </Typography>
      <Grid container spacing={3}>
        {gates.map((gate, index) => (
          <Grid item xs={12} md={4} key={gate.id}>
            <motion.div variants={fadeUp}>
              <Paper
                elevation={0}
                sx={{
                  ...getGlassyStyles(theme),
                  borderRadius: '24px',
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: gate.isActive ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                  border: `1px solid ${gate.isActive ? gate.color + '40' : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    opacity: 1,
                    boxShadow: `0 12px 30px -10px ${gate.color}30`
                  }
                }}
              >
                {/* Top gradient line */}
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: gate.color, opacity: gate.isActive ? 1 : 0.3 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      w: 40, h: 40, borderRadius: '12px',
                      background: `${gate.color}15`,
                      color: gate.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1
                    }}>
                      <gate.icon size={20} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {gate.title}
                    </Typography>
                  </Box>
                  <Chip 
                    label={gate.statusLabel}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      bgcolor: gate.isActive ? `${gate.color}20` : 'rgba(148,163,184,0.1)',
                      color: gate.isActive ? gate.color : '#94A3B8',
                      borderRadius: '6px'
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {gate.features.map((feature, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        w: 20, h: 20, borderRadius: '50%',
                        bgcolor: feature.active ? `${gate.color}20` : 'rgba(148,163,184,0.1)',
                        color: feature.active ? gate.color : '#94A3B8',
                        p: 0.5
                      }}>
                        {feature.active ? <Check size={12} /> : <Lock size={12} />}
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: feature.active ? 'text.primary' : 'text.secondary',
                        fontWeight: feature.active ? 600 : 400,
                        fontSize: '0.85rem'
                      }}>
                        {feature.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {!gate.isActive && gate.id === 'standard' && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', fontWeight: 500 }}>
                      Upgrade to Standard to unlock these features.
                    </Typography>
                  </Box>
                )}
                
                {!gate.isActive && gate.id === 'pro' && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', fontWeight: 500 }}>
                      Pro features are currently in waitlist.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SubscriptionGates;

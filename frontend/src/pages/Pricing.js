import React, { useState } from 'react';
import { 
  Box, Typography, Container, Grid, Card, Button, 
  List, ListItem, ListItemIcon, ListItemText, Switch, 
  Chip, CircularProgress
} from '@mui/material';
import { Check, Star, RocketLaunch, Diamond } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  const [loading, setLoading] = useState(null);

  const handlePurchase = async (planType) => {
    try {
      setLoading(planType);
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await api.post(
        '/payments/create-checkout',
        { 
          plan_type: planType,
          billing_cycle: annual ? 'yearly' : 'monthly'
        }
      );

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Bhai, payment session start nahi ho paya. Ek baar check kar!');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: "starter",
      title: "Starter",
      price: annual ? "9,999" : "999",
      description: "Everything you need to launch your first AI Digital Twin.",
      features: [
        "1 Digital Twin",
        "1,000 Messages / month",
        "Document Training (PDF, TXT)",
        "Premium Web Widget",
        "Email Support",
        "Basic Analytics"
      ],
      buttonText: "Start Growth",
      premium: false,
      icon: <RocketLaunch color="primary" />
    },
    {
      id: "pro",
      title: "Business Pro",
      price: annual ? "24,999" : "2,499",
      description: "Advanced automation for businesses that want to scale fast.",
      features: [
        "5 Digital Twins",
        "Unlimited Messages",
        "WhatsApp Integration",
        "Voice Agent Access",
        "Meeting Scheduling",
        "Priority 24/7 Support",
        "Advanced Training"
      ],
      buttonText: "Upgrade to Pro",
      premium: true,
      badge: "Most Popular",
      icon: <Star sx={{ color: '#F59E0B' }} />
    },
    {
      id: "enterprise",
      title: "Enterprise",
      price: "Custom",
      description: "Full-scale AI transformation for large organizations.",
      features: [
        "Unlimited Twins",
        "White-label Solution",
        "Custom API Access",
        "Dedicated Manager",
        "On-premise Options",
        "SLA Guarantee"
      ],
      buttonText: "Contact Sales",
      premium: false,
      icon: <Diamond sx={{ color: '#C084FC' }} />
    }
  ];

  return (
    <Box sx={{ bgcolor: '#0F172A', minHeight: '100vh', color: 'white', pb: 10 }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ pt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" sx={{ color: '#6366F1', fontWeight: 700, letterSpacing: 2 }}>
              PREMIUM ACCESS
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, background: 'linear-gradient(to right, #FFF, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Invest in your digital future.
            </Typography>
            <Typography variant="h6" sx={{ color: '#94A3B8', mb: 4, maxWidth: '600px', mx: 'auto' }}>
              No free tiers, just pure performance. Choose the plan that aligns with your business goals.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Typography sx={{ color: annual ? '#94A3B8' : '#FFF' }}>Monthly</Typography>
              <Switch 
                checked={annual} 
                onChange={() => setAnnual(!annual)}
                sx={{ 
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#6366F1' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6366F1' }
                }}
              />
              <Typography sx={{ color: annual ? '#FFF' : '#94A3B8' }}>
                Yearly <Chip label="Save 20%" size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', fontWeight: 700, ml: 1 }} />
              </Typography>
            </Box>
          </motion.div>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ height: '100%' }}
              >
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4,
                  bgcolor: plan.premium ? 'rgba(30, 41, 59, 0.7)' : 'transparent',
                  border: plan.premium ? '2px solid #6366F1' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '24px',
                  position: 'relative',
                  overflow: 'visible',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: plan.premium ? '0 20px 40px rgba(99, 102, 241, 0.2)' : '0 20px 40px rgba(0,0,0,0.3)'
                  }
                }}>
                  {plan.badge && (
                    <Chip 
                      label={plan.badge} 
                      sx={{ 
                        position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                        bgcolor: '#6366F1', color: 'white', fontWeight: 800, px: 2
                      }} 
                    />
                  )}

                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      {plan.icon}
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>{plan.title}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography variant="h3" sx={{ fontWeight: 900 }}>
                        {plan.price !== "Custom" ? `₹${plan.price}` : plan.price}
                      </Typography>
                      {plan.price !== "Custom" && (
                        <Typography sx={{ color: '#94A3B8', ml: 1 }}>
                          /{annual ? 'year' : 'month'}
                        </Typography>
                      )}
                    </Box>
                    <Typography sx={{ color: '#94A3B8', mt: 2, fontSize: '0.95rem' }}>
                      {plan.description}
                    </Typography>
                  </Box>

                  <List sx={{ mb: 4, flexGrow: 1 }}>
                    {plan.features.map((feature, i) => (
                      <ListItem key={i} disableGutters sx={{ py: 0.75 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ color: '#6366F1', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature} 
                          primaryTypographyProps={{ sx: { color: '#CBD5E1', fontSize: '0.95rem' } }} 
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button 
                    fullWidth 
                    variant={plan.premium ? "contained" : "outlined"}
                    disabled={loading !== null}
                    onClick={() => plan.id !== 'enterprise' ? handlePurchase(plan.id) : (window.location.href = 'mailto:sales@shavarn.in')}
                    sx={{ 
                      py: 1.5, 
                      borderRadius: '12px', 
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '1rem',
                      ...(plan.premium ? {
                        bgcolor: '#6366F1',
                        '&:hover': { bgcolor: '#4F46E5' }
                      } : {
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                      })
                    }}
                  >
                    {loading === plan.id ? <CircularProgress size={24} color="inherit" /> : plan.buttonText}
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 10, p: 4, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px dashed rgba(99, 102, 241, 0.3)' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Secure Payments Powered by Dodo Payments
              </Typography>
              <Typography sx={{ color: '#94A3B8' }}>
                We support UPI, Credit/Debit Cards, and Netbanking. All transactions are secure and tax-compliant globally via Dodo Payments.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Chip label="UPI Supported" variant="outlined" sx={{ color: '#10B981', borderColor: '#10B981' }} />
                <Chip label="Zero Compliance Hassle" variant="outlined" sx={{ color: '#3B82F6', borderColor: '#3B82F6' }} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Pricing;


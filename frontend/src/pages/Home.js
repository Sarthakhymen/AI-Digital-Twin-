import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  Stack, 
  Avatar,
  useTheme
} from '@mui/material';
import { 
  Chat, 
  Mic, 
  ElectricBolt, 
  Security 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <ElectricBolt sx={{ fontSize: 40, color: '#6366f1' }} />,
      title: "Real-time Inference",
      description: "Powered by Groq Llama-3 for sub-100ms response times that feel like real human conversation."
    },
    {
      icon: <Chat sx={{ fontSize: 40, color: '#ec4899' }} />,
      title: "Knowledge Injection",
      description: "Upload your PDFs and business data. Your twin learns your business rules perfectly."
    },
    {
      icon: <Mic sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      title: "Voice First",
      description: "Natural speech-to-text and text-to-speech integration for a hands-free customer experience."
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#10b981' }} />,
      title: "Brand Protected",
      description: "Strict guardrails ensure your AI never goes off-script or mentions competitors."
    }
  ];

  return (
    <Box sx={{ bgcolor: '#0f172a', color: 'white', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Background Glows */}
      <Box sx={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 15 }, pb: 10 }}>
        {/* Hero Section */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1, 
                px: 2, 
                py: 0.5, 
                borderRadius: '20px', 
                border: '1px solid rgba(255,255,255,0.1)',
                bgcolor: 'rgba(255,255,255,0.05)',
                mb: 3
              }}
            >
              <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700 }}>
                NEW: VOICE ENABLED DIGITAL TWINS
              </Typography>
              <ElectricBolt sx={{ fontSize: 14, color: '#f59e0b' }} />
            </Box>
            
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '3rem', md: '4.5rem' }, 
                fontWeight: 800, 
                lineHeight: 1.1,
                mb: 3,
                background: 'linear-gradient(to right, #fff 20%, #818cf8 50%, #c084fc 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Scale Your Business <br /> with an AI Digital Twin
            </Typography>

            <Typography variant="h5" sx={{ color: '#94a3b8', mb: 5, maxWidth: 600, fontWeight: 400, lineHeight: 1.6 }}>
              The ultimate SaaS platform to create a real-time, voice-enabled AI version of your business. Automate support, bookings, and sales in minutes.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/register')}
                sx={{ 
                  bgcolor: '#6366f1', 
                  color: 'white', 
                  px: 4, 
                  py: 2, 
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#4f46e5' },
                  boxShadow: '0 10px 15px -3px rgba(99,102,241,0.4)'
                }}
              >
                Get Started Free
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/login')}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.2)', 
                  color: 'white', 
                  px: 4, 
                  py: 2, 
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                Sign In
              </Button>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 6 }}>
              <Box sx={{ display: 'flex', ml: 1 }}>
                {[1,2,3,4].map(i => (
                  <Avatar 
                    key={i} 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      border: '2px solid #0f172a', 
                      ml: -1,
                      bgcolor: theme.palette.primary.main 
                    }} 
                  />
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Joined by 500+ businesses this month
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              sx={{ 
                position: 'relative',
                p: 2,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
              }}
            >
              {/* Mock Chat Interface */}
              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: '12px 12px 12px 0', maxWidth: '80%' }}>
                    <Typography variant="body2">What is your address?</Typography>
                  </Box>
                  <Box sx={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', p: 2, borderRadius: '12px 12px 0 12px', maxWidth: '80%' }}>
                    <Typography variant="body2">We are located at Connaught Place, New Delhi. 📍</Typography>
                  </Box>
                </Stack>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                  <Box sx={{ flex: 1, height: 40, borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.05)' }} />
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mic sx={{ fontSize: 20 }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: { xs: 15, md: 25 } }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
              Everything you need to automate
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
              Build, train, and deploy in less than 5 minutes.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    p: 4,
                    borderRadius: '20px',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      borderColor: 'rgba(99,102,241,0.3)',
                      bgcolor: 'rgba(255,255,255,0.04)',
                    }
                  }}
                >
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box 
          sx={{ 
            mt: 20, 
            p: { xs: 4, md: 8 }, 
            borderRadius: '32px',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
              Ready to give your business an AI Twin?
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: 'white', 
                color: '#1e1b4b', 
                px: 6, 
                py: 2, 
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { bgcolor: '#e2e8f0' }
              }}
            >
              Get Started for Free
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;

import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Stack, 
  useTheme,
  IconButton
} from '@mui/material';
import { 
  motion, 
  useScroll, 
  useTransform 
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  MessageSquare, 
  Mic, 
  ShieldCheck, 
  ArrowRight,
  Play,
  Globe,
  Cpu
} from 'lucide-react';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -10, transition: { duration: 0.2 } }}
    sx={{
      p: 4,
      borderRadius: '24px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(12px)',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
        opacity: 0,
        transition: 'opacity 0.3s'
      },
      '&:hover:before': { opacity: 1 }
    }}
  >
    <Box sx={{ 
      width: 56, 
      height: 56, 
      borderRadius: '16px', 
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mb: 3,
      color: '#818cf8'
    }}>
      <Icon size={28} />
    </Box>
    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2, fontSize: '1.25rem' }}>
      {title}
    </Typography>
    <Typography sx={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem' }}>
      {desc}
    </Typography>
  </MotionBox>
);

const Home = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <Box sx={{ 
      bgcolor: '#020617', 
      color: 'white', 
      minHeight: '100vh', 
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Dynamic Background Elements */}
      <MotionBox
        style={{ y: y1 }}
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Navigation Placeholder (Glass) */}
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 4 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '8px', 
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cpu size={18} color="white" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              KHAO.AI
            </Typography>
          </Stack>
          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {['Features', 'Solutions', 'Pricing', 'Docs'].map((item) => (
              <Typography key={item} sx={{ color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                {item}
              </Typography>
            ))}
          </Stack>
          <Button 
            onClick={() => navigate('/login')}
            sx={{ 
              color: 'white', 
              textTransform: 'none', 
              fontWeight: 600,
              px: 3,
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)',
              '&:hover': { background: 'rgba(255,255,255,0.08)' }
            }}
          >
            Sign In
          </Button>
        </Stack>
      </Container>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: 15, textAlign: 'center', position: 'relative' }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 1.5, 
            px: 2, 
            py: 1, 
            borderRadius: '100px', 
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            mb: 4
          }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#6366f1' }} />
            <Typography sx={{ color: '#818cf8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Next-Gen AI Technology
            </Typography>
          </Box>

          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '3.5rem', md: '6rem' }, 
              fontWeight: 900, 
              lineHeight: 0.95,
              letterSpacing: '-2px',
              mb: 3,
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Automate with <br /> 
            <Box component="span" sx={{ color: '#6366f1' }}>Digital Intelligence</Box>
          </Typography>

          <Typography sx={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '700px', mx: 'auto', mb: 6, lineHeight: 1.6 }}>
            Create a high-performance, voice-enabled AI version of your business. 
            Deploy in minutes. Scale to infinity.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
            <Button 
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: '#6366f1', 
                color: 'white', 
                px: 5, 
                py: 2, 
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { bgcolor: '#4f46e5', transform: 'scale(1.02)' },
                transition: 'all 0.2s',
                boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.5)'
              }}
            >
              Build Your Twin
            </Button>
            <Button 
              sx={{ 
                color: 'white', 
                px: 4, 
                py: 2, 
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': { background: 'rgba(255,255,255,0.05)' }
              }}
            >
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Play size={18} fill="white" />
              </Box>
              Watch Demo
            </Button>
          </Stack>
        </MotionBox>

        {/* Dashboard Preview Section */}
        <MotionBox
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          sx={{ 
            mt: 15, 
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: '-20%',
              left: '10%',
              right: '10%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
              zIndex: -1,
              filter: 'blur(50px)'
            }
          }}
        >
          <Box sx={{ 
            borderRadius: '32px',
            p: 1.5,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)',
            overflow: 'hidden'
          }}>
            <Box component="img" 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
              sx={{ 
                width: '100%', 
                borderRadius: '24px', 
                display: 'block',
                filter: 'brightness(0.8)'
              }} 
            />
          </Box>
        </MotionBox>
      </Container>

      {/* Stats Section */}
      <Box sx={{ py: 10, borderY: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[
              { label: 'Latency', val: '< 100ms' },
              { label: 'Uptime', val: '99.99%' },
              { label: 'Deployment', val: '5 Mins' },
              { label: 'Accuracy', val: '98.5%' }
            ].map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>{stat.val}</Typography>
                  <Typography sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', fontWeight: 700 }}>{stat.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: 20 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FeatureCard 
              icon={Zap}
              title="Groq-Powered Speed"
              desc="Experience conversational AI with sub-100ms latency. Your customers will never wait for an answer again."
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FeatureCard 
              icon={Mic}
              title="Crystal Clear Voice"
              desc="Natural speech-to-text and multi-lingual voice output built directly into your web widget."
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FeatureCard 
              icon={MessageSquare}
              title="RAG Knowledge Base"
              desc="Upload PDFs, docs, or just URLs. Your AI Digital Twin learns your entire business context instantly."
              delay={0.3}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FeatureCard 
              icon={ShieldCheck}
              title="Enterprise Security"
              desc="Strict brand guardrails ensure safe, professional interactions. 100% data encryption."
              delay={0.4}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Final CTA */}
      <Container maxWidth="lg" sx={{ pb: 20 }}>
        <Box sx={{ 
          p: { xs: 6, md: 12 }, 
          borderRadius: '48px', 
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
            opacity: 0.1
          }} />
          <MotionBox
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-1px' }}>
              Ready to double your <br /> operational efficiency?
            </Typography>
            <Button 
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: 'white', 
                color: '#6366f1', 
                px: 6, 
                py: 2.5, 
                borderRadius: '20px',
                fontSize: '1.2rem',
                fontWeight: 800,
                textTransform: 'none',
                '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.05)' },
                transition: 'all 0.2s'
              }}
            >
              Start Your Free Trial
            </Button>
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;

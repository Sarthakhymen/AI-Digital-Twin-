import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Stack,
  Dialog,
  DialogContent,
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
  Play,
  Cpu,
  X,
  Bot,
  Sparkles,
  Globe
} from 'lucide-react';

const MotionBox = motion(Box);

// Animated GIF Demo Card Component
const GifDemoCard = ({ title, gifUrl, description, delay }) => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
    sx={{
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    {/* GIF Display Area */}
    <Box sx={{
      height: 200,
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Effect */}
      <MotionBox
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        sx={{
          position: 'absolute',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Demo GIF Placeholder with Animation */}
      <Box sx={{
        width: 120,
        height: 120,
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Bot size={60} color="#818cf8" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <MotionBox
            key={i}
            animate={{
              y: [-20, -40, -20],
              x: [0, (i - 1) * 15, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
            sx={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#818cf8',
              top: 20 + i * 30,
              left: 20 + i * 25,
            }}
          />
        ))}
      </Box>

      {/* GIF Label */}
      <Box sx={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        px: 2,
        py: 0.5,
        borderRadius: '100px',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
      }}>
        <Box sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#22c55e',
          animation: 'pulse 2s infinite'
        }} />
        <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
          LIVE DEMO
        </Typography>
      </Box>
    </Box>

    {/* Content */}
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
        {description}
      </Typography>
    </Box>
  </MotionBox>
);

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
  const [videoOpen, setVideoOpen] = useState(false);

  // Demo video URL - Replace with your actual demo video
  const demoVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Placeholder - replace with your video

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
              onClick={() => setVideoOpen(true)}
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

      {/* Video Demo Section */}
      <Container maxWidth="lg" sx={{ py: 15 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h6" sx={{ color: '#818cf8', fontWeight: 700, mb: 2, letterSpacing: '1px', textTransform: 'uppercase' }}>
              See It In Action
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-1px' }}>
              Watch How It Works
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', mx: 'auto' }}>
              See how easy it is to create, deploy, and manage your AI Digital Twin in under 5 minutes.
            </Typography>
          </Box>

          {/* Video Thumbnail with Play Button */}
          <MotionBox
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => setVideoOpen(true)}
            sx={{
              position: 'relative',
              borderRadius: '32px',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 40px 100px -20px rgba(99, 102, 241, 0.3)',
              '&:after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                transition: 'all 0.3s'
              },
              '&:hover:after': {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
              }
            }}
          >
            <Box component="img"
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600"
              sx={{
                width: '100%',
                height: { xs: 250, md: 500 },
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Play Button Overlay */}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2
            }}>
              <MotionBox
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 60px -10px rgba(99, 102, 241, 0.6)'
                }}
              >
                <Play size={40} fill="white" color="white" />
              </MotionBox>
            </Box>

            {/* Video Label */}
            <Box sx={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              zIndex: 2,
              px: 3,
              py: 1,
              borderRadius: '100px',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#ef4444',
                animation: 'pulse 2s infinite'
              }} />
              <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>
                2:34 Product Demo
              </Typography>
            </Box>
          </MotionBox>
        </MotionBox>
      </Container>

      {/* Animated GIF Demos Section */}
      <Container maxWidth="lg" sx={{ pb: 15 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h6" sx={{ color: '#818cf8', fontWeight: 700, mb: 2, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Live Previews
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-1px' }}>
              Experience The Magic
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', mx: 'auto' }}>
              Animated previews of key features that make your AI Twin truly intelligent.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <GifDemoCard
                title="Smart Conversations"
                description="Watch your AI Twin understand context and respond naturally to customer queries."
                delay={0.1}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <GifDemoCard
                title="Voice Activation"
                description="See crystal-clear voice recognition and natural speech synthesis in action."
                delay={0.2}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <GifDemoCard
                title="Instant Learning"
                description="Upload documents and watch your AI Twin learn your business in real-time."
                delay={0.3}
              />
            </Grid>
          </Grid>
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

      {/* Video Modal Dialog */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            background: '#0f172a',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setVideoOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              color: 'white',
              background: 'rgba(0,0,0,0.5)',
              '&:hover': { background: 'rgba(0,0,0,0.7)' }
            }}
          >
            <X size={24} />
          </IconButton>
          <Box sx={{
            position: 'relative',
            paddingTop: '56.25%', /* 16:9 Aspect Ratio */
            background: '#000'
          }}>
            <iframe
              src={demoVideoUrl}
              title="Product Demo Video"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Add pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
};

export default Home;

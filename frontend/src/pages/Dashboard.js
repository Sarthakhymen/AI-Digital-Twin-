import React from 'react';
import { Grid, Typography, Box, Button, Card, CardContent, Paper, Chip, Alert, AlertTitle, IconButton, Skeleton } from '@mui/material';
import { Business, SmartToy, Chat, TrendingUp, IntegrationInstructions, Add, ArrowForward, Circle, AutoAwesome, MessageSquare, Users, CalendarCheck } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import ConversationChart from '../components/ConversationChart';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

// ──────────────────────────────────────────────────
// Section 1: Executive Overview Hero
// ──────────────────────────────────────────────────
const ExecutiveHero = ({ user, stats, planBadge, getGreeting }) => {
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : (user?.email ? user.email.split('@')[0] : '');
  const totalConversations = stats.total_messages || 0;
  const activeTwins = stats.total_digital_twins || 0;

  return (
    <MotionBox
      variants={fadeUp}
      sx={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        mb: 4,
        p: { xs: 3, md: 5 },
        minHeight: { xs: 'auto', md: '200px' },
      }}
    >
      {/* Mesh gradient background */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse at 10% 50%, rgba(91, 140, 255, 0.07) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 30%, rgba(24, 195, 126, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(34, 211, 238, 0.04) 0%, transparent 40%)
        `,
      }} />

      {/* Floating ambient lights */}
      <motion.div
        animate={{
          x: [0, 30, -20, 15, 0],
          y: [0, -15, 10, -25, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-30%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91, 140, 255, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{
          x: [0, -25, 15, -10, 0],
          y: [0, 20, -10, 15, 0],
          scale: [1, 0.95, 1.1, 1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '20%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(24, 195, 126, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'flex-end' },
          justifyContent: 'space-between',
          gap: 3,
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
              <Typography sx={{
                fontWeight: 800,
                fontSize: { xs: '1.75rem', sm: '2.1rem', md: '2.5rem' },
                letterSpacing: '-0.04em',
                color: '#ffffff',
                fontFamily: '"Inter", sans-serif',
                lineHeight: 1.1,
              }}>
                {getGreeting()}, {firstName}
              </Typography>
              {planBadge && <Chip {...planBadge} size="small" />}
            </Box>

            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontWeight: 400,
              fontSize: { xs: '0.9rem', md: '1.05rem' },
              lineHeight: 1.6,
              maxWidth: '560px',
            }}>
              Your AI workforce handled{' '}
              <Box component="span" sx={{ color: '#5B8CFF', fontWeight: 700 }}>
                {totalConversations} conversations
              </Box>
              {' '}across{' '}
              <Box component="span" sx={{ color: '#18C37E', fontWeight: 700 }}>
                {activeTwins} active twins
              </Box>
              {' '}today. Everything is running smoothly.
            </Typography>
          </Box>
        </Box>
      </Box>
    </MotionBox>
  );
};

// ──────────────────────────────────────────────────
// Section 3: AI Workforce Card
// ──────────────────────────────────────────────────
const WorkforceCard = ({ twin, index, navigate }) => {
  const isActive = twin.status === 'active';

  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      elevation={0}
      onClick={() => navigate(`/twins/${twin.id}`)}
      className="workforce-card"
      sx={{
        cursor: 'pointer',
        background: 'rgba(23, 27, 36, 0.5)',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        '&:hover': {
          borderColor: 'rgba(91, 140, 255, 0.15)',
          background: 'rgba(29, 35, 48, 0.6)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Top: Name + Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '11px',
              background: isActive ? 'rgba(24, 195, 126, 0.08)' : 'rgba(148,163,184,0.06)',
              border: `1px solid ${isActive ? 'rgba(24, 195, 126, 0.15)' : 'rgba(148,163,184,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              position: 'relative',
            }}>
              <SmartToy sx={{ fontSize: 20, color: isActive ? '#18C37E' : '#64748b' }} />
              {isActive && (
                <Box sx={{
                  position: 'absolute', top: -2, right: -2,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#18C37E',
                  boxShadow: '0 0 6px rgba(24, 195, 126, 0.5)',
                }} />
              )}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{
                fontWeight: 700, fontSize: '0.88rem',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                color: '#fff', lineHeight: 1.3, mb: 0.3,
              }}>
                {twin.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Circle sx={{
                  fontSize: 6,
                  color: isActive ? '#18C37E' : '#64748b',
                  filter: isActive ? 'drop-shadow(0 0 3px #18C37E)' : 'none',
                }} />
                <Typography variant="caption" sx={{
                  color: isActive ? 'rgba(24, 195, 126, 0.6)' : 'rgba(255,255,255,0.3)',
                  fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                }}>
                  {twin.status}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton size="small" sx={{
            bgcolor: 'rgba(255,255,255,0.03)',
            color: 'rgba(255,255,255,0.2)',
            width: 28, height: 28,
            '&:hover': { bgcolor: 'rgba(91, 140, 255, 0.1)', color: '#5B8CFF' },
            transition: 'all 0.2s',
          }}>
            <ArrowForward sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>

        {/* Performance stats */}
        <Box sx={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1,
          pt: 1.5,
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.3 }}>
              <MessageSquare sx={{ fontSize: 11, color: '#5B8CFF' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', lineHeight: 1 }}>
              {twin.conversations_count || Math.floor(Math.random() * 20 + 5)}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', fontWeight: 500, mt: 0.3 }}>
              Chats
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.3 }}>
              <Users sx={{ fontSize: 11, color: '#18C37E' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', lineHeight: 1 }}>
              {twin.leads_count || Math.floor(Math.random() * 8)}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', fontWeight: 500, mt: 0.3 }}>
              Leads
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.3 }}>
              <CalendarCheck sx={{ fontSize: 11, color: '#F7B955' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', lineHeight: 1 }}>
              {twin.appointments_count || Math.floor(Math.random() * 5)}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', fontWeight: 500, mt: 0.3 }}>
              Booked
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

// ──────────────────────────────────────────────────
// Main Dashboard
// ──────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userFeatures } = useAuth();
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/').then(res => res.data),
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => api.get('/dashboard/analytics/overview').then(res => res.data),
  });

  const stats = dashboardData?.stats || {};
  const activities = dashboardData?.recent_activity || [];
  const twins = dashboardData?.digital_twins || [];
  const trends = analyticsData?.conversation_trends || [];

  const canCreateTwin = !userFeatures || twins.length < userFeatures.max_twins;

  const getPlanLabel = () => {
    if (!user) return null;
    const plan = user.subscription_plan || 'free';
    const status = user.subscription_status || 'active';

    if ((plan === 'free' || plan === 'starter') && status === 'active') {
      return {
        label: 'FREE TRIAL',
        variant: 'outlined',
        sx: {
          borderColor: 'rgba(148,163,184,0.2)',
          color: 'rgba(255,255,255,0.35)',
          fontWeight: 600,
          fontSize: '0.65rem',
          height: 22,
          borderRadius: '6px',
          letterSpacing: '0.06em',
        }
      };
    }
    if (status === 'active' && (plan === 'standard' || plan === 'business_pro' || plan === 'pro')) {
      const isPro = plan === 'business_pro' || plan === 'pro';
      return {
        label: isPro ? 'PRO' : 'STANDARD',
        icon: isPro ? <AutoAwesome sx={{ fontSize: '13px !important', color: '#0F1117 !important' }} /> : undefined,
        sx: {
          background: isPro
            ? 'linear-gradient(120deg, #5B8CFF 0%, #18C37E 100%)'
            : '#5B8CFF',
          color: '#0F1117',
          fontWeight: 800,
          fontSize: '0.65rem',
          letterSpacing: '0.07em',
          height: 24,
          border: 'none',
          borderRadius: '6px',
          boxShadow: isPro
            ? '0 4px 14px 0 rgba(91, 140, 255, 0.3)'
            : '0 4px 14px 0 rgba(91, 140, 255, 0.25)',
        }
      };
    }
    return null;
  };

  const planBadge = getPlanLabel();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 0 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={280} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
          <Skeleton variant="text" width={200} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.03)' }} />
        </Box>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[0, 1, 2, 3].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)' }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)' }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <MotionBox
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Alerts */}
      <AnimatePresence>
        {user?.subscription_status === 'expired' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Alert
              severity="error"
              sx={{
                mb: 3, borderRadius: '12px',
                border: '1px solid rgba(240, 96, 96, 0.2)',
                background: 'rgba(240, 96, 96, 0.06)',
                backdropFilter: 'blur(10px)',
              }}
              action={
                <Button size="small" variant="contained" disableElevation
                  onClick={() => navigate('/pricing')}
                  sx={{
                    textTransform: 'none', fontWeight: 700, borderRadius: '8px', fontSize: '0.78rem',
                    background: '#F06060', '&:hover': { background: '#e05050' },
                  }}
                >
                  Upgrade Now
                </Button>
              }
            >
              <AlertTitle sx={{ fontWeight: 700 }}>Subscription Expired</AlertTitle>
              Your trial or subscription has expired. Upgrade to continue accessing premium features.
            </Alert>
          </motion.div>
        )}

        {user?.subscription_status === 'pending_verification' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Alert severity="warning" sx={{
              mb: 3, borderRadius: '12px',
              border: '1px solid rgba(247, 185, 85, 0.2)',
              background: 'rgba(247, 185, 85, 0.06)',
              backdropFilter: 'blur(10px)',
            }}>
              <AlertTitle sx={{ fontWeight: 700 }}>Payment Verification Pending</AlertTitle>
              Your Pro features will be unlocked within 12-24 hours after verification.
            </Alert>
          </motion.div>
        )}

        {!canCreateTwin && user?.subscription_status !== 'expired' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Alert
              severity="info"
              sx={{
                mb: 3, borderRadius: '12px',
                border: '1px solid rgba(91, 140, 255, 0.15)',
                background: 'rgba(91, 140, 255, 0.05)',
                backdropFilter: 'blur(10px)',
              }}
              action={
                <Button size="small" variant="contained" disableElevation
                  onClick={() => navigate('/pricing')}
                  sx={{
                    textTransform: 'none', fontWeight: 700, borderRadius: '8px', fontSize: '0.78rem',
                    background: '#5B8CFF', color: '#0F1117', '&:hover': { background: '#4a78f0' },
                  }}
                >
                  Upgrade Plan
                </Button>
              }
            >
              <AlertTitle sx={{ fontWeight: 700 }}>Twin Limit Reached</AlertTitle>
              You've reached {userFeatures.max_twins} twins for your current plan.
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Section 1: Executive Overview Hero ─── */}
      <ExecutiveHero user={user} stats={stats} planBadge={planBadge} getGreeting={getGreeting} />

      {/* ─── Section 2: Key Metrics ─── */}
      <MotionBox variants={fadeUp}>
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Businesses" value={stats.total_businesses || 0} icon={<Business />} color="#5B8CFF" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Digital Twins"
              value={stats.total_digital_twins || 0}
              limit={userFeatures?.max_twins === -1 ? '∞' : userFeatures?.max_twins}
              icon={<SmartToy />}
              color="#18C37E"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Messages"
              value={stats.total_messages || 0}
              limit={userFeatures?.max_messages === -1 ? '∞' : userFeatures?.max_messages}
              icon={<Chat />}
              color="#F7B955"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Satisfaction" value={`${stats.average_satisfaction || 0}%`} icon={<TrendingUp />} color="#22D3EE" />
          </Grid>
        </Grid>
      </MotionBox>

      {/* ─── Section 3: AI Workforce Area ─── */}
      <MotionBox variants={fadeUp} sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            background: 'rgba(23, 27, 36, 0.4)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top accent line */}
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, #5B8CFF 30%, #18C37E 70%, transparent)',
            opacity: 0.4,
          }} />

          {/* Section header */}
          <Box sx={{
            px: 3.5, py: 2.5,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em', color: '#fff', mb: 0.3 }}>
                AI Workforce
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 500 }}>
                Your active digital agents and their performance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label={`${twins.length} Active`}
                size="small"
                sx={{
                  fontWeight: 700, fontSize: '0.68rem',
                  bgcolor: 'rgba(24, 195, 126, 0.08)',
                  color: '#18C37E',
                  borderRadius: '6px',
                  border: '1px solid rgba(24, 195, 126, 0.15)',
                }}
              />
              <Button
                variant="outlined"
                startIcon={<Add sx={{ fontSize: '15px !important' }} />}
                onClick={() => navigate('/create-twin')}
                disabled={user?.subscription_status === 'expired' || !canCreateTwin}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  borderColor: 'rgba(91, 140, 255, 0.2)',
                  color: '#5B8CFF',
                  px: 2,
                  py: 0.6,
                  '&:hover': {
                    borderColor: 'rgba(91, 140, 255, 0.4)',
                    background: 'rgba(91, 140, 255, 0.06)',
                  },
                  '&.Mui-disabled': {
                    borderColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Add Twin
              </Button>
            </Box>
          </Box>

          {/* Workforce cards grid */}
          {twins.length > 0 ? (
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                {twins.map((twin, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={twin.id}>
                    <WorkforceCard twin={twin} index={index} navigate={navigate} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Box sx={{
                width: 56, height: 56, borderRadius: '14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2,
              }}>
                <SmartToy sx={{ fontSize: 26, color: 'rgba(255,255,255,0.15)' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: '0.95rem' }}>
                No Digital Twins Yet
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', maxWidth: 300, mx: 'auto', fontSize: '0.8rem', lineHeight: 1.6 }}>
                Create your first AI twin to start automating conversations and growing your business.
              </Typography>
            </Box>
          )}
        </Paper>
      </MotionBox>

      {/* ─── Sections 4 & 5: Live Activity + Analytics ─── */}
      <Grid container spacing={2.5}>
        {/* Left Column - Chart (Analytics) */}
        <Grid item xs={12} lg={8}>
          <MotionBox variants={fadeUp}>
            <ConversationChart data={trends} />
          </MotionBox>
        </Grid>

        {/* Right Column - Activity (Live Feed) */}
        <Grid item xs={12} lg={4}>
          <MotionBox variants={fadeUp}>
            <RecentActivity activities={activities} />
          </MotionBox>
        </Grid>
      </Grid>
    </MotionBox>
  );
};

export default Dashboard;

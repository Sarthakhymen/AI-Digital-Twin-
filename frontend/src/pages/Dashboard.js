import React from 'react';
import { Grid, Typography, Box, Button, Card, CardContent, Paper, Chip, Alert, AlertTitle, IconButton, Skeleton } from '@mui/material';
import { Business, SmartToy, Chat, TrendingUp, IntegrationInstructions, Add, ArrowForward, Circle, AutoAwesome } from '@mui/icons-material';
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
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const getGlassyStyles = () => ({
  background: 'rgba(255, 255, 255, 0.015)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
});

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
          borderColor: 'rgba(148,163,184,0.3)',
          color: 'rgba(255,255,255,0.4)',
          fontWeight: 600,
          fontSize: '0.68rem',
          height: 22,
          borderRadius: '6px',
          letterSpacing: '0.06em'
        }
      };
    }
    if (status === 'active' && (plan === 'standard' || plan === 'business_pro' || plan === 'pro')) {
      const isPro = plan === 'business_pro' || plan === 'pro';
      return {
        label: isPro ? 'PRO' : 'STANDARD',
        icon: isPro ? <AutoAwesome sx={{ fontSize: '13px !important', color: '#07080C !important' }} /> : undefined,
        sx: {
          background: isPro
            ? 'linear-gradient(120deg, #FF6B35 0%, #FF3D71 100%)'
            : '#00D4FF',
          color: '#07080C',
          fontWeight: 800,
          fontSize: '0.68rem',
          letterSpacing: '0.07em',
          height: 24,
          border: 'none',
          borderRadius: '6px',
          boxShadow: isPro ? '0 4px 14px 0 rgba(255,107,53,0.4)' : '0 4px 14px 0 rgba(0,212,255,0.35)',
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
          <Skeleton variant="text" width={280} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Skeleton variant="text" width={200} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.03)' }} />
        </Box>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[0, 1, 2, 3].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.04)' }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.04)' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.04)' }} />
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
                mb: 3,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'rgba(239,68,68,0.3)',
                background: 'rgba(239, 68, 68, 0.06)',
                backdropFilter: 'blur(10px)',
              }}
              action={
                <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  onClick={() => navigate('/pricing')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    background: '#ef4444',
                    '&:hover': { background: '#dc2626' }
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
            <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px', border: '1px solid', borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245, 158, 11, 0.06)', backdropFilter: 'blur(10px)' }}>
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
                mb: 3,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'rgba(0,212,255,0.2)',
                background: 'rgba(0,212,255,0.05)',
                backdropFilter: 'blur(10px)',
              }}
              action={
                <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  onClick={() => navigate('/pricing')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    background: '#00D4FF',
                    color: '#07080C',
                    '&:hover': { background: '#00bce8' }
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

      {/* Header */}
      <MotionBox variants={fadeUp} sx={{ mb: 4 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          justifyContent: 'space-between',
          gap: 3
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 0.75 }}>
              <Typography variant="h4" sx={{
                fontWeight: 900,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.1rem' },
                letterSpacing: '-0.03em',
                color: '#ffffff',
                fontFamily: '"Inter", "Outfit", sans-serif',
                lineHeight: 1.15
              }}>
                {getGreeting()}{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : (user?.email ? `, ${user.email.split('@')[0]}` : '')}
              </Typography>
              {planBadge && <Chip {...planBadge} size="small" />}
            </Box>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.38)', fontWeight: 400, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
              Here's an overview of your digital twins' performance today.
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            gap: 1.5,
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'stretch', sm: 'flex-start' }
          }}>
            <Button
              variant="outlined"
              startIcon={<IntegrationInstructions sx={{ fontSize: '16px !important' }} />}
              onClick={() => navigate('/guide')}
              sx={{
                flex: { xs: 1, sm: 'initial' },
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                borderColor: 'rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.6)',
                px: 2.5,
                py: 0.9,
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  borderColor: 'rgba(0,212,255,0.35)',
                  background: 'rgba(0,212,255,0.04)',
                  color: '#00D4FF',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.25s ease',
              }}
            >
              Setup Guide
            </Button>
            <Button
              variant="contained"
              startIcon={<Add sx={{ fontSize: '17px !important' }} />}
              onClick={() => navigate('/create-twin')}
              disabled={user?.subscription_status === 'expired' || !canCreateTwin}
              disableElevation
              sx={{
                flex: { xs: 1, sm: 'initial' },
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                background: '#00D4FF',
                color: '#07080C',
                px: 2.5,
                py: 0.9,
                '&:hover': {
                  background: '#00bce8',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 0 20px rgba(0,212,255,0.3)'
                },
                '&.Mui-disabled': { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.2)' },
                transition: 'all 0.25s ease',
              }}
            >
              New Twin
            </Button>
          </Box>
        </Box>
      </MotionBox>

      {/* Stat Cards */}
      <MotionBox variants={fadeUp}>
        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Businesses" value={stats.total_businesses || 0} icon={<Business />} color="#00D4FF" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Digital Twins"
              value={stats.total_digital_twins || 0}
              limit={userFeatures?.max_twins === -1 ? '∞' : userFeatures?.max_twins}
              icon={<SmartToy />}
              color="#00FFB3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Messages"
              value={stats.total_messages || 0}
              limit={userFeatures?.max_messages === -1 ? '∞' : userFeatures?.max_messages}
              icon={<Chat />}
              color="#FF6B35"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Satisfaction" value={`${stats.average_satisfaction || 0}%`} icon={<TrendingUp />} color="#A78BFA" />
          </Grid>
        </Grid>
      </MotionBox>

      {/* Main Content Grid */}
      <Grid container spacing={2.5}>
        {/* Left Column - Twins + Chart */}
        <Grid item xs={12} lg={8}>
          <MotionBox variants={fadeUp}>
            {/* Twins Section */}
            <Paper
              elevation={0}
              sx={{
                ...getGlassyStyles(),
                borderRadius: '16px',
                mb: 2.5,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top accent line — electric cyan */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #00D4FF 30%, #00FFB3 70%, transparent)', opacity: 0.7 }} />

              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em', color: '#fff' }}>
                  Your Digital Twins
                </Typography>
                <Chip
                  label={`${twins.length} Active`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    bgcolor: 'rgba(0,255,179,0.08)',
                    color: '#00FFB3',
                    borderRadius: '6px',
                    border: '1px solid rgba(0,255,179,0.2)'
                  }}
                />
              </Box>

              {twins.length > 0 ? (
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={1.5}>
                    {twins.map((twin, index) => (
                      <Grid item xs={12} sm={6} key={twin.id}>
                        <MotionCard
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={{ y: -3, scale: 1.015 }}
                          elevation={0}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            '&:hover': {
                              borderColor: 'rgba(0,212,255,0.2)',
                              background: 'rgba(0,212,255,0.03)',
                            },
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            transition: 'all 0.25s ease',
                          }}
                          onClick={() => navigate(`/twins/${twin.id}`)}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                <Box sx={{
                                  width: 42, height: 42, borderRadius: '11px',
                                  background: twin.status === 'active' ? 'rgba(0,255,179,0.08)' : 'rgba(148,163,184,0.06)',
                                  border: `1px solid ${twin.status === 'active' ? 'rgba(0,255,179,0.2)' : 'rgba(148,163,184,0.12)'}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                  <SmartToy sx={{ fontSize: 22, color: twin.status === 'active' ? '#00FFB3' : '#94A3B8' }} />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mb: 0.4, color: '#fff' }}>
                                    {twin.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <Circle sx={{ fontSize: 7, color: twin.status === 'active' ? '#00FFB3' : '#94A3B8', filter: `drop-shadow(0 0 3px ${twin.status === 'active' ? '#00FFB3' : 'transparent'})` }} />
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize' }}>
                                      {twin.status}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <IconButton size="small" sx={{
                                bgcolor: 'rgba(255,255,255,0.04)',
                                color: 'rgba(255,255,255,0.3)',
                                width: 30,
                                height: 30,
                                '&:hover': { bgcolor: 'rgba(0,212,255,0.15)', color: '#00D4FF' },
                                transition: 'all 0.2s'
                              }}>
                                <ArrowForward sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </MotionCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Box sx={{
                    width: 64, height: 64, borderRadius: '16px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5,
                  }}>
                    <SmartToy sx={{ fontSize: 30, color: 'rgba(255,255,255,0.2)' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 0.75, fontSize: '1rem' }}>
                    No Digital Twins Yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.35)', maxWidth: 280, mx: 'auto', fontSize: '0.82rem', lineHeight: 1.6 }}>
                    Create your first digital twin to start automating conversations and growing your business.
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Chart */}
            <ConversationChart data={trends} />
          </MotionBox>
        </Grid>

        {/* Right Column - Activity */}
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



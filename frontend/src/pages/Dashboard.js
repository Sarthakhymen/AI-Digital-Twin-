import React from 'react';
import { Grid, Typography, Box, Button, Card, CardContent, Paper, Chip, Alert, AlertTitle, IconButton, Skeleton, useTheme } from '@mui/material';
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

// Staggered container
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
};

// Premium Clean Mixins
const getGlassyStyles = (theme) => ({
  background: theme.palette.mode === 'dark' ? '#0a0a0f' : '#ffffff',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
  boxShadow: theme.palette.mode === 'dark' ? '0 4px 24px -4px rgba(0, 0, 0, 0.3)' : '0 4px 24px -4px rgba(0, 0, 0, 0.05)',
});

const Dashboard = () => {
  const theme = useTheme();
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

    if (plan === 'free' && status === 'active') {
      return { 
        label: 'Trial', 
        variant: 'outlined', 
        sx: { 
          borderColor: 'rgba(148,163,184,0.4)', 
          color: 'text.secondary', 
          fontWeight: 600, 
          fontSize: '0.7rem', 
          height: 22,
          borderRadius: '8px'
        } 
      };
    }
    if (status === 'active' && (plan === 'standard' || plan === 'business_pro')) {
      const isPro = plan === 'business_pro';
      return {
        label: isPro ? 'PRO' : 'STANDARD',
        icon: isPro ? <AutoAwesome sx={{ fontSize: '14px !important', color: '#fff !important' }} /> : undefined,
        sx: {
          background: isPro ? 'linear-gradient(135deg, #FF0080 0%, #7928CA 100%)' : 'linear-gradient(135deg, #0070F3 0%, #00C6FF 100%)',
          color: 'white',
          fontWeight: 800,
          fontSize: '0.7rem',
          letterSpacing: '0.05em',
          height: 24,
          border: 'none',
          borderRadius: '8px',
          boxShadow: isPro ? '0 4px 14px 0 rgba(255, 0, 128, 0.39)' : '0 4px 14px 0 rgba(0, 112, 243, 0.39)',
        }
      };
    }
    return null;
  };

  const planBadge = getPlanLabel();

  // Greeting based on time
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
          <Skeleton variant="text" width={280} height={40} />
          <Skeleton variant="text" width={200} height={24} />
        </Box>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[0, 1, 2, 3].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: '24px' }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: '24px' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: '24px' }} />
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
                borderRadius: '16px', 
                border: '1px solid', 
                borderColor: 'error.main',
                background: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                backdropFilter: 'blur(10px)',
              }}
              action={
                <Button color="error" size="small" variant="contained" disableElevation sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)' }} onClick={() => navigate('/pricing')}>
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
            <Alert severity="warning" sx={{ mb: 3, borderRadius: '16px', border: '1px solid', borderColor: 'warning.main', background: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)', backdropFilter: 'blur(10px)' }}>
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
                borderRadius: '16px', 
                border: '1px solid', 
                borderColor: 'info.main',
                background: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                backdropFilter: 'blur(10px)',
              }}
              action={
                <Button color="info" size="small" variant="contained" disableElevation sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)' }} onClick={() => navigate('/pricing')}>
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
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 800, 
                fontSize: { xs: '1.75rem', md: '2.25rem' }, 
                letterSpacing: '-0.03em',
                color: 'text.primary',
                fontFamily: '"Outfit", sans-serif'
              }}>
                {getGreeting()}{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
              </Typography>
              {planBadge && <Chip {...planBadge} size="small" />}
            </Box>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: '1rem' }}>
              Here's an overview of your digital twins' performance today.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<IntegrationInstructions sx={{ fontSize: '18px !important' }} />}
              onClick={() => navigate('/guide')}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                color: 'text.primary',
                px: 2.5,
                backdropFilter: 'blur(10px)',
                '&:hover': { 
                  borderColor: 'primary.main', 
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
              }}
            >
              Setup Guide
            </Button>
            <Button
              variant="contained"
              startIcon={<Add sx={{ fontSize: '18px !important' }} />}
              onClick={() => navigate('/create-twin')}
              disabled={user?.subscription_status === 'expired' || !canCreateTwin}
              disableElevation
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: theme.palette.mode === 'dark' ? '#ffffff' : '#0a0a0f',
                color: theme.palette.mode === 'dark' ? '#0a0a0f' : '#ffffff',
                px: 3,
                '&:hover': { 
                  background: theme.palette.mode === 'dark' ? '#e2e8f0' : '#1e293b',
                  transform: 'translateY(-2px)'
                },
                '&.Mui-disabled': { background: 'action.disabledBackground', boxShadow: 'none' },
                transition: 'all 0.3s ease',
              }}
            >
              New Twin
            </Button>
          </Box>
        </Box>
      </MotionBox>

      {/* Stat Cards */}
      <MotionBox variants={fadeUp}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Businesses" value={stats.total_businesses || 0} icon={<Business />} color="#0070F3" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Digital Twins" 
              value={stats.total_digital_twins || 0} 
              limit={userFeatures?.max_twins === -1 ? '∞' : userFeatures?.max_twins} 
              icon={<SmartToy />} 
              color="#10B981" 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Messages" 
              value={stats.total_messages || 0} 
              limit={userFeatures?.max_messages === -1 ? '∞' : userFeatures?.max_messages} 
              icon={<Chat />} 
              color="#F59E0B" 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Satisfaction" value={`${stats.average_satisfaction || 0}%`} icon={<TrendingUp />} color="#7928CA" />
          </Grid>
        </Grid>
      </MotionBox>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Twins + Chart */}
        <Grid item xs={12} lg={8}>
          <MotionBox variants={fadeUp}>
            {/* Twins Section */}
            <Paper
              elevation={0}
              sx={{
                ...getGlassyStyles(theme),
                borderRadius: '24px',
                mb: 3,
                position: 'relative',
              }}
            >
              {/* Subtle top line */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#0070F3', opacity: 0.8 }} />
              
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
                  Your Digital Twins
                </Typography>
                <Chip 
                  label={`${twins.length} Active`} 
                  size="small" 
                  sx={{ 
                    fontWeight: 600, 
                    bgcolor: 'rgba(16, 185, 129, 0.1)', 
                    color: '#10B981',
                    borderRadius: '8px'
                  }} 
                />
              </Box>

              {twins.length > 0 ? (
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {twins.map((twin, index) => (
                      <Grid item xs={12} sm={6} key={twin.id}>
                        <MotionCard
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          elevation={0}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: '16px',
                            background: theme.palette.mode === 'dark' ? '#0f111a' : '#ffffff',
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                            '&:hover': { 
                              borderColor: 'rgba(255,255,255,0.12)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                          onClick={() => navigate(`/twins/${twin.id}`)}
                        >
                          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                                <Box sx={{
                                  width: 48, height: 48, borderRadius: '14px',
                                  background: twin.status === 'active' ? 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.05) 100%)' : 'rgba(148,163,184,0.1)',
                                  border: `1px solid ${twin.status === 'active' ? 'rgba(16,185,129,0.3)' : 'rgba(148,163,184,0.2)'}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                  <SmartToy sx={{ fontSize: 24, color: twin.status === 'active' ? '#10B981' : '#94A3B8' }} />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mb: 0.5 }}>
                                    {twin.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <Circle sx={{ fontSize: 8, color: twin.status === 'active' ? '#10B981' : '#94A3B8', filter: `drop-shadow(0 0 4px ${twin.status === 'active' ? '#10B981' : 'transparent'})` }} />
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                                      {twin.status}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <IconButton size="small" sx={{ 
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', 
                                color: 'text.secondary', 
                                '&:hover': { bgcolor: '#7928CA', color: 'white' },
                                transition: 'all 0.2s'
                              }}>
                                <ArrowForward sx={{ fontSize: 18 }} />
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
                    width: 72, height: 72, borderRadius: '20px', 
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5,
                  }}>
                    <SmartToy sx={{ fontSize: 36, color: 'text.disabled' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    No Digital Twins Yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 300, mx: 'auto' }}>
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


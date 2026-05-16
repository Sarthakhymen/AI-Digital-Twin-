import React from 'react';
import { Grid, Typography, Box, Button, Card, CardContent, Paper, Chip, Alert, AlertTitle, IconButton, Skeleton } from '@mui/material';
import { Business, SmartToy, Chat, TrendingUp, IntegrationInstructions, Add, ArrowForward, Circle } from '@mui/icons-material';
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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

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

    if (plan === 'free' && status === 'active') {
      return { label: 'Trial', variant: 'outlined', sx: { borderColor: 'rgba(148,163,184,0.4)', color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', height: 22 } };
    }
    if (status === 'active' && (plan === 'standard' || plan === 'business_pro')) {
      const isPro = plan === 'business_pro';
      return {
        label: isPro ? 'Pro' : 'Standard',
        sx: {
          bgcolor: isPro ? '#F43F5E' : '#3B82F6',
          color: 'white',
          fontWeight: 700,
          fontSize: '0.7rem',
          height: 22,
          border: 'none',
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
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[0, 1, 2, 3].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={100} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: '16px' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: '16px' }} />
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
              sx={{ mb: 2.5, borderRadius: '12px', border: '1px solid', borderColor: 'error.light' }}
              action={
                <Button color="error" size="small" variant="contained" disableElevation sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }} onClick={() => navigate('/pricing')}>
                  Upgrade
                </Button>
              }
            >
              <AlertTitle sx={{ fontWeight: 600 }}>Subscription Expired</AlertTitle>
              Your trial or subscription has expired. Upgrade to continue.
            </Alert>
          </motion.div>
        )}

        {user?.subscription_status === 'pending_verification' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Alert severity="warning" sx={{ mb: 2.5, borderRadius: '12px', border: '1px solid', borderColor: 'warning.light' }}>
              <AlertTitle sx={{ fontWeight: 600 }}>Payment Verification Pending</AlertTitle>
              Your Pro features will be unlocked within 12-24 hours after verification.
            </Alert>
          </motion.div>
        )}

        {!canCreateTwin && user?.subscription_status !== 'expired' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Alert
              severity="info"
              sx={{ mb: 2.5, borderRadius: '12px', border: '1px solid', borderColor: 'info.light' }}
              action={
                <Button color="info" size="small" variant="contained" disableElevation sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }} onClick={() => navigate('/pricing')}>
                  Upgrade
                </Button>
              }
            >
              <AlertTitle sx={{ fontWeight: 600 }}>Twin Limit Reached</AlertTitle>
              You've reached {userFeatures.max_twins} twins for your plan.
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <MotionBox variants={fadeUp} sx={{ mb: 3.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.75rem' }, letterSpacing: '-0.02em' }}>
                {getGreeting()}{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
              </Typography>
              {planBadge && <Chip {...planBadge} size="small" />}
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Here's what's happening with your digital twins today.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<IntegrationInstructions sx={{ fontSize: '18px !important' }} />}
              onClick={() => navigate('/guide')}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                borderColor: 'divider',
                color: 'text.secondary',
                px: 2,
                '&:hover': { borderColor: 'text.primary', color: 'text.primary' },
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
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                bgcolor: '#18181B',
                px: 2.5,
                '&:hover': { bgcolor: '#27272A' },
                '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
              }}
            >
              New Twin
            </Button>
          </Box>
        </Box>
      </MotionBox>

      {/* Stat Cards */}
      <MotionBox variants={fadeUp}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Businesses" value={stats.total_businesses || 0} icon={<Business />} color="#3B82F6" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Digital Twins" value={`${stats.total_digital_twins || 0} / ${userFeatures?.max_twins || '∞'}`} icon={<SmartToy />} color="#10B981" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Messages" value={`${stats.total_messages || 0} / ${userFeatures?.max_messages || '∞'}`} icon={<Chat />} color="#F59E0B" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Satisfaction" value={`${stats.average_satisfaction || 0}%`} icon={<TrendingUp />} color="#8B5CF6" />
          </Grid>
        </Grid>
      </MotionBox>

      {/* Main Content Grid */}
      <Grid container spacing={2.5}>
        {/* Left Column - Twins + Chart */}
        <Grid item xs={12} md={8}>
          <MotionBox variants={fadeUp}>
            {/* Twins Section */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                mb: 2.5,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  Your Digital Twins
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {twins.length} twin{twins.length !== 1 ? 's' : ''}
                </Typography>
              </Box>

              {twins.length > 0 ? (
                <Box sx={{ p: 1.5 }}>
                  <Grid container spacing={1.5}>
                    {twins.map((twin, index) => (
                      <Grid item xs={12} sm={6} key={twin.id}>
                        <MotionCard
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                          elevation={0}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': { borderColor: 'primary.main' },
                            transition: 'border-color 0.2s ease',
                          }}
                          onClick={() => navigate(`/twins/${twin.id}`)}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                <Box sx={{
                                  width: 36, height: 36, borderRadius: '10px',
                                  bgcolor: twin.status === 'active' ? '#10B98112' : '#94A3B812',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                  <SmartToy sx={{ fontSize: 18, color: twin.status === 'active' ? '#10B981' : '#94A3B8' }} />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {twin.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Circle sx={{ fontSize: 6, color: twin.status === 'active' ? '#10B981' : '#94A3B8' }} />
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', textTransform: 'capitalize' }}>
                                      {twin.status}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }}>
                                <ArrowForward sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </MotionCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ p: 5, textAlign: 'center' }}>
                  <Box sx={{
                    width: 56, height: 56, borderRadius: '16px', bgcolor: 'action.hover',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
                  }}>
                    <SmartToy sx={{ fontSize: 28, color: 'text.disabled' }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>
                    No digital twins yet
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Create your first twin to get started
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Chart */}
            <ConversationChart data={trends} />
          </MotionBox>
        </Grid>

        {/* Right Column - Activity */}
        <Grid item xs={12} md={4}>
          <MotionBox variants={fadeUp}>
            <RecentActivity activities={activities} />
          </MotionBox>
        </Grid>
      </Grid>
    </MotionBox>
  );
};

export default Dashboard;

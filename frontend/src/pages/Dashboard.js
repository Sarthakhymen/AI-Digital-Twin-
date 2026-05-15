import React from 'react';
import { Grid, Typography, Box, Button, Card, CardContent, Paper } from '@mui/material';
import { Business, SmartToy, Chat, TrendingUp, IntegrationInstructions } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import ConversationChart from '../components/ConversationChart';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertTitle } from '@mui/material';

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

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      {user?.subscription_status === 'expired' && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          <AlertTitle>Subscription Expired</AlertTitle>
          Your trial or subscription has expired. Please upgrade to Pro to continue using Nexora AI features.
          <Button 
            variant="contained" 
            color="error" 
            size="small" 
            sx={{ ml: 2, textTransform: 'none' }}
            onClick={() => navigate('/pricing')}
          >
            Upgrade Now
          </Button>
        </Alert>
      )}

      {user?.subscription_status === 'pending_verification' && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
          <AlertTitle>Payment Verification Pending</AlertTitle>
          We've received your payment submission. Your Pro features will be unlocked within 12-24 hours after verification.
        </Alert>
      )}

      {!canCreateTwin && user?.subscription_status !== 'expired' && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
          <AlertTitle>Digital Twin Limit Reached</AlertTitle>
          You have reached the limit of {userFeatures.max_twins} digital twins for your {userFeatures.plan} plan. 
          Upgrade to a higher plan to create more.
          <Button 
            variant="contained" 
            color="info" 
            size="small" 
            sx={{ ml: 2, textTransform: 'none' }}
            onClick={() => navigate('/pricing')}
          >
            Upgrade Plan
          </Button>
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button 
          variant="outlined" 
          startIcon={<IntegrationInstructions />}
          onClick={() => navigate('/guide')}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
        >
          View Setup Guide
        </Button>
      </Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Businesses"
            value={stats.total_businesses || 0}
            icon={<Business />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Digital Twins"
            value={`${stats.total_digital_twins || 0} / ${userFeatures?.max_twins || '∞'}`}
            icon={<SmartToy />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Messages"
            value={`${stats.total_messages || 0} / ${userFeatures?.max_messages || '∞'}`}
            icon={<Chat />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Satisfaction"
            value={`${stats.average_satisfaction || 0}%`}
            icon={<TrendingUp />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Digital Twins</Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/create-twin')}
              size="small"
              disabled={user?.subscription_status === 'expired' || !canCreateTwin}
            >
              Create Twin
            </Button>
          </Box>
          <Grid container spacing={2}>
            {twins.length > 0 ? twins.map((twin) => (
              <Grid item xs={12} sm={6} key={twin.id}>
                <Card 
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => navigate(`/twins/${twin.id}`)}
                >
                  <CardContent>
                    <Typography variant="subtitle1">{twin.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{twin.status}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                  <Typography color="text.secondary">No digital twins yet. Create one to get started!</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Conversation Trends</Typography>
          <ConversationChart data={trends} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentActivity activities={activities} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

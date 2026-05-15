import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Tabs, Tab, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [days, setDays] = useState(30);
  const { user, userFeatures } = useAuth();
  const navigate = useNavigate();

  const { data: conversationData } = useQuery({
    queryKey: ['analytics-conversations', days],
    queryFn: () => api.get(`/analytics/conversations?days=${days}`).then(res => res.data),
    enabled: !!userFeatures?.advanced_analytics && user?.subscription_status !== 'expired'
  });

  const { data: performanceData } = useQuery({
    queryKey: ['analytics-performance'],
    queryFn: () => api.get('/analytics/performance').then(res => res.data),
    enabled: !!userFeatures?.advanced_analytics && user?.subscription_status !== 'expired'
  });

  const { data: channelData } = useQuery({
    queryKey: ['analytics-channels', days],
    queryFn: () => api.get(`/analytics/channels?days=${days}`).then(res => res.data),
    enabled: !!userFeatures?.advanced_analytics && user?.subscription_status !== 'expired'
  });

  const trends = conversationData?.trends || [];
  const channels = channelData?.channels || [];
  const twins = performanceData?.digital_twins || [];

  const isLocked = !userFeatures?.advanced_analytics;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Analytics</Typography>
      
      {user?.subscription_status === 'expired' && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          <AlertTitle>Subscription Expired</AlertTitle>
          Your trial or subscription has expired. Please upgrade to Pro to view advanced analytics.
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

      {isLocked && user?.subscription_status !== 'expired' && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
          <AlertTitle>Feature Locked</AlertTitle>
          Advanced analytics is a Pro feature. Upgrade your plan to get detailed insights into your digital twins.
          <Button 
            variant="contained" 
            color="warning" 
            size="small" 
            sx={{ ml: 2, textTransform: 'none' }}
            onClick={() => navigate('/pricing')}
          >
            Upgrade Now
          </Button>
        </Alert>
      )}

      {user?.subscription_status !== 'expired' && !isLocked && (
        <>
      
      <FormControl sx={{ mb: 3, minWidth: 120 }}>
        <InputLabel>Time Period</InputLabel>
        <Select value={days} onChange={(e) => setDays(e.target.value)}>
          <MenuItem value={7}>Last 7 days</MenuItem>
          <MenuItem value={30}>Last 30 days</MenuItem>
          <MenuItem value={90}>Last 90 days</MenuItem>
        </Select>
      </FormControl>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Channels" />
        <Tab label="Performance" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Conversation Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="conversations" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Summary</Typography>
              <Typography variant="body1">Total Conversations: {conversationData?.total_conversations || 0}</Typography>
              <Typography variant="body1">Avg Duration: {conversationData?.average_duration || 0}s</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>Active Twins: {performanceData?.summary?.active_twins || 0}</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Channel Distribution</Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={channels}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="conversations"
                nameKey="channel"
              >
                {channels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Digital Twin Performance</Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={twins} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="twin_name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="total_conversations" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
        </>
      )}
    </Box>
  );
};

export default Analytics;

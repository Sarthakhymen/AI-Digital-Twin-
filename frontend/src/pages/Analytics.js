import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, useTheme, Card, CardContent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const COLORS = ['#6366F1', '#8B5CF6', '#14B8A6', '#F59E0B', '#EF4444'];

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', mb: 1 }}>
          Analytics Overview
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: '"Inter", sans-serif' }}>
          Actionable insights and performance metrics for your AI digital twins
        </Typography>
      </Box>
      
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
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Time Period</InputLabel>
          <Select 
            value={days} 
            onChange={(e) => setDays(e.target.value)}
            label="Time Period"
            sx={{
              color: '#fff',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366F1' },
              '.MuiSvgIcon-root ': { fill: 'white !important' }
            }}
          >
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={(e, v) => setActiveTab(v)} 
        sx={{ 
          mb: 4, 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontFamily: '"Outfit", sans-serif', textTransform: 'none', fontSize: '1rem' },
          '& .Mui-selected': { color: '#8B5CF6 !important', fontWeight: 600 },
          '& .MuiTabs-indicator': { backgroundColor: '#8B5CF6' }
        }}
      >
        <Tab label="Overview" />
        <Tab label="Channels" />
        <Tab label="Performance" />
      </Tabs>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', color: '#fff', height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', mb: 3 }}>Conversation Trends</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(18, 22, 41, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                          itemStyle={{ color: '#8B5CF6' }}
                        />
                        <Bar dataKey="conversations" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', color: '#fff', height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', mb: 3 }}>Summary</Typography>
                    
                    <Box sx={{ mb: 3, p: 2, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>Total Conversations</Typography>
                      <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#14B8A6' }}>{conversationData?.total_conversations || 0}</Typography>
                    </Box>

                    <Box sx={{ mb: 3, p: 2, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>Avg Duration</Typography>
                      <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#F59E0B' }}>{conversationData?.average_duration || 0}s</Typography>
                    </Box>

                    <Box sx={{ p: 2, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>Active Twins</Typography>
                      <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#8B5CF6' }}>{performanceData?.summary?.active_twins || 0}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <motion.div variants={itemVariants}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', color: '#fff' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', mb: 3 }}>Channel Distribution</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={channels}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={120}
                      innerRadius={80}
                      fill="#8884d8"
                      dataKey="conversations"
                      nameKey="channel"
                      paddingAngle={5}
                    >
                      {channels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(18, 22, 41, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div variants={itemVariants}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', color: '#fff' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', mb: 3 }}>Digital Twin Performance</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={twins} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                    <YAxis dataKey="twin_name" type="category" width={150} stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(18, 22, 41, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="total_conversations" fill="#14B8A6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
        </>
      )}
    </Box>
  );
};

export default Analytics;

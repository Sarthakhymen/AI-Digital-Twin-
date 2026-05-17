import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';

// Premium Clean Mixins
const getGlassyStyles = (theme) => ({
  background: theme.palette.mode === 'dark' ? '#0a0a0f' : '#ffffff',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
  boxShadow: theme.palette.mode === 'dark' ? '0 4px 24px -4px rgba(0, 0, 0, 0.3)' : '0 4px 24px -4px rgba(0, 0, 0, 0.05)',
});

const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        background: theme.palette.mode === 'dark' ? 'rgba(30, 30, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
        borderRadius: '12px',
        px: 2.5,
        py: 1.5,
        boxShadow: theme.palette.mode === 'dark' ? '0 4px 24px -4px rgba(0,0,0,0.5)' : '0 4px 24px -4px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#0070F3' }} />
        {payload[0].value} conversations
      </Typography>
    </Box>
  );
};

const ConversationChart = ({ data }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        ...getGlassyStyles(theme),
        p: 3,
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
          Conversation Trends
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 4, borderRadius: 2, background: '#0070F3' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
            Messages
          </Typography>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0070F3" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0070F3" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0070F3" />
              <stop offset="100%" stopColor="#00C6FF" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: theme.palette.mode === 'dark' ? '#94A3B8' : '#64748B', fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: theme.palette.mode === 'dark' ? '#94A3B8' : '#64748B', fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 112, 243, 0.3)', strokeWidth: 2, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="conversations"
            stroke="#0070F3"
            strokeWidth={2.5}
            fill="url(#colorConv)"
            dot={false}
            activeDot={{ r: 5, fill: '#0070F3', stroke: theme.palette.mode === 'dark' ? '#0a0a0f' : '#FFFFFF', strokeWidth: 2 }}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ConversationChart;

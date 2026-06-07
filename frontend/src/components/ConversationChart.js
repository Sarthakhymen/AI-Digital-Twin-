import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        background: 'rgba(7,8,12,0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,212,255,0.15)',
        borderRadius: '10px',
        px: 2.5,
        py: 1.5,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.68rem' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 800, color: '#ffffff', mt: 0.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.9rem' }}>
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#00D4FF', boxShadow: '0 0 6px #00D4FF' }} />
        {payload[0].value} conversations
      </Typography>
    </Box>
  );
};

const ConversationChart = ({ data }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        p: 3,
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top accent line */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #00D4FF 30%, #00FFB3 70%, transparent)', opacity: 0.6 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.98rem', letterSpacing: '-0.01em', color: '#fff' }}>
          Conversation Trends
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 14, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, #00D4FF, #00FFB3)' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 600 }}>
            Messages
          </Typography>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,212,255,0.25)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="conversations"
            stroke="#00D4FF"
            strokeWidth={2}
            fill="url(#colorConv)"
            dot={false}
            activeDot={{ r: 4, fill: '#00D4FF', stroke: '#07080C', strokeWidth: 2 }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ConversationChart;


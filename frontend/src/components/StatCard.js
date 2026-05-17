import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MotionCard = motion(Card);

// Simple SVG mini charts for visual effect
const MiniChart = ({ color, isPositive }) => {
  const pathData = isPositive 
    ? "M 0 40 Q 10 30, 20 35 T 40 20 T 60 25 T 80 5 T 100 10" 
    : "M 0 10 Q 10 20, 20 15 T 40 30 T 60 25 T 80 45 T 100 40";
  
  return (
    <svg width="100%" height="50" viewBox="0 0 100 50" preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
        <filter id={`glow-${color.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Filled Area */}
      <path 
        d={`${pathData} L 100 50 L 0 50 Z`} 
        fill={`url(#gradient-${color.replace('#', '')})`} 
      />
      
      {/* Line */}
      <path 
        d={pathData} 
        fill="none" 
        stroke={color} 
        strokeWidth="2.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${color.replace('#', '')})`}
      />
      
      {/* End Dot */}
      <circle cx="100" cy={isPositive ? "10" : "40"} r="3.5" fill={color} filter={`url(#glow-${color.replace('#', '')})`} />
    </svg>
  );
};

const StatCard = ({ title, value, icon, color, trend = 15 }) => {
  const isPositive = trend >= 0;
  
  const formatValue = (val) => {
    if (typeof val === 'number' && val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val;
  };

  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      sx={{
        height: '100%',
        borderRadius: '20px',
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.06)',
        background: '#121629',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'rgba(255,255,255,0.15)',
        }
      }}
    >
      {/* Top Gradient Highlight */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.7 }} />

      <CardContent sx={{ p: '24px !important', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* Header: Icon + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)`,
              border: `1px solid ${color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `inset 0 0 12px ${color}15`,
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 20, color: color, filter: `drop-shadow(0 0 4px ${color}80)` } })}
          </Box>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.9rem' }}
          >
            {title}
          </Typography>
        </Box>

        {/* Value + Chart Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 1 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, fontSize: '2.2rem', color: 'white', lineHeight: 1 }}
            >
              {formatValue(value)}
            </Typography>
            
            {/* Trend Indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: isPositive ? '#10B981' : '#EF4444' }}>
                {isPositive ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />}
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', ml: 0.5 }}>
                  {Math.abs(trend)}%
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                from last week
              </Typography>
            </Box>
          </Box>
          
          {/* Mini Chart */}
          <Box sx={{ width: '45%', height: 50, mb: 1 }}>
            <MiniChart color={color} isPositive={isPositive} />
          </Box>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default StatCard;

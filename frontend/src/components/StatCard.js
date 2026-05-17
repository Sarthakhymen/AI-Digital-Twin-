import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MotionCard = motion(Card);

const StatCard = ({ title, value, limit, icon, color, trend }) => {
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
        background: '#0a0a0f', // Cleaner, darker background for SaaS look
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        '&:hover': {
          borderColor: 'rgba(255,255,255,0.12)',
        }
      }}
    >
      {/* Top subtle border highlight instead of gradient glow */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color, opacity: 0.8 }} />

      <CardContent sx={{ p: '24px !important', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* Header: Icon + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
              border: `1px solid ${color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 20, color: color } })}
          </Box>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9rem', fontFamily: '"Outfit", sans-serif' }}
          >
            {title}
          </Typography>
        </Box>

        {/* Value Area */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, fontSize: '2.2rem', color: 'white', lineHeight: 1, fontFamily: '"Outfit", sans-serif' }}
              >
                {formatValue(value)}
              </Typography>
              {limit !== undefined && (
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, fontSize: '1.2rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1, fontFamily: '"Outfit", sans-serif' }}
                >
                  / {limit}
                </Typography>
              )}
            </Box>
            
            {/* Trend Indicator - only show if trend is actually provided */}
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, gap: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: isPositive ? '#10B981' : '#EF4444',
                  background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  {isPositive ? <TrendingUp size={14} strokeWidth={2.5} /> : <TrendingDown size={14} strokeWidth={2.5} />}
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', ml: 0.5 }}>
                    {Math.abs(trend)}%
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  vs last week
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default StatCard;

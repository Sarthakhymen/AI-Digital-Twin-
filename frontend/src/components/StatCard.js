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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        height: '100%',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.015)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.25s ease',
        '&:hover': {
          borderColor: `${color}22`,
          background: 'rgba(255,255,255,0.025)',
        }
      }}
    >
      {/* Top gradient line — slim, distinctive */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.9 }} />

      <CardContent sx={{ p: '20px !important', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        {/* Header: Icon + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '9px',
              background: `${color}12`,
              border: `1px solid ${color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 18, color: color } })}
          </Box>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500, fontSize: '0.82rem', fontFamily: '"Inter", sans-serif', letterSpacing: '0.01em' }}
          >
            {title}
          </Typography>
        </Box>

        {/* Value Area */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, fontSize: '2rem', color: '#ffffff', lineHeight: 1, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em' }}
            >
              {formatValue(value)}
            </Typography>
            {limit !== undefined && (
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, fontSize: '1.1rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1, fontFamily: '"Inter", sans-serif' }}
              >
                / {limit}
              </Typography>
            )}
          </Box>

          {trend !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, gap: 0.75 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                color: isPositive ? '#00FFB3' : '#EF4444',
                background: isPositive ? 'rgba(0,255,179,0.08)' : 'rgba(239,68,68,0.08)',
                padding: '2px 7px',
                borderRadius: '5px'
              }}>
                {isPositive ? <TrendingUp size={12} strokeWidth={2.5} /> : <TrendingDown size={12} strokeWidth={2.5} />}
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem', ml: 0.4 }}>
                  {Math.abs(trend)}%
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}>
                vs last week
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default StatCard;


import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const StatCard = ({ title, value, icon, color, trend }) => {
  const theme = useTheme();

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
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      sx={{
        height: '100%',
        borderRadius: '24px',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        background: theme.palette.mode === 'dark' ? 'rgba(20,20,25,0.4)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: theme.palette.mode === 'dark' ? `0 8px 32px 0 ${color}15` : `0 8px 32px 0 ${color}10`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          background: `linear-gradient(180deg, ${color} 0%, rgba(255,255,255,0.1) 100%)`,
          borderRadius: '24px 0 0 24px',
        },
        '&:hover': {
          borderColor: color,
        }
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: '2rem',
                lineHeight: 1.2,
                background: theme.palette.mode === 'dark' ? 'linear-gradient(to right, #ffffff, #a1a1aa)' : 'linear-gradient(to right, #18181b, #71717a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {formatValue(value)}
            </Typography>
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, gap: 0.75 }}>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    bgcolor: trend > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: trend > 0 ? '#10B981' : '#EF4444',
                    boxShadow: trend > 0 ? '0 0 10px rgba(16, 185, 129, 0.2)' : '0 0 10px rgba(239, 68, 68, 0.2)'
                  }}
                >
                  {trend > 0 ? '↑' : '↓'}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: trend > 0 ? '#10B981' : '#EF4444',
                  }}
                >
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
              border: `1px solid ${color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `inset 0 0 12px ${color}15`,
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 26, color: color, filter: `drop-shadow(0 0 6px ${color}60)` } })}
          </Box>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default StatCard;

import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Typography, Paper, Box, useTheme } from '@mui/material';
import { Chat, Business, SmartToy } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionListItem = motion(ListItem);

// Premium Clean Mixins
const getGlassyStyles = (theme) => ({
  background: theme.palette.mode === 'dark' ? '#0a0a0f' : '#ffffff',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
  boxShadow: theme.palette.mode === 'dark' ? '0 4px 24px -4px rgba(0, 0, 0, 0.3)' : '0 4px 24px -4px rgba(0, 0, 0, 0.05)',
});

const RecentActivity = ({ activities }) => {
  const theme = useTheme();

  const getIcon = (type) => {
    const iconMap = {
      conversation: { icon: <Chat />, color: '#0070F3', bg: 'rgba(0,112,243,0.1)', border: 'rgba(0,112,243,0.2)' },
      business: { icon: <Business />, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
      twin: { icon: <SmartToy />, color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
    };
    return iconMap[type] || iconMap.conversation;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        ...getGlassyStyles(theme),
        p: 0,
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle top line */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#10B981', opacity: 0.8 }} />

      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
          Recent Activity
        </Typography>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#10B981',
          }}
        />
      </Box>

      <List sx={{ py: 0 }}>
        <AnimatePresence>
          {activities?.length > 0 ? (
            activities.map((activity, index) => {
              const { icon, color, bg, border } = getIcon(activity.type);
              return (
                <MotionListItem
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    '&:last-child': { borderBottom: 'none' },
                    '&:hover': { 
                      background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    },
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: bg,
                        border: `1px solid ${border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `inset 0 0 8px ${border}`
                      }}
                    >
                      {React.cloneElement(icon, { sx: { fontSize: 18, color } })}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.description}
                    secondary={formatTime(activity.timestamp)}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      noWrap: true,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'text.secondary',
                      mt: 0.5
                    }}
                  />
                </MotionListItem>
              );
            })
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                No recent activity
              </Typography>
            </Box>
          )}
        </AnimatePresence>
      </List>
    </Paper>
  );
};

export default RecentActivity;

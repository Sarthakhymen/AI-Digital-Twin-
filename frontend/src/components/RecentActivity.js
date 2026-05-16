import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Typography, Paper, Box } from '@mui/material';
import { Chat, Business, SmartToy } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionListItem = motion(ListItem);

const RecentActivity = ({ activities }) => {
  const getIcon = (type) => {
    const iconMap = {
      conversation: { icon: <Chat />, color: '#3B82F6', bg: '#3B82F612' },
      business: { icon: <Business />, color: '#F59E0B', bg: '#F59E0B12' },
      twin: { icon: <SmartToy />, color: '#10B981', bg: '#10B98112' },
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
        p: 0,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
          Recent Activity
        </Typography>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#10B981',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
          }}
        />
      </Box>

      <List sx={{ py: 0 }}>
        <AnimatePresence>
          {activities?.length > 0 ? (
            activities.map((activity, index) => {
              const { icon, color, bg } = getIcon(activity.type);
              return (
                <MotionListItem
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'background 0.2s ease',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        bgcolor: bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(icon, { sx: { fontSize: 16, color } })}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.description}
                    secondary={formatTime(activity.timestamp)}
                    primaryTypographyProps={{
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      noWrap: true,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      color: 'text.disabled',
                    }}
                  />
                </MotionListItem>
              );
            })
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.disabled">
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

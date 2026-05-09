import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Typography, Paper } from '@mui/material';
import { Chat, Business, SmartToy } from '@mui/icons-material';

const RecentActivity = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'conversation': return <Chat color="primary" />;
      case 'business': return <Business color="secondary" />;
      case 'twin': return <SmartToy color="success" />;
      default: return <Chat />;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Recent Activity</Typography>
      <List dense>
        {activities?.map((activity, index) => (
          <ListItem key={index}>
            <ListItemIcon>{getIcon(activity.type)}</ListItemIcon>
            <ListItemText
              primary={activity.description}
              secondary={new Date(activity.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentActivity;

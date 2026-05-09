import React, { useState } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, TextField, Button, Switch, FormControlLabel,
  Divider, Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [notifications, setNotifications] = useState({
    email_alerts: true,
    weekly_reports: true,
    conversation_summaries: false
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Settings saved successfully!</Alert>}

      <Paper elevation={2}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Profile" />
          <Tab label="Notifications" />
          <Tab label="Security" />
        </Tabs>

        <Box sx={{ p: 4 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Profile Information</Typography>
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={profile.email}
                disabled
              />
              <TextField
                fullWidth
                label="Phone"
                margin="normal"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>Save Profile</Button>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
              <FormControlLabel
                control={<Switch checked={notifications.email_alerts} onChange={(e) => setNotifications({ ...notifications, email_alerts: e.target.checked })} />}
                label="Email alerts for new conversations"
              />
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={<Switch checked={notifications.weekly_reports} onChange={(e) => setNotifications({ ...notifications, weekly_reports: e.target.checked })} />}
                label="Weekly performance reports"
              />
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={<Switch checked={notifications.conversation_summaries} onChange={(e) => setNotifications({ ...notifications, conversation_summaries: e.target.checked })} />}
                label="Daily conversation summaries"
              />
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>Save Preferences</Button>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Change Password</Typography>
              <TextField fullWidth label="Current Password" type="password" margin="normal" />
              <TextField fullWidth label="New Password" type="password" margin="normal" />
              <TextField fullWidth label="Confirm New Password" type="password" margin="normal" />
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>Update Password</Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;

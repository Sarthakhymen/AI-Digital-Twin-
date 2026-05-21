import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Tabs, Tab, TextField, Button, Switch, FormControlLabel,
  Divider, Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: ''
  });
  const [security, setSecurity] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [preferences, setPreferences] = useState({
    email_alerts: true,
    weekly_reports: true,
    conversation_summaries: false
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || '',
        phone: user.phone || ''
      });
      if (user.preferences) {
        setPreferences({
          email_alerts: user.preferences.email_alerts !== false,
          weekly_reports: user.preferences.weekly_reports !== false,
          conversation_summaries: !!user.preferences.conversation_summaries
        });
      }
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setError(null);
      const res = await api.put('/auth/profile', {
        full_name: profile.full_name,
        phone: profile.phone
      });
      await updateUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to save profile information.');
    }
  };

  const handleSaveSecurity = async () => {
    if (!security.new_password) {
      setError('Please enter a new password.');
      return;
    }
    if (security.new_password !== security.confirm_password) {
      setError('New passwords do not match.');
      return;
    }
    try {
      setError(null);
      const res = await api.put('/auth/profile', {
        password: security.new_password
      });
      await updateUser(res.data);
      setSecurity({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to update password.');
    }
  };

  const handleSavePreferences = async (updatedPrefs) => {
    try {
      setError(null);
      const res = await api.put('/auth/preferences', updatedPrefs);
      await updateUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to save preferences.');
    }
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&.Mui-focused fieldset': { borderColor: '#6366F1' },
    }
  };

  const switchSx = {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#6366F1',
      '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.08)' },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#6366F1',
    },
    '& .MuiSwitch-track': {
      backgroundColor: 'rgba(255,255,255,0.2)',
    }
  };

  const buttonSx = {
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    textTransform: 'none',
    fontFamily: '"Outfit", sans-serif',
    fontWeight: 600,
    borderRadius: '12px',
    px: 4,
    py: 1.5,
    mt: 3,
    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
    '&:hover': {
      background: 'linear-gradient(135deg, #5046e5 0%, #7c3aed 100%)',
      boxShadow: '0 12px 20px rgba(99, 102, 241, 0.3)',
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: '"Inter", sans-serif' }}>
          Manage your account preferences and security
        </Typography>
      </Box>
      
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Alert severity="success" sx={{ mb: 3, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#34D399', '& .MuiAlert-icon': { color: '#34D399' } }}>
              Settings saved successfully!
            </Alert>
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', '& .MuiAlert-icon': { color: '#F87171' } }}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        color: '#fff',
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          sx={{ 
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            px: 2,
            pt: 1,
            '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontFamily: '"Outfit", sans-serif', textTransform: 'none', fontSize: '1rem', minHeight: 64 },
            '& .Mui-selected': { color: '#8B5CF6 !important', fontWeight: 600 },
            '& .MuiTabs-indicator': { backgroundColor: '#8B5CF6', height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="Preferences" />
        </Tabs>

        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 0 && (
                <Box maxWidth={600}>
                  <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', mb: 3, color: '#fff' }}>Profile Information</Typography>
                  <TextField
                    fullWidth
                    label="Full Name"
                    margin="normal"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
                    sx={textFieldSx}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={user?.email || ''}
                    disabled
                    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
                    sx={{
                      ...textFieldSx,
                      '& .MuiOutlinedInput-root.Mui-disabled fieldset': { borderColor: 'rgba(255,255,255,0.05)' },
                      '& .MuiOutlinedInput-root.Mui-disabled': { color: 'rgba(255,255,255,0.4)' }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    margin="normal"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
                    sx={textFieldSx}
                  />
                  <Button variant="contained" sx={buttonSx} onClick={handleSaveProfile}>Save Profile</Button>
                </Box>
              )}

              {activeTab === 1 && (
                <Box maxWidth={600}>
                  <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', mb: 3, color: '#fff' }}>Change Password</Typography>
                  <TextField 
                    fullWidth 
                    label="New Password" 
                    type="password" 
                    margin="normal" 
                    value={security.new_password}
                    onChange={(e) => setSecurity({ ...security, new_password: e.target.value })}
                    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
                    sx={textFieldSx}
                  />
                  <TextField 
                    fullWidth 
                    label="Confirm New Password" 
                    type="password" 
                    margin="normal" 
                    value={security.confirm_password}
                    onChange={(e) => setSecurity({ ...security, confirm_password: e.target.value })}
                    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
                    sx={textFieldSx}
                  />
                  <Button variant="contained" sx={buttonSx} onClick={handleSaveSecurity}>Update Password</Button>
                </Box>
              )}

              {activeTab === 2 && (
                <Box maxWidth={600}>
                  <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', mb: 3, color: '#fff' }}>Preferences</Typography>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={preferences.email_alerts} 
                        onChange={(e) => setPreferences({ ...preferences, email_alerts: e.target.checked })} 
                        sx={switchSx} 
                      />
                    }
                    label="Email Alerts"
                    sx={{ color: '#fff', mb: 2, display: 'block' }}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={preferences.weekly_reports} 
                        onChange={(e) => setPreferences({ ...preferences, weekly_reports: e.target.checked })} 
                        sx={switchSx} 
                      />
                    }
                    label="Weekly Reports"
                    sx={{ color: '#fff', mb: 2, display: 'block' }}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={preferences.conversation_summaries} 
                        onChange={(e) => setPreferences({ ...preferences, conversation_summaries: e.target.checked })} 
                        sx={switchSx} 
                      />
                    }
                    label="Daily Conversation Summaries"
                    sx={{ color: '#fff', mb: 2, display: 'block' }}
                  />
                  <Button variant="contained" sx={buttonSx} onClick={() => handleSavePreferences(preferences)}>Save Preferences</Button>
                </Box>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;

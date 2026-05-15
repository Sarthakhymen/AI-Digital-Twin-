import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, userFeatures, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box component={Link} to="/" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '45px', marginRight: '10px' }} />
          <Typography variant="h6">
            AI Digital Twin
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ width: 100, height: 40, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
        ) : user ? (
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/guide">Guide</Button>
            <Button color="inherit" component={Link} to="/businesses">Businesses</Button>
            {userFeatures?.advanced_analytics && (
              <Button color="inherit" component={Link} to="/analytics">Analytics</Button>
            )}
            {userFeatures?.voice_agent && (
              <Button color="inherit" component={Link} to="/voice-agent">Voice Agent</Button>
            )}
            <Button color="inherit" component={Link} to="/settings">Settings</Button>
            {(user.is_admin || ["sarthak2005shavarn@gmail.com", "nexora.aidigital.twin@gmail.com"].includes(user.email)) && (
              <Button color="inherit" component={Link} to="/admin" sx={{ fontWeight: 'bold', color: 'yellow' }}>Admin</Button>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/guide">Guide</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

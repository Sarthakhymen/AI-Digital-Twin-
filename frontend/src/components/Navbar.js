import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          AI Digital Twin Creator
        </Typography>
        {loading ? (
          <Box sx={{ width: 100, height: 40, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
        ) : user ? (
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/guide">Guide</Button>
            <Button color="inherit" component={Link} to="/businesses">Businesses</Button>
            <Button color="inherit" component={Link} to="/analytics">Analytics</Button>
            <Button color="inherit" component={Link} to="/settings">Settings</Button>
            {(user.is_admin || user.email === "nexora.aidigital.twin@gmail.com") && (
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

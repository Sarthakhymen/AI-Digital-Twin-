import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Typography, Box, Alert, 
  Link, IconButton, InputAdornment, Divider, useTheme, useMediaQuery 
} from '@mui/material';
import { Visibility, VisibilityOff, AutoAwesome } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignIn from '../components/GoogleSignIn';
import LoginLoading from '../components/LoginLoading';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, loading, login, setAuthData } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      bgcolor: '#F8FAFC',
      color: '#1E293B'
    }}>
      <LoginLoading open={isSubmitting} />
      {/* Left Side - Hero/Marketing (Hidden on Mobile) */}
      {!isMobile && (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          p: 8,
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <AutoAwesome sx={{ fontSize: 40, mr: 2, color: '#A5B4FC' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                AI Digital Twin
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, lineHeight: 1.1 }}>
              Scale your presence <br /> with Intelligence.
            </Typography>
            <Typography variant="h6" sx={{ color: '#E0E7FF', mb: 6, maxWidth: '500px', fontWeight: 400 }}>
              Create an AI version of yourself that handles your business communication 24/7.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>99%</Typography>
                <Typography variant="body2" sx={{ color: '#C7D2FE' }}>Response Rate</Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>24/7</Typography>
                <Typography variant="body2" sx={{ color: '#C7D2FE' }}>Availability</Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>10x</Typography>
                <Typography variant="body2" sx={{ color: '#C7D2FE' }}>Scale</Typography>
              </Box>
            </Box>
          </motion.div>
          
          {/* Decorative Circles */}
          <Box sx={{ 
            position: 'absolute', bottom: '-100px', right: '-100px', 
            width: '400px', height: '400px', borderRadius: '50%', 
            background: 'rgba(255,255,255,0.05)' 
          }} />
        </Box>
      )}

      {/* Right Side - Login Form */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        p: 4,
        bgcolor: '#FFFFFF'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '420px' }}
        >
          <Box sx={{ mb: 4, textAlign: isMobile ? 'center' : 'left' }}>
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <AutoAwesome sx={{ fontSize: 32, mr: 1, color: '#6366F1' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#6366F1' }}>
                  AI Digital Twin
                </Typography>
              </Box>
            )}
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
              Welcome back
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Sign in to manage your AI Digital Twin
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#334155' }}>Email Address</Typography>
            <TextField
              fullWidth
              placeholder="name@company.com"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ 
                mt: 0, mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#F8FAFC'
                }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>Password</Typography>
              <Link component={RouterLink} to="/forgot-password" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#6366F1', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </Box>
            <TextField
              fullWidth
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mt: 0, mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#F8FAFC'
                }
              }}
            />

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={{ 
                py: 1.5, 
                borderRadius: '12px', 
                fontSize: '1rem', 
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: '#4F46E5',
                boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
                '&:hover': {
                  bgcolor: '#4338CA',
                  boxShadow: '0 6px 20px rgba(79, 70, 229, 0.23)'
                }
              }}
            >
              Sign In
            </Button>
          </Box>

          <Box sx={{ mt: 4, mb: 3 }}>
            <Divider>
              <Typography variant="body2" sx={{ px: 2, color: '#94A3B8' }}>Or continue with</Typography>
            </Divider>
          </Box>

          <GoogleSignIn
            onLoginStart={() => setIsSubmitting(true)}
            onLoginSuccess={(data) => {
              setAuthData(data);
              navigate('/dashboard');
            }}
            onLoginError={(error) => {
              setError(error);
              setIsSubmitting(false);
            }}
          />

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" sx={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none' }}>
                Create an account
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Login;

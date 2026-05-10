import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Typography, Box, Alert, 
  Link, IconButton, InputAdornment, useTheme, useMediaQuery, Divider 
} from '@mui/material';
import { Visibility, VisibilityOff, AutoAwesome, CheckCircleOutline } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignIn from '../components/GoogleSignIn';

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, loading, register, login, setAuthData } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.full_name) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await register(formData);
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed after registration');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Registration failed. Please try again.');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      bgcolor: '#F8FAFC',
      color: '#1E293B'
    }}>
      {/* Left Side - Value Prop (Hidden on Mobile) */}
      {!isMobile && (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          p: 8,
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
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
              <AutoAwesome sx={{ fontSize: 40, mr: 2, color: '#DDD6FE' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                AI Digital Twin
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 4, lineHeight: 1.1 }}>
              Start your <br /> journey today.
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              {[
                "Setup your digital twin in minutes",
                "Train on your business documents",
                "Integrate with WhatsApp & Web",
                "Automate customer interactions"
              ].map((text, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                  <CheckCircleOutline sx={{ mr: 2, color: '#A78BFA' }} />
                  <Typography variant="h6" sx={{ fontWeight: 400, color: '#F5F3FF' }}>{text}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
          
          <Box sx={{ 
            position: 'absolute', top: '-50px', left: '-50px', 
            width: '300px', height: '300px', borderRadius: '50%', 
            background: 'rgba(255,255,255,0.03)' 
          }} />
        </Box>
      )}

      {/* Right Side - Registration Form */}
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
                <AutoAwesome sx={{ fontSize: 32, mr: 1, color: '#4F46E5' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#4F46E5' }}>
                  AI Digital Twin
                </Typography>
              </Box>
            )}
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
              Create an account
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Join 1000+ businesses scaling with AI
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#334155' }}>Full Name</Typography>
            <TextField
              fullWidth
              placeholder="John Doe"
              margin="normal"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              sx={{ mt: 0, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#F8FAFC' } }}
            />

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#334155' }}>Email Address</Typography>
            <TextField
              fullWidth
              placeholder="name@company.com"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ mt: 0, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#F8FAFC' } }}
            />

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#334155' }}>Phone Number (Optional)</Typography>
            <TextField
              fullWidth
              placeholder="+1 (555) 000-0000"
              margin="normal"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              sx={{ mt: 0, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#F8FAFC' } }}
            />
            
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#334155' }}>Password</Typography>
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
              sx={{ mt: 0, mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#F8FAFC' } }}
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
                '&:hover': { bgcolor: '#4338CA' }
              }}
            >
              Get Started
            </Button>
          </Box>

          <Box sx={{ mt: 4, mb: 3 }}>
            <Divider>
              <Typography variant="body2" sx={{ px: 2, color: '#94A3B8' }}>Or join with</Typography>
            </Divider>
          </Box>

          <GoogleSignIn
            onLoginSuccess={(data) => {
              setAuthData(data);
              navigate('/dashboard');
            }}
            onLoginError={(error) => setError(error)}
          />

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: '#4F46E5', fontWeight: 700, textDecoration: 'none' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Register;

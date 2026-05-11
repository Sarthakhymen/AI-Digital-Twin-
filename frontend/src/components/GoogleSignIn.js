import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, Box } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1';

const GoogleSignIn = ({ onLoginSuccess, onLoginError, onLoginStart }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        if (onLoginStart) onLoginStart();
        console.log('Google Auth success, exchanging code...');
        const response = await axios.post(`${API_URL}/auth/google`, {
          code: tokenResponse.code,
        });

        if (response.data && response.data.access_token) {
          onLoginSuccess(response.data);
        } else {
          onLoginError('Invalid response from server');
        }
      } catch (error) {
        console.error('Google exchange error:', error);
        const errorMsg = error.response?.data?.detail || 'Google authentication failed';
        onLoginError(errorMsg);
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      onLoginError('Google Login failed. Please try again.');
    },
    flow: 'auth-code',
  });

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={() => login()}
      startIcon={
        <Box
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          sx={{ width: 20, height: 20 }}
        >
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.002,0.003-0.003l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </Box>
      }
      sx={{
        py: 1.2,
        borderRadius: '12px',
        textTransform: 'none',
        borderColor: '#E2E8F0',
        color: '#475569',
        fontWeight: 600,
        fontSize: '0.95rem',
        '&:hover': {
          borderColor: '#CBD5E1',
          backgroundColor: '#F8FAFC',
        },
      }}
    >
      Continue with Google
    </Button>
  );
};

export default GoogleSignIn;

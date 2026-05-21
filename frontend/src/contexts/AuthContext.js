import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userFeatures, setUserFeatures] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFeatures = async (token) => {
    try {
      const response = await api.get('/auth/features', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserFeatures(response.data);
    } catch (err) {
      console.error("Failed to fetch user features:", err);
    }
  };

  const fetchUser = async (token) => {
    try {
      const [userRes] = await Promise.all([
        api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
        fetchFeatures(token)
      ]);
      setUser(userRes.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.access_token && response.data.user) {
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
        await fetchFeatures(response.data.access_token);
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: 'Invalid login response from server' };
      }
    } catch (error) {
      console.error('AuthContext login error:', error);
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserFeatures(null);
  };

  const setAuthData = async (data) => {
    localStorage.setItem('token', data.access_token);
    setUser(data.user);
    if (data.access_token) {
      await fetchFeatures(data.access_token);
    }
  };

  const updateUser = async (updatedUser) => {
    setUser(updatedUser);
    const token = localStorage.getItem('token');
    if (token) {
      await fetchFeatures(token);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userFeatures, login, register, logout, loading, setAuthData, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

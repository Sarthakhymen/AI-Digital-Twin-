import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Businesses from './pages/Businesses';
import CreateTwin from './pages/CreateTwin';
import DigitalTwinDetail from './pages/DigitalTwinDetail';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Legal from './pages/Legal';
import Docs from './pages/Docs';
import VoiceAgent from './pages/VoiceAgent';
import Pricing from './pages/Pricing';
import Guide from './pages/Guide';
import EmbedChat from './pages/EmbedChat';
import AdminDashboard from './admin/AdminDashboard';
import Leads from './pages/Leads';

import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Information Pages */}
        <Route path="/privacy" element={<Legal />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="/security" element={<Legal />} />
        <Route path="/documentation" element={<Docs />} />
        <Route path="/api-reference" element={<Docs />} />
        <Route path="/guides" element={<Docs />} />
        <Route path="/support" element={<Docs />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Public Embed Route (No Layout) */}
        <Route path="/embed/:twinId" element={<EmbedChat />} />

        {/* Authenticated Routes with Dashboard Layout */}
        <Route path="/*" element={
          <DashboardLayout>
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/businesses" element={<ProtectedRoute><Businesses /></ProtectedRoute>} />
              <Route path="/create-twin" element={<ProtectedRoute><CreateTwin /></ProtectedRoute>} />
              <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
              <Route path="/twins/:id" element={<ProtectedRoute><DigitalTwinDetail /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
              <Route path="/voice-agent" element={<ProtectedRoute><VoiceAgent /></ProtectedRoute>} />
            </Routes>
          </DashboardLayout>
        } />
      </Routes>
    </Box>
  );
}

export default App;

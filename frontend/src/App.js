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

        <Route path="/*" element={
          <>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/businesses" element={<ProtectedRoute><Businesses /></ProtectedRoute>} />
                <Route path="/create-twin" element={<ProtectedRoute><CreateTwin /></ProtectedRoute>} />
                <Route path="/twins/:id" element={<ProtectedRoute><DigitalTwinDetail /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              </Routes>
            </Box>
          </>
        } />
      </Routes>
    </Box>
  );
}

export default App;

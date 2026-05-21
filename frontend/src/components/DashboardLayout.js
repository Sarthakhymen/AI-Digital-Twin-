import React, { useState } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import { Search, Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#05050A' }}>
      {/* Sidebar — responsive drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: { xs: 0, lg: '260px' },
          width: '100%',
          overflowX: 'hidden',
          transition: 'padding 0.3s ease',
        }}
      >
        {/* Top Header Bar */}
        <Box
          sx={{
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, md: 4 },
            gap: 2,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            bgcolor: 'rgba(5, 5, 10, 0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Mobile Hamburguer Toggle */}
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{
              display: { xs: 'flex', lg: 'none' },
              color: 'rgba(255,255,255,0.7)',
              bgcolor: '#121629',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              p: 1,
              '&:hover': {
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            <Menu size={18} />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            {/* Search Bar */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: '#121629',
                border: `1px solid ${searchFocused ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '24px',
                px: 2,
                py: 0.75,
                width: { xs: 140, sm: 220, md: 260 },
                transition: 'all 0.2s ease',
              }}
            >
              <Search size={15} color="rgba(255,255,255,0.4)" />
              <InputBase
                placeholder="Search..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                sx={{
                  flex: 1,
                  fontSize: '0.825rem',
                  color: '#fff',
                  '& input::placeholder': { color: 'rgba(255,255,255,0.35)' },
                }}
              />
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  bgcolor: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '0.65rem',
                  px: 0.75,
                  py: 0.25,
                  borderRadius: '4px',
                  fontFamily: '"Outfit", sans-serif',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                }}
              >
                ⌘K
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Page Content */}
        <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 }, pt: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

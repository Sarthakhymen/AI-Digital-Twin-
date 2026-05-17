import React, { useState } from 'react';
import { Box, InputBase, IconButton, Badge } from '@mui/material';
import { Search, Bell } from 'lucide-react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#05050A' }}>
      {/* Sidebar — fixed 260px */}
      <Sidebar />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: '260px',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        {/* Top Header Bar */}
        <Box
          sx={{
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: 4,
            gap: 2,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            bgcolor: 'rgba(5, 5, 10, 0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
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
              width: 260,
              transition: 'border-color 0.2s ease',
            }}
          >
            <Search size={15} color="rgba(255,255,255,0.4)" />
            <InputBase
              placeholder="Search anything..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              sx={{
                flex: 1,
                fontSize: '0.875rem',
                color: '#fff',
                '& input::placeholder': { color: 'rgba(255,255,255,0.35)' },
              }}
            />
            <Box
              sx={{
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

          {/* Notification Bell */}
          <IconButton
            sx={{
              color: 'rgba(255,255,255,0.5)',
              bgcolor: '#121629',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              p: 1,
              '&:hover': {
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Badge
              badgeContent={3}
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: '#EF4444',
                  color: '#fff',
                  fontSize: '0.65rem',
                  minWidth: 16,
                  height: 16,
                  border: '2px solid #05050A',
                },
              }}
            >
              <Bell size={18} />
            </Badge>
          </IconButton>
        </Box>

        {/* Page Content */}
        <Box sx={{ p: 4, pt: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

import React, { useState } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import { Search, Menu, LayoutDashboard, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0F1117' }}>
      {/* Sidebar */}
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
            px: { xs: 2, md: 5 },
            gap: 2,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            bgcolor: 'rgba(15, 17, 23, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Mobile Menu Toggle */}
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{
              display: { xs: 'flex', lg: 'none' },
              color: 'rgba(255,255,255,0.6)',
              bgcolor: '#171B24',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '12px',
              p: 1,
              '&:hover': {
                color: '#fff',
                bgcolor: '#1D2330',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Menu size={18} />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, ml: 'auto' }}>
            {/* Search Bar - Premium */}
            <Box
              className="premium-search"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 0.65,
                width: { xs: 140, sm: 220, md: 280 },
              }}
            >
              <Search size={15} style={{ color: searchFocused ? '#5B8CFF' : 'rgba(255,255,255,0.3)' }} />
              <InputBase
                placeholder="Search..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                sx={{
                  flex: 1,
                  fontSize: '0.8rem',
                  color: '#fff',
                  '& input::placeholder': { color: 'rgba(255,255,255,0.3)', fontWeight: 400 },
                }}
              />
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  bgcolor: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.6rem',
                  px: 0.75,
                  py: 0.2,
                  borderRadius: '4px',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                }}
              >
                ⌘K
              </Box>
            </Box>

            {/* Profile Avatar Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 focus:outline-none bg-transparent border-0 cursor-pointer p-0"
                >
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.full_name || "Profile"}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 hover:ring-[#5B8CFF]/40 transition-all duration-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-1 ring-white/10 hover:ring-[#5B8CFF]/40 transition-all duration-200"
                      style={{ background: 'linear-gradient(135deg, #5B8CFF, #18C37E)' }}
                    >
                      <span className="text-white">{user.full_name ? user.full_name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}</span>
                    </div>
                  )}
                  <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-2.5 w-60 p-4 shadow-2xl z-20 flex flex-col gap-3"
                        style={{
                          background: 'rgba(23, 27, 36, 0.95)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: '14px',
                        }}
                      >
                        <div className="flex flex-col pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <span className="text-[9px] font-bold tracking-widest uppercase text-left" style={{ color: '#5B8CFF' }}>Account</span>
                          <span className="text-[13px] font-semibold text-white truncate mt-1.5 text-left">{user.full_name || 'User'}</span>
                          <span className="text-[11px] text-slate-500 truncate text-left">{user.email}</span>
                          {user.subscription_plan && (
                            <span className="inline-block self-start mt-2 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-md"
                              style={{ background: 'rgba(91, 140, 255, 0.1)', color: '#5B8CFF', border: '1px solid rgba(91, 140, 255, 0.15)' }}
                            >
                              {user.subscription_plan === 'business_pro' || user.subscription_plan === 'pro' ? 'Pro Plan' : user.subscription_plan === 'free' ? 'Free Trial' : 'Standard Plan'}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => { setDropdownOpen(false); navigate('/'); }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white transition-all text-left text-[12px] font-medium border-0 bg-transparent cursor-pointer"
                            style={{ hover: { background: 'rgba(255,255,255,0.04)' } }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <LayoutDashboard className="w-4 h-4" style={{ color: '#5B8CFF' }} />
                            Landing Page
                          </button>
                          <button
                            onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white transition-all text-left text-[12px] font-medium border-0 bg-transparent cursor-pointer"
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <Settings className="w-4 h-4 text-slate-500" />
                            Settings
                          </button>
                          <button
                            onClick={() => { setDropdownOpen(false); logout(); navigate('/'); }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left text-[12px] font-medium border-0 bg-transparent cursor-pointer"
                            style={{ color: '#F06060' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(240, 96, 96, 0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </Box>
        </Box>

        {/* Page Content */}
        <Box sx={{ p: { xs: 2.5, sm: 3, md: 5 }, pt: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, ml: 'auto' }}>
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

            {/* Profile Avatar Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 focus:outline-none focus:ring-0 bg-transparent border-0 cursor-pointer p-0"
                >
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.full_name || "Profile"}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 hover:ring-indigo-500/70 transition-all duration-300 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/30 hover:ring-indigo-500/70 transition-all duration-300 shadow-md">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                    </div>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 bg-slate-900/95 border border-white/10 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl z-20 flex flex-col gap-3"
                      >
                        <div className="flex flex-col border-b border-white/5 pb-3">
                          <span className="text-[10px] text-indigo-400 font-extrabold tracking-wider uppercase text-left">Account</span>
                          <span className="text-sm font-bold text-white truncate mt-1 text-left">{user.full_name || 'User'}</span>
                          <span className="text-[11px] text-slate-400 truncate text-left">{user.email}</span>
                          {user.subscription_plan && (
                            <span className="inline-block self-start mt-2 px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {user.subscription_plan === 'business_pro' || user.subscription_plan === 'pro' ? 'Pro Plan' : user.subscription_plan === 'free' ? 'Free Trial' : 'Standard Plan'}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => { setDropdownOpen(false); navigate('/'); }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left text-xs font-bold border-0 bg-transparent cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                            Landing Page
                          </button>
                          <button
                            onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left text-xs font-bold border-0 bg-transparent cursor-pointer"
                          >
                            <Settings className="w-4 h-4 text-purple-400" />
                            Settings
                          </button>
                          <button
                            onClick={() => { setDropdownOpen(false); logout(); navigate('/'); }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-350 hover:bg-rose-500/10 transition-all text-left text-xs font-bold border-0 bg-transparent cursor-pointer"
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
        <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 }, pt: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Settings, LayoutDashboard, BookOpen, Building2, ChartBar as BarChart3, Mic, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoIcon from './LogoIcon';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, userFeatures, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Guide', href: '/guide', icon: BookOpen },
    { name: 'Businesses', href: '/businesses', icon: Building2 },
    ...(userFeatures?.advanced_analytics ? [{ name: 'Analytics', href: '/analytics', icon: BarChart3 }] : []),
    ...(userFeatures?.voice_agent ? [{ name: 'Voice Agent', href: '/voice-agent', icon: Mic }] : []),
    { name: 'Settings', href: '/settings', icon: Settings },
    ...(user?.is_admin || ["sarthak2005shavarn@gmail.com", "nexora.aidigital.twin@gmail.com"].includes(user?.email) ? [{ name: 'Admin', href: '/admin', icon: Shield, special: true }] : [])
  ];

  const containerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <>
      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-[#0F1117]/90 backdrop-blur-2xl border-b border-white/[0.04] py-2.5'
          : 'bg-gradient-to-b from-[#0F1117] via-[#0F1117]/80 to-transparent backdrop-blur-xl py-4'
        }`}
      >
        {/* Subtle ambient glow */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(91, 140, 255, 0.08) 0%, transparent 70%)' }}
          animate={{ opacity: scrolled ? 0.6 : 0.3 }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group cursor-pointer relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5B8CFF, #18C37E)' }}>
                <LogoIcon className="h-5 w-auto text-white" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-white font-bold text-[14px] tracking-tight leading-tight">AI Digital Twin</span>
                <span className="text-[9px] font-medium tracking-wider uppercase" style={{ color: 'rgba(91, 140, 255, 0.5)' }}>Creator</span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              variants={itemVariants}
              className="hidden lg:flex items-center justify-center gap-1"
            >
              <div
                className="flex items-center gap-1 rounded-xl px-2 py-1.5"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    onClick={() => navigate(link.href)}
                    className={`relative px-3 py-1.5 text-[12px] font-semibold tracking-wide rounded-lg transition-all duration-200 flex items-center gap-2 ${
                      location.pathname === link.href
                        ? 'text-white'
                        : link.special
                          ? 'text-amber-400/60 hover:text-amber-400'
                          : 'text-slate-500 hover:text-white'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    {location.pathname === link.href && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(91, 140, 255, 0.1)', border: '1px solid rgba(91, 140, 255, 0.15)' }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <link.icon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">{link.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Right section - User Profile Dropdown */}
            <motion.div
              variants={itemVariants}
              className="flex-1 hidden lg:flex items-center justify-end gap-4"
            >
              {loading ? (
                <div className="h-9 w-28 bg-white/[0.03] animate-pulse rounded-xl" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none bg-transparent border-0 cursor-pointer p-0"
                  >
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={user.full_name || "Profile"}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 hover:ring-[#5B8CFF]/30 transition-all duration-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-1 ring-white/10 hover:ring-[#5B8CFF]/30 transition-all duration-200"
                        style={{ background: 'linear-gradient(135deg, #5B8CFF, #18C37E)' }}
                      >
                        <span className="text-white">{user.full_name ? user.full_name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}</span>
                      </div>
                    )}
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
                              onClick={() => { setDropdownOpen(false); handleLogout(); }}
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
              ) : (
                <div />
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              variants={itemVariants}
              className="lg:hidden text-white relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 relative" /> : <Menu className="w-5 h-5 relative" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 pt-24 px-6 lg:hidden overflow-y-auto"
            style={{ background: 'rgba(15, 17, 23, 0.97)', backdropFilter: 'blur(24px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8 flex justify-center"
            >
              <LogoIcon className="h-16 w-auto" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-2"
            >
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  onClick={() => { navigate(link.href); setMobileMenuOpen(false); }}
                  className={`text-base font-medium py-3.5 text-left px-5 rounded-xl transition-all flex items-center gap-3 ${
                    location.pathname === link.href
                      ? 'text-white border'
                      : link.special
                        ? 'text-amber-400/60 hover:text-amber-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                  style={location.pathname === link.href ? {
                    background: 'rgba(91, 140, 255, 0.08)',
                    borderColor: 'rgba(91, 140, 255, 0.15)',
                  } : {}}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.04 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-3 mt-4 pt-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
              >
                {loading ? (
                  <div className="h-12 w-full bg-white/[0.03] animate-pulse rounded-xl" />
                ) : user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-left"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ background: 'linear-gradient(135deg, #5B8CFF, #18C37E)' }}>
                          <span className="text-white">{user.full_name ? user.full_name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}</span>
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white truncate">{user.full_name || 'User'}</span>
                        <span className="text-[11px] text-slate-500 truncate">{user.email}</span>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm transition-all"
                      style={{ background: 'rgba(240, 96, 96, 0.1)', color: '#F06060', border: '1px solid rgba(240, 96, 96, 0.15)' }}
                      whileHover={{ background: 'rgba(240, 96, 96, 0.15)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                      Logout
                    </motion.button>
                  </>
                ) : null}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

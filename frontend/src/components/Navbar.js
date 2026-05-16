import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Zap, MessageSquare, Brain, ArrowRight, Settings, LayoutDashboard, BookOpen, Building2, BarChart3, Mic, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoIcon from './LogoIcon';

// AI Assistant Visualization Component
const AIAssistantVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { icon: MessageSquare, label: 'User Request', color: 'from-blue-400 to-cyan-400' },
    { icon: Brain, label: 'AI Processing', color: 'from-purple-400 to-pink-400' },
    { icon: Zap, label: 'Instant Answer', color: 'from-green-400 to-emerald-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3"
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          <motion.div
            animate={{
              scale: currentStep === index ? [1, 1.1, 1] : 1,
              opacity: currentStep === index ? 1 : 0.5
            }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{
                boxShadow: currentStep === index
                  ? '0 0 20px rgba(99, 102, 241, 0.5)'
                  : '0 0 0px rgba(99, 102, 241, 0)'
              }}
              className={`relative p-2 rounded-xl bg-gradient-to-br ${step.color}`}
            >
              <step.icon className="w-4 h-4 text-white" />
              {currentStep === index && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
            <span className="text-xs font-medium text-white/90">{step.label}</span>
          </motion.div>
          {index < steps.length - 1 && (
            <motion.div
              animate={{
                x: currentStep === index ? [0, 5, 0] : 0,
                opacity: currentStep === index ? 1 : 0.3
              }}
              transition={{ duration: 0.5 }}
            >
              <ArrowRight className="w-4 h-4 text-white/40" />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled
          ? 'bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-2xl border-b border-white/5 py-3'
          : 'bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-xl border-b border-white/5 py-4'
          }`}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0"
          animate={{ opacity: scrolled ? 1 : 0.5 }}
          transition={{ duration: 0.5 }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-b from-indigo-500/20 to-transparent blur-3xl"
          animate={{ opacity: scrolled ? 0.5 : 0.3 }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Left with enhanced animation */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group cursor-pointer relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative"
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <LogoIcon className="h-12 w-auto" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

            </motion.div>

            {/* Desktop Navigation - Center with billboard style */}
            <motion.div
              variants={itemVariants}
              className="hidden lg:flex items-center justify-center gap-1"
            >
              <div className="relative">
                {/* Glassmorphism container */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-50"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative flex items-center gap-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      onHoverStart={() => setHoveredLink(link.name)}
                      onHoverEnd={() => setHoveredLink(null)}
                    >
                      <motion.button
                        onClick={() => navigate(link.href)}
                        className={`relative px-3 py-2 text-[12px] font-semibold tracking-wide rounded-xl transition-all duration-300 flex items-center gap-2 ${location.pathname === link.href
                          ? 'text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
                          : link.special
                            ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        whileHover={{ y: -2, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.name}
                        {hoveredLink === link.name && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl"
                            layoutId="hoverBackground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right section - Logout */}
            <motion.div
              variants={itemVariants}
              className="flex-1 hidden lg:flex items-center justify-end gap-4"
            >

              {loading ? (
                <motion.div
                  className="h-12 w-32 bg-white/5 animate-pulse rounded-2xl"
                  whileHover={{ scale: 1.02 }}
                />
              ) : (
                <motion.button
                  onClick={handleLogout}
                  className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl text-[13px] font-bold overflow-hidden"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="relative flex items-center gap-2">
                    Logout
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.button>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              variants={itemVariants}
              className="lg:hidden text-white relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-xl opacity-0"
                animate={{ opacity: mobileMenuOpen ? 0.3 : 0 }}
              />
              {mobileMenuOpen ? <X className="w-6 h-6 relative" /> : <Menu className="w-6 h-6 relative" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu with enhanced animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-28 px-6 lg:hidden overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8 flex justify-center"
            >
              <motion.div
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <LogoIcon className="h-20 w-auto" />
              </motion.div>
            </motion.div>



            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4"
            >
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  onClick={() => { navigate(link.href); setMobileMenuOpen(false); }}
                  className={`text-xl font-medium py-4 text-left px-6 rounded-2xl transition-all flex items-center gap-3 ${location.pathname === link.href
                    ? 'text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
                    : link.special
                      ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
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
                className="flex flex-col gap-4 mt-6 pt-6 border-t border-slate-800"
              >
                {loading ? (
                  <div className="h-14 w-full bg-slate-800 animate-pulse rounded-2xl" />
                ) : (
                  <motion.button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                    Logout
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

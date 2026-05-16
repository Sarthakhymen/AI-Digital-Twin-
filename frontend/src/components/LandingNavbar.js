import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Zap, MessageSquare, Brain, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoIcon from './LogoIcon';

const AIAssistantVisualization = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let mounted = true;
    const runAnimation = async () => {
      while (mounted) {
        setMessages([]);
        setIsTyping(false);
        await new Promise(r => setTimeout(r, 1000));
        if (!mounted) break;
        
        setMessages([{ role: 'user', content: "What's the pricing of butter naan?" }]);
        setIsTyping(true);
        
        await new Promise(r => setTimeout(r, 1500));
        if (!mounted) break;
        
        setIsTyping(false);
        setMessages([
          { role: 'user', content: "What's the pricing of butter naan?" },
          { role: 'assistant', content: "Butter naan is ₹45." }
        ]);
        
        await new Promise(r => setTimeout(r, 4000));
      }
    };
    runAnimation();
    return () => { mounted = false; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="hidden xl:flex items-center justify-center bg-slate-900 dark:bg-white/10 backdrop-blur-xl border-[4px] border-slate-800 dark:border-white/20 rounded-[2rem] p-1 shadow-2xl relative w-72 h-[4.5rem] overflow-hidden mr-4"
    >
      {/* Smartphone Notch Simulation (Landscape mode) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-10 bg-slate-800 dark:bg-white/20 rounded-r-2xl z-10 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-black/50"></div>
      </div>
      
      <div className="w-full h-full bg-slate-50 dark:bg-[#0a0a0a] rounded-[1.5rem] overflow-hidden flex flex-col p-2 gap-1.5 relative justify-center pl-6">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`max-w-[85%] text-[11px] font-medium leading-tight px-3 py-1.5 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white self-end rounded-br-sm shadow-sm'
                  : 'bg-white dark:bg-white/10 text-slate-800 dark:text-slate-200 self-start rounded-bl-sm border border-slate-100 dark:border-white/5 shadow-sm'
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-white/10 border border-slate-100 dark:border-white/5 text-slate-800 dark:text-slate-200 self-start rounded-2xl rounded-bl-sm px-3 py-1.5 flex gap-1 items-center h-[28px] shadow-sm"
            >
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const navLinks = [
    { name: 'Product', href: '/#features', type: 'scroll' },
    { name: 'Pricing', href: '/pricing', type: 'route' },
    { name: 'Guide', href: '/guide', type: 'route' },
    ...(user ? [
      { name: 'Dashboard', href: '/dashboard', type: 'route' },
      { name: 'Analytics', href: '/analytics', type: 'route' }
    ] : [])
  ];

  const handleNavClick = (link) => {
    if (link.type === 'route') {
      navigate(link.href);
    } else {
      if (location.pathname === '/') {
        const id = link.href.split('#')[1];
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(link.href);
      }
    }
    setMobileMenuOpen(false);
  };

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
          ? 'bg-gradient-to-b from-white/90 via-white/80 dark:from-black/80 dark:via-black/60 to-transparent backdrop-blur-2xl py-3'
          : 'bg-transparent py-6'
          }`}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0"
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-b from-indigo-500/20 to-transparent blur-3xl"
          animate={{ opacity: scrolled ? 0.5 : 0.2 }}
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
                <div className="relative flex items-center gap-2 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-3">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      onHoverStart={() => setHoveredLink(link.name)}
                      onHoverEnd={() => setHoveredLink(null)}
                    >
                      <motion.button
                        onClick={() => handleNavClick(link)}
                        className={`relative px-4 py-2 text-[13px] font-semibold tracking-wide rounded-xl transition-all duration-300 ${(location.pathname === link.href || (location.pathname === '/' && link.type === 'scroll'))
                          ? 'text-slate-900 dark:text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        whileHover={{ y: -2, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
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

            {/* Right section - AI Visualization + CTA */}
            <motion.div
              variants={itemVariants}
              className="flex-1 hidden lg:flex items-center justify-end gap-4"
            >
              <AIAssistantVisualization />

              {loading ? (
                <motion.div
                  className="h-12 w-32 bg-slate-200 dark:bg-white/5 animate-pulse rounded-2xl"
                  whileHover={{ scale: 1.02 }}
                />
              ) : user ? (
                <>
                  <motion.button
                    onClick={() => navigate('/dashboard')}
                    className="group relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl text-[13px] font-bold overflow-hidden"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="relative flex items-center gap-2">
                      Dashboard
                      <Sparkles className="w-4 h-4" />
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={() => { logout(); navigate('/'); }}
                    className="px-4 py-3 text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => navigate('/login')}
                    className="px-4 py-3 text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign in
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/register')}
                    className="group relative px-6 py-3 bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl text-[13px] font-bold overflow-hidden hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 255, 255, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative flex items-center gap-2">
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              variants={itemVariants}
              className="lg:hidden text-slate-900 dark:text-white relative"
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
            className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-3xl pt-28 px-6 lg:hidden overflow-y-auto"
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

            {/* Mobile AI Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 flex justify-center"
            >
              <AIAssistantVisualization />
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
                  onClick={() => handleNavClick(link)}
                  className={`text-xl font-medium py-4 text-left px-6 rounded-2xl transition-all ${(location.pathname === link.href || (location.pathname === '/' && link.type === 'scroll'))
                    ? 'text-slate-900 dark:text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.name}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800"
              >
                {loading ? (
                  <div className="h-14 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
                ) : user ? (
                  <>
                    <motion.button
                      onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles className="w-5 h-5" />
                      Dashboard
                    </motion.button>
                    <motion.button
                      onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}
                      className="text-center text-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                      className="text-center text-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign in
                    </motion.button>
                    <motion.button
                      onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                      className="w-full py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-semibold flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNavbar;

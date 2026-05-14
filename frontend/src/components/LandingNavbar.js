import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoIcon from './LogoIcon';

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center p-1.5 rounded-xl bg-slate-800/80 border border-slate-700/50 shadow-lg shadow-rose-500/10 backdrop-blur-md">
                <LogoIcon className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                AI Twin
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className={`text-sm transition-colors duration-200 ${
                    (location.pathname === link.href || (location.pathname === '/' && link.type === 'scroll'))
                      ? 'text-white font-semibold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  whileHover={{ y: -1 }}
                >
                  {link.name}
                </motion.button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {loading ? (
                <div className="h-10 w-24 bg-slate-800/50 animate-pulse rounded-lg" />
              ) : user ? (
                <>
                  <motion.button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-rose-600 hover:to-red-700 transition-all shadow-lg shadow-rose-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Dashboard
                  </motion.button>
                  <motion.button
                    onClick={() => { logout(); navigate('/'); }}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => navigate('/login')}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign in
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 glass-dark pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="text-xl text-slate-300 hover:text-white py-2 text-left font-medium"
                >
                  {link.name}
                </button>
              ))}
              <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-slate-800">
                {loading ? (
                  <div className="h-12 w-full bg-slate-800 animate-pulse rounded-xl" />
                ) : user ? (
                  <>
                    <button
                      onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                      className="w-full py-4 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-semibold"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}
                      className="text-center text-lg text-slate-400 hover:text-white py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                      className="text-center text-lg text-slate-300 hover:text-white py-2"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                      className="w-full py-4 bg-white text-slate-900 rounded-xl font-semibold"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNavbar;

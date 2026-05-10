import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Menu, X } from 'lucide-react';

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Product', href: '/#features', type: 'link' },
    { name: 'Solutions', href: '/#solutions', type: 'link' },
    { name: 'Dashboard', href: '/dashboard', type: 'route' },
    { name: 'Analytics', href: '/analytics', type: 'route' }
  ];

  const handleNavClick = (link) => {
    if (link.type === 'route') {
      navigate(link.href);
    } else {
      if (window.location.pathname === '/') {
        const element = document.querySelector(link.href.replace('/', ''));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(link.href);
      }
    }
    setMobileMenuOpen(false);
  };

  return (
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              AI Twin
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="h-4 w-px bg-slate-800 mx-2" />
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-white text-slate-950 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors shadow-lg shadow-white/5"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Placeholder - kept simple for now */}
      {mobileMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 p-6 border-t border-slate-800 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className="text-lg font-medium text-slate-300 text-left"
              >
                {link.name}
              </button>
            ))}
            <hr className="border-slate-800" />
            <button onClick={() => navigate('/login')} className="text-lg font-medium text-slate-300 text-left">Sign In</button>
            <button onClick={() => navigate('/register')} className="px-6 py-3 bg-white text-slate-950 rounded-xl font-bold">Get Started</button>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default LandingNavbar;

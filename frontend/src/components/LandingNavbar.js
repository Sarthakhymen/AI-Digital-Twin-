import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoIcon from './LogoIcon';

const EASE = [0.16, 1, 0.3, 1];

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '/#features', type: 'scroll' },
    { name: 'Pricing', href: '/pricing', type: 'route' },
    { name: 'Guide', href: '/guide', type: 'route' },
    ...(user ? [{ name: 'Dashboard', href: '/dashboard', type: 'route' }] : []),
  ];

  const handleNav = (link) => {
    if (link.type === 'route') {
      navigate(link.href);
    } else if (location.pathname === '/') {
      const el = document.getElementById(link.href.split('#')[1]);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(link.href);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(11,10,9,0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(247,243,236,0.07)' : '1px solid transparent',
          paddingTop: scrolled ? 10 : 18,
          paddingBottom: scrolled ? 10 : 18,
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center p-1.5 rounded-xl transition-colors" style={{ background: 'rgba(245,166,35,0.1)' }}>
              <LogoIcon className="h-7 w-auto" />
            </div>
            <span className="text-paper font-bold text-[15px] tracking-tight hidden sm:block">Askly</span>
          </button>

          {/* Center links */}
          <div className="hidden lg:flex items-center gap-1 rounded-full px-2 py-1.5"
            style={{ background: 'rgba(247,243,236,0.03)', border: '1px solid rgba(247,243,236,0.07)' }}>
            {navLinks.map((link) => {
              const active = location.pathname === link.href || (location.pathname === '/' && link.type === 'scroll');
              return (
                <button
                  key={link.name}
                  onClick={() => handleNav(link)}
                  className={`relative px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all ${
                    active ? 'text-[#0B0A09]' : 'text-paper/65 hover:text-paper'
                  }`}
                  style={active ? { background: 'linear-gradient(100deg,#FFC56B,#F5A623)' } : {}}
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-24 rounded-full animate-pulse" style={{ background: 'rgba(247,243,236,0.06)' }} />
            ) : user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-amber/40 hover:ring-amber transition-all" />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-[#0B0A09] ring-2 ring-amber/40"
                      style={{ background: 'linear-gradient(135deg,#FFC56B,#F5A623)' }}>
                      {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }} transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-64 rounded-2xl p-4 shadow-2xl z-20 flex flex-col gap-3"
                        style={{ background: 'rgba(18,17,16,0.96)', border: '1px solid rgba(247,243,236,0.1)', backdropFilter: 'blur(20px)' }}
                      >
                        <div className="flex flex-col border-b border-paper/8 pb-3">
                          <span className="text-[10px] text-amber font-extrabold tracking-wider uppercase">Account</span>
                          <span className="text-sm font-bold text-paper truncate mt-1">{user.full_name || 'User'}</span>
                          <span className="text-[11px] text-paper/45 truncate">{user.email}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-paper/70 hover:text-paper hover:bg-paper/5 transition-all text-left text-xs font-bold">
                            <LayoutDashboard className="w-4 h-4 text-amber" /> Dashboard
                          </button>
                          <button onClick={() => { setDropdownOpen(false); navigate('/settings'); }} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-paper/70 hover:text-paper hover:bg-paper/5 transition-all text-left text-xs font-bold">
                            <Settings className="w-4 h-4 text-coral" /> Settings
                          </button>
                          <button onClick={() => { setDropdownOpen(false); logout(); navigate('/'); }} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-coral hover:bg-coral/10 transition-all text-left text-xs font-bold">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="px-4 py-2 text-[13px] font-semibold text-paper/65 hover:text-paper transition-colors link-underline">
                  Sign in
                </button>
                <motion.button
                  onClick={() => navigate('/register')}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="btn-shine group px-5 py-2.5 rounded-full text-[13px] font-bold text-[#0B0A09] flex items-center gap-2"
                  style={{ background: 'linear-gradient(100deg,#FFC56B,#F5A623 60%,#FF6B5E)' }}
                >
                  Get started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden text-paper" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pt-24 px-6 lg:hidden overflow-y-auto"
            style={{ background: 'rgba(11,10,9,0.97)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                  onClick={() => handleNav(link)}
                  className="text-left text-xl font-semibold py-4 px-5 rounded-2xl text-paper/75 hover:text-paper transition-all"
                  style={{ background: 'rgba(247,243,236,0.03)', border: '1px solid rgba(247,243,236,0.06)' }}
                >
                  {link.name}
                </motion.button>
              ))}
              <div className="mt-4 pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(247,243,236,0.08)' }}>
                {user ? (
                  <>
                    <button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} className="w-full py-4 rounded-2xl font-bold text-[#0B0A09]" style={{ background: 'linear-gradient(100deg,#FFC56B,#F5A623)' }}>
                      Dashboard
                    </button>
                    <button onClick={() => { logout(); navigate('/'); setMobileOpen(false); }} className="text-center py-3 text-paper/60 hover:text-paper">Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="text-center py-3 text-paper/65 hover:text-paper">Sign in</button>
                    <button onClick={() => { navigate('/register'); setMobileOpen(false); }} className="w-full py-4 rounded-2xl font-bold text-[#0B0A09] flex items-center justify-center gap-2" style={{ background: 'linear-gradient(100deg,#FFC56B,#F5A623,#FF6B5E)' }}>
                      Get started <ArrowRight className="w-5 h-5" />
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

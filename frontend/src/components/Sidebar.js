import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, CirclePlus as PlusCircle, Users, ChartBar as BarChart3, BookOpen, Mic, Settings, Shield, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoIcon from './LogoIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userFeatures } = useAuth();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Businesses', href: '/businesses', icon: Building2 },
    { name: 'Create Twin', href: '/create-twin', icon: PlusCircle },
    { name: 'Leads', href: '/leads', icon: Users },
    ...(userFeatures?.advanced_analytics ? [{ name: 'Analytics', href: '/analytics', icon: BarChart3 }] : []),
    { name: 'Setup Guide', href: '/guide', icon: BookOpen },
    ...(userFeatures?.voice_agent ? [{ name: 'Voice Agent', href: '/voice-agent', icon: Mic }] : []),
    { name: 'Settings', href: '/settings', icon: Settings },
    ...(user?.is_admin || ["sarthak2005shavarn@gmail.com", "nexora.aidigital.twin@gmail.com"].includes(user?.email) ? [{ name: 'Admin', href: '/admin', icon: Shield, special: true }] : [])
  ];

  const planName = (user?.subscription_plan === 'free' || user?.subscription_plan === 'starter')
    ? 'Free Trial'
    : user?.subscription_plan === 'standard'
      ? 'Standard'
      : 'Business Pro';
  const isFree = user?.subscription_plan === 'free' || user?.subscription_plan === 'starter' || !user?.subscription_plan;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`w-[260px] h-screen fixed left-0 top-0 bg-surface-base border-r border-white/[0.04] flex flex-col text-slate-300 font-sans z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#0F1117' }}
      >
        {/* Header / Logo */}
        <div
          className="h-[72px] flex items-center px-5 cursor-pointer group"
          onClick={() => { navigate('/'); if (onClose) onClose(); }}
        >
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
            style={{ background: 'linear-gradient(135deg, #5B8CFF, #18C37E)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <LogoIcon className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-[15px] tracking-tight leading-tight">AI Digital Twin</span>
            <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: 'rgba(91, 140, 255, 0.6)' }}>Command Center</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-3 scrollbar-hide flex flex-col gap-0.5">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.href;
            return (
              <motion.button
                key={link.name}
                onClick={() => {
                  navigate(link.href);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-[9px] rounded-xl transition-all duration-200 relative group ${
                  isActive
                    ? 'text-white'
                    : link.special
                      ? 'text-amber-400/70 hover:text-amber-400'
                      : 'text-slate-500 hover:text-slate-200'
                }`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: '#5B8CFF' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-bg"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(91, 140, 255, 0.08)', border: '1px solid rgba(91, 140, 255, 0.12)' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <link.icon className={`w-[18px] h-[18px] relative z-10 ${isActive ? 'text-[#5B8CFF]' : ''}`} strokeWidth={isActive ? 2 : 1.5} />
                <span className={`font-medium text-[13px] relative z-10 ${isActive ? 'font-semibold' : ''}`}>
                  {link.name}
                </span>

                {!isActive && (
                  <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="p-3 flex flex-col gap-3">

          {/* Upgrade Plan Box */}
          {isFree && (
            <motion.div
              className="relative p-4 rounded-xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #141720, #171B24)', border: '1px solid rgba(255,255,255,0.04)' }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {/* Ambient glow */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: '#5B8CFF', filter: 'blur(24px)' }} />

              <div className="flex items-center gap-2 mb-2 relative z-10">
                <Zap className="w-3.5 h-3.5" style={{ color: '#F7B955' }} />
                <span className="text-[11px] font-bold text-white tracking-wide uppercase">Upgrade Plan</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3 relative z-10 leading-relaxed">
                Unlock advanced features and scale your AI workforce.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-[7px] rounded-lg text-[12px] font-bold relative z-10 transition-all duration-200 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #5B8CFF, #4a78f0)',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(91, 140, 255, 0.2)',
                }}
              >
                Upgrade Now
              </button>
            </motion.div>
          )}

          {/* User Profile */}
          <div
            className="rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-white/[0.08]"
            style={{ background: '#141720', border: '1px solid rgba(255,255,255,0.04)' }}
            onClick={() => navigate('/settings')}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
                style={{ background: 'linear-gradient(135deg, #5B8CFF, #18C37E)' }}
              >
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-white truncate leading-tight">{user?.full_name || 'User'}</span>
                <span className="text-[10px] font-medium truncate capitalize" style={{ color: '#5B8CFF' }}>{planName}</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mr-0.5" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

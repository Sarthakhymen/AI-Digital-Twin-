import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, PlusCircle, Users, BarChart3, 
  BookOpen, Mic, Settings, Shield, ChevronRight, Moon, Sun, Monitor
} from 'lucide-react';
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
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`w-[260px] h-screen fixed left-0 top-0 bg-[#0A0D14] border-r border-white/5 flex flex-col text-slate-300 font-sans z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Header / Logo */}
        <div className="h-20 flex items-center px-6 cursor-pointer" onClick={() => { navigate('/'); if (onClose) onClose(); }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
            <LogoIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">AI Digital Twin</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-4 scrollbar-hide flex flex-col gap-1.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <button
                key={link.name}
                onClick={() => {
                  navigate(link.href);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500/90 to-purple-500/90 text-white shadow-lg shadow-indigo-500/20' 
                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="font-medium text-[14px]">{link.name}</span>
              </button>
            );
          })}
        </div>

      {/* Bottom Section */}
      <div className="p-4 flex flex-col gap-4">
        
        {/* Upgrade Plan Box (Only for Free/Trial Users) */}
        {isFree && (
          <div className="bg-gradient-to-br from-[#121629] to-[#0d101d] border border-white/5 p-4 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="flex items-center gap-2 text-yellow-500">
                <Shield className="w-4 h-4 fill-yellow-500/20" />
                <span className="text-xs font-bold text-white tracking-wide">Upgrade Plan</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 mb-3 relative z-10 font-medium">Unlock advanced features and grow your twins.</p>
            <button 
              onClick={() => navigate('/pricing')}
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow relative z-10"
            >
              Upgrade Now
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className="bg-[#121629] rounded-2xl p-2 flex items-center justify-between cursor-pointer border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">{user?.full_name || 'User'}</span>
              <span className="text-[11px] text-indigo-400 font-medium truncate capitalize">{planName}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0 mr-1" />
        </div>

        {/* Theme Toggle placeholder (Visual only, to match design) */}
        <div className="flex items-center justify-center gap-6 mt-1 text-slate-500 bg-[#0d101d] py-2 rounded-xl border border-white/5">
          <Moon className="w-4 h-4 text-indigo-400" />
          <Sun className="w-4 h-4" />
          <Monitor className="w-4 h-4" />
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;

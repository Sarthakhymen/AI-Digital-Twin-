import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Bot, 
  Terminal, 
  Activity, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ activeTab, setTab }) => {
  const menuItems = [
    { id: 0, label: 'Overview', icon: LayoutDashboard },
    { id: 1, label: 'User Management', icon: Users },
    { id: 2, label: 'Payment Requests', icon: CreditCard },
    { id: 3, label: 'Digital Twins', icon: Bot },
    { id: 4, label: 'System Health', icon: Activity },
    { id: 5, label: 'DB Console', icon: Terminal },
    { id: 6, label: 'Pro Waitlist', icon: Users },
  ];

  return (
    <div className="w-72 h-full bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">NEXORA <span className="text-rose-500">ADMIN</span></span>
        </div>
        <p className="text-xs text-slate-500 font-medium px-1">SYSTEM CONTROL PANEL v1.0</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
              activeTab === item.id 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'group-hover:text-rose-400'}`} />
            <span className="font-semibold text-sm">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTab"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Exit Admin</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

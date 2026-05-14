import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, subtext, icon: Icon, color, trend }) => {
  const colors = {
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] hover:border-slate-700 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl border ${colors[color] || colors.rose}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-semibold mb-1 group-hover:text-slate-300 transition-colors">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white tracking-tight">{value}</span>
          {subtext && <span className="text-xs text-slate-500 font-medium">{subtext}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;

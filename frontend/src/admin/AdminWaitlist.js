import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Phone, Building2, MessageSquare, Clock, CheckCircle, Send, Search, ChevronDown } from 'lucide-react';

const statusColors = {
  waiting: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Waiting' },
  contacted: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Contacted' },
  converted: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Converted' },
};

const AdminWaitlist = ({ waitlist = [], onStatusUpdate, loading }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = waitlist.filter(entry => {
    const matchesSearch = 
      entry.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      entry.email?.toLowerCase().includes(search.toLowerCase()) ||
      entry.business_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: waitlist.length,
    waiting: waitlist.filter(e => e.status === 'waiting').length,
    contacted: waitlist.filter(e => e.status === 'contacted').length,
    converted: waitlist.filter(e => e.status === 'converted').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: stats.total, icon: Users, color: 'rose' },
          { label: 'Waiting', value: stats.waiting, icon: Clock, color: 'amber' },
          { label: 'Contacted', value: stats.contacted, icon: Send, color: 'blue' },
          { label: 'Converted', value: stats.converted, icon: CheckCircle, color: 'emerald' },
        ].map((stat) => (
          <div key={stat.label} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${
                stat.color === 'rose' ? 'text-rose-500' :
                stat.color === 'amber' ? 'text-amber-500' :
                stat.color === 'blue' ? 'text-blue-500' :
                'text-emerald-500'
              }`} />
            </div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or business..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder:text-slate-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 appearance-none cursor-pointer min-w-[160px]"
        >
          <option value="all">All Statuses</option>
          <option value="waiting">Waiting</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      {/* Waitlist Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-slate-800 text-xs font-black text-slate-500 uppercase tracking-widest">
          <span>Name</span>
          <span>Email / Phone</span>
          <span>Business</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Entries */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No waitlist entries found</p>
            <p className="text-slate-600 text-sm mt-1">Users who join the Business Pro queue will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {filtered.map((entry) => {
              const status = statusColors[entry.status] || statusColors.waiting;
              const isExpanded = expandedId === entry.id;

              return (
                <div key={entry.id}>
                  <div
                    className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-4 hover:bg-slate-800/30 transition-colors items-center cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  >
                    {/* Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold text-sm flex-shrink-0">
                        {entry.full_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-white text-sm truncate">{entry.full_name}</div>
                        <div className="text-[10px] text-slate-500">
                          {entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </div>
                      </div>
                    </div>

                    {/* Email / Phone */}
                    <div>
                      <div className="text-sm text-slate-300 truncate flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        {entry.email}
                      </div>
                      {entry.phone && (
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-1">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          {entry.phone}
                        </div>
                      )}
                    </div>

                    {/* Business */}
                    <div className="text-sm text-slate-400 truncate flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      {entry.business_name || '—'}
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.bg} ${status.text} border ${status.border}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1">
                          <div className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-5">
                            {/* Message */}
                            {entry.message && (
                              <div className="mb-5">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                  <MessageSquare className="w-3 h-3" />
                                  User Message
                                </div>
                                <p className="text-sm text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
                                  "{entry.message}"
                                </p>
                              </div>
                            )}

                            {/* Status Actions */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Update Status:</span>
                              {['waiting', 'contacted', 'converted'].map((s) => {
                                const sc = statusColors[s];
                                const isActive = entry.status === s;
                                return (
                                  <button
                                    key={s}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isActive) onStatusUpdate(entry.id, s);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                      isActive
                                        ? `${sc.bg} ${sc.text} border ${sc.border} cursor-default`
                                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                                    }`}
                                  >
                                    {sc.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWaitlist;

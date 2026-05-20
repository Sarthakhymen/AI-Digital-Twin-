import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  MoreVertical, 
  Search, 
  UserPlus,
  Mail,
  Calendar,
  MessageSquare
} from 'lucide-react';

const AdminUsers = ({ users, onToggleAdmin, onEditFeatures }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400 text-sm">Manage user roles, subscriptions, and message limits</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">User Info</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Plan</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Usage</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Expires</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-400 font-bold border border-slate-700">
                        {u.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{u.full_name || 'N/A'}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="w-3 h-3" />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      u.subscription_status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${u.subscription_status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      {u.subscription_status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded uppercase">
                      {u.subscription_plan || 'free'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      {u.message_count !== undefined ? u.message_count : 0} msgs
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs font-mono text-slate-400">
                      {u.subscription_expires_at ? new Date(u.subscription_expires_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onEditFeatures && onEditFeatures(u)}
                        className="p-2 bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-lg transition-all"
                        title="Edit Plan, Status & Features"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button 
                        onClick={() => onToggleAdmin(u.id)}
                        className={`p-2 rounded-lg transition-all ${
                          u.is_admin 
                            ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' 
                            : 'bg-slate-800 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500'
                        }`}
                        title={u.is_admin ? "Revoke Admin" : "Make Admin"}
                      >
                        {u.is_admin ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

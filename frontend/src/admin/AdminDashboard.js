import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Bot, 
  IndianRupee,
  TrendingUp,
  Clock,
  RefreshCcw,
  Bell
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import sub-components
import Sidebar from './Sidebar';
import StatsCard from './StatsCard';
import AdminUsers from './AdminUsers';
import AdminPayments from './AdminPayments';
import AdminSystem from './AdminSystem';
import AdminDatabase from './AdminDatabase';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [status, setStatus] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [twins, setTwins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [tables, setTables] = useState([]);
  const [editingUserFeatures, setEditingUserFeatures] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statusRes, usersRes, paymentsRes, twinsRes] = await Promise.all([
        api.get('/admin/status'),
        api.get('/admin/users'),
        api.get('/admin/payments'),
        api.get('/admin/digital-twins')
      ]);
      setStatus(statusRes.data);
      setUsers(usersRes.data);
      setPayments(paymentsRes.data);
      setTwins(twinsRes.data);
    } catch (err) {
      console.error(err.response?.data?.detail || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await api.get('/admin/db/tables');
      setTables(res.data);
    } catch (err) {
      console.error("Failed to fetch tables:", err);
    }
  };

  useEffect(() => {
    if (!user || (!user.is_admin && !["sarthak2005shavarn@gmail.com", "nexora.aidigital.twin@gmail.com"].includes(user.email))) {
      navigate('/dashboard');
      return;
    }
    fetchData();
    fetchTables();
  }, [user, navigate]);

  const handleVerify = async (transactionId, action = 'verify') => {
    try {
      await api.post('/admin/payments/verify', { 
        transaction_id: transactionId,
        action: action 
      });
      fetchData();
    } catch (err) {
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} failed: ` + (err.response?.data?.detail || err.message));
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/toggle-admin`);
      fetchData();
    } catch (err) {
      alert("Toggle admin failed: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleFeatureToggle = async (userId, featureName, isEnabled) => {
    try {
      await api.post(`/admin/users/${userId}/features`, {
        feature_name: featureName,
        feature_status: isEnabled
      });
      // Update local state directly for faster UI response, or fetch data
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.detail;
      const displayMsg = typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : (errorMsg || err.message);
      alert("Failed to toggle feature: " + displayMsg);
    }
  };

  const runQuery = async () => {
    try {
      const res = await api.post('/admin/db/execute', null, { params: { query } });
      setQueryResult(res.data);
    } catch (err) {
      setQueryResult({ error: err.response?.data?.detail || err.message });
    }
  };

  // Calculate stats
  const totalRevenue = payments
    .filter(p => p.status === 'verified')
    .reduce((acc, curr) => acc + (curr.amount || 1), 0);

  const activeTrials = users.filter(u => u.subscription_plan === 'trial').length;

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="w-10 h-10 text-rose-500 animate-spin" />
          <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Initializing System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-200">
      <Sidebar activeTab={activeTab} setTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <header className="sticky top-0 z-10 px-8 py-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">
              {['Overview', 'User Management', 'Payments', 'Digital Twins', 'System Health', 'Database'][activeTab]}
            </h1>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all border border-slate-800/50"
              title="Refresh Data"
            >
              <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="relative">
              <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all border border-slate-800/50">
                <Bell className="w-5 h-5" />
              </button>
              {payments.filter(p => p.status === 'pending').length > 0 && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950" />
              )}
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right">
                <div className="text-sm font-bold text-white">{user?.full_name}</div>
                <div className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">Owner Access</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-rose-500">
                {user?.full_name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 pb-20">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard 
                    title="Total Revenue" 
                    value={`₹${totalRevenue.toLocaleString()}`} 
                    subtext="Verified Payments" 
                    icon={IndianRupee} 
                    color="emerald"
                    trend={12}
                  />
                  <StatsCard 
                    title="Active Users" 
                    value={users.length} 
                    subtext="Registered accounts" 
                    icon={Users} 
                    color="blue"
                    trend={5}
                  />
                  <StatsCard 
                    title="Active Trials" 
                    value={activeTrials} 
                    subtext="24h access active" 
                    icon={Clock} 
                    color="amber"
                  />
                  <StatsCard 
                    title="Digital Twins" 
                    value={twins.length} 
                    subtext="AI agents deployed" 
                    icon={Bot} 
                    color="rose"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <AdminSystem status={status} />
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2.5rem]">
                      <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Recent Payments
                      </h3>
                      <div className="space-y-4">
                        {payments.slice(0, 5).map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                p.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                ₹
                              </div>
                              <div className="text-xs truncate max-w-[120px]">
                                <div className="font-bold text-white">{p.email}</div>
                                <div className="text-slate-500">{p.status}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">{new Date(p.created_at).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setActiveTab(2)}
                        className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                      >
                        View All Payments
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AdminUsers 
                  users={users} 
                  onToggleAdmin={handleToggleAdmin} 
                  onEditFeatures={(user) => setEditingUserFeatures(user)}
                />
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div 
                key="payments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AdminPayments payments={payments} onVerify={handleVerify} />
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div 
                key="twins"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Simple Twins List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {twins.map((twin) => (
                    <div key={twin.id} className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] hover:border-rose-500/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                          <Bot className="w-6 h-6" />
                        </div>
                        <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {twin.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{twin.name}</h3>
                      <p className="text-xs text-slate-500 mb-4 truncate">{twin.description || 'No description provided'}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        Created by Admin / System
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 4 && (
              <motion.div 
                key="system"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AdminSystem status={status} />
              </motion.div>
            )}

            {activeTab === 5 && (
              <motion.div 
                key="database"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AdminDatabase 
                  query={query} 
                  setQuery={setQuery} 
                  onRunQuery={runQuery} 
                  result={queryResult} 
                  tables={tables}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* User Features Modal */}
      <AnimatePresence>
        {editingUserFeatures && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Edit Features</h3>
                <button 
                  onClick={() => setEditingUserFeatures(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <p className="text-sm text-slate-400">
                  Modifying feature overrides for: <strong className="text-white">{editingUserFeatures.email}</strong>
                </p>

                <div className="space-y-4">
                  {[
                    { key: 'whatsapp', label: 'WhatsApp Bot Access' },
                    { key: 'voice', label: 'Voice Agent Access' },
                    { key: 'advanced_analytics', label: 'Advanced Analytics' },
                    { key: 'unlimited_messages', label: 'Unlimited Messages' }
                  ].map((feature) => {
                    const isEnabled = editingUserFeatures.custom_features?.[feature.key] === true;
                    
                    return (
                      <div key={feature.key} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="text-slate-200 font-medium">{feature.label}</span>
                        <button
                          onClick={() => {
                            const newValue = !isEnabled;
                            handleFeatureToggle(editingUserFeatures.id, feature.key, newValue);
                            setEditingUserFeatures({
                              ...editingUserFeatures,
                              custom_features: {
                                ...(editingUserFeatures.custom_features || {}),
                                [feature.key]: newValue
                              }
                            });
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            isEnabled ? 'bg-cyan-500' : 'bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;

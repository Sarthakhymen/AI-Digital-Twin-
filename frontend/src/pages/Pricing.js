import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  AccessTime, 
  Star, 
  QrCodeScanner, 
  X, 
  Copy, 
  CheckCircle2 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const PaymentModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const upiId = "9625410112@nyes";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      transaction_id: formData.get("transaction_id")
    };

    try {
      setLoading(true);
      const response = await api.post('/payments/manual-submit', data);
      alert(response.data.message);
      onClose();
    } catch (err) {
      alert(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-600 to-rose-500" />

          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Pay via UPI</h3>
              <p className="text-sm text-slate-400">Scan QR and submit transaction details</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 hover:bg-slate-800 rounded-2xl transition-colors border border-slate-700/50"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold border border-rose-500/20">1</div>
                <h4 className="text-white font-semibold">Scan QR Code</h4>
              </div>
              
              <div className="mx-auto w-64 aspect-square bg-white rounded-3xl p-5 shadow-2xl ring-1 ring-slate-200">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${upiId}&pn=NexoraAI&cu=INR&am=2499`}
                  alt="Payment QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="space-y-3">
                <p className="text-center text-xs text-slate-500 font-medium uppercase tracking-widest">Or Use UPI ID</p>
                <div className="flex items-center gap-2 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 w-full justify-between group hover:border-rose-500/30 transition-colors">
                  <code className="text-rose-300 font-bold tracking-wide">{upiId}</code>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 hover:text-white transition-all border border-slate-700/50"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold border border-rose-500/20">2</div>
                <h4 className="text-white font-semibold">Submit Transaction Details</h4>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Transaction ID / UTR</label>
                  <input 
                    type="text" 
                    name="transaction_id"
                    required
                    placeholder="Enter 12-digit ID"
                    className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
                  />
                </div>

                <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-[1.5rem] flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[13px] text-slate-300 leading-relaxed">
                    Account will be activated within <span className="text-emerald-400 font-bold">12-24 hours</span>.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {loading ? "Submitting..." : "Verify & Activate Account"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Pricing = () => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrial = async () => {
    try {
      setLoading(true);
      const response = await api.post('/payments/trial');
      alert(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.detail || "Bhai, trial start nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar />
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold text-rose-500 tracking-widest uppercase mb-4">Premium Access</h2>
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Invest in your digital future.
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Choose a plan that fits your growth. Try it free or pay manually via UPI for instant business activation.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Trial Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <AccessTime className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">1-Day Trial</h3>
                <p className="text-slate-500 text-sm">Experience the magic</p>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-black">₹0</span>
              <span className="text-slate-500 ml-2">/ 24 hours</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {[
                "Full Platform Access",
                "WhatsApp Sync (Trial)",
                "Voice Agent Access",
                "Valid for 24 Hours",
                "No Credit Card Required"
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleTrial}
              disabled={loading}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"
            >
              {loading ? "Starting..." : "Start Free Trial"}
            </button>
          </motion.div>

          {/* Pro Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 rounded-[2.5rem] bg-slate-900 border-2 border-rose-500/50 relative overflow-hidden flex flex-col shadow-2xl shadow-rose-500/10"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="px-4 py-1.5 bg-rose-500 text-white text-xs font-black rounded-full uppercase tracking-tighter">Most Popular</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Business Pro</h3>
                <p className="text-slate-500 text-sm">Scale your expertise</p>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-black">₹2,499</span>
              <span className="text-slate-500 ml-2">/ month</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {[
                "Unlimited Digital Twins",
                "Full WhatsApp Integration",
                "Voice Agent (Premium)",
                "Advanced Training (PDF/URL)",
                "12-24h Manual Activation",
                "Priority Support"
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-rose-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setIsPaymentOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Get Pro Now
              <QrCodeScanner className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Info Box */}
        <div className="mt-16 p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <QrCodeScanner className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-1">Manual UPI Activation</h4>
            <p className="text-slate-400">
              For users in India, we support direct UPI payments for faster onboarding. Simply pay, submit your TXID, and our team will activate your Pro features within 12-24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

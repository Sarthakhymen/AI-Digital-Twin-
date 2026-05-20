import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Zap, Shield, Rocket, Clock, Loader2, ExternalLink, X, Sparkles, ArrowRight, Users } from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Pricing = () => {
  const [trialLoading, setTrialLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(null); // 'standard', 'pro', or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState({ full_name: '', email: '', phone: '', business_name: '', message: '' });
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const getPlanStatus = (planKey) => {
    if (!user) return { isCurrent: false };
    const currentPlan = user.subscription_plan;
    if (planKey === 'free') {
      const isFreeActive = currentPlan === 'free' || currentPlan === 'starter' || !currentPlan;
      return { isCurrent: isFreeActive };
    }
    if (planKey === 'standard') {
      const isStandardActive = currentPlan === 'standard';
      return { isCurrent: isStandardActive };
    }
    if (planKey === 'business_pro') {
      const isProActive = currentPlan === 'business_pro' || currentPlan === 'pro';
      return { isCurrent: isProActive };
    }
    return { isCurrent: false };
  };

  // ── Free Trial ───────────────────────────────────────────
  const handleTrial = async () => {
    if (!user) { navigate('/login'); return; }
    setTrialLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/payments/trial`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Trial activated! You have 3 days of free access with 50 AI messages.');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to start trial');
    } finally {
      setTrialLoading(false);
    }
  };

  // ── Razorpay Checkout ────────────────────────────────────
  const handleRazorpayCheckout = async (planKey) => {
    if (!user) { navigate('/login'); return; }
    setCheckoutLoading(planKey);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection or use manual payment.');
        setCheckoutLoading(null);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/payments/razorpay/create-order`,
        { plan_type: planKey },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      const { order_id, amount, currency, key_id, user: userDetails } = response.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'AI Digital Twin',
        description: `Upgrade to ${planKey === 'standard' ? 'Standard' : 'Business Pro'} Plan`,
        image: 'https://cdn-icons-png.flaticon.com/512/8625/8625345.png',
        order_id: order_id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${process.env.REACT_APP_API_URL}/payments/razorpay/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_type: planKey
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (verifyRes.data.status === 'success') {
              alert(`Success! Your account is now upgraded to ${planKey === 'standard' ? 'Standard' : 'Business Pro'}.`);
              navigate('/dashboard');
            } else {
              alert('Payment verification pending. We will notify you once active.');
            }
          } catch (verifyErr) {
            console.error(verifyErr);
            alert(verifyErr.response?.data?.detail || 'Payment verification failed');
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone
        },
        theme: {
          color: '#e11d48'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || 'Failed to initiate Razorpay checkout');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManualCheckout = (plan) => {
    if (!user) { navigate('/login'); return; }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // ── Join Waitlist ────────────────────────────────────────
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!waitlistForm.full_name || !waitlistForm.email) {
      alert('Please fill in your name and email.');
      return;
    }
    setWaitlistLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/waitlist/join`,
        waitlistForm
      );
      setWaitlistSuccess(true);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to join waitlist');
    } finally {
      setWaitlistLoading(false);
    }
  };

  const plans = [
    {
      key: 'free',
      name: 'Free Trial',
      price: '$0',
      period: 'for 3 days',
      description: 'Test the magic of AI Twins with zero commitment.',
      features: [
        'Web Chat Widget (with watermark)',
        'Max 50 messages/month',
        'PDF Uploads only',
        'Sub-100ms response time',
        'No credit card required',
      ],
      cta: trialLoading ? 'Activating...' : (getPlanStatus('free').isCurrent ? 'Your Current Plan' : 'Start 3-Day Trial'),
      onAction: getPlanStatus('free').isCurrent ? null : handleTrial,
      icon: Clock,
      color: 'blue',
      loading: trialLoading,
      disabled: trialLoading || checkoutLoading !== null || getPlanStatus('free').isCurrent,
    },
    {
      key: 'standard',
      name: 'Standard',
      price: '$29',
      period: 'per month',
      description: 'Essential AI features for growing businesses.',
      features: [
        'Unlimited Web Chat Widget',
        'Custom Colors & Styling (No watermark)',
        'Lead Generation Form (Email & Phone capture)',
        'URL Scraping (Auto-Knowledge Base)',
        'Priority API Response speed',
      ],
      cta: checkoutLoading === 'standard' ? 'Processing...' : (getPlanStatus('standard').isCurrent ? 'Your Current Plan' : 'Get Standard'),
      onAction: getPlanStatus('standard').isCurrent ? null : () => handleRazorpayCheckout('standard'),
      icon: Zap,
      color: 'amber',
      loading: checkoutLoading === 'standard',
      disabled: trialLoading || checkoutLoading !== null || getPlanStatus('standard').isCurrent,
      badge: null,
      allowManual: !getPlanStatus('standard').isCurrent,
    },
    {
      key: 'business_pro',
      name: 'Business Pro',
      price: '$99',
      period: 'per month',
      description: 'Unleash the full potential of your AI Twin.',
      features: [
        'WhatsApp Integration (Scan QR Code)',
        'Voice Agent Widget (Mic Mode)',
        'Auto-Booking (Calendly Sync)',
        'Zapier & Webhooks (CRM Sync)',
        'Auto-Sync (Google Drive/Notion)',
        'Analytics & Human Handoff',
        'Everything in Standard included',
      ],
      cta: getPlanStatus('business_pro').isCurrent ? 'Your Current Plan' : 'Coming Soon',
      onAction: getPlanStatus('business_pro').isCurrent ? null : () => setShowWaitlistModal(true),
      icon: Star,
      color: 'rose',
      popular: true,
      comingSoon: !getPlanStatus('business_pro').isCurrent,
      disabled: getPlanStatus('business_pro').isCurrent,
      loading: false,
      allowManual: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-rose-500/30">
      <LandingNavbar />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <main className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold text-rose-500 tracking-[0.2em] uppercase mb-4">
              Pricing Plans
            </h2>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white">
              Invest in your{' '}
              <span className="bg-gradient-to-r from-rose-400 to-red-600 bg-clip-text text-transparent">
                Digital Future.
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed">
              Whether you're just starting or scaling to thousands of customers, we have a plan that fits your growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col ${
                  getPlanStatus(plan.key).isCurrent
                    ? 'bg-slate-900/80 border-emerald-500/50 shadow-2xl shadow-emerald-500/10'
                    : plan.popular
                      ? 'bg-slate-900/80 border-rose-500/40 shadow-2xl shadow-rose-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Current Plan Badge */}
                {getPlanStatus(plan.key).isCurrent && (
                  <div className="absolute top-0 right-8 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/20">
                      Current Plan
                    </span>
                  </div>
                )}

                {/* Popular Badge */}
                {plan.popular && !getPlanStatus(plan.key).isCurrent && (
                  <div className="absolute top-0 right-8 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-rose-500/20">
                      Coming Soon
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6 text-left">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                    plan.color === 'rose' ? 'bg-rose-500/10'
                    : plan.color === 'amber' ? 'bg-amber-500/10'
                    : 'bg-blue-500/10'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${
                      plan.color === 'rose' ? 'text-rose-500'
                      : plan.color === 'amber' ? 'text-amber-500'
                      : 'text-blue-500'
                    }`} />
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    {plan.comingSoon && (
                      <span className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-rose-500/30">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8 text-left">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black ${plan.comingSoon ? 'text-slate-500' : 'text-white'}`}>{plan.price}</span>
                    <span className="text-slate-500 font-medium text-sm">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-10 flex-1 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 group/item">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.color === 'rose' ? 'bg-rose-500/10'
                        : plan.color === 'amber' ? 'bg-amber-500/10'
                        : 'bg-blue-500/10'
                      }`}>
                        <Check className={`w-3 h-3 ${
                          plan.color === 'rose' ? 'text-rose-500'
                          : plan.color === 'amber' ? 'text-amber-500'
                          : 'text-blue-500'
                        }`} />
                      </div>
                      <span className="text-slate-300 text-sm group-hover/item:text-white transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={plan.onAction}
                  disabled={plan.disabled && !plan.comingSoon}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                    plan.comingSoon
                      ? 'bg-gradient-to-r from-rose-500/80 to-red-600/80 text-white shadow-xl shadow-rose-500/20 hover:from-rose-500 hover:to-red-600 hover:-translate-y-0.5 cursor-pointer'
                    : plan.disabled && !plan.loading
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : plan.color === 'amber'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600 hover:-translate-y-0.5'
                      : 'bg-white text-slate-900 hover:bg-slate-100 hover:-translate-y-0.5'
                  }`}
                >
                  {plan.loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {plan.cta}
                    </>
                  ) : plan.comingSoon ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Join the Queue
                    </>
                  ) : (
                    <>
                      {plan.cta}
                    </>
                  )}
                </button>

                {/* Manual Payment Fallback */}
                {plan.allowManual && (
                  <button
                    onClick={() => handleManualCheckout({ name: plan.name, price: plan.price })}
                    disabled={plan.disabled}
                    className="mt-3 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1 mx-auto"
                  >
                    <span>Or pay manually (UPI / Bank Transfer)</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Guarantees */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto border-t border-slate-800 pt-16">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto border border-slate-800">
                <Shield className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="font-bold text-white">Secure Payments</h4>
              <p className="text-sm text-slate-400">
                All transactions are processed securely with bank-grade encryption.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto border border-slate-800">
                <Rocket className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="font-bold text-white">Instant Activation</h4>
              <p className="text-sm text-slate-400">
                Trial starts immediately. Standard plan activates after verification.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto border border-slate-800">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <h4 className="font-bold text-white">Scale as you grow</h4>
              <p className="text-sm text-slate-400">
                Switch or upgrade plans anytime to unlock more AI power for your business.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
        userEmail={user?.email}
      />

      {/* ── Business Pro Waitlist Modal ── */}
      <AnimatePresence>
        {showWaitlistModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => { setShowWaitlistModal(false); setWaitlistSuccess(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-slate-900 border border-slate-700/50 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-8 pb-6 border-b border-slate-800">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500" />
                <button
                  onClick={() => { setShowWaitlistModal(false); setWaitlistSuccess(false); }}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Join the Queue</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Be first in line for Business Pro</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {waitlistSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">You're on the list! 🎉</h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                      We'll notify you as soon as Business Pro launches. Get ready for AI-powered meetings, bookings, and advanced WhatsApp automation.
                    </p>
                    <button
                      onClick={() => { setShowWaitlistModal(false); setWaitlistSuccess(false); }}
                      className="mt-8 px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all"
                    >
                      Got it!
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      Business Pro includes <span className="text-white font-semibold">AI meeting scheduling, table bookings, voice agent</span>, and advanced WhatsApp automation. Drop your details and we'll reach out when it's ready.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={waitlistForm.full_name}
                          onChange={(e) => setWaitlistForm({ ...waitlistForm, full_name: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-slate-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Email *</label>
                        <input
                          type="email"
                          required
                          value={waitlistForm.email}
                          onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-slate-500"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Phone</label>
                        <input
                          type="tel"
                          value={waitlistForm.phone}
                          onChange={(e) => setWaitlistForm({ ...waitlistForm, phone: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-slate-500"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Business Name</label>
                        <input
                          type="text"
                          value={waitlistForm.business_name}
                          onChange={(e) => setWaitlistForm({ ...waitlistForm, business_name: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-slate-500"
                          placeholder="Your business"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">What are you looking for?</label>
                      <textarea
                        value={waitlistForm.message}
                        onChange={(e) => setWaitlistForm({ ...waitlistForm, message: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none placeholder:text-slate-500"
                        placeholder="Tell us about your use case (optional)"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={waitlistLoading}
                      className="w-full py-4 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-bold text-base hover:from-rose-600 hover:to-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-60"
                    >
                      {waitlistLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
                          Join the Queue
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pricing;

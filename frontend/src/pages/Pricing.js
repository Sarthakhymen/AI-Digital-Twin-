import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Rocket, Clock } from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [trialLoading, setTrialLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTrial = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setTrialLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/trial`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status === 'success') {
        alert("Trial activated! You have 24 hours of premium access.");
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to start trial");
    } finally {
      setTrialLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free Trial',
      price: '₹0',
      period: 'for 1 day (24 hours)',
      description: 'Test the waters and see the magic of AI Twins.',
      features: [
        'Full Access to all features',
        'Voice & Text AI capabilities',
        'Knowledge Base integration',
        'Sub-100ms response time',
        'No credit card required'
      ],
      cta: 'Start 1-Day Trial',
      action: handleTrial,
      icon: Clock,
      color: 'blue'
    },
    {
      name: 'Business Pro',
      price: '₹1',
      period: 'per month',
      description: 'Unleash the full potential of your AI Twin.',
      features: [
        'Unlimited AI interactions',
        'WhatsApp & Web integration',
        'Advanced Analytics Dashboard',
        'Priority Support via WhatsApp',
        'Manual Activation (12-24 Hrs)',
        'Secure Payment via UPI'
      ],
      cta: 'Get Pro Now',
      action: () => {
        if (!user) {
          navigate('/login');
          return;
        }
        setSelectedPlan({ name: 'Business Pro', price: '₹1' });
        setIsPaymentOpen(true);
      },
      icon: Star,
      popular: true,
      color: 'rose'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-rose-500/30">
      <LandingNavbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <main className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold text-rose-500 tracking-[0.2em] uppercase mb-4">Pricing Plans</h2>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white">
              Invest in your <span className="bg-gradient-to-r from-rose-400 to-red-600 bg-clip-text text-transparent">Digital Future.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed">
              Whether you're just starting or scaling to thousands of customers, we have a plan that fits your growth trajectory.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 group flex flex-col ${
                  plan.popular 
                    ? 'bg-slate-900/80 border-rose-500/50 shadow-2xl shadow-rose-500/10' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-10 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-rose-500/20">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8 text-left">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    plan.color === 'rose' ? 'bg-rose-500/10' : 'bg-blue-500/10'
                  }`}>
                    <plan.icon className={`w-7 h-7 ${
                      plan.color === 'rose' ? 'text-rose-500' : 'text-blue-500'
                    }`} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-10 text-left">
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-500 font-medium">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-12 flex-1 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 group/item">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        plan.color === 'rose' ? 'bg-rose-500/10 group-hover/item:bg-rose-500/20' : 'bg-blue-500/10 group-hover/item:bg-blue-500/20'
                      }`}>
                        <Check className={`w-3.5 h-3.5 ${
                          plan.color === 'rose' ? 'text-rose-500' : 'text-blue-500'
                        }`} />
                      </div>
                      <span className="text-slate-300 group-hover/item:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={plan.action}
                  disabled={trialLoading && plan.name === 'Free Trial'}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-xl shadow-rose-500/20 hover:from-rose-600 hover:to-red-700 hover:-translate-y-1'
                      : 'bg-white text-slate-900 hover:bg-slate-100 hover:-translate-y-1'
                  }`}
                >
                  {plan.name === 'Free Trial' && trialLoading ? 'Activating...' : plan.cta}
                  <Zap className={`w-5 h-5 ${plan.popular ? 'text-rose-200' : 'text-rose-500'}`} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Guarantees */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto border-t border-slate-800 pt-16">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto border border-slate-800">
                <Shield className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="font-bold text-white">Secure Payments</h4>
              <p className="text-sm text-slate-400">Manual UPI verification for maximum security and zero hidden fees.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto border border-slate-800">
                <Rocket className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="font-bold text-white">Instant Deployment</h4>
              <p className="text-sm text-slate-400">Trial starts immediately. Premium activation in 12-24 hours after TXID submission.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto border border-slate-800">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <h4 className="font-bold text-white">Scale as you go</h4>
              <p className="text-sm text-slate-400">Switch between plans or upgrade at any time to unlock more power.</p>
            </div>
          </div>
        </div>
      </main>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        plan={selectedPlan}
        userEmail={user?.email}
      />
    </div>
  );
};

export default Pricing;

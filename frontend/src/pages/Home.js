import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  BarChart3,
  ChevronRight,
  Mic,
  Bot,
  Layers,
  CheckCircle2,
  Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LandingNavbar from '../components/LandingNavbar';
import PaymentModal from '../components/PaymentModal';
import LogoIcon from '../components/LogoIcon';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Hero Section
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#0A0A0A] overflow-hidden">
        
        {/* Deep Animated Gradient Overlay for Luxury SaaS feel */}
        <motion.div 
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{ backgroundImage: 'radial-gradient(circle at center, rgba(229, 231, 235, 0.15) 0%, rgba(244, 63, 94, 0.05) 40%, rgba(10, 10, 10, 1) 100%)', backgroundSize: '200% 200%' }}
        />

        {/* Soft Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />

        {/* Floating Holographic UI Elements */}
        
        {/* Support Chat Bubble */}
        <motion.div
          animate={{ y: [-10, 10, -10], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[15%] max-w-[200px] p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hidden md:block shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <div className="flex gap-3 items-center">
            <MessageSquare className="w-5 h-5 text-slate-300" />
            <div className="h-2 w-20 bg-slate-400/40 rounded-full" />
          </div>
        </motion.div>

        {/* AI Twin Bubble */}
        <motion.div
          animate={{ y: [10, -10, 10], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-[15%] max-w-[200px] p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md hidden md:block shadow-[0_0_30px_rgba(244,63,94,0.1)]"
        >
          <div className="flex gap-3 items-center justify-end">
            <div className="h-2 w-16 bg-rose-400/40 rounded-full" />
            <Bot className="w-5 h-5 text-rose-400" />
          </div>
        </motion.div>

        {/* Data Stream */}
        <motion.div
          animate={{ y: [0, -50], opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/3 p-3 rounded-lg bg-slate-300/10 border border-slate-300/20 backdrop-blur-sm hidden lg:block"
        >
          <Layers className="w-6 h-6 text-slate-300" />
        </motion.div>
        
        {/* Voice Waveform */}
        <div className="absolute bottom-1/4 left-1/4 flex gap-1 items-end h-10 hidden md:flex">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: ['20%', '100%', '20%'] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="w-1.5 bg-rose-500/50 rounded-full"
            />
          ))}
        </div>

        {/* Gradient Orbs for lighting */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-slate-300/10 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px] mix-blend-screen"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
              <span className="text-sm font-medium text-slate-300">Your clone is born</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
          >
            Your time is finite.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-white to-rose-400 drop-shadow-[0_0_30px_rgba(244,63,94,0.2)]">Your impact shouldn't be.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Create a digital version of yourself that shares your expertise and connects with your audience 24/7. Reclaim your time without losing your personal touch.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center justify-center gap-6 pt-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-4 bg-white text-[#0A0A0A] rounded-full font-medium text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => window.location.href = "mailto:nexora.aidigital.twin@gmail.com?subject=Demo Request"}
                className="group px-8 py-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-full font-medium text-sm hover:bg-rose-500/20 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </motion.button>
            </div>
            
            {/* Direct Contact Info */}
            <div className="flex flex-col items-center gap-1 text-sm text-slate-400 mt-2">
              <p>Prefer to talk directly? Reach out anytime:</p>
              <div className="flex items-center gap-4 text-slate-300 font-medium">
                <a href="mailto:nexora.aidigital.twin@gmail.com" className="hover:text-white transition-colors">nexora.aidigital.twin@gmail.com</a>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <a href="tel:+919625410112" className="hover:text-white transition-colors">+91 9625410112</a>
              </div>
            </div>
          </motion.div>


        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Dashboard Preview Section
const DashboardPreview = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Browser Frame */}
          <div className="rounded-2xl overflow-hidden glass border border-slate-700/50 shadow-2xl shadow-rose-500/10">
            {/* Browser Chrome */}
            <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/50 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1.5 bg-slate-900/80 rounded-lg text-xs text-slate-500">
                  app.aidigitaltwin.com/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8 bg-slate-900/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                {[
                  { label: 'Knowledge Sources', value: 'Syncing', change: 'Connected', icon: Layers },
                  { label: 'Response Quality', value: 'Learning', change: 'Adapting to your voice', icon: MessageSquare },
                  { label: 'Availability', value: '24/7', change: 'Always active', icon: Shield }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-rose-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-rose-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-xs text-emerald-400 mt-2">{stat.change}</p>
                  </motion.div>
                ))}
              </div>

              {/* Activity Chart Placeholder */}
              <div className="mt-6 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-white">Conversation Volume</h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs rounded bg-rose-500/20 text-rose-300">24h</span>
                    <span className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-400">7d</span>
                    <span className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-400">30d</span>
                  </div>
                </div>
                <div className="h-32 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-slate-400 to-rose-500 opacity-80 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 top-20 p-4 rounded-xl glass border border-slate-700/50 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Knowledge Synced</p>
                <p className="text-xs text-slate-400">Just now</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-8 bottom-32 p-4 rounded-xl glass border border-slate-700/50 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-rose-400" />
              <span className="text-sm text-white">Voice Model Ready</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Features Grid Section
const Features = () => {
  const features = [
    {
      icon: Mic,
      title: 'Voice-First AI',
      description: 'Natural-sounding voice synthesis that captures your tone, style, and personality. Support for 30+ languages.',
      color: 'from-indigo-500 to-violet-500'
    },
    {
      icon: Zap,
      title: 'Sub-100ms Response',
      description: 'Powered by Groq LPU. Your AI thinks and responds faster than most humans can type.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II certified. End-to-end encryption. Your data never trains our models.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Globe,
      title: 'Omnichannel',
      description: 'Deploy anywhere—your website, WhatsApp, Slack, phone calls, or embed in your app.',
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'See every conversation, track sentiment, identify trends. Export insights to your CRM.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Layers,
      title: 'Custom Knowledge',
      description: 'Upload documents, connect APIs, sync your Notion. Your AI learns your business instantly.',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <section id="features" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-rose-400 tracking-wider uppercase">Features</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
            Scale your expertise,
            <br />
            <span className="gradient-text">not your stress</span>
          </h2>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            We built AI Twin to help experts be everywhere at once, giving you the freedom to focus on what truly matters.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-rose-500/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/0 to-red-500/0 group-hover:from-rose-500/5 group-hover:to-red-500/5 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Record your voice',
      description: 'Speak for 10 minutes. Our AI captures your tone, cadence, and speaking style.'
    },
    {
      number: '02',
      title: 'Add your knowledge',
      description: 'Upload documents, connect your tools, or let us scrape your website.'
    },
    {
      number: '03',
      title: 'Deploy anywhere',
      description: 'Embed on your site, connect to WhatsApp, or route phone calls to your AI.'
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-dark-950" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-rose-400 tracking-wider uppercase">How It Works</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
            Create your twin in
            <br />
            <span className="gradient-text">under 5 minutes</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative"
            >
              {/* Connector Line */}
              {i < 2 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-rose-500/50 to-transparent" />
              )}

              <div className="p-8 rounded-2xl glass border border-slate-700/50">
                <span className="text-5xl font-bold text-slate-700">{step.number}</span>
                <h3 className="mt-6 text-2xl font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// The Mission Section
const TheMission = () => {
  return (
    <section className="relative py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 rounded-3xl bg-slate-800/30 border border-slate-700/50 relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 blur-[80px]" />
          
          <span className="text-sm font-semibold text-rose-400 tracking-wider uppercase">Why we built this</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white mb-8">
            Technology should give you time back,<br />
            <span className="gradient-text">not demand more of it.</span>
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            As creators, experts, and founders, we know the pain of repeating the same advice and answering the same questions day in and day out. 
          </p>
          <p className="text-lg text-slate-300 leading-relaxed">
            We built AI Twin not just to automate tasks, but to preserve your energy. Your expertise is valuable. Your time is priceless. Let's protect both.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Pricing Section
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

  return (
    <section id="pricing" className="relative py-32 bg-slate-900/20 overflow-hidden">
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        plan={selectedPlan}
        userEmail={user?.email}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-rose-400 tracking-wider uppercase">Simple Pricing</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
            Start free, upgrade when
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-white to-rose-400 drop-shadow-[0_0_30px_rgba(244,63,94,0.2)]">you're ready.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Experience the full power of your AI Twin before committing. Transparent pricing for creators and startups.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Trial Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm relative overflow-hidden flex flex-col"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Free Trial</h3>
            <p className="text-slate-400 mb-6">Test the waters and see the magic.</p>
            
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">₹0</span>
              <span className="text-slate-400 ml-2">/ for 1 day (24 hours)</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Full Access to all features",
                "Voice & Text AI capabilities",
                "Knowledge Base integration",
                "Sub-100ms response time",
                "No credit card required"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <motion.button
              onClick={handleTrial}
              disabled={trialLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {trialLoading ? "Starting..." : "Start 1-Day Trial"}
            </motion.button>
          </motion.div>

          {/* Pro Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-10 rounded-3xl border border-rose-500/50 bg-slate-800/60 backdrop-blur-sm relative overflow-hidden flex flex-col"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px]" />
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 to-red-600" />
            
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold text-white">Business Pro</h3>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">Premium</span>
            </div>
            <p className="text-slate-400 mb-6">Unleash the full potential of your AI Twin.</p>
            
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">₹2,499</span>
              <span className="text-slate-400 ml-2">/ month</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Unlimited AI interactions",
                "WhatsApp & Web integration",
                "Advanced Analytics Dashboard",
                "Priority Support via WhatsApp",
                "Manual Activation (12-24 Hrs)",
                "Secure Payment via UPI"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="text-center mb-4">
              <p className="text-xs text-rose-300/80 bg-rose-500/10 py-2 px-3 rounded-lg border border-rose-500/20">
                Note: Pay via UPI and submit Transaction ID. Account activated within 12-24 hours.
              </p>
            </div>

            <motion.button
              onClick={() => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                setSelectedPlan({ name: 'Business Pro', price: '₹2,499' });
                setIsPaymentOpen(true);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-bold shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 group"
            >
              Get Pro Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTA = () => {

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-16 rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-red-600 to-slate-800" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />

          {/* Content */}
          <div className="relative text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to scale yourself?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/80 max-w-2xl mx-auto mb-10"
            >
              Join elite creators and businesses using AI Digital Twins.
              Custom architectures tailored to your specific needs.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                onClick={() => window.location.href = "mailto:nexora.aidigital.twin@gmail.com?subject=Enterprise Inquiry"}
                className="px-8 py-4 bg-white text-rose-600 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact for Sales
              </motion.button>
              <motion.button
                onClick={() => window.location.href = "mailto:nexora.aidigital.twin@gmail.com?subject=Demo Request"}
                className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Request a Demo
              </motion.button>
            </motion.div>
            
            {/* Direct Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-white/90 font-medium"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✉️</span>
                <a href="mailto:nexora.aidigital.twin@gmail.com" className="hover:text-white transition-colors">nexora.aidigital.twin@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">📞</span>
                <a href="tel:+919625410112" className="hover:text-white transition-colors">+91 9625410112</a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const accountLinks = loading 
    ? [
        { name: 'Loading...', action: () => {} }
      ]
    : user 
      ? [
          { name: 'Dashboard', action: () => navigate('/dashboard') },
          { name: 'Settings', action: () => navigate('/settings') },
          { name: 'Logout', action: () => { logout(); navigate('/'); } }
        ]
      : [
          { name: 'Sign In', action: () => navigate('/login') },
          { name: 'Get Started', action: () => navigate('/register') }
        ];

  const links = {
    Product: [
      { name: 'Features', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
      { name: 'Pricing', action: () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) },
      { name: 'Voice AI', action: () => {} }
    ],
    Company: [
      { name: 'About', action: () => {} },
      { name: 'Contact', action: () => window.location.href = "mailto:nexora.aidigital.twin@gmail.com" },
      { name: 'Legal', action: () => navigate('/legal') }
    ],
    Account: accountLinks
  };

  return (
    <footer className="pt-24 pb-12 border-t border-slate-800 bg-dark-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          {/* Logo Column */}
          <div className="col-span-2">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mb-4 cursor-pointer"
            >
              <div className="flex items-center justify-center p-1.5 rounded-xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-md">
                <LogoIcon className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">AI Twin</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Build AI versions of yourself. Handle conversations, meetings, and tasks—24/7.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={item.action}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors text-left"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Direct Contact Column */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:nexora.aidigital.twin@gmail.com" className="text-sm text-slate-500 hover:text-slate-300 transition-colors break-words">
                  nexora.aidigital.twin@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919625410112" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  +91 9625410112
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            &copy; 2026 AI Digital Twin. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-slate-500 hover:text-slate-300 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </button>
            <button className="text-slate-500 hover:text-slate-300 transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </button>
            <button className="text-slate-500 hover:text-slate-300 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Home Component
const Home = () => {
  return (
    <div className="relative min-h-screen bg-dark-950">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main>
        <Hero />
        <DashboardPreview />
        <Features />
        <HowItWorks />
        <TheMission />
        <Pricing />
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;

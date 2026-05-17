import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  Zap,
  Shield,
  BarChart3,
  Mic,
  Layers,
  Play,
  Globe,
  Brain as BrainIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LandingNavbar from '../components/LandingNavbar';
import LogoIcon from '../components/LogoIcon';

// Premium animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

// Premium Background Component
const PremiumBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Dynamic base background */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#050505] transition-colors duration-500" />

      {/* Subtle animated grain/noise texture */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] mix-blend-overlay dark:mix-blend-normal bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9lzZSkiLz48L3N2Zz4=')] animate-pulse" />

      {/* Soft radial ambient lighting - Neutrals */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-slate-200/20 dark:bg-white/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-slate-200/20 dark:bg-white/5 rounded-full blur-[100px]" />

      {/* Extremely subtle moving gradient mesh */}
      <motion.div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
          backgroundSize: '200% 200%'
        }}
      />
    </div>
  );
};

// Multi-business conversation cycles
const BUSINESS_CONVOS = [
  {
    business: '🍽️ Desi Dhaba',
    color: '#F97316',
    userMsg: "What's today's special thali?",
    botReply: "Today's special is Dal Makhani Thali — ₹149. Includes roti, rice, salad & dessert! 😋",
  },
  {
    business: '🛍️ Style Studio',
    color: '#8B5CF6',
    userMsg: 'Do you have kurtis in size M?',
    botReply: "Yes! We have 12 kurtis in size M, starting ₹599. Want me to show the latest collection?",
  },
  {
    business: '🏥 CarePoint Clinic',
    color: '#10B981',
    userMsg: 'Can I book an appointment for tomorrow?',
    botReply: "Sure! Dr. Mehta is available at 10 AM & 4 PM tomorrow. Which slot works for you?",
  },
  {
    business: '🚗 AutoFix Garage',
    color: '#3B82F6',
    userMsg: 'How much does a full service cost?',
    botReply: "Full car service starts at ₹2,499. Includes oil change, filter, and 20-point check. Book now?",
  },
];

const GREETING = { role: 'bot', content: "Hi! 👋 How can I help you today? Welcome to our AI assistant!" };

const HeroSmartphoneVisualization = () => {
  const [phase, setPhase] = useState('greeting'); // greeting | userMsg | typing | botReply | pause
  const [convoIndex, setConvoIndex] = useState(0);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      // Step 0: show greeting
      if (!mounted) return;
      setMessages([GREETING]);
      setPhase('greeting');
      await new Promise(r => setTimeout(r, 2200));

      let idx = 0;
      while (mounted) {
        const convo = BUSINESS_CONVOS[idx % BUSINESS_CONVOS.length];

        // Step 1: user message appears
        if (!mounted) break;
        setMessages([GREETING, { role: 'user', content: convo.userMsg }]);
        setPhase('userMsg');
        await new Promise(r => setTimeout(r, 1200));

        // Step 2: typing indicator
        if (!mounted) break;
        setPhase('typing');
        await new Promise(r => setTimeout(r, 1600));

        // Step 3: bot reply appears
        if (!mounted) break;
        setMessages([
          GREETING,
          { role: 'user', content: convo.userMsg },
          { role: 'bot', content: convo.botReply },
        ]);
        setPhase('botReply');
        await new Promise(r => setTimeout(r, 3200));

        // Step 4: reset for next business
        if (!mounted) break;
        setMessages([]);
        setPhase('pause');
        await new Promise(r => setTimeout(r, 800));

        idx++;
        setConvoIndex(idx % BUSINESS_CONVOS.length);
        // New greeting for next cycle
        if (!mounted) break;
        setMessages([GREETING]);
        setPhase('greeting');
        await new Promise(r => setTimeout(r, 1600));
      }
    };

    run();
    return () => { mounted = false; };
  }, []);

  const currentConvo = BUSINESS_CONVOS[convoIndex];
  const accentColor = currentConvo.color;

  return (
    <div className="relative flex items-center justify-end lg:justify-center w-full hidden lg:flex">
      {/* === Spiral Arrow + Label === */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-start gap-2 pointer-events-none"
        style={{ transform: 'translateY(-60%)' }}
      >
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 max-w-[170px]">
          <p className="text-xs font-semibold text-slate-300 leading-relaxed">
            ✦ Your AI clone will talk to your customers — exactly like this
          </p>
        </div>
        {/* Spiral SVG arrow pointing right toward phone */}
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none" className="ml-6 opacity-60">
          <path
            d="M10 10 C10 10, 30 0, 50 15 C70 30, 80 10, 90 30"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="4 3"
          />
          {/* Arrowhead */}
          <path d="M85 24 L90 30 L83 33" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </motion.div>

      {/* === Phone === */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[290px] h-[580px]"
      >
        {/* Glow behind phone */}
        <motion.div
          className="absolute inset-0 rounded-[3rem] blur-3xl -z-10"
          style={{ background: accentColor }}
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Phone body */}
        <div className="absolute inset-0 bg-[#111] rounded-[3rem] border-[7px] border-[#2a2a2a] shadow-2xl overflow-hidden ring-1 ring-white/5">
          {/* Notch */}
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
            <div className="w-28 h-7 bg-[#1a1a1a] rounded-b-2xl flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#111]" />
              <div className="w-2 h-2 rounded-full bg-indigo-900/80" />
            </div>
          </div>

          {/* Screen */}
          <div className="absolute inset-0 bg-[#0d0d0d] pt-10 pb-5 px-3 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-2 py-3 border-b border-white/5">
              <motion.div
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${accentColor}22`, border: `1.5px solid ${accentColor}55` }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentConvo.business.split(' ')[0]}
              </motion.div>
              <div>
                <p className="text-[11px] font-semibold text-white leading-none">{currentConvo.business.split(' ').slice(1).join(' ')}</p>
                <p className="text-[9px] mt-0.5 font-medium" style={{ color: '#10B981' }}>● Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden flex flex-col gap-2 justify-end py-3 px-1">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={`${convoIndex}-${idx}`}
                    initial={{ opacity: 0, y: 10, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92, y: -5 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`max-w-[86%] text-[11px] font-medium leading-relaxed px-3 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? 'self-end text-white rounded-br-sm shadow'
                        : 'self-start text-slate-200 bg-white/5 border border-white/8 rounded-bl-sm'
                    }`}
                    style={msg.role === 'user' ? { background: accentColor } : {}}
                  >
                    {msg.content}
                  </motion.div>
                ))}

                {/* Typing dots */}
                {phase === 'typing' && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="self-start bg-white/5 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center"
                  >
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: accentColor }}
                        animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input bar */}
            <div className="border-t border-white/5 pt-3 flex items-center gap-2 px-1">
              <div className="flex-1 h-9 bg-white/4 rounded-full border border-white/8 flex items-center px-3">
                <span className="text-[10px] text-slate-500">Type a message...</span>
              </div>
              <motion.div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow flex-shrink-0"
                style={{ background: accentColor }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-0.5">
                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Business name pill floating at top */}
        <motion.div
          key={convoIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
          style={{ background: accentColor }}
        >
          {currentConvo.business}
        </motion.div>
      </motion.div>
    </div>
  );
};


// Premium Hero Section
const Hero = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20">
      <PremiumBackground />

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Premium Badge */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-white/5 backdrop-blur-sm mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-300 tracking-wide">Your clone is ready</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </motion.div>

            {/* Premium Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6"
            >
              <span className="block">Your intelligence,</span>
              <span className="block text-slate-600 dark:text-slate-300">
                amplified by AI.
              </span>
            </motion.h1>

            {/* Premium Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-8 leading-relaxed font-light"
            >
              Create an AI digital twin that captures your exact knowledge, voice, and reasoning logic.
              Deploy an automated version of yourself that interacts with perfect accuracy, 24/7.
            </motion.p>
            
            {/* Premium CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <motion.button
                onClick={() => navigate('/register')}
                className="group relative px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-black rounded-2xl font-semibold text-sm overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Initialize Your Twin
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>

              <motion.button
                onClick={() => window.location.href = "mailto:nexora.aidigital.twin@gmail.com?subject=Demo Request"}
                className="group relative px-8 py-4 bg-slate-200/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-2xl font-semibold text-sm backdrop-blur-sm overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  See AI in Action
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          <HeroSmartphoneVisualization />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-400 dark:border-slate-700 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-slate-400 dark:bg-slate-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Premium Features Section
const Features = () => {
  const features = [
    {
      icon: Mic,
      title: 'Neural Voice Cloning',
      description: 'Capture your precise tone, cadence, and speaking style using advanced neural network synthesis.',
    },
    {
      icon: Zap,
      title: 'Real-time Inference',
      description: 'Ultra-low latency responses powered by optimized LLM infrastructure for natural conversations.',
    },
    {
      icon: Shield,
      title: 'Privacy-First Architecture',
      description: 'Your knowledge base is encrypted and isolated. We never train public models on your personal data.',
    },
    {
      icon: Globe,
      title: 'Omnichannel API',
      description: 'Integrate your digital twin seamlessly across the web, mobile apps, or enterprise communication tools.',
    },
    {
      icon: BarChart3,
      title: 'Cognitive Analytics',
      description: 'Gain deep insights into interactions, identifying patterns in what your audience is asking your twin.',
    },
    {
      icon: Layers,
      title: 'Dynamic Knowledge Sync',
      description: 'Connect live data sources. Your twin updates its understanding automatically as your information changes.',
    }
  ];

  return (
    <section id="features" className="relative py-32 bg-slate-50 dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">Core AI Capabilities</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Advanced intelligence,
            <span className="block text-slate-600 dark:text-slate-400">
              zero compromise
            </span>
          </h2>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light">
            Engineered with state-of-the-art machine learning to provide an indistinguishable digital proxy of yourself.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative p-8 rounded-2xl bg-white dark:bg-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-indigo-50 dark:group-hover:bg-white/10 transition-colors">
                <feature.icon className="w-6 h-6 text-indigo-600 dark:text-white/70 group-hover:text-indigo-700 dark:group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Premium How It Works Section
const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Data Ingestion',
      description: 'Securely upload your writings, speaking transcripts, and business logic into the neural network processing pipeline.'
    },
    {
      number: '02',
      title: 'Model Fine-Tuning',
      description: 'The AI analyzes your syntactic patterns, reasoning frameworks, and tone to generate a highly accurate cognitive replica.'
    },
    {
      number: '03',
      title: 'Live Activation',
      description: 'Your twin is deployed instantly, ready to process requests and output intelligent, context-aware responses.'
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-slate-50 dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Architecture</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            How the engine works
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
              <div className="p-8 rounded-2xl bg-white dark:bg-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 h-full">
                <span className="text-5xl font-bold text-indigo-600/10 dark:text-white/10">{step.number}</span>
                <h3 className="mt-6 text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">{step.title}</h3>
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed font-light">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Premium FAQ Section
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What underlying AI architecture powers the digital twin?",
      answer: "We utilize highly optimized, fine-tuned Large Language Models combined with a robust Retrieval-Augmented Generation (RAG) system to ensure your twin answers strictly based on your provided knowledge."
    },
    {
      question: "How long is the training process?",
      answer: "Initial embedding and indexing of your uploaded documents take only a few minutes. Your twin is essentially ready for deployment immediately after data ingestion."
    },
    {
      question: "Can I review what my digital twin says?",
      answer: "Yes, you have full access to a centralized dashboard where you can monitor all incoming queries and the exact responses generated by your twin in real-time."
    },
    {
      question: "Is it possible to integrate the twin into my custom app?",
      answer: "Absolutely. We provide a comprehensive REST API that allows you to seamlessly integrate your digital twin into any software ecosystem, web platform, or mobile application."
    }
  ];

  return (
    <section className="relative py-32 bg-slate-50 dark:bg-[#050505]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Knowledge Base</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Technical FAQs
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <span className="text-slate-900 dark:text-white font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Premium CTA Section
const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 overflow-hidden bg-slate-50 dark:bg-[#050505]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-20 rounded-3xl bg-white dark:bg-white/5 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none"
        >
          <div className="relative text-center z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6"
            >
              Initiate your AI deployment
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-light"
            >
              Join the next generation of digital presence. Create an autonomous intelligence that operates exactly as you do.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                onClick={() => navigate('/register')}
                className="group relative px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-black rounded-2xl font-semibold text-sm overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Launch Platform
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>
              <motion.button
                onClick={() => window.location.href = "mailto:nexora.aidigital.twin@gmail.com?subject=System Integration Inquiry"}
                className="px-8 py-4 bg-slate-100 text-slate-900 dark:bg-white/5 dark:text-white rounded-2xl font-semibold text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Engineering
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-slate-500"
            >
              <a href="mailto:nexora.aidigital.twin@gmail.com" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                nexora.aidigital.twin@gmail.com
              </a>
              <span className="hidden md:block">•</span>
              <a href="tel:+919625410112" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                +91 9625410112
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Premium Footer Component
const Footer = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const accountLinks = loading
    ? [{ name: 'Loading...', action: () => { } }]
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
    Platform: [
      { name: 'Architecture', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
      { name: 'Documentation', action: () => navigate('/guide') },
      { name: 'Voice Synthesis', action: () => navigate('/voice-agent') }
    ],
    Organization: [
      { name: 'Research', action: () => { } },
      { name: 'Contact', action: () => window.location.href = "mailto:nexora.aidigital.twin@gmail.com" },
      { name: 'Legal terms', action: () => navigate('/legal') }
    ],
    Account: accountLinks
  };

  return (
    <footer className="pt-24 pb-12 bg-slate-50 dark:bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          {/* Logo Column */}
          <div className="col-span-2">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 mb-6 cursor-pointer"
            >
              <div className="flex items-center justify-center p-2 rounded-xl bg-slate-200/50 dark:bg-white/5">
                <LogoIcon className="w-7 h-7" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI Digital Twin</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-500 max-w-xs font-light leading-relaxed">
              Deploy your cognitive replica. Intelligent automation powered by advanced neural networks.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">{category}</h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={item.action}
                      className="text-sm text-slate-600 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors text-left font-light"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Network</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:nexora.aidigital.twin@gmail.com" className="text-sm text-slate-600 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors break-words font-light">
                  nexora.aidigital.twin@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919625410112" className="text-sm text-slate-600 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors font-light">
                  +91 9625410112
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-light">
            &copy; {new Date().getFullYear()} AI Digital Twin Core. All systems active.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Home Component
const Home = () => {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#050505] font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;

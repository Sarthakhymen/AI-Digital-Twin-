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
  Brain as BrainIcon,
  Database,
  Sliders,
  Lock,
  Info,
  Server,
  Cpu,
  Sparkles,
  Smartphone,
  CheckCircle,
  HelpCircle,
  Terminal,
  Activity,
  Workflow
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
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] mix-blend-overlay dark:mix-blend-normal bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')] animate-pulse" />

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

// UserGuideMindmap Interactive Graph Tree Component
const UserGuideMindmap = () => {
  const [activeNode, setActiveNode] = useState("core");

  const nodes = {
    core: {
      id: "core",
      title: "AI Twin Engine",
      subtitle: "Central Processing Core",
      icon: <BrainIcon className="w-6 h-6 text-rose-400" />,
      status: "ONLINE",
      latency: "84ms",
      payload: "LLM-Orchestrator v2.0",
      description: "The central cognitive brain of your AI Digital Twin. Replicates your reasoning, tone, and knowledge base in real-time.",
      details: "Integrates Retrieval-Augmented Generation (RAG) to reference uploaded documents instantly, ensuring factual accuracy.",
      highlight: "Processes queries in under 100ms.",
      color: "from-rose-500 to-violet-600",
      glowColor: "rgba(244, 63, 94, 0.4)",
      x: 500, y: 300,
      preview: (
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
            <BrainIcon className="w-12 h-12 text-rose-500 relative animate-bounce" />
          </div>
          <span className="text-xs font-bold text-slate-200">Dual-Engine Orchestrator Active</span>
          <div className="flex gap-2 text-[10px] text-slate-500 font-mono">
            <span>THREADS: 64/64</span>
            <span>MEM_SYNC: 99.8%</span>
          </div>
        </div>
      )
    },
    ingestion: {
      id: "ingestion",
      title: "Data Ingestion",
      subtitle: "Neural Training Pipeline",
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      status: "SYNCED",
      latency: "120ms",
      payload: "Vector-Parser v1.4",
      description: "Orchestrates the conversion of files, text transcripts, and voice records into machine-understandable vectors.",
      details: "Handles concurrent document ingestion pipelines, converting text into 1536-dimensional embeddings.",
      highlight: "Supports PDF, TXT, DOCX, and URLs.",
      color: "from-blue-500 to-cyan-400",
      glowColor: "rgba(59, 130, 246, 0.4)",
      x: 280, y: 180,
      preview: (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ingestion Queue:</span>
            <span className="text-emerald-400 font-mono">0 pending</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-full" />
          </div>
          <p className="text-[10px] text-slate-500 text-center">Ready to process incoming file streams.</p>
        </div>
      )
    },
    kb: {
      id: "kb",
      title: "Knowledge Base",
      subtitle: "Vector Storage Engine",
      icon: <Database className="w-4 h-4 text-cyan-400" />,
      status: "READY",
      latency: "15ms",
      payload: "ChromaDB Indexer",
      description: "Processes and indexes your custom files. Your twin references this exact knowledge base when answering user questions.",
      details: "Ensures secure, tenant-isolated data storage. Your training files are never shared with public LLMs.",
      highlight: "Strict multi-tenant security.",
      color: "from-cyan-500 to-blue-600",
      glowColor: "rgba(34, 211, 238, 0.3)",
      x: 90, y: 100,
      preview: (
        <div className="border border-dashed border-slate-800 bg-slate-950/40 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-blue-500/40 transition-colors">
          <Database className="w-6 h-6 text-blue-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">Drag & drop files here</span>
          <span className="text-[10px] text-slate-500">PDF, TXT, DOCX, or CSV (max 25MB)</span>
        </div>
      )
    },
    voice_clone: {
      id: "voice_clone",
      title: "Voice Cloning",
      subtitle: "Neural Speech Synthesizer",
      icon: <Mic className="w-4 h-4 text-indigo-400" />,
      status: "READY",
      latency: "180ms",
      payload: "Neural-Voice-Synth",
      description: "Synthesizes custom voice profiles using neural speech cloning technology from a short voice sample.",
      details: "Extracts acoustic parameters including pitch, tone, and speed to generate voice agent audio.",
      highlight: "Generates high-fidelity clone audio.",
      color: "from-indigo-500 to-violet-600",
      glowColor: "rgba(99, 102, 241, 0.3)",
      x: 90, y: 260,
      preview: (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center justify-center space-y-2">
          <div className="w-full flex items-center gap-1.5 h-6 bg-slate-900 rounded-md px-2 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-[9px] font-mono text-indigo-400">VOICE_ENGINE: RECORDING...</span>
          </div>
          <span className="text-[10px] text-slate-500">Speak or upload a 10s voice snippet to capture your voice.</span>
        </div>
      )
    },
    access: {
      id: "access",
      title: "Gating & Access",
      subtitle: "Policy Enforcement",
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      status: "STRICT",
      latency: "8ms",
      payload: "HierarchicalGate v1",
      description: "Controls endpoint accessibility. Validates plans and limits before processing requests.",
      details: "Ensures Standard and Free Trial users are strictly blocked from using Business Pro APIs.",
      highlight: "Enforces plan-based monetization.",
      color: "from-emerald-500 to-teal-400",
      glowColor: "rgba(16, 185, 129, 0.4)",
      x: 280, y: 420,
      preview: (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Policy: Standard Gating</span>
            <span className="text-emerald-400 font-bold">ENFORCED</span>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded-md font-bold text-[9px] border border-rose-500/20">PRO ONLY</span>
            <span className="text-[10px] text-slate-500">WhatsApp & Voice bot routes strictly locked.</span>
          </div>
        </div>
      )
    },
    pricing: {
      id: "pricing",
      title: "Flexible Tiers",
      subtitle: "Payment Processing",
      icon: <Info className="w-4 h-4 text-emerald-400" />,
      status: "ACTIVE",
      latency: "12ms",
      payload: "Razorpay SDK",
      description: "Processes subscription purchases and plans. Standard plan is priced at $5 (INR 5) for sandbox testing.",
      details: "Supports immediate plan upgrades, manual payment requests via UPI, and subscription logs.",
      highlight: "Easy INR / USD sandbox pricing.",
      color: "from-emerald-400 to-teal-500",
      glowColor: "rgba(52, 211, 153, 0.3)",
      x: 90, y: 340,
      preview: (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium">Standard Plan (Test Price)</span>
            <span className="font-bold text-white">$5 / ₹5</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[80%]" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure sandbox checkout using UPI/Razorpay</span>
          </div>
        </div>
      )
    },
    gating: {
      id: "gating",
      title: "Feature Gating",
      subtitle: "Route Interception",
      icon: <Lock className="w-4 h-4 text-teal-400" />,
      status: "ENFORCED",
      latency: "5ms",
      payload: "RequirePlan Dependency",
      description: "A strict backend dependency that intercepts API calls and checks the user's plan credentials.",
      details: "Guards routes such as WhatsApp config, voice agent dialing, and advanced reporting charts.",
      highlight: "Guarantees secure route protection.",
      color: "from-teal-400 to-emerald-600",
      glowColor: "rgba(20, 184, 166, 0.3)",
      x: 90, y: 500,
      preview: (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Lock className="w-4 h-4 text-rose-500" />
            <span className="text-slate-300 font-bold">Access Denied (403)</span>
          </div>
          <p className="text-[10px] text-slate-500">You must be on Business Pro to edit WhatsApp settings.</p>
        </div>
      )
    },
    channels: {
      id: "channels",
      title: "Omni-Channel",
      subtitle: "Integration Dispatcher",
      icon: <Workflow className="w-5 h-5 text-amber-400" />,
      status: "ROUTING",
      latency: "62ms",
      payload: "Router v2.1",
      description: "Dispatches incoming messages from widgets, voice calls, or messaging APIs to the AI Twin brain.",
      details: "Manages session states and coordinates responses back to their respective origin channels.",
      highlight: "Concurrent multi-channel dispatch.",
      color: "from-amber-500 to-orange-400",
      glowColor: "rgba(245, 158, 11, 0.4)",
      x: 720, y: 180,
      preview: (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Routes Active:</span>
            <span className="text-amber-400 font-bold">2 Connected</span>
          </div>
          <div className="flex gap-2 justify-center py-1">
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-md font-mono text-[9px]">WIDGET</span>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-md font-mono text-[9px]">VOICE</span>
          </div>
        </div>
      )
    },
    widget: {
      id: "widget",
      title: "Web Chat Widget",
      subtitle: "Embedded Script UI",
      icon: <Smartphone className="w-4 h-4 text-amber-400" />,
      status: "DEPLOYED",
      latency: "35ms",
      payload: "widget.js v1",
      description: "A lightweight script injected via HTML to display a sleek, modern chat interface on client websites.",
      details: "Configurable placement, colors, watermarks, and built-in lead generation collection forms.",
      highlight: "Single-line HTML integration.",
      color: "from-amber-400 to-yellow-500",
      glowColor: "rgba(251, 191, 36, 0.3)",
      x: 910, y: 100,
      preview: (
        <div className="space-y-2">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-[9px] text-slate-300 relative group overflow-x-auto whitespace-pre">
            <code>{`<script src="https://ai-twin-2le9.onrender.com/api/v1/integrations/8/widget.js" data-position="right"></script>`}</code>
          </div>
          <p className="text-[10px] text-slate-500 text-center">Copy-paste this script right before the closing &lt;/body&gt; tag.</p>
        </div>
      )
    },
    voice_call: {
      id: "voice_call",
      title: "Voice Agent",
      subtitle: "Real-time Voice Caller",
      icon: <Mic className="w-4 h-4 text-orange-400" />,
      status: "STANDBY",
      latency: "190ms",
      payload: "WebRTC Synth",
      description: "Allows visitors to place direct audio calls to speak with your voice-cloned digital twin.",
      details: "Integrates WebRTC audio streams, fast speech-to-text, and cloned voice-synthesis for conversational speed.",
      highlight: "Under 200ms latency voice response.",
      color: "from-orange-400 to-amber-500",
      glowColor: "rgba(251, 146, 60, 0.3)",
      x: 910, y: 260,
      preview: (
        <div className="flex flex-col items-center justify-center py-2 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-pulse">
            <Mic className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[10px] font-bold text-slate-200">RTC Audio Stream: 128kbps</span>
          <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[10px] font-bold transition-all">
            Call Simulated Agent
          </button>
        </div>
      )
    },
    analytics: {
      id: "analytics",
      title: "Analytics & Logs",
      subtitle: "System Monitor",
      icon: <Activity className="w-5 h-5 text-purple-400" />,
      status: "COLLECTING",
      latency: "40ms",
      payload: "Audit-Core v1",
      description: "Aggregates performance analytics, message count thresholds, and payment requests.",
      details: "Exposes system telemetry and session counts, notifying admins when resource limits are reached.",
      highlight: "Tracks digital twin usage patterns.",
      color: "from-purple-500 to-fuchsia-400",
      glowColor: "rgba(168, 85, 247, 0.4)",
      x: 720, y: 420,
      preview: (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span>Log Collector:</span>
            <span className="text-purple-400 animate-pulse font-mono">COLLECTING</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>SYS_EVENT: User msg counted (OK)</span>
          </div>
        </div>
      )
    },
    dashboard: {
      id: "dashboard",
      title: "Performance Stats",
      subtitle: "Reporting Interface",
      icon: <BarChart3 className="w-4 h-4 text-purple-400" />,
      status: "ACTIVE",
      latency: "25ms",
      payload: "ChartJS v2",
      description: "Provides analytical charts tracking message counts, active conversation threads, and response rates.",
      details: "Displays real-time usage graphs on the user's dashboard to audit system performance.",
      highlight: "Visually maps user interactions.",
      color: "from-purple-400 to-fuchsia-500",
      glowColor: "rgba(192, 132, 252, 0.3)",
      x: 910, y: 340,
      preview: (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-2">
          <div className="flex items-end justify-between h-10 px-4">
            <div className="w-3 bg-purple-500/40 rounded-t h-[40%]" />
            <div className="w-3 bg-purple-500/60 rounded-t h-[60%]" />
            <div className="w-3 bg-purple-500/80 rounded-t h-[90%]" />
            <div className="w-3 bg-purple-500 rounded-t h-[75%]" />
          </div>
          <div className="text-[9px] text-slate-500 text-center font-mono">CONVERSATION TRAFFIC TODAY</div>
        </div>
      )
    },
    admin_override: {
      id: "admin_override",
      title: "Admin Controls",
      subtitle: "Root Management Portal",
      icon: <Sliders className="w-4 h-4 text-fuchsia-400" />,
      status: "ROOT",
      latency: "10ms",
      payload: "AdminOverride v2",
      description: "Allows the owner to override any user's subscription settings and verify UPI requests.",
      details: "Provides UI to adjust message counts, change plans, extend expirations, and verify UPI transactions.",
      highlight: "Instantly override subscription parameters.",
      color: "from-fuchsia-400 to-pink-500",
      glowColor: "rgba(232, 121, 249, 0.3)",
      x: 910, y: 500,
      preview: (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">User: sarthak@domain.com</span>
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md font-bold text-[9px] border border-purple-500/20">SYS_PRO</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Bypass Message limits:</span>
            <span className="text-emerald-400 font-bold">TRUE</span>
          </div>
        </div>
      )
    }
  };

  const selectedNode = nodes[activeNode];

  return (
    <section className="relative py-32 overflow-hidden bg-slate-50 dark:bg-[#050505] transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Block */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-rose-500 dark:text-rose-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" /> System Blueprints
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Interactive User Guide & Node Map
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Click on the nodes below to inspect our architecture flow, subscription models, integration code snippets, and admin panels.
          </p>
        </div>

        {/* Mindmap Layout Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* SVG Mindmap Graph Column */}
          <div className="lg:col-span-8 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden flex items-center justify-center select-none shadow-2xl min-h-[500px]">
            {/* Ambient Background Grid for sci-fi feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 pointer-events-none" />

            {/* Desktop SVG Node Graph */}
            <div className="relative w-full aspect-[1000/600] max-w-full hidden md:block z-10">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
                {/* Defs for gradients & shadow glows */}
                <defs>
                  <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="gradient-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#d946ef" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* SVG Connections with data pulses */}
                {/* 1. Center to Ingestion */}
                <path d="M 500,300 C 400,300 380,180 280,180" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="3" fill="none" />
                <motion.path
                  d="M 500,300 C 400,300 380,180 280,180"
                  stroke="url(#gradient-blue)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="10, 25"
                  animate={{ strokeDashoffset: [0, -70] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />

                {/* Ingestion to KB */}
                <path d="M 280,180 C 200,180 170,100 90,100" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="2" fill="none" />
                <motion.path
                  d="M 280,180 C 200,180 170,100 90,100"
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="8, 15"
                  animate={{ strokeDashoffset: [0, -30] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />

                {/* Ingestion to Voice Clone */}
                <path d="M 280,180 C 200,180 170,260 90,260" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="2" fill="none" />
                <motion.path
                  d="M 280,180 C 200,180 170,260 90,260"
                  stroke="#818cf8"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="8, 15"
                  animate={{ strokeDashoffset: [0, -30] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />

                {/* 2. Center to Access */}
                <path d="M 500,300 C 400,300 380,420 280,420" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="3" fill="none" />
                <motion.path
                  d="M 500,300 C 400,300 380,420 280,420"
                  stroke="url(#gradient-emerald)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="10, 25"
                  animate={{ strokeDashoffset: [0, -70] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />

                {/* Access to Pricing */}
                <path d="M 280,420 C 200,420 170,340 90,340" stroke="rgba(52, 211, 153, 0.25)" strokeWidth="2" fill="none" />
                <motion.path
                  d="M 280,420 C 200,420 170,340 90,340"
                  stroke="#34d399"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="8, 15"
                  animate={{ strokeDashoffset: [0, -30] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />

                {/* Access to Gating */}
                <path d="M 280,420 C 200,420 170,500 90,500" stroke="rgba(20, 184, 166, 0.25)" strokeWidth="2" fill="none" />
                <motion.path
                  d="M 280,420 C 200,420 170,500 90,500"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="8, 15"
                  animate={{ strokeDashoffset: [0, -30] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />

                {/* 3. Center to Channels */}
                <path d="M 500,300 C 600,300 620,180 720,180" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="3" fill="none" />
                <motion.path
                  d="M 500,300 C 600,300 620,180 720,180"
                  stroke="url(#gradient-amber)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="10, 25"
                  animate={{ strokeDashoffset: [0, 70] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />

                {/* Channels to Widget */}
                <path d="M 720,180 C 800,180 830,100 910,100" stroke="rgba(251, 191, 36, 0.25)" strokeWidth="2" fill="none" />
                <motion.path
                  d="M 720,180 C 800,180 830,100 910,100"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="8, 15"
                  animate={{ strokeDashoffset: [0, 30] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />

                {/* Channels to Voice Agent */}
                <path d="M 720,180 C 800,180 830,260 910,260" stroke="rgba(249, 115, 22, 0.25)" strokeWidth="2" fill="none" />
                <motion.path
                  d="M 720,180 C 800,180 830,260 910,260"
                  stroke="#fb923c"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="8, 15"
                  animate={{ strokeDashoffset: [0, 30] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />

                {/* 4. Center to Analytics */}
                <path d="M 500,300 C 600,300 620,420 720,420" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="3" fill="none" />
                <motion.path
                  d="M 500,300 C 600,300 620,420 720,420"
                  stroke="url(#gradient-purple)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="10, 25"
                  animate={{ strokeDashoffset: [0, 70] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />

                {/* Analytics to Stats */}
                <path d="M 720,420 C 800,420 830,340 910,340" stroke="rgba(192, 132, 252, 0.25)" strokeWidth="2" fill="none" />
                <motion.path
                  d="M 720,420 C 800,420 830,340 910,340"
                  stroke="#c084fc"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="8, 15"
                  animate={{ strokeDashoffset: [0, 30] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />

                {/* Analytics to Admin Controls */}
                <path d="M 720,420 C 800,420 830,500 910,500" stroke="rgba(232, 121, 249, 0.25)" strokeWidth="2" fill="none" />
                <motion.path
                  d="M 720,420 C 800,420 830,500 910,500"
                  stroke="#e879f9"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="8, 15"
                  animate={{ strokeDashoffset: [0, 30] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />
              </svg>

              {/* Render HTML Nodes Over the SVG canvas */}
              {Object.values(nodes).map((node) => {
                const isActive = activeNode === node.id;
                const isRoot = node.id === "core";
                const isBranch = ["ingestion", "access", "channels", "analytics"].includes(node.id);

                return (
                  <motion.div
                    key={node.id}
                    className="absolute"
                    style={{
                      left: `${node.x / 10}%`,
                      top: `${node.y / 6}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <button
                      onClick={() => setActiveNode(node.id)}
                      className={`flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                        isRoot
                          ? 'w-24 h-24 bg-gradient-to-br from-rose-600/90 to-violet-700/90 text-white border-2 border-white/25 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                          : isBranch
                            ? `px-4 py-2.5 bg-slate-900/95 border text-white ${
                                isActive ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]' : 'border-slate-800 hover:border-slate-700'
                              }`
                            : `w-12 h-12 bg-slate-950/95 rounded-full border flex items-center justify-center ${
                                isActive ? 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]' : 'border-slate-800/80 hover:border-slate-700'
                              }`
                      }`}
                    >
                      {isRoot ? (
                        <>
                          <BrainIcon className="w-8 h-8 text-white animate-pulse" />
                          <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Engine</span>
                        </>
                      ) : isBranch ? (
                        <div className="flex items-center gap-2">
                          {node.icon}
                          <span className="text-[10px] font-extrabold tracking-wide uppercase">{node.title.replace(/^\d\.\s/, '')}</span>
                        </div>
                      ) : (
                        node.icon
                      )}
                    </button>

                    {/* Small Node Floating Title (for Leaves only) */}
                    {!isRoot && !isBranch && (
                      <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-800 rounded px-2 py-0.5 text-[8px] font-extrabold text-slate-300 tracking-wide uppercase whitespace-nowrap shadow-md">
                        {node.title}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Accordion tree view (renders instead of canvas on mobile) */}
            <div className="w-full space-y-4 md:hidden block z-10 py-6">
              {Object.values(nodes).map((node) => {
                const isActive = activeNode === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-slate-900 border-indigo-500 shadow-xl' 
                        : 'bg-slate-950/60 border-slate-900 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-slate-900/90 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                        {node.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{node.title}</h4>
                        <span className="text-[9px] text-slate-500 tracking-widest">{node.subtitle}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Node Details Card Column */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between h-full relative overflow-hidden shadow-2xl backdrop-blur-md"
              >
                {/* Scientific telemetry glow inside card */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-15 pointer-events-none bg-gradient-to-br ${selectedNode.color}`} />
                
                {/* Header Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-500 font-mono text-[9px] rounded uppercase tracking-widest">
                      {selectedNode.category || "Blueprint Node"}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[9px] text-emerald-400 font-mono font-bold tracking-wider">{selectedNode.status}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedNode.color} p-0.5 shadow-lg`}>
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                        {selectedNode.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{selectedNode.title}</h3>
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{selectedNode.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-light mt-4">
                    {selectedNode.description}
                  </p>

                  <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-4 mt-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-light italic">
                      💡 {selectedNode.details}
                    </p>
                  </div>
                </div>

                {/* Technical Interactive Area */}
                <div className="mt-6 pt-4 border-t border-slate-900 space-y-4">
                  <div className="grid grid-cols-2 gap-3 font-mono text-[8px] text-slate-500 bg-slate-950/60 rounded-xl p-2.5 border border-slate-900">
                    <div>
                      <span className="block text-slate-600 font-bold uppercase">Latency Threshold</span>
                      <span className="text-slate-400 font-extrabold">{selectedNode.latency}</span>
                    </div>
                    <div>
                      <span className="block text-slate-600 font-bold uppercase">Downstream Module</span>
                      <span className="text-slate-400 font-extrabold truncate block">{selectedNode.payload}</span>
                    </div>
                  </div>

                  {selectedNode.preview}

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-rose-500 font-bold tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-rose-500 animate-spin" /> {selectedNode.highlight}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
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
        <UserGuideMindmap />
        <FAQ />
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;

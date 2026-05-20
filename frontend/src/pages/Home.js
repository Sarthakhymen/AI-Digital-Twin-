import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  Zap,
  Shield,
  BarChart3,
  Mic,
  Brain,
  Database,
  Sliders,
  Lock,
  Info,
  Cpu,
  Sparkles,
  Smartphone,
  CheckCircle,
  Terminal,
  Activity,
  Workflow,
  FileText,
  Volume2,
  Scan,
  RefreshCw,
  Check,
  Globe,
  Users,
  CheckSquare,
  TrendingUp,
  MessageCircle,
  BookOpen,
  Smile,
  CreditCard,
  Briefcase,
  Settings,
  Power,
  Code2,
  Send
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LandingNavbar from '../components/LandingNavbar';
import LogoIcon from '../components/LogoIcon';

// Premium animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Deep Space Premium Background
const PremiumBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030014]">
      {/* Mesh gradients / Nebula glow */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(217, 70, 239, 0.2) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 75%)',
          filter: 'blur(90px)'
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.35, 0.25]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

      {/* Subtle base64 grain overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')] pointer-events-none" />
    </div>
  );
};

// Real multi-business conversation cycles showing real product behaviors
const BUSINESS_CONVOS = [
  {
    business: '⚙️ AI Digital Twin',
    color: '#6366F1',
    userMsg: 'How do I link my twin to WhatsApp?',
    botReply: "Just click the WhatsApp Scanner tab in your Dashboard, scan the QR code using your WhatsApp Linked Devices, and your twin takes over instantly! 📲",
  },
  {
    business: '🎙️ Voice Synthesizer',
    color: '#D946EF',
    userMsg: 'Can my twin make real audio calls?',
    botReply: "Yes! Record a 10s voice print to clone your tone. Visitors can then call your clone via WebRTC for real-time talk! 🗣️",
  },
  {
    business: '📂 Knowledge Sync',
    color: '#06B6D4',
    userMsg: 'Does my twin read my PDF files?',
    botReply: "Absolutely. Upload your PDFs, DOCX files, or website URLs. The engine vectorizes them so it replies with absolute accuracy. 📚",
  },
  {
    business: '🛡️ Feature Gatekeeper',
    color: '#10B981',
    userMsg: 'Is there a limit on free trials?',
    botReply: "Yes. Free trials are active for 3 days and limited to 50 messages. Upgrade to Standard (₹1299/mo) to unlock unlimited queries! ⚡",
  }
];

const GREETING = { role: 'bot', content: "Hi! 👋 Ask me anything about creating your own AI Digital Twin!" };

// Smartphone Widget Simulator Component
const HeroSmartphoneVisualization = () => {
  const [phase, setPhase] = useState('greeting'); // greeting | userMsg | typing | botReply | pause
  const [convoIndex, setConvoIndex] = useState(0);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!mounted) return;
      setMessages([GREETING]);
      setPhase('greeting');
      await new Promise(r => setTimeout(r, 2200));

      let idx = 0;
      while (mounted) {
        const convo = BUSINESS_CONVOS[idx % BUSINESS_CONVOS.length];

        // User message appears
        if (!mounted) break;
        setMessages([GREETING, { role: 'user', content: convo.userMsg }]);
        setPhase('userMsg');
        await new Promise(r => setTimeout(r, 1500));

        // Typing indicator
        if (!mounted) break;
        setPhase('typing');
        await new Promise(r => setTimeout(r, 1600));

        // Bot reply appears
        if (!mounted) break;
        setMessages([
          GREETING,
          { role: 'user', content: convo.userMsg },
          { role: 'bot', content: convo.botReply },
        ]);
        setPhase('botReply');
        await new Promise(r => setTimeout(r, 3800));

        // Reset for next conversation
        if (!mounted) break;
        setMessages([]);
        setPhase('pause');
        await new Promise(r => setTimeout(r, 800));

        idx++;
        setConvoIndex(idx % BUSINESS_CONVOS.length);
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
    <div className="relative flex items-center justify-center w-full lg:max-w-md mx-auto">
      {/* Decorative background glow behind phone */}
      <motion.div
        className="absolute w-72 h-96 rounded-full blur-3xl -z-10 opacity-30"
        style={{ backgroundColor: accentColor }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Phone Body Wrapper */}
      <div className="relative w-[300px] h-[600px] bg-[#0c0d12] rounded-[3.2rem] border-[6px] border-[#222530] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden ring-1 ring-white/10">
        
        {/* Notch / Speaker */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-30">
          <div className="w-32 h-5 bg-[#222530] rounded-b-2xl flex items-center justify-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0c0d12]" />
            <div className="w-10 h-1 bg-[#15171e] rounded-full" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="absolute inset-0 pt-8 pb-4 px-3 flex flex-col justify-between bg-slate-950">
          {/* Header */}
          <div className="flex items-center justify-between px-2 py-2.5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44` }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentConvo.business.split(' ')[0]}
              </motion.div>
              <div>
                <p className="text-[11px] font-bold text-white leading-none">{currentConvo.business.split(' ').slice(1).join(' ')}</p>
                <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">● Twin Answering</p>
              </div>
            </div>
            <span className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md text-slate-400 font-mono">v1.2</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden flex flex-col gap-2.5 justify-end py-3 px-1">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, idx) => (
                <motion.div
                  key={`${convoIndex}-${idx}`}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, y: -6 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={`max-w-[85%] text-[11px] font-medium leading-relaxed px-3 py-2 rounded-2xl ${
                    msg.role === 'user'
                      ? 'self-end text-white rounded-br-sm shadow-md'
                      : 'self-start text-slate-200 bg-white/5 border border-white/10 rounded-bl-sm'
                  }`}
                  style={msg.role === 'user' ? { background: accentColor } : {}}
                >
                  {msg.content}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {phase === 'typing' && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="self-start bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex gap-1.5 items-center"
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: accentColor }}
                      animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 0.7, delay }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Watermark (Brand Name Update) */}
          <div className="text-center py-1 border-t border-white/5 bg-slate-950">
            <span className="text-[8px] text-slate-500 font-medium tracking-wide">
              Powered by <span className="text-indigo-400 font-semibold">AI Digital Twin</span>
            </span>
          </div>

          {/* Mock Input Bar */}
          <div className="pt-2 flex items-center gap-2 px-1">
            <div className="flex-1 h-8 bg-white/5 rounded-full border border-white/10 flex items-center px-3">
              <span className="text-[10px] text-slate-500">Ask the digital twin...</span>
            </div>
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow flex-shrink-0"
              style={{ background: accentColor }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 ml-0.5">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Status Indicator Badge */}
      <motion.div
        key={convoIndex}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute -top-3 px-4 py-1.5 rounded-full text-[9px] font-bold text-white shadow-xl flex items-center gap-1.5 ring-1 ring-white/10 border border-white/5"
        style={{ background: `linear-gradient(135deg, ${accentColor}, #0d0e15)` }}
      >
        <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
        {currentConvo.business.split(' ').slice(1).join(' ')}
      </motion.div>
    </div>
  );
};

// Futuristic Startup Hero Section
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden z-10">
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Pitch Column */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider text-indigo-300 uppercase">Next-Gen Cognitive Clones</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold tracking-tight leading-[1.1]"
          >
            <span className="block bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Clone Your Intelligence.
            </span>
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Automate Your Presence.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg text-slate-400 max-w-xl font-medium leading-relaxed"
          >
            Deploy a custom AI digital twin trained on your specific business records, documents, and transcripts. 
            Automate customer queries over chat widgets and WhatsApp, or let visitors place voice calls with your cloned voice.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <motion.button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto group relative px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold text-sm overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Create Your Twin Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            <motion.button
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto px-8 py-4 bg-white/[0.04] border border-white/10 hover:border-white/20 text-white rounded-2xl font-bold text-sm backdrop-blur-md hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-4 h-4 text-indigo-400" />
              View Standard Tier (₹1299)
            </motion.button>
          </motion.div>

          {/* Micro stats banner */}
          <motion.div
            variants={fadeInUp}
            className="pt-6 grid grid-cols-3 gap-6 border-t border-white/5 w-full max-w-md"
          >
            <div>
              <span className="block text-xl font-bold text-white">Sub-100ms</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Response Speed</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-white">99.4%</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Accuracy Index</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-white">Omnichannel</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Web & WhatsApp</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Smartphone Simulator Mockup Column */}
        <div className="lg:col-span-5 flex justify-center">
          <HeroSmartphoneVisualization />
        </div>

      </div>
    </section>
  );
};

// Interactive Capabilities Playground (NEW Component - No Fake Data)
const CapabilitiesPlayground = () => {
  const [activeTab, setActiveTab] = useState('kb'); // kb | widget | voice | whatsapp
  
  // Customizer state for Widget Tab
  const [widgetColor, setWidgetColor] = useState('#6366F1');
  const [showWatermark, setShowWatermark] = useState(true);

  // Ingest states
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | parsed
  const [percent, setPercent] = useState(0);

  const startUploadSim = () => {
    setUploadState('uploading');
    setPercent(0);
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('parsed');
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // Voice synthesis states
  const [voiceState, setVoiceState] = useState('idle'); // idle | recording | synth | complete
  const startVoiceSim = () => {
    setVoiceState('recording');
    setTimeout(() => {
      setVoiceState('synth');
      setTimeout(() => {
        setVoiceState('complete');
      }, 2000);
    }, 2000);
  };

  // WhatsApp states
  const [waState, setWaState] = useState('idle'); // idle | scanning | connected
  const startWaSim = () => {
    setWaState('scanning');
    setTimeout(() => {
      setWaState('connected');
    }, 3000);
  };

  const tabs = [
    { id: 'kb', label: 'Knowledge Base Ingestion', icon: Database },
    { id: 'widget', label: 'Web Chat Widget Customizer', icon: Smartphone },
    { id: 'voice', label: 'Neural Voice Synthesis', icon: Mic },
    { id: 'whatsapp', label: 'WhatsApp QR Linkage', icon: Scan }
  ];

  return (
    <section className="relative py-24 bg-slate-950/20 border-t border-b border-white/5 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Sliders className="w-4 h-4" /> Real-time Capability Sandbox
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            See the Platform Features in Action
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm font-medium">
            Test the real interactive capabilities that power your AI Digital Twin. Experience the exact functional components directly inside the browser.
          </p>
        </div>

        {/* Grid Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tabs Selector list */}
          <div className="lg:col-span-4 space-y-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/40 text-white shadow-lg'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Module</span>
                    <span className="text-sm font-bold">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Preview Container */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-3xl p-8 min-h-[400px] flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-md">
            
            {/* Ambient inner glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {activeTab === 'kb' && (
                <motion.div
                  key="kb"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold rounded uppercase tracking-wider border border-indigo-500/20">Knowledge Core</span>
                    <h3 className="text-xl font-bold text-white mt-2">Vector Ingestion Pipeline</h3>
                    <p className="text-xs text-slate-400 mt-1">Upload knowledge parameters. The pipeline tokenizes, indexes, and syncs vectors directly to the Digital Twin database.</p>
                  </div>

                  {/* Simulator Area */}
                  {uploadState === 'idle' && (
                    <div
                      onClick={startUploadSim}
                      className="border border-dashed border-white/10 hover:border-indigo-500/30 bg-slate-950/40 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all"
                    >
                      <FileText className="w-10 h-10 text-indigo-400 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-200">Click to upload mock files (e.g. faq.pdf, pricing_terms.txt)</span>
                      <span className="text-[10px] text-slate-500">Simulates vector processing and database injection</span>
                    </div>
                  )}

                  {uploadState === 'uploading' && (
                    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
                      <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                      <div className="w-full max-w-xs space-y-2">
                        <div className="flex justify-between text-xs font-mono text-slate-400">
                          <span>Tokenizing & Embedding...</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {uploadState === 'parsed' && (
                    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
                      <CheckCircle className="w-10 h-10 text-emerald-400 animate-bounce" />
                      <div className="text-center space-y-1">
                        <span className="text-sm font-bold text-white">Database Synchronization Successful!</span>
                        <p className="text-[11px] text-slate-500">25,840 vectors processed and indexed into ChromaDB tenant instance.</p>
                      </div>
                      <button
                        onClick={() => setUploadState('idle')}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Reset Pipeline
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'widget' && (
                <motion.div
                  key="widget"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {/* Customizer Toggles */}
                  <div className="space-y-6">
                    <div>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold rounded uppercase tracking-wider border border-indigo-500/20">Customizer</span>
                      <h3 className="text-xl font-bold text-white mt-2">Widget Editor</h3>
                      <p className="text-xs text-slate-400 mt-1">Configure layout options. Changes will apply to the web integration preview immediately.</p>
                    </div>

                    {/* Colors selection */}
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Widget Color Theme</label>
                      <div className="flex gap-3">
                        {['#6366F1', '#D946EF', '#06B6D4', '#10B981', '#F59E0B'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setWidgetColor(color)}
                            className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                            style={{
                              backgroundColor: color,
                              borderColor: widgetColor === color ? 'white' : 'transparent'
                            }}
                          >
                            {widgetColor === color && <Check className="w-4 h-4 text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Watermark Toggle */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="wt"
                        checked={showWatermark}
                        onChange={(e) => setShowWatermark(e.target.checked)}
                        className="w-4 h-4 accent-indigo-500 rounded bg-slate-900 border-white/10"
                      />
                      <label htmlFor="wt" className="text-xs text-slate-300 font-medium">
                        Show "Powered by AI Digital Twin" watermark
                      </label>
                    </div>

                    <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-slate-500 leading-normal">
                      💡 Standard Plan (₹1299/mo) removes the "Powered by AI Digital Twin" watermark branding completely.
                    </div>
                  </div>

                  {/* Mock Widget Preview */}
                  <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-[300px] shadow-inner">
                    {/* Widget Top bar */}
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: widgetColor }}>
                        🤖
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-white">AI Twin Assistant</span>
                        <span className="block text-[8px] text-emerald-400 font-semibold">● Active</span>
                      </div>
                    </div>

                    {/* Bubbles */}
                    <div className="flex-1 flex flex-col gap-2 justify-end py-4">
                      <div className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-2xl rounded-bl-sm text-[9px] text-slate-300 self-start max-w-[85%]">
                        Hello! Welcome to our website. How can I help you today?
                      </div>
                      <div className="px-3 py-1.5 rounded-2xl rounded-br-sm text-[9px] text-white self-end max-w-[85%]" style={{ backgroundColor: widgetColor }}>
                        Show me standard plan details.
                      </div>
                    </div>

                    {/* Branding watermarks */}
                    {showWatermark && (
                      <div className="text-center py-1 bg-slate-900/50 rounded-md border border-white/5 mb-2">
                        <span className="text-[8px] text-slate-500">
                          Powered by <span className="text-slate-400 font-bold">AI Digital Twin</span>
                        </span>
                      </div>
                    )}

                    {/* Chat Input block */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-7 bg-white/5 rounded-full border border-white/10 px-2 flex items-center">
                        <span className="text-[8px] text-slate-500">Ask a question...</span>
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: widgetColor }}>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'voice' && (
                <motion.div
                  key="voice"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold rounded uppercase tracking-wider border border-indigo-500/20">Acoustic Synthesizer</span>
                    <h3 className="text-xl font-bold text-white mt-2">Neural Voice Synthesis</h3>
                    <p className="text-xs text-slate-400 mt-1">Record a 10-second audio profile. The AI models capture pitch, accent, and speech speed variables to clone your voice.</p>
                  </div>

                  {voiceState === 'idle' && (
                    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
                      <Mic className="w-12 h-12 text-indigo-400" />
                      <button
                        onClick={startVoiceSim}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 transition-all"
                      >
                        Start Voice Synthesis Recording
                      </button>
                      <p className="text-[10px] text-slate-500">Requires microphone permission (Simulated playground)</p>
                    </div>
                  )}

                  {voiceState === 'recording' && (
                    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
                      <div className="flex items-center gap-1.5 h-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
                          <motion.div
                            key={bar}
                            className="w-1 bg-red-500 rounded-full"
                            style={{ height: 8 }}
                            animate={{ height: [8, 32, 8] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: bar * 0.05 }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-mono text-red-500 font-bold uppercase animate-pulse">Recording voice prints... Speak clearly</span>
                    </div>
                  )}

                  {voiceState === 'synth' && (
                    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
                      <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                      <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Extracting phonetic parameters...</span>
                      <p className="text-[10px] text-slate-500">Mapping pitch vectors and sentence alignments</p>
                    </div>
                  )}

                  {voiceState === 'complete' && (
                    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
                      <Volume2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                      <div className="text-center space-y-1">
                        <span className="text-xs font-mono text-emerald-400 font-bold">SYNTHESIS SUCCESSFUL</span>
                        <h4 className="text-sm font-bold text-white">Your Cloned Voice Profile is Active</h4>
                        <p className="text-[10px] text-slate-500">Twin can now process live WebRTC voice streams with 180ms latency.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert('Simulated Playback: "Hello! This is my AI digital twin cloned voice."')}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Play Voice Profile Sample
                        </button>
                        <button
                          onClick={() => setVoiceState('idle')}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
                        >
                          Re-record
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'whatsapp' && (
                <motion.div
                  key="whatsapp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold rounded uppercase tracking-wider border border-indigo-500/20">Messaging Gateway</span>
                    <h3 className="text-xl font-bold text-white mt-2">WhatsApp Scanner Linkage</h3>
                    <p className="text-xs text-slate-400 mt-1">Scan our dashboard QR code using WhatsApp linked devices. The system registers your WhatsApp session to automatically reply to customers.</p>
                  </div>

                  {waState === 'idle' && (
                    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
                      <Scan className="w-12 h-12 text-indigo-400" />
                      <button
                        onClick={startWaSim}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 transition-all"
                      >
                        Generate QR Code for Scan Linkage
                      </button>
                    </div>
                  )}

                  {waState === 'scanning' && (
                    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 relative">
                      <div className="w-36 h-36 bg-white border-4 border-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center shadow-lg">
                        {/* Mock QR image */}
                        <div className="w-32 h-32 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black opacity-90 p-2 grid grid-cols-6 grid-rows-6 gap-1">
                          {[...Array(36)].map((_, i) => (
                            <div key={i} className={`rounded-[2px] ${i % 3 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-transparent'}`} />
                          ))}
                        </div>
                        {/* Laser line scan */}
                        <motion.div
                          className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_8px_#10b981]"
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                      </div>
                      <span className="text-xs font-mono text-indigo-400 animate-pulse uppercase tracking-wider font-bold">Scanning devices... Scan QR Code using WhatsApp</span>
                    </div>
                  )}

                  {waState === 'connected' && (
                    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
                      <CheckCircle className="w-10 h-10 text-emerald-400 animate-bounce" />
                      <div className="text-center space-y-1">
                        <span className="text-xs font-mono text-emerald-400 font-bold">DEVICE REGISTERED</span>
                        <h4 className="text-sm font-bold text-white">WhatsApp Account Linked Successfully</h4>
                        <p className="text-[10px] text-slate-500">Your AI Digital Twin is now auto-replying to incoming chats on your WhatsApp number.</p>
                      </div>
                      <button
                        onClick={() => setWaState('idle')}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
                      >
                        Disconnect Session
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Platform status telemetry */}
            <div className="mt-8 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-mono text-[9px] text-slate-500">
              <div>
                <span className="block text-slate-600 uppercase font-bold">Latency</span>
                <span className="text-slate-400 font-extrabold">{activeTab === 'kb' ? '15ms' : activeTab === 'widget' ? '35ms' : activeTab === 'voice' ? '180ms' : '62ms'}</span>
              </div>
              <div>
                <span className="block text-slate-600 uppercase font-bold">Endpoint Route</span>
                <span className="text-slate-400 font-extrabold truncate block">
                  {activeTab === 'kb' ? '/api/v1/knowledge' : activeTab === 'widget' ? '/api/v1/integrations/widget' : activeTab === 'voice' ? '/api/v1/voice/clone' : '/api/v1/integrations/whatsapp'}
                </span>
              </div>
              <div>
                <span className="block text-slate-600 uppercase font-bold">Access Check</span>
                <span className="text-slate-400 font-extrabold uppercase">{activeTab === 'kb' || activeTab === 'widget' ? 'Standard (₹1299)' : 'Business Pro'}</span>
              </div>
              <div>
                <span className="block text-slate-600 uppercase font-bold">Gating Policy</span>
                <span className="text-emerald-400 font-extrabold">STRICT_ENFORCE</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

// Premium Features Cards Section
const Features = () => {
  const features = [
    {
      icon: Mic,
      title: 'Voice Cloning Synthesizer',
      description: 'Clone your acoustic voice signature from a 10s audio record. Power voice bot dials with natural tone.',
      plan: 'Business Pro'
    },
    {
      icon: Database,
      title: 'Multi-Format Knowledge Ingestion',
      description: 'Upload PDF files, TXT records, or scrape full site URLs. Indexes data into an isolated vector database.',
      plan: 'Standard'
    },
    {
      icon: Scan,
      title: 'WhatsApp Automation Gateway',
      description: 'Link your WhatsApp using simple QR scanners. Let your twin manage client chats 24/7 on autopilot.',
      plan: 'Business Pro'
    },
    {
      icon: Smartphone,
      title: 'Lightweight Web Widget',
      description: 'Embed a clean, customized chat widget onto client websites with a single line of script. Remove watermarks.',
      plan: 'Standard'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytical Reporting',
      description: 'Track conversation logs, message count limits, query volumes, and analytics tables.',
      plan: 'Standard'
    },
    {
      icon: Shield,
      title: 'Strict Route Gating Guard',
      description: 'Robust backend authentication policy gates. Standard users are strictly blocked from Business Pro APIs.',
      plan: 'System-wide'
    }
  ];

  return (
    <section id="features" className="relative py-28 z-10 overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.25em]">Cognitive Features</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Capabilities, Zero Compromise
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm font-medium">
            Each feature maps directly to real backend models and routers configured in your account settings.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="group relative p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-indigo-500/20 hover:bg-white/[0.02] shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Visual card corner glow effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />

                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-indigo-500/15 group-hover:text-indigo-400 transition-colors">
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>

                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>
                  <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${
                    feature.plan === 'Business Pro' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                      : feature.plan === 'Standard'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                  }`}>
                    {feature.plan}
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

// Premium How It Works Timeline Flow
const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Knowledge Ingest',
      subtitle: 'Upload documents or site links',
      description: 'Upload PDF guides, text sheets, or website URLs. The vectorizer parses and tokenizes raw content into cognitive indexes instantly.',
      badge: 'Database Synced'
    },
    {
      step: '02',
      title: 'Neural Fine-Tuning',
      subtitle: 'Prompt tuning & voice synthesis',
      description: 'Configure specific prompt rules, constraints, and record a 10s voice clip to synchronize speaking tone, speed, and cadence.',
      badge: 'Synthesizer Synced'
    },
    {
      step: '03',
      title: 'Live Omnichannel API',
      subtitle: 'Deploy to Web chat & WhatsApp',
      description: 'Inject a single-line script on your site or scan a WhatsApp QR code to link devices. Your digital twin auto-replies to clients immediately.',
      badge: 'Autonomous Active'
    }
  ];

  return (
    <section className="relative py-28 z-10 overflow-hidden bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.25em]">Workflow Map</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Your Digital Twin is Created
          </h2>
          <p className="mt-4 text-slate-400 max-w-md mx-auto text-sm font-medium">
            A simple three-step deployment pipeline from ingestion to deployment.
          </p>
        </div>

        {/* Steps Grid connection line */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-stretch">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-indigo-500/10 shadow-xl hover:bg-white/[0.02] transition-all duration-300 h-full flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-4xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent opacity-80 font-mono">{step.step}</span>
                    <span className="text-[8px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">{step.badge}</span>
                  </div>
                  
                  <h3 className="mt-6 text-xl font-bold text-white tracking-tight">{step.title}</h3>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">{step.subtitle}</span>
                  
                  <p className="mt-4 text-slate-400 text-xs leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const UserGuideMindmap = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Form states to make the user guide interactive
  const [workspaceName, setWorkspaceName] = useState("Amit's Coffee Shop");
  const [workspaceWebsite, setWorkspaceWebsite] = useState("amitcoffeeshop.com");
  const [twinName, setTwinName] = useState("Coffee Guide");
  const [twinTone, setTwinTone] = useState("Friendly");
  const [isTwinActive, setIsTwinActive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [ingestedFiles, setIngestedFiles] = useState([]);
  const [ingestProgress, setIngestProgress] = useState(0);
  const [isIngesting, setIsIngesting] = useState(false);

  // RAG query state variables
  const [ragQuery, setRagQuery] = useState("");
  const [ragPhase, setRagPhase] = useState("idle"); // idle | vectorizing | searching | retrieving | synthesizing | done
  const [ragOutput, setRagOutput] = useState("");
  const [ragSource, setRagSource] = useState("");
  const [ragConfidence, setRagConfidence] = useState("");

  const steps = [
    {
      id: "auth",
      label: "1. Signup & Login",
      title: "User Registers & Authenticates",
      description: "First, the user creates an account and logs into the secure digital twin builder dashboard.",
      icon: <Lock className="w-4 h-4 text-rose-400" />,
      x: 90,
      y: 200
    },
    {
      id: "plan",
      label: "2. Plan Selection",
      title: "Activate Standard Subscription",
      description: "Select the Standard Tier for ₹1299/month to enable custom AI twins, vector indexes, and widget scripts.",
      icon: <CreditCard className="w-4 h-4 text-indigo-400" />,
      x: 210,
      y: 200
    },
    {
      id: "workspace",
      label: "3. Workspace Setup",
      title: "Register Business Workspace",
      description: "Enter your business name and website directory URL to initialize a multi-tenant workspace.",
      icon: <Briefcase className="w-4 h-4 text-cyan-400" />,
      x: 330,
      y: 200
    },
    {
      id: "details",
      label: "4. Train AI Twin",
      title: "Specify Character & Knowledge",
      description: "Customize your twin name, set its response tone, and upload documentation (PDF, TXT) or enter URLs.",
      icon: <Settings className="w-4 h-4 text-emerald-400" />,
      x: 490,
      y: 90
    },
    {
      id: "activate",
      label: "5. Activation Switch",
      title: "Synchronize & Activate Twin",
      description: "Once knowledge is synchronized, toggle your twin online to start processing live request threads.",
      icon: <Power className="w-4 h-4 text-amber-400" />,
      x: 650,
      y: 90
    },
    {
      id: "script",
      label: "6. Embed Script",
      title: "Copy Lightweight Widget Script",
      description: "Copy the single-line integration script and paste it into your local project website directory.",
      icon: <Code2 className="w-4 h-4 text-purple-400" />,
      x: 490,
      y: 310
    },
    {
      id: "live",
      label: "7. Go Live!",
      title: "Twin Live on Your Website",
      description: "The digital twin script activates immediately, displaying a sleek floating widget on your website.",
      icon: <Globe className="w-4 h-4 text-pink-400" />,
      x: 650,
      y: 310
    },
    {
      id: "rag",
      label: "8. Live Database Query",
      title: "Input Query to Output Retrieval",
      description: "Type or click a question to trace the live vector matching search loop retrieve output from the DB.",
      icon: <Database className="w-4 h-4 text-teal-400" />,
      x: 810,
      y: 200
    }
  ];

  const handleCopyScript = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateIngestion = () => {
    setIsIngesting(true);
    setIngestProgress(0);
    const interval = setInterval(() => {
      setIngestProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsIngesting(false);
          setIngestedFiles(["pricing_menu.pdf", "timings_guide.txt"]);
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  const handleRagSearch = (queryText) => {
    setRagQuery(queryText);
    setRagPhase("vectorizing");
    setRagOutput("");
    setRagSource("");
    setRagConfidence("");

    setTimeout(() => {
      setRagPhase("searching");
      setTimeout(() => {
        setRagPhase("retrieving");
        setTimeout(() => {
          setRagPhase("synthesizing");
          setTimeout(() => {
            setRagPhase("done");
            const q = queryText.toLowerCase();
            if (q.includes("mocha") || q.includes("ice") || q.includes("drink") || q.includes("price") || q.includes("cost") || q.includes("menu")) {
              setRagOutput(`"Yes, we serve delicious Iced Mocha for ₹120. We also have Espresso (₹80) and Cappuccino (₹100) on our menu."`);
              setRagSource("pricing_menu.pdf (Chunk 2, Lines 12-16)");
              setRagConfidence("98.8% Cosine Similarity Match");
            } else if (q.includes("time") || q.includes("timing") || q.includes("open") || q.includes("close")) {
              setRagOutput(`"Our coffee shop is open daily from 8 AM to 10 PM, Monday through Sunday."`);
              setRagSource("timings_guide.txt (Chunk 1, Lines 3-5)");
              setRagConfidence("96.5% Cosine Similarity Match");
            } else if (q.includes("delivery") || q.includes("home") || q.includes("order")) {
              setRagOutput(`"Yes! We offer home delivery within a 5km radius of our coffee shop. Delivery is free for orders above ₹300."`);
              setRagSource("pricing_menu.pdf (Chunk 4, Lines 22-25)");
              setRagConfidence("97.2% Cosine Similarity Match");
            } else {
              setRagOutput(`"Hello! I am ${twinName}, Amit's AI Digital Twin. I can assist you with our menu prices, operating hours, and ordering options."`);
              setRagSource("general_context.docx (Chunk 1, Line 2)");
              setRagConfidence("89.4% Generic Match");
            }
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const renderSvgMindmap = () => {
    return (
      <svg viewBox="0 0 900 400" className="w-full h-auto overflow-visible select-none my-auto">
        <defs>
          {/* Active Glowing Flow Gradient */}
          <linearGradient id="active-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          {/* Completed Channel Flow Gradient */}
          <linearGradient id="completed-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          
          {/* Faint Dot Grid Pattern */}
          <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.75" fill="rgba(255, 255, 255, 0.05)" />
          </pattern>
        </defs>

        {/* Faint Dot Grid Background */}
        <rect width="100%" height="100%" fill="url(#dot-grid)" rx="16" />

        {/* Bezier and Linear connection paths */}
        {(() => {
          const getLinkStatus = (fromIdx, toIdx) => {
            if (currentStep >= toIdx) return "completed";
            if (currentStep >= fromIdx && currentStep < toIdx) return "active";
            return "pending";
          };
          
          const guideLinks = [
            { from: 0, to: 1, d: "M 90 200 L 210 200" },
            { from: 1, to: 2, d: "M 210 200 L 330 200" },
            { from: 2, to: 3, d: "M 330 200 C 380 200, 440 90, 490 90" },
            { from: 2, to: 5, d: "M 330 200 C 380 200, 440 310, 490 310" },
            { from: 3, to: 4, d: "M 490 90 L 650 90" },
            { from: 5, to: 6, d: "M 490 310 L 650 310" },
            { from: 4, to: 7, d: "M 650 90 C 700 90, 760 200, 810 200" },
            { from: 6, to: 7, d: "M 650 310 C 700 310, 760 200, 810 200" }
          ];

          return guideLinks.map((link, lIdx) => {
            const status = getLinkStatus(link.from, link.to);
            const isCompleted = status === "completed";
            const isActive = status === "active";
            
            return (
              <g key={lIdx}>
                {/* Background backing line */}
                <path
                  d={link.d}
                  fill="none"
                  stroke={isCompleted ? "rgba(16, 185, 129, 0.45)" : isActive ? "rgba(244, 63, 94, 0.15)" : "rgba(255, 255, 255, 0.04)"}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Animated glowing flow path (only on the active path) */}
                {isActive && (
                  <path
                    d={link.d}
                    fill="none"
                    stroke="url(#active-glow-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="10 25"
                    className="animate-pulse-flow"
                    style={{
                      animationDuration: '2.2s'
                    }}
                  />
                )}
              </g>
            );
          });
        })()}

        {/* Node circle icons & text labels */}
        {steps.map((step, idx) => {
          const isActive = currentStep === idx;
          const isCompleted = idx < currentStep;
          
          const themeGlowClass = 
            idx === 0 || idx === 6 ? 'group-hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]' : // pink/rose
            idx === 1 || idx === 5 ? 'group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]' : // indigo/purple
            idx === 2 ? 'group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]' : // cyan
            idx === 3 ? 'group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]' : // emerald
            idx === 4 ? 'group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]' : // amber
            'group-hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]'; // teal
            
          return (
            <foreignObject 
              key={step.id} 
              x={step.x - 70} 
              y={step.y - 55} 
              width="140" 
              height="110"
              className="overflow-visible"
            >
              <div 
                onClick={() => setCurrentStep(idx)}
                className="flex flex-col items-center justify-center w-full h-full group cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  {/* Pulsing ring behind the active node */}
                  {isActive && (
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 opacity-75 blur-sm animate-pulse-opacity" />
                  )}

                  {/* Icon Container Circle */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center border z-10 transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-950 border-transparent text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.45)] scale-110'
                      : isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : `bg-slate-900 border-white/5 text-slate-400 group-hover:border-white/20 group-hover:text-white group-hover:bg-slate-800 ${themeGlowClass}`
                  }`}>
                    {step.icon}
                  </div>

                  {/* Check badge when completed */}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center border border-slate-950 z-20 shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                      <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                    </div>
                  )}
                </div>

                {/* Node Text Title */}
                <span className={`mt-2.5 text-[9px] font-black text-center tracking-wider transition-colors font-sans uppercase ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-500 group-hover:text-slate-350'
                }`}>
                  {step.label.split(". ")[1]}
                </span>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    );
  };

  return (
    <section className="relative py-24 bg-slate-950/40 border-t border-b border-white/5 overflow-hidden z-10">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-rose-500 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" /> AI Digital Twin Lifecycle
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive User Guide & Workflow
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm font-medium">
            Walk through the complete process of building your twin, embedding the widget, and retrieving live context from the database.
          </p>
        </div>

        {/* Dynamic Styles for pulse-flow animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse-flow {
            0% {
              stroke-dashoffset: 40;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          .animate-pulse-flow {
            animation: pulse-flow 2s linear infinite;
          }
          @keyframes pulse-opacity-fast {
            0% {
              opacity: 0.3;
              transform: scale(0.95);
            }
            100% {
              opacity: 0.85;
              transform: scale(1.05);
            }
          }
          .animate-pulse-opacity {
            animation: pulse-opacity-fast 1.6s ease-in-out infinite alternate;
          }
        `}} />

        {/* Mobile Stepper Timeline (Visible on Mobile) */}
        <div className="md:hidden flex flex-col gap-4 mb-10 border-b border-white/5 pb-6 font-sans">
          <div className="relative pl-8 space-y-4">
            {/* Vertical Line */}
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-white/5">
              <div 
                className="bg-gradient-to-b from-rose-500 to-indigo-600 w-full transition-all duration-500" 
                style={{ height: `${(currentStep / 7) * 100}%` }}
              />
            </div>

            {steps.map((step, idx) => {
              const isActive = currentStep === idx;
              const isCompleted = idx < currentStep;
              return (
                <div 
                  key={step.id} 
                  onClick={() => setCurrentStep(idx)}
                  className={`flex items-start gap-4 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.02] border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.08)]'
                      : 'bg-transparent border-transparent'
                  }`}
                >
                  {/* Node Circle */}
                  <div className="absolute left-1.5 flex items-center justify-center mt-0.5">
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-rose-500 border-rose-455 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                        : isCompleted
                          ? 'bg-emerald-500 border-emerald-400'
                          : 'bg-slate-900 border-white/10'
                    }`}>
                      {isCompleted && <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3.5]" />}
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-black uppercase tracking-wide transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                      {isActive && (
                        <span className="text-[7px] font-mono font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 px-1.5 py-0.2 rounded uppercase">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <p className="mt-1.5 text-[10px] text-slate-400 leading-relaxed font-semibold">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tablet Mindmap Graph Canvas (Visible on Tablet only) */}
        <div className="hidden md:block lg:hidden w-full max-w-4xl mx-auto mb-14 p-6 bg-slate-900/[0.15] border border-white/5 rounded-3xl relative overflow-hidden backdrop-blur-md">
          {/* Blueprint style telemetry label */}
          <div className="absolute top-3 left-4 text-[7px] font-mono text-slate-600 uppercase tracking-widest">NEURAL NETWORK ENGINE v1.2</div>
          <div className="absolute top-3 right-4 text-[7px] font-mono text-emerald-500/40 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
            Active Channels: {currentStep + 1} / 8
          </div>
          {renderSvgMindmap()}
        </div>

        {/* Main Grid Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Desktop Mindmap Graph Canvas (Visible on Desktop only, side-by-side spanning 2 rows) */}
          <div className="hidden lg:block lg:col-span-7 lg:row-span-2 bg-slate-900/[0.15] border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col justify-center h-full">
            {/* Blueprint style telemetry label */}
            <div className="absolute top-3 left-4 text-[7px] font-mono text-slate-600 uppercase tracking-widest">NEURAL NETWORK ENGINE v1.2</div>
            <div className="absolute top-3 right-4 text-[7px] font-mono text-emerald-500/40 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
              Active Channels: {currentStep + 1} / 8
            </div>
            {renderSvgMindmap()}
          </div>
          
          {/* Left panel: Info & Explanation */}
          <div className="col-span-12 md:col-span-5 lg:col-span-5 flex flex-col justify-between bg-slate-900/40 md:bg-white/[0.01] border border-white/5 rounded-3xl p-8 relative overflow-hidden backdrop-blur-none md:backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[60px]" />
            
            <div className="space-y-6 font-sans">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 font-mono text-[9px] rounded uppercase tracking-widest font-bold border border-rose-500/20">
                  Step {currentStep + 1} of 8
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-wider">ACTIVE PIPELINE</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center">
                  {steps[currentStep].icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{steps[currentStep].title}</h3>
                  <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase font-bold">Workspace Phase</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                {steps[currentStep].description}
              </p>

              {/* Tips Callout */}
              <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 mt-2">
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  💡 {
                    currentStep === 0 ? "You can login securely via Google auth or standard password credentials. Each login triggers a personalized dashboard greeting."
                    : currentStep === 1 ? "The Standard Tier is configured for sandbox test verification at ₹1299. Payment gating rules are enforced strictly."
                    : currentStep === 2 ? "Setting up a business folder isolation model ensures that different company chatbots cannot read each other's data."
                    : currentStep === 3 ? "Ingested files are parsed, split into overlaps, embedded via OpenAI text models, and saved inside a tenant-isolated ChromaDB."
                    : currentStep === 4 ? "Activating the switch sets the twin status flag to 'ONLINE'. OFFLINE twins automatically alert visitors to upgrade or return later."
                    : currentStep === 5 ? "The single script tag contains async attributes, which ensures it does not impact your page loading times and speed metrics."
                    : currentStep === 6 ? "The web chat widget will automatically read your theme color settings and place itself fixed at the bottom right corner."
                    : "Simulate a search: click on a query preset button and watch the RAG matching sequence execute live between the LLM and the Vector DB."
                  }
                </p>
              </div>
            </div>

            {/* Stepper buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5 font-sans">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2.5 rounded-xl border border-white/5 text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Back Step
              </button>
              <button
                onClick={() => {
                  if (currentStep < 7) {
                    setCurrentStep((prev) => prev + 1);
                  } else {
                    setCurrentStep(0); // reset
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-400 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center gap-1.5"
              >
                {currentStep === 7 ? "Restart Tour" : "Next Step"} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right panel: Visual Demonstration */}
          <div className="col-span-12 md:col-span-7 lg:col-span-5 bg-slate-950/60 border border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-none md:backdrop-blur-md">
            
            {/* Screen Container */}
            <div className="w-full flex-grow flex flex-col justify-center min-h-[360px]">
              
              <AnimatePresence mode="wait">
                
                {/* 1. Signup / Login Screen */}
                {steps[currentStep].id === 'auth' && (
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="max-w-sm mx-auto w-full bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl font-sans"
                  >
                    <div className="text-center space-y-1">
                      <h4 className="text-sm font-bold text-white">Access AI Twin Builder</h4>
                      <p className="text-[10px] text-slate-500">Sign in to your application dashboard</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                        <input
                          type="text"
                          disabled
                          value="sarthak@domain.com"
                          className="w-full h-8 bg-slate-955 border border-white/5 rounded px-3 text-xs text-slate-350 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Password</label>
                        <input
                          type="password"
                          disabled
                          value="•••••••••••••••"
                          className="w-full h-8 bg-slate-955 border border-white/5 rounded px-3 text-xs text-slate-450 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold transition-all mt-2 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.2)] animate-pulse"
                      >
                        Sign In Securely <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. Select Plan Screen */}
                {steps[currentStep].id === 'plan' && (
                  <motion.div
                    key="plan"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="w-full space-y-4 font-sans"
                  >
                    <div className="text-center">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Choose Subscription tier</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Standard is active for ₹1299 sandbox tests</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 opacity-50 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Free Trial</span>
                          <span className="block text-lg font-bold text-slate-400 mt-1">₹0</span>
                          <span className="block text-[8px] text-slate-500 mt-1">3 days limit & 50 messages limit</span>
                        </div>
                        <span className="text-[9px] text-slate-500 mt-4 block text-center">Gated Tier</span>
                      </div>

                      <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-xl p-4 flex flex-col justify-between shadow-[0_0_20px_rgba(99,102,241,0.15)] relative">
                        <div className="absolute top-2 right-2 bg-indigo-500 text-slate-950 font-bold text-[8px] px-1.5 py-0.5 rounded-full uppercase">
                          ACTIVE
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-indigo-400 uppercase">Standard Tier</span>
                          <span className="block text-lg font-bold text-white mt-1">₹1299 <span className="text-xs text-slate-400 font-normal">/mo</span></span>
                          <span className="block text-[8px] text-slate-350 mt-1">Unlimited responses, custom widgets, scraping</span>
                        </div>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition-all mt-4"
                        >
                          Selected (Proceed)
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. Add Business Screen */}
                {steps[currentStep].id === 'workspace' && (
                  <motion.div
                    key="workspace"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="max-w-sm mx-auto w-full bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4 font-sans"
                  >
                    <div className="border-b border-white/5 pb-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Initialize Business Workspace</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Business Name</label>
                        <input
                          type="text"
                          value={workspaceName}
                          onChange={(e) => setWorkspaceName(e.target.value)}
                          className="w-full h-8 bg-slate-950 border border-white/10 rounded px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                          placeholder="e.g. Acme Coffee House"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Website URL</label>
                        <input
                          type="text"
                          value={workspaceWebsite}
                          onChange={(e) => setWorkspaceWebsite(e.target.value)}
                          className="w-full h-8 bg-slate-955 border border-white/10 rounded px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                          placeholder="e.g. amitcoffeeshop.com"
                        />
                      </div>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded text-xs font-bold transition-all mt-2"
                      >
                        Create Business Folder
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 4. Train AI Twin Screen */}
                {steps[currentStep].id === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="max-w-md mx-auto w-full bg-slate-900/95 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl font-sans"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Configure & Ingest Knowledge</h4>
                      <span className="text-[8px] text-slate-500 font-mono">Workspace: {workspaceName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[8px] font-bold text-slate-400 uppercase">Twin Custom Name</label>
                        <input
                          type="text"
                          value={twinName}
                          onChange={(e) => setTwinName(e.target.value)}
                          className="w-full h-7 bg-slate-955 border border-white/5 rounded px-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[8px] font-bold text-slate-400 uppercase">Conversation Tone</label>
                        <select
                          value={twinTone}
                          onChange={(e) => setTwinTone(e.target.value)}
                          className="w-full h-7 bg-slate-955 border border-white/5 rounded px-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="Friendly">Friendly & Warm</option>
                          <option value="Formal">Formal & Business</option>
                          <option value="Analytical">Analytical & Direct</option>
                        </select>
                      </div>
                    </div>

                    {/* Simulator Dropzone */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Vector Datasets (Files & Links)</label>
                      
                      {ingestedFiles.length === 0 && !isIngesting ? (
                        <div
                          onClick={handleSimulateIngestion}
                          className="border border-dashed border-white/10 hover:border-emerald-500/30 bg-slate-955 rounded-xl p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-colors"
                        >
                          <Database className="w-6 h-6 text-emerald-500 animate-bounce" />
                          <span className="text-[10px] text-slate-355 font-medium">Click to ingest coffee menu PDFs & urls</span>
                          <span className="text-[8px] text-slate-500 font-mono">Simulates embedding conversion to Vector DB</span>
                        </div>
                      ) : isIngesting ? (
                        <div className="bg-slate-950/60 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center space-y-2">
                          <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                          <span className="text-[10px] text-slate-300 font-medium">Extracting paragraphs & generating vectors...</span>
                          <div className="w-full max-w-xs bg-slate-905 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${ingestProgress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-955 border border-white/10 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between text-[9px] text-slate-450 font-bold">
                            <span>Ingestion Status:</span>
                            <span className="text-emerald-400 font-bold uppercase">15,840 Vectors Sync Complete</span>
                          </div>
                          <div className="space-y-1.5">
                            {ingestedFiles.map((file) => (
                              <div key={file} className="flex items-center gap-1.5 text-[9px] text-slate-300 bg-slate-900/60 p-1 px-2.5 rounded border border-white/5 font-mono">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{file} (Indexed)</span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => setIngestedFiles([])}
                            className="text-[9px] text-slate-500 hover:text-slate-300 underline font-mono"
                          >
                            Re-upload datasets
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 5. Activate Switch Screen */}
                {steps[currentStep].id === 'activate' && (
                  <motion.div
                    key="activate"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="max-w-xs mx-auto w-full bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-5 text-center shadow-xl font-sans"
                  >
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Twin Activation Console</h4>
                    
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-white/5 space-y-3">
                      <div className={`w-3.5 h-3.5 rounded-full ${isTwinActive ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
                      <span className={`text-xs font-bold font-mono uppercase tracking-widest ${isTwinActive ? 'text-emerald-400' : 'text-rose-500'}`}>
                        Twin Status: {isTwinActive ? 'ONLINE' : 'OFFLINE'}
                      </span>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => setIsTwinActive(!isTwinActive)}
                        className={`w-14 h-7 rounded-full transition-all relative p-1 mt-2 ${isTwinActive ? 'bg-emerald-600' : 'bg-slate-800'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${isTwinActive ? 'translate-x-7' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex gap-2 justify-center text-[9px] font-mono text-slate-500">
                      <span>RAG: CONNECTED</span>
                      <span>•</span>
                      <span>LATENCY: 84ms</span>
                    </div>
                  </motion.div>
                )}

                {/* 6. Copy Script Screen */}
                {steps[currentStep].id === 'script' && (
                  <motion.div
                    key="script"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="max-w-lg mx-auto w-full bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-sans"
                  >
                    {/* Header bar */}
                    <div className="flex items-center justify-between bg-slate-950 px-4 py-2 border-b border-white/5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">index.html (Acme Website Directory)</span>
                    </div>

                    <div className="p-4 space-y-4">
                      <p className="text-[10px] text-slate-400 font-semibold">Copy and paste this script tag inside your HTML body:</p>
                      
                      <div className="bg-slate-955 p-4.5 rounded-xl border border-white/5 font-mono text-[10px] text-indigo-300 relative group overflow-x-auto whitespace-pre select-all">
                        <code>{`<!-- AI Digital Twin Chat Widget Integration -->\n<script\n  src="https://ai-twin-2le9.onrender.com/api/v1/widget.js"\n  data-twin-id="${twinName.toLowerCase().replace(/\s+/g, '-')}"\n  data-theme="#6366f1">\n</script>`}</code>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500 font-mono font-medium">Requires no extra dependencies or frameworks</span>
                        <button
                          onClick={handleCopyScript}
                          className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${
                            copied 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10'
                          }`}
                        >
                          {copied ? "Copied tag!" : "Copy Embed Script"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 7. Twin Live Website Screen */}
                {steps[currentStep].id === 'live' && (
                  <motion.div
                    key="live"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="max-w-md mx-auto w-full bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative font-sans"
                  >
                    {/* Browser Address Bar */}
                    <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 border-b border-white/5 text-[10px] font-mono text-slate-500">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                      </div>
                      <div className="bg-slate-900 px-3 py-0.5 rounded w-full max-w-[200px] text-slate-400 text-center truncate">
                        https://www.{workspaceWebsite || 'amitcoffeeshop.com'}
                      </div>
                    </div>

                    {/* Simulated Coffee Shop Webpage */}
                    <div className="p-6 h-[220px] bg-slate-955 flex flex-col justify-between relative">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{workspaceName || "Amit's Coffee Shop"}</span>
                        <h4 className="text-lg font-black text-white leading-tight">Fresh Roasted Artisan Beans</h4>
                        <p className="text-[10px] text-slate-400 max-w-[80%]">Crafted with precision, serving premium espressos, gourmet teas, and warm delivery daily.</p>
                      </div>

                      {/* Mock floating widget button */}
                      <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2">
                        <div className="bg-slate-900 border border-white/10 rounded-xl p-3 shadow-2xl max-w-[220px] text-[9px] space-y-1.5">
                          <div className="flex items-center gap-1.5 border-b border-white/5 pb-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="font-bold text-white">{twinName} (Online)</span>
                          </div>
                          <p className="text-slate-350">"Hi! I am the automated virtual twin of Amit. Ask me about coffee prices or shop hours!"</p>
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-bounce cursor-pointer">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 8. Live Database RAG Query Simulator Screen */}
                {steps[currentStep].id === 'rag' && (
                  <motion.div
                    key="rag"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch font-sans"
                  >
                    
                    {/* Chat Widget Panel */}
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{twinName} Assistant</span>
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-mono">CHROME_DB_SYNC</span>
                        </div>
                        
                        {/* Conversation dialogue box */}
                        <div className="space-y-2 h-[130px] overflow-y-auto p-1">
                          {ragQuery ? (
                            <div className="flex flex-col space-y-2">
                              {/* Visitor Input */}
                              <div className="px-3 py-1.5 bg-slate-950/80 rounded-xl rounded-tr-none text-[10px] text-white self-end max-w-[85%] border border-white/5">
                                {ragQuery}
                              </div>
                              
                              {/* RAG response */}
                              {ragPhase === 'done' && (
                                <div className="px-3 py-1.5 bg-indigo-500/10 text-slate-200 text-[10px] rounded-xl rounded-tl-none self-start max-w-[85%] border border-indigo-500/20">
                                  {ragOutput}
                                  <span className="block text-[7px] text-slate-500 font-mono mt-1 uppercase">Source: {ragSource.split(" ")[0]}</span>
                                </div>
                              )}

                              {ragPhase !== 'done' && (
                                <div className="px-3 py-1.5 bg-slate-950/40 text-slate-500 text-[9px] rounded-xl rounded-tl-none self-start max-w-[85%] border border-dashed border-white/5 animate-pulse font-mono uppercase">
                                  Retrieving answer...
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                              <MessageCircle className="w-6 h-6 text-slate-600 mb-1" />
                              <p className="text-[9px]">Select a preset query below to test RAG database retrieval</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick preset buttons */}
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Query Presets</span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => handleRagSearch("Do you have Iced Mocha? What is the price?")}
                            className="px-2 py-1 bg-white/5 border border-white/5 hover:border-indigo-500/30 text-[9px] font-semibold text-slate-350 rounded-lg hover:text-white transition-all animate-pulse"
                          >
                            "Mocha price?"
                          </button>
                          <button
                            onClick={() => handleRagSearch("What are your coffee shop timings?")}
                            className="px-2 py-1 bg-white/5 border border-white/5 hover:border-indigo-500/30 text-[9px] font-semibold text-slate-350 rounded-lg hover:text-white transition-all animate-pulse"
                          >
                            "Shop Timings?"
                          </button>
                          <button
                            onClick={() => handleRagSearch("Is home delivery available?")}
                            className="px-2 py-1 bg-white/5 border border-white/5 hover:border-indigo-500/30 text-[9px] font-semibold text-slate-355 rounded-lg hover:text-white transition-all animate-pulse"
                          >
                            "Home Delivery?"
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RAG pipeline execution console */}
                    <div className="bg-slate-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between font-mono text-[9px]">
                      <div>
                        <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-3">
                          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-slate-400 font-bold">RAG Retrieval Telemetry</span>
                        </div>

                        {/* List of steps and checkmarks */}
                        <div className="space-y-2">
                          <div className={`flex items-center justify-between p-1.5 rounded transition-colors ${
                            ragPhase === 'vectorizing' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'text-slate-500'
                          }`}>
                            <div className="flex items-center gap-2">
                              {['vectorizing', 'searching', 'retrieving', 'synthesizing', 'done'].indexOf(ragPhase) > 0 ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Cpu className={`w-3 h-3 ${ragPhase === 'vectorizing' ? 'animate-spin' : ''}`} />
                              )}
                              <span>1. Vectorizing Input Query</span>
                            </div>
                            {ragPhase === 'vectorizing' && <span className="text-[8px] animate-pulse text-indigo-400">1536d Array...</span>}
                          </div>

                          <div className={`flex items-center justify-between p-1.5 rounded transition-colors ${
                            ragPhase === 'searching' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'text-slate-500'
                          }`}>
                            <div className="flex items-center gap-2">
                              {['searching', 'retrieving', 'synthesizing', 'done'].indexOf(ragPhase) > 1 ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Database className={`w-3 h-3 ${ragPhase === 'searching' ? 'animate-bounce' : ''}`} />
                              )}
                              <span>2. Scanning ChromaDB index</span>
                            </div>
                            {ragPhase === 'searching' && <span className="text-[8px] animate-pulse text-indigo-400">Matching keys...</span>}
                          </div>

                          <div className={`flex items-center justify-between p-1.5 rounded transition-colors ${
                            ragPhase === 'retrieving' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'text-slate-500'
                          }`}>
                            <div className="flex items-center gap-2">
                              {['retrieving', 'synthesizing', 'done'].indexOf(ragPhase) > 2 ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <FileText className="w-3 h-3" />
                              )}
                              <span>3. Retrieving Document Chunk</span>
                            </div>
                            {ragPhase === 'retrieving' && <span className="text-[8px] animate-pulse text-indigo-400">Extracting text...</span>}
                          </div>

                          <div className={`flex items-center justify-between p-1.5 rounded transition-colors ${
                            ragPhase === 'synthesizing' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'text-slate-500'
                          }`}>
                            <div className="flex items-center gap-2">
                              {['synthesizing', 'done'].indexOf(ragPhase) > 3 ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Brain className="w-3 h-3" />
                              )}
                              <span>4. LLM Synthesis & Output</span>
                            </div>
                            {ragPhase === 'synthesizing' && <span className="text-[8px] animate-pulse text-indigo-400">Generating token...</span>}
                          </div>
                        </div>
                      </div>

                      {/* Display retrieved metrics */}
                      {ragPhase === 'done' && (
                        <div className="mt-3 bg-slate-900 border border-white/5 rounded-lg p-2 space-y-1.5 text-[8px] text-slate-400">
                          <div><span className="text-slate-500 font-bold uppercase">Nearest Neighbor:</span> <span className="text-indigo-300">{ragSource}</span></div>
                          <div><span className="text-slate-500 font-bold uppercase">Confidence Score:</span> <span className="text-emerald-400">{ragConfidence}</span></div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

// Technical Accordion FAQ Section
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What underlying AI models power the Digital Twin?",
      answer: "We utilize fine-tuned, low-latency Large Language Models combined with ChromaDB vector indexers. This creates a secure Retrieval-Augmented Generation (RAG) loop matching your specific files, docs, and URLs with zero hallucination."
    },
    {
      question: "How does Standard plan pricing work?",
      answer: "The Standard plan is priced at ₹1299/month. This grants unlimited web chat assistant executions, customizable theme skins without branding watermarks, lead captures, and URL indexing."
    },
    {
      question: "What is Business Pro plan availability?",
      answer: "Business Pro features (including live WhatsApp scanners, voice calling cloning synthesizers, and WebRTC streaming dialers) are currently Coming Soon. You can join the waitlist from our Dashboard."
    },
    {
      question: "Can I inspect conversation history or limits?",
      answer: "Absolutely. Users have access to full telemetry logs, conversational history tables, captured leads, and active message counts directly from their Dashboard. Free trials are strictly gated at 3 days / 50 messages."
    }
  ];

  return (
    <section className="relative py-28 z-10 bg-slate-950/40">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.25em]">Frequently Asked Questions</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical FAQs
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden transition-all hover:bg-white/[0.02]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
                >
                  <span className="text-white font-bold text-sm sm:text-base">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-slate-400 text-xs sm:text-sm font-medium leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

// Premium high-tech CTA deck console
const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 z-10 overflow-hidden bg-[#030014]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-20 rounded-3xl bg-white/[0.01] border border-white/5 overflow-hidden shadow-2xl"
        >
          {/* Cosmic gradient backdrop */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/5 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative text-center z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Initiate Your AI Digital Twin
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm font-semibold leading-relaxed">
              Create your autonomous intelligence clone today. Upload custom documentation, capture voice patterns, and activate standard widget integrations or scan WhatsApp linked qr codes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto group relative px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold text-sm overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Launch Console Panel
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Configure Tiers (₹1299/mo)
              </motion.button>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-6 text-xs text-slate-500 font-mono uppercase tracking-wider">
              <a href="mailto:nexora.aidigital.twin@gmail.com" className="hover:text-white transition-colors">
                nexora.aidigital.twin@gmail.com
              </a>
              <span className="hidden md:block text-slate-700">•</span>
              <a href="tel:+919625410112" className="hover:text-white transition-colors">
                +91 9625410112
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Premium startup Footer
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
      { name: 'Features Blueprint', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
      { name: 'Interactive Sandbox', action: () => navigate('/') },
      { name: 'System Guide', action: () => navigate('/guide') }
    ],
    Organization: [
      { name: 'Terms of Service', action: () => navigate('/legal') },
      { name: 'Pricing Tiers', action: () => navigate('/pricing') },
      { name: 'Engineering support', action: () => window.location.href = "mailto:nexora.aidigital.twin@gmail.com" }
    ],
    Account: accountLinks
  };

  return (
    <footer className="pt-24 pb-12 bg-slate-950 border-t border-white/5 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          {/* Brand details */}
          <div className="col-span-2 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="flex items-center justify-center p-2 rounded-xl bg-white/5 group-hover:bg-indigo-500/10 transition-colors">
                <LogoIcon className="w-7 h-7" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AI Digital Twin</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs font-semibold leading-relaxed">
              Deploy your cognitive replica. Secure multi-tenant neural networks supporting low-latency chat widgets and cloned speech dialog systems.
            </p>
          </div>

          {/* Links list mapping */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-bold text-white mb-6 uppercase tracking-widest">{category}</h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={item.action}
                      className="text-xs text-slate-500 hover:text-white transition-colors text-left font-semibold uppercase tracking-wider"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact details */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold text-white mb-6 uppercase tracking-widest">Network</h4>
            <ul className="space-y-4 text-xs text-slate-500 font-semibold tracking-wider uppercase">
              <li>
                <a href="mailto:nexora.aidigital.twin@gmail.com" className="hover:text-white transition-colors break-all">
                  nexora.aidigital.twin@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919625410112" className="hover:text-white transition-colors">
                  +91 9625410112
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* System operational status banner */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} AI Digital Twin Core. All backend gateways operational.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest font-extrabold">All Core Services Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Home Component Redesign
const Home = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Navigation */}
      <LandingNavbar />

      {/* Background gradients */}
      <PremiumBackground />

      {/* Page layout structure */}
      <main className="relative">
        <Hero />
        <CapabilitiesPlayground />
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

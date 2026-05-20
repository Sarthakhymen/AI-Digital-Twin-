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
  Check
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
    botReply: "Yes. Free trials are active for 3 days and limited to 50 messages. Upgrade to Standard ($29/mo) to unlock unlimited queries! ⚡",
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
              View Standard Tier ($29)
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
                      💡 Standard Plan ($29/mo) removes the "Powered by AI Digital Twin" watermark branding completely.
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
                <span className="text-slate-400 font-extrabold uppercase">{activeTab === 'kb' || activeTab === 'widget' ? 'Standard ($29)' : 'Business Pro'}</span>
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

// Interactive Node-Tree Graph Map Component
const UserGuideMindmap = () => {
  const [activeNode, setActiveNode] = useState("core");

  const nodes = {
    core: {
      id: "core",
      title: "AI Twin Engine",
      subtitle: "Central Processing Core",
      icon: <Brain className="w-6 h-6 text-rose-400" />,
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
            <Brain className="w-12 h-12 text-rose-500 relative animate-bounce" />
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
        <div className="border border-dashed border-white/10 bg-slate-950/40 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-blue-500/40 transition-colors">
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
      details: "Ensures Standard ($29) and Free Trial users are strictly blocked from using Business Pro APIs.",
      highlight: "Enforces plan-based monetization.",
      color: "from-emerald-500 to-teal-400",
      glowColor: "rgba(16, 185, 129, 0.4)",
      x: 280, y: 420,
      preview: (
        <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 space-y-3">
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
      description: "Processes subscription purchases and plans. Standard plan is priced at $29/mo (INR 29 for sandbox testing).",
      details: "Supports immediate plan upgrades, manual payment requests via UPI, and subscription logs.",
      highlight: "INR / USD sandbox pricing.",
      color: "from-emerald-400 to-teal-500",
      glowColor: "rgba(52, 211, 153, 0.3)",
      x: 90, y: 340,
      preview: (
        <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium">Standard Plan (Test Price)</span>
            <span className="font-bold text-white">$29 / ₹29</span>
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
        <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3 space-y-2">
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
        <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 space-y-2">
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
          <div className="bg-slate-950/80 border border-white/10 rounded-lg p-3 font-mono text-[9px] text-slate-300 relative group overflow-x-auto whitespace-pre">
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
        <div className="flex flex-col items-center justify-center py-2 bg-slate-950/60 rounded-xl border border-white/10 space-y-2">
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
        <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span>Log Collector:</span>
            <span className="text-purple-400 animate-pulse font-mono">COLLECTING</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Terminal className="w-3.5 h-3.5 text-slate-450" />
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
        <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3 space-y-2">
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
        <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 space-y-3">
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
    <section className="relative py-28 overflow-hidden z-10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-rose-500 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Platform Blueprint
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive User Guide & Node Map
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm font-medium">
            Click on nodes below to inspect our architecture flow, subscription variables, integration code scripts, and administrative panels.
          </p>
        </div>

        {/* Mindmap Layout Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* SVG Mindmap Column */}
          <div className="lg:col-span-8 bg-slate-950/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex items-center justify-center select-none shadow-2xl min-h-[500px]">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 pointer-events-none" />

            {/* Desktop SVG Node Graph */}
            <div className="relative w-full aspect-[1000/600] max-w-full hidden md:block z-10">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
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
                {/* Center to Ingestion */}
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

                {/* Center to Access */}
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

                {/* Center to Channels */}
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

                {/* Center to Analytics */}
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

              {/* Render HTML Nodes Over SVG */}
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
                          ? 'w-24 h-24 bg-gradient-to-br from-rose-600/90 to-violet-700/90 text-white border border-white/20 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                          : isBranch
                            ? `px-4 py-2.5 bg-slate-900/95 border text-white ${
                                isActive ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]' : 'border-white/5 hover:border-white/10'
                              }`
                            : `w-12 h-12 bg-slate-900/95 rounded-full border flex items-center justify-center ${
                                isActive ? 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]' : 'border-white/5 hover:border-white/10'
                              }`
                      }`}
                    >
                      {isRoot ? (
                        <>
                          <Brain className="w-8 h-8 text-white animate-pulse" />
                          <span className="text-[10px] font-bold mt-1 uppercase tracking-wider text-white">Engine</span>
                        </>
                      ) : isBranch ? (
                        <div className="flex items-center gap-2">
                          {node.icon}
                          <span className="text-[10px] font-extrabold tracking-wide uppercase">{node.title}</span>
                        </div>
                      ) : (
                        node.icon
                      )}
                    </button>

                    {/* Small Node Floating Title */}
                    {!isRoot && !isBranch && (
                      <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-white/5 rounded px-2 py-0.5 text-[8px] font-extrabold text-slate-300 tracking-wide uppercase whitespace-nowrap shadow-md">
                        {node.title}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Accordion tree view */}
            <div className="w-full space-y-3.5 md:hidden block z-10 py-6">
              {Object.values(nodes).map((node) => {
                const isActive = activeNode === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-slate-900 border-indigo-500 shadow-xl' 
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-slate-900/90 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                        {node.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{node.title}</h4>
                        <span className="text-[9px] text-slate-500 tracking-widest uppercase font-bold">{node.subtitle}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Node Details Sidebar Card */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-full relative overflow-hidden shadow-2xl backdrop-blur-md"
              >
                {/* Telemetry glow inside card */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-15 pointer-events-none bg-gradient-to-br ${selectedNode.color}`} />
                
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-slate-500 font-mono text-[9px] rounded uppercase tracking-widest font-bold">
                      System Module
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
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-bold">{selectedNode.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-semibold mt-4">
                    {selectedNode.description}
                  </p>

                  <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 mt-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      💡 {selectedNode.details}
                    </p>
                  </div>
                </div>

                {/* Telemetry Log */}
                <div className="mt-6 pt-4 border-t border-white/5 space-y-4">
                  <div className="grid grid-cols-2 gap-3 font-mono text-[8px] text-slate-500 bg-slate-950/80 rounded-xl p-2.5 border border-white/5">
                    <div>
                      <span className="block text-slate-600 font-bold uppercase">Latency Limit</span>
                      <span className="text-slate-400 font-extrabold">{selectedNode.latency}</span>
                    </div>
                    <div>
                      <span className="block text-slate-600 font-bold uppercase">Linked Core</span>
                      <span className="text-slate-400 font-extrabold truncate block">{selectedNode.payload}</span>
                    </div>
                  </div>

                  {selectedNode.preview}

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-indigo-400 font-bold tracking-wide flex items-center gap-1 uppercase text-[9px]">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" /> {selectedNode.highlight}
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
      answer: "The Standard plan is priced at $29/month. This grants unlimited web chat assistant executions, customizable theme skins without branding watermarks, lead captures, and URL indexing. (A test sandbox rate of ₹29/INR is configured for payment verification)."
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
                Configure Tiers ($29/mo)
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

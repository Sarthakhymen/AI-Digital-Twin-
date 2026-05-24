import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ChevronDown,
  BarChart3,
  BookOpen,
  Users,
  Rocket,
  Menu,
  X,
  Check,
  ArrowRight,
  MessageSquare,
  Phone,
  Database,
  Cpu,
  Shield,
  Sliders
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Company Logos SVGs/Text Components
const LogoInterscope = () => (
  <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
    <div className="w-5 h-8 bg-black flex items-center justify-center text-white font-black text-xs tracking-tighter">I</div>
    <span className="font-sans font-black tracking-widest text-sm text-black">INTERSCOPE</span>
  </div>
);

const LogoSpotify = () => (
  <div className="flex items-center gap-1 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.076-.336.135-.668.47-.743 3.856-.88 7.15-.503 9.822 1.135.296.18.387.563.205.853zm1.224-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.182-.412.125-.845-.108-.97-.52-.125-.413.108-.847.52-.972 3.666-1.112 8.243-.57 11.34 1.333.367.227.487.708.26 1.074zm.106-2.833C14.484 8.74 8.784 8.55 5.467 9.558c-.51.155-1.045-.133-1.2-.643-.156-.51.132-1.045.642-1.2 3.812-1.157 10.11-.94 14.077 1.417.46.273.61.87.337 1.33-.273.46-.87.61-1.33.338z" />
    </svg>
    <span className="font-sans font-bold tracking-tight text-sm text-black">Spotify</span>
  </div>
);

const LogoNexera = () => (
  <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
    <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
      {[...Array(9)].map((_, i) => (
        <div key={i} className={`w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-black' : 'bg-gray-400'}`} />
      ))}
    </div>
    <span className="font-sans font-semibold tracking-wide text-sm text-black">nexera</span>
  </div>
);

const LogoM3 = () => (
  <div className="flex items-center gap-0.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
    <span className="font-serif italic font-black text-2xl text-black">M3</span>
    <span className="font-sans font-medium text-[10px] tracking-widest text-gray-500 uppercase mt-1">Media</span>
  </div>
);

const LogoLauraCole = () => (
  <div className="flex items-center gap-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
    <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center text-[10px] font-bold text-black font-sans">LC</div>
    <span className="font-sans font-light tracking-[0.2em] text-xs text-black">LAURA COLE</span>
  </div>
);

const LogoVertex = () => (
  <div className="flex items-center gap-1 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
    <span className="font-sans font-extrabold tracking-tight text-sm text-black">vertex</span>
    <div className="flex gap-0.5">
      <div className="w-1 h-1 rounded-full bg-violet-600" />
      <div className="w-1 h-1 rounded-full bg-indigo-500" />
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('analyse');
  
  // Staggered custom dropdowns for Solutions and Teams in Navbar
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Tab Cycling logic (runs only when the user is not actively interacting)
  const tabIds = ['analyse', 'train', 'testing', 'deploy'];
  const timerRef = useRef(null);

  const startTabCycle = () => {
    stopTabCycle();
    timerRef.current = setInterval(() => {
      setActiveTab((prevTab) => {
        const currentIndex = tabIds.indexOf(prevTab);
        const nextIndex = (currentIndex + 1) % tabIds.length;
        return tabIds[nextIndex];
      });
    }, 4000);
  };

  const stopTabCycle = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTabCycle();
    return () => stopTabCycle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    stopTabCycle(); // Temporarily pause cycling when clicked
    startTabCycle(); // Restart cycle with fresh interval
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-100 overflow-x-hidden">
      
      {/* ── NAVIGATION (Delay: 0.1s) ── */}
      <header 
        className="animate-fade-in-up border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50 transition-all duration-300"
        style={{ animationDelay: '0.1s', opacity: 0 }}
      >
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Brand logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white transition-transform group-hover:rotate-12 duration-300">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-black">Stellar.ai</span>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium ml-1">Twin Creator</span>
          </div>

          {/* Center (Desktop navigation) */}
          <nav className="hidden md:flex items-center gap-8 relative">
            {/* Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black font-medium transition-colors py-2">
                Solutions <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-black" />
              </button>
              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-0 w-60 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 grid grid-cols-1 gap-2 z-50 animate-fade-in-overlay">
                  <div className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors" onClick={() => navigate('/voice-agent')}>
                    <span className="block text-xs font-bold text-black">Neural Voice Cloning</span>
                    <span className="text-[10px] text-gray-500">Duplicate your vocal signature in English/Hindi</span>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors" onClick={() => navigate('/documentation')}>
                    <span className="block text-xs font-bold text-black">Omnichannel Chatbot</span>
                    <span className="text-[10px] text-gray-500">Inject twin logic into WhatsApp & Web widgets</span>
                  </div>
                </div>
              )}
            </div>

            {/* For Teams Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('teams')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black font-medium transition-colors py-2">
                For Teams <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {activeDropdown === 'teams' && (
                <div className="absolute top-full left-0 w-60 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 grid grid-cols-1 gap-2 z-50 animate-fade-in-overlay">
                  <div className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                    <span className="block text-xs font-bold text-black">Enterprise Multi-Twin</span>
                    <span className="text-[10px] text-gray-500">Manage multiple business representatives</span>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors" onClick={() => navigate('/pricing')}>
                    <span className="block text-xs font-bold text-black">Agency Tier Pricing</span>
                    <span className="text-[10px] text-gray-500">Scalable packages for support agencies</span>
                  </div>
                </div>
              )}
            </div>

            <Link to="/pricing" className="text-sm text-gray-600 hover:text-black font-medium transition-colors py-2">
              Pricing
            </Link>
            <Link to="/documentation" className="text-sm text-gray-600 hover:text-black font-medium transition-colors py-2">
              Learn Hub
            </Link>
          </nav>

          {/* Right (Desktop CTAs / Auth integration) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm text-gray-700 hover:text-black font-medium transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-700 hover:text-black font-medium transition-colors">
                  Login
                </Link>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Get started free
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-black hover:text-gray-700 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 flex flex-col gap-4 animate-fade-in-overlay">
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-700 hover:text-black">
              Pricing
            </Link>
            <Link to="/documentation" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-700 hover:text-black">
              Learn Hub
            </Link>
            <Link to="/voice-agent" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-700 hover:text-black">
              Voice Cloning
            </Link>
            <hr className="border-gray-100" />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-700 hover:text-black">
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}
                  className="bg-black text-white w-full py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-700 hover:text-black">
                  Login
                </Link>
                <button
                  onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                  className="bg-black text-white w-full py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                >
                  Get started free
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <section className="px-6 pt-24 pb-32 max-w-7xl mx-auto text-center relative">
        
        {/* Reviews Badge (Delay: 0.2s) */}
        <div 
          className="animate-fade-in-up inline-flex items-center gap-2 mb-8 bg-gray-50 border border-gray-200/60 px-4 py-2 rounded-full"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          <div className="w-6 h-6 border border-gray-300 rounded bg-white flex items-center justify-center shadow-sm">
            <Star className="w-3.5 h-3.5 fill-black text-black" />
          </div>
          <span className="text-sm font-semibold text-black tracking-tight">4.9 rating from 18.3K+ active owners</span>
        </div>

        {/* Main Heading (Delay: 0.3s) */}
        <h1 
          className="animate-fade-in-up text-5xl md:text-7xl lg:text-[80px] font-normal leading-[1.1] tracking-tight mb-6"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          Work Smarter. Move Faster. <br />
          <span className="bg-gradient-to-r from-black via-gray-600 to-gray-400 bg-clip-text text-transparent font-semibold">
            AI Powers You Up.
          </span>
        </h1>

        {/* Subheading (Delay: 0.4s) */}
        <p 
          className="animate-fade-in-up text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          Intelligent cognitive clones sync with your business data to handle customer inquiries, capture leads, and automate client booking 24/7.
        </p>

        {/* CTA Button (Delay: 0.5s) */}
        <div 
          className="animate-fade-in-up mb-16"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/register')}
            className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-full text-base font-semibold shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2"
          >
            {user ? 'Go to Dashboard' : 'Begin Free Trial'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── TAB BAR (Delay: 0.6s) ── */}
        <div 
          className="animate-fade-in-up max-w-3xl mx-auto mb-10"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          {/* Mobile Tab Layout (2x2 Grid) */}
          <div className="md:hidden grid grid-cols-2 gap-2 bg-gray-100 rounded-2xl p-1.5 shadow-inner">
            <button 
              onClick={() => handleTabClick('analyse')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'analyse' ? 'bg-white text-black shadow-sm scale-102' : 'text-gray-500 hover:text-black'}`}
            >
              <BarChart3 className="w-4 h-4" />
              Analyse
            </button>
            <button 
              onClick={() => handleTabClick('train')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'train' ? 'bg-white text-black shadow-sm scale-102' : 'text-gray-500 hover:text-black'}`}
            >
              <BookOpen className="w-4 h-4" />
              Train
            </button>
            <button 
              onClick={() => handleTabClick('testing')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'testing' ? 'bg-white text-black shadow-sm scale-102' : 'text-gray-500 hover:text-black'}`}
            >
              <Users className="w-4 h-4" />
              Testing
            </button>
            <button 
              onClick={() => handleTabClick('deploy')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'deploy' ? 'bg-white text-black shadow-sm scale-102' : 'text-gray-500 hover:text-black'}`}
            >
              <Rocket className="w-4 h-4" />
              Deploy
            </button>
          </div>

          {/* Desktop Tab Layout (Horizontal with Dividers) */}
          <div className="hidden md:flex items-center justify-between bg-gray-100/80 backdrop-blur-md rounded-full p-1.5 border border-gray-200/50 shadow-inner">
            <button 
              onClick={() => handleTabClick('analyse')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'analyse' ? 'bg-white text-black shadow-sm scale-102 font-bold' : 'text-gray-600 hover:text-black'}`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              Analyse
            </button>
            <div className="w-px h-5 bg-gray-300/80" />
            
            <button 
              onClick={() => handleTabClick('train')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'train' ? 'bg-white text-black shadow-sm scale-102 font-bold' : 'text-gray-600 hover:text-black'}`}
            >
              <BookOpen className="w-4.5 h-4.5" />
              Train
            </button>
            <div className="w-px h-5 bg-gray-300/80" />

            <button 
              onClick={() => handleTabClick('testing')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'testing' ? 'bg-white text-black shadow-sm scale-102 font-bold' : 'text-gray-600 hover:text-black'}`}
            >
              <Users className="w-4.5 h-4.5" />
              Testing
            </button>
            <div className="w-px h-5 bg-gray-300/80" />

            <button 
              onClick={() => handleTabClick('deploy')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'deploy' ? 'bg-white text-black shadow-sm scale-102 font-bold' : 'text-gray-600 hover:text-black'}`}
            >
              <Rocket className="w-4.5 h-4.5" />
              Deploy
            </button>
          </div>
        </div>

        {/* ── VIDEO + OVERLAY SECTION (Delay: 0.7s) ── */}
        <div 
          className="animate-fade-in-up relative rounded-3xl overflow-hidden h-[400px] md:h-[500px] max-w-5xl mx-auto border border-gray-200/80 shadow-2xl shadow-gray-200"
          style={{ animationDelay: '0.7s', opacity: 0 }}
        >
          {/* Background Loop Video */}
          <video 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4"
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />

          {/* Conditional Overlays */}
          {activeTab === 'analyse' && (
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] animate-fade-in-overlay flex items-center justify-center">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 w-[90%] max-w-md shadow-2xl animate-slide-up-overlay text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-violet-100 text-violet-600">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-violet-600">Setup Wizard</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-2">Set Up Your AI Workspace</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Ingest parameters to construct your digital replica. Sync vectors from files and databases directly.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 h-2.5 rounded-full mb-6 overflow-hidden">
                  <div className="bg-violet-600 h-full rounded-full transition-all duration-700" style={{ width: '25%' }} />
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-xs font-bold text-violet-600">1</div>
                    <span className="text-xs font-semibold text-black">Upload Business FAQs & Documents (Synced)</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-55">
                    <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">2</div>
                    <span className="text-xs font-semibold text-gray-800">Map Support Intents & Hand-off Logic</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-55">
                    <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">3</div>
                    <span className="text-xs font-semibold text-gray-800">Train Speech Clone (Optional Voice Ingest)</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-55">
                    <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">4</div>
                    <span className="text-xs font-semibold text-gray-800">Launch Sandbox Validation</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'train' && (
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] animate-fade-in-overlay flex items-center justify-center">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 w-[90%] max-w-md shadow-2xl animate-slide-up-overlay text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">Model Training</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-2">Cognitive Model Training</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Synthesizing business intelligence and vector contexts. Adjusting weights for optimal accuracy.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 h-2.5 rounded-full mb-6 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full transition-all duration-700" style={{ width: '67%' }} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Index Vectors</span>
                    <span className="text-sm font-black text-black">42,850 tokenized</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Response Speed</span>
                    <span className="text-sm font-black text-orange-600">Sub-100ms Avg</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Accuracy Index</span>
                    <span className="text-sm font-black text-black">99.4% Rated</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Voice Similarity</span>
                    <span className="text-sm font-black text-black">94.7% Match</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] animate-fade-in-overlay flex items-center justify-center">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 w-[90%] max-w-md shadow-2xl animate-slide-up-overlay text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">Verification</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-black">Test Suite Results</h3>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-emerald-200">
                    Pass
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                  Sandbox test queries executed. 127/127 verification cycles completed with zero failures.
                </p>

                {/* Mock Dialog Box */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3 mb-4">
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[9px] text-gray-400 font-medium">Customer (Sector 62)</span>
                    <div className="bg-gray-200 text-black px-3.5 py-1.5 rounded-2xl rounded-tr-sm text-xs font-medium inline-block max-w-[80%] self-end">
                      Do you have gluten-free wood-fired pizzas tonight?
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[9px] text-violet-600 font-bold">★ Stellar AI Twin</span>
                    <div className="bg-black text-white px-3.5 py-1.5 rounded-2xl rounded-tl-sm text-xs font-medium inline-block max-w-[85%]">
                      Yes, we do! 🍕 We offer wood-fired gluten-free options for all our base pizzas. I can book you a table or take your pre-order right now!
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest">127 / 127 Unit Tests Succeeded</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] animate-fade-in-overlay flex items-center justify-center">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 w-[90%] max-w-md shadow-2xl animate-slide-up-overlay text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">Deployment</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-2">Deploy to Production</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Go live with your cloned digital identity. Integrate API codes or link your active phone configurations.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-black">WhatsApp Node (QR code scanned)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-black">Web Chat Widget HTML Script Generated</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-black">Calendly Booking API Sync Active</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-black">Neural Voice API Synthesized</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/register')}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-colors text-center inline-flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                >
                  Deploy Now
                  <Rocket className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── COMPANY LOGOS (Delay: 0.8s) ── */}
        <div 
          className="animate-fade-in-up mt-24"
          style={{ animationDelay: '0.8s', opacity: 0 }}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-10">
            Trusted by modern leaders and growing brands globally
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 max-w-5xl mx-auto">
            <LogoInterscope />
            <LogoSpotify />
            <LogoNexera />
            <LogoM3 />
            <LogoLauraCole />
            <LogoVertex />
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES GRID (Delay: 0.9s) ── */}
      <section 
        className="animate-fade-in-up bg-slate-50 border-t border-b border-gray-100 py-24"
        style={{ animationDelay: '0.9s', opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold text-violet-600 uppercase tracking-widest flex items-center justify-center gap-2">
              <Cpu className="w-4 h-4" /> Cognitive Cloning Suite
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-black tracking-tight">
              Powerful Features for Your Digital Clone
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-sm font-medium">
              Stellar.ai makes creating your replica incredibly straightforward. Experience modern AI performance synced directly with your business parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-6">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Knowledge Ingestion</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Upload PDFs, map URLs, or connect notion databases. The clone absorbs facts, menu pricing, terms, and services within seconds.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-violet-600">
                Vector DB Synced <Check className="w-4 h-4" />
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Neural Voice Sync</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Provide a 20-second vocal snippet to construct your custom neural voice model. Twin replies naturally in your own tone and accent.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                Voice Clone Ready <Check className="w-4 h-4" />
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">WhatsApp & Web Linkage</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Deploy to WhatsApp by scanning a QR code, or copy-paste our beautiful HTML snippet to place a chat widget directly on your website.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                Omnichannel Active <Check className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-black text-black tracking-tight text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base font-bold text-black mb-2">How long does it take to train my AI Twin?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Typically under 5 minutes. As soon as you complete the setup wizard (upload FAQs, map pricing, and record an optional voice sample), training completes automatically.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base font-bold text-black mb-2">Does it support languages other than English?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Yes! Your AI Digital Twin fully supports conversations in both English and Hindi (Hinglish/hybrid supported), allowing you to cater to a diverse user base seamlessly.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-6">
            <h3 className="text-base font-bold text-black mb-2">Can I review my twin's conversations?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Absolutely. The owner dashboard tracks all active and completed conversation threads in real time, capturing leads directly to your analytics panel.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-white">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
            </div>
            <span className="text-sm font-bold text-black">Stellar.ai</span>
            <span className="text-xs text-gray-400 font-medium">© {new Date().getFullYear()} Stellar.ai Inc.</span>
          </div>

          <div className="flex gap-6">
            <Link to="/pricing" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">Pricing</Link>
            <Link to="/documentation" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">Docs</Link>
            <Link to="/privacy" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">Privacy</Link>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-mono text-emerald-600 font-extrabold uppercase tracking-wider">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

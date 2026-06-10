import React, { useState, useEffect, useRef } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Copy, Check, Globe2, ShieldCheck, Zap, Clock,
  MessagesSquare, BookOpen, Palette, BarChart3, Languages, PlugZap
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import LogoIcon from '../components/LogoIcon';

/* =============================================================================
   ASKLY — AI customer-support assistant
   A cohesive, full-bleed, NON-card homepage. One <script> tag → a live AI
   assistant on any website. Hand-built SVGs, continuous bands, kinetic copy.
   ============================================================================= */

const EASE = [0.16, 1, 0.3, 1];

const Reveal = ({ children, delay = 0, y = 26, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-70px' }}
    transition={{ duration: 0.85, ease: EASE, delay }}
  >
    {children}
  </motion.div>
);

/* ---------- Magnetic CTA ---------- */
const Magnetic = ({ children, onClick, className = '' }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  return (
    <motion.button
      onClick={onClick}
      onMouseMove={move}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

/* =============================================================================
   BOT MARK — a custom, hand-built SVG assistant face (used across the page)
   ============================================================================= */
const BotMark = ({ size = 44, className = '', talking = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="botgrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFC56B" />
        <stop offset="0.55" stopColor="#F5A623" />
        <stop offset="1" stopColor="#FF6B5E" />
      </linearGradient>
    </defs>
    {/* antenna */}
    <motion.g
      animate={talking ? { rotate: [0, -8, 8, 0] } : {}}
      transition={{ duration: 1.6, repeat: Infinity }}
      style={{ transformOrigin: '32px 14px' }}
    >
      <line x1="32" y1="14" x2="32" y2="6" stroke="url(#botgrad)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="5" r="3" fill="url(#botgrad)" />
    </motion.g>
    {/* head */}
    <rect x="12" y="14" width="40" height="34" rx="12" stroke="url(#botgrad)" strokeWidth="3" />
    {/* eyes */}
    <motion.circle cx="25" cy="30" r="3.4" fill="url(#botgrad)"
      animate={{ scaleY: [1, 1, 0.15, 1, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ transformOrigin: '25px 30px' }} />
    <motion.circle cx="39" cy="30" r="3.4" fill="url(#botgrad)"
      animate={{ scaleY: [1, 1, 0.15, 1, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ transformOrigin: '39px 30px' }} />
    {/* smile */}
    <path d="M24 38 Q32 43 40 38" stroke="url(#botgrad)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    {/* base ears */}
    <line x1="9" y1="28" x2="9" y2="36" stroke="url(#botgrad)" strokeWidth="3" strokeLinecap="round" />
    <line x1="55" y1="28" x2="55" y2="36" stroke="url(#botgrad)" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* =============================================================================
   HERO — full-bleed. Left: editorial headline. Right: a live "embed" terminal
   that types the one-liner, then a chat bubble bursts onto a faux website.
   ============================================================================= */
const SCRIPT_LINE = `<script src="https://askly.ai/widget.js" data-id="acme"></script>`;

const HeroTerminal = () => {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let i = 0;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      if (i <= SCRIPT_LINE.length) {
        setTyped(SCRIPT_LINE.slice(0, i));
        i++;
        setTimeout(tick, 34);
      } else {
        setDone(true);
        setTimeout(() => alive && setLive(true), 650);
      }
    };
    const start = setTimeout(tick, 700);
    return () => { alive = false; clearTimeout(start); };
  }, []);

  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      {/* faux browser window — the user's website */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
        className="relative rounded-2xl overflow-hidden"
        style={{ background: '#0E0C0A', border: '1px solid rgba(247,243,236,0.1)', boxShadow: '0 40px 90px -30px rgba(0,0,0,0.8)' }}
      >
        {/* browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(247,243,236,0.03)', borderBottom: '1px solid rgba(247,243,236,0.07)' }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#FF6B5E' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#FFC56B' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#9AB39A' }} />
          <div className="ml-3 flex-1 h-6 rounded-md flex items-center px-3 gap-2" style={{ background: 'rgba(247,243,236,0.04)' }}>
            <Globe2 className="w-3 h-3 text-paper/35" />
            <span className="text-[11px] text-paper/45 font-mono">yourbusiness.com</span>
          </div>
        </div>

        {/* faux website body */}
        <div className="relative h-[300px] p-6 overflow-hidden">
          <div className="h-4 w-2/3 rounded-full" style={{ background: 'rgba(247,243,236,0.08)' }} />
          <div className="mt-3 h-3 w-1/2 rounded-full" style={{ background: 'rgba(247,243,236,0.05)' }} />
          <div className="mt-7 h-24 rounded-xl" style={{ background: 'rgba(247,243,236,0.03)', border: '1px solid rgba(247,243,236,0.05)' }} />
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((k) => (
              <div key={k} className="h-14 rounded-lg" style={{ background: 'rgba(247,243,236,0.03)' }} />
            ))}
          </div>

          {/* the assistant bubble that appears once "live" */}
          <AnimatePresence>
            {live && (
              <motion.div
                key="bubble"
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="absolute bottom-5 right-5 flex flex-col items-end gap-2"
              >
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="max-w-[190px] text-[11px] leading-snug px-3 py-2 rounded-2xl rounded-br-sm text-paper/90 font-medium"
                  style={{ background: 'rgba(247,243,236,0.07)', border: '1px solid rgba(247,243,236,0.1)' }}
                >
                  Hi! 👋 I'm your assistant. Ask me anything about your order or hours.
                </motion.div>
                <motion.div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#FFC56B,#F5A623,#FF6B5E)' }}
                  animate={{ boxShadow: ['0 0 0 0 rgba(245,166,35,0.5)', '0 0 0 14px rgba(245,166,35,0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BotMark size={28} talking />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* the code paste — slotted UNDER the browser as one continuous object */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
        className="relative -mt-4 mx-4 rounded-xl px-4 py-3.5 font-mono text-[12px] leading-relaxed"
        style={{ background: '#06201a', border: '1px solid rgba(154,179,154,0.25)', boxShadow: '0 20px 50px -20px rgba(0,0,0,0.7)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-sage/70">paste once, anywhere in your html</span>
        </div>
        <code className="block break-all text-paper/85 min-h-[34px]">
          {typed}
          {!done && <span className="inline-block w-[7px] h-[14px] -mb-[2px] ml-0.5 bg-sage caret-blink" />}
        </code>
      </motion.div>

      {/* hand-drawn callout */}
      <div className="hidden xl:flex absolute -right-[8.5rem] top-[42%] flex-col items-start max-w-[150px] pointer-events-none select-none">
        <svg viewBox="0 0 100 60" className="w-20 h-12 -scale-x-100" style={{ color: '#9AB39A' }}>
          <path d="M 88 8 C 60 30, 40 34, 14 16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="4 4" fill="none" />
          <path d="M 26 8 L 12 16 L 20 28" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span className="font-handwriting text-[20px] leading-tight text-sage -rotate-2 mt-1">that's literally it — one line.</span>
      </div>
    </div>
  );
};

const ROTATING = ['customer queries', 'order questions', 'booking requests', 'support tickets', 'FAQs at 2 AM'];

const Hero = () => {
  const navigate = useNavigate();
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setW((p) => (p + 1) % ROTATING.length), 2100);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 z-10">
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-20 items-center">
        {/* copy */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full"
              style={{ background: 'rgba(247,243,236,0.04)', border: '1px solid rgba(247,243,236,0.1)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-sage live-dot" />
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-paper/70">
                The 1-line AI support assistant
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-7 text-[2.7rem] sm:text-[3.4rem] lg:text-[4.1rem] font-black leading-[1.03] tracking-[-0.035em] text-paper">
              Answer every
              <span className="relative inline-block mx-2 align-bottom h-[1.1em] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={w}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="block font-editorial italic font-medium text-amber-grad whitespace-nowrap pr-1"
                  >
                    {ROTATING[w]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br className="hidden sm:block" />
              with a single line of code.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 text-base sm:text-lg max-w-xl leading-relaxed text-paper/55">
              Askly is an <span className="text-paper font-semibold">AI assistant</span> that learns your business
              and replies to customers instantly — on chat, in English &amp; Hindi. Drop in
              <span className="font-mono text-sage"> one &lt;script&gt; tag</span> and it goes live. No SDKs, no
              build steps, no thousand lines of code.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <Magnetic
                onClick={() => navigate('/register')}
                className="btn-shine relative w-full sm:w-auto group px-8 py-4 rounded-xl text-sm font-bold text-[#0B0A09] inline-flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get your assistant — free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0" style={{ background: 'linear-gradient(100deg,#FFC56B,#F5A623 55%,#FF6B5E)' }} />
              </Magnetic>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-paper/85 transition-all hover:text-paper"
                style={{ background: 'rgba(247,243,236,0.04)', border: '1px solid rgba(247,243,236,0.12)' }}
              >
                See pricing
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-7 gap-y-3 text-paper/45">
              {[
                { icon: Zap, t: 'Live in ~5 min' },
                { icon: Clock, t: 'Replies under 1s' },
                { icon: ShieldCheck, t: 'Your data stays yours' },
              ].map((x) => (
                <span key={x.t} className="flex items-center gap-2 text-[13px] font-medium">
                  <x.icon className="w-4 h-4 text-amber" /> {x.t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* live embed terminal */}
        <div className="lg:col-span-6">
          <HeroTerminal />
        </div>
      </div>
    </section>
  );
};

/* =============================================================================
   LOGO / TRUST STRIP — continuous, no boxes
   ============================================================================= */
const TrustStrip = () => {
  const items = ['Restaurants', 'Clinics', 'Boutiques', 'Real estate', 'Gyms', 'Salons', 'Cafés', 'Agencies', 'Coaching', 'E-commerce'];
  const row = [...items, ...items];
  return (
    <div className="relative z-10 py-9 border-y" style={{ borderColor: 'rgba(247,243,236,0.06)' }}>
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/35 mb-6">
        Quietly answering customers for businesses like
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track gap-10">
          {row.map((t, i) => (
            <span key={i} className="whitespace-nowrap text-lg font-semibold text-paper/30 flex items-center gap-10">
              {t}
              <span className="w-1 h-1 rounded-full bg-amber/50" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =============================================================================
   HOW IT WORKS — a continuous VERTICAL spine (not cards). A single line runs
   down the center; steps alternate; an SVG path connects everything.
   ============================================================================= */
const Spine = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const steps = [
    {
      n: '01', icon: BookOpen, accent: '#F5A623',
      title: 'It reads your business',
      body: 'Paste your website link, drop a PDF menu or price list, or type your FAQs. Askly studies it all and learns exactly how you answer customers.',
    },
    {
      n: '02', icon: Palette, accent: '#FF6B5E',
      title: 'You style it in a click',
      body: 'Pick a brand colour, a greeting, and a tone — warm, professional, or playful. A preview updates live as you go. No designer needed.',
    },
    {
      n: '03', icon: PlugZap, accent: '#9AB39A',
      title: 'You paste one line',
      body: 'Copy a single <script> tag into your site’s HTML — once. The assistant appears as a chat bubble and starts answering the moment the page loads.',
    },
  ];

  return (
    <section className="relative py-28 z-10" style={{ borderTop: '1px solid rgba(247,243,236,0.05)' }}>
      <div className="max-w-3xl mx-auto px-6 text-center mb-20">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-amber">How it works</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-paper tracking-[-0.03em] leading-[1.05]">
            From zero to live in <span className="font-editorial italic font-medium text-paper/70">three moves.</span>
          </h2>
        </Reveal>
      </div>

      <div ref={ref} className="relative max-w-4xl mx-auto px-6">
        {/* spine track */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block" style={{ background: 'rgba(247,243,236,0.08)' }} />
        <motion.div
          className="absolute left-1/2 top-0 w-px -translate-x-1/2 hidden md:block"
          style={{ height, background: 'linear-gradient(180deg,#FFC56B,#F5A623,#FF6B5E)' }}
        />

        <div className="flex flex-col gap-16 md:gap-4">
          {steps.map((s, i) => {
            const left = i % 2 === 0;
            return (
              <Reveal key={s.n} delay={i * 0.05}>
                <div className={`relative flex flex-col md:flex-row items-center ${left ? '' : 'md:flex-row-reverse'} gap-6`}>
                  {/* text half */}
                  <div className={`flex-1 ${left ? 'md:text-right md:pr-14' : 'md:text-left md:pl-14'} text-center`}>
                    <span className="font-editorial italic text-6xl font-medium" style={{ color: s.accent, opacity: 0.25 }}>{s.n}</span>
                    <h3 className="mt-1 text-2xl font-bold text-paper tracking-tight">{s.title}</h3>
                    <p className="mt-3 text-[15px] text-paper/55 leading-relaxed max-w-sm md:inline-block" style={{ marginLeft: left ? 'auto' : 0 }}>{s.body}</p>
                  </div>
                  {/* node */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      whileInView={{ scale: [0.6, 1.1, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: `${s.accent}16`, border: `1.5px solid ${s.accent}55`, color: s.accent }}
                    >
                      <s.icon className="w-7 h-7" />
                    </motion.div>
                  </div>
                  {/* spacer half */}
                  <div className="flex-1 hidden md:block" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* =============================================================================
   LIVE CONVERSATION BAND — a single, full-bleed split. Left: a real-feeling
   chat that plays through industries. Right: editorial copy. Not a card grid.
   ============================================================================= */
const CONVOS = [
  { tag: 'Restaurant', q: 'Do you have gluten-free pizza? Table for 4 at 8?', a: "Yes — all our wood-fired pizzas come gluten-free 🍕. I've held a table for 4 at 8:00 PM under your name. See you then!" },
  { tag: 'Dental clinic', q: 'Any emergency slot today? What are your hours?', a: "We're open 9 AM–8 PM daily. I can fit you into a 4:30 PM emergency slot today — shall I confirm it?" },
  { tag: 'Boutique', q: 'Do you ship internationally and how are returns?', a: 'We ship worldwide — free over ₹8,000 ✈️. Returns are free within 14 days, no questions asked.' },
  { tag: 'Gym', q: 'Monthly membership price? Personal training?', a: 'Memberships start at ₹1,499/mo, and yes — certified coaches build custom plans. Want a free day pass?' },
];

const ConversationBand = () => {
  const [idx, setIdx] = useState(0);
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const run = async () => {
      let i = 0;
      while (alive) {
        const c = CONVOS[i % CONVOS.length];
        setIdx(i % CONVOS.length);
        setMsgs([{ r: 'u', t: c.q }]);
        await sleep(1100); if (!alive) break;
        setTyping(true);
        await sleep(1400); if (!alive) break;
        setTyping(false);
        setMsgs([{ r: 'u', t: c.q }, { r: 'b', t: c.a }]);
        await sleep(3600); if (!alive) break;
        setMsgs([]);
        await sleep(500);
        i++;
      }
    };
    run();
    return () => { alive = false; };
  }, []);

  return (
    <section className="relative py-28 z-10 overflow-hidden" style={{ background: 'rgba(0,0,0,0.22)', borderTop: '1px solid rgba(247,243,236,0.05)' }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* chat (no outer card — it's a bare, branded chat surface) */}
        <Reveal>
          <div className="relative max-w-md mx-auto w-full">
            <div className="flex items-center gap-3 mb-5 pl-1">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#FFC56B,#F5A623,#FF6B5E)' }}>
                <BotMark size={26} talking />
              </div>
              <div>
                <p className="text-sm font-bold text-paper leading-none">Askly assistant</p>
                <p className="text-[11px] text-sage font-semibold mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage live-dot" /> typically replies instantly
                </p>
              </div>
              <span className="ml-auto text-[10px] font-mono px-2.5 py-1 rounded-full text-paper/50" style={{ background: 'rgba(247,243,236,0.05)' }}>
                {CONVOS[idx].tag}
              </span>
            </div>

            <div className="min-h-[210px] flex flex-col justify-end gap-3">
              <AnimatePresence mode="popLayout">
                {msgs.map((m, k) => (
                  <motion.div
                    key={`${idx}-${k}`}
                    initial={{ opacity: 0, y: 14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`max-w-[88%] text-[13.5px] leading-relaxed px-4 py-2.5 rounded-2xl ${
                      m.r === 'u'
                        ? 'self-end text-[#0B0A09] rounded-br-md font-semibold'
                        : 'self-start text-paper/90 rounded-bl-md font-medium'
                    }`}
                    style={m.r === 'u'
                      ? { background: 'linear-gradient(120deg,#FFC56B,#F5A623)' }
                      : { background: 'rgba(247,243,236,0.06)', border: '1px solid rgba(247,243,236,0.1)' }}
                  >
                    {m.t}
                  </motion.div>
                ))}
                {typing && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="self-start px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5"
                    style={{ background: 'rgba(247,243,236,0.06)', border: '1px solid rgba(247,243,236,0.1)' }}
                  >
                    {[0, 0.15, 0.3].map((d, i) => (
                      <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-amber"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay: d }} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              <div className="flex-1 h-11 rounded-full flex items-center px-4 text-[13px] text-paper/35" style={{ background: 'rgba(247,243,236,0.04)', border: '1px solid rgba(247,243,236,0.09)' }}>
                Ask anything…
              </div>
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-[#0B0A09]" style={{ background: 'linear-gradient(120deg,#FFC56B,#F5A623)' }}>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* copy */}
        <Reveal delay={0.1}>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-amber">Real conversations</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-paper tracking-[-0.03em] leading-[1.05]">
              It talks like a teammate — <span className="font-editorial italic font-medium text-paper/70">not a bot.</span>
            </h2>
            <p className="mt-6 text-base text-paper/55 leading-relaxed max-w-lg">
              Askly understands intent, not just keywords. It pulls the right answer from your own content,
              keeps context across the chat, and switches between English and Hindi the moment a customer does.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Books, quotes, and captures leads inside the chat',
                'Hands off to a human the instant it’s unsure',
                'Remembers what was said earlier in the conversation',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] text-paper/75">
                  <span className="mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(154,179,154,0.18)' }}>
                    <Check className="w-3 h-3 text-sage" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* =============================================================================
   CAPABILITIES — a continuous editorial list, NOT a card grid. Each row is a
   full-width band split into an icon-label rail and a description, divided by
   thin rules. Reads like a beautifully typeset spec sheet.
   ============================================================================= */
const Capabilities = () => {
  const rows = [
    { icon: BookOpen, accent: '#F5A623', k: 'Knows your business', d: 'Feed it your site, PDFs, price lists and FAQs. It answers from your real content — never makes things up.' },
    { icon: Languages, accent: '#9AB39A', k: 'English & Hindi, fluently', d: 'Replies naturally in both languages and switches mid-conversation to match each customer.' },
    { icon: MessagesSquare, accent: '#FF6B5E', k: 'Captures every lead', d: 'Collects names, numbers and intent right inside the chat, then drops them straight into your dashboard.' },
    { icon: Palette, accent: '#FFC56B', k: 'Matches your brand', d: 'Set the colour, greeting and avatar. The widget feels like part of your site — not a bolted-on bot.' },
    { icon: BarChart3, accent: '#C98BFF', k: 'Shows you what works', d: 'See top questions, busiest hours, and where customers get stuck — so you can fix gaps fast.' },
    { icon: ShieldCheck, accent: '#9AB39A', k: 'Private by default', d: 'Your knowledge stays isolated to your workspace. Review or delete it anytime — it’s yours.' },
  ];

  return (
    <section id="features" className="relative py-28 z-10" style={{ borderTop: '1px solid rgba(247,243,236,0.05)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-amber">What it does</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-paper tracking-[-0.03em] leading-[1.05]">
            Everything you'd hire a support rep for — <span className="font-editorial italic font-medium text-paper/70">handled.</span>
          </h2>
        </Reveal>

        <div style={{ borderTop: '1px solid rgba(247,243,236,0.08)' }}>
          {rows.map((r, i) => (
            <Reveal key={r.k} delay={i * 0.04}>
              <div className="group grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center py-7 transition-colors"
                style={{ borderBottom: '1px solid rgba(247,243,236,0.08)' }}>
                <div className="md:col-span-5 flex items-center gap-4">
                  <span className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:-rotate-6 group-hover:scale-110"
                    style={{ background: `${r.accent}16`, border: `1px solid ${r.accent}40`, color: r.accent }}>
                    <r.icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold text-paper tracking-tight">{r.k}</h3>
                </div>
                <p className="md:col-span-7 text-[15px] text-paper/55 leading-relaxed">{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =============================================================================
   THE ONE-LINER — full-bleed feature band with copy-to-clipboard. The product's
   core promise, front and center.
   ============================================================================= */
const OneLiner = () => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(SCRIPT_LINE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section className="relative py-28 z-10 overflow-hidden" style={{ background: 'rgba(245,166,35,0.025)', borderTop: '1px solid rgba(247,243,236,0.05)', borderBottom: '1px solid rgba(247,243,236,0.05)' }}>
      {/* ambient line-art constellation behind */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" preserveAspectRatio="none">
        <defs>
          <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#F5A623" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-amber">No code, no kidding</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-paper tracking-[-0.03em] leading-[1.05]">
            Your whole assistant is <span className="font-editorial italic font-medium text-paper/70">one line long.</span>
          </h2>
          <p className="mt-6 text-base text-paper/55 max-w-xl mx-auto leading-relaxed">
            Forget SDKs, npm installs and thousand-line integrations. Paste this into your site’s HTML,
            hit save, and your AI assistant is live.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 group relative rounded-2xl overflow-hidden text-left"
            style={{ background: '#0E0C0A', border: '1px solid rgba(247,243,236,0.1)', boxShadow: '0 30px 70px -30px rgba(0,0,0,0.8)' }}>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(247,243,236,0.07)' }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF6B5E' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FFC56B' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#9AB39A' }} />
                <span className="ml-2 text-[11px] font-mono text-paper/40">index.html</span>
              </div>
              <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                style={{ background: copied ? 'rgba(154,179,154,0.2)' : 'rgba(247,243,236,0.06)', color: copied ? '#9AB39A' : 'rgba(247,243,236,0.7)' }}>
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            </div>
            <pre className="px-5 py-6 font-mono text-[13px] sm:text-[15px] leading-relaxed overflow-x-auto">
              <code className="text-paper/85">
                <span className="text-paper/35">&lt;</span><span className="text-coral">script</span>{' '}
                <span className="text-sage">src</span><span className="text-paper/35">=</span><span className="text-amber-soft">"https://askly.ai/widget.js"</span>{' '}
                <span className="text-sage">data-id</span><span className="text-paper/35">=</span><span className="text-amber-soft">"acme"</span>
                <span className="text-paper/35">&gt;&lt;/</span><span className="text-coral">script</span><span className="text-paper/35">&gt;</span>
              </code>
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* =============================================================================
   STATS BAND — full-bleed numbers, continuous, divided by thin verticals
   ============================================================================= */
const Stats = () => {
  const stats = [
    { v: '< 1s', l: 'average reply time' },
    { v: '99.4%', l: 'answers on-topic' },
    { v: '24 / 7', l: 'always awake' },
    { v: '2', l: 'languages, fluent' },
  ];
  return (
    <section className="relative py-20 z-10" style={{ borderTop: '1px solid rgba(247,243,236,0.05)' }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-10">
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.06}>
            <div className={`text-center px-4 ${i !== 0 ? 'md:border-l' : ''}`} style={{ borderColor: 'rgba(247,243,236,0.1)' }}>
              <span className="block text-4xl sm:text-5xl font-black text-amber-grad leading-none">{s.v}</span>
              <span className="block mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/40">{s.l}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* =============================================================================
   VOICES — testimonials as a continuous quote wall (no boxes). Big editorial
   pull-quote that rotates, with a row of small attributions.
   ============================================================================= */
const Voices = () => {
  const quotes = [
    { name: 'Priya Sharma', role: 'Aura Boutique', text: 'Customers used to wait hours. Now Askly replies in seconds and it sounds exactly like us — we stopped losing late-night orders overnight.' },
    { name: 'Dr. Anil Mehta', role: 'CareFirst Dental', text: 'It books appointments while I’m with patients. Half the front-desk work just disappeared. Setup took one coffee break.' },
    { name: 'Rahul Verma', role: 'Apex Fitness', text: 'People ask the same five questions all day. Askly handles every one, in Hindi and English, without me lifting a finger.' },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % quotes.length), 5000);
    return () => clearInterval(t);
  }, [quotes.length]);

  return (
    <section className="relative py-32 z-10 overflow-hidden" style={{ background: 'rgba(0,0,0,0.22)', borderTop: '1px solid rgba(247,243,236,0.05)' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <svg viewBox="0 0 40 30" className="w-12 h-9 mx-auto mb-8" style={{ color: '#F5A623' }} fill="currentColor">
            <path d="M0 30V16C0 7 5 1 14 0l2 5C10 7 8 10 8 14h6v16H0zm22 0V16C22 7 27 1 36 0l2 5c-6 2-8 5-8 9h6v16H22z" opacity="0.8" />
          </svg>
        </Reveal>
        <div className="min-h-[220px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="text-2xl sm:text-[2.1rem] font-editorial italic font-medium text-paper leading-snug tracking-tight">
                “{quotes[i].text}”
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#0B0A09]" style={{ background: 'linear-gradient(135deg,#FFC56B,#F5A623)' }}>
                  {quotes[i].name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-paper leading-none">{quotes[i].name}</p>
                  <p className="text-xs text-paper/45 mt-1">{quotes[i].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          {quotes.map((_, k) => (
            <button key={k} onClick={() => setI(k)} className="h-1.5 rounded-full transition-all"
              style={{ width: k === i ? 28 : 8, background: k === i ? '#F5A623' : 'rgba(247,243,236,0.2)' }} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* =============================================================================
   FAQ — clean accordion, full-width rules, no boxes
   ============================================================================= */
const FAQ = () => {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: 'Do I really only need one line of code?', a: 'Yes. You copy a single <script> tag into your site’s HTML — once. No npm, no SDK, no build step. The assistant loads itself and starts working immediately.' },
    { q: 'Will it actually sound like my business?', a: 'It learns from your own content — your site, PDFs and FAQs — and you set the tone and greeting. Replies feel written by you, not a generic bot.' },
    { q: 'What if it doesn’t know an answer?', a: 'It won’t guess. When it’s unsure it says so honestly and can hand the conversation off to a human or capture the lead for you to follow up.' },
    { q: 'Can it speak Hindi?', a: 'Fluently. It replies in both English and Hindi and switches naturally the moment a customer does.' },
    { q: 'Is my data safe?', a: 'Your knowledge stays isolated to your own workspace — never mixed with other businesses. You can review or delete everything anytime.' },
  ];
  return (
    <section className="relative py-28 z-10" style={{ borderTop: '1px solid rgba(247,243,236,0.05)' }}>
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-amber">Questions?</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black text-paper tracking-[-0.03em]">The honest answers</h2>
        </Reveal>
        <div style={{ borderTop: '1px solid rgba(247,243,236,0.08)' }}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: '1px solid rgba(247,243,236,0.08)' }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full py-5 flex items-center justify-between text-left gap-4 group">
                  <span className={`font-semibold text-[16px] transition-colors ${isOpen ? 'text-amber' : 'text-paper group-hover:text-paper/80'}`}>{f.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0 text-2xl font-light leading-none" style={{ color: isOpen ? '#F5A623' : 'rgba(247,243,236,0.4)' }}>+</motion.span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
                      <p className="pb-6 pr-8 text-[15px] text-paper/55 leading-relaxed">{f.a}</p>
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

/* =============================================================================
   CTA — full-bleed warm band, no inner card
   ============================================================================= */
const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-32 z-10 overflow-hidden" style={{ borderTop: '1px solid rgba(247,243,236,0.05)' }}>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60%] h-72 rounded-full blur-[120px] breathe" style={{ background: 'rgba(245,166,35,0.14)' }} />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <BotMark size={56} talking className="mx-auto mb-7" />
          <h2 className="text-4xl md:text-[3.4rem] font-black text-paper tracking-[-0.03em] leading-[1.05]">
            Give your customers an answer
            <br />before they even refresh.
          </h2>
          <p className="mt-6 max-w-lg mx-auto text-base text-paper/55 leading-relaxed">
            Build your AI assistant free, paste one line, and watch it go live in minutes. No card, no code, no commitment.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Magnetic onClick={() => navigate('/register')} className="btn-shine relative w-full sm:w-auto group px-9 py-4 rounded-xl text-sm font-bold text-[#0B0A09] inline-flex items-center justify-center gap-2 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">Start free<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              <span className="absolute inset-0" style={{ background: 'linear-gradient(100deg,#FFC56B,#F5A623 55%,#FF6B5E)' }} />
            </Magnetic>
            <button onClick={() => navigate('/pricing')} className="w-full sm:w-auto px-9 py-4 rounded-xl text-sm font-semibold text-paper/85 transition-all hover:text-paper" style={{ background: 'rgba(247,243,236,0.05)', border: '1px solid rgba(247,243,236,0.12)' }}>
              Compare plans
            </button>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-paper/40 font-medium">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-sage" /> Your data stays yours</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber" /> Live in ~5 minutes</span>
            <a href="mailto:nexora.aidigital.twin@gmail.com" className="link-underline hover:text-paper transition-colors">Talk to us</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* =============================================================================
   FOOTER
   ============================================================================= */
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="pt-16 pb-12 relative z-10" style={{ background: '#080706', borderTop: '1px solid rgba(247,243,236,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer w-fit">
              <div className="flex items-center justify-center p-2 rounded-xl" style={{ background: 'rgba(245,166,35,0.1)' }}>
                <LogoIcon className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-paper tracking-tight">Askly</span>
            </div>
            <p className="text-sm text-paper/45 max-w-xs leading-relaxed">
              The one-line AI assistant that answers your customers — instantly, in your voice, around the clock.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="text-xs font-bold text-paper mb-4 uppercase tracking-widest">Product</h4>
              <ul className="space-y-3">
                <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-paper/45 hover:text-amber transition-colors">Features</button></li>
                <li><button onClick={() => navigate('/pricing')} className="text-sm text-paper/45 hover:text-amber transition-colors">Pricing</button></li>
                <li><button onClick={() => navigate('/guide')} className="text-sm text-paper/45 hover:text-amber transition-colors">Setup guide</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-paper mb-4 uppercase tracking-widest">Support</h4>
              <ul className="space-y-3">
                <li><a href="mailto:nexora.aidigital.twin@gmail.com" className="text-sm text-paper/45 hover:text-amber transition-colors break-all">Email us</a></li>
                <li><button onClick={() => navigate('/legal')} className="text-sm text-paper/45 hover:text-amber transition-colors">Terms &amp; privacy</button></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(247,243,236,0.06)' }}>
          <p className="text-[11px] text-paper/35 font-medium">&copy; {new Date().getFullYear()} Askly. Made with care.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sage live-dot" />
            <span className="text-[10px] font-semibold text-sage uppercase tracking-widest">All systems running</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* =============================================================================
   AMBIENT BG — warm, organic; same language, kept subtle
   ============================================================================= */
const WarmBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ background: '#0B0A09' }}>
    <div className="absolute -top-[18%] -left-[8%] w-[60%] h-[60%] rounded-full drift-a"
      style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.10) 0%, transparent 62%)', filter: 'blur(80px)' }} />
    <div className="absolute bottom-[2%] right-[-4%] w-[46%] h-[46%] rounded-full drift-b"
      style={{ background: 'radial-gradient(circle, rgba(255,107,94,0.07) 0%, transparent 65%)', filter: 'blur(90px)' }} />
    <div className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: 'linear-gradient(rgba(247,243,236,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(247,243,236,0.5) 1px, transparent 1px)',
        backgroundSize: '74px 74px',
        maskImage: 'radial-gradient(ellipse at 50% 20%, #000 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 20%, #000 30%, transparent 80%)'
      }} />
  </div>
);

/* =============================================================================
   PAGE
   ============================================================================= */
const Home = () => (
  <div className="relative min-h-screen text-paper font-sans overflow-x-hidden" style={{ background: '#0B0A09' }}>
    <LandingNavbar />
    <WarmBackground />
    <div className="grain-layer" />
    <main className="relative">
      <Hero />
      <TrustStrip />
      <Spine />
      <ConversationBand />
      <Capabilities />
      <OneLiner />
      <Stats />
      <Voices />
      <FAQ />
      <CTA />
    </main>
    <Footer />
  </div>
);

export default Home;

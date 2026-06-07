/**
 * AI Digital Twin Platform - Premium Motion Design System
 * 
 * This file contains reusable motion hooks, animation variants,
 * and interaction patterns for creating a premium, handcrafted feel.
 * 
 * Inspired by: Linear, Arc Browser, Stripe, Vercel, Apple
 */

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, animate } from 'framer-motion';

// ============================================================================
// PREMIUM EASING CURVES
// ============================================================================

export const EASING = {
  // Apple-style smooth entrance/exit
  smooth: [0.22, 1, 0.36, 1],
  
  // Snappy but refined
  snappy: [0.16, 1, 0.3, 1],
  
  // Gentle, natural deceleration
  gentle: [0.4, 0, 0.2, 1],
  
  // Dramatic overshoot for emphasis
  dramatic: [0.76, 0, 0.24, 1],
  
  // Bouncy playfulness (use sparingly)
  bouncy: [0.5, 0, 0.3, 1.2],
};

// ============================================================================
// ANIMATION DURATION HIERARCHY
// ============================================================================

export const DURATION = {
  instant: 0.12,    // Micro feedback (checkbox, toggle)
  fast: 0.2,        // Hover states, small UI changes
  normal: 0.35,     // Card transitions, modals
  slow: 0.6,        // Section reveals, page transitions
  cinematic: 1.0,   // Hero animations, major state changes
  ambient: 8,       // Background loops, subtle movements
};

// ============================================================================
// REUSABLE ANIMATION VARIANTS
// ============================================================================

// Fade in from bottom with scale
export const fadeInUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASING.smooth }
  }
};

// Fade in from left
export const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASING.smooth }
  }
};

// Fade in from right
export const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASING.smooth }
  }
};

// Stagger container for child elements
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Scale in with spring
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 300,
      duration: DURATION.normal
    }
  }
};

// Slide up for drawers/modals
export const slideUp = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.dramatic }
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: { duration: DURATION.fast, ease: EASING.snappy }
  }
};

// Expand from center
export const expandCenter = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASING.smooth }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: DURATION.fast }
  }
};

// Text reveal (character by character)
export const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: DURATION.normal,
      ease: EASING.smooth
    }
  })
};

// ============================================================================
// MAGNETIC BUTTON HOOK
// ============================================================================

/**
 * Creates a magnetic pull effect on hover
 * The button follows the cursor slightly before snapping back
 */
export const useMagnetic = (strength = 0.3) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    x.set(deltaX * strength);
    y.set(deltaY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, x, y, handleMouseMove, handleMouseLeave };
};

// ============================================================================
// PARALLAX SCROLL HOOK
// ============================================================================

/**
 * Creates parallax scrolling effect based on scroll position
 * speed: 0.05 = subtle, 0.3 = dramatic
 */
export const useParallax = (speed = 0.1) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 100 * speed]);
  return y;
};

// ============================================================================
// SMOOTH COUNT-UP ANIMATION
// ============================================================================

/**
 * Animates a number from 0 to target value
 * Usage: const animatedValue = useCountUp(1250, 2);
 */
export const useCountUp = (target, duration = 2) => {
  const value = useMotionValue(0);
  
  useEffect(() => {
    const controls = animate(value, target, {
      duration,
      ease: EASING.smooth,
    });
    
    return controls.stop;
  }, [target, duration, value]);
  
  return value;
};

// ============================================================================
// TYPING TEXT ANIMATION
// ============================================================================

/**
 * Types out text character by character like a typewriter
 */
export const TypingText = ({ text, delay = 0.05, className = '' }) => {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * delay }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

// ============================================================================
// GRADIENT BORDER CARD COMPONENT
// ============================================================================

export const GradientBorderCard = ({ children, className = '', gradient = 'cyan' }) => {
  const gradients = {
    cyan: 'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(0,255,179,0.1), rgba(0,212,255,0.3))',
    orange: 'linear-gradient(135deg, rgba(255,107,53,0.3), rgba(255,61,113,0.1), rgba(255,107,53,0.3))',
    purple: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(139,92,246,0.1), rgba(167,139,250,0.3))',
  };

  return (
    <div className={`relative p-[1px] rounded-2xl overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{ background: gradients[gradient] }}
        animate={{
          background: [
            gradients[gradient],
            gradients[gradient].replace('0.3', '0.5'),
            gradients[gradient],
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative bg-[#0D0F17] rounded-2xl">
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// FLOATING ORB COMPONENT (Background Decoration)
// ============================================================================

export const FloatingOrb = ({ color, size = 'medium', position, duration = 20 }) => {
  const sizes = {
    small: 'w-32 h-32',
    medium: 'w-64 h-64',
    large: 'w-96 h-96',
  };

  const positions = {
    topLeft: '-top-20 -left-20',
    topRight: '-top-20 -right-20',
    bottomLeft: '-bottom-20 -left-20',
    bottomRight: '-bottom-20 -right-20',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <motion.div
      className={`absolute ${sizes[size]} ${positions[position]} rounded-full blur-3xl opacity-20 pointer-events-none`}
      style={{ backgroundColor: color }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -20, 30, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// ============================================================================
// GLASSMORPHIC SURFACE COMPONENT
// ============================================================================

export const GlassSurface = ({ 
  children, 
  className = '', 
  blur = 20,
  border = true,
  hover = false 
}) => {
  return (
    <motion.div
      className={`relative backdrop-blur-${blur} ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.015)',
        border: border ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
      }}
      {...(hover && {
        whileHover: {
          y: -4,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          transition: { duration: DURATION.fast, ease: EASING.snappy }
        }
      })}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// PROGRESS RING COMPONENT
// ============================================================================

export const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = '#00D4FF' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: EASING.smooth }}
      />
    </svg>
  );
};

// ============================================================================
// WAVEFORM VISUALIZATION COMPONENT
// ============================================================================

export const Waveform = ({ bars = 20, color = '#00D4FF', animated = true }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ 
            backgroundColor: color,
            width: '4px',
            minHeight: '8px',
          }}
          animate={animated ? {
            scaleY: [0.3, 1, 0.5, 1.2, 0.4],
          } : {}}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.05,
            ease: EASING.bouncy,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// SCROLL PROGRESS INDICATOR
// ============================================================================

export const ScrollProgress = ({ color = '#00D4FF' }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 z-50 origin-left"
      style={{
        scaleX,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }}
    />
  );
};

// ============================================================================
// HOVER SPOTLIGHT EFFECT
// ============================================================================

export const SpotlightCard = ({ children, className = '' }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
          left: mouseX,
          top: mouseY,
          x: '-50%',
          y: '-50%',
        }}
      />
      {children}
    </div>
  );
};

// ============================================================================
// TEXT GRADIENT COMPONENT
// ============================================================================

export const GradientText = ({ 
  children, 
  gradient = 'cyan', 
  className = '' 
}) => {
  const gradients = {
    cyan: 'linear-gradient(100deg, #00D4FF 0%, #00FFB3 55%, #FF6B35 100%)',
    orange: 'linear-gradient(100deg, #FF6B35 0%, #FF3D71 100%)',
    purple: 'linear-gradient(100deg, #A78BFA 0%, #8B5CF6 100%)',
    rose: 'linear-gradient(100deg, #F43F5E 0%, #EC4899 100%)',
  };

  return (
    <span
      className={className}
      style={{
        background: gradients[gradient],
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  );
};

// ============================================================================
// SKELETON LOADING COMPONENT
// ============================================================================

export const Skeleton = ({ className = '', variant = 'rect' }) => {
  return (
    <motion.div
      className={`${className} ${variant === 'circular' ? 'rounded-full' : 'rounded-lg'}`}
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// ============================================================================
// EXPORT ALL FOR EASY IMPORTING
// ============================================================================

export default {
  EASING,
  DURATION,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  scaleIn,
  slideUp,
  expandCenter,
  textReveal,
  useMagnetic,
  useParallax,
  useCountUp,
  TypingText,
  GradientBorderCard,
  FloatingOrb,
  GlassSurface,
  ProgressRing,
  Waveform,
  ScrollProgress,
  SpotlightCard,
  GradientText,
  Skeleton,
};

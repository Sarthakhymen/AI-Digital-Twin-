/**
 * AI Digital Twin Platform - Design Tokens
 * 
 * Premium color palette, typography, spacing, and effects
 * inspired by Linear, Stripe, Vercel, and Apple
 */

export const colors = {
  // Primary Backgrounds
  bg: {
    primary: '#07080C',        // Deep space black with blue undertone
    secondary: '#0D0F17',      // Slightly lighter for cards
    tertiary: '#151928',       // Elevated surfaces
    elevated: '#1E2338',       // Floating elements
  },

  // Accent Colors
  accent: {
    cyan: '#00D4FF',           // Primary action, intelligence
    emerald: '#00FFB3',        // Success, speed, growth
    orange: '#FF6B35',         // Energy, pro features
    purple: '#A78BFA',         // Analytics, depth
    rose: '#F43F5E',           // Alerts, passion
    indigo: '#6366F1',         // Secondary actions
  },

  // Text Hierarchy
  text: {
    primary: 'rgba(255,255,255,0.95)',
    secondary: 'rgba(255,255,255,0.65)',
    tertiary: 'rgba(255,255,255,0.45)',
    muted: 'rgba(255,255,255,0.30)',
    disabled: 'rgba(255,255,255,0.20)',
  },

  // Glass Effects
  glass: {
    surface: 'rgba(255,255,255,0.015)',
    surfaceStrong: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.06)',
    borderStrong: 'rgba(255,255,255,0.12)',
    blur: '20px',
  },

  // Gradients
  gradients: {
    hero: 'linear-gradient(100deg, #00D4FF 0%, #00FFB3 55%, #FF6B35 100%)',
    cyan: 'linear-gradient(135deg, #00D4FF 0%, #00FFB3 100%)',
    orange: 'linear-gradient(135deg, #FF6B35 0%, #FF3D71 100%)',
    purple: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
    pro: 'linear-gradient(120deg, #FF6B35 0%, #FF3D71 100%)',
  },

  // Shadows
  shadows: {
    subtle: '0 4px 12px rgba(0, 0, 0, 0.3)',
    normal: '0 8px 24px rgba(0, 0, 0, 0.4)',
    strong: '0 16px 48px rgba(0, 0, 0, 0.5)',
    glow: {
      cyan: '0 0 40px rgba(0,212,255,0.3)',
      orange: '0 0 40px rgba(255,107,53,0.3)',
      purple: '0 0 40px rgba(167,139,250,0.3)',
    },
  },

  // Borders
  borders: {
    subtle: '1px solid rgba(255,255,255,0.06)',
    normal: '1px solid rgba(255,255,255,0.12)',
    strong: '1px solid rgba(255,255,255,0.2)',
    focus: '1px solid rgba(0,212,255,0.5)',
    error: '1px solid rgba(244,63,94,0.5)',
  },
};

export const typography = {
  fonts: {
    primary: '"Inter", system-ui, -apple-system, sans-serif',
    secondary: '"Outfit", sans-serif',
    handwriting: '"Caveat", cursive',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },

  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  sizes: {
    xs: '0.75rem',       // 12px
    sm: '0.875rem',      // 14px
    base: '0.9375rem',   // 15px
    lg: '1.125rem',      // 18px
    xl: '1.25rem',       // 20px
    '2xl': '1.5rem',     // 24px
    '3xl': '1.875rem',   // 30px
    '4xl': '2.5rem',     // 40px
    '5xl': '3.25rem',    // 52px
    '6xl': '4rem',       // 64px
    '7xl': '4.6rem',     // 73.6px (hero)
  },

  tracking: {
    tight: '-0.03em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
    widest: '0.15em',
  },

  lineHeights: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
};

export const borderRadius = {
  none: '0',
  sm: '0.375rem',    // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.25rem',  // 20px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
};

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

export const transitions = {
  fast: '0.15s cubic-bezier(0.16, 1, 0.3, 1)',
  normal: '0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  slow: '0.5s cubic-bezier(0.22, 1, 0.36, 1)',
  spring: '0.4s cubic-bezier(0.5, 0, 0.3, 1.2)',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Export as CSS custom properties for global use
export const cssVariables = `
:root {
  /* Backgrounds */
  --bg-primary: ${colors.bg.primary};
  --bg-secondary: ${colors.bg.secondary};
  --bg-tertiary: ${colors.bg.tertiary};
  --bg-elevated: ${colors.bg.elevated};

  /* Accents */
  --accent-cyan: ${colors.accent.cyan};
  --accent-emerald: ${colors.accent.emerald};
  --accent-orange: ${colors.accent.orange};
  --accent-purple: ${colors.accent.purple};
  --accent-rose: ${colors.accent.rose};
  --accent-indigo: ${colors.accent.indigo};

  /* Text */
  --text-primary: ${colors.text.primary};
  --text-secondary: ${colors.text.secondary};
  --text-tertiary: ${colors.text.tertiary};
  --text-muted: ${colors.text.muted};
  --text-disabled: ${colors.text.disabled};

  /* Glass */
  --glass-surface: ${colors.glass.surface};
  --glass-border: ${colors.glass.border};
  --glass-blur: ${colors.glass.blur};

  /* Typography */
  --font-primary: ${typography.fonts.primary};
  --font-secondary: ${typography.fonts.secondary};
  --font-handwriting: ${typography.fonts.handwriting};
  --font-mono: ${typography.fonts.mono};

  /* Transitions */
  --transition-fast: ${transitions.fast};
  --transition-normal: ${transitions.normal};
  --transition-slow: ${transitions.slow};
}`;

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  zIndex,
  transitions,
  breakpoints,
  cssVariables,
};

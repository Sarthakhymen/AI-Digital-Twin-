import React from 'react';

const LogoIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="logo-rose" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F43F5E" />
        <stop offset="1" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="logo-silver" x1="24" y1="8" x2="8" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F8FAFC" />
        <stop offset="1" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    {/* Outer glow ring (subtle) */}
    <circle cx="16" cy="16" r="10" stroke="#F43F5E" strokeWidth="1" strokeOpacity="0.1" />
    {/* Left intersecting ring (Human) */}
    <path d="M20 16C20 19.866 16.866 23 13 23C9.13401 23 6 19.866 6 16C6 12.134 9.13401 9 13 9" stroke="url(#logo-rose)" strokeWidth="3" strokeLinecap="round" />
    {/* Right intersecting ring (Twin) */}
    <path d="M12 16C12 12.134 15.134 9 19 9C22.866 9 26 12.134 26 16C26 19.866 22.866 23 19 23" stroke="url(#logo-silver)" strokeWidth="3" strokeLinecap="round" />
    {/* Core intelligence spark */}
    <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" />
  </svg>
);

export default LogoIcon;

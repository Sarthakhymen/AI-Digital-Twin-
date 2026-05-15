import React from 'react';

const LogoIcon = ({ className = "w-8 h-8" }) => (
  <img 
    src="/logo.png" 
    alt="AI Digital Twin Logo" 
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

export default LogoIcon;

import React from 'react';

const LogoIcon = ({ className = "h-10 w-auto" }) => (
  <img 
    src="/logo.png" 
    alt="AI Digital Twin Logo" 
    className={className}
    style={{ 
      objectFit: 'contain',
      maxHeight: '100%',
      filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))'
    }}
  />
);

export default LogoIcon;

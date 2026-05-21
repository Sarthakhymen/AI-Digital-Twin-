import React, { useMemo } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { keyframes } from '@mui/system';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const blink = keyframes`
  0%, 42%, 44%, 100% { transform: scaleY(1); }
  43% { transform: scaleY(0.1); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
`;

const wave = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-10deg); }
`;

const talk = keyframes`
  0%, 100% { height: 4px; border-radius: 4px; }
  50% { height: 10px; border-radius: 6px; }
`;

const antenna = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const TwinRobotAvatar = ({ communicationStyle = {}, personalityProfile = {}, name = 'AI Twin' }) => {
  
  // Derive robot personality from communication style and personality profile
  const personality = useMemo(() => {
    let tone = (communicationStyle?.tone || 'professional').toLowerCase();
    let formality = (communicationStyle?.formality || 'neutral').toLowerCase();
    let verbosity = (communicationStyle?.verbosity || 'moderate').toLowerCase();

    // Check personalityProfile traits for dynamics
    let traitsStr = '';
    if (personalityProfile) {
      if (typeof personalityProfile === 'string') {
        traitsStr = personalityProfile;
      } else if (Array.isArray(personalityProfile)) {
        traitsStr = personalityProfile.join(' ');
      } else if (typeof personalityProfile === 'object') {
        traitsStr = JSON.stringify(personalityProfile);
      }
    }
    traitsStr = traitsStr.toLowerCase();

    // Dynamic traits mapping
    const isEnergetic = traitsStr.includes('energetic') || traitsStr.includes('enthusiastic') || traitsStr.includes('active') || traitsStr.includes('witty') || traitsStr.includes('attentive');
    const isCalm = traitsStr.includes('calm') || traitsStr.includes('analytical') || traitsStr.includes('thoughtful') || traitsStr.includes('professional') || traitsStr.includes('support');
    const isCreative = traitsStr.includes('creative') || traitsStr.includes('artistic') || traitsStr.includes('innovative') || traitsStr.includes('witty');
    const isWarm = traitsStr.includes('warm') || traitsStr.includes('empathetic') || traitsStr.includes('caring') || traitsStr.includes('friendly') || traitsStr.includes('helpful');

    // Eye color
    let eyeColor = '#6366F1'; // Default Indigo
    if (isWarm || tone === 'friendly') {
      eyeColor = '#10B981'; // Emerald
    } else if (isCreative) {
      eyeColor = '#06B6D4'; // Cyan
    } else if (isEnergetic) {
      eyeColor = '#EC4899'; // Rose/Pink
    } else if (tone === 'witty' || tone === 'humorous') {
      eyeColor = '#F59E0B'; // Amber
    }

    // Body gradient
    let bodyGradient = 'linear-gradient(135deg, #1e3a5f 0%, #2d4a7c 100%)'; // Default Dark Blue
    if (isCreative || formality === 'casual') {
      bodyGradient = 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'; // Violet/Pink
    } else if (isCalm || formality === 'formal') {
      bodyGradient = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'; // Slate/Steel
    } else if (isEnergetic) {
      bodyGradient = 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'; // Amber/Red
    }

    // Floating animation speed
    let animSpeed = '3s';
    if (isEnergetic || verbosity === 'verbose') {
      animSpeed = '1.8s';
    } else if (isCalm || verbosity === 'concise') {
      animSpeed = '4.5s';
    }

    // Mouth shape
    let mouthType = 'neutral';
    if (isWarm || tone === 'friendly') {
      mouthType = 'smile';
    } else if (isCreative || tone === 'casual') {
      mouthType = 'grin';
    }

    // Accent/glow color
    let glowColor = 'rgba(99, 102, 241, 0.4)';
    if (isWarm || tone === 'friendly') {
      glowColor = 'rgba(16, 185, 129, 0.4)';
    } else if (isCreative) {
      glowColor = 'rgba(6, 182, 212, 0.4)';
    } else if (isEnergetic) {
      glowColor = 'rgba(236, 72, 153, 0.4)';
    }

    return { eyeColor, bodyGradient, animSpeed, mouthType, glowColor, tone, formality, verbosity };
  }, [communicationStyle, personalityProfile]);

  const traits = useMemo(() => {
    const items = [];
    if (personality.tone) items.push({ label: personality.tone, color: personality.eyeColor });
    if (personality.formality) items.push({ label: personality.formality, color: '#8B5CF6' });
    if (personality.verbosity) items.push({ label: personality.verbosity, color: '#F59E0B' });
    
    // Add personality profile traits
    if (personalityProfile) {
      if (typeof personalityProfile === 'string') {
        personalityProfile.split(',').forEach(trait => {
          const trimmed = trait.trim();
          if (trimmed) items.push({ label: trimmed, color: '#14B8A6' });
        });
      } else if (Array.isArray(personalityProfile)) {
        personalityProfile.forEach(trait => {
          if (typeof trait === 'string') {
            items.push({ label: trait.trim(), color: '#14B8A6' });
          }
        });
      } else if (typeof personalityProfile === 'object') {
        Object.entries(personalityProfile).forEach(([key, value]) => {
          if (typeof value === 'string') {
            items.push({ label: `${key}: ${value}`, color: '#14B8A6' });
          } else if (Array.isArray(value)) {
            items.push({ label: `${key}: ${value.join(', ')}`, color: '#14B8A6' });
          }
        });
      }
    }
    return items;
  }, [personality, personalityProfile]);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
      
      {/* Robot Container */}
      <Box sx={{ 
        animation: `${float} ${personality.animSpeed} ease-in-out infinite`,
        position: 'relative',
        cursor: 'pointer',
        '&:hover .robot-arm-right': { animation: `${wave} 0.8s ease-in-out` },
        '&:hover .robot-glow': { opacity: 1 }
      }}>
        
        {/* Glow effect behind robot */}
        <Box className="robot-glow" sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 140, height: 140, borderRadius: '50%',
          background: `radial-gradient(circle, ${personality.glowColor} 0%, transparent 70%)`,
          opacity: 0.6, transition: 'opacity 0.3s',
          filter: 'blur(10px)'
        }} />

        {/* Antenna */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: -0.5, position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            width: 3, height: 16, 
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '2px'
          }} />
          <Box sx={{ 
            position: 'absolute', top: -4, 
            width: 10, height: 10, borderRadius: '50%',
            background: personality.eyeColor,
            animation: `${antenna} 2s ease-in-out infinite`,
            boxShadow: `0 0 10px ${personality.eyeColor}`
          }} />
        </Box>

        {/* Head */}
        <Box sx={{ 
          width: 80, height: 70, 
          background: personality.bodyGradient,
          borderRadius: '20px 20px 16px 16px',
          border: `2px solid rgba(255,255,255,0.1)`,
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          animation: `${pulse} 3s ease-in-out infinite`,
          overflow: 'hidden'
        }}>
          {/* Face screen effect */}
          <Box sx={{
            position: 'absolute', inset: 4,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px 16px 12px 12px',
          }} />
          
          {/* Eyes */}
          <Box sx={{ display: 'flex', gap: 2.5, mb: 1, position: 'relative', zIndex: 1 }}>
            {/* Left eye */}
            <Box sx={{ 
              width: 14, height: 14, borderRadius: '50%',
              background: personality.eyeColor,
              boxShadow: `0 0 8px ${personality.eyeColor}, inset 0 0 4px rgba(255,255,255,0.3)`,
              animation: `${blink} 4s ease-in-out infinite`,
            }}>
              <Box sx={{ 
                width: 5, height: 5, borderRadius: '50%', 
                background: 'rgba(255,255,255,0.8)',
                mt: '2px', ml: '3px'
              }} />
            </Box>
            {/* Right eye */}
            <Box sx={{ 
              width: 14, height: 14, borderRadius: '50%',
              background: personality.eyeColor,
              boxShadow: `0 0 8px ${personality.eyeColor}, inset 0 0 4px rgba(255,255,255,0.3)`,
              animation: `${blink} 4s ease-in-out infinite 0.1s`,
            }}>
              <Box sx={{ 
                width: 5, height: 5, borderRadius: '50%', 
                background: 'rgba(255,255,255,0.8)',
                mt: '2px', ml: '3px'
              }} />
            </Box>
          </Box>
          
          {/* Mouth */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {personality.mouthType === 'smile' ? (
              <Box sx={{ 
                width: 20, height: 10, 
                borderBottom: `3px solid ${personality.eyeColor}`,
                borderRadius: '0 0 10px 10px',
                opacity: 0.8
              }} />
            ) : personality.mouthType === 'grin' ? (
              <Box sx={{ 
                width: 16, height: 6, 
                background: personality.eyeColor,
                borderRadius: '6px',
                animation: `${talk} 1.5s ease-in-out infinite`,
                opacity: 0.7
              }} />
            ) : (
              <Box sx={{ 
                width: 14, height: 4, 
                background: personality.eyeColor,
                borderRadius: '4px',
                opacity: 0.6
              }} />
            )}
          </Box>
        </Box>

        {/* Neck */}
        <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            width: 16, height: 8, 
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '0 0 4px 4px'
          }} />
        </Box>

        {/* Body */}
        <Box sx={{ 
          width: 72, height: 50, mx: 'auto',
          background: personality.bodyGradient,
          borderRadius: '8px 8px 16px 16px',
          border: '2px solid rgba(255,255,255,0.08)',
          position: 'relative', zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* Chest light */}
          <Box sx={{ 
            width: 12, height: 12, borderRadius: '50%',
            background: personality.eyeColor,
            opacity: 0.6,
            animation: `${antenna} 2s ease-in-out infinite 1s`,
            boxShadow: `0 0 12px ${personality.eyeColor}`
          }} />
          
          {/* Arms */}
          {/* Left arm */}
          <Box sx={{
            position: 'absolute', left: -18, top: 6,
            width: 14, height: 34, 
            background: personality.bodyGradient,
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)',
            transformOrigin: 'top center'
          }} />
          {/* Right arm */}
          <Box className="robot-arm-right" sx={{
            position: 'absolute', right: -18, top: 6,
            width: 14, height: 34, 
            background: personality.bodyGradient,
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)',
            transformOrigin: 'top center'
          }} />
        </Box>
      </Box>

      {/* Name */}
      <Typography variant="subtitle1" sx={{ 
        color: '#fff', fontWeight: 700, fontFamily: '"Outfit", sans-serif',
        textAlign: 'center', mt: 1
      }}>
        {name}
      </Typography>
      
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: -1 }}>
        Personality-driven AI Avatar
      </Typography>

      {/* Trait chips */}
      {traits.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, justifyContent: 'center', mt: 1 }}>
          {traits.map((trait, i) => (
            <Chip 
              key={i}
              label={trait.label}
              size="small"
              sx={{ 
                bgcolor: `${trait.color}22`, 
                color: trait.color,
                border: `1px solid ${trait.color}44`,
                fontSize: '11px', fontWeight: 600,
                textTransform: 'capitalize',
                height: 24
              }} 
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TwinRobotAvatar;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Mini sparkline component using SVG
const Sparkline = ({ data = [30, 45, 35, 50, 42, 55, 48, 60, 52, 65], color = '#5B8CFF', width = 80, height = 28 }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const pathD = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const totalLength = 200;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gradient fill area */}
      <defs>
        <linearGradient id={`spark-fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area under curve */}
      <path
        d={`${pathD} L ${padding + (width - padding * 2)} ${height} L ${padding} ${height} Z`}
        fill={`url(#spark-fill-${color.replace('#', '')})`}
        opacity={animated ? 1 : 0}
        style={{ transition: 'opacity 0.8s ease' }}
      />
      {/* Line */}
      <path
        d={pathD}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        strokeDashoffset={animated ? 0 : totalLength}
        style={{ transition: `stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)` }}
      />
      {/* End dot */}
      {animated && (
        <circle
          cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
          cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)}
          r="2"
          fill={color}
          style={{ opacity: 0 }}
        >
          <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" />
        </circle>
      )}
    </svg>
  );
};

const StatCard = ({ title, value, limit, icon, color = '#5B8CFF', trend, sparkData }) => {
  const isPositive = trend >= 0;

  const formatValue = (val) => {
    if (typeof val === 'number' && val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val;
  };

  // Generate pseudo sparkline data if not provided
  const defaultSparkData = sparkData || (() => {
    const base = typeof value === 'number' ? value : 20;
    return Array.from({ length: 10 }, (_, i) =>
      Math.max(0, base * 0.6 + Math.random() * base * 0.8)
    );
  })();

  return (
    <motion.div
      className="kpi-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover="hovered"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      variants={{
        hovered: {
          y: -2,
          transition: { type: 'spring', stiffness: 400, damping: 25 },
        }
      }}
      style={{ padding: '20px', cursor: 'default' }}
    >
      {/* Accent line */}
      <div
        className="kpi-accent-line"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Header: Icon + Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '9px',
              background: `${color}10`,
              border: `1px solid ${color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 16, color: color } })}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500, fontSize: '0.8rem', fontFamily: '"Inter", sans-serif', letterSpacing: '0.01em' }}>
            {title}
          </span>
        </div>

        {/* Sparkline */}
        <Sparkline data={defaultSparkData} color={color} />
      </div>

      {/* Value Area */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.85rem',
              color: '#ffffff',
              lineHeight: 1,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-0.03em',
            }}
          >
            {formatValue(value)}
          </span>
          {limit !== undefined && (
            <span
              style={{
                fontWeight: 500,
                fontSize: '0.95rem',
                color: 'rgba(255,255,255,0.2)',
                lineHeight: 1,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              / {limit}
            </span>
          )}
        </div>

        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '6px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                color: isPositive ? '#18C37E' : '#F06060',
                background: isPositive ? 'rgba(24, 195, 126, 0.08)' : 'rgba(240, 96, 96, 0.08)',
                padding: '2px 6px',
                borderRadius: '5px',
                fontSize: '0.68rem',
                fontWeight: 700,
              }}
            >
              {isPositive ? <TrendingUp size={11} strokeWidth={2.5} /> : <TrendingDown size={11} strokeWidth={2.5} />}
              {Math.abs(trend)}%
            </div>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', fontWeight: 500 }}>
              vs last week
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;

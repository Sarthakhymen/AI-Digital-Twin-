import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip-premium" style={{ padding: '10px 14px' }}>
      <div style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.65rem', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#5B8CFF', boxShadow: '0 0 8px rgba(91, 140, 255, 0.4)' }} />
        <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>
          {payload[0].value} conversations
        </span>
      </div>
    </div>
  );
};

const ConversationChart = ({ data }) => {
  const [period, setPeriod] = useState('7d');

  const periods = [
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: '90d', label: '90D' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(23, 27, 36, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Subtle top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #5B8CFF 30%, #18C37E 70%, transparent)',
        opacity: 0.4,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em', color: '#fff', marginBottom: '2px' }}>
            Conversation Trends
          </h3>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 500 }}>
            Messages over time
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 14, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, #5B8CFF, #18C37E)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600 }}>Messages</span>
          </div>

          {/* Period toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '8px',
            padding: '2px',
            gap: '2px',
          }}>
            {periods.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  background: period === p.key ? 'rgba(91, 140, 255, 0.12)' : 'transparent',
                  color: period === p.key ? '#5B8CFF' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.02em',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorConvPremium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B8CFF" stopOpacity={0.2} />
              <stop offset="50%" stopColor="#5B8CFF" stopOpacity={0.05} />
              <stop offset="95%" stopColor="#5B8CFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.03)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)', fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)', fontWeight: 500 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(91, 140, 255, 0.2)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="conversations"
            stroke="#5B8CFF"
            strokeWidth={2}
            fill="url(#colorConvPremium)"
            dot={false}
            activeDot={{
              r: 4,
              fill: '#5B8CFF',
              stroke: '#0F1117',
              strokeWidth: 2,
              style: { boxShadow: '0 0 8px rgba(91, 140, 255, 0.4)' }
            }}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ConversationChart;

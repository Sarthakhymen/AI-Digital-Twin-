import React from 'react';
import { Chat, Business, SmartToy, CalendarCheck, UserPlus, Rocket } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const activityConfig = {
  conversation: { icon: Chat, color: '#5B8CFF', bg: 'rgba(91, 140, 255, 0.08)', border: 'rgba(91, 140, 255, 0.15)', label: 'Conversation' },
  business: { icon: Business, color: '#F7B955', bg: 'rgba(247, 185, 85, 0.08)', border: 'rgba(247, 185, 85, 0.15)', label: 'Business' },
  twin: { icon: SmartToy, color: '#18C37E', bg: 'rgba(24, 195, 126, 0.08)', border: 'rgba(24, 195, 126, 0.15)', label: 'Twin' },
  lead: { icon: UserPlus, color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.08)', border: 'rgba(34, 211, 238, 0.15)', label: 'Lead' },
  appointment: { icon: CalendarCheck, color: '#5B8CFF', bg: 'rgba(91, 140, 255, 0.08)', border: 'rgba(91, 140, 255, 0.15)', label: 'Appointment' },
  campaign: { icon: Rocket, color: '#F06060', bg: 'rgba(240, 96, 96, 0.08)', border: 'rgba(240, 96, 96, 0.15)', label: 'Campaign' },
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const RecentActivity = ({ activities }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(23, 27, 36, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Subtle top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #18C37E 50%, transparent)',
        opacity: 0.4,
      }} />

      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em', color: '#fff', marginBottom: '2px' }}>
            Live Activity
          </h3>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 500 }}>
            Real-time workforce events
          </span>
        </div>
        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#18C37E',
            boxShadow: '0 0 6px rgba(24, 195, 126, 0.4)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: '#18C37E',
              animation: 'status-pulse 2s ease-in-out infinite',
            }} />
          </div>
          <span style={{ color: 'rgba(24, 195, 126, 0.6)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Live
          </span>
        </div>
      </div>

      {/* Feed Timeline */}
      <div style={{ padding: '8px 0' }}>
        <AnimatePresence>
          {activities?.length > 0 ? (
            activities.map((activity, index) => {
              const config = activityConfig[activity.type] || activityConfig.conversation;
              const Icon = config.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Timeline connector */}
                  <div style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                    paddingTop: '2px',
                  }}>
                    {/* Icon circle */}
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '10px',
                      background: config.bg,
                      border: `1px solid ${config.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: 1,
                    }}>
                      <Icon sx={{ fontSize: 16, color: config.color }} />
                    </div>
                    {/* Timeline line */}
                    {index < activities.length - 1 && (
                      <div style={{
                        width: '1px',
                        flex: 1,
                        minHeight: '16px',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                        marginTop: '4px',
                      }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0, paddingBottom: index < activities.length - 1 ? '8px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '2px' }}>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.85)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {activity.description}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        color: config.color,
                        opacity: 0.7,
                        letterSpacing: '0.02em',
                      }}>
                        {config.label}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.06)' }}>·</span>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.25)',
                      }}>
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <SmartToy sx={{ fontSize: 22, color: 'rgba(255,255,255,0.15)' }} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', fontWeight: 500 }}>
                No recent activity
              </p>
              <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.72rem', fontWeight: 400, marginTop: '4px' }}>
                Activity will appear here as your twins work
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecentActivity;

import React from 'react';

interface TechnologyBadgeProps {
  name: string;
}

export const TechnologyBadge: React.FC<TechnologyBadgeProps> = ({ name }) => {
  // Brand color mapping based on technology name
  const getBadgeStyle = (tech: string) => {
    const t = tech.toLowerCase();
    if (t.includes('flutter')) return { bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' };
    if (t.includes('firebase')) return { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' };
    if (t.includes('supabase')) return { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', color: '#10b981' };
    if (t.includes('react')) return { bg: 'rgba(0, 216, 255, 0.12)', border: 'rgba(0, 216, 255, 0.3)', color: '#00d8ff' };
    if (t.includes('node')) return { bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' };
    if (t.includes('tmdb')) return { bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', color: '#a78bfa' };
    if (t.includes('admob')) return { bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.3)', color: '#fb923c' };
    if (t.includes('pdf')) return { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)', color: '#f87171' };
    if (t.includes('cloud')) return { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' };
    
    return { bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.25)', color: '#94a3b8' };
  };

  const style = getBadgeStyle(name);

  return (
    <span
      className="tech-badge"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.color,
      }}
    >
      <span className="badge-dot" style={{ backgroundColor: style.color }} />
      {name}
      <style>{`
        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          border: 1px solid;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          white-space: nowrap;
          transition: transform var(--transition-fast);
        }
        .tech-badge:hover {
          transform: translateY(-1px);
        }
        .badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
      `}</style>
    </span>
  );
};

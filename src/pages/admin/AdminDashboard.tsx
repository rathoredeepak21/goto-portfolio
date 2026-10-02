import React, { useState } from 'react';
import { Project, ApkRelease } from '../../types';
import { Layers, DownloadCloud, Users, TrendingUp, Edit2, Plus, ArrowUpRight } from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  apkReleases: ApkRelease[];
  trafficStats: {
    totalVisitors: number;
    totalDownloads: number;
    chartData: Array<{ label: string; value: number }>;
  };
  onEditProject: (project: Project) => void;
  onAddNewProject: () => void;
  onNavigateToSection: (section: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  apkReleases,
  trafficStats,
  onEditProject,
  onAddNewProject,
  onNavigateToSection,
}) => {
  const [trafficPeriod, setTrafficPeriod] = useState<'day' | 'week' | 'month'>('month');

  // Multiplier for previewing day/week/month chart switch
  const periodMultiplier = trafficPeriod === 'day' ? 0.3 : trafficPeriod === 'week' ? 0.6 : 1;

  // Render SVG Smooth Bezier Line Chart for Website Traffic matching Panel 10
  const chartPoints = trafficStats.chartData.map((d) => ({
    label: d.label,
    value: Math.round(d.value * periodMultiplier),
  }));

  const maxVal = Math.max(...chartPoints.map((p) => p.value), 700);
  const minVal = 0;
  const svgWidth = 460;
  const svgHeight = 180;
  const paddingX = 35;
  const paddingY = 25;

  const getCoordinates = () => {
    return chartPoints.map((pt, i) => {
      const x = paddingX + (i / (chartPoints.length - 1)) * (svgWidth - paddingX * 2);
      const y = svgHeight - paddingY - (pt.value / maxVal) * (svgHeight - paddingY * 2);
      return { x, y, pt };
    });
  };

  const coords = getCoordinates();

  // Create smooth bezier SVG path
  let pathD = '';
  if (coords.length > 0) {
    pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const midX = (p0.x + p1.x) / 2;
      pathD += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  const fillD = coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`
    : '';

  return (
    <div className="admin-dashboard-view">
      {/* Welcome Title */}
      <div className="dashboard-title-banner">
        <div>
          <h1 className="dashboard-main-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, Admin!</p>
        </div>
        <button onClick={onAddNewProject} className="btn btn-primary add-app-quick-btn">
          <Plus size={18} />
          <span>Add New App</span>
        </button>
      </div>

      {/* 3 Metric Cards Matching Panel 10 */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card neon-card">
          <div className="metric-header-row">
            <span className="metric-label">Total Apps</span>
            <div className="metric-icon-box cyan-metric">
              <Layers size={20} color="#38bdf8" />
            </div>
          </div>
          <div className="metric-val-row">
            <span className="metric-number">{projects.length}</span>
            <span className="metric-pill pill-cyan">Active</span>
          </div>
        </div>

        <div className="metric-card neon-card">
          <div className="metric-header-row">
            <span className="metric-label">Total Downloads</span>
            <div className="metric-icon-box purple-metric">
              <DownloadCloud size={20} color="#a855f7" />
            </div>
          </div>
          <div className="metric-val-row">
            <span className="metric-number">{trafficStats.totalDownloads.toLocaleString()}</span>
            <span className="metric-pill pill-purple">+18% MoM</span>
          </div>
        </div>

        <div className="metric-card neon-card">
          <div className="metric-header-row">
            <span className="metric-label">Total Visitors</span>
            <div className="metric-icon-box green-metric">
              <Users size={20} color="#10b981" />
            </div>
          </div>
          <div className="metric-val-row">
            <span className="metric-number">{trafficStats.totalVisitors.toLocaleString()}</span>
            <span className="metric-pill pill-green">+24% this week</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Apps & Website Traffic */}
      <div className="dashboard-main-grid">
        {/* Left: Recent Apps List */}
        <div className="dashboard-col recent-apps-col neon-card">
          <div className="col-header-row">
            <h3 className="col-title">Recent Apps</h3>
            <button onClick={() => onNavigateToSection('apps')} className="view-all-link">
              <span>View All</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="recent-apps-list">
            {projects.slice(0, 5).map((project) => {
              const realIcon =
                project.icon_url ||
                project.iconUrl ||
                (project.icon && (project.icon.startsWith('http') || project.icon.startsWith('data:') || project.icon.startsWith('/'))
                  ? project.icon
                  : null);

              return (
                <div key={project.id} className="recent-app-item">
                  <div className="recent-app-info">
                    {realIcon ? (
                      <div className="recent-app-icon has-real-icon">
                        <img src={realIcon} alt={project.title} className="recent-app-icon-img" />
                      </div>
                    ) : (
                      <div className="recent-app-icon" style={{ background: project.iconBg || 'var(--card-bg)' }}>
                        <Layers size={18} color="#ffffff" />
                      </div>
                    )}
                    <div>
                      <h4 className="recent-app-name">{project.title}</h4>
                      <span className="recent-app-date">{project.lastUpdated} &bull; {project.version}</span>
                    </div>
                  </div>

                <div className="recent-app-actions">
                  <button
                    onClick={() => onEditProject(project)}
                    className="quick-edit-btn"
                    title="Edit App"
                  >
                    <Edit2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Right: Website Traffic Chart matching Panel 10 */}
        <div className="dashboard-col traffic-col neon-card">
          <div className="col-header-row">
            <div>
              <h3 className="col-title">Website Traffic</h3>
              <span className="chart-sub-label">Visitor trends over time</span>
            </div>

            {/* Time Filter Tabs */}
            <div className="chart-period-tabs">
              <button
                className={`period-btn ${trafficPeriod === 'day' ? 'period-active' : ''}`}
                onClick={() => setTrafficPeriod('day')}
              >
                Day
              </button>
              <button
                className={`period-btn ${trafficPeriod === 'week' ? 'period-active' : ''}`}
                onClick={() => setTrafficPeriod('week')}
              >
                Week
              </button>
              <button
                className={`period-btn ${trafficPeriod === 'month' ? 'period-active' : ''}`}
                onClick={() => setTrafficPeriod('month')}
              >
                Month
              </button>
            </div>
          </div>

          {/* SVG Smooth Curve Line Chart */}
          <div className="chart-wrapper">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="neon-traffic-chart">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="var(--border-subtle)" />
              <line x1={paddingX} y1={(svgHeight - paddingY) / 2} x2={svgWidth - paddingX} y2={(svgHeight - paddingY) / 2} stroke="var(--border-subtle)" strokeDasharray="4 4" />

              {/* Area Fill */}
              {fillD && <path d={fillD} fill="url(#chartGradient)" />}

              {/* Neon Curve Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#chartLineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 6px rgba(168, 85, 247, 0.4))"
                />
              )}

              {/* Coordinate Data Dots */}
              {coords.map((c, i) => (
                <g key={i}>
                  <circle cx={c.x} cy={c.y} r="4.5" fill="#c084fc" stroke="var(--bg-card)" strokeWidth="2" />
                  <text
                    x={c.x}
                    y={svgHeight - 8}
                    fill="var(--text-muted)"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontWeight="600"
                  >
                    {c.pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .dashboard-title-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .dashboard-main-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .dashboard-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        /* 3 Metrics Grid */
        .dashboard-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .metric-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .metric-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .metric-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .metric-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
        }

        .cyan-metric {
          background: rgba(56, 189, 248, 0.1);
          border-color: rgba(56, 189, 248, 0.25);
        }

        .purple-metric {
          background: rgba(168, 85, 247, 0.1);
          border-color: rgba(168, 85, 247, 0.25);
        }

        .green-metric {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.25);
        }

        .metric-val-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }

        .metric-number {
          font-size: 2.2rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-main);
          line-height: 1;
        }

        .metric-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
        }

        .pill-cyan {
          background: rgba(56, 189, 248, 0.12);
          color: var(--neon-cyan);
        }

        .pill-purple {
          background: rgba(168, 85, 247, 0.12);
          color: var(--neon-purple);
        }

        .pill-green {
          background: rgba(16, 185, 129, 0.12);
          color: var(--neon-emerald);
        }

        /* Main Grid */
        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 1.75rem;
        }

        .dashboard-col {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .col-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .col-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .chart-sub-label {
          font-size: 0.8rem;
          color: var(--text-dim);
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: var(--neon-cyan);
          font-weight: 600;
        }

        .recent-apps-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .recent-app-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          transition: background 0.2s ease;
        }

        .recent-app-item:hover {
          background: rgba(56, 189, 248, 0.08);
        }

        .recent-app-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .recent-app-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .recent-app-icon.has-real-icon {
          background: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.12);
          overflow: hidden;
          padding: 0;
        }

        .recent-app-icon-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: inherit;
        }

        .recent-app-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .recent-app-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .quick-edit-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .quick-edit-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
        }

        /* Chart */
        .chart-period-tabs {
          display: flex;
          gap: 0.35rem;
          background: var(--bg-tertiary);
          padding: 0.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .period-btn {
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .period-btn:hover {
          color: var(--text-main);
        }

        .period-active {
          background: var(--neon-cyan);
          color: #ffffff;
          font-weight: 700;
        }

        .chart-wrapper {
          width: 100%;
          padding-top: 1rem;
        }

        .neon-traffic-chart {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        @media (max-width: 960px) {
          .dashboard-metrics-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

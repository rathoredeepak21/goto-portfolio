import React from 'react';
import { WebsiteContent, Technology } from '../types';
import { TechnologyCard } from '../components/TechnologyCard';
import { Target, Zap, UserCheck, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  content: WebsiteContent['about'];
  skills: Technology[];
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  content,
  skills,
  onNavigate,
}) => {
  const getHighlightIcon = (iconName: string) => {
    switch (iconName) {
      case 'target':
        return <Target size={20} color="#38bdf8" />;
      case 'zap':
        return <Zap size={20} color="#f59e0b" />;
      case 'user':
        return <UserCheck size={20} color="#10b981" />;
      case 'book-open':
      default:
        return <BookOpen size={20} color="#a855f7" />;
    }
  };

  // Get active technologies for About page (take top 8)
  const displayTechnologies = (skills || [])
    .filter((t) => t.is_active)
    .slice(0, 8);

  return (
    <div className="about-page-view section-spacing">
      <div className="content-wrapper">
        {/* Top Header Section */}
        <div className="section-header">
          <span className="section-badge">
            <Sparkles size={14} />
            <span>Profile</span>
          </span>
          <h1 className="section-title">{content.badge || 'About Me'}</h1>
          <p className="section-subtitle gradient-text-cyan-purple" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            {content.heading || 'Turning Ideas into Real Apps'}
          </p>
        </div>

        {/* Two-Column About Grid */}
        <div className="about-grid">
          {/* Left Column: Bio & Highlight Badges */}
          <div className="about-left-col">
            <p className="about-bio-text">{content.description}</p>

            <div className="about-highlights-list">
              {content.highlights.map((hl) => (
                <div key={hl.id} className="highlight-item neon-card">
                  <div className="hl-icon-box">{getHighlightIcon(hl.icon)}</div>
                  <span className="hl-title">{hl.title}</span>
                </div>
              ))}
            </div>

            <div className="about-action-row">
              <button onClick={() => onNavigate('contact')} className="btn btn-primary">
                <span>Let's Discuss a Project</span>
              </button>
            </div>
          </div>

          {/* Right Column: Avatar + Neon Ring + Rahul Signature */}
          <div className="about-right-col">
            <div className="avatar-frame-outer">
              <div className="avatar-glow-ring" />
              <div className="avatar-inner">
                <img
                  src={content.avatarUrl}
                  alt={content.authorName || 'Rahul'}
                  className="avatar-image"
                />
              </div>
            </div>

            {/* Signature Area matching reference */}
            <div className="signature-container">
              <span className="signature-quote">{content.signatureText || "Let's Build Something Great!"}</span>
              <span className="signature-handwritten">{content.authorName || 'Rahul'}</span>
            </div>
          </div>
        </div>

        {/* Technologies I Use Section */}
        {displayTechnologies.length > 0 && (
          <div className="tech-use-section">
            <div className="section-header" style={{ marginBottom: '2.5rem' }}>
              <h2 className="tech-use-title">Technologies I Use</h2>
              <p className="section-subtitle">Official technology brand stacks and frameworks</p>
            </div>

            <div className="tech-use-grid">
              {displayTechnologies.map((tech) => (
                <TechnologyCard
                  key={tech.id}
                  technology={tech}
                  onClick={() => onNavigate('skills')}
                />
              ))}
            </div>

            <div className="about-skills-btn-row">
              <button onClick={() => onNavigate('skills')} className="btn btn-secondary">
                <span>Explore All Skills & Tech</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3.5rem;
          align-items: center;
          margin-bottom: 5rem;
        }

        .about-bio-text {
          font-size: 1.15rem;
          line-height: 1.75;
          color: var(--text-main);
          margin-bottom: 2rem;
        }

        .about-highlights-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2.25rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
        }

        .hl-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hl-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .about-right-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .avatar-frame-outer {
          position: relative;
          width: 260px;
          height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .avatar-glow-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--grad-primary);
          filter: blur(14px);
          opacity: 0.7;
          animation: spinGlow 12s linear infinite;
        }

        .avatar-inner {
          position: relative;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #0d1629;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
          z-index: 2;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .signature-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .signature-quote {
          font-size: 1.1rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .signature-handwritten {
          font-family: var(--font-signature);
          font-size: 2.4rem;
          color: var(--neon-cyan);
          letter-spacing: 0.05em;
          text-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
          transform: rotate(-3deg);
        }

        /* Technologies I Use Grid */
        .tech-use-section {
          padding-top: 2rem;
          border-top: 1px solid var(--border-subtle);
        }

        .tech-use-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-align: center;
        }

        .tech-use-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .about-skills-btn-row {
          display: flex;
          justify-content: center;
          margin-top: 2.5rem;
        }

        .tech-card {
          padding: 1.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .tech-card:hover {
          transform: translateY(-5px);
        }

        .tech-icon-container {
          width: 58px;
          height: 58px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .tech-txt-icon {
          font-size: 1.2rem;
          font-weight: 800;
          font-family: var(--font-mono);
        }

        .tech-card-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .tech-card-sub {
          font-size: 0.78rem;
          color: var(--text-dim);
        }

        @keyframes spinGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
          .about-right-col {
            order: -1;
            margin-bottom: 2rem;
          }
          .tech-use-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 560px) {
          .about-highlights-list {
            grid-template-columns: 1fr;
          }
          .tech-use-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

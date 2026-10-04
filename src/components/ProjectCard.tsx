import React from 'react';
import { Project } from '../types';
import { PlatformBadge } from './PlatformBadge';
import { Home, Music, Film, Send, MessageCircle, Disc, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (slug: string) => void;
  featuredOnly?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  if (!project) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'home':
        return <Home size={26} color="#ffffff" />;
      case 'music':
        return <Music size={26} color="#ffffff" />;
      case 'film':
        return <Film size={26} color="#ffffff" />;
      case 'send':
        return <Send size={26} color="#ffffff" />;
      case 'message-circle':
        return <MessageCircle size={26} color="#ffffff" />;
      case 'disc':
        return <Disc size={26} color="#ffffff" />;
      default:
        return <Home size={26} color="#ffffff" />;
    }
  };

  const platforms =
    project.platforms && project.platforms.length > 0
      ? project.platforms
      : project.category === 'web'
      ? ['Web Application']
      : ['Android App'];

  const realIcon =
    project.icon_url ||
    project.iconUrl ||
    (project.icon && (project.icon.startsWith('http') || project.icon.startsWith('data:') || project.icon.startsWith('/'))
      ? project.icon
      : null);

  return (
    <div className="project-card neon-card" onClick={() => onViewDetails(project.slug)}>
      {/* Top Card Section: App Icon + Name + Description */}
      <div className="card-header-row">
        {realIcon ? (
          <div className="app-icon-container has-real-icon">
            <img src={realIcon} alt={project.title} className="app-icon-real-img" />
          </div>
        ) : (
          <div className="app-icon-container" style={{ background: project.iconBg || 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            {renderIcon(project.icon || 'home')}
          </div>
        )}
        <div className="app-titles">
          <div className="title-row">
            <h3 className="project-title">{project.title}</h3>
            {project.featured && <span className="featured-tag">Featured</span>}
          </div>
          <p className="project-subtitle">{project.subtitle || project.shortDescription}</p>
        </div>
      </div>

      {/* Platform / Application Type Badges (Replaced Technology Tags) */}
      <div className="card-platforms-row">
        {platforms.map((platform) => (
          <PlatformBadge key={platform} name={platform} size="small" />
        ))}
      </div>

      {/* Bottom Action Footer */}
      <div className="card-footer-action">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(project.slug);
          }}
          className="btn-view-details"
        >
          <span>View Details</span>
          <ArrowRight size={15} className="arrow-icon" />
        </button>
      </div>

      <style>{`
        .project-card {
          padding: 1.6rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          position: relative;
          min-height: 200px;
        }

        .card-header-row {
          display: flex;
          align-items: flex-start;
          gap: 1.1rem;
        }

        .app-icon-container {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
          transition: transform var(--transition-fast);
        }

        .app-icon-container.has-real-icon {
          background: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.12);
          overflow: hidden;
          padding: 0;
        }

        .app-icon-real-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: inherit;
        }

        .project-card:hover .app-icon-container {
          transform: scale(1.08) rotate(-2deg);
        }

        .app-titles {
          flex: 1;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .project-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .featured-tag {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          background: rgba(168, 85, 247, 0.15);
          color: var(--neon-purple);
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .project-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: 0.35rem;
          line-height: 1.4;
        }

        .card-platforms-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          align-items: center;
          margin: 1.25rem 0 1rem;
        }

        .card-footer-action {
          display: flex;
          justify-content: flex-end;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .btn-view-details {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--neon-cyan);
          transition: all var(--transition-fast);
        }

        .arrow-icon {
          transition: transform 0.2s ease;
        }

        .btn-view-details:hover {
          color: #ffffff;
        }

        .project-card:hover .arrow-icon {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};

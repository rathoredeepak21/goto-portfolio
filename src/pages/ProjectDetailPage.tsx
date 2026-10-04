import React from 'react';
import { Project } from '../types';
import { DownloadButtons } from '../components/DownloadButtons';
import { PlatformBadge } from '../components/PlatformBadge';
import { TechnologyBadge } from '../components/TechnologyBadge';
import { ScreenshotGallery } from '../components/ScreenshotGallery';
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  HardDrive,
  Tag,
  Home,
  Music,
  Film,
  Send,
  MessageCircle,
  Disc,
} from 'lucide-react';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onDownloadApk?: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  onBack,
  onDownloadApk,
}) => {
  if (!project) {
    return (
      <div className="project-detail-view section-spacing">
        <div className="content-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#f8fafc' }}>Project Not Found</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>The requested project could not be found or has been removed.</p>
          <button onClick={onBack} className="back-link-btn" style={{ margin: '0 auto', display: 'inline-flex' }}>
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </button>
        </div>
      </div>
    );
  }

  const renderIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'home':
        return <Home size={34} color="#ffffff" />;
      case 'music':
        return <Music size={34} color="#ffffff" />;
      case 'film':
        return <Film size={34} color="#ffffff" />;
      case 'send':
        return <Send size={34} color="#ffffff" />;
      case 'message-circle':
        return <MessageCircle size={34} color="#ffffff" />;
      case 'disc':
        return <Disc size={34} color="#ffffff" />;
      default:
        return <Home size={34} color="#ffffff" />;
    }
  };

  const platforms =
    project.platforms && project.platforms.length > 0
      ? project.platforms
      : project.category === 'web'
      ? ['Web Application']
      : ['Android App'];

  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const features = Array.isArray(project.features) ? project.features : [];
  const screenshots = Array.isArray(project.screenshots) ? project.screenshots : [];

  const realIcon =
    project.icon_url ||
    project.iconUrl ||
    (project.icon && (project.icon.startsWith('http') || project.icon.startsWith('data:') || project.icon.startsWith('/'))
      ? project.icon
      : null);

  return (
    <div className="project-detail-view section-spacing">
      <div className="content-wrapper">
        {/* Back navigation button */}
        <button onClick={onBack} className="back-link-btn">
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </button>

        {/* Top App Header Banner matching Panel 4 */}
        <div className="app-header-banner neon-card">
          <div className="banner-left">
            {realIcon ? (
              <div className="banner-app-icon has-real-icon">
                <img src={realIcon} alt={project.title} className="banner-app-icon-img" />
              </div>
            ) : (
              <div className="banner-app-icon" style={{ background: project.iconBg || 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                {renderIcon(project.icon || 'home')}
              </div>
            )}
            <div className="banner-titles">
              <div className="banner-title-row">
                <h1 className="banner-title">{project.title}</h1>
                <span className="version-pill">{project.version}</span>
              </div>
              <p className="banner-subtitle">{project.subtitle}</p>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="banner-actions">
            <DownloadButtons project={project} onDownloadApk={onDownloadApk} size="large" />
          </div>
        </div>

        {/* Two-Column App Detail Grid */}
        <div className="app-details-grid">
          {/* Left Column: Platforms, Technologies, Description, Features, Specs */}
          <div className="app-info-col">
            {/* Platforms */}
            <div className="info-block">
              <h2 className="info-heading">Platforms</h2>
              <div className="platforms-pills-list">
                {platforms.map((plat) => (
                  <PlatformBadge key={plat} name={plat} size="medium" />
                ))}
              </div>
            </div>

            {/* Technologies Used */}
            <div className="info-block">
              <h2 className="info-heading">Technologies Used</h2>
              <div className="tech-tags-list">
                {technologies.map((tech) => (
                  <TechnologyBadge key={tech} name={tech} />
                ))}
              </div>
            </div>

            {/* About This App */}
            <div className="info-block">
              <h2 className="info-heading">About This App</h2>
              <p className="info-description">{project.fullDescription}</p>
            </div>

            {/* Key Features */}
            {features.length > 0 && (
              <div className="info-block">
                <h2 className="info-heading">Key Features</h2>
                <div className="features-checklist">
                  {features.map((feature, idx) => (
                    <div key={idx} className="feature-check-item">
                      <CheckCircle2 size={18} className="feature-check-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specs Bar (Version, Size, Last Update) */}
            <div className="specs-card neon-card">
              <div className="spec-item">
                <Tag size={16} color="#38bdf8" />
                <span className="spec-label">Version</span>
                <span className="spec-val">{project.version}</span>
              </div>
              <div className="spec-separator" />
              <div className="spec-item">
                <HardDrive size={16} color="#10b981" />
                <span className="spec-label">Size</span>
                <span className="spec-val">{project.apkSize}</span>
              </div>
              <div className="spec-separator" />
              <div className="spec-item">
                <Calendar size={16} color="#a855f7" />
                <span className="spec-label">Last Update</span>
                <span className="spec-val">{project.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Screenshot Mockup & Gallery */}
          <div className="app-media-col">
            <h2 className="media-section-heading">Screenshots</h2>
            <ScreenshotGallery appName={project.title} screenshots={screenshots} />
          </div>
        </div>
      </div>

      <style>{`
        .back-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 2rem;
          transition: color var(--transition-fast);
        }

        .back-link-btn:hover {
          color: var(--neon-cyan);
        }

        /* App Header Banner */
        .app-header-banner {
          padding: 2.25rem;
          margin-bottom: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .banner-app-icon {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }

        .banner-app-icon.has-real-icon {
          background: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.12);
          overflow: hidden;
          padding: 0;
        }

        .banner-app-icon-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: inherit;
        }

        .banner-titles {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .banner-title-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .banner-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .version-pill {
          padding: 0.2rem 0.65rem;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid var(--border-neon);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--neon-cyan);
        }

        .banner-subtitle {
          color: var(--text-muted);
          font-size: 1.05rem;
        }

        /* Two-Column App Detail Grid */
        .app-details-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3.5rem;
          align-items: flex-start;
        }

        .info-block {
          margin-bottom: 2.5rem;
        }

        .info-heading {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-main);
        }

        .info-description {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--text-muted);
        }

        .features-checklist {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .feature-check-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-main);
          font-size: 0.95rem;
        }

        .feature-check-icon {
          color: var(--neon-cyan);
          flex-shrink: 0;
        }

        /* Specs Bar */
        .specs-card {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1.25rem;
          border-radius: var(--radius-md);
          margin-bottom: 2.5rem;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .spec-label {
          color: var(--text-dim);
        }

        .spec-val {
          font-weight: 700;
          color: var(--text-main);
        }

        .spec-separator {
          width: 1px;
          height: 24px;
          background: var(--border-subtle);
        }

        .platforms-pills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .tech-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .media-section-heading {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          text-align: center;
          color: var(--text-main);
        }

        @media (max-width: 900px) {
          .app-details-grid {
            grid-template-columns: 1fr;
          }
          .app-header-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .specs-card {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }
          .spec-separator {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

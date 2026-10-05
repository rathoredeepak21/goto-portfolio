import React, { useState } from 'react';
import { Project } from '../types';
import { ChevronLeft, ChevronRight, Layers, ArrowLeft } from 'lucide-react';

interface ScreenshotsPageProps {
  projects: Project[];
  activeSlug?: string;
  onBack: () => void;
  onSelectProject: (slug: string) => void;
}

export const ScreenshotsPage: React.FC<ScreenshotsPageProps> = ({
  projects,
  activeSlug,
  onBack,
  onSelectProject,
}) => {
  const validProjects = (projects || []).filter(Boolean);
  const currentProject =
    (activeSlug ? validProjects.find((p) => p.slug === activeSlug || p.id === activeSlug) : undefined) ||
    validProjects.find((p) => p.featured) ||
    validProjects[0];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!currentProject) {
    return (
      <div className="screenshots-page-view section-spacing">
        <div className="content-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#f8fafc' }}>No Screenshots Available</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>No projects with screenshots are currently available.</p>
          <button onClick={onBack} className="back-link-btn" style={{ margin: '0 auto', display: 'inline-flex' }}>
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </button>
        </div>
      </div>
    );
  }

  const screenshots = currentProject.screenshots || [];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="screenshots-page-view section-spacing">
      <div className="content-wrapper">
        {/* Navigation back and app switch */}
        <div className="screenshots-top-bar">
          <button onClick={onBack} className="back-link-btn">
            <ArrowLeft size={16} />
            <span>Back to App Details</span>
          </button>

          {/* App Switcher */}
          <div className="app-switcher-select">
            <Layers size={16} color="#38bdf8" />
            <select
              value={currentProject.slug}
              onChange={(e) => {
                onSelectProject(e.target.value);
                setCurrentIndex(0);
              }}
              className="app-select-dropdown"
            >
              {validProjects.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Header matching Panel 5 */}
        <div className="section-header">
          <h1 className="section-title">{currentProject.title} — Screenshots</h1>
          <p className="section-subtitle">A quick look at the app</p>
        </div>

        {/* Multi-phone Interactive Carousel matching Panel 5 */}
        <div className="screenshots-carousel-stage">
          <button className="stage-nav-btn prev-btn" onClick={handlePrev} aria-label="Previous image">
            <ChevronLeft size={28} />
          </button>

          <div className="stage-cards-container">
            {screenshots.map((src, idx) => {
              // Calculate relative offset for 3D carousel effect
              const offset = idx - currentIndex;
              const isCenter = offset === 0;
              const isPrev = offset === -1 || (currentIndex === 0 && idx === screenshots.length - 1);
              const isNext = offset === 1 || (currentIndex === screenshots.length - 1 && idx === 0);

              let cardClass = 'stage-phone-card hidden-card';
              if (isCenter) cardClass = 'stage-phone-card center-card';
              else if (isPrev) cardClass = 'stage-phone-card prev-card';
              else if (isNext) cardClass = 'stage-phone-card next-card';

              return (
                <div
                  key={idx}
                  className={cardClass}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <div className="phone-screen-shell">
                    <img src={src} alt={`${currentProject.title} screen ${idx + 1}`} />
                  </div>
                </div>
              );
            })}
          </div>

          <button className="stage-nav-btn next-btn" onClick={handleNext} aria-label="Next image">
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Pagination Dots matching Panel 5 */}
        <div className="stage-dots-row">
          {screenshots.map((_, idx) => (
            <button
              key={idx}
              className={`stage-dot ${idx === currentIndex ? 'dot-active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .screenshots-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .app-switcher-select {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--bg-card);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-neon);
        }

        .app-select-dropdown {
          background: transparent;
          border: none;
          color: var(--text-main);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          outline: none;
        }

        .app-select-dropdown option {
          background: #090e1c;
          color: #ffffff;
        }

        .screenshots-carousel-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 520px;
          margin: 2rem 0;
          perspective: 1200px;
        }

        .stage-nav-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(14, 23, 42, 0.85);
          border: 1px solid var(--border-neon);
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--glow-cyan);
          transition: all var(--transition-fast);
          z-index: 20;
        }

        .stage-nav-btn:hover {
          background: var(--neon-cyan);
          color: #070b14;
          transform: scale(1.1);
        }

        .stage-cards-container {
          position: relative;
          width: 100%;
          max-width: 700px;
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stage-phone-card {
          position: absolute;
          width: 250px;
          height: 440px;
          border-radius: 36px;
          background: #000000;
          border: 4px solid #1e293b;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
        }

        .phone-screen-shell {
          width: 100%;
          height: 100%;
        }

        .phone-screen-shell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .center-card {
          transform: translateX(0) scale(1.08);
          z-index: 10;
          border-color: var(--neon-cyan);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), var(--glow-cyan);
        }

        .prev-card {
          transform: translateX(-160px) scale(0.85);
          opacity: 0.6;
          z-index: 5;
          filter: blur(1px);
        }

        .next-card {
          transform: translateX(160px) scale(0.85);
          opacity: 0.6;
          z-index: 5;
          filter: blur(1px);
        }

        .hidden-card {
          opacity: 0;
          pointer-events: none;
          transform: scale(0.6);
        }

        .stage-dots-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          margin-top: 2rem;
        }

        .stage-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transition: all var(--transition-fast);
        }

        .dot-active {
          width: 28px;
          border-radius: 4px;
          background: var(--neon-cyan);
          box-shadow: 0 0 12px var(--neon-cyan);
        }

        @media (max-width: 680px) {
          .prev-card, .next-card {
            display: none;
          }
          .stage-phone-card {
            width: 220px;
            height: 390px;
          }
          .stage-cards-container {
            height: 420px;
          }
        }
      `}</style>
    </div>
  );
};

import React from 'react';
import { Project, WebsiteContent } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { HeroIllustration } from '../components/HeroIllustration';
import { ArrowRight, Sparkles, Layers, Award, HeartHandshake } from 'lucide-react';
import { initialWebsiteContent } from '../services/mockData';

interface HomePageProps {
  content?: WebsiteContent;
  projects: Project[];
  onNavigate: (tab: string, slug?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  content: rawContent,
  projects,
  onNavigate,
}) => {
  const content = rawContent || initialWebsiteContent;
  const hero = content.hero || initialWebsiteContent.hero;
  const stats = content.stats || initialWebsiteContent.stats;

  const validProjects = (projects || []).filter(Boolean);
  const featuredOnly = validProjects.filter((p) => p.featured);
  // If featured project exists, show it; if deleted, automatically select other valid projects
  const featuredProjects = (featuredOnly.length > 0 ? featuredOnly : validProjects).slice(0, 4);

  return (
    <div className="home-page-view">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="content-wrapper hero-grid">
          {/* Hero Left Content */}
          <div className="hero-text-col">
            <span className="hero-greeting">{hero.greeting}</span>
            <h1 className="hero-headline">
              <span className="gradient-text-cyan-purple">{hero.developerTitle}</span>
            </h1>
            <h2 className="hero-subheadline">{hero.subtitle}</h2>

            <div className="hero-tech-tags">
              <span>{hero.techStack}</span>
            </div>

            <p className="hero-description">{hero.description}</p>

            <div className="hero-cta-buttons">
              <button
                onClick={() => onNavigate('projects')}
                className="btn btn-primary"
              >
                <span>{hero.primaryBtnText}</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="btn btn-secondary"
              >
                <span>{hero.secondaryBtnText}</span>
              </button>
            </div>
          </div>

          {/* Hero Right Visual: Futuristic 3D Workstation Illustration */}
          <div className="hero-visual-col">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* 2. FEATURED APPS SECTION */}
      <section className="featured-section section-spacing">
        <div className="content-wrapper">
          <div className="section-header">
            <span className="section-badge">
              <Sparkles size={14} />
              <span>Showcase</span>
            </span>
            <h2 className="section-title">Featured Apps</h2>
            <p className="section-subtitle">Some of my best projects</p>
          </div>

          {/* 4 Cards Grid matching Panel 1 */}
          {featuredProjects.length > 0 ? (
            <div className="featured-grid">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={(slug) => onNavigate('project-detail', slug)}
                />
              ))}
            </div>
          ) : (
            <div className="no-projects-box neon-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', margin: '1rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No projects available yet. Stay tuned!</p>
            </div>
          )}

          <div className="featured-all-btn-row">
            <button
              onClick={() => onNavigate('projects')}
              className="btn btn-secondary"
            >
              <span>Explore All Projects</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. STATISTICS SECTION */}
      <section className="stats-section">
        <div className="content-wrapper">
          <div className="stats-cards-grid">
            <div className="stat-card neon-card">
              <div className="stat-icon-wrapper cyan-glow">
                <Layers size={26} color="#38bdf8" />
              </div>
              <div className="stat-number gradient-text-cyan-purple">{stats.appsDeveloped}</div>
              <div className="stat-label">{stats.appsDevelopedLabel}</div>
            </div>

            <div className="stat-card neon-card">
              <div className="stat-icon-wrapper purple-glow">
                <Award size={26} color="#a855f7" />
              </div>
              <div className="stat-number gradient-text-cyan-purple">{stats.yearsExperience}</div>
              <div className="stat-label">{stats.yearsExperienceLabel}</div>
            </div>

            <div className="stat-card neon-card">
              <div className="stat-icon-wrapper green-glow">
                <HeartHandshake size={26} color="#10b981" />
              </div>
              <div className="stat-number gradient-text-cyan-green">{stats.passion}</div>
              <div className="stat-label">{stats.passionLabel}</div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-page-view {
          position: relative;
        }

        .hero-section {
          position: relative;
          padding: 4.5rem 0 3.5rem;
          background: var(--grad-hero);
          overflow: hidden;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3rem;
          align-items: center;
        }

        .hero-text-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-greeting {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }

        .hero-headline {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 0.6rem;
        }

        .hero-subheadline {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 1rem;
        }

        .hero-tech-tags {
          display: inline-block;
          padding: 0.4rem 0.9rem;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid var(--border-neon);
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--neon-cyan);
          letter-spacing: 0.03em;
          margin-bottom: 1.25rem;
        }

        .hero-description {
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--text-muted);
          max-width: 520px;
          margin-bottom: 2rem;
        }

        .hero-cta-buttons {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
        }

        .featured-all-btn-row {
          display: flex;
          justify-content: center;
          margin-top: 2.75rem;
        }

        /* Stats Grid */
        .stats-section {
          padding: 3rem 0;
        }

        .stats-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .stat-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .stat-icon-wrapper {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          border: 1px solid var(--border-subtle);
        }

        .cyan-glow {
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
        }

        .purple-glow {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
        }

        .green-glow {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }

        .stat-number {
          font-size: 2.75rem;
          font-weight: 800;
          font-family: var(--font-heading);
          line-height: 1.1;
          margin-bottom: 0.35rem;
        }

        .stat-label {
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-text-col {
            align-items: center;
          }
          .hero-description {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-cta-buttons {
            justify-content: center;
          }
          .featured-grid {
            grid-template-columns: 1fr;
          }
          .stats-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .hero-headline {
            font-size: 2.5rem;
          }
          .hero-subheadline {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  );
};

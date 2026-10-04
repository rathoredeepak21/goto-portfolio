import React, { useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { Sparkles, Search } from 'lucide-react';

interface ProjectsPageProps {
  projects: Project[];
  onViewDetails: (slug: string) => void;
  onNavigate?: (tab: string, slug?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onViewDetails, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = searchQuery.trim().toLowerCase();
      if (q === 'admin') {
        onNavigate?.('admin');
      }
    }
  };

  const filterTabs: Array<{ id: ProjectCategory; label: string }> = [
    { id: 'all', label: 'All Projects' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'web', label: 'Web Apps' },
    { id: 'personal', label: 'Personal' },
  ];

  const platformTabs = [
    { id: 'all', label: 'All Platforms' },
    { id: 'android', label: 'Android' },
    { id: 'ios', label: 'iOS' },
    { id: 'web', label: 'Web' },
    { id: 'desktop', label: 'Desktop' },
  ];

  const filteredProjects = (projects || []).filter((project) => {
    if (!project) return false;
    const q = searchQuery.toLowerCase().trim();
    if (q === 'admin') return false;

    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;

    const platforms =
      project.platforms && project.platforms.length > 0
        ? project.platforms
        : project.category === 'web'
        ? ['Web Application']
        : ['Android App'];

    const matchesPlatform =
      selectedPlatform === 'all' ||
      platforms.some((p) => p && p.toLowerCase().includes(selectedPlatform));

    const matchesSearch =
      !q ||
      (project.title && project.title.toLowerCase().includes(q)) ||
      (project.subtitle && project.subtitle.toLowerCase().includes(q)) ||
      (project.shortDescription && project.shortDescription.toLowerCase().includes(q)) ||
      (project.fullDescription && project.fullDescription.toLowerCase().includes(q)) ||
      (project.category && project.category.toLowerCase().includes(q)) ||
      platforms.some((p) => p && p.toLowerCase().includes(q)) ||
      (Array.isArray(project.technologies) && project.technologies.some((t) => t && t.toLowerCase().includes(q)));

    return matchesCategory && matchesPlatform && matchesSearch;
  });

  return (
    <div className="projects-page-view section-spacing">
      <div className="content-wrapper">
        {/* Header Section */}
        <div className="section-header">
          <span className="section-badge">
            <Sparkles size={14} />
            <span>Portfolio</span>
          </span>
          <h1 className="section-title">My Projects</h1>
          <p className="section-subtitle">Apps I've built with passion</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="filters-control-bar">
          <div className="category-pills-row">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`filter-pill-btn ${selectedCategory === tab.id ? 'pill-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search apps or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="search-input"
            />
          </div>
        </div>

        {/* Platform Sub-Filters Bar */}
        <div className="platform-subfilter-bar">
          <span className="platform-filter-label">Filter by Platform:</span>
          <div className="platform-pills-row">
            {platformTabs.map((ptab) => (
              <button
                key={ptab.id}
                onClick={() => setSelectedPlatform(ptab.id)}
                className={`platform-subfilter-btn ${selectedPlatform === ptab.id ? 'platform-sub-active' : ''}`}
              >
                {ptab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Grid matching Panel 3 */}
        {filteredProjects.length > 0 ? (
          <div className="projects-grid-2col">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="no-projects-box neon-card">
            <p>No projects found matching the filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPlatform('all');
                setSearchQuery('');
              }}
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        .filters-control-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .platform-subfilter-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          padding: 0.6rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .platform-filter-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .platform-pills-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .platform-subfilter-btn {
          padding: 0.3rem 0.85rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-size: 0.82rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .platform-subfilter-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--border-neon);
          background: rgba(56, 189, 248, 0.08);
        }

        .platform-sub-active {
          background: rgba(56, 189, 248, 0.16);
          color: var(--neon-cyan) !important;
          border-color: var(--neon-cyan);
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.25);
        }

        .category-pills-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .filter-pill-btn {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .filter-pill-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--border-neon);
          background: rgba(56, 189, 248, 0.08);
        }

        .pill-active {
          background: var(--grad-primary);
          color: #ffffff !important;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
        }

        .search-input-box {
          position: relative;
          min-width: 240px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-dim);
        }

        .search-input {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: 0.5rem 1rem 0.5rem 2.4rem;
          font-size: 0.9rem;
          transition: border-color var(--transition-fast);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--neon-cyan);
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
        }

        .projects-grid-2col {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
        }

        .no-projects-box {
          padding: 4rem 2rem;
          text-align: center;
          color: var(--text-muted);
        }

        @media (max-width: 860px) {
          .projects-grid-2col {
            grid-template-columns: 1fr;
          }
          .filters-control-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .search-input-box {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

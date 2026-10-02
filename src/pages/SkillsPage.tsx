import React, { useState, useMemo } from 'react';
import { Technology, TechnologyCategory } from '../types';
import { TechnologyCard } from '../components/TechnologyCard';
import {
  Sparkles,
  Search,
  Smartphone,
  Globe,
  Database,
  Code2,
  Wrench,
  Palette,
  Server,
  Layers,
} from 'lucide-react';

interface SkillsPageProps {
  skills?: Technology[];
  technologies?: Technology[];
  categories?: TechnologyCategory[];
  onNavigate?: (tab: string, slug?: string) => void;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({
  skills,
  technologies: techProp,
  categories: categoriesProp,
  onNavigate,
}) => {
  // Use technologies prop or skills prop
  const allTechnologies: Technology[] = techProp || skills || [];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Icon helper for technology category headers
  const getCategoryIcon = (categoryName: string) => {
    const c = categoryName.toLowerCase();
    if (c.includes('mobile')) return <Smartphone size={20} color="#38bdf8" />;
    if (c.includes('web')) return <Globe size={20} color="#00d8ff" />;
    if (c.includes('backend') || c.includes('data')) return <Database size={20} color="#10b981" />;
    if (c.includes('language') || c.includes('code')) return <Code2 size={20} color="#a855f7" />;
    if (c.includes('tool')) return <Wrench size={20} color="#f59e0b" />;
    if (c.includes('design') || c.includes('product')) return <Palette size={20} color="#ec4899" />;
    if (c.includes('devops') || c.includes('infra')) return <Server size={20} color="#3b82f6" />;
    return <Layers size={20} color="#38bdf8" />;
  };

  // Derive unique categories from active technologies
  const categoryList = useMemo(() => {
    const defaultOrder = [
      'Mobile Development',
      'Web Development',
      'Backend & Database',
      'Programming Languages',
      'Development Tools',
      'Design & Productivity',
      'DevOps / Infrastructure',
    ];

    if (categoriesProp && categoriesProp.length > 0) {
      return categoriesProp.map((c) => c.name);
    }

    const uniqueSet = new Set<string>();
    allTechnologies.forEach((t) => {
      if (t.category) uniqueSet.add(t.category);
    });

    // Sort according to default order if present
    return Array.from(uniqueSet).sort((a, b) => {
      const idxA = defaultOrder.indexOf(a);
      const idxB = defaultOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [allTechnologies, categoriesProp]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = searchQuery.trim().toLowerCase();
      if (q === 'admin') {
        onNavigate?.('admin');
      }
    }
  };

  // Filtered technologies based on search & category
  const filteredTechnologies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q === 'admin') return [];

    return allTechnologies.filter((tech) => {
      if (!tech.is_active) return false;
      const matchesCategory =
        selectedCategory === 'all' ||
        tech.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !q ||
        tech.name.toLowerCase().includes(q) ||
        (tech.description && tech.description.toLowerCase().includes(q)) ||
        tech.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [allTechnologies, selectedCategory, searchQuery]);

  return (
    <div className="skills-page-view section-spacing">
      <div className="content-wrapper">
        {/* Header Section */}
        <div className="section-header">
          <span className="section-badge">
            <Sparkles size={14} />
            <span>Expertise & Stack</span>
          </span>
          <h1 className="section-title">Skills & Technologies</h1>
          <p className="section-subtitle">
            Official production technologies, SDKs, and engineering tools I build with
          </p>
        </div>

        {/* Filter Controls: Search & Category Pills */}
        <div className="skills-filter-container">
          {/* Search Box */}
          <div className="skills-search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search technologies, tools, frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="skills-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="skills-search-clear"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="skills-category-tabs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`cat-tab-btn ${selectedCategory === 'all' ? 'cat-tab-active' : ''}`}
            >
              <span>All Technologies</span>
              <span className="cat-count-pill">{allTechnologies.filter((t) => t.is_active).length}</span>
            </button>

            {categoryList.map((catName) => {
              const count = allTechnologies.filter(
                (t) => t.is_active && t.category.toLowerCase() === catName.toLowerCase()
              ).length;
              if (count === 0) return null;

              return (
                <button
                  key={catName}
                  onClick={() => setSelectedCategory(catName)}
                  className={`cat-tab-btn ${
                    selectedCategory.toLowerCase() === catName.toLowerCase() ? 'cat-tab-active' : ''
                  }`}
                >
                  <span>{catName}</span>
                  <span className="cat-count-pill">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categorized View (when 'all' is selected and no search) or Flat Grid View */}
        {selectedCategory === 'all' && !searchQuery.trim() ? (
          <div className="skills-sections-list">
            {categoryList.map((catName) => {
              const catTechs = allTechnologies
                .filter((t) => t.is_active && t.category.toLowerCase() === catName.toLowerCase())
                .sort((a, b) => a.display_order - b.display_order);

              if (catTechs.length === 0) return null;

              return (
                <div key={catName} className="skill-category-block">
                  <div className="cat-header-row">
                    <div className="cat-icon-box">{getCategoryIcon(catName)}</div>
                    <div className="cat-info">
                      <h2 className="cat-title">{catName}</h2>
                      <span className="cat-counter">{catTechs.length} technologies</span>
                    </div>
                  </div>

                  <div className="skills-cards-grid">
                    {catTechs.map((tech) => (
                      <TechnologyCard key={tech.id} technology={tech} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="filtered-results-container">
            {filteredTechnologies.length > 0 ? (
              <div className="skills-cards-grid">
                {filteredTechnologies.map((tech) => (
                  <TechnologyCard key={tech.id} technology={tech} />
                ))}
              </div>
            ) : (
              <div className="no-skills-found neon-card">
                <Search size={36} color="#64748b" />
                <h3>No technologies found</h3>
                <p>Try searching for a different framework, language, or reset filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="btn btn-secondary"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .skills-filter-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 3.5rem;
        }

        .skills-search-bar {
          position: relative;
          max-width: 540px;
          width: 100%;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 1.1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted, #94a3b8);
          pointer-events: none;
        }

        .skills-search-input {
          width: 100%;
          background: rgba(14, 23, 42, 0.7);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: var(--radius-full, 9999px);
          padding: 0.85rem 2.8rem 0.85rem 2.85rem;
          color: var(--text-main, #f8fafc);
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.25s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .skills-search-input:focus {
          outline: none;
          border-color: var(--neon-cyan, #38bdf8);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
          background: rgba(19, 31, 56, 0.9);
        }

        .skills-search-clear {
          position: absolute;
          right: 1.1rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1rem;
          padding: 0.2rem;
        }

        .skills-category-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.65rem;
        }

        .cat-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.1rem;
          border-radius: var(--radius-full, 9999px);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
          color: var(--text-muted, #94a3b8);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cat-tab-btn:hover {
          color: var(--neon-cyan, #38bdf8);
          border-color: rgba(56, 189, 248, 0.3);
          background: rgba(56, 189, 248, 0.08);
        }

        .cat-tab-active {
          background: rgba(56, 189, 248, 0.16) !important;
          border-color: var(--neon-cyan, #38bdf8) !important;
          color: #ffffff !important;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
        }

        .cat-count-pill {
          font-size: 0.72rem;
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
        }

        .cat-tab-active .cat-count-pill {
          background: var(--neon-cyan);
          color: #070b14;
          font-weight: 700;
        }

        .skills-sections-list {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .skill-category-block {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .cat-header-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
        }

        .cat-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md, 12px);
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cat-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .cat-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-main, #f8fafc);
          letter-spacing: -0.01em;
          margin: 0;
        }

        .cat-counter {
          font-size: 0.82rem;
          color: var(--text-muted, #94a3b8);
          font-weight: 500;
        }

        .skills-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .no-skills-found {
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1rem;
          max-width: 500px;
          margin: 2rem auto;
        }

        .no-skills-found h3 {
          font-size: 1.25rem;
          color: var(--text-main);
        }

        .no-skills-found p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        /* Light mode support */
        [data-theme='light'] .skills-search-input {
          background: #ffffff;
          border-color: rgba(14, 165, 233, 0.3);
          color: #0f172a;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
        }

        [data-theme='light'] .cat-tab-btn {
          background: rgba(0, 0, 0, 0.04);
          border-color: rgba(0, 0, 0, 0.1);
        }

        [data-theme='light'] .cat-tab-active {
          background: rgba(14, 165, 233, 0.15) !important;
          border-color: var(--neon-cyan) !important;
          color: var(--neon-cyan) !important;
        }

        @media (max-width: 1100px) {
          .skills-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .skills-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .skills-category-tabs {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
          }
          .cat-tab-btn {
            flex-shrink: 0;
          }
        }

        @media (max-width: 480px) {
          .skills-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

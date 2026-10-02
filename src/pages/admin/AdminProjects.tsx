import React, { useState } from 'react';
import { Project, Platform } from '../../types';
import { ProjectModal } from './ProjectModal';
import { PlatformBadge } from '../../components/PlatformBadge';
import { Plus, Edit2, Trash2, Eye, Smartphone, Star } from 'lucide-react';

interface AdminProjectsProps {
  projects: Project[];
  platforms?: Platform[];
  onSaveProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onPreviewProject: (slug: string) => void;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({
  projects,
  platforms,
  onSaveProject,
  onDeleteProject,
  onPreviewProject,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateNew = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEdit = (proj: Project) => {
    setEditingProject(proj);
    setModalOpen(true);
  };

  const handleSave = (proj: Project) => {
    onSaveProject(proj);
    setModalOpen(false);
  };

  const handleDelete = (proj: Project) => {
    if (window.confirm(`Are you sure you want to delete "${proj.title}"?`)) {
      onDeleteProject(proj.id);
    }
  };

  return (
    <div className="admin-projects-view">
      {/* Title & Add App Action */}
      <div className="projects-top-header">
        <div>
          <h1 className="admin-view-title">Apps / Projects</h1>
          <p className="admin-view-subtitle">Manage your portfolio apps, release URLs, and store buttons</p>
        </div>

        <button onClick={handleCreateNew} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New App</span>
        </button>
      </div>

      {/* Projects Table / Responsive Grid */}
      <div className="projects-table-card neon-card">
        <div className="table-responsive-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>App Name</th>
                <th>Platforms</th>
                <th>Category</th>
                <th>Version</th>
                <th>Size</th>
                <th>Downloads Active</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const projectPlatforms =
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
                  <tr key={project.id}>
                    {/* Name & Icon */}
                    <td>
                      <div className="table-app-meta">
                        {realIcon ? (
                          <div className="table-app-icon has-real-icon">
                            <img src={realIcon} alt={project.title} className="table-app-icon-img" />
                          </div>
                        ) : (
                          <div className="table-app-icon" style={{ background: project.iconBg || 'var(--card-bg)' }}>
                            <Smartphone size={18} color="#ffffff" />
                          </div>
                        )}
                        <div>
                          <div className="table-app-title">{project.title}</div>
                          <div className="table-app-sub">{project.subtitle}</div>
                        </div>
                      </div>
                    </td>

                    {/* Platforms */}
                    <td>
                      <div className="table-platforms-list">
                        {projectPlatforms.map((plat) => (
                          <PlatformBadge key={plat} name={plat} size="small" />
                        ))}
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="cat-pill">{project.category}</span>
                    </td>

                    {/* Version */}
                    <td>
                      <span className="version-tag">{project.version}</span>
                    </td>

                    {/* Size */}
                    <td>
                      <span className="size-text">{project.apkSize}</span>
                    </td>

                    {/* Downloads Status */}
                    <td>
                      <div className="download-status-chips">
                        {project.playStoreEnabled && <span className="chip-store">Play Store</span>}
                        {project.apkDownloadEnabled && <span className="chip-apk">APK</span>}
                      </div>
                    </td>

                    {/* Featured */}
                    <td>
                      {project.featured ? (
                        <span className="featured-star" title="Featured on Home">
                          <Star size={16} fill="#eab308" color="#eab308" />
                        </span>
                      ) : (
                        <span className="unfeatured-dot" />
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="table-actions-cell">
                        <button
                          onClick={() => onPreviewProject(project.slug)}
                          className="action-icon-btn preview-btn"
                          title="View Live Page"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleEdit(project)}
                          className="action-icon-btn edit-btn"
                          title="Edit Project"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(project)}
                          className="action-icon-btn del-btn"
                          title="Delete Project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit App Modal */}
      <ProjectModal
        isOpen={modalOpen}
        project={editingProject}
        platforms={platforms}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <style>{`
        .admin-projects-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .projects-top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .admin-view-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .admin-view-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .projects-table-card {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .table-responsive-wrapper {
          overflow-x: auto;
        }

        .admin-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-data-table th {
          padding: 1rem 1.25rem;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-subtle);
          font-weight: 700;
        }

        .admin-data-table td {
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          vertical-align: middle;
        }

        .table-app-meta {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .table-app-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .table-app-icon.has-real-icon {
          background: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.12);
          overflow: hidden;
          padding: 0;
        }

        .table-app-icon-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: inherit;
        }

        .table-app-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .table-app-sub {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .cat-pill {
          font-size: 0.78rem;
          text-transform: capitalize;
          padding: 0.2rem 0.65rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: var(--text-main);
          font-weight: 500;
        }

        .version-tag {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--neon-cyan);
          font-weight: 600;
        }

        .size-text {
          font-size: 0.88rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .download-status-chips {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .chip-store {
          font-size: 0.72rem;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: var(--neon-blue);
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .chip-apk {
          font-size: 0.72rem;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: var(--neon-emerald);
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .table-actions-cell {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .action-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .preview-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
        }

        .edit-btn:hover {
          color: #818cf8;
          border-color: #818cf8;
        }

        .del-btn:hover {
          color: #f87171;
          border-color: #f87171;
        }

        .unfeatured-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--border-subtle);
        }
      `}</style>
    </div>
  );
};

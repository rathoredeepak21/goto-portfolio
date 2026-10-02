import React, { useState } from 'react';
import { ApkRelease, Project } from '../../types';
import { Plus, Edit2, Trash2, DownloadCloud, X } from 'lucide-react';

interface AdminReleasesProps {
  releases: ApkRelease[];
  projects: Project[];
  onSaveRelease: (release: ApkRelease) => void;
  onDeleteRelease: (releaseId: string) => void;
}

export const AdminReleases: React.FC<AdminReleasesProps> = ({
  releases,
  projects,
  onSaveRelease,
  onDeleteRelease,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<ApkRelease | null>(null);

  // Modal form fields
  const [formData, setFormData] = useState<ApkRelease>({
    id: '',
    projectId: projects[0]?.id || '',
    projectName: projects[0]?.title || '',
    projectIcon: projects[0]?.icon || 'home',
    version: 'v1.0.0',
    size: '15 MB',
    releaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    downloadUrl: '',
    releaseNotes: '',
    isLatest: true,
    downloadsCount: 0,
  });

  const handleOpenAdd = () => {
    const firstProj = projects[0];
    setFormData({
      id: '',
      projectId: firstProj ? firstProj.id : '',
      projectName: firstProj ? firstProj.title : '',
      projectIcon: firstProj ? (firstProj.icon_url || firstProj.iconUrl || firstProj.icon || 'home') : 'home',
      version: 'v1.0.0',
      size: '15 MB',
      releaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      downloadUrl: firstProj ? `https://r2.gotop-technologies.com/apks/${firstProj.slug}-v1.0.0.apk` : '',
      releaseNotes: 'Performance improvements and bug fixes.',
      isLatest: true,
      downloadsCount: 0,
    });
    setEditingRelease(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (rel: ApkRelease) => {
    setFormData(rel);
    setEditingRelease(rel);
    setModalOpen(true);
  };

  const handleProjectSelect = (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (proj) {
      setFormData({
        ...formData,
        projectId: proj.id,
        projectName: proj.title,
        projectIcon: proj.icon_url || proj.iconUrl || proj.icon || 'home',
        downloadUrl: `https://r2.gotop-technologies.com/apks/${proj.slug}-${formData.version}.apk`,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRelease(formData);
    setModalOpen(false);
  };

  const handleDelete = (rel: ApkRelease) => {
    if (window.confirm(`Delete APK release ${rel.projectName} ${rel.version}?`)) {
      onDeleteRelease(rel.id);
    }
  };

  return (
    <div className="admin-releases-view">
      {/* Top Header matching Panel 12 */}
      <div className="releases-top-header">
        <div>
          <h1 className="admin-view-title">APK Releases</h1>
          <p className="admin-view-subtitle">Manage APK builds and Cloudflare R2 binary distributions</p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Upload APK</span>
        </button>
      </div>

      {/* Table matching Panel 12 */}
      <div className="releases-table-card neon-card">
        <div className="table-responsive-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>App Name</th>
                <th>Version</th>
                <th>Size</th>
                <th>Date</th>
                <th>Downloads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {releases.map((rel) => (
                <tr key={rel.id}>
                  {/* App Name & Logo */}
                  <td>
                    <div className="rel-app-info">
                      <div className="rel-icon-box" style={{ overflow: 'hidden', padding: 0 }}>
                        {rel.projectIcon && (rel.projectIcon.startsWith('http') || rel.projectIcon.startsWith('data:') || rel.projectIcon.startsWith('/')) ? (
                          <img src={rel.projectIcon} alt={rel.projectName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <DownloadCloud size={18} color="#38bdf8" />
                        )}
                      </div>
                      <div>
                        <div className="rel-name">{rel.projectName}</div>
                        {rel.isLatest && <span className="latest-badge">Latest Release</span>}
                      </div>
                    </div>
                  </td>

                  {/* Version */}
                  <td>
                    <span className="rel-version">{rel.version}</span>
                  </td>

                  {/* Size */}
                  <td>
                    <span className="rel-size">{rel.size}</span>
                  </td>

                  {/* Date */}
                  <td>
                    <span className="rel-date">{rel.releaseDate}</span>
                  </td>

                  {/* Downloads Count */}
                  <td>
                    <span className="rel-dl-count">{rel.downloadsCount.toLocaleString()}</span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="rel-actions-row">
                      <a
                        href={rel.downloadUrl}
                        download
                        className="action-icon-btn dl-btn"
                        title="Direct Download"
                      >
                        <DownloadCloud size={15} />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(rel)}
                        className="action-icon-btn edit-btn"
                        title="Edit Release"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(rel)}
                        className="action-icon-btn del-btn"
                        title="Delete Release"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload / Edit Release Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-container neon-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingRelease ? 'Edit APK Release' : 'Upload APK Release'}</h2>
              <button onClick={() => setModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              {/* Select Project */}
              <div className="form-field">
                <label className="modal-label">Target App</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => handleProjectSelect(e.target.value)}
                  className="modal-select"
                  disabled={Boolean(editingRelease)}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.version})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2col">
                {/* Version */}
                <div className="form-field">
                  <label className="modal-label">Version</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. v1.4.1"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="modal-input"
                  />
                </div>

                {/* APK Size */}
                <div className="form-field">
                  <label className="modal-label">Binary Size</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18.4 MB"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="modal-input"
                  />
                </div>
              </div>

              {/* R2 Download URL / Direct binary link */}
              <div className="form-field">
                <label className="modal-label">Cloudflare R2 APK Download URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://r2.gotop-technologies.com/apks/app-v1.0.apk"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  className="modal-input"
                />
                <span className="field-hint">Files are stored securely on Cloudflare R2 / Supabase Storage.</span>
              </div>

              {/* Release Notes */}
              <div className="form-field">
                <label className="modal-label">Release Notes</label>
                <textarea
                  rows={3}
                  placeholder="What's new in this release..."
                  value={formData.releaseNotes}
                  onChange={(e) => setFormData({ ...formData, releaseNotes: e.target.value })}
                  className="modal-textarea"
                />
              </div>

              {/* Latest release toggle */}
              <div className="form-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isLatest}
                    onChange={(e) => setFormData({ ...formData, isLatest: e.target.checked })}
                  />
                  <span>Mark as latest release for this app</span>
                </label>
              </div>

              <div className="modal-actions-footer">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Save Release</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-releases-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .releases-top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .releases-table-card {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          overflow: hidden;
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

        .rel-app-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .rel-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-neon);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rel-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .latest-badge {
          font-size: 0.7rem;
          color: var(--neon-emerald);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .rel-version {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          color: var(--neon-cyan);
          font-weight: 600;
        }

        .rel-size {
          font-size: 0.88rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .rel-date {
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .rel-dl-count {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .rel-actions-row {
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .dl-btn:hover {
          color: var(--neon-emerald);
          border-color: var(--neon-emerald);
        }

        .edit-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
        }

        .del-btn:hover {
          color: #f87171;
          border-color: #f87171;
        }

        .field-hint {
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

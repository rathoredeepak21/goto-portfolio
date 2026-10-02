import React, { useState, useMemo } from 'react';
import { Platform } from '../../types';
import { PlatformBadge } from '../../components/PlatformBadge';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  X,
  Layers,
  Smartphone,
  Globe,
  Monitor,
  Laptop,
} from 'lucide-react';

interface AdminPlatformsProps {
  platforms: Platform[];
  onSavePlatform: (platform: Platform) => void;
  onDeletePlatform: (platformId: string) => void;
  onReorderPlatforms: (platforms: Platform[]) => void;
  onToggleStatus?: (platformId: string) => void;
}

const PRESET_PLATFORMS = [
  { name: 'Android App', slug: 'android-app', icon: 'android' },
  { name: 'iOS App', slug: 'ios-app', icon: 'apple' },
  { name: 'Web Application', slug: 'web-app', icon: 'globe' },
  { name: 'Website', slug: 'website', icon: 'globe' },
  { name: 'Desktop Application', slug: 'desktop-app', icon: 'monitor' },
  { name: 'macOS App', slug: 'macos-app', icon: 'apple' },
  { name: 'Windows App', slug: 'windows-app', icon: 'monitor' },
  { name: 'Cross-Platform', slug: 'cross-platform', icon: 'layers' },
];

export const AdminPlatforms: React.FC<AdminPlatformsProps> = ({
  platforms,
  onSavePlatform,
  onDeletePlatform,
  onReorderPlatforms,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formIcon, setFormIcon] = useState('android');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  const sortedPlatforms = useMemo(() => {
    return [...platforms].sort((a, b) => a.display_order - b.display_order);
  }, [platforms]);

  const filteredPlatforms = useMemo(() => {
    return sortedPlatforms.filter((p) => {
      const q = search.toLowerCase().trim();
      return (
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.icon.toLowerCase().includes(q)
      );
    });
  }, [sortedPlatforms, search]);

  const handleOpenAddModal = (preset?: { name: string; slug: string; icon: string }) => {
    setEditingPlatform(null);
    setFormName(preset ? preset.name : '');
    setFormSlug(preset ? preset.slug : '');
    setFormIcon(preset ? preset.icon : 'android');
    setFormOrder(platforms.length + 1);
    setFormIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEditModal = (plat: Platform) => {
    setEditingPlatform(plat);
    setFormName(plat.name);
    setFormSlug(plat.slug);
    setFormIcon(plat.icon || 'globe');
    setFormOrder(plat.display_order);
    setFormIsActive(plat.is_active);
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormName(name);
    if (!editingPlatform) {
      setFormSlug(name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const platToSave: Platform = {
      id: editingPlatform?.id || `plat-${Date.now()}`,
      name: formName.trim(),
      slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      icon: formIcon.trim().toLowerCase(),
      display_order: Number(formOrder) || platforms.length + 1,
      is_active: formIsActive,
      updated_at: new Date().toISOString(),
    };

    onSavePlatform(platToSave);
    setModalOpen(false);
  };

  const handleDelete = (plat: Platform) => {
    if (window.confirm(`Are you sure you want to delete "${plat.name}"?`)) {
      onDeletePlatform(plat.id);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sortedPlatforms.length) return;

    const reordered = [...sortedPlatforms];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    onReorderPlatforms(reordered);
  };

  const handleToggle = (plat: Platform) => {
    if (onToggleStatus) {
      onToggleStatus(plat.id);
    } else {
      onSavePlatform({
        ...plat,
        is_active: !plat.is_active,
        updated_at: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="admin-platforms-view">
      {/* Top Header */}
      <div className="admin-view-header-row">
        <div>
          <h1 className="admin-view-title">Platforms & Application Types</h1>
          <p className="admin-view-subtitle">
            Configure platforms (Android App, iOS App, Web Application, etc.) shown on Project Cards
          </p>
        </div>

        <button onClick={() => handleOpenAddModal()} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Platform</span>
        </button>
      </div>

      {/* Preset Platforms Bar */}
      <div className="quick-presets-card neon-card">
        <div className="presets-title">
          <Layers size={16} color="#38bdf8" />
          <span>Quick Preset Platforms:</span>
        </div>
        <div className="presets-pills">
          {PRESET_PLATFORMS.map((preset) => (
            <button
              key={preset.slug}
              onClick={() => handleOpenAddModal(preset)}
              className="preset-chip-btn"
              title={`Add ${preset.name}`}
            >
              <PlatformBadge name={preset.name} size="small" />
              <span className="preset-plus">+ Add</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="admin-toolbar-card neon-card">
        <div className="search-box-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search platforms by name, slug, or icon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>
        <div className="toolbar-stats">
          Total: <span className="stat-highlight">{platforms.length}</span> (Active:{' '}
          <span className="stat-active">{platforms.filter((p) => p.is_active).length}</span>)
        </div>
      </div>

      {/* Platforms Table Card */}
      <div className="admin-table-card neon-card">
        <div className="table-responsive-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Platform & Preview</th>
                <th>Slug</th>
                <th>Icon Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlatforms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-table-cell">
                    No platforms found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPlatforms.map((plat, idx) => (
                  <tr key={plat.id}>
                    {/* Order Controls */}
                    <td>
                      <div className="order-reorder-cell">
                        <span className="order-num">{plat.display_order}</span>
                        <div className="order-buttons">
                          <button
                            type="button"
                            onClick={() => handleMove(idx, 'up')}
                            disabled={idx === 0}
                            className="order-btn"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(idx, 'down')}
                            disabled={idx === sortedPlatforms.length - 1}
                            className="order-btn"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Platform Badge Preview */}
                    <td>
                      <div className="platform-meta-cell">
                        <PlatformBadge name={plat.name} size="medium" />
                        <span className="platform-raw-name">{plat.name}</span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td>
                      <code className="slug-tag">{plat.slug}</code>
                    </td>

                    {/* Icon */}
                    <td>
                      <span className="icon-name-tag">
                        {plat.icon === 'android' && <span className="plat-icon-circle android">🤖</span>}
                        {plat.icon === 'apple' && <span className="plat-icon-circle apple">🍎</span>}
                        {plat.icon === 'globe' && <Globe size={13} color="#38bdf8" />}
                        {plat.icon === 'monitor' && <Monitor size={13} color="#c084fc" />}
                        {plat.icon === 'laptop' && <Laptop size={13} color="#c084fc" />}
                        {plat.icon === 'smartphone' && <Smartphone size={13} color="#4ade80" />}
                        <span>{plat.icon}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggle(plat)}
                        className={`status-toggle-pill ${plat.is_active ? 'active' : 'inactive'}`}
                        title="Click to toggle status"
                      >
                        {plat.is_active ? (
                          <>
                            <CheckCircle size={13} />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={13} />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="row-action-btns">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(plat)}
                          className="action-icon-btn edit-btn"
                          title="Edit Platform"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(plat)}
                          className="action-icon-btn del-btn"
                          title="Delete Platform"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Platform Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-container neon-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingPlatform ? 'Edit Platform' : 'Add New Platform'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Platform Name */}
              <div className="form-field">
                <label className="modal-label">Platform Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Android App, iOS App, Web Application"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="modal-input"
                />
              </div>

              {/* Slug */}
              <div className="form-field">
                <label className="modal-label">Platform Slug (Identifier)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. android-app"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="modal-input"
                />
              </div>

              {/* Icon Selection */}
              <div className="form-field">
                <label className="modal-label">Platform Icon</label>
                <div className="icon-selector-grid">
                  {[
                    { id: 'android', label: 'Android Robot', icon: '🤖' },
                    { id: 'apple', label: 'Apple / iOS', icon: '🍎' },
                    { id: 'globe', label: 'Web / Globe', icon: '🌐' },
                    { id: 'monitor', label: 'Desktop / Monitor', icon: '🖥️' },
                    { id: 'laptop', label: 'Laptop', icon: '💻' },
                    { id: 'smartphone', label: 'Mobile Device', icon: '📱' },
                  ].map((ic) => (
                    <button
                      type="button"
                      key={ic.id}
                      onClick={() => setFormIcon(ic.id)}
                      className={`icon-select-btn ${formIcon === ic.id ? 'selected' : ''}`}
                    >
                      <span className="icon-emoji">{ic.icon}</span>
                      <span className="icon-label">{ic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="form-field preview-field">
                <label className="modal-label">Live Card Badge Preview</label>
                <div className="badge-preview-box">
                  <PlatformBadge name={formName || 'Preview Platform'} icon={formIcon} size="medium" />
                </div>
              </div>

              <div className="form-grid-2col">
                {/* Display Order */}
                <div className="form-field">
                  <label className="modal-label">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="modal-input"
                  />
                </div>

                {/* Status */}
                <div className="form-field" style={{ justifyContent: 'center' }}>
                  <label className="checkbox-label" style={{ marginTop: '1.6rem' }}>
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                    />
                    <span>Active Platform</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="modal-actions-footer">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>{editingPlatform ? 'Save Changes' : 'Create Platform'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-platforms-view {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .admin-view-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .quick-presets-card {
          padding: 1.1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .presets-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
        }

        .presets-pills {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .preset-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.65rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: var(--text-main);
          font-size: 0.82rem;
          transition: all var(--transition-fast);
        }

        .preset-chip-btn:hover {
          background: rgba(56, 189, 248, 0.12);
          border-color: var(--border-neon);
          color: var(--neon-cyan);
          transform: translateY(-1px);
        }

        .preset-plus {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--neon-cyan);
        }

        .admin-toolbar-card {
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .search-box-wrapper {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .admin-search-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: 0.55rem 1rem 0.55rem 2.4rem;
          font-size: 0.88rem;
          color: var(--text-main);
          transition: border-color var(--transition-fast);
        }

        .admin-search-input:focus {
          outline: none;
          border-color: var(--neon-cyan);
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
        }

        .toolbar-stats {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .stat-highlight {
          color: var(--text-main);
          font-weight: 700;
        }

        .stat-active {
          color: var(--neon-emerald);
          font-weight: 700;
        }

        .admin-table-card {
          padding: 0;
          overflow: hidden;
        }

        .table-responsive-wrapper {
          overflow-x: auto;
        }

        .order-reorder-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .order-num {
          font-weight: 700;
          color: var(--text-muted);
          min-width: 18px;
          text-align: center;
        }

        .order-buttons {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .order-btn {
          width: 20px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: 3px;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .order-btn:hover:not(:disabled) {
          background: var(--neon-cyan);
          color: #ffffff;
        }

        .order-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .platform-meta-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .platform-raw-name {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .slug-tag {
          font-family: monospace;
          font-size: 0.82rem;
          padding: 0.2rem 0.5rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--neon-cyan);
          font-weight: 600;
        }

        .icon-name-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .status-toggle-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.7rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .status-toggle-pill.active {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: var(--neon-emerald);
        }

        .status-toggle-pill.active:hover {
          background: rgba(16, 185, 129, 0.2);
        }

        .status-toggle-pill.inactive {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        .row-action-btns {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .empty-table-cell {
          text-align: center;
          padding: 3rem 1rem !important;
          color: var(--text-muted);
        }

        .icon-selector-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.65rem;
        }

        .icon-select-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.85rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-main);
          font-size: 0.82rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .icon-select-btn:hover {
          border-color: var(--border-neon);
          background: rgba(56, 189, 248, 0.08);
        }

        .icon-select-btn.selected {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--neon-cyan);
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
        }

        .badge-preview-box {
          padding: 1.25rem;
          background: var(--bg-input);
          border: 1px dashed var(--border-neon);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-overlay);
          backdrop-filter: blur(8px);
          z-index: 2500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-container {
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          border-radius: var(--radius-xl);
          background: var(--bg-card);
          color: var(--text-main);
          border: 1px solid var(--border-neon);
          box-shadow: var(--shadow-elevated);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .modal-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .modal-close-btn:hover {
          color: #f87171;
          background: rgba(239, 68, 68, 0.15);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .modal-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .modal-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .modal-actions-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-subtle);
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};

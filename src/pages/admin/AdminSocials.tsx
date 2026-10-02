import React, { useState } from 'react';
import { SocialLink } from '../../types';
import { SocialIcon } from '../../components/SocialIcons';
import {
  Share2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  X,
} from 'lucide-react';

interface AdminSocialsProps {
  socialLinks: SocialLink[];
  onSaveSocials: (links: SocialLink[]) => void;
}

const PLATFORM_PRESETS = [
  { platform: 'GitHub', label: 'GitHub', icon: 'github', defaultUrl: 'https://github.com/' },
  { platform: 'LinkedIn', label: 'LinkedIn', icon: 'linkedin', defaultUrl: 'https://linkedin.com/in/' },
  { platform: 'YouTube', label: 'YouTube', icon: 'youtube', defaultUrl: 'https://youtube.com/@' },
  { platform: 'Twitter', label: 'Twitter / X', icon: 'twitter', defaultUrl: 'https://x.com/' },
  { platform: 'Telegram', label: 'Telegram', icon: 'send', defaultUrl: 'https://t.me/' },
  { platform: 'Email', label: 'Email', icon: 'mail', defaultUrl: 'mailto:' },
  { platform: 'Website', label: 'Website', icon: 'globe', defaultUrl: 'https://' },
];

export const AdminSocials: React.FC<AdminSocialsProps> = ({ socialLinks, onSaveSocials }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  const [formPlatform, setFormPlatform] = useState('GitHub');
  const [formLabel, setFormLabel] = useState('GitHub');
  const [formUrl, setFormUrl] = useState('https://github.com/');
  const [formIcon, setFormIcon] = useState('github');

  const getPlatformIcon = (iconName: string) => {
    return <SocialIcon name={iconName} size={18} />;
  };

  const handleOpenAdd = () => {
    setEditingLink(null);
    setFormPlatform('GitHub');
    setFormLabel('GitHub');
    setFormUrl('https://github.com/');
    setFormIcon('github');
    setModalOpen(true);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setEditingLink(link);
    setFormPlatform(link.platform);
    setFormLabel(link.label);
    setFormUrl(link.url);
    setFormIcon(link.icon);
    setModalOpen(true);
  };

  const handlePresetSelect = (preset: typeof PLATFORM_PRESETS[0]) => {
    setFormPlatform(preset.platform);
    setFormLabel(preset.label);
    setFormIcon(preset.icon);
    if (!formUrl || formUrl.startsWith('https://github.com/')) {
      setFormUrl(preset.defaultUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formUrl.trim()) return;

    if (editingLink) {
      const updated = socialLinks.map((l) =>
        l.id === editingLink.id
          ? { ...l, platform: formPlatform, label: formLabel.trim(), url: formUrl.trim(), icon: formIcon }
          : l
      );
      onSaveSocials(updated);
    } else {
      const newLink: SocialLink = {
        id: `soc-${Date.now()}`,
        platform: formPlatform,
        label: formLabel.trim(),
        url: formUrl.trim(),
        icon: formIcon,
      };
      onSaveSocials([...socialLinks, newLink]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this social link?')) {
      onSaveSocials(socialLinks.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="admin-socials-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Social Links</h1>
          <p className="admin-page-subtitle">
            Manage your profiles across GitHub, LinkedIn, YouTube, X, Telegram, and more
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Social Link</span>
        </button>
      </div>

      <div className="socials-cards-grid">
        {socialLinks.map((link) => (
          <div key={link.id} className="social-link-admin-card neon-card">
            <div className="card-top">
              <div className="social-icon-box">{getPlatformIcon(link.icon)}</div>
              <div className="card-titles">
                <h3 className="social-label">{link.label}</h3>
                <span className="social-platform-pill">{link.platform}</span>
              </div>
            </div>

            <div className="social-url-row">
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="social-url-link"
                title={link.url}
              >
                <span>{link.url}</span>
                <ExternalLink size={13} />
              </a>
            </div>

            <div className="social-card-actions">
              <button
                onClick={() => handleOpenEdit(link)}
                className="btn-action edit"
                title="Edit link"
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(link.id)}
                className="btn-action delete"
                title="Delete link"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}

        {socialLinks.length === 0 && (
          <div className="empty-socials neon-card">
            <Share2 size={36} color="var(--neon-cyan)" />
            <h3>No Social Links Configured</h3>
            <p>Click "Add Social Link" above to add your developer profiles.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card neon-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLink ? `Edit ${editingLink.label}` : 'Add Social Link'}</h2>
              <button onClick={() => setModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Presets */}
              <div className="form-group">
                <label className="form-label">Platform Preset</label>
                <div className="presets-row">
                  {PLATFORM_PRESETS.map((p) => (
                    <button
                      key={p.platform}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={`preset-btn ${formPlatform === p.platform ? 'preset-active' : ''}`}
                    >
                      {getPlatformIcon(p.icon)}
                      <span>{p.platform}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Display Label *</label>
                <input
                  type="text"
                  required
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="e.g. GitHub, Follow on X"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Profile / Destination URL *</label>
                <input
                  type="url"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  className="form-input"
                />
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLink ? 'Save Changes' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-socials-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .socials-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .empty-socials {
          grid-column: 1 / -1;
          padding: 3rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .empty-socials h3 {
          color: var(--text-main);
          font-size: 1.15rem;
          font-weight: 700;
        }

        .empty-socials p {
          color: var(--text-muted);
          font-size: 0.88rem;
        }

        .social-link-admin-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: var(--bg-card);
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .social-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--neon-cyan);
          flex-shrink: 0;
        }

        .card-titles {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }

        .social-label {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }

        .social-platform-pill {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .social-url-row {
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.75rem;
          overflow: hidden;
        }

        .social-url-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          color: var(--neon-cyan);
          font-size: 0.82rem;
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .social-url-link span {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .social-card-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .btn-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid;
          transition: all 0.15s ease;
        }

        .btn-action.edit {
          background: rgba(56, 189, 248, 0.08);
          border-color: rgba(56, 189, 248, 0.25);
          color: var(--neon-cyan);
        }

        .btn-action.edit:hover {
          background: rgba(56, 189, 248, 0.2);
        }

        .btn-action.delete {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.25);
          color: #f87171;
        }

        .btn-action.delete:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .presets-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .preset-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-full);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          color: var(--text-main);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
        }

        .preset-active {
          border-color: var(--neon-cyan) !important;
          background: rgba(56, 189, 248, 0.15) !important;
          color: var(--neon-cyan) !important;
          font-weight: 700;
        }

        /* Modal Styles */
        .admin-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-overlay);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
        }

        .admin-modal-card {
          width: 100%;
          max-width: 550px;
          background: var(--bg-card);
          color: var(--text-main);
          border: 1px solid var(--border-neon);
          border-radius: var(--radius-xl);
          padding: 2rem;
          box-shadow: var(--shadow-elevated);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 1.25rem;
        }

        .modal-header h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }

        .modal-close-btn {
          background: var(--bg-tertiary);
          border: none;
          color: var(--text-muted);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .modal-close-btn:hover {
          color: #f87171;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .form-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .modal-footer-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }

        @media (max-width: 900px) {
          .socials-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

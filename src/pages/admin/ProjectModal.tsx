import React, { useState, useEffect, useRef } from 'react';
import { Project, Platform } from '../../types';
import { PlatformBadge } from '../../components/PlatformBadge';
import { dataService } from '../../services/dataService';
import { initialPlatforms } from '../../services/mockData';
import {
  X,
  Plus,
  Trash2,
  Check,
  MoveUp,
  MoveDown,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Home,
  Music,
  Film,
  Send,
  MessageCircle,
  Disc,
} from 'lucide-react';
import { generateAppScreenshot } from '../../assets/mockScreenshots';

interface ProjectModalProps {
  project?: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  platforms?: Platform[];
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
  platforms: platformsProp,
}) => {
  const isEditing = Boolean(project?.id);

  // Available platforms for checkboxes
  const availablePlatforms = platformsProp && platformsProp.length > 0
    ? platformsProp
    : dataService.getActivePlatforms().length > 0
    ? dataService.getActivePlatforms()
    : initialPlatforms;

  const [formData, setFormData] = useState<Project>(() => ({
    id: project?.id || '',
    title: project?.title || '',
    slug: project?.slug || '',
    subtitle: project?.subtitle || '',
    shortDescription: project?.shortDescription || '',
    fullDescription: project?.fullDescription || '',
    category: project?.category || 'mobile',
    icon: project?.icon || '',
    iconBg: project?.iconBg || '',
    icon_url: project?.icon_url || project?.iconUrl || '',
    iconUrl: project?.icon_url || project?.iconUrl || '',
    icon_storage_path: project?.icon_storage_path || '',
    version: project?.version || 'v1.0.0',
    apkSize: project?.apkSize || '15 MB',
    lastUpdated: project?.lastUpdated || new Date().toISOString().split('T')[0],
    featured: project?.featured ?? true,
    playStoreEnabled: project?.playStoreEnabled ?? true,
    playStoreUrl: project?.playStoreUrl || '',
    apkDownloadEnabled: project?.apkDownloadEnabled ?? true,
    apkDownloadUrl: project?.apkDownloadUrl || '',
    platforms: project?.platforms || ['Android App'],
    technologies: project?.technologies || ['Flutter', 'Firebase'],
    features: project?.features || [
      'Property Management (Add / Edit / Delete)',
      'Tenant Management (Add / Edit / Delete)',
      'PDF Bill Generation',
    ],
    screenshots: project?.screenshots || [
      generateAppScreenshot('New App', '#38bdf8', 'Overview', 'dashboard'),
      generateAppScreenshot('New App', '#38bdf8', 'Details', 'detail'),
    ],
  }));

  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  // Icon upload state
  const iconFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [iconUploadError, setIconUploadError] = useState<string | null>(null);
  const [iconDimensions, setIconDimensions] = useState<{ width: number; height: number } | null>(null);

  // Detect if a real image icon is present
  const currentRealIcon =
    formData.icon_url ||
    formData.iconUrl ||
    (formData.icon && (formData.icon.startsWith('http') || formData.icon.startsWith('data:') || formData.icon.startsWith('/'))
      ? formData.icon
      : '');

  useEffect(() => {
    setIconUploadError(null);
    setIconDimensions(null);
    if (project) {
      setFormData({
        ...project,
        icon_url: project.icon_url || project.iconUrl || '',
        iconUrl: project.icon_url || project.iconUrl || '',
        icon_storage_path: project.icon_storage_path || '',
        platforms:
          project.platforms && project.platforms.length > 0
            ? project.platforms
            : project.category === 'web'
            ? ['Web Application']
            : ['Android App'],
      });
    } else {
      setFormData({
        id: '',
        title: '',
        slug: '',
        subtitle: '',
        shortDescription: '',
        fullDescription: '',
        category: 'mobile',
        icon: '',
        iconBg: '',
        icon_url: '',
        iconUrl: '',
        icon_storage_path: '',
        version: 'v1.0.0',
        apkSize: '15 MB',
        lastUpdated: new Date().toISOString().split('T')[0],
        featured: true,
        playStoreEnabled: true,
        playStoreUrl: '',
        apkDownloadEnabled: true,
        apkDownloadUrl: '',
        platforms: ['Android App'],
        technologies: ['Flutter', 'Firebase'],
        features: [
          'Property Management (Add / Edit / Delete)',
          'Tenant Management (Add / Edit / Delete)',
          'PDF Bill Generation',
        ],
        screenshots: [
          generateAppScreenshot('New App', '#38bdf8', 'Overview', 'dashboard'),
          generateAppScreenshot('New App', '#38bdf8', 'Details', 'detail'),
        ],
      });
    }
  }, [project, isOpen]);

  const handleTogglePlatform = (platformName: string) => {
    const current = formData.platforms || [];
    if (current.includes(platformName)) {
      const updated = current.filter((p) => p !== platformName);
      setFormData({
        ...formData,
        platforms: updated.length > 0 ? updated : [platformName],
      });
    } else {
      setFormData({
        ...formData,
        platforms: [...current, platformName],
      });
    }
  };

  if (!isOpen) return null;

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    if (!formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
    }
    setTechInput('');
  };

  const handleRemoveTech = (index: number) => {
    const updated = formData.technologies.filter((_, i) => i !== index);
    setFormData({ ...formData, technologies: updated });
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFormData({
      ...formData,
      features: [...formData.features, featureInput.trim()],
    });
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  const handleAddMockScreenshot = () => {
    const newScreenshot = generateAppScreenshot(
      formData.title || 'App',
      '#a855f7',
      `Screen ${formData.screenshots.length + 1}`,
      formData.screenshots.length % 2 === 0 ? 'detail' : 'analytics'
    );
    setFormData({
      ...formData,
      screenshots: [...formData.screenshots, newScreenshot],
    });
  };

  const handleMoveScreenshot = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.screenshots.length) return;
    const items = [...formData.screenshots];
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    setFormData({ ...formData, screenshots: items });
  };

  const handleRemoveScreenshot = (index: number) => {
    setFormData({
      ...formData,
      screenshots: formData.screenshots.filter((_, i) => i !== index),
    });
  };

  const handleIconFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIconUploadError(null);

    // 1. Validate file format (PNG, JPG, WebP, SVG)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setIconUploadError('Unsupported format. Please upload PNG, JPG, WebP, or SVG.');
      if (iconFileInputRef.current) iconFileInputRef.current.value = '';
      return;
    }

    // 2. Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setIconUploadError('File exceeds 5MB size limit. Please upload a smaller image.');
      if (iconFileInputRef.current) iconFileInputRef.current.value = '';
      return;
    }

    // 3. Validate image dimensions via Image loader
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = async () => {
      setIconDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);

      try {
        setIsUploadingIcon(true);
        const projectId = formData.id || `proj_${Date.now()}`;
        if (!formData.id) {
          setFormData((prev) => ({ ...prev, id: projectId }));
        }

        const res = await dataService.uploadProjectIcon(projectId, file);
        setFormData((prev) => ({
          ...prev,
          id: prev.id || projectId,
          icon_url: res.icon_url,
          iconUrl: res.icon_url,
          icon_storage_path: res.icon_storage_path,
          icon: res.icon_url,
        }));
      } catch (err: any) {
        console.error('Failed to upload app icon:', err);
        setIconUploadError(err.message || 'Failed to upload icon. Please try again.');
      } finally {
        setIsUploadingIcon(false);
        if (iconFileInputRef.current) iconFileInputRef.current.value = '';
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setIconUploadError('Could not decode image file. Please choose a valid image.');
      if (iconFileInputRef.current) iconFileInputRef.current.value = '';
    };

    img.src = objectUrl;
  };

  const handleRemoveIcon = async () => {
    if (formData.icon_storage_path) {
      try {
        await dataService.removeProjectIcon(formData.icon_storage_path);
      } catch (err) {
        console.warn('Could not remove storage icon:', err);
      }
    }
    setFormData((prev) => ({
      ...prev,
      icon_url: '',
      iconUrl: '',
      icon_storage_path: '',
      icon: '',
    }));
    setIconDimensions(null);
    setIconUploadError(null);
  };

  const renderLegacyIcon = (iconName?: string) => {
    switch ((iconName || '').toLowerCase()) {
      case 'home':
        return <Home size={30} color="#ffffff" />;
      case 'music':
        return <Music size={30} color="#ffffff" />;
      case 'film':
        return <Film size={30} color="#ffffff" />;
      case 'send':
        return <Send size={30} color="#ffffff" />;
      case 'message-circle':
        return <MessageCircle size={30} color="#ffffff" />;
      case 'disc':
        return <Disc size={30} color="#ffffff" />;
      default:
        return <ImageIcon size={30} color="#ffffff" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    onSave({
      ...formData,
      slug,
      shortDescription: formData.shortDescription || formData.subtitle,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container neon-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit App' : 'Add New App'}</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form Body matching Panel 11 */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid-2col">
            {/* App Name */}
            <div className="form-field">
              <label className="modal-label">App Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rentora"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="modal-input"
              />
            </div>

            {/* Subtitle / Short Description */}
            <div className="form-field">
              <label className="modal-label">Subtitle / Tagline</label>
              <input
                type="text"
                placeholder="e.g. Property & Tenant Management App"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="modal-input"
              />
            </div>
          </div>

          {/* Full Description */}
          <div className="form-field">
            <label className="modal-label">Full Description</label>
            <textarea
              rows={3}
              placeholder="Enter detailed description of what the app does..."
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="modal-textarea"
            />
          </div>

          <div className="form-grid-3col">
            {/* Category */}
            <div className="form-field">
              <label className="modal-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="modal-select"
              >
                <option value="mobile">Mobile Apps</option>
                <option value="web">Web Apps</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            {/* Version */}
            <div className="form-field">
              <label className="modal-label">Version</label>
              <input
                type="text"
                placeholder="e.g. v1.4.0"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="modal-input"
              />
            </div>

            {/* APK Size */}
            <div className="form-field">
              <label className="modal-label">APK Size</label>
              <input
                type="text"
                placeholder="e.g. 18 MB"
                value={formData.apkSize}
                onChange={(e) => setFormData({ ...formData, apkSize: e.target.value })}
                className="modal-input"
              />
            </div>
          </div>

          {/* App Icon Upload Section (Replaced Predefined Icon Style & Gradient) */}
          <div className="form-field app-icon-field">
            <label className="modal-label">App Icon</label>
            <p className="app-icon-helper">
              Upload the official app icon. Supported formats: PNG, JPG, WebP, SVG (Recommended: 512×512 square PNG/WebP, max 5MB).
            </p>

            {/* Hidden file input */}
            <input
              ref={iconFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={handleIconFileChange}
            />

            {iconUploadError && (
              <div className="icon-upload-error-box">
                <AlertCircle size={16} />
                <span>{iconUploadError}</span>
              </div>
            )}

            {currentRealIcon ? (
              /* Actual App Icon Preview with Replace & Remove */
              <div className="app-icon-card-preview">
                <div className="app-icon-display-frame">
                  <img
                    src={currentRealIcon}
                    alt="App Icon Preview"
                    className="app-icon-preview-img"
                  />
                </div>
                <div className="app-icon-preview-details">
                  <div className="app-icon-badge-row">
                    <span className="app-icon-active-badge">
                      <CheckCircle2 size={14} />
                      <span>Official App Icon</span>
                    </span>
                    {iconDimensions && (
                      <span className="app-icon-dimension-badge">
                        {iconDimensions.width} × {iconDimensions.height} px
                      </span>
                    )}
                  </div>
                  <div className="app-icon-btns-row">
                    <button
                      type="button"
                      className="btn-replace-icon"
                      onClick={() => iconFileInputRef.current?.click()}
                      disabled={isUploadingIcon}
                    >
                      <RefreshCw size={14} className={isUploadingIcon ? 'spin-icon' : ''} />
                      <span>{isUploadingIcon ? 'Uploading...' : 'Replace Icon'}</span>
                    </button>
                    <button
                      type="button"
                      className="btn-remove-icon"
                      onClick={handleRemoveIcon}
                      disabled={isUploadingIcon}
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : isEditing && formData.icon && !currentRealIcon ? (
              /* Legacy project fallback state: shows old placeholder icon with button to upload actual app icon */
              <div className="app-icon-card-preview fallback-mode">
                <div
                  className="app-icon-display-frame legacy-frame"
                  style={{ background: formData.iconBg || 'var(--card-bg)' }}
                >
                  {renderLegacyIcon(formData.icon)}
                </div>
                <div className="app-icon-preview-details">
                  <div className="app-icon-badge-row">
                    <span className="app-icon-fallback-badge">Legacy Placeholder Icon</span>
                  </div>
                  <p className="app-icon-fallback-desc">
                    This project currently uses an old generated icon placeholder. Upload the actual app icon to replace it everywhere.
                  </p>
                  <button
                    type="button"
                    className="btn-upload-real-icon"
                    onClick={() => iconFileInputRef.current?.click()}
                    disabled={isUploadingIcon}
                  >
                    <Upload size={14} />
                    <span>{isUploadingIcon ? 'Uploading...' : 'Upload Actual App Icon'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* New project / empty state: dropzone */
              <div
                className="app-icon-upload-dropzone"
                onClick={() => iconFileInputRef.current?.click()}
              >
                <div className="dropzone-circle">
                  <Upload size={22} />
                </div>
                <div className="dropzone-info">
                  <span className="dropzone-title">
                    {isUploadingIcon ? 'Uploading App Icon...' : 'Upload App Icon'}
                  </span>
                  <span className="dropzone-subtitle">Click to choose PNG, JPG, WebP, or SVG</span>
                </div>
              </div>
            )}
          </div>

          {/* Store & Download Settings matching Panel 11 */}
          <div className="toggles-card neon-card">
            <div className="toggle-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.playStoreEnabled}
                  onChange={(e) => setFormData({ ...formData, playStoreEnabled: e.target.checked })}
                />
                <span>Show Play Store Button</span>
              </label>

              {formData.playStoreEnabled && (
                <input
                  type="url"
                  placeholder="Play Store Link (https://play.google.com/...)"
                  value={formData.playStoreUrl}
                  onChange={(e) => setFormData({ ...formData, playStoreUrl: e.target.value })}
                  className="modal-input store-url-input"
                />
              )}
            </div>

            <div className="toggle-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.apkDownloadEnabled}
                  onChange={(e) => setFormData({ ...formData, apkDownloadEnabled: e.target.checked })}
                />
                <span>Show APK Download Button</span>
              </label>

              {formData.apkDownloadEnabled && (
                <input
                  type="url"
                  placeholder="APK URL (Cloudflare R2 / Direct link)"
                  value={formData.apkDownloadUrl}
                  onChange={(e) => setFormData({ ...formData, apkDownloadUrl: e.target.value })}
                  className="modal-input store-url-input"
                />
              )}
            </div>

            <div className="toggle-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span>Mark as Featured (Appears on Home Page)</span>
              </label>
            </div>
          </div>

          {/* Platforms (Multi-select) */}
          <div className="form-field">
            <div className="label-with-action">
              <label className="modal-label">Platforms (Shown on Project Card Badges)</label>
              <span className="field-hint-text">Select one or more platforms:</span>
            </div>
            <div className="platforms-checkbox-matrix">
              {availablePlatforms.map((plat) => {
                const isSelected = (formData.platforms || []).includes(plat.name);
                return (
                  <label
                    key={plat.id}
                    className={`platform-checkbox-card ${isSelected ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTogglePlatform(plat.name)}
                    />
                    <PlatformBadge name={plat.name} icon={plat.icon} size="small" />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Technologies Input */}
          <div className="form-field">
            <div className="label-with-action">
              <label className="modal-label">Technologies Used (Shown on Project Details Page)</label>
              <span className="field-hint-text">e.g. Flutter, Firebase, Cloudinary, Dio</span>
            </div>
            <div className="chip-input-row">
              <input
                type="text"
                placeholder="Add technology..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                className="modal-input"
              />
              <button type="button" onClick={handleAddTech} className="btn btn-secondary add-chip-btn">
                Add
              </button>
            </div>

            <div className="chips-container">
              {formData.technologies.map((t, idx) => (
                <span key={idx} className="removable-chip">
                  <span>{t}</span>
                  <button type="button" onClick={() => handleRemoveTech(idx)} className="chip-remove">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="form-field">
            <label className="modal-label">Key Features Checklist</label>
            <div className="chip-input-row">
              <input
                type="text"
                placeholder="e.g. Realtime PDF Bill Download"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="modal-input"
              />
              <button type="button" onClick={handleAddFeature} className="btn btn-secondary add-chip-btn">
                Add Feature
              </button>
            </div>

            <div className="features-edit-list">
              {formData.features.map((f, idx) => (
                <div key={idx} className="feature-edit-item">
                  <Check size={14} color="#10b981" />
                  <span className="feature-edit-text">{f}</span>
                  <button type="button" onClick={() => handleRemoveFeature(idx)} className="feature-del-btn">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshots Manager */}
          <div className="form-field">
            <div className="label-with-action">
              <label className="modal-label">Screenshots ({formData.screenshots.length})</label>
              <button type="button" onClick={handleAddMockScreenshot} className="add-screenshot-btn">
                <Plus size={14} />
                <span>Add Mock Screen</span>
              </button>
            </div>

            <div className="screenshots-preview-strip">
              {formData.screenshots.map((s, idx) => (
                <div key={idx} className="modal-screen-thumb">
                  <img src={s} alt={`Screen ${idx + 1}`} />
                  <div className="screen-reorder-actions">
                    {idx > 0 && (
                      <button type="button" onClick={() => handleMoveScreenshot(idx, 'up')} title="Move left">
                        <MoveUp size={11} />
                      </button>
                    )}
                    {idx < formData.screenshots.length - 1 && (
                      <button type="button" onClick={() => handleMoveScreenshot(idx, 'down')} title="Move right">
                        <MoveDown size={11} />
                      </button>
                    )}
                    <button type="button" onClick={() => handleRemoveScreenshot(idx)} title="Delete screen">
                      <Trash2 size={11} color="#f87171" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Footer matching Panel 11 */}
          <div className="modal-actions-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span>Save App</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
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
          max-width: 740px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2.25rem;
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
          margin-bottom: 1.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .modal-title {
          font-size: 1.6rem;
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
          background: rgba(239, 68, 68, 0.2);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }

        .form-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .form-grid-3col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .modal-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .modal-input,
        .modal-textarea,
        .modal-select {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          color: var(--text-main);
          font-size: 0.9rem;
          transition: border-color var(--transition-fast);
        }

        .modal-input:focus,
        .modal-textarea:focus,
        .modal-select:focus {
          outline: none;
          border-color: var(--neon-cyan);
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
        }

        .app-icon-field {
          margin-bottom: 0.5rem;
        }

        .app-icon-helper {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .icon-upload-error-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.85rem;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: var(--radius-sm);
          color: #fca5a5;
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }

        .app-icon-card-preview {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.1rem;
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .app-icon-display-frame {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          overflow: hidden;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .app-icon-preview-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .app-icon-display-frame.legacy-frame {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .app-icon-preview-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .app-icon-badge-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .app-icon-active-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #34d399;
          background: rgba(16, 185, 129, 0.15);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .app-icon-fallback-badge {
          font-size: 0.8rem;
          font-weight: 600;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.15);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .app-icon-fallback-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .app-icon-dimension-badge {
          font-size: 0.78rem;
          color: var(--text-dim);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .app-icon-btns-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-top: 0.2rem;
        }

        .btn-replace-icon,
        .btn-upload-real-icon {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          background: rgba(56, 189, 248, 0.12);
          color: var(--neon-cyan);
          border: 1px solid var(--border-neon);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-replace-icon:hover,
        .btn-upload-real-icon:hover {
          background: rgba(56, 189, 248, 0.22);
          transform: translateY(-1px);
        }

        .btn-remove-icon {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-remove-icon:hover {
          background: rgba(239, 68, 68, 0.22);
          transform: translateY(-1px);
        }

        .app-icon-upload-dropzone {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          border: 2px dashed rgba(56, 189, 248, 0.3);
          background: rgba(56, 189, 248, 0.03);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .app-icon-upload-dropzone:hover {
          border-color: var(--neon-cyan);
          background: rgba(56, 189, 248, 0.07);
        }

        .dropzone-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.12);
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dropzone-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .dropzone-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .dropzone-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .toggles-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .toggle-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: var(--text-main);
          font-weight: 500;
          cursor: pointer;
        }

        .store-url-input {
          flex: 1;
          min-width: 250px;
        }

        .chip-input-row {
          display: flex;
          gap: 0.75rem;
        }

        .add-chip-btn {
          padding: 0.5rem 1.2rem;
          font-size: 0.85rem;
        }

        .platforms-checkbox-matrix {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        .platform-checkbox-card {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.55rem 0.85rem;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-main);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .platform-checkbox-card:hover {
          background: rgba(56, 189, 248, 0.08);
          border-color: var(--border-neon);
        }

        .platform-checkbox-card.selected {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--neon-cyan);
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
        }

        .field-hint-text {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 400;
        }

        .chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .removable-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid var(--border-neon);
          color: var(--neon-cyan);
          font-size: 0.82rem;
          font-weight: 500;
        }

        .chip-remove {
          color: var(--text-muted);
          font-size: 1.1rem;
          line-height: 1;
        }

        .chip-remove:hover {
          color: #ef4444;
        }

        .features-edit-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .feature-edit-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          padding: 0.45rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          color: var(--text-main);
        }

        .feature-edit-text {
          flex: 1;
        }

        .feature-del-btn {
          color: var(--text-muted);
          padding: 0.2rem;
        }

        .feature-del-btn:hover {
          color: #ef4444;
        }

        .label-with-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .add-screenshot-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--neon-cyan);
          font-weight: 600;
        }

        .screenshots-preview-strip {
          display: flex;
          gap: 0.85rem;
          overflow-x: auto;
          padding: 0.5rem 0;
        }

        .modal-screen-thumb {
          width: 75px;
          height: 135px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #000;
          border: 1px solid var(--border-subtle);
          position: relative;
          flex-shrink: 0;
        }

        .modal-screen-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .screen-reorder-actions {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0.2rem;
        }

        .screen-reorder-actions button {
          color: #ffffff;
          padding: 0.15rem;
        }

        .modal-actions-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-subtle);
          margin-top: 0.75rem;
        }

        @media (max-width: 680px) {
          .form-grid-2col,
          .form-grid-3col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

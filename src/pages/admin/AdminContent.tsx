import React, { useState, useRef } from 'react';
import { WebsiteContent, SocialLink } from '../../types';
import { Save, Sparkles, User, Mail, Globe, Check, Upload, RefreshCw } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface AdminContentProps {
  content: WebsiteContent;
  socialLinks: SocialLink[];
  onSaveContent: (newContent: WebsiteContent) => void;
  onSaveSocials: (newLinks: SocialLink[]) => void;
}

export const AdminContent: React.FC<AdminContentProps> = ({
  content,
  socialLinks,
  onSaveContent,
  onSaveSocials,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'socials'>('home');
  const [formData, setFormData] = useState<WebsiteContent>({ ...content });
  const [socialsData, setSocialsData] = useState<SocialLink[]>([...socialLinks]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Avatar upload state (Supabase 'Avatar Image' bucket)
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploadError(null);
    setIsUploadingAvatar(true);

    try {
      const res = await dataService.uploadAvatarImage(file);
      if (res?.url) {
        setFormData((prev) => ({
          ...prev,
          about: { ...prev.about, avatarUrl: res.url },
        }));
      }
    } catch (err: any) {
      console.error('Failed to upload avatar:', err);
      setAvatarUploadError(err.message || 'Failed to upload avatar.');
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = '';
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContent(formData);
    onSaveSocials(socialsData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSocialChange = (index: number, newUrl: string) => {
    const updated = [...socialsData];
    updated[index] = { ...updated[index], url: newUrl };
    setSocialsData(updated);
  };

  return (
    <div className="admin-content-view">
      {/* Title */}
      <div className="content-mgmt-header">
        <div>
          <h1 className="admin-view-title">Website Content Management</h1>
          <p className="admin-view-subtitle">Edit copy, hero banners, about info, and social profiles</p>
        </div>

        {savedSuccess && (
          <div className="save-success-pill">
            <Check size={16} />
            <span>Changes Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs matching Panel 13 */}
      <div className="content-tabs-bar">
        <button
          className={`content-tab-btn ${activeTab === 'home' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Sparkles size={16} />
          <span>Home Section</span>
        </button>
        <button
          className={`content-tab-btn ${activeTab === 'about' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <User size={16} />
          <span>About Section</span>
        </button>
        <button
          className={`content-tab-btn ${activeTab === 'contact' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <Mail size={16} />
          <span>Contact Section</span>
        </button>
        <button
          className={`content-tab-btn ${activeTab === 'socials' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('socials')}
        >
          <Globe size={16} />
          <span>Social Links</span>
        </button>
      </div>

      {/* Tab Form Card */}
      <form onSubmit={handleSave} className="content-form-card neon-card">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="form-section-fields">
            <h3 className="section-form-title">Hero Section</h3>

            <div className="form-grid-2col">
              <div className="form-field">
                <label className="modal-label">Hero Title / Name</label>
                <input
                  type="text"
                  value={formData.hero.developerTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, developerTitle: e.target.value },
                    })
                  }
                  className="modal-input"
                />
              </div>

              <div className="form-field">
                <label className="modal-label">Hero Subtitle</label>
                <input
                  type="text"
                  value={formData.hero.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, subtitle: e.target.value },
                    })
                  }
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="modal-label">Tech Stack Tags</label>
              <input
                type="text"
                value={formData.hero.techStack}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, techStack: e.target.value },
                  })
                }
                className="modal-input"
              />
            </div>

            <div className="form-field">
              <label className="modal-label">Hero Description</label>
              <textarea
                rows={3}
                value={formData.hero.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, description: e.target.value },
                  })
                }
                className="modal-textarea"
              />
            </div>

            {/* Statistics */}
            <h3 className="section-form-title" style={{ marginTop: '1.5rem' }}>Statistics Counter</h3>
            <div className="form-grid-3col">
              <div className="form-field">
                <label className="modal-label">Apps Developed</label>
                <input
                  type="text"
                  value={formData.stats.appsDeveloped}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, appsDeveloped: e.target.value },
                    })
                  }
                  className="modal-input"
                />
              </div>
              <div className="form-field">
                <label className="modal-label">Years Experience</label>
                <input
                  type="text"
                  value={formData.stats.yearsExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, yearsExperience: e.target.value },
                    })
                  }
                  className="modal-input"
                />
              </div>
              <div className="form-field">
                <label className="modal-label">Passion Metric</label>
                <input
                  type="text"
                  value={formData.stats.passion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, passion: e.target.value },
                    })
                  }
                  className="modal-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="form-section-fields">
            <h3 className="section-form-title">About Me Bio & Portrait</h3>

            <div className="form-grid-2col">
              <div className="form-field">
                <label className="modal-label">Main Heading</label>
                <input
                  type="text"
                  value={formData.about.heading}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, heading: e.target.value },
                    })
                  }
                  className="modal-input"
                />
              </div>

              <div className="form-field">
                <label className="modal-label">Author Name</label>
                <input
                  type="text"
                  value={formData.about.authorName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, authorName: e.target.value },
                    })
                  }
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-field">
              <div className="label-with-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="modal-label" style={{ marginBottom: 0 }}>Avatar Profile Image</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    title="Upload image to Supabase 'Avatar Image' bucket"
                  >
                    {isUploadingAvatar ? (
                      <RefreshCw size={13} className="spin-icon" />
                    ) : (
                      <Upload size={13} />
                    )}
                    <span>{isUploadingAvatar ? 'Uploading...' : 'Upload to Supabase'}</span>
                  </button>
                </div>
              </div>

              {avatarUploadError && (
                <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', color: '#f87171', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  {avatarUploadError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {formData.about.avatarUrl && (
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--neon-cyan)', flexShrink: 0 }}>
                    <img src={formData.about.avatarUrl} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <input
                  type="url"
                  placeholder="https://... or upload above"
                  value={formData.about.avatarUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, avatarUrl: e.target.value },
                    })
                  }
                  className="modal-input"
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="modal-label">Bio Description</label>
              <textarea
                rows={4}
                value={formData.about.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, description: e.target.value },
                  })
                }
                className="modal-textarea"
              />
            </div>

            <div className="form-field">
              <label className="modal-label">Handwritten Signature Quote</label>
              <input
                type="text"
                value={formData.about.signatureText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, signatureText: e.target.value },
                  })
                }
                className="modal-input"
              />
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="form-section-fields">
            <h3 className="section-form-title">Contact Information</h3>

            <div className="form-grid-3col">
              <div className="form-field">
                <label className="modal-label">Contact Email</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                    })
                  }
                  className="modal-input"
                />
              </div>

              <div className="form-field">
                <label className="modal-label">Phone Number</label>
                <input
                  type="text"
                  value={formData.contact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, phone: e.target.value },
                    })
                  }
                  className="modal-input"
                />
              </div>

              <div className="form-field">
                <label className="modal-label">Location / Country</label>
                <input
                  type="text"
                  value={formData.contact.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, location: e.target.value },
                    })
                  }
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="modal-label">Contact Intro Text</label>
              <textarea
                rows={3}
                value={formData.contact.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, description: e.target.value },
                  })
                }
                className="modal-textarea"
              />
            </div>
          </div>
        )}

        {/* SOCIAL LINKS TAB matching Panel 13 */}
        {activeTab === 'socials' && (
          <div className="form-section-fields">
            <h3 className="section-form-title">Social Media Profiles</h3>
            <p className="section-form-sub">Manage profile links displayed in the contact and footer sections</p>

            <div className="socials-edit-grid">
              {socialsData.map((s, idx) => (
                <div key={s.id} className="form-field">
                  <label className="modal-label">{s.label} URL</label>
                  <input
                    type="url"
                    value={s.url}
                    onChange={(e) => handleSocialChange(idx, e.target.value)}
                    className="modal-input"
                    placeholder={`https://${s.platform.toLowerCase()}.com/...`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="content-save-row">
          <button type="submit" className="btn btn-primary">
            <Save size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </form>

      <style>{`
        .admin-content-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .content-mgmt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .save-success-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-full);
          color: #34d399;
          font-size: 0.85rem;
          font-weight: 600;
          animation: slideInRight 0.25s ease-out;
        }

        .content-tabs-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .content-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .content-tab-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--border-neon);
        }

        .tab-active {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
          font-weight: 700;
        }

        .content-form-card {
          padding: 2.25rem;
          border-radius: var(--radius-lg);
        }

        .section-form-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .section-form-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .modal-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .modal-input,
        .modal-textarea {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .form-section-fields {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .socials-edit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .content-save-row {
          display: flex;
          justify-content: flex-end;
          padding-top: 2rem;
          margin-top: 1.5rem;
          border-top: 1px solid var(--border-subtle);
        }

        @media (max-width: 768px) {
          .socials-edit-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

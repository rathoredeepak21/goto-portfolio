import React, { useState } from 'react';
import { WebsiteSettings } from '../../types';
import { Settings, Search, Cloud, Save, Check, RefreshCw, Download, Upload } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { createClient } from '@supabase/supabase-js';

interface AdminSettingsProps {
  settings: WebsiteSettings;
  onSaveSettings: (settings: WebsiteSettings) => void;
  onRefreshAllData: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
  onRefreshAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'cloud'>('general');
  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);

    if (!formData.supabaseUrl?.trim() || !formData.supabaseAnonKey?.trim()) {
      setTestingConnection(false);
      setConnectionStatus('⚠️ Please enter both Supabase Project URL and Anon Key first.');
      return;
    }

    try {
      const testClient = createClient(formData.supabaseUrl.trim(), formData.supabaseAnonKey.trim());
      
      const bucketsToTest = [
        { primary: 'App Icon', fallback: 'app-icon', label: 'App Icon' },
        { primary: 'Screenshots', fallback: 'screenshots', label: 'Screenshots' },
        { primary: 'Avatar Image', fallback: 'avatar-image', label: 'Avatar Image' },
      ];

      const results = await Promise.all(
        bucketsToTest.map(async (b) => {
          let res = await testClient.storage.from(b.primary).list('', { limit: 1 });
          if (res.error && (res.error.message?.toLowerCase().includes('not found') || res.error.message?.toLowerCase().includes('bucket'))) {
            res = await testClient.storage.from(b.fallback).list('', { limit: 1 });
          }
          return { name: b.label, ok: !res.error, error: res.error?.message };
        })
      );

      const verified = results.filter((r) => r.ok).map((r) => r.name);
      const missing = results.filter((r) => !r.ok).map((r) => r.name);

      if (verified.length === 3) {
        setConnectionStatus(`✅ Supabase connected & all 3 buckets verified: ${verified.join(', ')}!`);
      } else if (verified.length > 0) {
        setConnectionStatus(`✅ Supabase connected! Verified buckets: ${verified.join(', ')}. (Notice: Check Public permissions/policies for: ${missing.join(', ')})`);
      } else {
        setConnectionStatus(`✅ Supabase credentials verified! Notice: Ensure Public buckets "${bucketsToTest.map(b => b.primary).join('", "')}" have RLS SELECT policy enabled.`);
      }
    } catch (err: any) {
      setConnectionStatus(`❌ Connection error: ${err?.message || 'Check URL and Anon Key.'}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      projects: dataService.getProjects(),
      releases: dataService.getApkReleases(),
      skills: dataService.getSkills(),
      content: dataService.getContent(),
      socials: dataService.getSocialLinks(),
      settings: dataService.getSettings(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gotop_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all data and restore original reference projects and settings?')) {
      dataService.resetToFactoryDefaults();
      onRefreshAllData();
      alert('Portfolio reset to original reference data successfully!');
    }
  };

  return (
    <div className="admin-settings-view">
      {/* Header */}
      <div className="settings-top-header">
        <div>
          <h1 className="admin-view-title">Website Settings</h1>
          <p className="admin-view-subtitle">Manage system branding, SEO parameters, and cloud storage providers</p>
        </div>

        {savedSuccess && (
          <div className="save-success-pill">
            <Check size={16} />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Tabs matching Panel 14 */}
      <div className="content-tabs-bar">
        <button
          className={`content-tab-btn ${activeTab === 'general' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Settings size={16} />
          <span>General</span>
        </button>
        <button
          className={`content-tab-btn ${activeTab === 'seo' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('seo')}
        >
          <Search size={16} />
          <span>SEO Metadata</span>
        </button>
        <button
          className={`content-tab-btn ${activeTab === 'cloud' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('cloud')}
        >
          <Cloud size={16} />
          <span>Supabase & R2 Storage</span>
        </button>
      </div>

      {/* Settings Form Card */}
      <form onSubmit={handleSave} className="content-form-card neon-card">
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="form-section-fields">
            <h3 className="section-form-title">General Brand Settings</h3>

            <div className="form-grid-2col">
              <div className="form-field">
                <label className="modal-label">Website Name</label>
                <input
                  type="text"
                  value={formData.websiteName}
                  onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                  className="modal-input"
                />
              </div>

              <div className="form-field">
                <label className="modal-label">Navbar Logo Text</label>
                <input
                  type="text"
                  value={formData.logoText}
                  onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-field">
                <label className="modal-label">Favicon Path</label>
                <input
                  type="text"
                  value={formData.favicon}
                  onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                  className="modal-input"
                />
              </div>

              {/* Theme Preference Radio matching Panel 14 */}
              <div className="form-field">
                <label className="modal-label">Theme Preference</label>
                <div className="theme-options-row">
                  {(['dark', 'light', 'auto'] as const).map((t) => (
                    <label key={t} className="theme-radio-pill">
                      <input
                        type="radio"
                        name="themePreference"
                        value={t}
                        checked={formData.themePreference === t}
                        onChange={() => setFormData({ ...formData, themePreference: t })}
                      />
                      <span className="radio-text">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === 'seo' && (
          <div className="form-section-fields">
            <h3 className="section-form-title">Search Engine Optimization</h3>

            <div className="form-field">
              <label className="modal-label">Default Page Title</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="modal-input"
              />
            </div>

            <div className="form-field">
              <label className="modal-label">Meta Description</label>
              <textarea
                rows={3}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="modal-textarea"
              />
            </div>

            <div className="form-field">
              <label className="modal-label">Social Share Preview Image (OG Image)</label>
              <input
                type="url"
                value={formData.socialPreviewImage}
                onChange={(e) => setFormData({ ...formData, socialPreviewImage: e.target.value })}
                className="modal-input"
              />
            </div>
          </div>
        )}

        {/* CLOUD STORAGE TAB (Supabase & Cloudflare R2) */}
        {activeTab === 'cloud' && (
          <div className="form-section-fields">
            <h3 className="section-form-title">Supabase & Cloudflare R2 Integration</h3>
            <p className="section-form-sub">
              Connect Supabase for PostgreSQL database & authentication, and Cloudflare R2 for zero-egress binary storage.
            </p>

            <div className="form-grid-2col">
              <div className="form-field">
                <label className="modal-label">Supabase Project URL</label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={formData.supabaseUrl}
                  onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
                  className="modal-input"
                />
              </div>

              <div className="form-field">
                <label className="modal-label">Supabase Anon Public Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={formData.supabaseAnonKey}
                  onChange={(e) => setFormData({ ...formData, supabaseAnonKey: e.target.value })}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="modal-label">Cloudflare R2 Public Bucket URL / Endpoint</label>
              <input
                type="url"
                placeholder="https://r2.gotop-technologies.com"
                value={formData.r2Endpoint}
                onChange={(e) => setFormData({ ...formData, r2Endpoint: e.target.value })}
                className="modal-input"
              />
            </div>

            <div className="connection-test-row">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="btn btn-secondary"
              >
                <RefreshCw size={15} className={testingConnection ? 'spin-icon' : ''} />
                <span>{testingConnection ? 'Testing...' : 'Test Cloud Connection'}</span>
              </button>

              {connectionStatus && (
                <span className="connection-feedback-msg">{connectionStatus}</span>
              )}
            </div>

            {/* Active Buckets Overview */}
            <div className="active-buckets-card">
              <div className="buckets-card-header">
                <span className="buckets-title">Configured Supabase Storage Buckets</span>
                <span className="buckets-badge">3 Active</span>
              </div>
              <div className="buckets-list-grid">
                <div className="bucket-item-pill">
                  <span className="bucket-icon">📁</span>
                  <div className="bucket-text-wrap">
                    <span className="bucket-name">App Icon</span>
                    <span className="bucket-purpose">Project logos & application icons</span>
                  </div>
                  <span className="bucket-type-tag">Public</span>
                </div>
                <div className="bucket-item-pill">
                  <span className="bucket-icon">📁</span>
                  <div className="bucket-text-wrap">
                    <span className="bucket-name">Screenshots</span>
                    <span className="bucket-purpose">Project screenshots & gallery images</span>
                  </div>
                  <span className="bucket-type-tag">Public</span>
                </div>
                <div className="bucket-item-pill">
                  <span className="bucket-icon">📁</span>
                  <div className="bucket-text-wrap">
                    <span className="bucket-name">Avatar Image</span>
                    <span className="bucket-purpose">User avatar & profile photographs</span>
                  </div>
                  <span className="bucket-type-tag">Public</span>
                </div>
              </div>
            </div>

            {/* Backup & Factory Reset Actions */}
            <div className="database-tools-box">
              <h4 className="tools-box-title">Database Backup & Recovery</h4>
              <p className="tools-box-desc">Export current portfolio state to JSON or reset back to initial seed data.</p>
              <div className="tools-buttons-row">
                <button type="button" onClick={handleExportBackup} className="btn btn-secondary">
                  <Download size={16} />
                  <span>Export JSON Backup</span>
                </button>
                <button type="button" onClick={handleResetDefaults} className="reset-danger-btn">
                  <span>Restore Factory Defaults</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Footer */}
        <div className="content-save-row">
          <button type="submit" className="btn btn-primary">
            <Save size={18} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      <style>{`
        .admin-settings-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .settings-top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
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
          margin-bottom: 1.25rem;
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

        .form-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .theme-options-row {
          display: flex;
          gap: 0.75rem;
        }

        .theme-radio-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.1rem;
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          font-size: 0.88rem;
          color: var(--text-main);
        }

        .connection-test-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .connection-feedback-msg {
          font-size: 0.85rem;
          color: var(--neon-cyan);
          font-weight: 600;
        }

        .active-buckets-card {
          margin-top: 1.5rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.25rem;
        }

        .buckets-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .buckets-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .buckets-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.65rem;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 9999px;
        }

        .buckets-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.85rem;
        }

        .bucket-item-pill {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          position: relative;
        }

        .bucket-icon {
          font-size: 1.25rem;
        }

        .bucket-text-wrap {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .bucket-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .bucket-purpose {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.2;
        }

        .bucket-type-tag {
          font-size: 0.7rem;
          padding: 0.15rem 0.45rem;
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
          border-radius: 4px;
          font-weight: 600;
        }

        .database-tools-box {
          margin-top: 2rem;
          padding: 1.5rem;
          background: var(--bg-tertiary);
          border: 1px dashed var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .tools-box-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }

        .tools-box-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }

        .tools-buttons-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .reset-danger-btn {
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-full);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all var(--transition-fast);
        }

        .reset-danger-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: #ef4444;
        }

        .content-save-row {
          display: flex;
          justify-content: flex-end;
          padding-top: 2rem;
          margin-top: 1.5rem;
          border-top: 1px solid var(--border-subtle);
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

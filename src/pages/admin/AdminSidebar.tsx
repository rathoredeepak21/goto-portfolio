import React from 'react';
import {
  LayoutDashboard,
  Smartphone,
  Layers,
  Cpu,
  DownloadCloud,
  FileEdit,
  Share2,
  Settings,
  LogOut,
  Shield,
  X,
  ExternalLink,
} from 'lucide-react';

interface AdminSidebarProps {
  currentSection: string;
  onSelectSection: (section: string) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  onLogout,
  onViewPublicSite,
  mobileOpen,
  onCloseMobile,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { id: 'apps', label: 'Apps / Projects', icon: <Smartphone size={19} /> },
    { id: 'platforms', label: 'Platforms', icon: <Layers size={19} /> },
    { id: 'technologies', label: 'Technologies & Skills', icon: <Cpu size={19} /> },
    { id: 'releases', label: 'APK Releases', icon: <DownloadCloud size={19} /> },
    { id: 'content', label: 'Website Content', icon: <FileEdit size={19} /> },
    { id: 'socials', label: 'Social Links', icon: <Share2 size={19} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={19} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && <div className="admin-sidebar-backdrop" onClick={onCloseMobile} />}

      <aside className={`admin-sidebar ${mobileOpen ? 'admin-sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-brand-header">
          <div className="admin-brand-logo">
            <Shield size={24} color="#38bdf8" />
            <span className="brand-text">GoTop Admin</span>
          </div>
          <button className="mobile-close-sidebar" onClick={onCloseMobile}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="admin-nav-list">
          {menuItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  onCloseMobile();
                }}
                className={`admin-nav-btn ${isActive ? 'admin-nav-active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {isActive && <span className="active-glow-bar" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="admin-sidebar-footer">
          <button onClick={onViewPublicSite} className="admin-action-btn view-site-btn">
            <ExternalLink size={17} />
            <span>View Public Site</span>
          </button>

          <button onClick={onLogout} className="admin-action-btn logout-btn">
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <style>{`
        .admin-sidebar {
          width: 250px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .admin-brand-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .admin-brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-text {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }

        .mobile-close-sidebar {
          display: none;
          color: var(--text-main);
          padding: 0.25rem;
        }

        .admin-nav-list {
          padding: 1.25rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .admin-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 500;
          position: relative;
          text-align: left;
          transition: all var(--transition-fast);
        }

        .admin-nav-btn:hover {
          color: var(--neon-cyan);
          background: rgba(56, 189, 248, 0.1);
        }

        .admin-nav-active {
          color: var(--neon-cyan);
          background: rgba(56, 189, 248, 0.12);
          font-weight: 700;
        }

        .admin-nav-active .nav-icon {
          color: var(--neon-cyan);
        }

        .active-glow-bar {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          background: var(--neon-cyan);
          border-radius: 4px 0 0 4px;
          box-shadow: 0 0 10px var(--neon-cyan);
        }

        .admin-sidebar-footer {
          padding: 1.25rem 0.85rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .admin-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .view-site-btn:hover {
          color: var(--neon-cyan);
          background: rgba(56, 189, 248, 0.08);
        }

        .logout-btn:hover {
          color: #f87171;
          background: rgba(239, 68, 68, 0.1);
        }

        .admin-sidebar-backdrop {
          display: none;
        }

        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            box-shadow: 5px 0 25px rgba(0, 0, 0, 0.7);
          }

          .admin-sidebar-open {
            transform: translateX(0);
          }

          .mobile-close-sidebar {
            display: block;
          }

          .admin-sidebar-backdrop {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 90;
          }
        }
      `}</style>
    </>
  );
};

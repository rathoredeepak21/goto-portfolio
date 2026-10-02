import React from 'react';
import { Menu, ExternalLink, User, Sun, Moon } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminHeaderProps {
  user: AdminUser | null;
  onToggleMobileSidebar: () => void;
  onViewPublicSite: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  onToggleMobileSidebar,
  onViewPublicSite,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          className="admin-menu-toggle"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <div className="admin-badge-indicator">
          <span className="live-dot" />
          <span className="live-text">Admin Mode Active</span>
        </div>
      </div>

      <div className="admin-header-right">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="admin-icon-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* View Public Site button */}
        <button onClick={onViewPublicSite} className="admin-public-btn">
          <ExternalLink size={15} />
          <span>Live Site</span>
        </button>

        {/* User Info Avatar */}
        <div className="admin-user-badge">
          <div className="admin-user-avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} />
            ) : (
              <User size={16} color="#38bdf8" />
            )}
          </div>
          <span className="admin-user-name">{user?.name || 'Admin'}</span>
        </div>
      </div>

      <style>{`
        .admin-header {
          height: 64px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.75rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .admin-header-left,
        .admin-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-menu-toggle {
          display: none;
          color: var(--text-main);
          padding: 0.35rem;
        }

        .admin-badge-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.75rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: var(--radius-full);
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .live-text {
          font-size: 0.78rem;
          color: #10b981;
          font-weight: 600;
        }

        .admin-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .admin-icon-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
        }

        .admin-public-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-md);
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid var(--border-neon);
          color: var(--neon-cyan);
          font-size: 0.82rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .admin-public-btn:hover {
          background: var(--neon-cyan);
          color: #ffffff;
        }

        .admin-user-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding-left: 0.5rem;
        }

        .admin-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-neon);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-user-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
        }

        @media (max-width: 900px) {
          .admin-menu-toggle {
            display: block;
          }
          .admin-user-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

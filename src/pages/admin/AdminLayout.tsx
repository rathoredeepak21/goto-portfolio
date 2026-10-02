import React, { useState } from 'react';
import {
  AdminUser,
  Project,
  ApkRelease,
  Platform,
  Technology,
  TechnologyCategory,
  WebsiteContent,
  SocialLink,
  WebsiteSettings,
} from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { AdminProjects } from './AdminProjects';
import { AdminPlatforms } from './AdminPlatforms';
import { AdminTechnologies } from './AdminTechnologies';
import { AdminReleases } from './AdminReleases';
import { AdminContent } from './AdminContent';
import { AdminSocials } from './AdminSocials';
import { AdminSettings } from './AdminSettings';
import { ProjectModal } from './ProjectModal';

interface AdminLayoutProps {
  user: AdminUser;
  projects: Project[];
  apkReleases: ApkRelease[];
  platforms?: Platform[];
  technologies: Technology[];
  categories: TechnologyCategory[];
  content: WebsiteContent;
  socialLinks: SocialLink[];
  settings: WebsiteSettings;
  trafficStats: any;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  onPreviewProject: (slug: string) => void;
  onSaveProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onSavePlatform?: (platform: Platform) => void;
  onDeletePlatform?: (platformId: string) => void;
  onReorderPlatforms?: (platforms: Platform[]) => void;
  onSaveRelease: (release: ApkRelease) => void;
  onDeleteRelease: (releaseId: string) => void;
  onSaveTechnology: (tech: Technology) => void;
  onDeleteTechnology: (techId: string) => void;
  onReorderTechnologies: (techs: Technology[]) => void;
  onSaveCategory: (cat: TechnologyCategory) => void;
  onDeleteCategory: (catId: string) => void;
  onSaveContent: (newContent: WebsiteContent) => void;
  onSaveSocials: (newLinks: SocialLink[]) => void;
  onSaveSettings: (newSettings: WebsiteSettings) => void;
  onRefreshAllData: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  projects,
  apkReleases,
  platforms,
  technologies,
  categories,
  content,
  socialLinks,
  settings,
  trafficStats,
  theme,
  onToggleTheme,
  onLogout,
  onViewPublicSite,
  onPreviewProject,
  onSaveProject,
  onDeleteProject,
  onSavePlatform,
  onDeletePlatform,
  onReorderPlatforms,
  onSaveRelease,
  onDeleteRelease,
  onSaveTechnology,
  onDeleteTechnology,
  onReorderTechnologies,
  onSaveCategory,
  onDeleteCategory,
  onSaveContent,
  onSaveSocials,
  onSaveSettings,
  onRefreshAllData,
}) => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [quickProjectModalOpen, setQuickProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEditProjectFromDashboard = (proj: Project) => {
    setEditingProject(proj);
    setQuickProjectModalOpen(true);
  };

  const handleAddNewProjectFromDashboard = () => {
    setEditingProject(null);
    setQuickProjectModalOpen(true);
  };

  return (
    <div className="admin-root-layout">
      {/* Sidebar */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={(sec) => setCurrentSection(sec)}
        onLogout={onLogout}
        onViewPublicSite={onViewPublicSite}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="admin-main-viewport">
        <AdminHeader
          user={user}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onViewPublicSite={onViewPublicSite}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

        <main className="admin-body-content">
          {currentSection === 'dashboard' && (
            <AdminDashboard
              projects={projects}
              apkReleases={apkReleases}
              trafficStats={trafficStats}
              onEditProject={handleEditProjectFromDashboard}
              onAddNewProject={handleAddNewProjectFromDashboard}
              onNavigateToSection={(sec) => setCurrentSection(sec)}
            />
          )}

          {currentSection === 'apps' && (
            <AdminProjects
              projects={projects}
              platforms={platforms}
              onSaveProject={onSaveProject}
              onDeleteProject={onDeleteProject}
              onPreviewProject={onPreviewProject}
            />
          )}

          {currentSection === 'platforms' && (
            <AdminPlatforms
              platforms={platforms || []}
              onSavePlatform={onSavePlatform || (() => {})}
              onDeletePlatform={onDeletePlatform || (() => {})}
              onReorderPlatforms={onReorderPlatforms || (() => {})}
            />
          )}

          {currentSection === 'technologies' && (
            <AdminTechnologies
              technologies={technologies}
              categories={categories}
              onSaveTechnology={onSaveTechnology}
              onDeleteTechnology={onDeleteTechnology}
              onReorderTechnologies={onReorderTechnologies}
              onSaveCategory={onSaveCategory}
              onDeleteCategory={onDeleteCategory}
            />
          )}

          {currentSection === 'releases' && (
            <AdminReleases
              releases={apkReleases}
              projects={projects}
              onSaveRelease={onSaveRelease}
              onDeleteRelease={onDeleteRelease}
            />
          )}

          {currentSection === 'content' && (
            <AdminContent
              content={content}
              socialLinks={socialLinks}
              onSaveContent={onSaveContent}
              onSaveSocials={onSaveSocials}
            />
          )}

          {currentSection === 'socials' && (
            <AdminSocials
              socialLinks={socialLinks}
              onSaveSocials={onSaveSocials}
            />
          )}

          {currentSection === 'settings' && (
            <AdminSettings
              settings={settings}
              onSaveSettings={onSaveSettings}
              onRefreshAllData={onRefreshAllData}
            />
          )}
        </main>
      </div>

      {/* Quick Project Modal for dashboard actions */}
      <ProjectModal
        isOpen={quickProjectModalOpen}
        project={editingProject}
        platforms={platforms}
        onClose={() => setQuickProjectModalOpen(false)}
        onSave={(proj) => {
          onSaveProject(proj);
          setQuickProjectModalOpen(false);
        }}
      />

      <style>{`
        .admin-root-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-main);
        }

        .admin-main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .admin-body-content {
          flex: 1;
          padding: 2.25rem 2.5rem;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .admin-body-content {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

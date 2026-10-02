import React, { useState, useEffect } from 'react';
import { Project, ApkRelease, Platform, Technology, TechnologyCategory, WebsiteContent, SocialLink, WebsiteSettings, AdminUser } from './types';
import { dataService } from './services/dataService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ScreenshotsPage } from './pages/ScreenshotsPage';
import { SkillsPage } from './pages/SkillsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';

export function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>('rentora');

  // Global Data State
  const [projects, setProjects] = useState<Project[]>(() => dataService.getProjects());
  const [apkReleases, setApkReleases] = useState<ApkRelease[]>(() => dataService.getApkReleases());
  const [platforms, setPlatforms] = useState<Platform[]>(() => dataService.getPlatforms());
  const [technologies, setTechnologies] = useState<Technology[]>(() => dataService.getTechnologies());
  const [categories, setCategories] = useState<TechnologyCategory[]>(() => dataService.getTechnologyCategories());
  const [content, setContent] = useState<WebsiteContent>(() => dataService.getContent());
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => dataService.getSocialLinks());
  const [settings, setSettings] = useState<WebsiteSettings>(() => dataService.getSettings());
  const [trafficStats, setTrafficStats] = useState(() => {
    dataService.incrementVisitorCount();
    return dataService.getTrafficStats();
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => dataService.getAdminUser());

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = settings.themePreference;
    if (saved === 'light') return 'light';
    return 'dark';
  });

  // Toast Notification State
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'info' | 'success' }>>([]);

  const addToast = (message: string, type: 'info' | 'success' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Sync theme attribute with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync document title with active page & SEO settings
  useEffect(() => {
    if (currentTab === 'project-detail') {
      const proj = projects.find((p) => p.slug === selectedProjectSlug);
      if (proj) {
        document.title = `${proj.title} - ${proj.subtitle} | ${settings.websiteName}`;
        return;
      }
    }
    if (currentTab === 'admin') {
      document.title = `Admin Portal | ${settings.websiteName}`;
      return;
    }
    document.title = settings.seoTitle || `${settings.websiteName} - Mobile & Full-Stack Developer`;
  }, [currentTab, selectedProjectSlug, settings, projects]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation Handler
  const handleNavigate = (tab: string, slug?: string) => {
    setCurrentTab(tab);
    if (slug) {
      setSelectedProjectSlug(slug);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Auth Handlers
  const handleAdminLogin = (email: string, pass: string): boolean => {
    const res = dataService.login(email, pass);
    if (res.success && res.user) {
      setAdminUser(res.user);
      addToast('Welcome back, Admin!', 'success');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    dataService.logout();
    setAdminUser(null);
    setCurrentTab('home');
    addToast('Logged out of admin panel');
  };

  // Data Mutation Handlers
  const handleSaveProject = (project: Project) => {
    const saved = dataService.saveProject(project);
    setProjects(dataService.getProjects());
    setApkReleases(dataService.getApkReleases());
    addToast(`App "${saved.title}" saved successfully`, 'success');
  };

  const handleDeleteProject = (projectId: string) => {
    dataService.deleteProject(projectId);
    setProjects(dataService.getProjects());
    setApkReleases(dataService.getApkReleases());
    addToast('Project removed', 'info');
  };

  const handleSaveRelease = (release: ApkRelease) => {
    dataService.saveApkRelease(release);
    setApkReleases(dataService.getApkReleases());
    setProjects(dataService.getProjects());
    addToast(`Release ${release.version} published`, 'success');
  };

  const handleDeleteRelease = (releaseId: string) => {
    dataService.deleteApkRelease(releaseId);
    setApkReleases(dataService.getApkReleases());
    addToast('APK release deleted', 'info');
  };

  const handleSavePlatform = (plat: Platform) => {
    dataService.savePlatform(plat);
    setPlatforms(dataService.getPlatforms());
    addToast(`Platform "${plat.name}" saved`, 'success');
  };

  const handleDeletePlatform = (platId: string) => {
    dataService.deletePlatform(platId);
    setPlatforms(dataService.getPlatforms());
    addToast('Platform removed', 'info');
  };

  const handleReorderPlatforms = (plats: Platform[]) => {
    dataService.reorderPlatforms(plats);
    setPlatforms(dataService.getPlatforms());
  };

  const handleSaveTechnology = (tech: Technology) => {
    dataService.saveTechnology(tech);
    setTechnologies(dataService.getTechnologies());
    addToast(`Technology "${tech.name}" saved`, 'success');
  };

  const handleDeleteTechnology = (techId: string) => {
    dataService.deleteTechnology(techId);
    setTechnologies(dataService.getTechnologies());
    addToast('Technology removed', 'info');
  };

  const handleReorderTechnologies = (techs: Technology[]) => {
    dataService.reorderTechnologies(techs);
    setTechnologies(dataService.getTechnologies());
  };

  const handleSaveCategory = (cat: TechnologyCategory) => {
    dataService.saveTechnologyCategory(cat);
    setCategories(dataService.getTechnologyCategories());
    addToast(`Category "${cat.name}" added`, 'success');
  };

  const handleDeleteCategory = (catId: string) => {
    dataService.deleteTechnologyCategory(catId);
    setCategories(dataService.getTechnologyCategories());
    addToast('Category removed', 'info');
  };

  const handleSaveContent = (newContent: WebsiteContent) => {
    dataService.saveContent(newContent);
    setContent(newContent);
    addToast('Website content updated', 'success');
  };

  const handleSaveSocials = (newLinks: SocialLink[]) => {
    dataService.saveSocialLinks(newLinks);
    setSocialLinks(newLinks);
  };

  const handleSaveSettings = (newSettings: WebsiteSettings) => {
    dataService.saveSettings(newSettings);
    setSettings(newSettings);
    if (newSettings.themePreference !== 'auto') {
      setTheme(newSettings.themePreference);
    }
    addToast('Website settings saved', 'success');
  };

  const handleRefreshAllData = () => {
    setProjects(dataService.getProjects());
    setApkReleases(dataService.getApkReleases());
    setPlatforms(dataService.getPlatforms());
    setTechnologies(dataService.getTechnologies());
    setCategories(dataService.getTechnologyCategories());
    setContent(dataService.getContent());
    setSocialLinks(dataService.getSocialLinks());
    setSettings(dataService.getSettings());
    setTrafficStats(dataService.getTrafficStats());
    addToast('All data refreshed from database', 'info');
  };

  const handleSendMessage = (name: string, email: string, message: string) => {
    dataService.addMessage(name, email, message);
    addToast(`Message sent from ${name}! Thank you.`, 'success');
  };

  const handleDownloadApk = (project: Project) => {
    dataService.incrementDownloadCount(project.id);
    setTrafficStats(dataService.getTrafficStats());
    addToast(`Downloading ${project.title} (${project.apkSize})...`, 'info');
  };

  // If in Admin Mode and Authenticated, render complete Admin Layout
  if (currentTab === 'admin' && adminUser) {
    return (
      <div className="app-container">
        <AdminLayout
          user={adminUser}
          projects={projects}
          apkReleases={apkReleases}
          platforms={platforms}
          technologies={technologies}
          categories={categories}
          content={content}
          socialLinks={socialLinks}
          settings={settings}
          trafficStats={trafficStats}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onLogout={handleAdminLogout}
          onViewPublicSite={() => setCurrentTab('home')}
          onPreviewProject={(slug) => {
            setSelectedProjectSlug(slug);
            setCurrentTab('project-detail');
          }}
          onSaveProject={handleSaveProject}
          onDeleteProject={handleDeleteProject}
          onSavePlatform={handleSavePlatform}
          onDeletePlatform={handleDeletePlatform}
          onReorderPlatforms={handleReorderPlatforms}
          onSaveRelease={handleSaveRelease}
          onDeleteRelease={handleDeleteRelease}
          onSaveTechnology={handleSaveTechnology}
          onDeleteTechnology={handleDeleteTechnology}
          onReorderTechnologies={handleReorderTechnologies}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          onSaveContent={handleSaveContent}
          onSaveSocials={handleSaveSocials}
          onSaveSettings={handleSaveSettings}
          onRefreshAllData={handleRefreshAllData}
        />

        {/* Global Toasts */}
        <div className="toast-container">
          {toasts.map((t) => (
            <div key={t.id} className="toast">
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active Project for Detail & Screenshot views
  const activeProject =
    projects.find((p) => p.slug === selectedProjectSlug) ||
    projects.find((p) => p.slug === 'rentora') ||
    projects[0];

  return (
    <div className="app-container">
      {/* Public Header Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        settings={settings}
        isAdmin={Boolean(adminUser)}
      />

      {/* Main Public Body */}
      <main className="site-main">
        {currentTab === 'home' && (
          <HomePage
            content={content}
            projects={projects}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            content={content.about}
            skills={technologies}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsPage
            projects={projects}
            onViewDetails={(slug) => handleNavigate('project-detail', slug)}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'project-detail' && activeProject && (
          <ProjectDetailPage
            project={activeProject}
            onBack={() => handleNavigate('projects')}
            onDownloadApk={() => handleDownloadApk(activeProject)}
          />
        )}

        {currentTab === 'screenshots' && (
          <ScreenshotsPage
            projects={projects}
            activeSlug={selectedProjectSlug}
            onBack={() => handleNavigate('project-detail', selectedProjectSlug)}
            onSelectProject={(slug) => setSelectedProjectSlug(slug)}
          />
        )}

        {currentTab === 'skills' && (
          <SkillsPage
            technologies={technologies}
            categories={categories}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage
            content={content.contact}
            socialLinks={socialLinks}
            onSendMessage={handleSendMessage}
          />
        )}

        {currentTab === 'admin' && !adminUser && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onCancel={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Public Footer matching reference design */}
      {currentTab !== 'admin' && (
        <Footer
          content={content.footer}
          socialLinks={socialLinks}
          onNavigate={handleNavigate}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;

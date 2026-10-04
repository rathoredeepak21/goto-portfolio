import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
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

// URL path to tab mapper
function getInitialTab(): string {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/about')) return 'about';
  if (path.startsWith('/projects')) return 'projects';
  if (path.startsWith('/project/')) return 'project-detail';
  if (path.startsWith('/skills')) return 'skills';
  if (path.startsWith('/contact')) return 'contact';
  if (path.startsWith('/screenshots')) return 'screenshots';
  return 'home';
}

function getInitialProjectSlug(): string {
  if (typeof window === 'undefined') return 'rentora';
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith('/project/')) {
    const parts = path.split('/');
    if (parts[2]) return parts[2];
  }
  return 'rentora';
}

export function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>(getInitialProjectSlug);

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
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

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

  // Live Supabase Data Sync on App Mount & Tab Focus
  useEffect(() => {
    let isMounted = true;

    const syncLiveData = async () => {
      try {
        const [liveProjects, liveTech, livePlatforms, liveCategories, liveContent, liveReleases, liveSettings] =
          await Promise.all([
            dataService.fetchProjectsFromSupabase(),
            dataService.fetchTechnologiesFromSupabase(),
            dataService.fetchPlatformsFromSupabase(),
            dataService.fetchTechnologyCategoriesFromSupabase(),
            dataService.fetchContentFromSupabase(),
            dataService.fetchApkReleasesFromSupabase(),
            dataService.fetchSettingsFromSupabase(),
          ]);

        if (!isMounted) return;

        if (liveProjects !== null) setProjects(liveProjects);
        if (liveTech !== null) setTechnologies(liveTech);
        if (livePlatforms !== null) setPlatforms(livePlatforms);
        if (liveCategories !== null) setCategories(liveCategories);
        if (liveContent !== null) setContent(liveContent);
        if (liveReleases !== null) setApkReleases(liveReleases);
        if (liveSettings !== null) setSettings(liveSettings);
      } catch (err) {
        console.warn('Live data sync notice:', err);
      }
    };

    syncLiveData();

    // Revalidate on window focus so public visitors or returning tabs get fresh updates
    const handleFocus = () => {
      syncLiveData();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Safeguard: If currently on project-detail or screenshots and project was deleted, route safely to projects
  useEffect(() => {
    if (currentTab === 'project-detail' || currentTab === 'screenshots') {
      const exists = projects.some((p) => p && (p.slug === selectedProjectSlug || p.id === selectedProjectSlug));
      if (!exists) {
        handleNavigate('projects', undefined, true);
      }
    }
  }, [currentTab, selectedProjectSlug, projects]);

  // Sync document title with active page & SEO settings
  useEffect(() => {
    if (currentTab === 'project-detail') {
      const proj = projects.find((p) => p && (p.slug === selectedProjectSlug || p.id === selectedProjectSlug));
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

  // Supabase Auth Session Hydration & Listener
  useEffect(() => {
    let isMounted = true;

    // Check active Supabase admin session on load
    dataService.getAuthenticatedAdmin().then((user) => {
      if (isMounted) {
        setAdminUser(user);
        setAuthLoading(false);
      }
    });

    const unsubscribe = dataService.onAuthStateChange((user) => {
      if (isMounted) {
        setAdminUser(user);
        setAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const tab = getInitialTab();
      const slug = getInitialProjectSlug();
      setCurrentTab(tab);
      setSelectedProjectSlug(slug);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Handler with Browser History URL Synchronization
  const handleNavigate = (tab: string, slug?: string, replaceHistory = false) => {
    setCurrentTab(tab);
    if (slug) {
      setSelectedProjectSlug(slug);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let targetPath = '/';
    if (tab === 'home') targetPath = '/';
    else if (tab === 'admin') targetPath = '/admin';
    else if (tab === 'project-detail' && slug) targetPath = `/project/${slug}`;
    else targetPath = `/${tab}`;

    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      if (replaceHistory) {
        window.history.replaceState({ tab, slug }, '', targetPath);
      } else {
        window.history.pushState({ tab, slug }, '', targetPath);
      }
    }
  };

  // Real Supabase Admin Auth Handlers
  const handleAdminLogin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const res = await dataService.login(email, pass);
    if (res.success && res.user) {
      setAdminUser(res.user);
      addToast('Welcome back, Admin!', 'success');
      return { success: true };
    }
    return { success: false, error: res.error || 'Invalid credentials' };
  };

  const handleAdminLogout = async () => {
    await dataService.logout();
    setAdminUser(null);
    handleNavigate('home', undefined, true);
    addToast('Logged out of admin panel');
  };

  // Data Mutation Handlers
  const handleSaveProject = async (project: Project) => {
    const saved = await dataService.saveProject(project);
    setProjects(dataService.getProjects());
    setApkReleases(dataService.getApkReleases());
    addToast(`App "${saved.title}" saved successfully`, 'success');
  };

  const handleDeleteProject = async (projectId: string) => {
    const deletedProject = projects.find((p) => p.id === projectId);
    const res = await dataService.deleteProject(projectId);
    if (!res.success) {
      addToast(res.error || 'Failed to delete project', 'info');
      return;
    }

    const updatedProjects = dataService.getProjects();
    setProjects(updatedProjects);
    setApkReleases(dataService.getApkReleases());

    // If the deleted project was the currently selected project, update selectedProjectSlug
    if (deletedProject && (selectedProjectSlug === deletedProject.slug || selectedProjectSlug === deletedProject.id)) {
      const nextSlug = updatedProjects[0]?.slug || '';
      setSelectedProjectSlug(nextSlug);

      // If user was viewing project-detail or screenshots, safely route to projects page
      if (currentTab === 'project-detail' || currentTab === 'screenshots') {
        handleNavigate('projects', undefined, true);
      }
    }

    addToast('Project removed', 'info');
  };

  const handleSaveRelease = async (release: ApkRelease) => {
    await dataService.saveApkRelease(release);
    setApkReleases(dataService.getApkReleases());
    setProjects(dataService.getProjects());
    addToast(`Release ${release.version} published`, 'success');
  };

  const handleDeleteRelease = async (releaseId: string) => {
    await dataService.deleteApkRelease(releaseId);
    setApkReleases(dataService.getApkReleases());
    addToast('APK release deleted', 'info');
  };

  const handleSavePlatform = async (plat: Platform) => {
    await dataService.savePlatform(plat);
    setPlatforms(dataService.getPlatforms());
    addToast(`Platform "${plat.name}" saved`, 'success');
  };

  const handleDeletePlatform = async (platId: string) => {
    await dataService.deletePlatform(platId);
    setPlatforms(dataService.getPlatforms());
    addToast('Platform removed', 'info');
  };

  const handleReorderPlatforms = (plats: Platform[]) => {
    dataService.reorderPlatforms(plats);
    setPlatforms(dataService.getPlatforms());
  };

  const handleSaveTechnology = async (tech: Technology) => {
    await dataService.saveTechnology(tech);
    setTechnologies(dataService.getTechnologies());
    addToast(`Technology "${tech.name}" saved`, 'success');
  };

  const handleDeleteTechnology = async (techId: string) => {
    await dataService.deleteTechnology(techId);
    setTechnologies(dataService.getTechnologies());
    addToast('Technology removed', 'info');
  };

  const handleReorderTechnologies = (techs: Technology[]) => {
    dataService.reorderTechnologies(techs);
    setTechnologies(dataService.getTechnologies());
  };

  const handleSaveCategory = async (cat: TechnologyCategory) => {
    await dataService.saveTechnologyCategory(cat);
    setCategories(dataService.getTechnologyCategories());
    addToast(`Category "${cat.name}" added`, 'success');
  };

  const handleDeleteCategory = async (catId: string) => {
    await dataService.deleteTechnologyCategory(catId);
    setCategories(dataService.getTechnologyCategories());
    addToast('Category removed', 'info');
  };

  const handleSaveContent = async (newContent: WebsiteContent) => {
    await dataService.saveContent(newContent);
    setContent(newContent);
    addToast('Website content updated', 'success');
  };

  const handleSaveSocials = (newLinks: SocialLink[]) => {
    dataService.saveSocialLinks(newLinks);
    setSocialLinks(newLinks);
  };

  const handleSaveSettings = async (newSettings: WebsiteSettings) => {
    await dataService.saveSettings(newSettings);
    setSettings(newSettings);
    if (newSettings.themePreference !== 'auto') {
      setTheme(newSettings.themePreference);
    }
    addToast('Website settings saved', 'success');
  };

  const handleRefreshAllData = async () => {
    try {
      const [liveProjects, liveTech, livePlatforms, liveCategories, liveContent, liveReleases, liveSettings] =
        await Promise.all([
          dataService.fetchProjectsFromSupabase(),
          dataService.fetchTechnologiesFromSupabase(),
          dataService.fetchPlatformsFromSupabase(),
          dataService.fetchTechnologyCategoriesFromSupabase(),
          dataService.fetchContentFromSupabase(),
          dataService.fetchApkReleasesFromSupabase(),
          dataService.fetchSettingsFromSupabase(),
        ]);

      if (liveProjects && liveProjects.length > 0) setProjects(liveProjects);
      else setProjects(dataService.getProjects());

      if (liveTech && liveTech.length > 0) setTechnologies(liveTech);
      else setTechnologies(dataService.getTechnologies());

      if (livePlatforms && livePlatforms.length > 0) setPlatforms(livePlatforms);
      else setPlatforms(dataService.getPlatforms());

      if (liveCategories && liveCategories.length > 0) setCategories(liveCategories);
      else setCategories(dataService.getTechnologyCategories());

      if (liveContent) setContent(liveContent);
      else setContent(dataService.getContent());

      if (liveReleases && liveReleases.length > 0) setApkReleases(liveReleases);
      else setApkReleases(dataService.getApkReleases());

      if (liveSettings) setSettings(liveSettings);
      else setSettings(dataService.getSettings());
    } catch {
      setProjects(dataService.getProjects());
      setApkReleases(dataService.getApkReleases());
      setPlatforms(dataService.getPlatforms());
      setTechnologies(dataService.getTechnologies());
      setCategories(dataService.getTechnologyCategories());
      setContent(dataService.getContent());
      setSettings(dataService.getSettings());
    }
    setSocialLinks(dataService.getSocialLinks());
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

  // If in Admin Mode, apply Admin Auth Guard
  if (currentTab === 'admin') {
    if (authLoading) {
      return (
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="neon-card" style={{ padding: '2.5rem 3.5rem', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ width: 64, height: 64, margin: '0 auto 1.25rem', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-cyan)' }}>
              <Shield size={34} color="#38bdf8" />
            </div>
            <p style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.25rem' }}>Verifying Admin Authorization</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Checking secure Supabase credentials...</p>
          </div>
        </div>
      );
    }

    if (adminUser && adminUser.role === 'admin') {
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
            onViewPublicSite={() => handleNavigate('home')}
            onPreviewProject={(slug) => {
              setSelectedProjectSlug(slug);
              handleNavigate('project-detail', slug);
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
  }

  // Active Project for Detail & Screenshot views
  const activeProject =
    projects.find((p) => p && (p.slug === selectedProjectSlug || p.id === selectedProjectSlug)) ||
    projects.find((p) => p && p.slug === 'rentora') ||
    (projects.length > 0 ? projects[0] : undefined);

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

        {currentTab === 'project-detail' && (
          activeProject ? (
            <ProjectDetailPage
              project={activeProject}
              onBack={() => handleNavigate('projects')}
              onDownloadApk={() => handleDownloadApk(activeProject)}
            />
          ) : (
            <div className="content-wrapper section-spacing" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div className="neon-card" style={{ maxWidth: 480, margin: '0 auto', padding: '2.5rem' }}>
                <h2 style={{ color: 'var(--text-main)', marginBottom: '0.75rem' }}>Project Not Found</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  This project may have been moved or removed from the portfolio.
                </p>
                <button onClick={() => handleNavigate('projects')} className="btn btn-primary">
                  <span>Explore Other Projects</span>
                </button>
              </div>
            </div>
          )
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

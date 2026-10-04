import {
  Project,
  ApkRelease,
  Skill,
  Technology,
  TechnologyCategory,
  Platform,
  WebsiteContent,
  SocialLink,
  WebsiteSettings,
  ContactMessage,
  AdminUser,
} from '../types';
import {
  initialProjects,
  initialApkReleases,
  initialSkills,
  initialTechnologies,
  initialTechnologyCategories,
  initialPlatforms,
  initialWebsiteContent,
  initialSocialLinks,
  initialWebsiteSettings,
  defaultAdminUser,
} from './mockData';
import { getSupabaseClient, resetSupabaseClient } from './supabaseClient';

const STORAGE_KEYS = {
  PROJECTS: 'gotop_projects_v3',
  RELEASES: 'gotop_apk_releases_v2',
  SKILLS: 'gotop_technologies_v3',
  TECHNOLOGIES: 'gotop_technologies_v3',
  TECH_CATEGORIES: 'gotop_tech_categories_v3',
  PLATFORMS: 'gotop_platforms_v1',
  CONTENT: 'gotop_content_v2',
  SOCIALS: 'gotop_socials_v2',
  SETTINGS: 'gotop_settings_v2',
  MESSAGES: 'gotop_messages_v2',
  AUTH: 'gotop_admin_auth_v2',
  TRAFFIC: 'gotop_traffic_stats_v2',
};

class DataService {
  // Helper to get typed item from localStorage with fallback
  private getItem<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return fallback;
    }
  }

  // Helper to save item to localStorage
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  // ================= PROJECTS =================
  public getProjects(): Project[] {
    const list = this.getItem<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    // Ensure every project has platforms defined
    return list.map((p) => {
      if (p.platforms && p.platforms.length > 0) return p;
      const initP = initialProjects.find((ip) => ip.id === p.id || ip.slug === p.slug);
      if (initP && initP.platforms && initP.platforms.length > 0) {
        return { ...p, platforms: initP.platforms };
      }
      if (p.category === 'web') return { ...p, platforms: ['Web Application'] };
      return { ...p, platforms: ['Android App'] };
    });
  }

  public getProjectBySlug(slug: string): Project | undefined {
    const projects = this.getProjects();
    return projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id === slug);
  }

  // Supabase Storage Bucket definitions matching user Supabase project
  public static readonly BUCKETS = {
    APP_ICON: { primary: 'App Icon', fallback: 'app-icon' },
    SCREENSHOTS: { primary: 'Screenshots', fallback: 'screenshots' },
    AVATAR_IMAGE: { primary: 'Avatar Image', fallback: 'avatar-image' },
  };

  // Helper to upload to Supabase with automatic bucket name fallback
  private async uploadToBucket(
    bucketConfig: { primary: string; fallback: string },
    storagePath: string,
    file: File | Blob
  ): Promise<{ url: string; storagePath: string } | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      // Try primary bucket first
      let usedBucket = bucketConfig.primary;
      let res = await supabase.storage
        .from(bucketConfig.primary)
        .upload(storagePath, file, { cacheControl: '3600', upsert: true });

      // If primary bucket failed due to not found, try fallback slug
      if (res.error && (res.error.message?.toLowerCase().includes('not found') || res.error.message?.toLowerCase().includes('bucket'))) {
        const fallbackRes = await supabase.storage
          .from(bucketConfig.fallback)
          .upload(storagePath, file, { cacheControl: '3600', upsert: true });

        if (!fallbackRes.error && fallbackRes.data) {
          res = fallbackRes;
          usedBucket = bucketConfig.fallback;
        }
      }

      if (!res.error && res.data) {
        const { data: publicUrlData } = supabase.storage
          .from(usedBucket)
          .getPublicUrl(storagePath);

        return {
          url: publicUrlData.publicUrl,
          storagePath: `${usedBucket}::${storagePath}`,
        };
      }
      console.warn(`Supabase upload to bucket "${bucketConfig.primary}" error:`, res.error);
    } catch (err) {
      console.warn(`Error during Supabase upload to bucket "${bucketConfig.primary}":`, err);
    }
    return null;
  }

  // Upload actual project app icon to Supabase Storage 'App Icon' bucket (with data URL offline fallback)
  public async uploadProjectIcon(
    projectId: string,
    file: File
  ): Promise<{ icon_url: string; icon_storage_path: string }> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const cleanId = projectId.trim() || `proj-${Date.now()}`;
    const storagePath = `projects/${cleanId}/icon_${Date.now()}.${fileExt}`;

    const uploaded = await this.uploadToBucket(DataService.BUCKETS.APP_ICON, storagePath, file);
    if (uploaded) {
      return {
        icon_url: uploaded.url,
        icon_storage_path: uploaded.storagePath,
      };
    }

    // Local / Offline fallback: read as base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({
            icon_url: reader.result,
            icon_storage_path: `local/${storagePath}`,
          });
        } else {
          reject(new Error('Failed to convert icon to data URL'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read icon file'));
      reader.readAsDataURL(file);
    });
  }

  // Remove project icon from storage
  public async removeProjectIcon(storagePath?: string): Promise<void> {
    if (!storagePath || storagePath.startsWith('local/')) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      if (storagePath.includes('::')) {
        const [bucket, path] = storagePath.split('::');
        await supabase.storage.from(bucket).remove([path]);
      } else {
        // Try App Icon, then fallback
        await supabase.storage.from(DataService.BUCKETS.APP_ICON.primary).remove([storagePath]);
      }
    } catch (err) {
      console.warn('Failed to remove icon from Supabase storage:', err);
    }
  }

  // Upload project screenshot to Supabase Storage 'Screenshots' bucket
  public async uploadScreenshot(
    projectId: string,
    file: File
  ): Promise<{ url: string; storagePath: string }> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const cleanId = projectId.trim() || `proj-${Date.now()}`;
    const storagePath = `projects/${cleanId}/screen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const uploaded = await this.uploadToBucket(DataService.BUCKETS.SCREENSHOTS, storagePath, file);
    if (uploaded) {
      return uploaded;
    }

    // Offline fallback to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({
            url: reader.result,
            storagePath: `local/${storagePath}`,
          });
        } else {
          reject(new Error('Failed to convert screenshot to data URL'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read screenshot file'));
      reader.readAsDataURL(file);
    });
  }

  // Upload avatar image to Supabase Storage 'Avatar Image' bucket
  public async uploadAvatarImage(
    file: File
  ): Promise<{ url: string; storagePath: string }> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const storagePath = `profile/avatar_${Date.now()}.${fileExt}`;

    const uploaded = await this.uploadToBucket(DataService.BUCKETS.AVATAR_IMAGE, storagePath, file);
    if (uploaded) {
      return uploaded;
    }

    // Offline fallback to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({
            url: reader.result,
            storagePath: `local/${storagePath}`,
          });
        } else {
          reject(new Error('Failed to convert avatar to data URL'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read avatar file'));
      reader.readAsDataURL(file);
    });
  }

  // Upload technology icon to Supabase Storage 'App Icon' bucket
  public async uploadTechnologyIcon(
    file: File
  ): Promise<{ url: string; storagePath: string }> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const storagePath = `technologies/tech_${Date.now()}.${fileExt}`;

    const uploaded = await this.uploadToBucket(DataService.BUCKETS.APP_ICON, storagePath, file);
    if (uploaded) {
      return uploaded;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({
            url: reader.result,
            storagePath: `local/${storagePath}`,
          });
        } else {
          reject(new Error('Failed to convert icon to data URL'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read icon file'));
      reader.readAsDataURL(file);
    });
  }

  public saveProject(project: Project): Project {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    let updated: Project[];

    const normalizedIconUrl = project.icon_url || project.iconUrl || (project.icon && (project.icon.startsWith('http') || project.icon.startsWith('data:') || project.icon.startsWith('/')) ? project.icon : undefined);

    const projectToSave: Project = {
      ...project,
      icon_url: normalizedIconUrl,
      iconUrl: normalizedIconUrl,
      lastUpdated: project.lastUpdated || new Date().toISOString().split('T')[0],
    };

    if (index >= 0) {
      updated = [...projects];
      updated[index] = projectToSave;
    } else {
      const newProj = {
        ...projectToSave,
        id: project.id || `proj-${Date.now()}`,
        slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      };
      updated = [newProj, ...projects];
    }

    this.setItem(STORAGE_KEYS.PROJECTS, updated);

    // If APK download is enabled and an APK url/version exists, ensure an APK release entry is synchronized
    if (project.apkDownloadEnabled && project.apkDownloadUrl) {
      this.syncApkReleaseFromProject(projectToSave);
    }

    return index >= 0 ? updated[index] : updated[0];
  }

  public deleteProject(projectId: string): void {
    const project = this.getProjects().find((p) => p.id === projectId);
    if (project?.icon_storage_path) {
      this.removeProjectIcon(project.icon_storage_path);
    }
    const projects = this.getProjects().filter((p) => p.id !== projectId);
    this.setItem(STORAGE_KEYS.PROJECTS, projects);
    // Also remove associated APK releases
    const releases = this.getApkReleases().filter((r) => r.projectId !== projectId);
    this.setItem(STORAGE_KEYS.RELEASES, releases);
  }

  // ================= APK RELEASES =================
  public getApkReleases(): ApkRelease[] {
    return this.getItem<ApkRelease[]>(STORAGE_KEYS.RELEASES, initialApkReleases);
  }

  public saveApkRelease(release: ApkRelease): ApkRelease {
    const releases = this.getApkReleases();
    const index = releases.findIndex((r) => r.id === release.id);
    let updated: ApkRelease[];

    if (index >= 0) {
      updated = [...releases];
      updated[index] = release;
    } else {
      const newRel = {
        ...release,
        id: release.id || `rel-${Date.now()}`,
        releaseDate: release.releaseDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      updated = [newRel, ...releases];
    }

    // If marked as latest, update the corresponding project's apk size and version
    if (release.isLatest) {
      const projects = this.getProjects();
      const projIndex = projects.findIndex((p) => p.id === release.projectId || p.title === release.projectName);
      if (projIndex >= 0) {
        projects[projIndex].version = release.version;
        projects[projIndex].apkSize = release.size;
        projects[projIndex].apkDownloadUrl = release.downloadUrl;
        projects[projIndex].lastUpdated = release.releaseDate;
        this.setItem(STORAGE_KEYS.PROJECTS, projects);
      }
    }

    this.setItem(STORAGE_KEYS.RELEASES, updated);
    return index >= 0 ? updated[index] : updated[0];
  }

  public deleteApkRelease(releaseId: string): void {
    const releases = this.getApkReleases().filter((r) => r.id !== releaseId);
    this.setItem(STORAGE_KEYS.RELEASES, releases);
  }

  private syncApkReleaseFromProject(project: Project): void {
    const releases = this.getApkReleases();
    const existing = releases.find((r) => r.projectId === project.id);
    if (!existing) {
      const newRelease: ApkRelease = {
        id: `rel-${project.slug}-${Date.now()}`,
        projectId: project.id,
        projectName: project.title,
        projectIcon: project.icon_url || project.iconUrl || project.icon || 'home',
        version: project.version,
        size: project.apkSize,
        releaseDate: project.lastUpdated,
        downloadUrl: project.apkDownloadUrl,
        releaseNotes: `Automated release sync for ${project.title} ${project.version}.`,
        isLatest: true,
        downloadsCount: Math.floor(Math.random() * 200) + 50,
      };
      this.saveApkRelease(newRelease);
    }
  }

  // ================= TECHNOLOGIES & SKILLS =================
  public getTechnologies(): Technology[] {
    return this.getItem<Technology[]>(STORAGE_KEYS.TECHNOLOGIES, initialTechnologies);
  }

  public getActiveTechnologies(): Technology[] {
    return this.getTechnologies()
      .filter((t) => t.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  public getFeaturedTechnologies(): Technology[] {
    return this.getTechnologies()
      .filter((t) => t.is_active && (t.featured_on_home !== false))
      .sort((a, b) => a.display_order - b.display_order);
  }

  public saveTechnology(tech: Technology): Technology {
    const list = this.getTechnologies();
    const index = list.findIndex((t) => t.id === tech.id);
    let updated: Technology[];

    if (index >= 0) {
      updated = [...list];
      updated[index] = {
        ...tech,
        updated_at: new Date().toISOString(),
      };
    } else {
      const newTech: Technology = {
        ...tech,
        id: tech.id || `tech-${Date.now()}`,
        display_order: tech.display_order || list.length + 1,
        is_active: tech.is_active !== undefined ? tech.is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updated = [...list, newTech];
    }

    this.setItem(STORAGE_KEYS.TECHNOLOGIES, updated);
    return index >= 0 ? updated[index] : updated[updated.length - 1];
  }

  public deleteTechnology(techId: string): void {
    const list = this.getTechnologies().filter((t) => t.id !== techId);
    this.setItem(STORAGE_KEYS.TECHNOLOGIES, list);
  }

  public toggleTechnologyStatus(techId: string): Technology | undefined {
    const list = this.getTechnologies();
    const index = list.findIndex((t) => t.id === techId);
    if (index >= 0) {
      list[index].is_active = !list[index].is_active;
      list[index].updated_at = new Date().toISOString();
      this.setItem(STORAGE_KEYS.TECHNOLOGIES, list);
      return list[index];
    }
    return undefined;
  }

  public reorderTechnologies(reordered: Technology[]): void {
    const updated = reordered.map((t, idx) => ({ ...t, display_order: idx + 1 }));
    this.setItem(STORAGE_KEYS.TECHNOLOGIES, updated);
  }

  // ================= TECHNOLOGY CATEGORIES =================
  public getTechnologyCategories(): TechnologyCategory[] {
    return this.getItem<TechnologyCategory[]>(STORAGE_KEYS.TECH_CATEGORIES, initialTechnologyCategories);
  }

  public saveTechnologyCategory(category: TechnologyCategory): TechnologyCategory {
    const list = this.getTechnologyCategories();
    const index = list.findIndex((c) => c.id === category.id);
    let updated: TechnologyCategory[];

    if (index >= 0) {
      updated = [...list];
      updated[index] = category;
    } else {
      const newCat: TechnologyCategory = {
        ...category,
        id: category.id || `cat-${Date.now()}`,
        display_order: category.display_order || list.length + 1,
      };
      updated = [...list, newCat];
    }

    this.setItem(STORAGE_KEYS.TECH_CATEGORIES, updated);
    return index >= 0 ? updated[index] : updated[updated.length - 1];
  }

  public deleteTechnologyCategory(categoryId: string): void {
    const list = this.getTechnologyCategories().filter((c) => c.id !== categoryId);
    this.setItem(STORAGE_KEYS.TECH_CATEGORIES, list);
  }

  // ================= PLATFORMS =================
  public getPlatforms(): Platform[] {
    return this.getItem<Platform[]>(STORAGE_KEYS.PLATFORMS, initialPlatforms);
  }

  public getActivePlatforms(): Platform[] {
    return this.getPlatforms()
      .filter((p) => p.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  public savePlatform(platform: Platform): Platform {
    const list = this.getPlatforms();
    const index = list.findIndex((p) => p.id === platform.id);
    let updated: Platform[];

    if (index >= 0) {
      updated = [...list];
      updated[index] = {
        ...platform,
        updated_at: new Date().toISOString(),
      };
    } else {
      const newPlat: Platform = {
        ...platform,
        id: platform.id || `plat-${Date.now()}`,
        slug: platform.slug || platform.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        display_order: platform.display_order || list.length + 1,
        is_active: platform.is_active !== undefined ? platform.is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updated = [...list, newPlat];
    }

    this.setItem(STORAGE_KEYS.PLATFORMS, updated);
    return index >= 0 ? updated[index] : updated[updated.length - 1];
  }

  public deletePlatform(platformId: string): void {
    const list = this.getPlatforms().filter((p) => p.id !== platformId);
    this.setItem(STORAGE_KEYS.PLATFORMS, list);
  }

  public togglePlatformStatus(platformId: string): Platform | undefined {
    const list = this.getPlatforms();
    const index = list.findIndex((p) => p.id === platformId);
    if (index >= 0) {
      list[index].is_active = !list[index].is_active;
      list[index].updated_at = new Date().toISOString();
      this.setItem(STORAGE_KEYS.PLATFORMS, list);
      return list[index];
    }
    return undefined;
  }

  public reorderPlatforms(reordered: Platform[]): void {
    const updated = reordered.map((p, idx) => ({ ...p, display_order: idx + 1 }));
    this.setItem(STORAGE_KEYS.PLATFORMS, updated);
  }

  // Backward compatibility for Skill
  public getSkills(): Skill[] {
    return this.getTechnologies();
  }

  public saveSkill(skill: Skill): Skill {
    return this.saveTechnology(skill);
  }

  public deleteSkill(skillId: string): void {
    this.deleteTechnology(skillId);
  }

  // ================= WEBSITE CONTENT =================
  public getContent(): WebsiteContent {
    return this.getItem<WebsiteContent>(STORAGE_KEYS.CONTENT, initialWebsiteContent);
  }

  public saveContent(content: WebsiteContent): WebsiteContent {
    this.setItem(STORAGE_KEYS.CONTENT, content);
    return content;
  }

  // ================= SOCIAL LINKS =================
  public getSocialLinks(): SocialLink[] {
    return this.getItem<SocialLink[]>(STORAGE_KEYS.SOCIALS, initialSocialLinks);
  }

  public saveSocialLinks(links: SocialLink[]): SocialLink[] {
    this.setItem(STORAGE_KEYS.SOCIALS, links);
    return links;
  }

  // ================= SETTINGS =================
  public getSettings(): WebsiteSettings {
    return this.getItem<WebsiteSettings>(STORAGE_KEYS.SETTINGS, initialWebsiteSettings);
  }

  public saveSettings(settings: WebsiteSettings): WebsiteSettings {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
    resetSupabaseClient();
    return settings;
  }

  // ================= CONTACT MESSAGES =================
  public getMessages(): ContactMessage[] {
    return this.getItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  }

  public addMessage(name: string, email: string, message: string): ContactMessage {
    const msgs = this.getMessages();
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      message,
      createdAt: new Date().toLocaleString(),
      read: false,
    };
    const updated = [newMsg, ...msgs];
    this.setItem(STORAGE_KEYS.MESSAGES, updated);
    return newMsg;
  }

  public deleteMessage(id: string): void {
    const updated = this.getMessages().filter((m) => m.id !== id);
    this.setItem(STORAGE_KEYS.MESSAGES, updated);
  }

  // ================= TRAFFIC / ANALYTICS STATS =================
  public getTrafficStats() {
    const defaultStats = {
      totalVisitors: 8932,
      totalDownloads: 12450,
      chartData: [
        { label: '01', value: 240 },
        { label: '05', value: 380 },
        { label: '10', value: 310 },
        { label: '15', value: 520 },
        { label: '20', value: 430 },
        { label: '25', value: 680 },
        { label: '30', value: 590 },
      ],
    };
    return this.getItem(STORAGE_KEYS.TRAFFIC, defaultStats);
  }

  public incrementVisitorCount(): void {
    const stats = this.getTrafficStats();
    stats.totalVisitors += 1;
    this.setItem(STORAGE_KEYS.TRAFFIC, stats);
  }

  public incrementDownloadCount(projectId?: string): void {
    const stats = this.getTrafficStats();
    stats.totalDownloads += 1;
    this.setItem(STORAGE_KEYS.TRAFFIC, stats);

    if (projectId) {
      const releases = this.getApkReleases();
      const release = releases.find((r) => r.projectId === projectId);
      if (release) {
        release.downloadsCount += 1;
        this.setItem(STORAGE_KEYS.RELEASES, releases);
      }
    }
  }

  // ================= ADMIN AUTH =================
  public getAdminUser(): AdminUser | null {
    return this.getItem<AdminUser | null>(STORAGE_KEYS.AUTH, null);
  }

  public login(email: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
    // Allows admin@gotop.dev / admin123 or any admin username configured
    const normalizedEmail = email.trim().toLowerCase();
    if (
      (normalizedEmail === 'admin@gotop.dev' || normalizedEmail === 'admin' || normalizedEmail === 'admin@gotop-technologies.com') &&
      password === 'admin123'
    ) {
      this.setItem(STORAGE_KEYS.AUTH, defaultAdminUser);
      return { success: true, user: defaultAdminUser };
    }

    // Also support any password if user just typed 'admin' or custom admin
    if (normalizedEmail === 'admin' && (password === 'admin' || password === 'admin123')) {
      this.setItem(STORAGE_KEYS.AUTH, defaultAdminUser);
      return { success: true, user: defaultAdminUser };
    }

    return { success: false, error: 'Invalid email or password. Use demo: admin@gotop.dev / admin123' };
  }

  public logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }

  public isAuthenticated(): boolean {
    return this.getAdminUser() !== null;
  }

  // Reset to initial reference mock data
  public resetToFactoryDefaults(): void {
    this.setItem(STORAGE_KEYS.PROJECTS, initialProjects);
    this.setItem(STORAGE_KEYS.RELEASES, initialApkReleases);
    this.setItem(STORAGE_KEYS.SKILLS, initialSkills);
    this.setItem(STORAGE_KEYS.CONTENT, initialWebsiteContent);
    this.setItem(STORAGE_KEYS.SOCIALS, initialSocialLinks);
    this.setItem(STORAGE_KEYS.SETTINGS, initialWebsiteSettings);
    this.setItem(STORAGE_KEYS.MESSAGES, []);
  }
}

export const dataService = new DataService();

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
      let usedBucket = bucketConfig.primary;
      let res = await supabase.storage
        .from(bucketConfig.primary)
        .upload(storagePath, file, { cacheControl: '3600', upsert: true });

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

  // Upload actual project app icon to Supabase Storage 'App Icon' bucket
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

  // ================= PROJECTS (MAPPING & CRUD) =================
  private mapProjectFromDb(row: any): Project {
    const rawIcon =
      row.icon_url ||
      row.iconUrl ||
      (row.icon && (row.icon.startsWith('http') || row.icon.startsWith('data:') || row.icon.startsWith('/')) ? row.icon : undefined);

    return {
      id: String(row.id),
      title: row.title || 'Untitled',
      slug: row.slug || String(row.id),
      subtitle: row.subtitle || '',
      shortDescription: row.short_description ?? row.shortDescription ?? '',
      fullDescription: row.full_description ?? row.fullDescription ?? '',
      category: row.category || 'mobile',
      icon: row.icon || 'home',
      iconBg: row.icon_bg || row.iconBg || 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon_url: rawIcon,
      iconUrl: rawIcon,
      icon_storage_path: row.icon_storage_path || undefined,
      version: row.version || 'v1.0.0',
      apkSize: row.apk_size || row.apkSize || '15 MB',
      lastUpdated: row.last_updated || row.lastUpdated || new Date().toISOString().split('T')[0],
      featured: Boolean(row.featured),
      playStoreEnabled: row.play_store_enabled !== undefined ? Boolean(row.play_store_enabled) : true,
      playStoreUrl: row.play_store_url || row.playStoreUrl || '',
      apkDownloadEnabled: row.apk_download_enabled !== undefined ? Boolean(row.apk_download_enabled) : true,
      apkDownloadUrl: row.apk_download_url || row.apkDownloadUrl || '',
      platforms: Array.isArray(row.platforms) && row.platforms.length > 0 ? row.platforms : ['Android App'],
      technologies: Array.isArray(row.technologies) ? row.technologies : [],
      features: Array.isArray(row.features) ? row.features : [],
      screenshots: Array.isArray(row.screenshots) ? row.screenshots : [],
    };
  }

  private mapProjectToDb(p: Project): any {
    const normIcon =
      p.icon_url ||
      p.iconUrl ||
      (p.icon && (p.icon.startsWith('http') || p.icon.startsWith('data:') || p.icon.startsWith('/')) ? p.icon : 'home');

    return {
      id: p.id,
      title: p.title,
      slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      subtitle: p.subtitle || '',
      short_description: p.shortDescription || '',
      full_description: p.fullDescription || '',
      category: p.category || 'mobile',
      icon: normIcon,
      icon_bg: p.iconBg || 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon_url: p.icon_url || p.iconUrl || null,
      icon_storage_path: p.icon_storage_path || null,
      version: p.version || 'v1.0.0',
      apk_size: p.apkSize || '15 MB',
      last_updated: p.lastUpdated || new Date().toISOString().split('T')[0],
      featured: Boolean(p.featured),
      play_store_enabled: Boolean(p.playStoreEnabled),
      play_store_url: p.playStoreUrl || null,
      apk_download_enabled: Boolean(p.apkDownloadEnabled),
      apk_download_url: p.apkDownloadUrl || null,
      platforms: p.platforms && p.platforms.length > 0 ? p.platforms : ['Android App'],
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      features: Array.isArray(p.features) ? p.features : [],
      screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
      updated_at: new Date().toISOString(),
    };
  }

  public getProjects(): Project[] {
    const list = this.getItem<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
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

  public async fetchProjectsFromSupabase(): Promise<Project[] | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch projects error:', error.message);
        return null;
      }

      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((r) => this.mapProjectFromDb(r));
        this.setItem(STORAGE_KEYS.PROJECTS, mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Failed to fetch projects from Supabase:', err);
    }
    return null;
  }

  public async saveProject(project: Project): Promise<Project> {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    let updated: Project[];

    const normalizedIconUrl =
      project.icon_url ||
      project.iconUrl ||
      (project.icon && (project.icon.startsWith('http') || project.icon.startsWith('data:') || project.icon.startsWith('/')) ? project.icon : undefined);

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

    // Sync APK release entry if configured
    if (project.apkDownloadEnabled && project.apkDownloadUrl) {
      this.syncApkReleaseFromProject(projectToSave);
    }

    // Asynchronously upsert to Supabase
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const dbRow = this.mapProjectToDb(projectToSave);
        const { error } = await supabase.from('projects').upsert(dbRow, { onConflict: 'id' });
        if (error) {
          console.warn('Supabase projects table upsert error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase saveProject error:', err);
      }
    }

    return index >= 0 ? updated[index] : updated[0];
  }

  public async deleteProject(projectId: string): Promise<void> {
    const project = this.getProjects().find((p) => p.id === projectId);
    if (project?.icon_storage_path) {
      this.removeProjectIcon(project.icon_storage_path);
    }
    const projects = this.getProjects().filter((p) => p.id !== projectId);
    this.setItem(STORAGE_KEYS.PROJECTS, projects);

    const releases = this.getApkReleases().filter((r) => r.projectId !== projectId);
    this.setItem(STORAGE_KEYS.RELEASES, releases);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('projects').delete().eq('id', projectId);
      } catch (err) {
        console.warn('Supabase deleteProject error:', err);
      }
    }
  }

  // ================= APK RELEASES =================
  private mapApkReleaseFromDb(r: any): ApkRelease {
    return {
      id: String(r.id),
      projectId: r.project_id || r.projectId || '',
      projectName: r.project_name || r.projectName || '',
      projectIcon: r.project_icon || r.projectIcon || 'home',
      version: r.version || 'v1.0.0',
      size: r.size || '15 MB',
      releaseDate: r.release_date || r.releaseDate || '',
      downloadUrl: r.download_url || r.downloadUrl || '',
      releaseNotes: r.release_notes || r.releaseNotes || '',
      isLatest: Boolean(r.is_latest ?? r.isLatest),
      downloadsCount: Number(r.downloads_count ?? r.downloadsCount ?? 0),
    };
  }

  private mapApkReleaseToDb(rel: ApkRelease): any {
    return {
      id: rel.id,
      project_id: rel.projectId || null,
      project_name: rel.projectName,
      project_icon: rel.projectIcon || null,
      version: rel.version,
      size: rel.size,
      release_date: rel.releaseDate,
      download_url: rel.downloadUrl,
      release_notes: rel.releaseNotes || null,
      is_latest: Boolean(rel.isLatest),
      downloads_count: Number(rel.downloadsCount || 0),
    };
  }

  public getApkReleases(): ApkRelease[] {
    return this.getItem<ApkRelease[]>(STORAGE_KEYS.RELEASES, initialApkReleases);
  }

  public async fetchApkReleasesFromSupabase(): Promise<ApkRelease[] | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('apk_releases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch releases error:', error.message);
        return null;
      }

      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((r) => this.mapApkReleaseFromDb(r));
        this.setItem(STORAGE_KEYS.RELEASES, mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Failed to fetch apk releases from Supabase:', err);
    }
    return null;
  }

  public async saveApkRelease(release: ApkRelease): Promise<ApkRelease> {
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

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const row = this.mapApkReleaseToDb(release);
        await supabase.from('apk_releases').upsert(row, { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase saveApkRelease error:', err);
      }
    }

    return index >= 0 ? updated[index] : updated[0];
  }

  public async deleteApkRelease(releaseId: string): Promise<void> {
    const releases = this.getApkReleases().filter((r) => r.id !== releaseId);
    this.setItem(STORAGE_KEYS.RELEASES, releases);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('apk_releases').delete().eq('id', releaseId);
      } catch (err) {
        console.warn('Supabase deleteApkRelease error:', err);
      }
    }
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

  public async fetchTechnologiesFromSupabase(): Promise<Technology[] | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('technologies')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.warn('Supabase fetch technologies error:', error.message);
        return null;
      }

      if (Array.isArray(data) && data.length > 0) {
        this.setItem(STORAGE_KEYS.TECHNOLOGIES, data);
        return data;
      }
    } catch (err) {
      console.warn('Failed to fetch technologies from Supabase:', err);
    }
    return null;
  }

  public async saveTechnology(tech: Technology): Promise<Technology> {
    const list = this.getTechnologies();
    const index = list.findIndex((t) => t.id === tech.id);
    let updated: Technology[];

    const finalTech: Technology = {
      ...tech,
      id: tech.id || `tech-${Date.now()}`,
      display_order: tech.display_order || list.length + 1,
      is_active: tech.is_active !== undefined ? tech.is_active : true,
      updated_at: new Date().toISOString(),
    };

    if (index >= 0) {
      updated = [...list];
      updated[index] = finalTech;
    } else {
      updated = [...list, finalTech];
    }

    this.setItem(STORAGE_KEYS.TECHNOLOGIES, updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('technologies').upsert(finalTech, { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase saveTechnology error:', err);
      }
    }

    return finalTech;
  }

  public async deleteTechnology(techId: string): Promise<void> {
    const list = this.getTechnologies().filter((t) => t.id !== techId);
    this.setItem(STORAGE_KEYS.TECHNOLOGIES, list);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('technologies').delete().eq('id', techId);
      } catch (err) {
        console.warn('Supabase deleteTechnology error:', err);
      }
    }
  }

  public toggleTechnologyStatus(techId: string): Technology | undefined {
    const list = this.getTechnologies();
    const index = list.findIndex((t) => t.id === techId);
    if (index >= 0) {
      list[index].is_active = !list[index].is_active;
      list[index].updated_at = new Date().toISOString();
      this.saveTechnology(list[index]);
      return list[index];
    }
    return undefined;
  }

  public reorderTechnologies(reordered: Technology[]): void {
    const updated = reordered.map((t, idx) => ({ ...t, display_order: idx + 1 }));
    this.setItem(STORAGE_KEYS.TECHNOLOGIES, updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      Promise.all(updated.map((t) => supabase.from('technologies').upsert(t, { onConflict: 'id' }))).catch((e) =>
        console.warn('Supabase reorderTechnologies error:', e)
      );
    }
  }

  // Technology Categories
  public getTechnologyCategories(): TechnologyCategory[] {
    return this.getItem<TechnologyCategory[]>(STORAGE_KEYS.TECH_CATEGORIES, initialTechnologyCategories);
  }

  public async fetchTechnologyCategoriesFromSupabase(): Promise<TechnologyCategory[] | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('technology_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.warn('Supabase fetch categories error:', error.message);
        return null;
      }

      if (Array.isArray(data) && data.length > 0) {
        this.setItem(STORAGE_KEYS.TECH_CATEGORIES, data);
        return data;
      }
    } catch (err) {
      console.warn('Failed to fetch categories from Supabase:', err);
    }
    return null;
  }

  public async saveTechnologyCategory(category: TechnologyCategory): Promise<TechnologyCategory> {
    const list = this.getTechnologyCategories();
    const index = list.findIndex((c) => c.id === category.id);
    let updated: TechnologyCategory[];

    const finalCat = {
      ...category,
      id: category.id || `cat-${Date.now()}`,
    };

    if (index >= 0) {
      updated = [...list];
      updated[index] = finalCat;
    } else {
      updated = [...list, finalCat];
    }

    this.setItem(STORAGE_KEYS.TECH_CATEGORIES, updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('technology_categories').upsert(finalCat, { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase saveTechnologyCategory error:', err);
      }
    }

    return finalCat;
  }

  public async deleteTechnologyCategory(categoryId: string): Promise<void> {
    const list = this.getTechnologyCategories().filter((c) => c.id !== categoryId);
    this.setItem(STORAGE_KEYS.TECH_CATEGORIES, list);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('technology_categories').delete().eq('id', categoryId);
      } catch (err) {
        console.warn('Supabase deleteTechnologyCategory error:', err);
      }
    }
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

  public async fetchPlatformsFromSupabase(): Promise<Platform[] | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.warn('Supabase fetch platforms error:', error.message);
        return null;
      }

      if (Array.isArray(data) && data.length > 0) {
        this.setItem(STORAGE_KEYS.PLATFORMS, data);
        return data;
      }
    } catch (err) {
      console.warn('Failed to fetch platforms from Supabase:', err);
    }
    return null;
  }

  public async savePlatform(platform: Platform): Promise<Platform> {
    const list = this.getPlatforms();
    const index = list.findIndex((p) => p.id === platform.id);
    let updated: Platform[];

    const finalPlat: Platform = {
      ...platform,
      id: platform.id || `plat-${Date.now()}`,
      slug: platform.slug || platform.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      display_order: platform.display_order || list.length + 1,
      is_active: platform.is_active !== undefined ? platform.is_active : true,
      updated_at: new Date().toISOString(),
    };

    if (index >= 0) {
      updated = [...list];
      updated[index] = finalPlat;
    } else {
      updated = [...list, finalPlat];
    }

    this.setItem(STORAGE_KEYS.PLATFORMS, updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('platforms').upsert(finalPlat, { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase savePlatform error:', err);
      }
    }

    return finalPlat;
  }

  public async deletePlatform(platformId: string): Promise<void> {
    const list = this.getPlatforms().filter((p) => p.id !== platformId);
    this.setItem(STORAGE_KEYS.PLATFORMS, list);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('platforms').delete().eq('id', platformId);
      } catch (err) {
        console.warn('Supabase deletePlatform error:', err);
      }
    }
  }

  public togglePlatformStatus(platformId: string): Platform | undefined {
    const list = this.getPlatforms();
    const index = list.findIndex((p) => p.id === platformId);
    if (index >= 0) {
      list[index].is_active = !list[index].is_active;
      list[index].updated_at = new Date().toISOString();
      this.savePlatform(list[index]);
      return list[index];
    }
    return undefined;
  }

  public reorderPlatforms(reordered: Platform[]): void {
    const updated = reordered.map((p, idx) => ({ ...p, display_order: idx + 1 }));
    this.setItem(STORAGE_KEYS.PLATFORMS, updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      Promise.all(updated.map((p) => supabase.from('platforms').upsert(p, { onConflict: 'id' }))).catch((e) =>
        console.warn('Supabase reorderPlatforms error:', e)
      );
    }
  }

  // Backward compatibility for Skill
  public getSkills(): Skill[] {
    return this.getTechnologies();
  }

  public saveSkill(skill: Skill): Promise<Skill> {
    return this.saveTechnology(skill);
  }

  public deleteSkill(skillId: string): Promise<void> {
    return this.deleteTechnology(skillId);
  }

  // ================= WEBSITE CONTENT =================
  public getContent(): WebsiteContent {
    return this.getItem<WebsiteContent>(STORAGE_KEYS.CONTENT, initialWebsiteContent);
  }

  public async fetchContentFromSupabase(): Promise<WebsiteContent | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('key', 'main')
        .maybeSingle();

      if (error) {
        console.warn('Supabase fetch content error:', error.message);
        return null;
      }

      if (data?.data) {
        this.setItem(STORAGE_KEYS.CONTENT, data.data);
        return data.data as WebsiteContent;
      }
    } catch (err) {
      console.warn('Failed to fetch content from Supabase:', err);
    }
    return null;
  }

  public async saveContent(content: WebsiteContent): Promise<WebsiteContent> {
    this.setItem(STORAGE_KEYS.CONTENT, content);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('website_content').upsert(
          {
            key: 'main',
            data: content,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );
      } catch (err) {
        console.warn('Supabase saveContent error:', err);
      }
    }
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

  public async fetchSettingsFromSupabase(): Promise<WebsiteSettings | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.warn('Supabase fetch settings error:', error.message);
        return null;
      }

      if (data) {
        const local = this.getSettings();
        const merged: WebsiteSettings = {
          ...local,
          websiteName: data.website_name || local.websiteName,
          logoText: data.logo_text || local.logoText,
          favicon: data.favicon || local.favicon,
          seoTitle: data.seo_title || local.seoTitle,
          seoDescription: data.seo_description || local.seoDescription,
          socialPreviewImage: data.social_preview_image || local.socialPreviewImage,
          themePreference: (data.theme_preference as any) || local.themePreference,
        };
        this.setItem(STORAGE_KEYS.SETTINGS, merged);
        return merged;
      }
    } catch (err) {
      console.warn('Failed to fetch settings from Supabase:', err);
    }
    return null;
  }

  public async saveSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
    resetSupabaseClient();

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('website_settings').upsert({
          id: 1,
          website_name: settings.websiteName,
          logo_text: settings.logoText,
          favicon: settings.favicon || null,
          seo_title: settings.seoTitle,
          seo_description: settings.seoDescription,
          social_preview_image: settings.socialPreviewImage || null,
          theme_preference: settings.themePreference,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase saveSettings error:', err);
      }
    }

    return settings;
  }

  // ================= ONE-CLICK INITIAL DATA SEEDER =================
  public async seedSupabaseDatabase(): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: 'Supabase is not connected. Enter Supabase URL and Anon Key first.' };
    }

    try {
      // 1. Check if projects table exists and query count
      const { data: existingProjects, error: projErr } = await supabase.from('projects').select('id').limit(1);
      if (projErr) {
        return {
          success: false,
          message: `Database error: "${projErr.message}". Please run supabase_schema.sql in your Supabase SQL Editor.`,
        };
      }

      // Seed all projects
      const currentProjects = this.getProjects();
      for (const p of currentProjects) {
        const row = this.mapProjectToDb(p);
        await supabase.from('projects').upsert(row, { onConflict: 'id' });
      }

      // Seed technologies
      const currentTechs = this.getTechnologies();
      for (const t of currentTechs) {
        await supabase.from('technologies').upsert(t, { onConflict: 'id' });
      }

      // Seed platforms
      const currentPlatforms = this.getPlatforms();
      for (const pl of currentPlatforms) {
        await supabase.from('platforms').upsert(pl, { onConflict: 'id' });
      }

      // Seed technology categories
      const currentCategories = this.getTechnologyCategories();
      for (const cat of currentCategories) {
        await supabase.from('technology_categories').upsert(cat, { onConflict: 'id' });
      }

      // Seed content
      const currentContent = this.getContent();
      await supabase.from('website_content').upsert(
        { key: 'main', data: currentContent, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

      // Seed APK releases
      const currentReleases = this.getApkReleases();
      for (const rel of currentReleases) {
        await supabase.from('apk_releases').upsert(this.mapApkReleaseToDb(rel), { onConflict: 'id' });
      }

      return {
        success: true,
        message: `Successfully synchronized ${currentProjects.length} projects, ${currentTechs.length} technologies, platforms, and content to Supabase!`,
      };
    } catch (err: any) {
      return { success: false, message: `Sync failed: ${err.message || err}` };
    }
  }

  // ================= CONTACT MESSAGES =================
  public getMessages(): ContactMessage[] {
    return this.getItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  }

  public async addMessage(name: string, email: string, message: string): Promise<ContactMessage> {
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

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('contact_messages').insert({
          id: newMsg.id,
          name,
          email,
          message,
          read: false,
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase addMessage error:', err);
      }
    }

    return newMsg;
  }

  public async deleteMessage(id: string): Promise<void> {
    const updated = this.getMessages().filter((m) => m.id !== id);
    this.setItem(STORAGE_KEYS.MESSAGES, updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('contact_messages').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteMessage error:', err);
      }
    }
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
        this.saveApkRelease(release);
      }
    }
  }

  // ================= ADMIN AUTH =================
  public getAdminUser(): AdminUser | null {
    return this.getItem<AdminUser | null>(STORAGE_KEYS.AUTH, null);
  }

  public login(email: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    if (
      (normalizedEmail === 'admin@gotop.dev' || normalizedEmail === 'admin' || normalizedEmail === 'admin@gotop-technologies.com') &&
      password === 'admin123'
    ) {
      this.setItem(STORAGE_KEYS.AUTH, defaultAdminUser);
      return { success: true, user: defaultAdminUser };
    }

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

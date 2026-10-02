export type ProjectCategory = 'all' | 'mobile' | 'web' | 'personal';

export interface Platform {
  id: string;
  name: string;
  slug: string;
  icon: string; // 'android' | 'apple' | 'globe' | 'monitor' | 'laptop' etc.
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectPlatform {
  project_id: string;
  platform_id: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  category: 'mobile' | 'web' | 'personal';
  icon?: string; // Legacy fallback icon name or direct URL
  iconBg?: string; // Legacy fallback gradient string
  icon_url?: string; // Actual uploaded app icon URL
  iconUrl?: string; // CamelCase alias for icon_url
  icon_storage_path?: string; // Supabase storage reference path (e.g. projects/{id}/icon.png)
  version: string;
  apkSize: string;
  lastUpdated: string;
  featured: boolean;
  playStoreEnabled: boolean;
  playStoreUrl: string;
  apkDownloadEnabled: boolean;
  apkDownloadUrl: string;
  platforms?: string[]; // e.g. ['Android App', 'iOS App'] or ['Web Application']
  platform_ids?: string[];
  technologies: string[];
  features: string[];
  screenshots: string[];
}

export interface ApkRelease {
  id: string;
  projectId: string;
  projectName: string;
  projectIcon: string;
  version: string;
  size: string;
  releaseDate: string;
  downloadUrl: string;
  releaseNotes: string;
  isLatest: boolean;
  downloadsCount: number;
}

export interface Technology {
  id: string;
  name: string;
  logo_url: string;
  category: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  featured_on_home?: boolean;
  created_at?: string;
  updated_at?: string;
  // Backward compatibility fields
  icon?: string;
  iconColor?: string;
  proficiency?: number;
}

export interface TechnologyCategory {
  id: string;
  name: string;
  display_order: number;
}

export type Skill = Technology;

export interface WebsiteContent {
  hero: {
    greeting: string;
    developerTitle: string;
    subtitle: string;
    techStack: string;
    description: string;
    primaryBtnText: string;
    secondaryBtnText: string;
  };
  stats: {
    appsDeveloped: string;
    appsDevelopedLabel: string;
    yearsExperience: string;
    yearsExperienceLabel: string;
    passion: string;
    passionLabel: string;
  };
  about: {
    badge: string;
    heading: string;
    subheading: string;
    description: string;
    highlights: Array<{
      id: string;
      title: string;
      icon: string;
    }>;
    avatarUrl: string;
    signatureText: string;
    authorName: string;
  };
  contact: {
    heading: string;
    subheading: string;
    description: string;
    email: string;
    phone: string;
    location: string;
  };
  footer: {
    brandName: string;
    tagline: string;
    copyrightText: string;
    madeWithText: string;
  };
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
}

export interface WebsiteSettings {
  websiteName: string;
  logoText: string;
  favicon: string;
  seoTitle: string;
  seoDescription: string;
  socialPreviewImage: string;
  themePreference: 'dark' | 'light' | 'auto';
  supabaseUrl: string;
  supabaseAnonKey: string;
  r2Endpoint: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string;
}

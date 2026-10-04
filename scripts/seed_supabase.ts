import { createClient } from '@supabase/supabase-js';
import {
  initialProjects,
  initialApkReleases,
  initialTechnologies,
  initialTechnologyCategories,
  initialPlatforms,
  initialWebsiteContent,
  initialWebsiteSettings,
} from '../src/services/mockData';

const supabaseUrl = 'https://hxjmpwiiibqwkxscdsjh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4am1wd2lpaWJxd2t4c2Nkc2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwOTM2ODksImV4cCI6MjEwNjY2OTY4OX0.qVH3R4pv8fAvgxsxSCba22YJe54CSkBeiUvdxdZERtU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('--- Starting Supabase Database Seed ---');

  // 1. Seed Platforms
  console.log(`Seeding ${initialPlatforms.length} platforms...`);
  for (const plat of initialPlatforms) {
    const { error } = await supabase.from('platforms').upsert({
      id: plat.id,
      name: plat.name,
      slug: plat.slug,
      icon: plat.icon || 'globe',
      display_order: plat.display_order ?? 1,
      is_active: plat.is_active ?? true,
    }, { onConflict: 'id' });
    if (error) console.error('Platform error:', error.message);
  }

  // 2. Seed Technology Categories
  console.log(`Seeding ${initialTechnologyCategories.length} tech categories...`);
  for (const cat of initialTechnologyCategories) {
    const { error } = await supabase.from('technology_categories').upsert({
      id: cat.id,
      name: cat.name,
      display_order: cat.display_order ?? 1,
    }, { onConflict: 'id' });
    if (error) console.error('Category error:', error.message);
  }

  // 3. Seed Technologies
  console.log(`Seeding ${initialTechnologies.length} technologies...`);
  for (const t of initialTechnologies) {
    const { error } = await supabase.from('technologies').upsert({
      id: t.id,
      name: t.name,
      logo_url: t.logo_url,
      category: t.category,
      description: t.description || null,
      display_order: t.display_order ?? 1,
      is_active: t.is_active ?? true,
      featured_on_home: t.featured_on_home ?? true,
    }, { onConflict: 'id' });
    if (error) console.error('Technology error:', error.message);
  }

  // 4. Seed Projects
  console.log(`Seeding ${initialProjects.length} projects...`);
  for (const p of initialProjects) {
    const dbRow = {
      id: p.id,
      title: p.title,
      slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      subtitle: p.subtitle || '',
      short_description: p.shortDescription || '',
      full_description: p.fullDescription || '',
      category: p.category || 'mobile',
      icon: p.icon || 'home',
      icon_bg: p.iconBg || 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon_url: p.icon_url || p.iconUrl || null,
      icon_storage_path: p.icon_storage_path || null,
      version: p.version || 'v1.0.0',
      apk_size: p.apkSize || '15 MB',
      last_updated: p.lastUpdated || new Date().toISOString().split('T')[0],
      featured: Boolean(p.featured),
      play_store_enabled: p.playStoreEnabled !== undefined ? Boolean(p.playStoreEnabled) : true,
      play_store_url: p.playStoreUrl || null,
      apk_download_enabled: p.apkDownloadEnabled !== undefined ? Boolean(p.apkDownloadEnabled) : true,
      apk_download_url: p.apkDownloadUrl || null,
      platforms: p.platforms && p.platforms.length > 0 ? p.platforms : ['Android App'],
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      features: Array.isArray(p.features) ? p.features : [],
      screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('projects').upsert(dbRow, { onConflict: 'id' });
    if (error) console.error(`Project ${p.id} error:`, error.message);
  }

  // 5. Seed APK Releases
  console.log(`Seeding ${initialApkReleases.length} apk releases...`);
  for (const r of initialApkReleases) {
    const { error } = await supabase.from('apk_releases').upsert({
      id: r.id,
      project_id: r.projectId,
      project_name: r.projectName,
      project_icon: r.projectIcon || null,
      version: r.version,
      size: r.size,
      release_date: r.releaseDate || new Date().toISOString().split('T')[0],
      download_url: r.downloadUrl,
      release_notes: r.releaseNotes || null,
      is_latest: Boolean(r.isLatest),
      downloads_count: r.downloadsCount || 0,
    }, { onConflict: 'id' });
    if (error) console.error(`Release ${r.id} error:`, error.message);
  }

  // 6. Seed Website Content
  console.log('Seeding website content...');
  const { error: contentErr } = await supabase.from('website_content').upsert({
    key: 'main',
    data: initialWebsiteContent,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'key' });
  if (contentErr) console.error('Website content error:', contentErr.message);

  // 7. Seed Website Settings
  console.log('Seeding website settings...');
  const { error: settingsErr } = await supabase.from('website_settings').upsert({
    id: 1,
    website_name: initialWebsiteSettings.websiteName || 'GoTop Technologies',
    logo_text: initialWebsiteSettings.logoText || 'GoTop',
    favicon: initialWebsiteSettings.favicon || null,
    seo_title: initialWebsiteSettings.seoTitle || 'GoTop Developer - Mobile & Full-Stack Engineer',
    seo_description: initialWebsiteSettings.seoDescription || '',
    social_preview_image: initialWebsiteSettings.socialPreviewImage || null,
    theme_preference: initialWebsiteSettings.themePreference || 'dark',
    contact_email: initialWebsiteSettings.contactEmail || 'contact@gotop-technologies.com',
    contact_phone: initialWebsiteSettings.contactPhone || '+91 98765 43210',
    contact_location: initialWebsiteSettings.contactLocation || 'India',
    social_links: initialWebsiteSettings.socialLinks || [],
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });
  if (settingsErr) console.error('Website settings error:', settingsErr.message);

  console.log('--- Supabase Database Seed Completed ---');
}

seed();

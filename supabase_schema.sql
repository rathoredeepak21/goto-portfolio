-- ====================================================================
-- GoTop Developer Portfolio - Supabase PostgreSQL Schema & RLS Setup
-- ====================================================================

-- 1. PROFILES & USERS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT DEFAULT 'GoTop Admin',
    role TEXT DEFAULT 'admin',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    category TEXT DEFAULT 'mobile' CHECK (category IN ('mobile', 'web', 'personal')),
    icon TEXT NOT NULL,
    icon_bg TEXT DEFAULT 'from-blue-500 to-cyan-500',
    version TEXT DEFAULT 'v1.0.0',
    apk_size TEXT DEFAULT '15 MB',
    last_updated DATE DEFAULT CURRENT_DATE,
    featured BOOLEAN DEFAULT false,
    play_store_enabled BOOLEAN DEFAULT true,
    play_store_url TEXT,
    apk_download_enabled BOOLEAN DEFAULT true,
    apk_download_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    screenshots TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. APK RELEASES TABLE
CREATE TABLE IF NOT EXISTS public.apk_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    version TEXT NOT NULL,
    size TEXT NOT NULL,
    release_date DATE DEFAULT CURRENT_DATE,
    download_url TEXT NOT NULL,
    release_notes TEXT,
    is_latest BOOLEAN DEFAULT false,
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PLATFORMS TABLE (Application platforms / types)
CREATE TABLE IF NOT EXISTS public.platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'globe',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PROJECT_PLATFORMS RELATION TABLE (Relational mapping for multi-platform projects)
CREATE TABLE IF NOT EXISTS public.project_platforms (
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES public.platforms(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, platform_id)
);

-- 6. TECHNOLOGY CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.technology_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TECHNOLOGIES TABLE (Dynamic official brand logos & skills)
CREATE TABLE IF NOT EXISTS public.technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    featured_on_home BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Backward compatibility view or table for skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    icon_color TEXT DEFAULT '#38bdf8',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. WEBSITE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.website_content (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. WEBSITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.website_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    website_name TEXT DEFAULT 'GoTop Technologies',
    logo_text TEXT DEFAULT 'GoTop',
    favicon TEXT,
    seo_title TEXT DEFAULT 'GoTop Developer - Mobile & Full-Stack Engineer',
    seo_description TEXT DEFAULT 'Portfolio of GoTop Developer. Building high-performance Flutter, React Native, and full-stack web applications.',
    social_preview_image TEXT,
    theme_preference TEXT DEFAULT 'dark' CHECK (theme_preference IN ('dark', 'light', 'auto')),
    contact_email TEXT DEFAULT 'contact@gotop-technologies.com',
    contact_phone TEXT DEFAULT '+91 98765 43210',
    contact_location TEXT DEFAULT 'India',
    social_links JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- 7. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apk_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technology_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS POLICIES
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can view platforms" ON public.platforms FOR SELECT USING (true);
CREATE POLICY "Public can view project_platforms" ON public.project_platforms FOR SELECT USING (true);
CREATE POLICY "Public can view apk_releases" ON public.apk_releases FOR SELECT USING (true);
CREATE POLICY "Public can view technologies" ON public.technologies FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view technology_categories" ON public.technology_categories FOR SELECT USING (true);
CREATE POLICY "Public can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public can view website_content" ON public.website_content FOR SELECT USING (true);
CREATE POLICY "Public can view website_settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public can insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS POLICIES (Users authenticated in Supabase)
CREATE POLICY "Admins full access on projects" ON public.projects 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access on platforms" ON public.platforms 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access on project_platforms" ON public.project_platforms 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access on apk_releases" ON public.apk_releases 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access on technologies" ON public.technologies 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access on technology_categories" ON public.technology_categories 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access on skills" ON public.skills 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access on website_content" ON public.website_content 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access on website_settings" ON public.website_settings 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access on contact_messages" ON public.contact_messages 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access on profiles" ON public.profiles 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- STORAGE BUCKETS SETUP (Run via Supabase Storage Dashboard or SQL)
-- Insert buckets: 'projects', 'screenshots', 'logos', 'avatars'
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('projects', 'projects', true),
    ('screenshots', 'screenshots', true),
    ('logos', 'logos', true),
    ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for Storage" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Admin Upload Access for Storage" ON storage.objects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update/Delete for Storage" ON storage.objects FOR UPDATE TO authenticated USING (true);

-- SEED OFFICIAL TECHNOLOGIES & CATEGORIES
INSERT INTO public.technology_categories (name, display_order)
VALUES
    ('Mobile Development', 1),
    ('Web Development', 2),
    ('Backend & Database', 3),
    ('Programming Languages', 4),
    ('Development Tools', 5),
    ('Design & Productivity', 6),
    ('DevOps / Infrastructure', 7)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.technologies (name, logo_url, category, description, display_order, is_active, featured_on_home)
VALUES
    ('Flutter', '/logos/flutter.svg', 'Mobile Development', 'Mobile App Development', 1, true, true),
    ('React Native', '/logos/react-native.svg', 'Mobile Development', 'Cross-Platform Framework', 2, true, true),
    ('React', '/logos/react.svg', 'Web Development', 'Frontend UI Library', 3, true, true),
    ('Tailwind CSS', '/logos/tailwind.svg', 'Web Development', 'Modern Styling System', 4, true, false),
    ('Firebase', '/logos/firebase.svg', 'Backend & Database', 'Cloud Auth & Realtime DB', 5, true, true),
    ('Supabase', '/logos/supabase.svg', 'Backend & Database', 'PostgreSQL & Realtime Backend', 6, true, true),
    ('Node.js', '/logos/nodejs.svg', 'Backend & Database', 'Runtime & REST APIs', 7, true, true),
    ('MongoDB', '/logos/mongodb.svg', 'Backend & Database', 'NoSQL Document Store', 8, true, false),
    ('Dart', '/logos/dart.svg', 'Programming Languages', 'Client-Optimized Language', 9, true, false),
    ('JavaScript', '/logos/javascript.svg', 'Programming Languages', 'Modern ES6+ Logic', 10, true, true),
    ('TypeScript', '/logos/typescript.svg', 'Programming Languages', 'Strict Type-Safe Code', 11, true, true),
    ('Python', '/logos/python.svg', 'Programming Languages', 'Scripting & Automation', 12, true, false),
    ('Git', '/logos/git.svg', 'Development Tools', 'Version Control System', 13, true, true),
    ('GitHub', '/logos/github.svg', 'Development Tools', 'Code Repository & CI/CD', 14, true, true),
    ('VS Code', '/logos/vscode.svg', 'Development Tools', 'Primary Development IDE', 15, true, true),
    ('Android Studio', '/logos/androidstudio.svg', 'Development Tools', 'Native Android Tools & Gradle', 16, true, true),
    ('Postman', '/logos/postman.svg', 'Development Tools', 'API Design & Testing', 17, true, false),
    ('Figma', '/logos/figma.svg', 'Design & Productivity', 'UI/UX Interface Prototyping', 18, true, true),
    ('Canva', '/logos/canva.svg', 'Design & Productivity', 'Visual Assets & Branding', 19, true, false),
    ('Docker', '/logos/docker.svg', 'DevOps / Infrastructure', 'Containerization & Environments', 20, true, false),
    ('Linux', '/logos/linux.svg', 'DevOps / Infrastructure', 'Server Administration & CLI', 21, true, false),
    ('Cloudflare', '/logos/cloudflare.svg', 'DevOps / Infrastructure', 'Edge CDN & R2 APK Storage', 22, true, false)
ON CONFLICT DO NOTHING;

-- SEED DEFAULT PLATFORMS
INSERT INTO public.platforms (name, slug, icon, display_order, is_active)
VALUES
    ('Android App', 'android-app', 'android', 1, true),
    ('iOS App', 'ios-app', 'apple', 2, true),
    ('Web Application', 'web-app', 'globe', 3, true),
    ('Website', 'website', 'globe', 4, true),
    ('Desktop Application', 'desktop-app', 'monitor', 5, true)
ON CONFLICT (name) DO NOTHING;


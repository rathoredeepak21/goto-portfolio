-- ====================================================================
-- GoTop Developer Portfolio - Supabase PostgreSQL Schema & RLS Setup
-- ====================================================================

-- 1. PROFILES & USERS
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT DEFAULT 'GoTop Admin',
    role TEXT DEFAULT 'admin',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    category TEXT DEFAULT 'mobile',
    icon TEXT NOT NULL,
    icon_bg TEXT DEFAULT 'from-blue-500 to-cyan-500',
    icon_url TEXT,
    icon_storage_path TEXT,
    version TEXT DEFAULT 'v1.0.0',
    apk_size TEXT DEFAULT '15 MB',
    last_updated DATE DEFAULT CURRENT_DATE,
    featured BOOLEAN DEFAULT false,
    play_store_enabled BOOLEAN DEFAULT true,
    play_store_url TEXT,
    apk_download_enabled BOOLEAN DEFAULT true,
    apk_download_url TEXT,
    platforms TEXT[] DEFAULT '{Android App}',
    technologies TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    screenshots TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all columns exist if table was already created earlier
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS icon_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS icon_storage_path TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS platforms TEXT[] DEFAULT '{Android App}';

-- 3. APK RELEASES TABLE
CREATE TABLE IF NOT EXISTS public.apk_releases (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    project_name TEXT NOT NULL,
    project_icon TEXT,
    version TEXT NOT NULL,
    size TEXT NOT NULL,
    release_date TEXT DEFAULT CURRENT_DATE::text,
    download_url TEXT NOT NULL,
    release_notes TEXT,
    is_latest BOOLEAN DEFAULT false,
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.apk_releases ADD COLUMN IF NOT EXISTS project_icon TEXT;

-- 4. PLATFORMS TABLE (Application platforms / types)
CREATE TABLE IF NOT EXISTS public.platforms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'globe',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TECHNOLOGY CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.technology_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TECHNOLOGIES TABLE (Dynamic official brand logos & skills)
CREATE TABLE IF NOT EXISTS public.technologies (
    id TEXT PRIMARY KEY,
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

-- 7. WEBSITE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.website_content (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. WEBSITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.website_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    website_name TEXT DEFAULT 'GoTop Technologies',
    logo_text TEXT DEFAULT 'GoTop',
    favicon TEXT,
    seo_title TEXT DEFAULT 'GoTop Developer - Mobile & Full-Stack Engineer',
    seo_description TEXT DEFAULT 'Portfolio of GoTop Developer. Building high-performance Flutter, React Native, and full-stack web applications.',
    social_preview_image TEXT,
    theme_preference TEXT DEFAULT 'dark',
    contact_email TEXT DEFAULT 'contact@gotop-technologies.com',
    contact_phone TEXT DEFAULT '+91 98765 43210',
    contact_location TEXT DEFAULT 'India',
    social_links JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- 9. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) HELPER FUNCTION & POLICIES
-- ====================================================================

-- 1. SECURITY DEFINER HELPER TO CHECK ADMIN STATUS (Avoids RLS Recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()::text
      AND role = 'admin'
  );
$$;

-- Grant execution permission on is_admin() to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 2. AUTOMATIC PROFILE TRIGGER ON NEW AUTH USER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'GoTop Admin'),
    -- If no admin exists yet in the database, promote the first user to admin; otherwise default to user
    CASE 
      WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN 'admin'
      ELSE 'user'
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. ENABLE RLS ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apk_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technology_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 4. DROP EXISTING POLICIES TO ALLOW RE-RUNNING CLEANLY
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;

DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

DROP POLICY IF EXISTS "Public can view platforms" ON public.platforms;
DROP POLICY IF EXISTS "Admins can manage platforms" ON public.platforms;

DROP POLICY IF EXISTS "Public can view apk_releases" ON public.apk_releases;
DROP POLICY IF EXISTS "Admins can manage apk_releases" ON public.apk_releases;

DROP POLICY IF EXISTS "Public can view technologies" ON public.technologies;
DROP POLICY IF EXISTS "Admins can manage technologies" ON public.technologies;

DROP POLICY IF EXISTS "Public can view technology_categories" ON public.technology_categories;
DROP POLICY IF EXISTS "Admins can manage technology_categories" ON public.technology_categories;

DROP POLICY IF EXISTS "Public can view website_content" ON public.website_content;
DROP POLICY IF EXISTS "Admins can manage website_content" ON public.website_content;

DROP POLICY IF EXISTS "Public can view website_settings" ON public.website_settings;
DROP POLICY IF EXISTS "Admins can manage website_settings" ON public.website_settings;

DROP POLICY IF EXISTS "Public can insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can manage contact_messages" ON public.contact_messages;

-- 5. PROFILES POLICIES
-- Authenticated users can view their own profile; admins can view all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid()::text OR public.is_admin());

-- Only admins can insert, update, or delete profiles
CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. PUBLIC READ ACCESS POLICIES (Unauthenticated visitors can read public portfolio data)
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can view platforms" ON public.platforms FOR SELECT USING (true);
CREATE POLICY "Public can view apk_releases" ON public.apk_releases FOR SELECT USING (true);
CREATE POLICY "Public can view technologies" ON public.technologies FOR SELECT USING (true);
CREATE POLICY "Public can view technology_categories" ON public.technology_categories FOR SELECT USING (true);
CREATE POLICY "Public can view website_content" ON public.website_content FOR SELECT USING (true);
CREATE POLICY "Public can view website_settings" ON public.website_settings FOR SELECT USING (true);

-- Public can submit contact messages
CREATE POLICY "Public can insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- 7. ADMIN-ONLY WRITE ACCESS POLICIES (Only verified admin role can modify data)
CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage platforms" ON public.platforms
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage apk_releases" ON public.apk_releases
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage technologies" ON public.technologies
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage technology_categories" ON public.technology_categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage website_content" ON public.website_content
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage website_settings" ON public.website_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view contact_messages" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can manage contact_messages" ON public.contact_messages
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ====================================================================
-- STORAGE BUCKETS SETUP & SECURITY
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('App Icon', 'App Icon', true),
    ('Screenshots', 'Screenshots', true),
    ('Avatar Image', 'Avatar Image', true),
    ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public Access for Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access for Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access for Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access for Storage" ON storage.objects;

-- Public can read assets from public portfolio buckets
CREATE POLICY "Public Access for Storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('App Icon', 'Screenshots', 'Avatar Image', 'portfolio-assets', 'app-icon', 'screenshots', 'avatar-image'));

-- Only verified admins can upload files
CREATE POLICY "Admin Upload Access for Storage" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- Only verified admins can update files
CREATE POLICY "Admin Update Access for Storage" ON storage.objects
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only verified admins can delete files
CREATE POLICY "Admin Delete Access for Storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (public.is_admin());


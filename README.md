# GoTop Developer Portfolio & Admin Platform

A complete, production-ready personal developer portfolio website with a fully featured admin management panel, created strictly according to the reference UI specification.

![GoTop Developer Portfolio](public/favicon.svg)

---

## 🚀 Key Features

### 1. Public Portfolio Website
- **Hero Section**: Futuristic developer introduction ("GoTop Developer", "I Build Modern Mobile Apps"), tech tags (`Flutter | React Native | Web | Backend`), CTA buttons ("View Projects", "Contact Me"), and isometric 3D glowing workstation illustration with neon `< / >` badge.
- **Featured Apps Section**: Modern glassmorphic cards for highlighted apps (Rentora, MusiqD, InfinityFlix, QuickDrop).
- **Statistics Counter**: Dynamic editable counters (6+ Apps Developed, 2+ Years Experience, 100% Passion).
- **About Me Page**: Turning Ideas into Real Apps, developer bio, highlight bullet cards (Problem Solver, Clean & Scalable Code, User Focused, Always Learning), circular portrait with neon glowing ring, and handwritten signature (*"Let's Build Something Great! - Rahul"*).
- **Technologies I Use**: Grid of 8+ technology cards with branded icons (Flutter, React Native, Firebase, Supabase, Javascript, TypeScript, Node.js, Git & GitHub).
- **Projects Showcase Page**: 2-Column responsive project cards with category filters (*All, Mobile Apps, Web Apps, Personal*) and search bar.
- **App Details Page (e.g. Rentora)**:
  - Header banner with app logo, version pill (`v1.4.0`), and dynamic action buttons:
    - `[Get it on Google Play]` (authentic Google Play badge style)
    - `[Download APK]` (cyan/green gradient button with binary size badge)
    - *Conditional logic*: Automatically hides or shows buttons based on admin settings; never renders empty buttons!
  - Left column: Detailed overview, key features checklist with checkmarks, specs card (*Version, Size, Last Update*), and technology chips.
  - Right column: Smartphone interactive mockup and screenshots preview with interactive `+More` card.
- **Screenshot Gallery & Lightbox**: Fullscreen modal carousel matching Panel 5 with next/prev navigation, touch responsiveness, and slide indicator dots.
- **Skills Page**: Categorized by *Mobile Development*, *Backend & Database*, *Tools & Others*, and *Web Development*, featuring animated proficiency bars.
- **Contact Page**: Direct email, phone, location, social links, and message form with real-time feedback.
- **Dark & Light Mode**: Complete theme toggle with custom variables for both dark neon and clean light aesthetics (matching Panel 8).
- **Footer**: Brand tagline (*"Build • Innovate • Grow"*), social links, and copyright.

---

### 2. Admin Management Panel
- **Secure Admin Authentication**: Shield logo login interface (Demo credentials: `admin@gotop.dev` / `admin123`).
- **Admin Dashboard**:
  - Top metric cards: Total Apps (6), Total Downloads (12,450), Total Visitors (8,932).
  - Recent Apps list with quick-edit shortcuts.
  - Interactive Website Traffic smooth neon bezier curve chart with Day/Week/Month toggles.
- **Apps & Projects Management**:
  - Add, edit, and delete projects.
  - Configure title, slug, subtitle, short & full descriptions, category, and icon styles.
  - Toggle and configure Google Play Store button and URL.
  - Toggle and configure APK download button and URL (Cloudflare R2 supported).
  - Upload/reorder screenshots and manage key features checklists.
- **APK Release Management**:
  - Manage binary releases, versioning, size, release notes, and latest release tags.
  - Direct download links backed by Cloudflare R2 / Supabase Storage.
- **Website Content Management**:
  - Live editing of Hero title, subtitle, description, and stats.
  - Live editing of About Me copy, highlights, author name, and avatar image.
  - Social media URL manager (GitHub, LinkedIn, YouTube, X/Twitter, Telegram).
- **Settings & Database Tools**:
  - Website name, logo text, favicon, and default theme.
  - SEO Title, Meta Description, and Social Share Preview (OG Image).
  - Supabase URL & Anon Key integration with connection tester.
  - Cloudflare R2 public endpoint configuration.
  - Export Database Backup (JSON) & Restore Factory Defaults.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS with custom design tokens, glassmorphism, glowing borders, and CSS Grid/Flexbox layouts.
- **Icons**: Lucide React + custom SVGs for Google Play and brand profiles.
- **Database & Storage**:
  - **Local Persistence**: `dataService` with LocalStorage fallback for instant, offline-first execution and testing.
  - **Supabase**: Full PostgreSQL schema provided in [`supabase_schema.sql`](file:///C:/Users/2021d/.gemini/antigravity-ide/scratch/gotop-portfolio/supabase_schema.sql) with Row Level Security (RLS) policies and Storage buckets (`projects`, `screenshots`, `logos`, `avatars`).
  - **Binary Releases**: Cloudflare R2 object storage endpoint integration for zero-egress APK downloads.

---

## 🏃 Getting Started

### 1. Run Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Build for Production
```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` directory.

### 3. Admin Access
- Navigate to the navbar and click **Login** or **Admin**.
- Demo Credentials:
  - **Email**: `admin@gotop.dev`
  - **Password**: `admin123`

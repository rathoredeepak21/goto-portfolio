// Map of canonical technology identifiers to their official SVG paths in public/logos/
export const OFFICIAL_LOGO_MAP: Record<string, string> = {
  flutter: '/logos/flutter.svg',
  react: '/logos/react.svg',
  'react native': '/logos/react-native.svg',
  'react-native': '/logos/react-native.svg',
  firebase: '/logos/firebase.svg',
  supabase: '/logos/supabase.svg',
  node: '/logos/nodejs.svg',
  'node.js': '/logos/nodejs.svg',
  nodejs: '/logos/nodejs.svg',
  javascript: '/logos/javascript.svg',
  js: '/logos/javascript.svg',
  typescript: '/logos/typescript.svg',
  ts: '/logos/typescript.svg',
  git: '/logos/git.svg',
  github: '/logos/github.svg',
  'vs code': '/logos/vscode.svg',
  vscode: '/logos/vscode.svg',
  'visual studio code': '/logos/vscode.svg',
  'android studio': '/logos/androidstudio.svg',
  androidstudio: '/logos/androidstudio.svg',
  figma: '/logos/figma.svg',
  postman: '/logos/postman.svg',
  docker: '/logos/docker.svg',
  linux: '/logos/linux.svg',
  cloudflare: '/logos/cloudflare.svg',
  canva: '/logos/canva.svg',
  dart: '/logos/dart.svg',
  python: '/logos/python.svg',
  mongodb: '/logos/mongodb.svg',
  mongo: '/logos/mongodb.svg',
  'tailwind css': '/logos/tailwind.svg',
  tailwind: '/logos/tailwind.svg',
};

export const getOfficialLogoUrl = (name: string, customUrl?: string): string => {
  if (customUrl && customUrl.trim() !== '') {
    return customUrl;
  }
  const key = name.toLowerCase().trim();
  if (OFFICIAL_LOGO_MAP[key]) {
    return OFFICIAL_LOGO_MAP[key];
  }
  for (const [canonical, path] of Object.entries(OFFICIAL_LOGO_MAP)) {
    if (key.includes(canonical)) {
      return path;
    }
  }
  return '/logos/flutter.svg';
};

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let activeCredentialsKey: string = '';

export function getSupabaseCredentials(): { url: string; key: string } {
  let settings: { supabaseUrl?: string; supabaseAnonKey?: string } = {};
  try {
    const raw = localStorage.getItem('gotop_settings_v2');
    if (raw) settings = JSON.parse(raw);
  } catch (e) {
    // Ignore error
  }

  const envUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    '';
  const envKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  let url = (settings.supabaseUrl && settings.supabaseUrl.trim()) || (envUrl && envUrl.trim()) || '';
  const key = (settings.supabaseAnonKey && settings.supabaseAnonKey.trim()) || (envKey && envKey.trim()) || '';

  // Sanitize URL if user entered REST API URL like https://xyz.supabase.co/rest/v1/ or trailing slash
  if (url) {
    url = url.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  }

  return { url, key };
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();

  if (url && key) {
    const credKey = `${url}_${key}`;
    if (supabaseInstance && activeCredentialsKey === credKey) {
      return supabaseInstance;
    }

    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      activeCredentialsKey = credKey;
      return supabaseInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return null;
}

export function resetSupabaseClient(): void {
  supabaseInstance = null;
  activeCredentialsKey = '';
}

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  let settings: { supabaseUrl?: string; supabaseAnonKey?: string } = {};
  try {
    const raw = localStorage.getItem('gotop_settings_v2');
    if (raw) settings = JSON.parse(raw);
  } catch (e) {
    // Ignore error
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = settings.supabaseUrl || envUrl;
  const key = settings.supabaseAnonKey || envKey;

  if (url && key) {
    try {
      supabaseInstance = createClient(url, key);
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
}

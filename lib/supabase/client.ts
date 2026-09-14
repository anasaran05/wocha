import { createBrowserClient } from '@supabase/ssr';

let browserClient: any = null;

export function getSupabaseClient() {
  if (browserClient) return browserClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-wocha';

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}

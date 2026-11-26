// ============================================================================
// PROTEIN EMPORIUM ADMIN - Supabase Client & Backend Bridge
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Client-side Supabase instance (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Admin Supabase instance (bypasses RLS only for trusted server operations)
export const getAdminSupabase = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return (
    Boolean(url) && 
    !url?.includes('your-project-ref') &&
    !url?.includes('placeholder')
  );
};

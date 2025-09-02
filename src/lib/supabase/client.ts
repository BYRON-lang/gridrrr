import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to get the current user's session
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign in
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

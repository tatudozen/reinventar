/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'reinventar' },
});

export const loginAdmin = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const logoutAdmin = () => supabase.auth.signOut();

export const updatePassword = (newPassword: string) =>
  supabase.auth.updateUser({ password: newPassword });

export const getAuthenticatedUser = () => supabase.auth.getUser();

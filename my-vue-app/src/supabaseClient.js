// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Use environment variables for sensitive information
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Basic check to ensure variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.");
  // Optionally throw an error or handle this case appropriately
  // throw new Error("Supabase environment variables are not set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
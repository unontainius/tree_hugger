import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_KEY || '';

// Check if the environment variables are correctly loaded
if (!supabaseUrl || !supabaseAnonKey) {
	console.error('Missing Supabase credentials:');
	console.error('VITE_PUBLIC_SUPABASE_URL:', supabaseUrl);
	console.error('VITE_PUBLIC_SUPABASE_KEY:', 'Key exists: ' + !!supabaseAnonKey);
	throw new Error('Supabase URL and Key must be provided. Please check your .env file.');
}

// Create a single Supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_KEY || '';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  // Get the auth token from the cookie if it exists
  const supabaseAuthToken = event.cookies.get('supabase-auth-token');
  
  // Create a new Supabase client for this request
  event.locals.supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  // If we have a token in the cookies, set it on the Supabase client
  if (supabaseAuthToken) {
    try {
      const parsedToken = JSON.parse(supabaseAuthToken);
      
      // Set the auth token on the Supabase client
      const { access_token, refresh_token } = parsedToken;
      if (access_token) {
        await event.locals.supabase.auth.setSession({
          access_token,
          refresh_token
        });
        
        // Get the user from the session
        const { data: { user } } = await event.locals.supabase.auth.getUser();
        event.locals.user = user;
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }
  
  // Resolve the request
  const response = await resolve(event);
  
  return response;
}; 
import supabase from '$lib/supabaseClient';
import { browser } from '$app/environment';

// Set up auth state synchronization
if (browser) {
  // Listen for auth state changes and update the cookie
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      // When we have a session, store it in a cookie
      // Set expiration to 12 hours from now if expires_at is not available
      const expiresAt = session.expires_at || Math.floor(Date.now() / 1000) + 43200;
      const expires = new Date(expiresAt * 1000);
      const value = JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      });
      
      // Set the cookie with the auth token
      document.cookie = `supabase-auth-token=${encodeURIComponent(value)};path=/;expires=${expires.toUTCString()};SameSite=Lax`;
    } else {
      // When we don't have a session, remove the cookie
      document.cookie = 'supabase-auth-token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax';
    }
  });
  
  // Initialize the auth state
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      // When we have a session, store it in a cookie
      // Set expiration to 12 hours from now if expires_at is not available
      const expiresAt = session.expires_at || Math.floor(Date.now() / 1000) + 43200;
      const expires = new Date(expiresAt * 1000);
      const value = JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      });
      
      // Set the cookie with the auth token
      document.cookie = `supabase-auth-token=${encodeURIComponent(value)};path=/;expires=${expires.toUTCString()};SameSite=Lax`;
    }
  });
}

/** @type {import('@sveltejs/kit').HandleClientError} */
export function handleError({ error }) {
    console.error('Client error:', error);
    return {
        message: 'An unexpected error occurred.'
    };
}

// SvelteKit expects this export but doesn't use it in the same way as in older versions
export function init() {
    // Initialize any client-side libraries or state here
    console.log('SvelteKit client initialized');
} 
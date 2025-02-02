import { createClient } from '@supabase/supabase-js'

// Retrieve the Supabase URL and Key from environment variables
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_KEY;
const test = import.meta.env.TEST;
// Log the environment variables to verify they are loaded
// console.log('Supabase URL:', supabaseUrl)
// console.log('Supabase Key:', supabaseKey)

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key must be provided.')
}
// Check if the environment variables are correctly loaded
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key must be provided.')
}

// Create a single Supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
})

export default supabase

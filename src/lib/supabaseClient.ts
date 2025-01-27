import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { CelebrationRow, CelebrationInsert, CelebrationUpdate } from './types/database.types'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_KEY
// Create a single supabase client for interacting with your database
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)
export default supabase

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
})




import supabase from '$lib/supabaseClient'
import type { CelebrationRow, CelebrationInsert, CelebrationUpdate } from '$lib/types/database.types'

// CRUD Functions for the 'celebration' table

// Create a new celebration
export async function createCelebration(data: CelebrationInsert): Promise<CelebrationRow | null> {
    const { data: newData, error } = await supabase
        .from('celebration')
        .insert(data)
        .single()

    if (error) {
        console.error('Error creating celebration:', error.message)
        return null
    }

    return newData
}

// Read all celebrations
export async function getCelebrations(): Promise<CelebrationRow[] | null> {
    const { data, error } = await supabase
        .from('celebration')
        .select('*')

    if (error) {
        console.error('Error fetching celebrations:', error.message)
        return null
    }

    return data
}

// Update a celebration by ID
export async function updateCelebration(id: number, updates: CelebrationUpdate): Promise<CelebrationRow | null> {
    const { data, error } = await supabase
        .from('celebration')
        .update(updates)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error updating celebration:', error.message)
        return null
    }

    return data
}

// Delete a celebration by ID
export async function deleteCelebration(id: number): Promise<boolean> {
    const { error } = await supabase
        .from('celebration')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting celebration:', error.message)
        return false
    }

    return true
}

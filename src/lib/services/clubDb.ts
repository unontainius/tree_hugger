import supabase from '../supabaseClient';
import type { ClubRow, ClubInsert, ClubUpdate } from '../types/database.types';

// Create a new club
export async function createClub(data: ClubInsert): Promise<ClubRow | null> {
    const { data: newData, error } = await supabase
        .from('club')
        .insert(data)
        .single();

    if (error) {
        console.error('Error creating club:', error.message);
        return null;
    }

    return newData;
}

// Read all clubs
export async function getClubs(): Promise<ClubRow[] | null> {
    const { data, error } = await supabase
        .from('club')
        .select('*');

    if (error) {
        console.error('Error fetching clubs:', error.message);
        return null;
    }

    return data;
}

// Update a club by ID
export async function updateClub(id: number, updates: ClubUpdate): Promise<ClubRow | null> {
    const { data, error } = await supabase
        .from('club')
        .update(updates)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error updating club:', error.message);
        return null;
    }

    return data;
}

// Delete a club by ID
export async function deleteClub(id: number): Promise<boolean> {
    const { error } = await supabase
        .from('club')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting club:', error.message);
        return false;
    }

    return true;
} 
import supabase from '../supabaseClient';
import type { TieRow, TieInsert, TieUpdate } from '../types/database.types';

// Create a new tie
export async function createTie(data: TieInsert): Promise<TieRow | null> {
    const { data: newData, error } = await supabase
        .from('tie')
        .insert(data)
        .single();

    if (error) {
        console.error('Error creating tie:', error.message);
        return null;
    }

    return newData;
}

// Read all ties
export async function getTies(): Promise<TieRow[] | null> {
    const { data, error } = await supabase
        .from('tie')
        .select('*');

    if (error) {
        console.error('Error fetching ties:', error.message);
        return null;
    }

    return data;
}

// Update a tie by ID
export async function updateTie(id: number, updates: TieUpdate): Promise<TieRow | null> {
    const { data, error } = await supabase
        .from('tie')
        .update(updates)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error updating tie:', error.message);
        return null;
    }

    return data;
}

// Delete a tie by ID
export async function deleteTie(id: number): Promise<boolean> {
    const { error } = await supabase
        .from('tie')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting tie:', error.message);
        return false;
    }

    return true;
} 
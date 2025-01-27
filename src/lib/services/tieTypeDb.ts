import supabase from '../supabaseClient';
import type { TieTypeRow, TieTypeInsert, TieTypeUpdate } from '../types/database.types';

// Create a new tie type
export async function createTieType(data: TieTypeInsert): Promise<TieTypeRow | null> {
    const { data: newData, error } = await supabase
        .from('tie_type')
        .insert(data)
        .single();

    if (error) {
        console.error('Error creating tie type:', error.message);
        return null;
    }

    return newData;
}

// Read all tie types
export async function getTieTypes(): Promise<TieTypeRow[] | null> {
    const { data, error } = await supabase
        .from('tie_type')
        .select('*');

    if (error) {
        console.error('Error fetching tie types:', error.message);
        return null;
    }

    return data;
}

// Update a tie type by name
export async function updateTieType(tie_type: string, updates: TieTypeUpdate): Promise<TieTypeRow | null> {
    const { data, error } = await supabase
        .from('tie_type')
        .update(updates)
        .eq('tie_type', tie_type)
        .single();

    if (error) {
        console.error('Error updating tie type:', error.message);
        return null;
    }

    return data;
}

// Delete a tie type by name
export async function deleteTieType(tie_type: string): Promise<boolean> {
    const { error } = await supabase
        .from('tie_type')
        .delete()
        .eq('tie_type', tie_type);

    if (error) {
        console.error('Error deleting tie type:', error.message);
        return false;
    }

    return true;
} 
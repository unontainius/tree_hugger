import supabase from '../supabaseClient';
import type { TieRelationRow, TieRelationInsert, TieRelationUpdate } from '../types/database.types';

// Create a new tie relation
export async function createTieRelation(data: TieRelationInsert): Promise<TieRelationRow | null> {
    const { data: newData, error } = await supabase
        .from('tie_relation')
        .insert(data)
        .single();

    if (error) {
        console.error('Error creating tie relation:', error.message);
        return null;
    }

    return newData;
}

// Read all tie relations
export async function getTieRelations(): Promise<TieRelationRow[] | null> {
    const { data, error } = await supabase
        .from('tie_relation')
        .select('*');

    if (error) {
        console.error('Error fetching tie relations:', error.message);
        return null;
    }

    return data;
}

// Update a tie relation by name
export async function updateTieRelation(tie_relation: string, updates: TieRelationUpdate): Promise<TieRelationRow | null> {
    const { data, error } = await supabase
        .from('tie_relation')
        .update(updates)
        .eq('tie_relation', tie_relation)
        .single();

    if (error) {
        console.error('Error updating tie relation:', error.message);
        return null;
    }

    return data;
}

// Delete a tie relation by name
export async function deleteTieRelation(tie_relation: string): Promise<boolean> {
    const { error } = await supabase
        .from('tie_relation')
        .delete()
        .eq('tie_relation', tie_relation);

    if (error) {
        console.error('Error deleting tie relation:', error.message);
        return false;
    }

    return true;
} 
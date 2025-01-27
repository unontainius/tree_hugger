import supabase from '../supabaseClient';
import type { ClubMembersRow, ClubMembersInsert, ClubMembersUpdate } from '../types/database.types';

// Create a new club member
export async function createClubMember(data: ClubMembersInsert): Promise<ClubMembersRow | null> {
    const { data: newData, error } = await supabase
        .from('club_members')
        .insert(data)
        .single();

    if (error) {
        console.error('Error creating club member:', error.message);
        return null;
    }

    return newData;
}

// Read all club members
export async function getClubMembers(): Promise<ClubMembersRow[] | null> {
    const { data, error } = await supabase
        .from('club_members')
        .select('*');

    if (error) {
        console.error('Error fetching club members:', error.message);
        return null;
    }

    return data;
}

// Update a club member by ID
export async function updateClubMember(id: number, updates: ClubMembersUpdate): Promise<ClubMembersRow | null> {
    const { data, error } = await supabase
        .from('club_members')
        .update(updates)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error updating club member:', error.message);
        return null;
    }

    return data;
}

// Delete a club member by ID
export async function deleteClubMember(id: number): Promise<boolean> {
    const { error } = await supabase
        .from('club_members')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting club member:', error.message);
        return false;
    }

    return true;
} 
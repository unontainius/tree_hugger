import supabase from '../supabaseClient';
import type { PersonRow, PersonInsert, PersonUpdate } from '../types/database.types';

// Create a new person
export async function createPerson(data: PersonInsert): Promise<PersonRow | null> {
    const { data: newData, error } = await supabase
        .from('person')
        .insert(data)
        .single();

    if (error) {
        console.error('Error creating person:', error.message);
        return null;
    }

    return newData;
}

// Read all persons
export async function getPersons(): Promise<PersonRow[] | null> {
    const { data, error } = await supabase
        .from('person')
        .select('*');

    if (error) {
        console.error('Error fetching persons:', error.message);
        return null;
    }

    return data;
}

// Update a person by ID
export async function updatePerson(id: string, updates: PersonUpdate): Promise<PersonRow | null> {
    const { data, error } = await supabase
        .from('person')
        .update(updates)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error updating person:', error.message);
        return null;
    }

    return data;
}

// Delete a person by ID
export async function deletePerson(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('person')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting person:', error.message);
        return false;
    }

    return true;
} 
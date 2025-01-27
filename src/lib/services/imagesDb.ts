import supabase from '../supabaseClient';
import type { ImagesRow, ImagesInsert, ImagesUpdate } from '../types/database.types';

// Create a new image
export async function createImage(data: ImagesInsert): Promise<ImagesRow | null> {
    const { data: newData, error } = await supabase
        .from('images')
        .insert(data)
        .single();

    if (error) {
        console.error('Error creating image:', error.message);
        return null;
    }

    return newData;
}

// Read all images
export async function getImages(): Promise<ImagesRow[] | null> {
    const { data, error } = await supabase
        .from('images')
        .select('*');

    if (error) {
        console.error('Error fetching images:', error.message);
        return null;
    }

    return data;
}

// Update an image by ID
export async function updateImage(id: number, updates: ImagesUpdate): Promise<ImagesRow | null> {
    const { data, error } = await supabase
        .from('images')
        .update(updates)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error updating image:', error.message);
        return null;
    }

    return data;
}

// Delete an image by ID
export async function deleteImage(id: number): Promise<boolean> {
    const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting image:', error.message);
        return false;
    }

    return true;
} 
import supabase from '../supabaseClient';
import type { EventTypeRow, EventTypeInsert, EventTypeUpdate } from '../types/database.types';

// Create a new event type
export async function createEventType(data: EventTypeInsert): Promise<EventTypeRow | null> {
    const { data: newData, error } = await supabase
        .from('event_type')
        .insert(data)
        .single();

    if (error) {
        console.error('Error creating event type:', error.message);
        return null;
    }

    return newData;
}

// Read all event types
export async function getEventTypes(): Promise<EventTypeRow[] | null> {
    const { data, error } = await supabase
        .from('event_type')
        .select('*');

    if (error) {
        console.error('Error fetching event types:', error.message);
        return null;
    }

    return data;
}

// Update an event type by name
export async function updateEventType(event_name: string, updates: EventTypeUpdate): Promise<EventTypeRow | null> {
    const { data, error } = await supabase
        .from('event_type')
        .update(updates)
        .eq('event_name', event_name)
        .single();

    if (error) {
        console.error('Error updating event type:', error.message);
        return null;
    }

    return data;
}

// Delete an event type by name
export async function deleteEventType(event_name: string): Promise<boolean> {
    const { error } = await supabase
        .from('event_type')
        .delete()
        .eq('event_name', event_name);

    if (error) {
        console.error('Error deleting event type:', error.message);
        return false;
    }

    return true;
} 
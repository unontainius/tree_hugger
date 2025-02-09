import type { ALLUSERSPROFILE } from '$env/static/private';
import supabase from '../supabaseClient';
import type { PersonRow, PersonInsertRow, PersonUpdateRow } from '../types/database.types';
import type { CelebrationRow, CelebrationInsertRow, CelebrationUpdateRow } from '../types/database.types';
import type { TieRow, TieInsertRow, TieUpdateRow } from '../types/database.types';
import type { ImagesRow, ImagesInsertRow, ImagesUpdateRow } from '../types/database.types';
import type { ClubRow, ClubInsertRow, ClubUpdateRow } from '../types/database.types';
import type { ClubMembersRow, ClubMembersInsertRow, ClubMembersUpdateRow } from '../types/database.types';
import type { TieRelationRow, TieRelationInsertRow, TieRelationUpdateRow } from '../types/database.types';
import type { TieTypeRow, TieTypeInsertRow, TieTypeUpdateRow } from '../types/database.types';
import type { EventTypeRow, EventTypeInsertRow, EventTypeUpdateRow } from '../types/database.types';
import db from './treeDb';

export default {

    async delete(tablename: string, id: string): Promise<boolean> {
        const { error } = await supabase
            .from(tablename)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting person:', error.message);
            return Promise.resolve(false);
        }

        return true;
    },
    Person: {
        // Create a new person
        async create(data: PersonInsertRow   ): Promise<PersonRow | null> {
            const { data: newData, error } = await supabase
                .from('person')
                .insert(data)
                .single();

            if (error) {
                console.error('Error creating person:', error.message);
                return Promise.resolve(null);
            }

            return newData;
        },

        // Read all persons
        async all(filterCriteria: string, orderby: string = 'first_name', isAscending: boolean = true): Promise<PersonRow[] | null> {
            let filter =`first_name.ilike.%${filterCriteria}%,middle_name.ilike.%${filterCriteria}%,last_name.ilike.%${filterCriteria}%,maiden_name.ilike.%${filterCriteria}%,alias.ilike.%${filterCriteria}%`

            let query = supabase.from('person')
                .select('*')
                .or(filter)
                .order(orderby, { ascending: isAscending })


     


            const { data, error } = await query;
        
            if (error) {
                console.error('Error fetching persons:', error.message);
                return null;
            }
        
            return data;
        },
        // Read all persons
        async single(id: string): Promise<PersonRow | null> {
            const { data, error } = await supabase
                .from('person')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching person:', error.message);
                return null;
            }

            return data;
        },
        // Update a person by ID
        async update(id: string, updates: PersonUpdateRow): Promise<PersonRow | null> {
            const { data, error } = await supabase
                .from('person')
                .update(updates)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error updating person:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },

    },
    Celebration: {
        async create(data: CelebrationInsertRow): Promise<CelebrationRow | null> {
            const { data: newData, error } = await supabase
                .from('celebration')
                .insert(data)
                .single();

            if (error) {
                console.error('Error creating celebration:', error.message);
                return Promise.resolve(null);
            }

            return newData;
        },
        async all(): Promise<CelebrationRow[] | null> {
            const { data, error } = await supabase
                .from('celebration')
                .select('*');

            if (error) {
                console.error('Error fetching celebrations:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },
        async single(id: string): Promise<CelebrationRow[] | null> {
            const { data, error } = await supabase
                .from('celebration')
                .select('*')
                .eq('id', id);

            if (error) {
                console.error('Error fetching celebration:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },
        async update(id: string, updates: CelebrationUpdateRow): Promise<CelebrationRow | null> {
            const { data, error } = await supabase
                .from('celebration')
                .update(updates)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error updating celebration:', error.message);
                return Promise.resolve(null);
            }

            return data;
        }
    },
    Tie: {
        async create(data: TieInsertRow): Promise<TieRow | null> {
            const { data: newData, error } = await supabase
                .from('tie')
                .insert(data)
                .single();

            if (error) {
                console.error('Error creating tie:', error.message);
                return Promise.resolve(null);
            }

            return newData;
        },
        async all(): Promise<TieRow[] | null> {
            const { data, error } = await supabase
                .from('tie')
                .select('*');

            if (error) {
                console.error('Error fetching ties:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },
        async single(id: string): Promise<TieRow[] | null> {
            const { data, error } = await supabase
                .from('tie')
                .select('*')
                .eq('id', id);

            if (error) {
                console.error('Error fetching tie:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },
        async update(id: string, updates: TieUpdateRow  ): Promise<TieRow | null> {
            const { data, error } = await supabase
                .from('tie')
                .update(updates)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error updating tie:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },
        async Parents(id: string): Promise<{parent_b: PersonRow[], parent_c: PersonRow[]} | null> {
            const { data, error } = await supabase
                .from('tie')
                .select('*')
                .eq('person_a', id)

            if (error || !data) {
                console.error('Error fetching parents:', error?.message);
                return null;
            }

            const parents: {parent_b: PersonRow[], parent_c: PersonRow[]} = {parent_b: [], parent_c: []};
            for (const tie of data) {
                const parentb = await db.Person.single(tie.person_b);
                const parentc = await db.Person.single(tie.person_c);
                if (parentb) {
                    parents.parent_b.push(parentb);
                }
                if (parentc) {
                    parents.parent_c.push(parentc);
                }
            }
            return parents;
        },
        async Siblings(id: string, parent_b: PersonRow, parent_c: PersonRow): Promise<PersonRow[] | null> {
            const { data, error } = await supabase
                .from('tie')
                .select('person_a')
                .or(
                    `and(person_b.eq.${parent_b.id},person_c.eq.${parent_c.id}),` +
                    `and(person_b.eq.${parent_c.id},person_c.eq.${parent_b.id})`
                )
                .not('person_a', 'eq', id); // Exclude the original person

            if (error || !data) {
                console.error('Error fetching siblings:', error?.message);
                return null;
            }

            // Get the actual person records for each sibling
            const siblings: PersonRow[] = [];
            for (const tie of data) {
                const sibling = await db.Person.single(tie.person_a);
                if (sibling) {
                    siblings.push(sibling);
                }
            }
            return siblings;
        },
        async Partners(id: string): Promise<{partner: PersonRow[]} | null> {
            const { data, error } = await supabase
                .from('tie')
                .select('*')
                .or(`person_b.eq.${id},person_c.eq.${id}`);

            if (error || !data) {
                console.error('Error fetching partners:', error?.message);
                return null;
            }
            const partners: {partner: PersonRow[]} = {partner: []};
            for (const tie of data) {
                const partner = await db.Person.single(tie.person_b === id ? tie.person_c : tie.person_b);
                if (partner) {
                    // check if partner is already in the array
                    if (!partners.partner.some(p => p.id === partner.id)) {
                        partners.partner.push(partner);
                    }
                }
            }
            return partners;
        },
        async Children(id: string): Promise<{partners: {partner: PersonRow, children: PersonRow[]}[]} | null> {
            const partners: {partner: PersonRow[]} | null = await this.Partners(id);
            const caller: PersonRow | null = await db.Person.single(id);
            let results: {partners: {partner: PersonRow, children: PersonRow[]}[]} = {partners: []};

            if (partners && caller) {
                for (const partner of partners.partner) {
                    let childrenData = await db.Tie.Siblings(id, caller, partner);
                    results.partners.push({
                        partner: partner,
                        children: childrenData || []
                    });
                }
            }
            return results;
        },
        relationship: {
            async create(data: TieRelationInsertRow): Promise<TieRelationRow | null> {
                const { data: newData, error } = await supabase
                    .from('tie_relationship')
                    .insert(data)
                    .single();

                if (error) {
                    console.error('Error creating tie relationship:', error.message);
                    return Promise.resolve(null);
                }

                return newData;
            },
            async all(tieId: number): Promise<TieRelationRow[] | null> {
                const { data, error } = await supabase
                    .from('tie_relationship')
                    .select('*')
                    .eq('tie', tieId);

                if (error) {
                    console.error('Error fetching tie relationships:', error.message);
                    return Promise.resolve(null);
                }

                return data;
            },
            async single(id: string): Promise<TieRelationRow[] | null> {
                const { data, error } = await supabase
                    .from('tie_relationship')
                    .select('*')
                    .eq('id', id);

                if (error) {
                    console.error('Error fetching tie relationship:', error.message);
                    return Promise.resolve(null);
                }

                return data;
            },
            async update(id: string, updates: TieRelationUpdateRow): Promise<TieRelationRow | null> {
                const { data, error } = await supabase
                    .from('tie_relationship')
                    .update(updates)
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error updating tie relationship:', error.message);
                    return Promise.resolve(null);
                }

                return data;
            }
        },
        types: {
            async create(data: TieTypeInsertRow): Promise<TieTypeRow | null> {
                const { data: newData, error } = await supabase
                    .from('tie_type')
                    .insert(data)
                    .single();

                if (error) {
                    console.error('Error creating tie type:', error.message);
                    return Promise.resolve(null);
                }

                return newData;
            },
            async all(): Promise<TieTypeRow[] | null> {
                const { data, error } = await supabase
                    .from('tie_type')
                    .select('*');

                if (error) {
                    console.error('Error fetching tie types:', error.message);
                    return Promise.resolve(null);
                }

                return data;
            },
            async single(id: string): Promise<TieTypeRow[] | null> {
                const { data, error } = await supabase
                    .from('tie_type')
                    .select('*')
                    .eq('id', id);

                if (error) {
                    console.error('Error fetching tie type:', error.message);
                    return Promise.resolve(null);
                }

                return data;
            },
            async update(id: string, updates: TieTypeUpdateRow): Promise<TieTypeRow | null> {
                const { data, error } = await supabase
                    .from('tie_type')
                    .update(updates)
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error updating tie type:', error.message);
                    return Promise.resolve(null);
                }

                return data;
            }
        },
        async insert(tie: TieInsertRow): Promise<TieRow> {
            const { data, error } = await supabase
                .from('tie')
                .insert(tie)
                .select()
                .single();

            if (error) throw error;
            if (!data) throw new Error('No data returned from insert');
            
            return data;
        }
    },
    Images: {
        async create(data: ImagesInsertRow): Promise<ImagesRow | null> {
            const { data: newData, error } = await supabase
                .from('images')
                .insert(data)
                .single();

            if (error) {
                console.error('Error creating image:', error.message);
                return Promise.resolve(null);
            }

            return newData;
        },
        async all(): Promise<ImagesRow[] | null> {
            const { data, error } = await supabase
                .from('images')
                .select('*');

            if (error) {
                console.error('Error fetching images:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },
        async single(id: string): Promise<ImagesRow[] | null> {
            const { data, error } = await supabase
                .from('images')
                .select('*')
                .eq('id', id);

            if (error) {
                console.error('Error fetching image:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },
        async update(id: string, updates: ImagesUpdateRow): Promise<ImagesRow | null> {
            const { data, error } = await supabase
                .from('images')
                .update(updates)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error updating image:', error.message);
                return Promise.resolve(null);
            }

            return data;
        }
    },
    Club: {
        async create(data: ClubInsertRow): Promise<ClubRow | null> {
            const { data: newData, error } = await supabase
                .from('club')
                .insert(data)
                .single();

            if (error) {
                console.error('Error creating club:', error.message);
                return Promise.resolve(null);
            }

            return newData;
        },
        async all(): Promise<ClubRow[] | null> {
            const { data, error } = await supabase
                .from('club')
                .select('*');

            if (error) {
                console.error('Error fetching clubs:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },
        async single(id: string): Promise<ClubRow[] | null> {
            const { data, error } = await supabase
                .from('club')
                .select('*')
                .eq('id', id);

            if (error) {
                console.error('Error fetching club:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },
        async update(id: string, updates: ClubUpdateRow): Promise<ClubRow | null> {
            const { data, error } = await supabase
                .from('club')
                .update(updates)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error updating club:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },
        member: {
            async create(data: ClubMembersInsertRow): Promise<ClubMembersRow | null> {
                const { data: newData, error } = await supabase
                    .from('member')
                    .insert(data)
                    .single();

                if (error) {
                    console.error('Error creating club member:', error.message);
                    return Promise.resolve(null);
                }

                return newData;
            },
            async all(clubId: number): Promise<ClubMembersRow[] | null> {
                const { data, error } = await supabase
                    .from('member')
                    .select('*')
                    .eq('club', clubId);

                if (error) {
                    console.error('Error fetching club members:', error.message);
                    return Promise.resolve(null);
                }

                return data;
            },
            async single(id: string): Promise<ClubMembersRow[] | null> {
                const { data, error } = await supabase
                    .from('member')
                    .select('*')
                    .eq('id', id);

                if (error) {
                    console.error('Error fetching club member:', error.message);
                    return Promise.resolve(null);
                }

                return data;
            },
            async update(id: string, updates: ClubMembersUpdateRow): Promise<ClubMembersRow | null> {
                const { data, error } = await supabase
                    .from('member')
                    .update(updates)
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error updating club member:', error.message);
                    return Promise.resolve(null);
                }

                return data;
            }
        }
    },
    EventType: {
        // Create a new event type
        async createEventType(data: EventTypeInsertRow): Promise<EventTypeRow | null> {
            const { data: newData, error } = await supabase
                .from('event_type')
                .insert(data)
                .single();

            if (error) {
                console.error('Error creating event type:', error.message);
                return null;
            }

            return newData;
        },

        // Read all event types
        async getEventTypes(): Promise<EventTypeRow[] | null> {
            const { data, error } = await supabase
                .from('event_type')
                .select('*');

            if (error) {
                console.error('Error fetching event types:', error.message);
                return null;
            }

            return data;
        },

        // Update an event type by name
        async updateEventType(event_name: string, updates: EventTypeUpdateRow): Promise<EventTypeRow | null> {
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
        },

        // Delete an event type by name
        async deleteEventType(event_name: string): Promise<boolean> {
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
    }
}

// Example function using the shared Supabase client
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
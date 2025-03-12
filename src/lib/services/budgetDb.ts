import supabase from '../supabaseClient';
import type { 
    AccountRow, AccountInsertRow, AccountUpdateRow,
    CategoryRow, CategoryInsertRow, CategoryUpdateRow,
    TransactionRow as DbTransactionRow,
    TransactionInsertRow as DbTransactionInsertRow,
    TransactionEntry,
    SharedAccessRow, SharedAccessInsertRow, SharedUserData, AccessibleUserData
} from '../types/budget.types';

const budgetDb = {
    async delete(tablename: string, id: string): Promise<boolean> {
        const { error } = await supabase.from(tablename).delete().eq('id', id);

        if (error) {
            console.error(`Error deleting from ${tablename}:`, error.message);
            return Promise.resolve(false);
        }

        return true;
    },
    Account: {
        // Create a new account
        async create(data: AccountInsertRow): Promise<AccountRow | null> {
            const { data: newData, error } = await supabase.from('accounts').insert(data).select().single();

            if (error) {
                console.error('Error creating account:', error.message);
                return Promise.resolve(null);
            }

            return newData;
        },

        // Read all accounts for a user
        async all(userId: string): Promise<AccountRow[] | null> {
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', userId)
                .order('type')
                .order('name');

            if (error) {
                console.error('Error fetching accounts:', error.message);
                return null;
            }

            return data;
        },

        // Read a single account by ID
        async single(id: string): Promise<AccountRow | null> {
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching account:', error.message);
                return null;
            }

            return data;
        },

        // Update an account by ID
        async update(id: string, updates: AccountUpdateRow): Promise<AccountRow | null> {
            const { data, error } = await supabase
                .from('accounts')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating account:', error.message);
                return Promise.resolve(null);
            }

            return data;
        }
    },
    Category: {
        // Create a new category
        async create(data: CategoryInsertRow): Promise<CategoryRow | null> {
            const { data: newData, error } = await supabase
                .from('categories')
                .insert(data)
                .select()
                .single();

            if (error) {
                console.error('Error creating category:', error.message);
                return Promise.resolve(null);
            }

            return newData;
        },

        // Read all categories for a user
        async all(userId: string): Promise<CategoryRow[] | null> {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('user_id', userId)
                .order('type')
                .order('name');

            if (error) {
                console.error('Error fetching categories:', error.message);
                return null;
            }

            return data;
        },

        // Read a single category by ID
        async single(id: string): Promise<CategoryRow | null> {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching category:', error.message);
                return null;
            }

            return data;
        },

        // Update a category by ID
        async update(id: string, updates: CategoryUpdateRow): Promise<CategoryRow | null> {
            const { data, error } = await supabase
                .from('categories')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating category:', error.message);
                return Promise.resolve(null);
            }

            return data;
        }
    },
    Transaction: {
        // Create a new transaction
        async create(data: DbTransactionInsertRow): Promise<DbTransactionRow | null> {
            const { data: newData, error } = await supabase
                .from('transactions')
                .insert(data)
                .select()
                .single();

            if (error) {
                console.error('Error creating transaction:', error.message);
                return Promise.resolve(null);
            }

            return newData;
        },

        // Read all transactions for a user
        async all(userId: string, filters = {}): Promise<DbTransactionRow[] | null> {
            let query = supabase
                .from('transactions')
                .select('*')
                .eq('user_id', userId);
            
            // Apply any additional filters
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        query = query.eq(key, value);
                    }
                });
            }
            
            const { data, error } = await query.order('date', { ascending: false });

            if (error) {
                console.error('Error fetching transactions:', error.message);
                return null;
            }

            return data;
        },

        // Read a single transaction by ID
        async single(id: string): Promise<DbTransactionRow | null> {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching transaction:', error.message);
                return null;
            }

            return data;
        },

        // Update a transaction by ID
        async update(id: string, updates: Partial<DbTransactionRow>): Promise<DbTransactionRow | null> {
            const { data, error } = await supabase
                .from('transactions')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating transaction:', error.message);
                return Promise.resolve(null);
            }

            return data;
        },

        async delete(id: number): Promise<boolean> {
            try {
                const { error } = await supabase
                    .from('transactions')
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (err) {
                console.error('Error deleting transaction:', err);
                return false;
            }
        }
    },
    SharedAccess: {
        // Share access with another user
        async create(ownerId: string, sharedWithId: string): Promise<SharedAccessRow | null> {
            const data: SharedAccessInsertRow = {
                owner_id: ownerId,
                shared_with_id: sharedWithId
            };
            
            const { data: newData, error } = await supabase
                .from('shared_access')
                .insert(data)
                .select()
                .single();

            if (error) {
                console.error('Error creating shared access:', error.message);
                return Promise.resolve(null);
            }

            return newData;
        },

        // Get all users who have access to owner's data
        async getSharedUsers(ownerId: string): Promise<SharedUserData[] | null> {
            const { data, error } = await supabase
                .from('shared_access')
                .select(`
                    shared_with_id,
                    shared_users:shared_with_id(
                        id,
                        email,
                        display_name
                    )
                `)
                .eq('owner_id', ownerId);

            if (error) {
                console.error('Error fetching shared users:', error.message);
                return null;
            }

            // Handle the response data safely
            if (!data || !Array.isArray(data)) {
                return [];
            }

            // Extract the user profiles from the response
            const users: SharedUserData[] = [];
            for (const item of data) {
                if (item.shared_users) {
                    // Cast to unknown first, then to SharedUserData to avoid type error
                    users.push(item.shared_users as unknown as SharedUserData);
                }
            }

            return users;
        },

        // Get all users who have shared their data with the current user
        async getAccessibleUsers(userId: string): Promise<AccessibleUserData[] | null> {
            const { data, error } = await supabase
                .from('shared_access')
                .select(`
                    owner_id,
                    owners:owner_id(
                        id,
                        email,
                        display_name
                    )
                `)
                .eq('shared_with_id', userId);

            if (error) {
                console.error('Error fetching accessible users:', error.message);
                return null;
            }

            // Handle the response data safely
            if (!data || !Array.isArray(data)) {
                return [];
            }

            // Extract the user profiles from the response
            const users: AccessibleUserData[] = [];
            for (const item of data) {
                if (item.owners) {
                    // Cast to unknown first, then to AccessibleUserData to avoid type error
                    users.push(item.owners as unknown as AccessibleUserData);
                }
            }

            return users;
        },

        // Remove shared access
        async remove(ownerId: string, sharedWithId: string): Promise<boolean> {
            const { error } = await supabase
                .from('shared_access')
                .delete()
                .eq('owner_id', ownerId)
                .eq('shared_with_id', sharedWithId);

            if (error) {
                console.error('Error removing shared access:', error.message);
                return false;
            }

            return true;
        }
    },
    Sharing: {
        async getSharedUsers(userId: string): Promise<SharedUser[]> {
            const { data, error } = await supabase
                .from('shared_access')
                .select(`
                    shared_with_id,
                    shared_users:shared_with_id(
                        id,
                        email,
                        display_name
                    )
                `)
                .eq('owner_id', userId);
                
            if (error) throw error;
            return data?.map(item => item.shared_users[0] as SharedUser) ?? [];
        },

        async findUserByEmail(email: string): Promise<{ id: string } | null> {
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', email)
                .single();
                
            if (error) {
                if (error.code === 'PGRST116') return null; // No rows returned
                throw error;
            }
            return data;
        },

        async shareAccess(ownerId: string, sharedWithId: string): Promise<void> {
            const { error } = await supabase
                .from('shared_access')
                .insert([{ 
                    owner_id: ownerId, 
                    shared_with_id: sharedWithId 
                }]);
                
            if (error) {
                if (error.code === '23505') { // Unique violation
                    throw new Error('Already shared with this user');
                }
                throw error;
            }
        },

        async removeAccess(ownerId: string, sharedWithId: string): Promise<void> {
            const { error } = await supabase
                .from('shared_access')
                .delete()
                .eq('owner_id', ownerId)
                .eq('shared_with_id', sharedWithId);
                
            if (error) throw error;
        }
    }
};

export default {
    delete: budgetDb.delete,
    Account: budgetDb.Account,
    Category: budgetDb.Category,
    Transaction: budgetDb.Transaction,
    SharedAccess: budgetDb.SharedAccess,
    Sharing: budgetDb.Sharing,
    Cashflow: {
        async getRows(userId: string): Promise<CashflowRowWithCells[]> {
            try {
                // First get all rows
                const { data: rows, error: rowsError } = await supabase
                    .from('cashflow_rows')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at');
                    
                if (rowsError) throw rowsError;
                if (!rows) return [];
                
                // Then get all cells for these rows in a single query
                const { data: cells, error: cellsError } = await supabase
                    .from('cashflow_cells')
                    .select('*')
                    .in('row_id', rows.map(r => r.id))
                    .order('week_number');
                    
                if (cellsError) throw cellsError;
                
                // Combine rows with their cells
                return rows.map(row => ({
                    ...row,
                    cells: (cells || [])
                        .filter(cell => cell.row_id === row.id)
                        .sort((a, b) => a.week_number - b.week_number)
                }));
            } catch (err) {
                console.error('Error fetching cashflow rows:', err);
                return [];
            }
        },
        
        async createRow(data: Omit<CashflowRow, 'id' | 'created_at' | 'updated_at'>): Promise<CashflowRow | null> {
            try {
                const { data: row, error } = await supabase
                    .from('cashflow_rows')
                    .insert([data])
                    .select()
                    .single();
                    
                if (error) throw error;
                return row;
            } catch (err) {
                console.error('Error creating cashflow row:', err);
                return null;
            }
        },
        
        async updateRow(id: number, updates: Partial<CashflowRow>): Promise<CashflowRow | null> {
            try {
                const { data: row, error } = await supabase
                    .from('cashflow_rows')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();
                    
                if (error) throw error;
                return row;
            } catch (err) {
                console.error('Error updating cashflow row:', err);
                return null;
            }
        },
        
        async deleteRow(id: number): Promise<boolean> {
            try {
                const { error } = await supabase
                    .from('cashflow_rows')
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (err) {
                console.error('Error deleting cashflow row:', err);
                return false;
            }
        },
        
        async updateCells(rowId: number, cells: { week_number: number; amount: number; note?: string }[]): Promise<boolean> {
            try {
                // Upsert all cells in a single operation
                const { error } = await supabase
                    .from('cashflow_cells')
                    .upsert(
                        cells.map(c => ({
                            row_id: rowId,
                            week_number: c.week_number,
                            amount: c.amount,
                            note: c.note
                        })),
                        { onConflict: 'row_id,week_number' }
                    );
                
                if (error) throw error;
                return true;
            } catch (err) {
                console.error('Error updating cashflow cells:', err);
                return false;
            }
        },
        
        async updateCell(rowId: number, weekNumber: number, data: Partial<CashflowCell>): Promise<CashflowCell | null> {
            try {
                // Ensure amount is initialized to 0 if not provided
                const cellData = {
                    row_id: rowId,
                    week_number: weekNumber,
                    amount: 0,
                    ...data
                };

                const { data: result, error } = await supabase
                    .from('cashflow_cells')
                    .upsert([cellData], {
                        onConflict: 'row_id,week_number'
                    })
                    .select()
                    .single();
                    
                if (error) throw error;
                return result;
            } catch (err) {
                console.error('Error updating cashflow cell:', err);
                return null;
            }
        },
        
        async deleteCell(id: number): Promise<boolean> {
            try {
                const { error } = await supabase
                    .from('cashflow_cells')
                    .delete()
                    .eq('id', id);
                    
                if (error) throw error;
                return true;
            } catch (err) {
                console.error('Error deleting cashflow cell:', err);
                return false;
            }
        }
    }
};

// Helper functions for working with budget data
export async function getUserAccounts(userId: string): Promise<AccountRow[] | null> {
    return await budgetDb.Account.all(userId);
}

export async function getUserCategories(userId: string): Promise<CategoryRow[] | null> {
    return await budgetDb.Category.all(userId);
}

export async function getUserTransactions(userId: string, filters = {}): Promise<DbTransactionRow[] | null> {
    return await budgetDb.Transaction.all(userId, filters);
}

export interface CashflowRow {
    id: number;
    user_id: string;
    name: string;
    type: 'income' | 'expense';
    group_name: string;
    is_recurring: boolean;
    recurring_amount?: number;
    created_at?: string;
    updated_at?: string;
}

export interface CashflowCell {
    id: number;
    row_id: number;
    week_number: number;
    amount: number;
    note?: string;
    tags?: string[];
    created_at?: string;
    updated_at?: string;
}

export interface CashflowRowWithCells extends CashflowRow {
    cells: CashflowCell[];
}

export interface TransactionRow {
    id: number;
    user_id: string;
    date: string;
    description: string;
    amount: number;
    entries: TransactionEntry[];
}

export interface TransactionInsertRow extends Omit<TransactionRow, 'id' | 'created_at' | 'updated_at'> {
    entries: TransactionEntry[];
}

export interface SharedUser {
    id: string;
    email: string;
    display_name?: string;
} 
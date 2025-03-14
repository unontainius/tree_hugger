import supabase from '$lib/supabaseClient';

// Types for our data structures
export interface CashflowEntry {
    id: string;
    account_id: string;
    week: number;
    value: number;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface BudgetAccount {
    id: string;
    name: string;
    group_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    data?: CashflowEntry[]; // For the UI display
}

export interface BudgetGroup {
    id: string;
    name: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    accounts?: BudgetAccount[]; // For the UI display
}

/**
 * Fetches all cashflow data including groups, accounts, and entries
 * @returns A structured object with all cashflow data
 */
export async function getSupabaseCashFlowData(): Promise<BudgetGroup[] | null> {
    // Fetch all groups
    const { data: groups, error: groupsError } = await supabase
        .from('budget_groups')
        .select('*');
        
    if (groupsError) {
        console.error('Error fetching groups:', groupsError);
        return null;
    }
    
    // For each group, fetch its accounts
    if (groups) {
        for (const group of groups) {
            const { data: accounts, error: accountsError } = await supabase
                .from('budget_accounts')
                .select('*')
                .eq('group_id', group.id);
                
            if (accountsError) {
                console.error(`Error fetching accounts for group ${group.name}:`, accountsError);
                continue;
            }
            
            // For each account, fetch its entries
            if (accounts) {
                for (const account of accounts) {
                    const { data: entries, error: entriesError } = await supabase
                        .from('cashflow_entries')
                        .select('*')
                        .eq('account_id', account.id);
                        
                    if (entriesError) {
                        console.error(`Error fetching entries for account ${account.name}:`, entriesError);
                        continue;
                    }
                    
                    // Attach entries to account
                    account.data = entries || [];
                }
            }
            
            // Attach accounts to group
            group.accounts = accounts || [];
        }
    }
    
    return groups;
}

/**
 * Populates the database with sample data for the current user
 * @returns Whether the operation was successful
 */
export async function populateSampleData(): Promise<boolean> {
    console.log('Attempting to populate sample data...');
    
    try {
        // First check if the user is authenticated
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) {
            console.error('Cannot populate sample data: User not authenticated');
            return false;
        }
        
        console.log('User authenticated, calling populate_sample_data_for_current_user RPC...');
        
        // Call the stored function to populate sample data
        const { error } = await supabase.rpc('populate_sample_data_for_current_user');
        
        if (error) {
            console.error('Error populating sample data:', error);
            return false;
        }
        
        console.log('Sample data populated successfully!');
        return true;
    } catch (error) {
        console.error('Exception while populating sample data:', error);
        return false;
    }
}

/**
 * Initializes the database with sample data if no data exists
 * @returns The cashflow data if successful, null otherwise
 */
export async function initializeData(): Promise<BudgetGroup[] | null> {
    const { data: existingGroups, error } = await supabase
        .from('budget_groups')
        .select('id')
        .limit(1);
        
    if (error) {
        console.error('Error checking for existing data:', error);
        return null;
    }
    
    // If no groups found, populate sample data
    if (!existingGroups || existingGroups.length === 0) {
        console.log('No existing data found, populating sample data...');
        const success = await populateSampleData();
        if (!success) {
            return null;
        }
        console.log('Sample data populated successfully!');
    } else {
        console.log('Existing data found, skipping sample data population.');
    }
    
    // Fetch the data to display
    return await getSupabaseCashFlowData();
}

/**
 * Updates a cashflow entry value
 * @param accountId The account ID
 * @param week The week number
 * @param value The new value
 * @returns Whether the operation was successful
 */
export async function updateCashflowEntry(accountId: string, week: number, value: number): Promise<boolean> {
    console.log(`cashflowService.updateCashflowEntry called with accountId=${accountId}, week=${week}, value=${value}`);
    
    try {
        // Check if entry exists
        console.log(`Checking if entry exists for accountId=${accountId}, week=${week}`);
        const { data: existingEntries, error: queryError } = await supabase
            .from('cashflow_entries')
            .select('id')
            .eq('account_id', accountId)
            .eq('week', week);
        
        if (queryError) {
            console.error('Error checking for existing entry:', queryError);
            return false;
        }
        
        let result;
        
        // If entry exists, update it; otherwise, insert a new one
        if (existingEntries && existingEntries.length > 0) {
            // Update existing entry
            result = await supabase
                .from('cashflow_entries')
                .update({ value, updated_at: new Date().toISOString() })
                .eq('account_id', accountId)
                .eq('week', week);
        } else {
            // Get the current user's ID
            console.log('No existing entry found, creating new entry');
            const { data: userData, error: authError } = await supabase.auth.getUser();
            
            if (authError) {
                console.error('Authentication error:', authError);
                return false;
            }
            
            const userId = userData?.user?.id;
            
            if (!userId) {
                console.error('User not authenticated');
                return false;
            }
            
            console.log(`Creating new entry with userId=${userId}`);
            
            // Insert new entry with explicit user_id
            result = await supabase
                .from('cashflow_entries')
                .insert({
                    account_id: accountId,
                    week,
                    value,
                    user_id: userId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
        }
        
        if (result.error) {
            console.error('Error updating cashflow entry:', result.error);
            return false;
        }
        
        console.log('Cashflow entry updated successfully');
        return true;
    } catch (error) {
        console.error('Exception in updateCashflowEntry:', error);
        return false;
    }
}

/**
 * Creates a new budget group
 * @param name The group name
 * @returns The created group if successful, null otherwise
 */
export async function createGroup(name: string): Promise<BudgetGroup | null> {
    try {
        const { data, error } = await supabase
            .from('budget_groups')
            .insert([{ name, user_id: await getCurrentUserId() }])
            .select('id, name')
            .single();
        
        if (error) {
            console.error('Error creating group:', error);
            return null;
        }
        
        return data as BudgetGroup;
    } catch (error) {
        console.error('Error in createGroup:', error);
        return null;
    }
}

/**
 * Updates a budget group
 * @param id The group ID
 * @param name The new group name
 * @returns The updated group if successful, null otherwise
 */
export async function updateGroup(id: string, name: string): Promise<BudgetGroup | null> {
    try {
        const { data, error } = await supabase
            .from('budget_groups')
            .update({ name })
            .eq('id', id)
            .eq('user_id', await getCurrentUserId())
            .select('id, name')
            .single();
        
        if (error) {
            console.error('Error updating group:', error);
            return null;
        }
        
        return data as BudgetGroup;
    } catch (error) {
        console.error('Error in updateGroup:', error);
        return null;
    }
}

/**
 * Creates a new budget account
 * @param name The account name
 * @param groupId The group ID
 * @returns The created account if successful, null otherwise
 */
export async function createAccount(name: string, groupId: string): Promise<BudgetAccount | null> {
    try {
        const { data, error } = await supabase
            .from('budget_accounts')
            .insert([{ 
                name, 
                group_id: groupId,
                user_id: await getCurrentUserId()
            }])
            .select('id, name, group_id')
            .single();
        
        if (error) {
            console.error('Error creating account:', error);
            return null;
        }
        
        return data as BudgetAccount;
    } catch (error) {
        console.error('Error in createAccount:', error);
        return null;
    }
}

/**
 * Deletes a budget group and all its accounts and entries
 * @param groupId The group ID
 * @returns Whether the operation was successful
 */
export async function deleteGroup(groupId: string): Promise<boolean> {
    const { error } = await supabase
        .from('budget_groups')
        .delete()
        .eq('id', groupId);
    
    if (error) {
        console.error('Error deleting group:', error);
        return false;
    }
    
    return true;
}

/**
 * Deletes a budget account and all its entries
 * @param accountId The account ID
 * @returns Whether the operation was successful
 */
export async function deleteAccount(accountId: string): Promise<boolean> {
    const { error } = await supabase
        .from('budget_accounts')
        .delete()
        .eq('id', accountId);
    
    if (error) {
        console.error('Error deleting account:', error);
        return false;
    }
    
    return true;
}

/**
 * Updates a budget account
 * @param id The account ID
 * @param name The new account name
 * @param groupId The group ID (can be the same or different)
 * @returns Whether the operation was successful
 */
export async function updateAccount(id: string, name: string, groupId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('budget_accounts')
            .update({ 
                name, 
                group_id: groupId,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', await getCurrentUserId());
        
        if (error) {
            console.error('Error updating account:', error);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error in updateAccount:', error);
        return false;
    }
}

/**
 * Clears all values for an account (sets them to 0) in a single operation
 * @param accountId The account ID
 * @returns Whether the operation was successful
 */
export async function clearAccountValues(accountId: string): Promise<boolean> {
    console.log(`cashflowService.clearAccountValues called for accountId=${accountId}`);
    
    try {
        // Get the current user's ID
        const { data: userData, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
            console.error('Authentication error:', authError);
            return false;
        }
        
        const userId = userData?.user?.id;
        
        if (!userId) {
            console.error('User not authenticated');
            return false;
        }
        
        // Update all entries for this account in a single operation
        const { error } = await supabase
            .from('cashflow_entries')
            .update({ 
                value: 0, 
                updated_at: new Date().toISOString() 
            })
            .eq('account_id', accountId)
            .eq('user_id', userId);
        
        if (error) {
            console.error('Error clearing account values:', error);
            return false;
        }
        
        console.log('Account values cleared successfully');
        return true;
    } catch (error) {
        console.error('Exception in clearAccountValues:', error);
        return false;
    }
}

// Helper function to get current user ID
async function getCurrentUserId(): Promise<string> {
    const { data } = await supabase.auth.getUser();
    return data.user?.id || '';
}

// Export default object for consistency with other services
export default {
    getSupabaseCashFlowData,
    populateSampleData,
    initializeData,
    updateCashflowEntry,
    createGroup,
    updateGroup,
    createAccount,
    updateAccount,
    deleteGroup,
    deleteAccount,
    clearAccountValues
}; 
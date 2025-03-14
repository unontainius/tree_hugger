import { fail } from '@sveltejs/kit';

/** 
 * Server load function to pre-process data
 * @type {import('./$types').PageServerLoad} 
 */
export async function load({ locals }) {
  console.log('Server: Starting load function');
  
  // Initialize data
  /** @type {Array<any>} */
  let groups = [];
  /** @type {Array<any>} */
  let rows = [];
  /** @type {Array<any>} */
  let groupedRows = [];
  /** @type {string|null} */
  let error = null;
  
  try {
    // Check if we have an authenticated user in locals
    const user = locals.user;
    console.log('Server: User from locals:', user ? `Found user ${user.id}` : 'No user found');
    
    // Use the authenticated Supabase client from locals if available
    if (locals.supabase) {
      console.log('Server: Using authenticated Supabase client from locals');
      
      try {
        // Initialize the database if needed
        console.log('Server: Initializing database...');
        
        // Fetch the cashflow data using the authenticated client
        console.log('Server: Fetching cashflow data...');
        const { data: groupsData, error: groupsError } = await locals.supabase
          .from('budget_groups')
          .select('*');
          
        if (groupsError) {
          console.error('Server: Error fetching groups:', groupsError);
          throw new Error(`Error fetching groups: ${groupsError.message}`);
        }
        
        if (!groupsData || groupsData.length === 0) {
          console.log('Server: No groups found');
          return {
            groups: [],
            rows: [],
            groupedRows: [],
            error: 'No data found. Please create some budget groups and accounts.',
            isSampleData: false,
            authRequired: false
          };
        }
        
        // Process the groups data
        groups = groupsData;
        console.log('Server: Found', groups.length, 'groups');
        
        // For each group, fetch its accounts
        for (const group of groups) {
          const { data: accounts, error: accountsError } = await locals.supabase
            .from('budget_accounts')
            .select('*')
            .eq('group_id', group.id);
            
          if (accountsError) {
            console.error(`Server: Error fetching accounts for group ${group.name}:`, accountsError);
            continue;
          }
          
          // For each account, fetch its entries
          if (accounts) {
            for (const account of accounts) {
              const { data: entries, error: entriesError } = await locals.supabase
                .from('cashflow_entries')
                .select('*')
                .eq('account_id', account.id);
                
              if (entriesError) {
                console.error(`Server: Error fetching entries for account ${account.name}:`, entriesError);
                continue;
              }
              
              // Attach entries to account
              account.data = entries || [];
            }
          }
          
          // Attach accounts to group
          group.accounts = accounts || [];
        }
        
        // Process the data into rows and grouped rows
        rows = processRowsFromGroups(groups);
        console.log('Server: Processed rows:', rows.length);
        
        groupedRows = processGroupedRows(rows);
        console.log('Server: Processed grouped rows:', groupedRows.length);
        
        return {
          groups,
          rows,
          groupedRows,
          error: null,
          isSampleData: false,
          authRequired: false
        };
      } catch (err) {
        // Check if this is an authentication error
        const isAuthError = 
          (err instanceof Error && err.message.includes('authentication')) || 
          (typeof err === 'object' && err && 'code' in err && err.code === 'PGRST301');
        
        console.error('Server: Error fetching data:', err);
        error = err instanceof Error ? err.message : 'Unknown error';
        
        return {
          groups: [],
          rows: [],
          groupedRows: [],
          error: `Error fetching data: ${error}`,
          isSampleData: false,
          authRequired: isAuthError
        };
      }
    } else {
      // No authenticated client available
      console.log('Server: No authenticated Supabase client available');
      return {
        groups: [],
        rows: [],
        groupedRows: [],
        error: 'Authentication required',
        isSampleData: false,
        authRequired: true
      };
    }
  } catch (/** @type {unknown} */ err) {
    // This should rarely happen, but just in case
    console.error('Server: Unexpected error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    
    return {
      groups: [],
      rows: [],
      groupedRows: [],
      error: `Critical error: ${errorMessage}`,
      isSampleData: false,
      authRequired: false
    };
  }
}

/**
 * Process rows from groups
 * @param {Array<any>} groups - The groups to process
 * @returns {Array<any>} The processed rows
 */
function processRowsFromGroups(groups) {
  /** @type {Array<any>} */
  const rows = [];
  
  // Process each group
  for (const group of groups) {
    // Process each account in the group
    if (group.accounts && Array.isArray(group.accounts)) {
      for (const account of group.accounts) {
        // Create a row for each account
        const row = {
          group: group.name,
          account: account.name,
          key: `${group.id}-${account.id}`,
          data: account.data || [], // Use the actual data from Supabase
          account_id: account.id
        };
        
        rows.push(row);
      }
    }
  }
  
  return rows;
}

/**
 * Process grouped rows
 * @param {Array<any>} rows - The rows to process
 * @returns {Array<any>} The processed grouped rows
 */
function processGroupedRows(rows) {
  /** @type {Map<string, Array<any>>} */
  const groupMap = new Map();
  
  // Group rows by group name
  for (const row of rows) {
    if (!groupMap.has(row.group)) {
      groupMap.set(row.group, []);
    }
    
    const groupRows = groupMap.get(row.group);
    if (groupRows) {
      groupRows.push(row);
    }
  }
  
  /** @type {Array<any>} */
  const groupedRows = [];
  
  // Create grouped rows
  for (const [groupName, groupRows] of groupMap.entries()) {
    groupedRows.push({
      name: groupName,
      rows: groupRows
    });
  }
  
  return groupedRows;
}

/** @type {import('./$types').Actions} */
export const actions = {
  createGroup: async ({ request, locals }) => {
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    
    if (!name) {
      return fail(400, { error: 'Group name is required' });
    }
    
    try {
      // Use the authenticated Supabase client from locals
      if (!locals.supabase) {
        return fail(401, { error: 'Authentication required' });
      }
      
      // Get the current user's ID
      const user = locals.user;
      if (!user) {
        return fail(401, { error: 'Authentication required' });
      }
      
      // Create the group
      const { data, error } = await locals.supabase
        .from('budget_groups')
        .insert([{ name, user_id: user.id }])
        .select('id, name')
        .single();
      
      if (error) {
        console.error('Error creating group:', error);
        return fail(500, { error: 'Failed to create group' });
      }
      
      // Handle accounts if they exist
      const accountsJson = formData.get('accounts')?.toString();
      if (accountsJson) {
        const accounts = JSON.parse(accountsJson);
        for (const accountName of accounts) {
          await locals.supabase
            .from('budget_accounts')
            .insert([{ 
              name: accountName, 
              group_id: data.id,
              user_id: user.id
            }]);
        }
      }
      
      return { success: true, group: data };
    } catch (e) {
      console.error('Error creating group:', e);
      return fail(500, { error: 'An unexpected error occurred' });
    }
  },
  
  updateGroup: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    const name = formData.get('name')?.toString();
    
    if (!id || !name) {
      return fail(400, { error: 'Group ID and name are required' });
    }
    
    try {
      // Use the authenticated Supabase client from locals
      if (!locals.supabase) {
        return fail(401, { error: 'Authentication required' });
      }
      
      // Get the current user's ID
      const user = locals.user;
      if (!user) {
        return fail(401, { error: 'Authentication required' });
      }
      
      // Update the group
      const { data, error } = await locals.supabase
        .from('budget_groups')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id)
        .select('id, name')
        .single();
      
      if (error) {
        console.error('Error updating group:', error);
        return fail(500, { error: 'Failed to update group' });
      }
      
      return { success: true, group: data };
    } catch (e) {
      console.error('Error updating group:', e);
      return fail(500, { error: 'An unexpected error occurred' });
    }
  },
  
  updateEntry: async ({ request, locals }) => {
    const formData = await request.formData();
    const accountId = formData.get('accountId')?.toString();
    const week = parseInt(formData.get('week')?.toString() || '0');
    const value = parseFloat(formData.get('value')?.toString() || '0');
    
    if (!accountId || isNaN(week) || isNaN(value)) {
      return fail(400, { error: 'Valid account ID, week, and value are required' });
    }
    
    try {
      // Use the authenticated Supabase client from locals
      if (!locals.supabase) {
        return fail(401, { error: 'Authentication required' });
      }
      
      // Get the current user's ID
      const user = locals.user;
      if (!user) {
        return fail(401, { error: 'Authentication required' });
      }
      
      // Check if entry exists
      const { data: existingEntries } = await locals.supabase
        .from('cashflow_entries')
        .select('id')
        .eq('account_id', accountId)
        .eq('week', week);
      
      let error;
      
      // If entry exists, update it; otherwise, insert a new one
      if (existingEntries && existingEntries.length > 0) {
        // Update existing entry
        const result = await locals.supabase
          .from('cashflow_entries')
          .update({ value })
          .eq('account_id', accountId)
          .eq('week', week);
        
        error = result.error;
      } else {
        // Insert new entry with explicit user_id
        const result = await locals.supabase
          .from('cashflow_entries')
          .insert({
            account_id: accountId,
            week,
            value,
            user_id: user.id
          });
        
        error = result.error;
      }
      
      if (error) {
        console.error('Error updating cashflow entry:', error);
        return fail(500, { error: 'Failed to update entry' });
      }
      
      return { success: true };
    } catch (e) {
      console.error('Error updating entry:', e);
      return fail(500, { error: 'An unexpected error occurred' });
    }
  }
}; 
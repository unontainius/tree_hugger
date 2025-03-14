import supabase from '$lib/supabaseClient';

// Define types for our service
export type WeekDistribution = {
  week: number;
  dateRange: string;
  amount: number;
};

export type BudgetDistribution = {
  accountId: string;
  distribution: WeekDistribution[];
};

/**
 * Apply a budget distribution to an account
 * This will update the cashflow entries for the account based on the distribution
 */
export async function applyBudgetDistribution(
  accountId: string, 
  distribution: WeekDistribution[]
): Promise<boolean> {
  try {
    // Start a transaction to ensure all updates are applied or none
    // Note: This is a simplified version. In a real application, you would use a proper transaction
    
    // First, get the existing entries for this account
    const { data: existingEntries, error: fetchError } = await supabase
      .from('cashflow_entries')
      .select('week, value')
      .eq('account_id', accountId);
    
    if (fetchError) {
      console.error('Error fetching existing entries:', fetchError);
      return false;
    }
    
    // Create a map of existing entries for quick lookup
    const existingEntriesMap = new Map();
    if (existingEntries) {
      existingEntries.forEach(entry => {
        existingEntriesMap.set(entry.week, entry);
      });
    }
    
    // Process each week in the distribution
    for (const weekData of distribution) {
      if (weekData.amount === 0) continue; // Skip weeks with zero amount
      
      const week = weekData.week;
      const value = weekData.amount;
      
      if (existingEntriesMap.has(week)) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('cashflow_entries')
          .update({ value })
          .eq('account_id', accountId)
          .eq('week', week);
        
        if (updateError) {
          console.error(`Error updating entry for week ${week}:`, updateError);
          return false;
        }
      } else {
        // Insert new entry
        const { error: insertError } = await supabase
          .from('cashflow_entries')
          .insert({
            account_id: accountId,
            week,
            value
          });
        
        if (insertError) {
          console.error(`Error inserting entry for week ${week}:`, insertError);
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error applying budget distribution:', error);
    return false;
  }
}

/**
 * Get the current week number (1-52)
 */
export function getCurrentWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000; // milliseconds in a week
  const weekNumber = Math.ceil(diff / oneWeek);
  return Math.min(Math.max(1, weekNumber), 52); // Ensure it's between 1 and 52
}

/**
 * Get date range for a week
 */
export function getWeekDateRange(weekNum: number): string {
  const year = new Date().getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const dayOffset = firstDayOfYear.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate the date of the first day of the week
  const firstDayOfWeek = new Date(year, 0, (weekNum - 1) * 7 + 1 - dayOffset);
  
  // Calculate the date of the last day of the week
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  
  // Format dates as MM/DD
  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };
  
  return `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
}

// Export the service as a default object
export default {
  applyBudgetDistribution,
  getCurrentWeekNumber,
  getWeekDateRange
}; 
// Account types
export type AccountType = 'asset' | 'liability' | 'income' | 'expense';

// Category types
export type CategoryType = 'income' | 'expense' | 'asset' | 'liability';

// Time periods for budgeting
export type TimeframeKey = 'Daily' | 'Weekly' | 'Monthly' | 'Annual';

// Account table types
export interface AccountRow {
    id: string;
    user_id: string;
    name: string;
    type: AccountType;
    balance: number;
    categories?: string[]; // Array of category IDs associated with this account
    is_active: boolean;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export type AccountInsertRow = Omit<AccountRow, 'id' | 'created_at' | 'updated_at'>;
export type AccountUpdateRow = Partial<Omit<AccountRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Category table types
export interface CategoryRow {
    id: string;
    user_id: string;
    name: string;
    type: CategoryType;
    debit_account: string;  // Account to be debited
    credit_account: string; // Account to be credited
    budget_period: TimeframeKey; // The period used for budgeting
    budget_amount: number; // The amount for the specified period
    created_at?: string;
    updated_at?: string;
}

export type CategoryInsertRow = Omit<CategoryRow, 'id'>;
export type CategoryUpdateRow = Omit<CategoryRow, 'id' | 'user_id'>;

// Transaction table types
export interface TransactionEntry {
    id: number;
    transaction_id: number;
    category: number;
    amount: number;
    debit_account: number;
    credit_account: number;
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

export type TransactionUpdateRow = Partial<Omit<TransactionRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Shared access table types
export interface SharedAccessRow {
    id: string;
    owner_id: string;
    shared_with_id: string;
    created_at?: string;
}

export type SharedAccessInsertRow = Omit<SharedAccessRow, 'id' | 'created_at'>;

// User profile types for sharing functionality
export interface UserProfile {
    id: string;
    email: string;
    display_name?: string;
}

// Supabase response types for shared users
export interface SharedUserData {
    id: string;
    email: string;
    display_name?: string;
}

export interface SharedUsersData {
    shared_with_id: string;
    shared_users: SharedUserData;
}

// Supabase response types for accessible users
export interface AccessibleUserData {
    id: string;
    email: string;
    display_name?: string;
}

export interface AccessibleUsersData {
    owner_id: string;
    owners: AccessibleUserData;
} 
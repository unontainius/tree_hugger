<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    
    let { data }: { data: PageData } = $props();
    
    // Authentication state
    let isAuthenticated = $state(false);
    let userGroups: string[] = $state([]);
    let hasAccess = $state(false);
    
    // Category types
    type CategoryType = 'income' | 'expense' | 'asset' | 'liability';
    
    // Transaction types
    type TransactionType = 'income' | 'expense' | 'transfer' | 'adjustment';
    
    // Time period types
    type TimeframeKey = 'Hourly' | 'Daily' | 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly' | 'Annual';
    
    // Category definition interface
    interface Category {
        id: number;
        name: string;
        type: CategoryType;
        debitAccount: string;  // Account to be debited
        creditAccount: string; // Account to be credited
        budgetPeriod: TimeframeKey;
        budgetAmount: number;
    }
    
    // Account types
    type AccountType = 'asset' | 'liability' | 'income' | 'expense';
    
    // Account interface
    interface Account {
        id: number;
        name: string;
        type: AccountType;
        balance: number;
        categories: number[]; // Array of category IDs associated with this account
        isActive: boolean;
        description?: string;
    }
    
    // Transaction entry interface
    interface TransactionEntry {
        category: number; // Category ID
        account: string;
        debit: number;
        credit: number;
    }
    
    // Transaction interface
    interface Transaction {
        id: number;
        date: string;
        description: string;
        type: TransactionType;
        entries: TransactionEntry[];
        amount: number;
    }
    
    // Sample categories - in a real app, this would be fetched from your backend
    let categories: Category[] = $state([]);
    
    // Transaction form - simplified for the new approach
    let transactionForm = $state({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 0, // Category ID
        amount: 0
    });
    
    // All accounts from localStorage
    let storedAccounts: Account[] = $state([]);
    
    // Transactions array
    let transactions: Transaction[] = $state([]);
    
    // Check authentication and access rights
    onMount(() => {
        // In a real app, this would check your auth service
        checkAuthentication();
        
        // Load categories from localStorage
        loadCategoriesFromStorage();
        
        // Load accounts from localStorage
        loadAccountsFromStorage();
        
        // Load transactions from localStorage
        loadTransactionsFromStorage();
    });
    
    function checkAuthentication() {
        // Simulate authentication check - replace with your actual auth logic
        isAuthenticated = true; // For demo purposes
        userGroups = ['accounting', 'admin']; // For demo purposes
        
        // Check if user has access to budget dashboard
        hasAccess = isAuthenticated && userGroups.some(group => 
            ['accounting', 'admin', 'finance'].includes(group)
        );
        
        if (!hasAccess) {
            // Redirect or show access denied message
            alert('Access denied. You need proper permissions to create transactions.');
            goto('/');
        }
    }
    
    // Load categories from localStorage
    function loadCategoriesFromStorage() {
        try {
            const storedCategories = localStorage.getItem('budgetCategories');
            if (storedCategories) {
                categories = JSON.parse(storedCategories);
                console.log('Loaded categories from storage:', categories);
            }
        } catch (error) {
            console.error('Error loading categories from storage:', error);
        }
    }
    
    // Load accounts from localStorage
    function loadAccountsFromStorage() {
        try {
            const storedAccountsData = localStorage.getItem('budgetAccounts');
            console.log('Raw stored accounts data:', storedAccountsData);
            
            if (storedAccountsData) {
                storedAccounts = JSON.parse(storedAccountsData);
                console.log('Loaded accounts from storage:', storedAccounts);
            } else {
                console.log('No accounts found in localStorage');
            }
        } catch (error) {
            console.error('Error loading accounts from storage:', error);
        }
    }
    
    // Load transactions from localStorage
    function loadTransactionsFromStorage() {
        try {
            const storedTransactions = localStorage.getItem('budgetTransactions');
            if (storedTransactions) {
                transactions = JSON.parse(storedTransactions);
                console.log('Loaded transactions from storage:', transactions);
            }
        } catch (error) {
            console.error('Error loading transactions from storage:', error);
        }
    }
    
    // Save transactions to localStorage
    function saveTransactionsToStorage() {
        try {
            localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
            console.log('Saved transactions to storage:', transactions);
        } catch (error) {
            console.error('Error saving transactions to storage:', error);
        }
    }
    
    // Get next transaction ID
    function getNextTransactionId(): number {
        if (transactions.length === 0) {
            return 1;
        }
        return Math.max(...transactions.map(t => t.id)) + 1;
    }
    
    // Create a new transaction
    function createTransaction() {
        if (!transactionForm.date) {
            alert('Please select a date');
            return;
        }
        
        if (transactionForm.description.trim() === '') {
            alert('Please enter a description');
            return;
        }
        
        if (transactionForm.category === 0) {
            alert('Please select a category');
            return;
        }
        
        if (transactionForm.amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        // Find the selected category
        const category = categories.find(c => c.id === transactionForm.category);
        if (!category) {
            alert('Selected category not found');
            return;
        }
        
        // Determine transaction type based on category type
        let transactionType: TransactionType;
        switch (category.type) {
            case 'income':
                transactionType = 'income';
                break;
            case 'expense':
                transactionType = 'expense';
                break;
            case 'asset':
            case 'liability':
                transactionType = 'transfer';
                break;
            default:
                transactionType = 'adjustment';
        }
        
        // Create transaction entries based on the category's debit and credit accounts
        const entries: TransactionEntry[] = [
            {
                category: transactionForm.category,
                account: category.debitAccount,
                debit: transactionForm.amount,
                credit: 0
            },
            {
                category: 0, // No category for the balancing entry
                account: category.creditAccount,
                debit: 0,
                credit: transactionForm.amount
            }
        ];
        
        // Create the transaction object
        const newTransaction: Transaction = {
            id: getNextTransactionId(),
            date: transactionForm.date,
            description: transactionForm.description,
            type: transactionType,
            entries: entries,
            amount: transactionForm.amount
        };
        
        // Add to transactions array
        transactions.push(newTransaction);
        
        // Save to localStorage
        saveTransactionsToStorage();
        
        // Navigate back to transactions list
        goto('/budget/transactions');
    }
    
    // Handle form submission
    function handleSubmit(e: Event) {
        e.preventDefault();
        createTransaction();
    }
    
    // Cancel and go back to transactions list
    function cancelTransaction() {
        goto('/budget/transactions');
    }
</script>

<div class="page-container">
    {#if !isAuthenticated}
        <div class="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to create transactions.</p>
            <button class="btn primary">Log In</button>
        </div>
    {:else if !hasAccess}
        <div class="auth-message">
            <h2>Access Denied</h2>
            <p>You don't have permission to create transactions.</p>
        </div>
    {:else}
        <header class="page-header">
            <div class="header-content">
                <h1>Create Transaction</h1>
                <div class="header-actions">
                    <a href="/budget/transactions" class="btn secondary">Back to Transactions</a>
                    <button class="btn secondary" onclick={loadAccountsFromStorage}>Reload Accounts</button>
                </div>
            </div>
            <p class="header-description">
                Create a new transaction by selecting a category and entering an amount.
                The system will automatically create the correct double-entry based on the category's accounts.
            </p>
        </header>
        
        <div class="transaction-form">
            <form onsubmit={handleSubmit}>
                <div class="form-section">
                    <h3>Transaction Details</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="transaction-date">Date</label>
                            <input 
                                type="date" 
                                id="transaction-date" 
                                bind:value={transactionForm.date}
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="transaction-category">Category</label>
                            <select 
                                id="transaction-category" 
                                bind:value={transactionForm.category}
                                onchange={() => {
                                    // Set description to category name when category is selected
                                    if (transactionForm.category !== 0) {
                                        const selectedCategory = categories.find(c => c.id === transactionForm.category);
                                        if (selectedCategory) {
                                            transactionForm.description = selectedCategory.name;
                                        }
                                    }
                                }}
                                required
                            >
                                <option value={0}>Select a Category</option>
                                {#each categories as category}
                                    <option value={category.id}>{category.name} ({category.type})</option>
                                {/each}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="transaction-amount">Amount</label>
                            <input 
                                type="number" 
                                id="transaction-amount" 
                                bind:value={transactionForm.amount}
                                min="0.01" 
                                step="0.01"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="transaction-description">Description</label>
                            <input 
                                type="text" 
                                id="transaction-description" 
                                bind:value={transactionForm.description}
                                placeholder="Enter transaction description"
                                required
                            />
                        </div>
                    </div>
                </div>
                
                <div class="form-preview">
                    <h3>Transaction Preview</h3>
                    
                    {#if transactionForm.category !== 0}
                        {@const selectedCategory = categories.find(c => c.id === transactionForm.category)}
                        {#if selectedCategory}
                            <div class="preview-section">
                                <div class="preview-row">
                                    <span class="preview-label">Type:</span>
                                    <span class="preview-value">{selectedCategory.type}</span>
                                </div>
                                <div class="preview-row">
                                    <span class="preview-label">Debit Account:</span>
                                    <span class="preview-value">{selectedCategory.debitAccount}</span>
                                </div>
                                <div class="preview-row">
                                    <span class="preview-label">Credit Account:</span>
                                    <span class="preview-value">{selectedCategory.creditAccount}</span>
                                </div>
                                <div class="preview-row">
                                    <span class="preview-label">Amount:</span>
                                    <span class="preview-value">${transactionForm.amount.toFixed(2)}</span>
                                </div>
                            </div>
                        {/if}
                    {/if}
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn secondary" onclick={cancelTransaction}>Cancel</button>
                    <button type="submit" class="btn primary">Save Transaction</button>
                </div>
            </form>
        </div>
    {/if}
</div>

<style>
    .page-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        padding-top: 5rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .auth-message {
        text-align: center;
        margin: 4rem auto;
        padding: 2rem;
        border-radius: 8px;
        background-color: #f8f9fa;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 500px;
    }
    
    .page-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e9ecef;
    }
    
    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .header-description {
        margin-top: 0.5rem;
        color: #6c757d;
    }
    
    .header-actions {
        display: flex;
        gap: 1rem;
    }
    
    .transaction-form {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }
    
    .form-section {
        margin-bottom: 2rem;
    }
    
    .form-section h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #343a40;
        font-size: 1.25rem;
    }
    
    .form-row {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
    }
    
    .form-group {
        flex: 1;
        min-width: 200px;
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #495057;
    }
    
    .form-group input,
    .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    .form-preview {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .form-preview h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #343a40;
        font-size: 1.25rem;
    }
    
    .preview-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .preview-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #e9ecef;
    }
    
    .preview-label {
        font-weight: 500;
        color: #495057;
    }
    
    .preview-value {
        color: #212529;
    }
    
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    /* Buttons */
    .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }
    
    .btn.primary {
        background-color: #007bff;
        color: white;
    }
    
    .btn.primary:hover {
        background-color: #0069d9;
    }
    
    .btn.secondary {
        background-color: #6c757d;
        color: white;
        text-decoration: none;
    }
    
    .btn.secondary:hover {
        background-color: #5a6268;
    }
    
    /* Responsive adjustments */
    @media (max-width: 1200px) {
        .form-group {
            flex-basis: calc(50% - 0.75rem);
            min-width: 150px;
        }
    }
    
    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .form-group {
            flex-basis: 100%;
        }
        
        .form-actions {
            flex-direction: column;
        }
        
        .btn {
            width: 100%;
        }
    }
</style> 
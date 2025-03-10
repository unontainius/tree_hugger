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
        adjustmentFor?: number; // ID of the transaction this is adjusting
        isNegativeAdjustment?: boolean; // Flag to indicate this is a negative adjustment
    }
    
    // Sample categories - in a real app, this would be fetched from your backend
    let categories: Category[] = $state([]);
    
    // All accounts from localStorage
    let storedAccounts: Account[] = $state([]);
    
    // Transactions array
    let transactions: Transaction[] = $state([]);
    
    // Original transaction to adjust
    let originalTransaction: Transaction | null = $state(null);
    let transactionId = $state(0);
    
    // Adjustment form
    let adjustmentForm = $state({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 0, // Category ID
        amount: 0
    });
    
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
        
        // Get transaction ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            transactionId = parseInt(id);
            loadOriginalTransaction(transactionId);
        } else {
            alert('No transaction ID provided');
            goto('/budget/transactions');
        }
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
            alert('Access denied. You need proper permissions to adjust transactions.');
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
    
    // Load the original transaction to adjust
    function loadOriginalTransaction(id: number) {
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
            originalTransaction = transaction;
            
            // Pre-fill the adjustment form with the original transaction's category and amount
            if (transaction.entries.length > 0) {
                const mainEntry = transaction.entries[0];
                adjustmentForm.category = mainEntry.category;
                adjustmentForm.amount = transaction.amount;
                
                // Set description to indicate this is an adjustment
                adjustmentForm.description = `Adjustment for: ${transaction.description}`;
            }
        } else {
            alert('Transaction not found');
            goto('/budget/transactions');
        }
    }
    
    // Get next transaction ID
    function getNextTransactionId(): number {
        if (transactions.length === 0) {
            return 1;
        }
        return Math.max(...transactions.map(t => t.id)) + 1;
    }
    
    // Create a new adjustment transaction
    function createAdjustmentTransaction() {
        if (!originalTransaction) {
            alert('No original transaction to adjust');
            return;
        }
        
        if (!adjustmentForm.date) {
            alert('Please select a date');
            return;
        }
        
        if (adjustmentForm.description.trim() === '') {
            alert('Please enter a description');
            return;
        }
        
        if (adjustmentForm.category === 0) {
            alert('Please select a category');
            return;
        }
        
        if (adjustmentForm.amount === 0) {
            alert('Please enter a non-zero amount');
            return;
        }
        
        // Find the selected category
        const category = categories.find(c => c.id === adjustmentForm.category);
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
        
        // Get the absolute amount for the transaction
        const absAmount = Math.abs(adjustmentForm.amount);
        
        // Create transaction entries based on the category's debit and credit accounts
        // If amount is negative, swap debit and credit
        const entries: TransactionEntry[] = adjustmentForm.amount >= 0 
            ? [
                {
                    category: adjustmentForm.category,
                    account: category.debitAccount,
                    debit: absAmount,
                    credit: 0
                },
                {
                    category: 0, // No category for the balancing entry
                    account: category.creditAccount,
                    debit: 0,
                    credit: absAmount
                }
            ]
            : [
                {
                    category: adjustmentForm.category,
                    account: category.debitAccount,
                    debit: 0,
                    credit: absAmount
                },
                {
                    category: 0, // No category for the balancing entry
                    account: category.creditAccount,
                    debit: absAmount,
                    credit: 0
                }
            ];
        
        // Create the adjustment transaction object
        const newTransaction: Transaction = {
            id: getNextTransactionId(),
            date: adjustmentForm.date,
            description: adjustmentForm.description,
            type: 'adjustment',
            entries: entries,
            amount: absAmount, // Store the absolute amount but remember the sign for display
            adjustmentFor: originalTransaction.id,
            isNegativeAdjustment: adjustmentForm.amount < 0 // Flag to indicate this is a negative adjustment
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
        createAdjustmentTransaction();
    }
    
    // Cancel and go back to transactions list
    function cancelAdjustment() {
        goto('/budget/transactions');
    }
    
    // Format date for display
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
    
    // Get category name by ID
    function getCategoryName(categoryId: number): string {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown Category';
    }
</script>

<div class="page-container">
    {#if !isAuthenticated}
        <div class="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to adjust transactions.</p>
            <button class="btn primary">Log In</button>
        </div>
    {:else if !hasAccess}
        <div class="auth-message">
            <h2>Access Denied</h2>
            <p>You don't have permission to adjust transactions.</p>
        </div>
    {:else}
        <header class="page-header">
            <div class="header-content">
                <h1>Adjust Transaction</h1>
                <div class="header-actions">
                    <a href="/budget/transactions" class="btn secondary">Back to Transactions</a>
                </div>
            </div>
            <p class="header-description">
                Create an adjustment transaction to correct the original transaction.
                This will create a new transaction that adjusts the affected accounts.
            </p>
        </header>
        
        {#if originalTransaction}
            <div class="original-transaction">
                <h3>Original Transaction</h3>
                <div class="transaction-details">
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">{formatDate(originalTransaction.date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Description:</span>
                        <span class="detail-value">{originalTransaction.description}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Amount:</span>
                        <span class="detail-value">${originalTransaction.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Type:</span>
                        <span class="detail-value transaction-type {originalTransaction.type}">{originalTransaction.type}</span>
                    </div>
                    
                    <h4>Entries</h4>
                    <div class="entries-table">
                        <div class="entry-header">
                            <div class="entry-cell">Account</div>
                            <div class="entry-cell">Category</div>
                            <div class="entry-cell">Debit</div>
                            <div class="entry-cell">Credit</div>
                        </div>
                        {#each originalTransaction.entries as entry}
                            <div class="entry-row">
                                <div class="entry-cell">{entry.account}</div>
                                <div class="entry-cell">{entry.category ? getCategoryName(entry.category) : ''}</div>
                                <div class="entry-cell">${entry.debit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                <div class="entry-cell">${entry.credit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
        
        <div class="adjustment-form">
            <h3>Create Adjustment</h3>
            <form onsubmit={handleSubmit}>
                <div class="form-section">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="adjustment-date">Date</label>
                            <input 
                                type="date" 
                                id="adjustment-date" 
                                bind:value={adjustmentForm.date}
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="adjustment-category">Category</label>
                            <select 
                                id="adjustment-category" 
                                bind:value={adjustmentForm.category}
                                onchange={() => {
                                    // Set description to category name when category is selected
                                    if (adjustmentForm.category !== 0) {
                                        const selectedCategory = categories.find(c => c.id === adjustmentForm.category);
                                        if (selectedCategory) {
                                            adjustmentForm.description = `Adjustment for: ${originalTransaction?.description || ''} - ${selectedCategory.name}`;
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
                            <label for="adjustment-amount">Amount</label>
                            <input 
                                type="number" 
                                id="adjustment-amount" 
                                bind:value={adjustmentForm.amount}
                                step="0.01"
                                placeholder="0.00"
                                required
                            />
                            <small class="form-hint">Enter a negative amount to reduce a previously recorded value.</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="adjustment-description">Description</label>
                            <input 
                                type="text" 
                                id="adjustment-description" 
                                bind:value={adjustmentForm.description}
                                placeholder="Enter adjustment description"
                                required
                            />
                        </div>
                    </div>
                </div>
                
                <div class="form-preview">
                    <h3>Adjustment Preview</h3>
                    
                    {#if adjustmentForm.category !== 0}
                        {@const selectedCategory = categories.find(c => c.id === adjustmentForm.category)}
                        {#if selectedCategory}
                            <div class="preview-section">
                                <div class="preview-row">
                                    <span class="preview-label">Type:</span>
                                    <span class="preview-value">adjustment</span>
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
                                    <span class="preview-value">
                                        {#if adjustmentForm.amount < 0}
                                            -${Math.abs(adjustmentForm.amount).toFixed(2)}
                                        {:else}
                                            ${adjustmentForm.amount.toFixed(2)}
                                        {/if}
                                    </span>
                                </div>
                                <div class="preview-row">
                                    <span class="preview-label">Adjusting Transaction:</span>
                                    <span class="preview-value">#{originalTransaction?.id} - {originalTransaction?.description}</span>
                                </div>
                            </div>
                        {/if}
                    {/if}
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn secondary" onclick={cancelAdjustment}>Cancel</button>
                    <button type="submit" class="btn primary">Create Adjustment</button>
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
    
    .original-transaction {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        margin-bottom: 2rem;
    }
    
    .original-transaction h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #343a40;
        font-size: 1.25rem;
    }
    
    .transaction-details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .detail-row {
        display: flex;
        padding: 0.5rem 0;
        border-bottom: 1px solid #e9ecef;
    }
    
    .detail-label {
        font-weight: 500;
        color: #495057;
        width: 150px;
    }
    
    .detail-value {
        color: #212529;
    }
    
    .transaction-type {
        text-transform: capitalize;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 500;
        display: inline-block;
    }
    
    .transaction-type.income {
        background-color: #e8f5e9;
        color: #4caf50;
    }
    
    .transaction-type.expense {
        background-color: #ffebee;
        color: #f44336;
    }
    
    .transaction-type.transfer {
        background-color: #e3f2fd;
        color: #2196f3;
    }
    
    .transaction-type.adjustment {
        background-color: #fff8e1;
        color: #ffc107;
    }
    
    .entries-table {
        margin-top: 1rem;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .entry-header {
        display: flex;
        background-color: #f8f9fa;
        font-weight: 600;
        border-bottom: 1px solid #e9ecef;
    }
    
    .entry-row {
        display: flex;
        border-bottom: 1px solid #e9ecef;
    }
    
    .entry-row:last-child {
        border-bottom: none;
    }
    
    .entry-cell {
        padding: 0.75rem 1rem;
        flex: 1;
    }
    
    .entry-cell:nth-child(3),
    .entry-cell:nth-child(4) {
        text-align: right;
    }
    
    .adjustment-form {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }
    
    .adjustment-form h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #343a40;
        font-size: 1.25rem;
    }
    
    .form-section {
        margin-bottom: 2rem;
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
    
    .form-hint {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.75rem;
        color: #6c757d;
    }
</style> 
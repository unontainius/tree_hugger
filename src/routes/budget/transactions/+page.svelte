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
    
    // Sample transactions - in a real app, this would be fetched from your backend
    let transactions: Transaction[] = $state([
        {
            id: 1,
            date: '2023-03-01',
            description: 'Monthly Salary',
            type: 'income',
            entries: [
                { category: 1, account: 'Salary Income', debit: 0, credit: 8000 },
                { category: 0, account: 'Bank Account', debit: 8000, credit: 0 }
            ],
            amount: 8000
        },
        {
            id: 2,
            date: '2023-03-05',
            description: 'Rent Payment',
            type: 'expense',
            entries: [
                { category: 2, account: 'Housing Expense', debit: 2500, credit: 0 },
                { category: 0, account: 'Bank Account', debit: 0, credit: 2500 }
            ],
            amount: 2500
        },
        {
            id: 3,
            date: '2023-03-10',
            description: 'Grocery Shopping',
            type: 'expense',
            entries: [
                { category: 3, account: 'Groceries Expense', debit: 200, credit: 0 },
                { category: 0, account: 'Credit Card', debit: 0, credit: 200 }
            ],
            amount: 200
        },
        {
            id: 4,
            date: '2023-03-15',
            description: 'Investment Deposit',
            type: 'transfer',
            entries: [
                { category: 4, account: 'Investments', debit: 900, credit: 0 },
                { category: 0, account: 'Bank Account', debit: 0, credit: 900 }
            ],
            amount: 900
        },
        {
            id: 5,
            date: '2023-03-20',
            description: 'Credit Card Payment',
            type: 'transfer',
            entries: [
                { category: 5, account: 'Credit Card', debit: 1000, credit: 0 },
                { category: 0, account: 'Bank Account', debit: 0, credit: 1000 }
            ],
            amount: 1000
        }
    ]);
    
    // Filters
    let selectedTransactionType = $state<TransactionType | 'all'>('all');
    let selectedCategory = $state<number | 'all'>('all');
    let startDate = $state<string>('');
    let endDate = $state<string>('');
    
    // Account interface
    interface Account {
        id: number;
        name: string;
        type: string;
        balance: number;
        categories: number[];
        isActive: boolean;
        description?: string;
    }
    
    // Sample accounts - will be loaded from localStorage
    let accounts: Account[] = $state([]);
    
    // Check authentication and access rights
    onMount(() => {
        // In a real app, this would check your auth service
        checkAuthentication();
        
        // Load categories from localStorage
        loadCategoriesFromStorage();
        
        // Load accounts from localStorage
        loadAccountsFromStorage();
        
        // Load transactions from localStorage if available
        loadTransactionsFromStorage();
        
        // Set default date range to current month
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        startDate = firstDay.toISOString().split('T')[0];
        endDate = lastDay.toISOString().split('T')[0];
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
            alert('Access denied. You need proper permissions to view the transactions.');
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
            const storedAccounts = localStorage.getItem('budgetAccounts');
            if (storedAccounts) {
                accounts = JSON.parse(storedAccounts);
                console.log('Loaded accounts from storage:', accounts);
                
                // Show a temporary success message
                const statusElement = document.getElementById('account-status');
                if (statusElement) {
                    statusElement.textContent = `Loaded ${accounts.length} accounts from storage`;
                    statusElement.style.display = 'block';
                    setTimeout(() => {
                        statusElement.style.display = 'none';
                    }, 3000);
                }
            } else {
                console.log('No accounts found in localStorage');
                
                // Show a temporary error message
                const statusElement = document.getElementById('account-status');
                if (statusElement) {
                    statusElement.textContent = 'No accounts found in storage';
                    statusElement.style.display = 'block';
                    statusElement.className = 'status-message error';
                    setTimeout(() => {
                        statusElement.style.display = 'none';
                    }, 3000);
                }
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
    
    // Delete a transaction
    function deleteTransaction(id: number) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            transactions = transactions.filter(transaction => transaction.id !== id);
            
            // Save changes to localStorage
            saveTransactionsToStorage();
        }
    }
    
    // Filter transactions based on selected filters
    function getFilteredTransactions() {
        return transactions.filter(transaction => {
            // Filter by transaction type
            if (selectedTransactionType !== 'all' && transaction.type !== selectedTransactionType) {
                return false;
            }
            
            // Filter by category
            if (selectedCategory !== 'all') {
                const categoryId = Number(selectedCategory);
                const hasCategory = transaction.entries.some(entry => entry.category === categoryId);
                if (!hasCategory) {
                    return false;
                }
            }
            
            // Filter by date range
            if (startDate && endDate) {
                const transactionDate = new Date(transaction.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59); // Include the entire end day
                
                if (transactionDate < start || transactionDate > end) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    // Set transaction type filter
    function setTransactionTypeFilter(type: TransactionType | 'all') {
        selectedTransactionType = type;
    }
    
    // Set category filter
    function setCategoryFilter(categoryId: number | 'all') {
        selectedCategory = categoryId;
    }
    
    // Format date for display
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    // Get category name by ID
    function getCategoryName(categoryId: number): string {
        if (categoryId === 0) return 'N/A'; // For non-category accounts
        
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
    }
    
    // Navigate to create new transaction
    function navigateToNewTransaction() {
        goto('/budget/transactions/new');
    }
    
    // Navigate to edit transaction
    function navigateToEditTransaction(id: number) {
        goto(`/budget/transactions/${id}`);
    }
    
    // Navigate to adjust transaction
    function navigateToAdjustTransaction(id: number) {
        goto(`/budget/transactions/adjust?id=${id}`);
    }
    
    // Calculate totals for filtered transactions
    function calculateTotals() {
        const filteredTransactions = getFilteredTransactions();
        
        let incomeTotal = 0;
        let expenseTotal = 0;
        let transferTotal = 0;
        let adjustmentTotal = 0;
        
        for (const transaction of filteredTransactions) {
            const amount = transaction.isNegativeAdjustment ? -transaction.amount : transaction.amount;
            
            if (transaction.type === 'income') {
                incomeTotal += amount;
            } else if (transaction.type === 'expense') {
                expenseTotal += amount;
            } else if (transaction.type === 'transfer') {
                transferTotal += amount;
            } else if (transaction.type === 'adjustment') {
                adjustmentTotal += amount;
            }
        }
        
        const netTotal = incomeTotal - expenseTotal;
        
        return {
            income: incomeTotal,
            expense: expenseTotal,
            transfer: transferTotal,
            adjustment: adjustmentTotal,
            net: netTotal
        };
    }
</script>

<div class="page-container">
    {#if !isAuthenticated}
        <div class="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to access the transactions.</p>
            <button class="btn primary">Log In</button>
        </div>
    {:else if !hasAccess}
        <div class="auth-message">
            <h2>Access Denied</h2>
            <p>You don't have permission to access the transactions.</p>
        </div>
    {:else}
        <header class="page-header">
            <div class="header-content">
                <h1>Transactions</h1>
                <div class="header-actions">
                    <a href="/budget" class="btn secondary">Back to Dashboard</a>
                    <button class="btn secondary" onclick={loadAccountsFromStorage}>Reload Accounts</button>
                    <button class="btn primary" onclick={navigateToNewTransaction}>Add Transaction</button>
                </div>
            </div>
            <p class="header-description">
                View and manage your financial transactions. Filter by type, category, or date range.
            </p>
            <div id="account-status" class="status-message" style="display: none;"></div>
        </header>
        
        <div class="filters-container">
            <div class="filter-group">
                <label for="transaction-type">Transaction Type</label>
                <select 
                    id="transaction-type" 
                    bind:value={selectedTransactionType}
                >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="transfer">Transfer</option>
                    <option value="adjustment">Adjustment</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="category">Category</label>
                <select 
                    id="category" 
                    bind:value={selectedCategory}
                >
                    <option value="all">All Categories</option>
                    {#each categories as category}
                        <option value={category.id}>{category.name} ({category.type})</option>
                    {/each}
                </select>
            </div>
            
            <div class="filter-group">
                <label for="start-date">Start Date</label>
                <input 
                    type="date" 
                    id="start-date" 
                    bind:value={startDate}
                />
            </div>
            
            <div class="filter-group">
                <label for="end-date">End Date</label>
                <input 
                    type="date" 
                    id="end-date" 
                    bind:value={endDate}
                />
            </div>
        </div>
        
        <div class="transactions-list">
            <table class="transactions-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Categories</th>
                        <th class="amount-column">Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each getFilteredTransactions() as transaction}
                        <tr class="transaction-row {transaction.type}">
                            <td>{formatDate(transaction.date)}</td>
                            <td>{transaction.description}</td>
                            <td class="transaction-type {transaction.type}">{transaction.type}</td>
                            <td>
                                <div class="categories-list">
                                    {#each transaction.entries.filter(entry => entry.category !== 0) as entry}
                                        <span class="category-tag">
                                            {getCategoryName(entry.category)}
                                        </span>
                                    {/each}
                                </div>
                            </td>
                            <td class="amount-column">
                                {#if transaction.isNegativeAdjustment}
                                    -${transaction.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                {:else}
                                    ${transaction.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                {/if}
                            </td>
                            <td class="actions-cell">
                                <button class="btn small" onclick={() => navigateToAdjustTransaction(transaction.id)}>Adjust</button>
                                <button class="btn small danger" onclick={() => deleteTransaction(transaction.id)}>Delete</button>
                            </td>
                        </tr>
                    {/each}
                    
                    {#if getFilteredTransactions().length === 0}
                        <tr>
                            <td colspan="6" class="no-transactions">
                                No transactions found. Adjust your filters or click "Add Transaction" to create one.
                            </td>
                        </tr>
                    {:else}
                        {@const totals = calculateTotals()}
                        <tr class="totals-row totals-section">
                            <td colspan="6" class="totals-section-header">Transaction Summary</td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="4" class="totals-label">Total Income</td>
                            <td class="amount-column totals-amount positive">
                                ${totals.income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td></td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="4" class="totals-label">Total Expenses</td>
                            <td class="amount-column totals-amount negative">
                                ${totals.expense.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td></td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="4" class="totals-label">Total Transfers</td>
                            <td class="amount-column totals-amount transfer">
                                ${totals.transfer.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td></td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="4" class="totals-label">Total Adjustments</td>
                            <td class="amount-column totals-amount adjustment">
                                ${totals.adjustment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td></td>
                        </tr>
                        <tr class="totals-row grand-total">
                            <td colspan="4" class="totals-label">Net Total (Income - Expenses)</td>
                            <td class="amount-column totals-amount {totals.net >= 0 ? 'positive' : 'negative'}">
                                ${totals.net.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td></td>
                        </tr>
                    {/if}
                </tbody>
            </table>
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
    
    .filters-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    
    .filter-group {
        flex: 1;
        min-width: 200px;
    }
    
    .filter-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #495057;
    }
    
    .filter-group select,
    .filter-group input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    .transactions-list {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .transactions-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .transactions-table th,
    .transactions-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
    }
    
    .transactions-table th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    
    .amount-column {
        text-align: right;
        font-weight: 500;
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
    
    .categories-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .category-tag {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        background-color: #f1f3f5;
        border-radius: 4px;
        white-space: nowrap;
    }
    
    .no-transactions {
        text-align: center;
        padding: 2rem;
        color: #6c757d;
    }
    
    .actions-cell {
        display: flex;
        gap: 0.5rem;
    }
    
    .totals-row {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    
    .totals-section {
        border-top: 2px solid #dee2e6;
    }
    
    .totals-section-header {
        text-align: center;
        font-weight: 700;
        font-size: 1.1rem;
        color: #495057;
        padding: 0.75rem;
    }
    
    .grand-total {
        border-top: 1px solid #dee2e6;
        background-color: #e9ecef;
        font-weight: 700;
    }
    
    .totals-label {
        text-align: right;
        padding-right: 2rem;
    }
    
    .totals-amount {
        font-weight: 700;
    }
    
    .positive {
        color: #28a745;
    }
    
    .negative {
        color: #dc3545;
    }
    
    .transfer {
        color: #2196f3;
    }
    
    .adjustment {
        color: #ffc107;
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
    
    .btn.danger {
        background-color: #dc3545;
        color: white;
    }
    
    .btn.danger:hover {
        background-color: #c82333;
    }
    
    .btn.small {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }
    
    /* Responsive adjustments */
    @media (max-width: 1200px) {
        .transactions-list {
            overflow-x: auto;
        }
        
        .transactions-table {
            min-width: 900px;
        }
    }
    
    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .filters-container {
            flex-direction: column;
        }
        
        .filter-group {
            width: 100%;
        }
        
        .actions-cell {
            flex-direction: column;
        }
    }
    
    .status-message {
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        background-color: #e8f5e9;
        color: #4caf50;
        font-size: 0.875rem;
        text-align: center;
    }
    
    .status-message.error {
        background-color: #ffebee;
        color: #f44336;
    }
</style> 
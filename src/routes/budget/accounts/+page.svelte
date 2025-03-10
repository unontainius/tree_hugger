<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    
    let { data }: { data: PageData } = $props();
    
    // Authentication state
    let isAuthenticated = $state(false);
    let userGroups: string[] = $state([]);
    let hasAccess = $state(false);
    
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
    
    // Category types
    type CategoryType = 'income' | 'expense' | 'asset' | 'liability';
    
    // Category definition interface
    interface Category {
        id: number;
        name: string;
        type: CategoryType;
        balancingAccount: string;
        isDebit: boolean;
        budgetPeriod?: string;
        budgetAmount?: number;
    }
    
    // Sample accounts - in a real app, this would be fetched from your backend
    let accounts: Account[] = $state([]);
    
    // Full list of available accounts for transactions
    const availableAccounts = [
        'Cash', 'Bank Account', 'Credit Card', 'Accounts Receivable', 'Accounts Payable',
        'Salary Income', 'Investment Income', 'Housing Expense', 'Utilities Expense',
        'Groceries Expense', 'Transportation Expense', 'Entertainment Expense',
        'Healthcare Expense', 'Debt Expense', 'Savings'
    ];
    
    // Categories - in a real app, this would be fetched from your backend
    let categories: Category[] = $state([]);
    
    // Filter state
    let selectedAccountType = $state<AccountType | 'all'>('all');
    let searchQuery = $state('');
    
    // Check authentication and access rights
    onMount(() => {
        // In a real app, this would check your auth service
        checkAuthentication();
        
        // Load accounts from localStorage
        loadAccountsFromStorage();
        
        // Load categories from localStorage
        loadCategoriesFromStorage();
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
            alert('Access denied. You need proper permissions to view accounts.');
            goto('/');
        }
    }
    
    // Load accounts from localStorage
    function loadAccountsFromStorage() {
        try {
            const storedAccounts = localStorage.getItem('budgetAccounts');
            if (storedAccounts) {
                accounts = JSON.parse(storedAccounts);
                console.log('Loaded accounts from storage:', accounts);
            } else {
                // If no accounts in storage, initialize with the comprehensive list
                console.log('No accounts found in storage, initializing from list');
                initializeAccountsFromList();
            }
        } catch (error) {
            console.error('Error loading accounts from storage:', error);
            // If there was an error, initialize with the comprehensive list
            initializeAccountsFromList();
        }
    }
    
    // Initialize accounts from the comprehensive list
    function initializeAccountsFromList() {
        console.log('Initializing accounts from comprehensive list');
        
        // Create account objects from the available accounts list
        const newAccounts: Account[] = [];
        let id = 1;
        
        for (const accountName of availableAccounts) {
            let type: AccountType = 'asset';
            
            // Determine account type based on name
            if (accountName.includes('Income')) {
                type = 'income';
            } else if (accountName.includes('Expense')) {
                type = 'expense';
            } else if (accountName === 'Credit Card' || accountName.includes('Payable')) {
                type = 'liability';
            }
            
            // Create account object
            newAccounts.push({
                id: id++,
                name: accountName,
                type: type,
                balance: type === 'liability' ? -1000 : (type === 'asset' ? 1000 : 0),
                categories: [],
                isActive: true,
                description: `Auto-generated ${accountName} account`
            });
        }
        
        accounts = newAccounts;
        saveAccountsToStorage();
        console.log('Initialized accounts from comprehensive list:', accounts);
    }
    
    // Save accounts to localStorage
    function saveAccountsToStorage() {
        try {
            console.log('Saving accounts to localStorage:', accounts);
            localStorage.setItem('budgetAccounts', JSON.stringify(accounts));
            
            // Verify the save worked
            const savedData = localStorage.getItem('budgetAccounts');
            const parsedData = JSON.parse(savedData || '[]');
            console.log('Verified saved data:', parsedData);
            console.log('Number of accounts saved:', parsedData.length);
            
            // Show a temporary success message
            const statusElement = document.getElementById('save-status');
            if (statusElement) {
                statusElement.textContent = 'Accounts saved successfully!';
                statusElement.style.display = 'block';
                setTimeout(() => {
                    statusElement.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('Error saving accounts to storage:', error);
            alert('Error saving accounts. Please check console for details.');
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
    
    // Get filtered accounts based on selected type and search query
    function getFilteredAccounts() {
        return accounts.filter(account => {
            // Filter by account type
            if (selectedAccountType !== 'all' && account.type !== selectedAccountType) {
                return false;
            }
            
            // Filter by search query
            if (searchQuery && !account.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            
            return true;
        });
    }
    
    // Get category names for an account
    function getCategoryNames(categoryIds: number[]): string {
        if (!categoryIds.length) return 'None';
        
        return categoryIds
            .map(id => {
                const category = categories.find(c => c.id === id);
                return category ? category.name : '';
            })
            .filter(Boolean)
            .join(', ');
    }
    
    // Format currency
    function formatCurrency(amount: number): string {
        return amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Navigate to create new account
    function navigateToNewAccount() {
        goto('/budget/accounts/new');
    }
    
    // Navigate to edit account
    function navigateToEditAccount(id: number) {
        goto(`/budget/accounts/${id}`);
    }
    
    // Delete an account
    function deleteAccount(id: number) {
        if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
            accounts = accounts.filter(account => account.id !== id);
            saveAccountsToStorage();
        }
    }
    
    // Calculate total balance for each account type
    function calculateTotals() {
        const filteredAccounts = getFilteredAccounts();
        
        let assetTotal = 0;
        let liabilityTotal = 0;
        let incomeTotal = 0;
        let expenseTotal = 0;
        
        for (const account of filteredAccounts) {
            if (account.type === 'asset') {
                assetTotal += account.balance;
            } else if (account.type === 'liability') {
                liabilityTotal += account.balance;
            } else if (account.type === 'income') {
                incomeTotal += account.balance;
            } else if (account.type === 'expense') {
                expenseTotal += account.balance;
            }
        }
        
        const netWorth = assetTotal + liabilityTotal; // Liabilities are typically negative
        
        return {
            assets: assetTotal,
            liabilities: liabilityTotal,
            income: incomeTotal,
            expenses: expenseTotal,
            netWorth: netWorth
        };
    }
    
    // Reset accounts with confirmation
    function resetAccounts() {
        if (confirm('Are you sure you want to reset all accounts to the default list? This will delete any custom accounts and changes you have made.')) {
            initializeAccountsFromList();
        }
    }
</script>

<div class="page-container">
    {#if !isAuthenticated}
        <div class="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to access accounts.</p>
            <button class="btn primary">Log In</button>
        </div>
    {:else if !hasAccess}
        <div class="auth-message">
            <h2>Access Denied</h2>
            <p>You don't have permission to access accounts.</p>
        </div>
    {:else}
        <header class="page-header">
            <div class="header-content">
                <h1>Accounts</h1>
                <div class="header-actions">
                    <a href="/budget" class="btn secondary">Back to Dashboard</a>
                    <button class="btn secondary" onclick={resetAccounts}>Reset Accounts</button>
                    <button class="btn primary" onclick={navigateToNewAccount}>Add Account</button>
                </div>
            </div>
            <p class="header-description">
                Manage your financial accounts and link them to budget categories.
            </p>
        </header>
        
        <div class="filters-container">
            <div class="filter-group">
                <label for="account-type">Account Type</label>
                <select 
                    id="account-type" 
                    bind:value={selectedAccountType}
                >
                    <option value="all">All Types</option>
                    <option value="asset">Assets</option>
                    <option value="liability">Liabilities</option>
                    <option value="income">Income</option>
                    <option value="expense">Expenses</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="search">Search</label>
                <input 
                    type="text" 
                    id="search" 
                    bind:value={searchQuery}
                    placeholder="Search accounts..."
                />
            </div>
        </div>
        
        <div class="accounts-list">
            <table class="accounts-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th class="balance-header">Balance</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each getFilteredAccounts() as account}
                        <tr 
                            class="account-row" 
                            onclick={() => navigateToEditAccount(account.id)}
                        >
                            <td class="name-cell">{account.name}</td>
                            <td>
                                <span class="account-type {account.type}">{account.type}</span>
                            </td>
                            <td class="balance-column {account.balance >= 0 ? 'positive' : 'negative'}">
                                {formatCurrency(account.balance)}
                            </td>
                            <td>
                                <span class="status-badge {account.isActive ? 'active' : 'inactive'}">
                                    {account.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td class="actions-cell">
                                <button 
                                    class="btn small danger" 
                                    onclick={(e) => {
                                        e.stopPropagation(); // Prevent row click from triggering
                                        deleteAccount(account.id);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    {/each}
                    
                    {#if getFilteredAccounts().length === 0}
                        <tr>
                            <td colspan="5" class="no-accounts">
                                No accounts found. Adjust your filters or click "Add Account" to create one.
                            </td>
                        </tr>
                    {:else}
                        {@const totals = calculateTotals()}
                        <tr class="totals-row totals-section">
                            <td colspan="5" class="totals-section-header">Account Summary</td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="2" class="totals-label">Total Assets</td>
                            <td class="balance-column totals-amount positive">
                                {formatCurrency(totals.assets)}
                            </td>
                            <td colspan="2"></td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="2" class="totals-label">Total Liabilities</td>
                            <td class="balance-column totals-amount negative">
                                {formatCurrency(totals.liabilities)}
                            </td>
                            <td colspan="2"></td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="2" class="totals-label">Total Income</td>
                            <td class="balance-column totals-amount positive">
                                {formatCurrency(totals.income)}
                            </td>
                            <td colspan="2"></td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="2" class="totals-label">Total Expenses</td>
                            <td class="balance-column totals-amount negative">
                                {formatCurrency(totals.expenses)}
                            </td>
                            <td colspan="2"></td>
                        </tr>
                        <tr class="totals-row grand-total">
                            <td colspan="2" class="totals-label">Net Worth (Assets + Liabilities)</td>
                            <td class="balance-column totals-amount {totals.netWorth >= 0 ? 'positive' : 'negative'}">
                                {formatCurrency(totals.netWorth)}
                            </td>
                            <td colspan="2"></td>
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
    
    .accounts-list {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .accounts-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }
    
    .accounts-table th,
    .accounts-table td {
        padding: 0.4rem 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
        vertical-align: middle;
    }
    
    .accounts-table th {
        background-color: #f8f9fa;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .name-cell {
        width: 20%;
    }
    
    .balance-header {
        text-align: right !important;
    }
    
    .balance-column {
        text-align: right !important;
        font-weight: 500;
        width: 15%;
    }
    
    .account-type {
        text-transform: capitalize;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
        display: inline-block;
        white-space: nowrap;
    }
    
    .account-type.asset {
        background-color: #e3f2fd;
        color: #2196f3;
    }
    
    .account-type.liability {
        background-color: #fff8e1;
        color: #ffc107;
    }
    
    .account-type.income {
        background-color: #e8f5e9;
        color: #4caf50;
    }
    
    .account-type.expense {
        background-color: #ffebee;
        color: #f44336;
    }
    
    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        white-space: nowrap;
    }
    
    .status-badge.active {
        background-color: #e8f5e9;
        color: #4caf50;
    }
    
    .status-badge.inactive {
        background-color: #f8f9fa;
        color: #6c757d;
    }
    
    .no-accounts {
        text-align: center;
        padding: 2rem;
        color: #6c757d;
    }
    
    .actions-cell {
        display: flex;
        gap: 0.5rem;
    }
    
    .positive {
        color: #28a745;
    }
    
    .negative {
        color: #dc3545;
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
        .accounts-list {
            overflow-x: auto;
        }
        
        .accounts-table {
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
    
    .account-row {
        cursor: pointer;
        transition: background-color 0.15s;
    }
    
    .account-row:hover {
        background-color: rgba(0, 0, 0, 0.03);
    }
</style> 
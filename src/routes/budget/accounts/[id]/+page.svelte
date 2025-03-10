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
    
    // Account form
    let accountForm = $state<Account>({
        id: 0,
        name: '',
        type: 'asset',
        balance: 0,
        categories: [],
        isActive: true,
        description: ''
    });
    
    // All categories
    let categories: Category[] = $state([]);
    
    // All accounts
    let accounts: Account[] = $state([]);
    
    // Is this a new account or editing an existing one?
    let isNewAccount = $state(true);
    
    // Account ID from URL
    let accountId = $state(0);
    
    // Check authentication and access rights
    onMount(() => {
        // In a real app, this would check your auth service
        checkAuthentication();
        
        // Load accounts from localStorage
        loadAccountsFromStorage();
        
        // Load categories from localStorage
        loadCategoriesFromStorage();
        
        // Get account ID from URL
        const urlParts = window.location.pathname.split('/');
        const idFromUrl = urlParts[urlParts.length - 1];
        
        if (idFromUrl === 'new') {
            // Creating a new account
            isNewAccount = true;
            initializeNewAccount();
        } else {
            // Editing an existing account
            accountId = parseInt(idFromUrl);
            isNewAccount = false;
            loadAccountForEditing(accountId);
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
            alert('Access denied. You need proper permissions to manage accounts.');
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
            }
        } catch (error) {
            console.error('Error loading accounts from storage:', error);
        }
    }
    
    // Save accounts to localStorage
    function saveAccountsToStorage() {
        try {
            localStorage.setItem('budgetAccounts', JSON.stringify(accounts));
            console.log('Saved accounts to storage:', accounts);
        } catch (error) {
            console.error('Error saving accounts to storage:', error);
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
    
    // Initialize form for a new account
    function initializeNewAccount() {
        // Generate a new ID (in a real app, this would be handled by the backend)
        const newId = accounts.length > 0 
            ? Math.max(...accounts.map(a => a.id)) + 1 
            : 1;
        
        accountForm = {
            id: newId,
            name: '',
            type: 'asset',
            balance: 0,
            categories: [],
            isActive: true,
            description: ''
        };
    }
    
    // Load account data for editing
    function loadAccountForEditing(id: number) {
        const account = accounts.find(a => a.id === id);
        
        if (account) {
            // Clone the account to avoid direct mutation
            accountForm = { ...account };
        } else {
            alert('Account not found');
            goto('/budget/accounts');
        }
    }
    
    // Get filtered categories based on account type
    function getFilteredCategories() {
        // For asset and liability accounts, show all categories
        if (accountForm.type === 'asset' || accountForm.type === 'liability') {
            return categories;
        }
        
        // For income accounts, show only income categories
        if (accountForm.type === 'income') {
            return categories.filter(c => c.type === 'income');
        }
        
        // For expense accounts, show only expense categories
        if (accountForm.type === 'expense') {
            return categories.filter(c => c.type === 'expense');
        }
        
        return categories;
    }
    
    // Toggle category selection
    function toggleCategory(categoryId: number) {
        if (accountForm.categories.includes(categoryId)) {
            // Remove category
            accountForm.categories = accountForm.categories.filter(id => id !== categoryId);
        } else {
            // Add category
            accountForm.categories = [...accountForm.categories, categoryId];
        }
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
    
    // Save account
    function saveAccount() {
        if (!accountForm.name.trim()) {
            alert('Please enter an account name');
            return;
        }
        
        if (isNewAccount) {
            // Add new account
            accounts = [...accounts, accountForm];
        } else {
            // Update existing account
            accounts = accounts.map(account => 
                account.id === accountForm.id ? accountForm : account
            );
        }
        
        // Save to localStorage
        saveAccountsToStorage();
        
        // Navigate back to accounts list
        goto('/budget/accounts');
    }
    
    // Cancel and go back to accounts list
    function cancelEdit() {
        goto('/budget/accounts');
    }
</script>

<div class="page-container">
    {#if !isAuthenticated}
        <div class="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to manage accounts.</p>
            <button class="btn primary">Log In</button>
        </div>
    {:else if !hasAccess}
        <div class="auth-message">
            <h2>Access Denied</h2>
            <p>You don't have permission to manage accounts.</p>
        </div>
    {:else}
        <header class="page-header">
            <div class="header-content">
                <h1>{isNewAccount ? 'Create New Account' : 'Edit Account'}</h1>
                <div class="header-actions">
                    <button class="btn secondary" onclick={cancelEdit}>Cancel</button>
                    <button class="btn primary" onclick={saveAccount}>Save Account</button>
                </div>
            </div>
            <p class="header-description">
                {isNewAccount 
                    ? 'Create a new financial account and link it to budget categories.' 
                    : 'Update account details and linked categories.'}
            </p>
        </header>
        
        <div class="account-form-container">
            <div class="form-section">
                <h2>Account Details</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Account Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            bind:value={accountForm.name} 
                            placeholder="e.g., Checking Account"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="type">Account Type</label>
                        <select id="type" bind:value={accountForm.type}>
                            <option value="asset">Asset</option>
                            <option value="liability">Liability</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="balance">Current Balance</label>
                        <div class="amount-input">
                            <span class="currency-symbol">$</span>
                            <input 
                                type="number" 
                                id="balance" 
                                bind:value={accountForm.balance} 
                                step="0.01" 
                                placeholder="0.00"
                            />
                        </div>
                        <p class="help-text">
                            {#if accountForm.type === 'asset'}
                                For assets, enter a positive value for what you own.
                            {:else if accountForm.type === 'liability'}
                                For liabilities, enter a negative value for what you owe.
                            {:else if accountForm.type === 'income'}
                                Income accounts typically start with a zero balance.
                            {:else if accountForm.type === 'expense'}
                                Expense accounts typically start with a zero balance.
                            {/if}
                        </p>
                    </div>
                    
                    <div class="form-group">
                        <label for="status">Status</label>
                        <div class="toggle-container">
                            <label class="toggle">
                                <input 
                                    type="checkbox" 
                                    id="status" 
                                    bind:checked={accountForm.isActive}
                                />
                                <span class="slider"></span>
                                <span class="toggle-label">{accountForm.isActive ? 'Active' : 'Inactive'}</span>
                            </label>
                        </div>
                        <p class="help-text">
                            Inactive accounts won't appear in transaction forms but will still be visible in reports.
                        </p>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group full-width">
                        <label for="description">Description (Optional)</label>
                        <textarea 
                            id="description" 
                            bind:value={accountForm.description} 
                            placeholder="Add notes or details about this account"
                            rows="3"
                        ></textarea>
                    </div>
                </div>
            </div>
            
            <div class="form-section">
                <h2>Linked Categories</h2>
                <p class="section-description">
                    Link this account to budget categories for easier transaction entry.
                    {#if accountForm.type === 'income' || accountForm.type === 'expense'}
                        Only {accountForm.type} categories are shown.
                    {/if}
                </p>
                
                <div class="categories-grid">
                    {#each getFilteredCategories() as category}
                        <div class="category-checkbox">
                            <label class="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={accountForm.categories.includes(category.id)}
                                    onclick={() => toggleCategory(category.id)}
                                />
                                <span class="category-name {category.type}">{category.name}</span>
                            </label>
                        </div>
                    {/each}
                    
                    {#if getFilteredCategories().length === 0}
                        <p class="no-categories">
                            No categories found. <a href="/budget/categories/new">Create a category</a> first.
                        </p>
                    {/if}
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn secondary" onclick={cancelEdit}>Cancel</button>
                <button class="btn primary" onclick={saveAccount}>Save Account</button>
            </div>
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
    
    .account-form-container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .form-section {
        padding: 2rem;
        border-bottom: 1px solid #e9ecef;
    }
    
    .form-section h2 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.25rem;
        color: #343a40;
    }
    
    .section-description {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #6c757d;
    }
    
    .form-row {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .form-row:last-child {
        margin-bottom: 0;
    }
    
    .form-group {
        flex: 1;
        min-width: 200px;
    }
    
    .form-group.full-width {
        flex-basis: 100%;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    .form-group textarea {
        resize: vertical;
        min-height: 100px;
    }
    
    .help-text {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #6c757d;
    }
    
    .amount-input {
        position: relative;
    }
    
    .currency-symbol {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: #495057;
    }
    
    .amount-input input {
        padding-left: 1.5rem;
    }
    
    .toggle-container {
        margin-top: 0.5rem;
    }
    
    .toggle {
        position: relative;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
    }
    
    .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .slider {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
        background-color: #ccc;
        border-radius: 24px;
        transition: .4s;
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        border-radius: 50%;
        transition: .4s;
    }
    
    input:checked + .slider {
        background-color: #2196F3;
    }
    
    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }
    
    input:checked + .slider:before {
        transform: translateX(26px);
    }
    
    .toggle-label {
        margin-left: 0.75rem;
        font-weight: 500;
    }
    
    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .category-checkbox {
        padding: 0.5rem;
    }
    
    .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    
    .checkbox-label input {
        margin-right: 0.5rem;
    }
    
    .category-name {
        position: relative;
        padding-left: 0.5rem;
    }
    
    .category-name.income {
        border-left: 3px solid #4caf50;
    }
    
    .category-name.expense {
        border-left: 3px solid #f44336;
    }
    
    .category-name.asset {
        border-left: 3px solid #2196f3;
    }
    
    .category-name.liability {
        border-left: 3px solid #ffc107;
    }
    
    .no-categories {
        grid-column: 1 / -1;
        padding: 1.5rem;
        text-align: center;
        background-color: #f8f9fa;
        border-radius: 4px;
        color: #6c757d;
    }
    
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 2rem;
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
    }
    
    .btn.secondary:hover {
        background-color: #5a6268;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .form-row {
            flex-direction: column;
        }
        
        .form-actions {
            flex-direction: column;
        }
        
        .form-actions button {
            width: 100%;
        }
    }
</style> 
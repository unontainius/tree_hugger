<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    let { data }: { data: PageData } = $props();
    
    // Authentication state
    let isAuthenticated = $state(false);
    let userGroups: string[] = $state([]);
    let hasAccess = $state(false);
    
    // Dashboard data
    type TimeframeKey = 'Hourly' | 'Daily' | 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly' | 'Annual';
    const timeframes: TimeframeKey[] = ['Hourly', 'Daily', 'Weekly', 'Fortnightly', 'Monthly', 'Quarterly', 'Annual'];
    
    // Category types
    type CategoryType = 'income' | 'expense' | 'asset' | 'liability';
    
    // Time period conversion factors (relative to hourly)
    const periodConversionFactors = {
        Hourly: 1,
        Daily: 8, // Assuming 8-hour workday
        Weekly: 40, // Assuming 40-hour workweek
        Fortnightly: 80, // 2 weeks
        Monthly: 160, // ~4 weeks
        Quarterly: 480, // 3 months
        Annual: 1920 // 12 months
    };
    
    // Category definition interface
    interface Category {
        id: number;
        name: string;
        type: CategoryType;
        debitAccount: string;  // Account to be debited
        creditAccount: string; // Account to be credited
        budgetPeriod: TimeframeKey; // The period used for budgeting
        budgetAmount: number; // The amount for the specified period
    }
    
    // Sample categories
    let categories: Category[] = $state([
        { 
            id: 1, 
            name: 'Salary', 
            type: 'income', 
            debitAccount: 'Bank Account',
            creditAccount: 'Salary Income',
            budgetPeriod: 'Monthly',
            budgetAmount: 8000
        },
        { 
            id: 2, 
            name: 'Rent', 
            type: 'expense', 
            debitAccount: 'Bank Account',
            creditAccount: 'Rent Expense',
            budgetPeriod: 'Monthly',
            budgetAmount: 2500
        },
        { 
            id: 3, 
            name: 'Groceries', 
            type: 'expense', 
            debitAccount: 'Credit Card',
            creditAccount: 'Groceries Expense',
            budgetPeriod: 'Weekly',
            budgetAmount: 200
        },
        { 
            id: 4, 
            name: 'Investments', 
            type: 'asset', 
            debitAccount: 'Bank Account',
            creditAccount: 'Investments Asset',
            budgetPeriod: 'Quarterly',
            budgetAmount: 900
        },
        { 
            id: 5, 
            name: 'Credit Card', 
            type: 'liability', 
            debitAccount: 'Bank Account',
            creditAccount: 'Credit Card Liability',
            budgetPeriod: 'Monthly',
            budgetAmount: 1000
        }
    ]);
    
    // Filter categories by type
    let selectedFilter = $state<CategoryType | 'all'>('all');
    
    // Tooltip state
    let showTooltip = $state(false);
    let tooltipCategory: Category | null = $state(null);
    let tooltipX = $state(0);
    let tooltipY = $state(0);
    
    // Check authentication and access rights
    onMount(() => {
        // In a real app, this would check your auth service
        checkAuthentication();
        
        // Load categories from localStorage if available
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
            alert('Access denied. You need proper permissions to view the budget dashboard.');
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
    
    // Save categories to localStorage
    function saveCategoriestoStorage() {
        try {
            localStorage.setItem('budgetCategories', JSON.stringify(categories));
            console.log('Saved categories to storage:', categories);
        } catch (error) {
            console.error('Error saving categories to storage:', error);
        }
    }
    
    // Delete a category
    function deleteCategory(id: number) {
        if (confirm('Are you sure you want to delete this category? This may affect existing transactions.')) {
            categories = categories.filter(category => category.id !== id);
            
            // Save changes to localStorage
            saveCategoriestoStorage();
        }
    }
    
    // Filter categories based on selected type
    function getFilteredCategories() {
        if (selectedFilter === 'all') {
            return categories;
        }
        return categories.filter(category => category.type === selectedFilter);
    }
    
    // Set the filter
    function setFilter(filter: CategoryType | 'all') {
        selectedFilter = filter;
    }
    
    // Navigate to create new category
    function navigateToNewCategory() {
        goto('/budget/categories/new');
    }
    
    // Navigate to edit category
    function navigateToEditCategory(id: number) {
        goto(`/budget/categories/${id}`);
    }
    
    // Calculate budget for all periods based on a given period and amount
    function calculateAllPeriods(amount: number, period: TimeframeKey): Record<TimeframeKey, number> {
        // Handle zero or invalid amounts
        if (!amount || isNaN(amount) || amount < 0) {
            amount = 0;
        }
        
        const hourlyRate = amount / periodConversionFactors[period];
        
        const result: Partial<Record<TimeframeKey, number>> = {};
        
        for (const p of timeframes) {
            // Calculate and round to 2 decimal places for currency
            const calculatedAmount = hourlyRate * periodConversionFactors[p];
            result[p] = parseFloat(calculatedAmount.toFixed(2));
        }
        
        return result as Record<TimeframeKey, number>;
    }
    
    // Get calculated budget for a category
    function getCategoryBudget(category: Category): Record<TimeframeKey, number> {
        return calculateAllPeriods(category.budgetAmount, category.budgetPeriod);
    }
    
    // Calculate totals for each period and category type
    function calculateTotals() {
        // Initialize totals objects for each category type
        const incomeTotals: Record<TimeframeKey, number> = {} as Record<TimeframeKey, number>;
        const expenseTotals: Record<TimeframeKey, number> = {} as Record<TimeframeKey, number>;
        const assetTotals: Record<TimeframeKey, number> = {} as Record<TimeframeKey, number>;
        const liabilityTotals: Record<TimeframeKey, number> = {} as Record<TimeframeKey, number>;
        const netTotals: Record<TimeframeKey, number> = {} as Record<TimeframeKey, number>;
        
        // Initialize all totals to zero
        for (const period of timeframes) {
            incomeTotals[period] = 0;
            expenseTotals[period] = 0;
            assetTotals[period] = 0;
            liabilityTotals[period] = 0;
            netTotals[period] = 0;
        }
        
        // Calculate totals for each category type
        for (const category of getFilteredCategories()) {
            const budgetValues = getCategoryBudget(category);
            
            for (const period of timeframes) {
                const amount = budgetValues[period];
                
                // Add to the appropriate category type total
                if (category.type === 'income') {
                    incomeTotals[period] += amount;
                } else if (category.type === 'expense') {
                    expenseTotals[period] += amount;
                } else if (category.type === 'asset') {
                    assetTotals[period] += amount;
                } else if (category.type === 'liability') {
                    liabilityTotals[period] += amount;
                }
            }
        }
        
        // Calculate net totals (income - expenses)
        for (const period of timeframes) {
            netTotals[period] = incomeTotals[period] - expenseTotals[period];
            
            // Round all totals to 2 decimal places
            incomeTotals[period] = parseFloat(incomeTotals[period].toFixed(2));
            expenseTotals[period] = parseFloat(expenseTotals[period].toFixed(2));
            assetTotals[period] = parseFloat(assetTotals[period].toFixed(2));
            liabilityTotals[period] = parseFloat(liabilityTotals[period].toFixed(2));
            netTotals[period] = parseFloat(netTotals[period].toFixed(2));
        }
        
        return {
            income: incomeTotals,
            expense: expenseTotals,
            asset: assetTotals,
            liability: liabilityTotals,
            net: netTotals
        };
    }
    
    // Get primary account label based on category type
    function getPrimaryAccountLabel(type: CategoryType): string {
        switch (type) {
            case 'income':
                return 'Income Account';
            case 'expense':
                return 'Expense Account';
            case 'asset':
                return 'Asset Account';
            case 'liability':
                return 'Liability Account';
            default:
                return 'Primary Account';
        }
    }
    
    // Get bank account label based on category type
    function getBankAccountLabel(type: CategoryType): string {
        switch (type) {
            case 'income':
            case 'expense':
                return 'Bank Account';
            case 'asset':
                return 'Funding Account';
            case 'liability':
                return 'Payment Account';
            default:
                return 'Bank Account';
        }
    }
    
    // Get primary account for a category
    function getPrimaryAccount(category: Category): string {
        switch (category.type) {
            case 'income':
                return category.creditAccount;
            case 'expense':
                return category.debitAccount;
            case 'asset':
                return category.debitAccount;
            case 'liability':
                return category.creditAccount;
            default:
                return category.debitAccount;
        }
    }
    
    // Get bank account for a category
    function getBankAccount(category: Category): string {
        switch (category.type) {
            case 'income':
                return category.debitAccount;
            case 'expense':
                return category.creditAccount;
            case 'asset':
                return category.creditAccount;
            case 'liability':
                return category.debitAccount;
            default:
                return category.creditAccount;
        }
    }
    
    // Check if a category has both accounts properly configured
    function hasValidAccounts(category: Category): boolean {
        return Boolean(category.debitAccount && category.creditAccount);
    }
    
    // Count categories with missing accounts
    function countCategoriesWithMissingAccounts(): number {
        return getFilteredCategories().filter(category => !hasValidAccounts(category)).length;
    }
    
    // Show tooltip for a category
    function showCategoryTooltip(event: MouseEvent, category: Category) {
        tooltipCategory = category;
        
        // Get the position of the icon
        const iconElement = event.currentTarget as HTMLElement;
        const rect = iconElement.getBoundingClientRect();
        
        // Position the tooltip below the icon
        tooltipX = rect.left;
        tooltipY = rect.bottom + window.scrollY;
        
        showTooltip = true;
    }
    
    // Hide tooltip
    function hideTooltip() {
        showTooltip = false;
    }
</script>

<div class="page-container">
    {#if !isAuthenticated}
        <div class="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to access the category management.</p>
            <button class="btn primary">Log In</button>
        </div>
    {:else if !hasAccess}
        <div class="auth-message">
            <h2>Access Denied</h2>
            <p>You don't have permission to access the category management.</p>
        </div>
    {:else}
        <header class="page-header">
            <div class="header-content">
                <h1>Categories</h1>
                <div class="header-actions">
                    <a href="/budget" class="btn secondary">Back to Dashboard</a>
                    <button class="btn primary" onclick={navigateToNewCategory}>Add Category</button>
                </div>
            </div>
            <p class="header-description">
                Manage your budget categories and their associated accounts. Categories are used to automatically create balanced transactions with just a few clicks.
            </p>
        </header>
        
        <div class="category-tabs">
            <button 
                class="tab-btn {selectedFilter === 'all' ? 'active' : ''}" 
                onclick={() => setFilter('all')}
            >
                All
            </button>
            <button 
                class="tab-btn {selectedFilter === 'income' ? 'active' : ''}" 
                onclick={() => setFilter('income')}
            >
                Income
            </button>
            <button 
                class="tab-btn {selectedFilter === 'expense' ? 'active' : ''}" 
                onclick={() => setFilter('expense')}
            >
                Expense
            </button>
            <button 
                class="tab-btn {selectedFilter === 'asset' ? 'active' : ''}" 
                onclick={() => setFilter('asset')}
            >
                Asset
            </button>
            <button 
                class="tab-btn {selectedFilter === 'liability' ? 'active' : ''}" 
                onclick={() => setFilter('liability')}
            >
                Liability
            </button>
        </div>
        
        <div class="category-list">
            <table class="category-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Accts.</th>
                        {#each timeframes as period}
                            <th class="budget-column">{period}</th>
                        {/each}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each getFilteredCategories() as category}
                        <tr>
                            <td>{category.name}</td>
                            <td class="category-type {category.type}">{category.type}</td>
                            <td class="accounts-column">
                                {#if hasValidAccounts(category)}
                                    <span 
                                        class="account-status complete" 
                                        role="button"
                                        onmouseenter={e => showCategoryTooltip(e, category)}
                                        onmouseleave={hideTooltip}
                                        tabindex="0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </span>
                                {:else}
                                    <span 
                                        class="account-status incomplete" 
                                        role="button"
                                        title="Missing account information"
                                        tabindex="0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                    </span>
                                {/if}
                            </td>
                            {#each timeframes as period}
                                {@const budgetValues = getCategoryBudget(category)}
                                <td class="budget-amount {period === category.budgetPeriod ? 'primary-budget' : ''}">
                                    ${budgetValues[period].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </td>
                            {/each}
                            <td class="actions-cell">
                                <button class="btn small" onclick={() => navigateToEditCategory(category.id)}>Edit</button>
                                <button class="btn small danger" onclick={() => deleteCategory(category.id)}>Delete</button>
                            </td>
                        </tr>
                    {/each}
                    
                    {#if getFilteredCategories().length === 0}
                        <tr>
                            <td colspan="{timeframes.length + 3}" class="no-categories">
                                No categories found. Click "Add Category" to create one.
                            </td>
                        </tr>
                    {:else}
                        {@const totals = calculateTotals()}
                        <tr class="totals-row totals-section">
                            <td colspan="{timeframes.length + 3}" class="totals-section-header">Budget Summary</td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="3" class="totals-label">Total Income</td>
                            {#each timeframes as period}
                                <td class="budget-amount totals-amount positive">
                                    ${totals.income[period].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </td>
                            {/each}
                            <td></td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="3" class="totals-label">Total Expenses</td>
                            {#each timeframes as period}
                                <td class="budget-amount totals-amount negative">
                                    ${totals.expense[period].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </td>
                            {/each}
                            <td></td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="3" class="totals-label">Total Assets</td>
                            {#each timeframes as period}
                                <td class="budget-amount totals-amount asset">
                                    ${totals.asset[period].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </td>
                            {/each}
                            <td></td>
                        </tr>
                        <tr class="totals-row">
                            <td colspan="3" class="totals-label">Total Liabilities</td>
                            {#each timeframes as period}
                                <td class="budget-amount totals-amount liability">
                                    ${totals.liability[period].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </td>
                            {/each}
                            <td></td>
                        </tr>
                        <tr class="totals-row grand-total">
                            <td colspan="3" class="totals-label">Net Budget (Income - Expenses)</td>
                            {#each timeframes as period}
                                <td class="budget-amount totals-amount {totals.net[period] >= 0 ? 'positive' : 'negative'}">
                                    ${totals.net[period].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </td>
                            {/each}
                            <td></td>
                        </tr>
                    {/if}
                </tbody>
            </table>
            
            <div class="table-legend">
                <div class="legend-item">
                    <span class="legend-color"></span> Highlighted cells indicate the primary budget period entered for each category
                </div>
                {#if countCategoriesWithMissingAccounts() > 0}
                    <div class="legend-item warning">
                        <span class="account-status incomplete legend-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </span>
                        {countCategoriesWithMissingAccounts()} {countCategoriesWithMissingAccounts() === 1 ? 'category has' : 'categories have'} missing account information
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<!-- Custom tooltip -->
{#if showTooltip && tooltipCategory}
    <div 
        class="custom-tooltip tooltip-{tooltipCategory.type}" 
        style="left: {tooltipX}px; top: {tooltipY + 5}px;"
    >
        <div class="tooltip-header">
            <span class="tooltip-type">{tooltipCategory.type}</span>
        </div>
        <div class="tooltip-row">
            <span class="tooltip-label">{getPrimaryAccountLabel(tooltipCategory.type)}:</span>
            <span class="tooltip-value">{getPrimaryAccount(tooltipCategory)}</span>
        </div>
        <div class="tooltip-row">
            <span class="tooltip-label">{getBankAccountLabel(tooltipCategory.type)}:</span>
            <span class="tooltip-value">{getBankAccount(tooltipCategory)}</span>
        </div>
    </div>
{/if}

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
    
    .category-tabs {
        display: flex;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid #e9ecef;
    }
    
    .tab-btn {
        padding: 0.75rem 1.25rem;
        background: none;
        border: none;
        cursor: pointer;
        font-weight: 500;
        color: #6c757d;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
    }
    
    .tab-btn:hover {
        color: #495057;
    }
    
    .tab-btn.active {
        color: #007bff;
        border-bottom-color: #007bff;
    }
    
    .category-list {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .category-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .category-table th,
    .category-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
    }
    
    .category-table th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    
    .category-type {
        text-transform: capitalize;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 500;
        display: inline-block;
    }
    
    .category-type.income {
        background-color: #e8f5e9;
        color: #4caf50;
    }
    
    .category-type.expense {
        background-color: #ffebee;
        color: #f44336;
    }
    
    .category-type.asset {
        background-color: #e3f2fd;
        color: #2196f3;
    }
    
    .category-type.liability {
        background-color: #fff8e1;
        color: #ffc107;
    }
    
    .no-categories {
        text-align: center;
        padding: 2rem;
        color: #6c757d;
    }
    
    .actions-cell {
        display: flex;
        gap: 0.5rem;
    }
    
    .budget-amount {
        font-weight: 500;
        text-align: right;
    }
    
    .budget-column {
        text-align: right;
        min-width: 100px;
    }
    
    .primary-budget {
        background-color: rgba(0, 123, 255, 0.05);
        font-weight: 600;
    }
    
    .legend-color {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-color: rgba(0, 123, 255, 0.05);
        border: 1px solid rgba(0, 123, 255, 0.2);
        border-radius: 3px;
        vertical-align: middle;
        margin-right: 8px;
    }
    
    .primary-indicator {
        color: #007bff;
        margin-left: 0.25rem;
    }
    
    .table-legend {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        color: #6c757d;
        background-color: #f8f9fa;
        border-radius: 0 0 8px 8px;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    
    .legend-item.warning {
        color: #f44336;
    }
    
    .legend-icon {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }
    
    .budget-period {
        font-size: 0.875rem;
        color: #6c757d;
        margin-left: 0.5rem;
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
    
    .asset {
        color: #2196f3;
    }
    
    .liability {
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
        .category-list {
            overflow-x: auto;
        }
        
        .category-table {
            min-width: 1000px;
        }
    }
    
    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .category-tabs {
            flex-wrap: wrap;
        }
        
        .tab-btn {
            flex: 1;
            text-align: center;
            padding: 0.5rem;
        }
        
        .actions-cell {
            flex-direction: column;
        }
    }
    
    .accounts-column {
        text-align: center;
    }
    
    .account-status {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        font-weight: bold;
        cursor: help;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .account-status:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .account-status.complete {
        background-color: #e8f5e9;
        color: #4caf50;
        border: 1px solid #4caf50;
    }
    
    .account-status.incomplete {
        background-color: #ffebee;
        color: #f44336;
        border: 1px solid #f44336;
    }
    
    .custom-tooltip {
        position: fixed;
        z-index: 1000;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        padding: 0;
        font-size: 0.875rem;
        max-width: 250px;
        pointer-events: none;
        border: 1px solid #e9ecef;
        animation: tooltip-fade-in 0.2s ease-out;
        overflow: hidden;
    }
    
    .tooltip-header {
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid #e9ecef;
        margin-bottom: 0.5rem;
    }
    
    .tooltip-type {
        text-transform: capitalize;
        font-weight: 600;
    }
    
    .tooltip-income .tooltip-header {
        background-color: #e8f5e9;
        color: #4caf50;
    }
    
    .tooltip-expense .tooltip-header {
        background-color: #ffebee;
        color: #f44336;
    }
    
    .tooltip-asset .tooltip-header {
        background-color: #e3f2fd;
        color: #2196f3;
    }
    
    .tooltip-liability .tooltip-header {
        background-color: #fff8e1;
        color: #ffc107;
    }
    
    .tooltip-row {
        margin-bottom: 0.5rem;
        display: flex;
        align-items: baseline;
        padding: 0 0.75rem;
    }
    
    .tooltip-row:last-child {
        margin-bottom: 0.75rem;
    }
    
    .tooltip-label {
        color: #6c757d;
        margin-right: 0.5rem;
        white-space: nowrap;
    }
    
    .tooltip-value {
        font-weight: bold;
        color: #212529;
    }
    
    @keyframes tooltip-fade-in {
        from {
            opacity: 0;
            transform: translateY(5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .custom-tooltip::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 10px;
        width: 10px;
        height: 10px;
        background-color: #fff;
        border-left: 1px solid #e9ecef;
        border-top: 1px solid #e9ecef;
        transform: rotate(45deg);
    }
</style> 
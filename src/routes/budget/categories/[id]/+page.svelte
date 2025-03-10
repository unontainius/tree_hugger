<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    
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
    
    // Sample categories - in a real app, this would be fetched from your backend
    let sampleCategories: Category[] = $state([
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
            debitAccount: 'Rent Expense',
            creditAccount: 'Bank Account',
            budgetPeriod: 'Monthly',
            budgetAmount: 2500
        },
        { 
            id: 3, 
            name: 'Groceries', 
            type: 'expense', 
            debitAccount: 'Groceries Expense',
            creditAccount: 'Credit Card',
            budgetPeriod: 'Weekly',
            budgetAmount: 200
        },
        { 
            id: 4, 
            name: 'Investments', 
            type: 'asset', 
            debitAccount: 'Investments',
            creditAccount: 'Bank Account',
            budgetPeriod: 'Quarterly',
            budgetAmount: 900
        },
        { 
            id: 5, 
            name: 'Credit Card', 
            type: 'liability', 
            debitAccount: 'Bank Account',
            creditAccount: 'Credit Card',
            budgetPeriod: 'Monthly',
            budgetAmount: 1000
        }
    ]);
    
    // Category form
    let categoryForm = $state({
        id: 0,
        name: '',
        type: 'expense' as CategoryType,
        primaryAccount: '', // This will be mapped to debit or credit based on type
        bankAccount: '',    // This will be mapped to debit or credit based on type
        budget: {
            period: 'Monthly' as TimeframeKey,
            amount: 0
        }
    });
    
    // Available accounts for double-entry
    let accounts = [
        'Cash', 'Bank Account', 'Credit Card', 'Accounts Receivable', 'Accounts Payable',
        'Salary Income', 'Investment Income', 'Housing Expense', 'Utilities Expense',
        'Groceries Expense', 'Transportation Expense', 'Entertainment Expense',
        'Healthcare Expense', 'Debt Expense', 'Savings'
    ];
    
    // Store calculated budget amounts for display
    let calculatedBudgets: Record<TimeframeKey, number> = $state({} as Record<TimeframeKey, number>);
    
    // Page mode (new or edit)
    let isNewCategory = $state(true);
    let pageTitle = $state('Add Category');
    
    // Check authentication and access rights
    onMount(() => {
        // In a real app, this would check your auth service
        checkAuthentication();
        
        // Load categories from localStorage if available
        loadCategoriesFromStorage();
        
        // Get category ID from URL
        const categoryId = $page.params.id;
        
        if (categoryId === 'new') {
            isNewCategory = true;
            pageTitle = 'Add Category';
            
            // Initialize with default values
            categoryForm = {
                id: 0,
                name: '',
                type: 'expense',
                primaryAccount: '',
                bankAccount: '',
                budget: {
                    period: 'Monthly',
                    amount: 0
                }
            };
            
            // Initialize calculated budgets
            calculatedBudgets = calculateAllPeriods(0, 'Monthly');
        } else {
            isNewCategory = false;
            pageTitle = 'Edit Category';
            
            // Find category by ID
            const categoryId = parseInt($page.params.id);
            const category = sampleCategories.find(c => c.id === categoryId);
            
            if (category) {
                // Map debit/credit accounts to primary/bank accounts based on category type
                const { primaryAccount, bankAccount } = mapAccountsForEditing(category);
                
                // Initialize form with category values
                categoryForm = {
                    id: category.id,
                    name: category.name,
                    type: category.type,
                    primaryAccount: primaryAccount,
                    bankAccount: bankAccount,
                    budget: {
                        period: category.budgetPeriod,
                        amount: category.budgetAmount
                    }
                };
                
                // Initialize calculated budgets based on the category's budget period and amount
                calculatedBudgets = calculateAllPeriods(category.budgetAmount, category.budgetPeriod);
            } else {
                // Category not found, redirect to list
                alert('Category not found');
                goto('/budget/categories');
            }
        }
    });
    
    // Load categories from localStorage
    function loadCategoriesFromStorage() {
        try {
            const storedCategories = localStorage.getItem('budgetCategories');
            if (storedCategories) {
                sampleCategories = JSON.parse(storedCategories);
                console.log('Loaded categories from storage:', sampleCategories);
            }
        } catch (error) {
            console.error('Error loading categories from storage:', error);
        }
    }
    
    // Save categories to localStorage
    function saveCategoriestoStorage() {
        try {
            localStorage.setItem('budgetCategories', JSON.stringify(sampleCategories));
            console.log('Saved categories to storage:', sampleCategories);
        } catch (error) {
            console.error('Error saving categories to storage:', error);
        }
    }
    
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
    
    // Calculate budget for all periods based on the entered period
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
    
    // Update budget amounts when period or amount changes
    function updateBudgetAmounts() {
        const { period, amount } = categoryForm.budget;
        const allPeriods = calculateAllPeriods(amount, period);
        
        // Display calculated amounts in the form
        calculatedBudgets = allPeriods;
    }
    
    // Handle period change
    function handlePeriodChange() {
        updateBudgetAmounts();
    }
    
    // Handle amount input
    function handleAmountInput() {
        updateBudgetAmounts();
    }
    
    // Save category
    function saveCategory() {
        if (categoryForm.name.trim() === '') {
            alert('Please enter a category name');
            return;
        }
        
        if (categoryForm.primaryAccount.trim() === '') {
            alert('Please select a primary account');
            return;
        }
        
        if (categoryForm.bankAccount.trim() === '') {
            alert('Please select a bank account');
            return;
        }
        
        // Determine which account should be debit and which should be credit based on category type
        let debitAccount: string;
        let creditAccount: string;
        
        switch (categoryForm.type) {
            case 'income':
                // For income: Bank account is debited, income account is credited
                debitAccount = categoryForm.bankAccount;
                creditAccount = categoryForm.primaryAccount;
                break;
            case 'expense':
                // For expense: Expense account is debited, bank account is credited
                debitAccount = categoryForm.primaryAccount;
                creditAccount = categoryForm.bankAccount;
                break;
            case 'asset':
                // For asset: Asset account is debited, bank account is credited
                debitAccount = categoryForm.primaryAccount;
                creditAccount = categoryForm.bankAccount;
                break;
            case 'liability':
                // For liability: Bank account is debited, liability account is credited
                debitAccount = categoryForm.bankAccount;
                creditAccount = categoryForm.primaryAccount;
                break;
            default:
                debitAccount = categoryForm.primaryAccount;
                creditAccount = categoryForm.bankAccount;
        }
        
        // In a real app, you would send this to your backend
        const updatedCategory: Category = {
            id: isNewCategory ? Date.now() : categoryForm.id,
            name: categoryForm.name,
            type: categoryForm.type,
            debitAccount: debitAccount,
            creditAccount: creditAccount,
            budgetPeriod: categoryForm.budget.period,
            budgetAmount: categoryForm.budget.amount
        };
        
        // Log for debugging
        console.log('Saving category with budget:', {
            period: updatedCategory.budgetPeriod,
            amount: updatedCategory.budgetAmount,
            debitAccount: updatedCategory.debitAccount,
            creditAccount: updatedCategory.creditAccount
        });
        
        // Update the sampleCategories array
        const categoryIndex = sampleCategories.findIndex(c => c.id === updatedCategory.id);
        if (categoryIndex >= 0) {
            sampleCategories[categoryIndex] = updatedCategory;
        } else if (isNewCategory) {
            sampleCategories.push(updatedCategory);
        }
        
        // Save to localStorage
        saveCategoriestoStorage();
        
        // For demo purposes, just show a success message
        alert(`Category ${isNewCategory ? 'created' : 'updated'} successfully!`);
        
        // Navigate back to the list
        goto('/budget/categories');
    }
    
    // Cancel and go back to list
    function cancelEdit() {
        goto('/budget/categories');
    }
    
    // When editing an existing category, map debit/credit accounts to primary/bank accounts
    function mapAccountsForEditing(category: Category) {
        let primaryAccount: string;
        let bankAccount: string;
        
        switch (category.type) {
            case 'income':
                // For income: Bank account is debited, income account is credited
                bankAccount = category.debitAccount;
                primaryAccount = category.creditAccount;
                break;
            case 'expense':
                // For expense: Expense account is debited, bank account is credited
                primaryAccount = category.debitAccount;
                bankAccount = category.creditAccount;
                break;
            case 'asset':
                // For asset: Asset account is debited, bank account is credited
                primaryAccount = category.debitAccount;
                bankAccount = category.creditAccount;
                break;
            case 'liability':
                // For liability: Bank account is debited, liability account is credited
                bankAccount = category.debitAccount;
                primaryAccount = category.creditAccount;
                break;
            default:
                primaryAccount = category.debitAccount;
                bankAccount = category.creditAccount;
        }
        
        return { primaryAccount, bankAccount };
    }
    
    // Get primary account label based on category type
    function getPrimaryAccountLabel(): string {
        switch (categoryForm.type) {
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
    function getBankAccountLabel(): string {
        switch (categoryForm.type) {
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
    
    // Handle category type change
    function handleCategoryTypeChange() {
        // The labels will update automatically through the getPrimaryAccountLabel and getBankAccountLabel functions
        // This function is called when the category type changes
        console.log(`Category type changed to: ${categoryForm.type}`);
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
                <h1>{pageTitle}</h1>
                <div class="header-actions">
                    <button class="btn secondary" onclick={cancelEdit}>Cancel</button>
                    <button class="btn primary" onclick={saveCategory}>Save Category</button>
                </div>
            </div>
        </header>
        
        <div class="category-form-container">
            <div class="form-section">
                <h2>Basic Information</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="category-name">Category Name</label>
                        <input type="text" id="category-name" bind:value={categoryForm.name} placeholder="Enter category name" />
                    </div>
                    
                    <div class="form-group">
                        <label for="category-type">Category Type</label>
                        <select id="category-type" bind:value={categoryForm.type} onchange={handleCategoryTypeChange}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="asset">Asset</option>
                            <option value="liability">Liability</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="primary-account">{getPrimaryAccountLabel()}</label>
                        <select id="primary-account" bind:value={categoryForm.primaryAccount}>
                            <option value="">Select Account</option>
                            {#each accounts as account}
                                <option value={account}>{account}</option>
                            {/each}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="bank-account">{getBankAccountLabel()}</label>
                        <select id="bank-account" bind:value={categoryForm.bankAccount}>
                            <option value="">Select Account</option>
                            {#each accounts as account}
                                <option value={account}>{account}</option>
                            {/each}
                        </select>
                    </div>
                </div>
                
                <div class="help-text">
                    <p>Select the appropriate accounts for this category:</p>
                    <ul>
                        <li><strong>Income:</strong> Money you receive (e.g., Salary, Interest). The system will credit your Primary Account and debit your Bank Account.</li>
                        <li><strong>Expense:</strong> Money you spend (e.g., Rent, Groceries). The system will debit your Primary Account and credit your Bank Account.</li>
                        <li><strong>Asset:</strong> Things you own (e.g., Investments, Property). The system will debit your Primary Account and credit your Bank Account.</li>
                        <li><strong>Liability:</strong> Money you owe (e.g., Credit Card, Loan). The system will credit your Primary Account and debit your Bank Account.</li>
                    </ul>
                </div>
            </div>
            
            <div class="form-section">
                <h2>Budget Information</h2>
                
                <div class="form-group">
                    <label>Budget Amount</label>
                    <div class="budget-input">
                        <select 
                            bind:value={categoryForm.budget.period}
                            onchange={handlePeriodChange}
                        >
                            {#each timeframes as period}
                                <option value={period}>{period}</option>
                            {/each}
                        </select>
                        <div class="amount-input">
                            <span class="currency-symbol">$</span>
                            <input 
                                type="number" 
                                bind:value={categoryForm.budget.amount} 
                                oninput={handleAmountInput}
                                min="0" 
                                step="0.01" 
                                placeholder="Enter amount" 
                            />
                        </div>
                    </div>
                    
                    <div class="calculated-budgets">
                        <h4>Calculated Budget Amounts:</h4>
                        <div class="budget-grid">
                            {#each timeframes as period}
                                {#if period !== categoryForm.budget.period}
                                    <div class="budget-period">
                                        <span class="period-label">{period}:</span>
                                        <span class="period-amount">${calculatedBudgets[period]?.toFixed(2) || '0.00'}</span>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn secondary" onclick={cancelEdit}>Cancel</button>
                <button class="btn primary" onclick={saveCategory}>Save Category</button>
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
    
    .header-actions {
        display: flex;
        gap: 1rem;
    }
    
    .category-form-container {
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
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
        color: #343a40;
    }
    
    .form-row {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .form-group {
        flex: 1 1 200px;
        min-width: 0;
        margin-bottom: 1.5rem;
    }
    
    .form-row .form-group {
        margin-bottom: 0;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .form-group input,
    .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    .toggle-switch {
        position: relative;
        height: 46px;
        border-radius: 4px;
        border: 1px solid #ced4da;
        display: flex;
        overflow: hidden;
        margin-top: 0.5rem;
    }
    
    .toggle-input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .toggle-label {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: 500;
        padding: 0.75rem;
        z-index: 1;
        transition: color 0.2s;
        user-select: none;
    }
    
    .toggle-slider {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 50%;
        background-color: #4285f4;
        transition: transform 0.3s ease;
        z-index: 0;
    }
    
    #debit-option:checked ~ .toggle-slider {
        transform: translateX(0);
    }
    
    #credit-option:checked ~ .toggle-slider {
        transform: translateX(100%);
    }
    
    #debit-option:checked ~ .toggle-label-left,
    #credit-option:checked ~ .toggle-label-right {
        color: white;
    }
    
    #debit-option:not(:checked) ~ .toggle-label-left,
    #credit-option:not(:checked) ~ .toggle-label-right {
        color: #495057;
    }
    
    .help-text {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #f8f9fa;
        border-radius: 4px;
        font-size: 0.875rem;
    }
    
    .help-text p {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }
    
    .help-text ul {
        margin: 0;
        padding-left: 1.5rem;
    }
    
    .budget-input {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .budget-input select {
        width: 150px;
    }
    
    .amount-input {
        flex: 1;
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
        width: 100%;
        padding: 0.75rem;
        padding-left: 1.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    .calculated-budgets {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 4px;
        margin-top: 1rem;
    }
    
    .calculated-budgets h4 {
        margin-top: 0;
        margin-bottom: 0.75rem;
        font-size: 1rem;
    }
    
    .budget-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 0.75rem;
    }
    
    .budget-period {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
    }
    
    .period-label {
        color: #6c757d;
    }
    
    .period-amount {
        font-weight: 500;
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
            gap: 1.5rem;
        }
        
        .form-row .form-group {
            margin-bottom: 0;
        }
        
        .radio-group {
            flex-direction: row;
            gap: 1.5rem;
        }
        
        .toggle-switch {
            height: 42px;
        }
        
        .toggle-label {
            padding: 0.5rem;
            font-size: 0.9rem;
        }
        
        .budget-input {
            flex-direction: column;
        }
        
        .budget-input select {
            width: 100%;
        }
    }
</style> 
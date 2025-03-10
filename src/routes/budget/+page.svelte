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
    let selectedTimeframe = $state<TimeframeKey>('Monthly');
    
    // Sample budget data - in a real app, this would come from your backend
    let budgetData = {
        income: {
            budgeted: {
                Hourly: 50,
                Daily: 400,
                Weekly: 2000,
                Fortnightly: 4000,
                Monthly: 8000,
                Quarterly: 24000,
                Annual: 96000
            },
            actual: {
                Hourly: 45,
                Daily: 360,
                Weekly: 1800,
                Fortnightly: 3600,
                Monthly: 7200,
                Quarterly: 21600,
                Annual: 86400
            },
            categories: [
                { name: 'Salary', budgeted: 7500, actual: 7500 },
                { name: 'Investments', budgeted: 300, actual: 250 },
                { name: 'Side Hustle', budgeted: 200, actual: 0 }
            ]
        },
        expenses: {
            budgeted: {
                Hourly: 40,
                Daily: 320,
                Weekly: 1600,
                Fortnightly: 3200,
                Monthly: 6400,
                Quarterly: 19200,
                Annual: 76800
            },
            actual: {
                Hourly: 42,
                Daily: 336,
                Weekly: 1680,
                Fortnightly: 3360,
                Monthly: 6720,
                Quarterly: 20160,
                Annual: 80640
            },
            categories: [
                { name: 'Housing', budgeted: 2500, actual: 2500 },
                { name: 'Utilities', budgeted: 400, actual: 450 },
                { name: 'Groceries', budgeted: 800, actual: 920 },
                { name: 'Transportation', budgeted: 600, actual: 550 },
                { name: 'Entertainment', budgeted: 400, actual: 500 },
                { name: 'Healthcare', budgeted: 300, actual: 200 },
                { name: 'Debt Payments', budgeted: 1000, actual: 1000 },
                { name: 'Savings', budgeted: 400, actual: 600 }
            ]
        }
    };
    
    // Define transaction types
    interface TransactionEntry {
        account: string;
        debit: number;
        credit: number;
    }
    
    interface Transaction {
        id: number;
        date: string;
        description: string;
        entries: TransactionEntry[];
        amount: number;
    }
    
    interface TransactionForm {
        date: string;
        description: string;
        amount: number;
        entries: TransactionEntry[];
    }
    
    // Category types
    type CategoryType = 'income' | 'expense' | 'asset' | 'liability';
    
    // Category definition interface
    interface Category {
        id: number;
        name: string;
        type: CategoryType;
        balancingAccount: string;
        isDebit: boolean; // true if this category is typically debited, false if credited
    }
    
    // Sample categories - will be managed in the categories page
    let categories: Category[] = $state([
        { id: 1, name: 'Salary', type: 'income', balancingAccount: 'Bank Account', isDebit: false },
        { id: 2, name: 'Rent', type: 'expense', balancingAccount: 'Bank Account', isDebit: true },
        { id: 3, name: 'Groceries', type: 'expense', balancingAccount: 'Credit Card', isDebit: true },
        { id: 4, name: 'Investments', type: 'asset', balancingAccount: 'Bank Account', isDebit: true },
        { id: 5, name: 'Credit Card', type: 'liability', balancingAccount: 'Bank Account', isDebit: false }
    ]);
    
    // Transaction history
    let transactions: Transaction[] = $state([]);
    
    // Transaction entry form
    let transactionForm: TransactionForm = $state({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        entries: [
            { account: '', debit: 0, credit: 0 },
            { account: '', debit: 0, credit: 0 }
        ]
    });
    
    // Selected category for transaction
    let selectedCategory: Category | null = $state(null);
    
    // Handle category selection for transaction
    function selectCategory(category: Category) {
        selectedCategory = category;
        
        // Reset entries
        const amount = transactionForm.amount || 0;
        
        // Create entries based on the selected category
        if (category.isDebit) {
            transactionForm.entries = [
                { account: category.name, debit: amount, credit: 0 },
                { account: category.balancingAccount, debit: 0, credit: amount }
            ];
        } else {
            transactionForm.entries = [
                { account: category.name, debit: 0, credit: amount },
                { account: category.balancingAccount, debit: amount, credit: 0 }
            ];
        }
    }
    
    // Update transaction amount
    function updateTransactionAmount(amount: number) {
        transactionForm.amount = amount;
        
        // If a category is selected, update the entries
        if (selectedCategory) {
            if (selectedCategory.isDebit) {
                transactionForm.entries[0].debit = amount;
                transactionForm.entries[1].credit = amount;
            } else {
                transactionForm.entries[0].credit = amount;
                transactionForm.entries[1].debit = amount;
            }
        }
    }
    
    // Available accounts for double-entry
    let accounts = [
        'Cash', 'Bank Account', 'Credit Card', 'Accounts Receivable', 'Accounts Payable',
        'Salary Income', 'Investment Income', 'Housing Expense', 'Utilities Expense',
        'Groceries Expense', 'Transportation Expense', 'Entertainment Expense',
        'Healthcare Expense', 'Debt Expense', 'Savings'
    ];
    
    // Check authentication and access rights
    onMount(() => {
        // In a real app, this would check your auth service
        checkAuthentication();
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
    
    // Calculate budget summary
    function calculateSummary(type: 'income' | 'expenses') {
        const budgeted = budgetData[type].budgeted[selectedTimeframe];
        const actual = budgetData[type].actual[selectedTimeframe];
        const difference = budgeted - actual;
        const percentageUsed = (actual / budgeted) * 100;
        
        return {
            budgeted,
            actual,
            difference,
            percentageUsed
        };
    }
    
    // Add a new transaction entry row
    function addTransactionEntry() {
        transactionForm.entries = [
            ...transactionForm.entries,
            { account: '', debit: 0, credit: 0 }
        ];
        
        // Clear selected category when manually adding entries
        selectedCategory = null;
    }
    
    // Remove a transaction entry row
    function removeTransactionEntry(index: number) {
        transactionForm.entries = transactionForm.entries.filter((_, i) => i !== index);
    }
    
    // Calculate transaction balance (debits should equal credits)
    function calculateBalance() {
        const totalDebits = transactionForm.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
        const totalCredits = transactionForm.entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
        return totalDebits - totalCredits;
    }
    
    // Submit transaction
    function submitTransaction() {
        const balance = calculateBalance();
        
        if (balance !== 0) {
            alert(`Transaction is not balanced. Difference: ${balance}`);
            return;
        }
        
        if (transactionForm.description.trim() === '') {
            alert('Please enter a description for the transaction');
            return;
        }
        
        if (transactionForm.entries.some(entry => entry.account === '')) {
            alert('Please select an account for all entries');
            return;
        }
        
        // In a real app, you would send this to your backend
        const newTransaction = {
            id: Date.now(),
            date: transactionForm.date,
            description: transactionForm.description,
            entries: [...transactionForm.entries],
            amount: transactionForm.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0)
        };
        
        transactions = [newTransaction, ...transactions];
        
        // Reset form
        transactionForm = {
            date: new Date().toISOString().split('T')[0],
            description: '',
            amount: 0,
            entries: [
                { account: '', debit: 0, credit: 0 },
                { account: '', debit: 0, credit: 0 }
            ]
        };
        
        // Clear selected category
        selectedCategory = null;
    }
    
    // Update entry amount (ensure only debit OR credit has a value)
    function updateEntryAmount(index: number, field: 'debit' | 'credit', value: string) {
        const numValue = parseFloat(value) || 0;
        
        if (field === 'debit' && numValue > 0) {
            transactionForm.entries[index].credit = 0;
            transactionForm.entries[index].debit = numValue;
        } else if (field === 'credit' && numValue > 0) {
            transactionForm.entries[index].debit = 0;
            transactionForm.entries[index].credit = numValue;
        }
    }
</script>

<div class="page-container">
    {#if !isAuthenticated}
        <div class="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to access the budget dashboard.</p>
            <button class="btn primary">Log In</button>
        </div>
    {:else if !hasAccess}
        <div class="auth-message">
            <h2>Access Denied</h2>
            <p>You don't have permission to access the budget dashboard.</p>
        </div>
    {:else}
        <header class="dashboard-header">
            <h1>Budget Dashboard</h1>
            <div class="header-actions">
                <div class="timeframe-selector">
                    <label for="timeframe">Timeframe:</label>
                    <select id="timeframe" bind:value={selectedTimeframe}>
                        {#each timeframes as timeframe}
                            <option value={timeframe}>{timeframe}</option>
                        {/each}
                    </select>
                </div>
                <div class="dashboard-actions">
                    <a href="/budget/categories" class="btn secondary">Manage Categories</a>
                    <a href="/budget/transactions" class="btn secondary">View Transactions</a>
                    <a href="/budget/accounts" class="btn secondary">Manage Accounts</a>
                </div>
            </div>
        </header>
        
        <div class="dashboard-grid">
            <!-- Summary Cards -->
            <div class="summary-section">
                <div class="summary-card income">
                    <h3>Income</h3>
                    <div class="summary-details">
                        <div class="summary-row">
                            <span>Budgeted:</span>
                            <span class="amount">${calculateSummary('income').budgeted.toLocaleString()}</span>
                        </div>
                        <div class="summary-row">
                            <span>Actual:</span>
                            <span class="amount">${calculateSummary('income').actual.toLocaleString()}</span>
                        </div>
                        <div class="summary-row">
                            <span>Difference:</span>
                            <span class="amount" class:positive={calculateSummary('income').difference >= 0} class:negative={calculateSummary('income').difference < 0}>
                                ${calculateSummary('income').difference.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: {calculateSummary('income').percentageUsed}%"></div>
                    </div>
                    <div class="percentage">{calculateSummary('income').percentageUsed.toFixed(1)}% of budget</div>
                </div>
                
                <div class="summary-card expenses">
                    <h3>Expenses</h3>
                    <div class="summary-details">
                        <div class="summary-row">
                            <span>Budgeted:</span>
                            <span class="amount">${calculateSummary('expenses').budgeted.toLocaleString()}</span>
                        </div>
                        <div class="summary-row">
                            <span>Actual:</span>
                            <span class="amount">${calculateSummary('expenses').actual.toLocaleString()}</span>
                        </div>
                        <div class="summary-row">
                            <span>Difference:</span>
                            <span class="amount" class:positive={calculateSummary('expenses').difference >= 0} class:negative={calculateSummary('expenses').difference < 0}>
                                ${calculateSummary('expenses').difference.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: {calculateSummary('expenses').percentageUsed}%"></div>
                    </div>
                    <div class="percentage">{calculateSummary('expenses').percentageUsed.toFixed(1)}% of budget</div>
                </div>
                
                <div class="summary-card net">
                    <h3>Net Budget</h3>
                    <div class="summary-details">
                        <div class="summary-row">
                            <span>Budgeted:</span>
                            <span class="amount">
                                ${(calculateSummary('income').budgeted - calculateSummary('expenses').budgeted).toLocaleString()}
                            </span>
                        </div>
                        <div class="summary-row">
                            <span>Actual:</span>
                            <span class="amount">
                                ${(calculateSummary('income').actual - calculateSummary('expenses').actual).toLocaleString()}
                            </span>
                        </div>
                        <div class="summary-row">
                            <span>Difference:</span>
                            <span class="amount ${(calculateSummary('income').actual - calculateSummary('expenses').actual) - 
                                (calculateSummary('income').budgeted - calculateSummary('expenses').budgeted) >= 0 ? 'positive' : 'negative'}">
                                ${((calculateSummary('income').actual - calculateSummary('expenses').actual) - 
                                (calculateSummary('income').budgeted - calculateSummary('expenses').budgeted)).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            
            <!-- Quick Actions Section -->
            <div class="quick-actions-section">
                <h3>Quick Actions</h3>
                <div class="quick-actions-container">
                    <a href="/budget/transactions/new" class="action-card">
                        <div class="action-icon">➕</div>
                        <div class="action-content">
                            <h4>Add New Transaction</h4>
                            <p>Record income, expenses, transfers, or adjustments</p>
                        </div>
                    </a>
                    <a href="/budget/categories/new" class="action-card">
                        <div class="action-icon">📋</div>
                        <div class="action-content">
                            <h4>Create Category</h4>
                            <p>Add a new budget category</p>
                        </div>
                    </a>
                    <a href="/budget/accounts/new" class="action-card">
                        <div class="action-icon">💼</div>
                        <div class="action-content">
                            <h4>Create Account</h4>
                            <p>Add a new financial account</p>
                        </div>
                    </a>
                    <a href="/budget/reconcile" class="action-card">
                        <div class="action-icon">🔄</div>
                        <div class="action-content">
                            <h4>Reconcile Account</h4>
                            <p>Match your budget with bank statements</p>
                        </div>
                    </a>
                </div>
            </div>
            
            <!-- Recent Transactions -->
            <div class="transactions-history">
                <h3>Recent Transactions</h3>
                {#if transactions.length === 0}
                    <p class="no-transactions">No transactions recorded yet.</p>
                {:else}
                    <table class="transactions-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each transactions as transaction}
                                <tr>
                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td>{transaction.description}</td>
                                    <td>${transaction.amount.toLocaleString()}</td>
                                    <td>
                                        <button class="btn small">View</button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {/if}
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
    
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e9ecef;
    }
    
    .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .timeframe-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .timeframe-selector select {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ced4da;
    }
    
    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    /* Summary Cards */
    .summary-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .summary-card {
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .summary-card h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.25rem;
    }
    
    .summary-card.income {
        background-color: #e8f5e9;
        border-left: 4px solid #4caf50;
    }
    
    .summary-card.expenses {
        background-color: #ffebee;
        border-left: 4px solid #f44336;
    }
    
    .summary-card.net {
        background-color: #e3f2fd;
        border-left: 4px solid #2196f3;
    }
    
    .summary-details {
        margin-bottom: 1rem;
    }
    
    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
    
    .amount {
        font-weight: 600;
    }
    
    .positive {
        color: #4caf50;
    }
    
    .negative {
        color: #f44336;
    }
    
    .progress-bar {
        height: 8px;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }
    
    .progress {
        height: 100%;
        background-color: #2196f3;
    }
    
    .percentage {
        font-size: 0.875rem;
        text-align: right;
        color: #6c757d;
    }
    
    /* Transaction Entry Form */
    .transaction-section {
        margin-bottom: 2rem;
    }
    
    .transaction-form {
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .form-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .form-group {
        flex: 1;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
    }
    
    .form-group input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
    }
    
    .category-selection {
        margin-bottom: 1rem;
    }
    
    .category-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .category-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        background-color: #f8f9fa;
        cursor: pointer;
        font-size: 0.875rem;
    }
    
    .category-btn.selected {
        border-color: #007bff;
        background-color: #e3f2fd;
    }
    
    .category-btn.income {
        border-left: 3px solid #4caf50;
    }
    
    .category-btn.expense {
        border-left: 3px solid #f44336;
    }
    
    .category-btn.asset {
        border-left: 3px solid #2196f3;
    }
    
    .category-btn.liability {
        border-left: 3px solid #ffc107;
    }
    
    .double-entry-table {
        margin-bottom: 1rem;
    }
    
    .double-entry-table table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .double-entry-table th,
    .double-entry-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
    }
    
    .double-entry-table th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }
    
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
    
    .btn.primary:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }
    
    .btn.danger {
        background-color: #dc3545;
        color: white;
    }
    
    .btn.danger:hover {
        background-color: #c82333;
    }
    
    .btn.secondary {
        background-color: #6c757d;
        color: white;
        text-decoration: none;
    }
    
    .btn.secondary:hover {
        background-color: #5a6268;
    }
    
    .transactions-history {
        margin-bottom: 2rem;
    }
    
    .transactions-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .transactions-table th,
    .transactions-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
    }
    
    .transactions-table th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    
    .no-transactions {
        text-align: center;
        padding: 2rem;
        color: #6c757d;
        background-color: #f8f9fa;
        border-radius: 4px;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .form-row {
            flex-direction: column;
        }
        
        .categories-section {
            grid-template-columns: 1fr;
        }
    }
    
    /* Quick Actions Section */
    .quick-actions-section {
        margin-bottom: 2rem;
    }
    
    .quick-actions-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .action-card {
        display: flex;
        align-items: center;
        padding: 1.5rem;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        text-decoration: none;
        color: inherit;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .action-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }
    
    .action-icon {
        font-size: 2rem;
        margin-right: 1.5rem;
        color: #007bff;
    }
    
    .action-content h4 {
        margin: 0 0 0.5rem 0;
        color: #343a40;
    }
    
    .action-content p {
        margin: 0;
        color: #6c757d;
        font-size: 0.875rem;
    }
</style>


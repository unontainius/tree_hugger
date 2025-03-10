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
    
    // Transaction entry interface
    interface TransactionEntry {
        category: number; // Category ID
        account: string;
        debit: number;
        credit: number;
    }
    
    // Transaction types
    type TransactionType = 'income' | 'expense' | 'transfer' | 'adjustment' | 'reconciliation';
    
    // Transaction interface
    interface Transaction {
        id: number;
        date: string;
        description: string;
        type: TransactionType;
        entries: TransactionEntry[];
        amount: number;
        adjustmentFor?: number;
        isNegativeAdjustment?: boolean;
        reconciled?: boolean;
    }
    
    // Category types
    type CategoryType = 'income' | 'expense' | 'asset' | 'liability';
    
    // Category definition interface
    interface Category {
        id: number;
        name: string;
        type: CategoryType;
        debitAccount: string;  // Account to be debited
        creditAccount: string; // Account to be credited
        budgetPeriod: string;
        budgetAmount: number;
    }
    
    // Reconciliation transaction form
    interface ReconciliationTransaction {
        date: string;
        description: string;
        amount: number;
        isDeposit: boolean;
        category: number;
        reconciled: boolean;
    }
    
    // All accounts from localStorage
    let accounts: Account[] = $state([]);
    
    // Bank accounts only (filtered from all accounts)
    let bankAccounts: Account[] = $state([]);
    
    // Selected account for reconciliation
    let selectedAccountId = $state(0);
    
    // Transactions array
    let transactions: Transaction[] = $state([]);
    
    // Categories array
    let categories: Category[] = $state([]);
    
    // New transactions for reconciliation
    let reconciliationTransactions: ReconciliationTransaction[] = $state([]);
    
    // Statement balance and date
    let statementBalance = $state(0);
    let statementDate = $state(new Date().toISOString().split('T')[0]);
    
    // Current balance (calculated)
    let currentBalance = $state(0);
    
    // Account transactions (filtered for selected account)
    let accountTransactions: Transaction[] = $state([]);
    
    // Check authentication and access rights
    onMount(() => {
        // In a real app, this would check your auth service
        checkAuthentication();
        
        // Load accounts from localStorage
        loadAccountsFromStorage();
        
        // Load transactions from localStorage
        loadTransactionsFromStorage();
        
        // Load categories from localStorage
        loadCategoriesFromStorage();
        
        // Add an empty transaction row to start
        addEmptyTransaction();
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
            alert('Access denied. You need proper permissions to reconcile accounts.');
            goto('/');
        }
    }
    
    // Load accounts from localStorage
    function loadAccountsFromStorage() {
        try {
            const storedAccountsData = localStorage.getItem('budgetAccounts');
            
            if (storedAccountsData) {
                accounts = JSON.parse(storedAccountsData);
                console.log('Loaded accounts from storage:', accounts);
                
                // Filter for bank accounts (assets and liabilities)
                bankAccounts = accounts.filter(account => 
                    (account.type === 'asset' || account.type === 'liability') && 
                    account.isActive
                );
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
    
    // Handle account selection change
    function handleAccountChange() {
        if (selectedAccountId > 0) {
            calculateCurrentBalance();
        }
    }
    
    // Calculate current balance for the selected account
    function calculateCurrentBalance() {
        if (selectedAccountId === 0) {
            currentBalance = 0;
            return;
        }
        
        const selectedAccount = accounts.find(a => a.id === selectedAccountId);
        if (selectedAccount) {
            // Get the account name to match in transaction entries
            const accountName = selectedAccount.name;
            
            // Calculate balance from transactions
            let balance = 0;
            
            for (const transaction of transactions) {
                for (const entry of transaction.entries) {
                    if (entry.account === accountName) {
                        // For asset accounts: debits increase, credits decrease
                        // For liability accounts: credits increase, debits decrease
                        if (selectedAccount.type === 'asset') {
                            balance += entry.debit - entry.credit;
                        } else if (selectedAccount.type === 'liability') {
                            balance += entry.credit - entry.debit;
                        }
                    }
                }
            }
            
            currentBalance = balance;
            
            // Filter transactions for this account
            accountTransactions = transactions.filter(transaction => 
                transaction.entries.some(entry => entry.account === accountName)
            ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
    }
    
    // Add an empty transaction row
    function addEmptyTransaction() {
        reconciliationTransactions.push({
            date: new Date().toISOString().split('T')[0],
            description: '',
            amount: 0,
            isDeposit: true,
            category: 0,
            reconciled: false
        });
        
        // Force update
        reconciliationTransactions = [...reconciliationTransactions];
    }
    
    // Remove a transaction row
    function removeTransaction(index: number) {
        reconciliationTransactions.splice(index, 1);
        
        // Force update
        reconciliationTransactions = [...reconciliationTransactions];
    }
    
    // Create transactions from reconciliation entries
    function createTransactions() {
        if (selectedAccountId === 0) {
            alert('Please select an account to reconcile');
            return;
        }
        
        const selectedAccount = accounts.find(a => a.id === selectedAccountId);
        if (!selectedAccount) {
            alert('Selected account not found');
            return;
        }
        
        // Validate all transactions
        for (let i = 0; i < reconciliationTransactions.length; i++) {
            const rt = reconciliationTransactions[i];
            
            if (!rt.date) {
                alert(`Transaction #${i + 1}: Please enter a date`);
                return;
            }
            
            if (rt.description.trim() === '') {
                alert(`Transaction #${i + 1}: Please enter a description`);
                return;
            }
            
            if (rt.amount <= 0) {
                alert(`Transaction #${i + 1}: Please enter a valid amount`);
                return;
            }
            
            if (rt.category === 0) {
                alert(`Transaction #${i + 1}: Please select a category`);
                return;
            }
        }
        
        // Create transactions
        for (const rt of reconciliationTransactions) {
            // Find the selected category
            const category = categories.find(c => c.id === rt.category);
            if (!category) {
                alert(`Category not found for transaction: ${rt.description}`);
                continue;
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
                    transactionType = 'reconciliation';
            }
            
            // Create transaction entries
            let entries: TransactionEntry[];
            
            if (rt.isDeposit) {
                // For deposits: credit the source account, debit the bank account
                entries = [
                    {
                        category: rt.category,
                        account: category.creditAccount,
                        debit: 0,
                        credit: rt.amount
                    },
                    {
                        category: 0,
                        account: selectedAccount.name,
                        debit: rt.amount,
                        credit: 0
                    }
                ];
            } else {
                // For withdrawals: debit the destination account, credit the bank account
                entries = [
                    {
                        category: rt.category,
                        account: category.debitAccount,
                        debit: rt.amount,
                        credit: 0
                    },
                    {
                        category: 0,
                        account: selectedAccount.name,
                        debit: 0,
                        credit: rt.amount
                    }
                ];
            }
            
            // Create the transaction object
            const newTransaction: Transaction = {
                id: getNextTransactionId(),
                date: rt.date,
                description: rt.description,
                type: transactionType,
                entries: entries,
                amount: rt.amount,
                reconciled: rt.reconciled
            };
            
            // Add to transactions array
            transactions.push(newTransaction);
        }
        
        // Save to localStorage
        saveTransactionsToStorage();
        
        // Navigate back to transactions list
        goto('/budget/transactions');
    }
    
    // Cancel and go back to dashboard
    function cancelReconciliation() {
        goto('/budget');
    }
    
    // Format currency
    function formatCurrency(amount: number): string {
        return amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Toggle reconciled status for a transaction
    function toggleReconciled(transaction: Transaction) {
        transaction.reconciled = !transaction.reconciled;
        saveTransactionsToStorage();
        calculateReconciledBalance();
    }
    
    // Calculate the balance of reconciled transactions
    function calculateReconciledBalance() {
        if (selectedAccountId === 0) {
            return 0;
        }
        
        const selectedAccount = accounts.find(a => a.id === selectedAccountId);
        if (!selectedAccount) {
            return 0;
        }
        
        const accountName = selectedAccount.name;
        let reconciledBalance = 0;
        
        for (const transaction of accountTransactions) {
            if (transaction.reconciled) {
                for (const entry of transaction.entries) {
                    if (entry.account === accountName) {
                        if (selectedAccount.type === 'asset') {
                            reconciledBalance += entry.debit - entry.credit;
                        } else if (selectedAccount.type === 'liability') {
                            reconciledBalance += entry.credit - entry.debit;
                        }
                    }
                }
            }
        }
        
        return reconciledBalance;
    }
    
    // Get transaction amount for display
    function getTransactionAmount(transaction: Transaction, accountName: string): string {
        for (const entry of transaction.entries) {
            if (entry.account === accountName) {
                if (entry.debit > 0) {
                    return `+${formatCurrency(entry.debit)}`;
                } else if (entry.credit > 0) {
                    return `-${formatCurrency(entry.credit)}`;
                }
            }
        }
        return "0.00";
    }
</script>

<div class="page-container">
    {#if !isAuthenticated}
        <div class="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to reconcile accounts.</p>
            <button class="btn primary">Log In</button>
        </div>
    {:else if !hasAccess}
        <div class="auth-message">
            <h2>Access Denied</h2>
            <p>You don't have permission to reconcile accounts.</p>
        </div>
    {:else}
        <header class="page-header">
            <div class="header-content">
                <h1>Account Reconciliation</h1>
                <div class="header-actions">
                    <a href="/budget" class="btn secondary">Back to Dashboard</a>
                </div>
            </div>
            <p class="header-description">
                Reconcile your bank account by entering transactions from your bank statement.
                This helps ensure your budget records match your actual bank activity.
            </p>
        </header>
        
        <div class="reconciliation-container">
            <div class="account-selection">
                <h3>Select Account to Reconcile</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="account-select">Bank Account</label>
                        <select 
                            id="account-select" 
                            bind:value={selectedAccountId}
                            onchange={handleAccountChange}
                            required
                        >
                            <option value={0}>Select an Account</option>
                            {#each bankAccounts as account}
                                <option value={account.id}>{account.name} ({account.type})</option>
                            {/each}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="statement-date">Statement Date</label>
                        <input 
                            type="date" 
                            id="statement-date" 
                            bind:value={statementDate}
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="statement-balance">Statement Balance</label>
                        <input 
                            type="number" 
                            id="statement-balance" 
                            bind:value={statementBalance}
                            step="0.01"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>
                
                {#if selectedAccountId > 0}
                    {@const reconciledBalance = calculateReconciledBalance()}
                    <div class="balance-summary">
                        <div class="balance-row">
                            <span class="balance-label">Current Balance:</span>
                            <span class="balance-value">${formatCurrency(currentBalance)}</span>
                        </div>
                        <div class="balance-row">
                            <span class="balance-label">Reconciled Balance:</span>
                            <span class="balance-value">${formatCurrency(reconciledBalance)}</span>
                        </div>
                        <div class="balance-row">
                            <span class="balance-label">Statement Balance:</span>
                            <span class="balance-value">${formatCurrency(statementBalance)}</span>
                        </div>
                        <div class="balance-row difference">
                            <span class="balance-label">Difference:</span>
                            <span class="balance-value ${reconciledBalance - statementBalance === 0 ? 'balanced' : 'unbalanced'}">${formatCurrency(reconciledBalance - statementBalance)}</span>
                        </div>
                    </div>
                {/if}
            </div>
            
            {#if selectedAccountId > 0}
                {@const selectedAccount = accounts.find(a => a.id === selectedAccountId)}
                {#if selectedAccount}
                    <div class="existing-transactions-section">
                        <h3>Existing Transactions</h3>
                        <p class="section-description">
                            Mark transactions as reconciled when they appear on your bank statement.
                        </p>
                        
                        {#if accountTransactions.length === 0}
                            <div class="no-transactions">
                                <p>No transactions found for this account.</p>
                            </div>
                        {:else}
                            <div class="transactions-table">
                                <div class="table-header">
                                    <div class="header-cell date-cell">Date</div>
                                    <div class="header-cell description-cell">Description</div>
                                    <div class="header-cell type-cell">Type</div>
                                    <div class="header-cell amount-cell">Amount</div>
                                    <div class="header-cell reconciled-cell">Reconciled</div>
                                </div>
                                
                                {#each accountTransactions as transaction}
                                    <div class="transaction-row">
                                        <div class="cell date-cell">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </div>
                                        <div class="cell description-cell">
                                            {transaction.description}
                                        </div>
                                        <div class="cell type-cell">
                                            <span class="transaction-type {transaction.type}">{transaction.type}</span>
                                        </div>
                                        <div class="cell amount-cell">
                                            {getTransactionAmount(transaction, selectedAccount.name)}
                                        </div>
                                        <div class="cell reconciled-cell">
                                            <input 
                                                type="checkbox" 
                                                checked={transaction.reconciled}
                                                onchange={() => toggleReconciled(transaction)}
                                            />
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                    
                    <div class="transactions-section">
                        <h3>Add Missing Transactions</h3>
                        <p class="section-description">
                            Enter transactions from your bank statement that aren't already recorded in your budget.
                        </p>
                        
                        <div class="transactions-table">
                            <div class="table-header">
                                <div class="header-cell date-cell">Date</div>
                                <div class="header-cell description-cell">Description</div>
                                <div class="header-cell type-cell">Type</div>
                                <div class="header-cell category-cell">Category</div>
                                <div class="header-cell amount-cell">Amount</div>
                                <div class="header-cell reconciled-cell">Reconciled</div>
                                <div class="header-cell actions-cell">Actions</div>
                            </div>
                            
                            {#each reconciliationTransactions as transaction, index}
                                <div class="transaction-row">
                                    <div class="cell date-cell">
                                        <input 
                                            type="date" 
                                            bind:value={transaction.date}
                                            required
                                        />
                                    </div>
                                    <div class="cell description-cell">
                                        <input 
                                            type="text" 
                                            bind:value={transaction.description}
                                            placeholder="Enter description"
                                            required
                                        />
                                    </div>
                                    <div class="cell type-cell">
                                        <select bind:value={transaction.isDeposit}>
                                            <option value={true}>Deposit</option>
                                            <option value={false}>Withdrawal</option>
                                        </select>
                                    </div>
                                    <div class="cell category-cell">
                                        <select 
                                            bind:value={transaction.category}
                                            required
                                        >
                                            <option value={0}>Select Category</option>
                                            {#each categories as category}
                                                <option value={category.id}>{category.name} ({category.type})</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <div class="cell amount-cell">
                                        <input 
                                            type="number" 
                                            bind:value={transaction.amount}
                                            step="0.01"
                                            min="0.01"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div class="cell reconciled-cell">
                                        <input 
                                            type="checkbox" 
                                            bind:checked={transaction.reconciled}
                                        />
                                    </div>
                                    <div class="cell actions-cell">
                                        <button 
                                            type="button" 
                                            class="btn small danger" 
                                            onclick={() => removeTransaction(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            {/each}
                            
                            <div class="add-transaction-row">
                                <button type="button" class="btn secondary" onclick={addEmptyTransaction}>
                                    Add Transaction
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
            {/if}
            
            <div class="form-actions">
                <button type="button" class="btn secondary" onclick={cancelReconciliation}>Cancel</button>
                <button type="button" class="btn primary" onclick={createTransactions}>Save Transactions</button>
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
    
    .reconciliation-container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }
    
    .account-selection {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e9ecef;
    }
    
    .account-selection h3 {
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
    
    .balance-summary {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
        margin-top: 1rem;
    }
    
    .balance-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #e9ecef;
    }
    
    .balance-row.difference {
        font-weight: 600;
        border-bottom: none;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid #e9ecef;
    }
    
    .balance-label {
        color: #495057;
    }
    
    .balance-value {
        color: #212529;
    }
    
    .balance-value.balanced {
        color: #28a745;
    }
    
    .balance-value.unbalanced {
        color: #dc3545;
    }
    
    .transactions-section {
        margin-bottom: 2rem;
    }
    
    .transactions-section h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #343a40;
        font-size: 1.25rem;
    }
    
    .section-description {
        margin-bottom: 1.5rem;
        color: #6c757d;
    }
    
    .transactions-table {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .table-header {
        display: flex;
        background-color: #f8f9fa;
        font-weight: 600;
        border-bottom: 1px solid #e9ecef;
    }
    
    .header-cell {
        padding: 0.75rem 1rem;
        color: #495057;
    }
    
    .transaction-row {
        display: flex;
        border-bottom: 1px solid #e9ecef;
    }
    
    .cell {
        padding: 0.5rem;
    }
    
    .date-cell {
        flex: 0 0 150px;
    }
    
    .description-cell {
        flex: 1;
    }
    
    .type-cell {
        flex: 0 0 120px;
    }
    
    .category-cell {
        flex: 0 0 200px;
    }
    
    .amount-cell {
        flex: 0 0 120px;
    }
    
    .reconciled-cell {
        flex: 0 0 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .actions-cell {
        flex: 0 0 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .cell input,
    .cell select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 0.875rem;
    }
    
    .cell input[type="checkbox"] {
        width: auto;
    }
    
    .add-transaction-row {
        padding: 1rem;
        display: flex;
        justify-content: center;
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
        .form-group {
            flex-basis: calc(50% - 0.75rem);
            min-width: 150px;
        }
        
        .transaction-row {
            flex-wrap: wrap;
        }
        
        .date-cell,
        .description-cell,
        .type-cell,
        .category-cell,
        .amount-cell,
        .reconciled-cell,
        .actions-cell {
            flex: 1 1 auto;
        }
        
        .date-cell,
        .type-cell {
            min-width: 150px;
        }
        
        .description-cell {
            min-width: 200px;
        }
        
        .category-cell {
            min-width: 200px;
        }
        
        .amount-cell {
            min-width: 120px;
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
        
        .table-header {
            display: none;
        }
        
        .transaction-row {
            flex-direction: column;
            padding: 1rem;
            border-bottom: 1px solid #e9ecef;
        }
        
        .cell {
            padding: 0.5rem 0;
            width: 100%;
        }
        
        .cell::before {
            content: attr(data-label);
            font-weight: 600;
            display: block;
            margin-bottom: 0.25rem;
        }
        
        .form-actions {
            flex-direction: column;
        }
        
        .btn {
            width: 100%;
        }
    }
    
    .no-transactions {
        padding: 2rem;
        text-align: center;
        background-color: #f8f9fa;
        border-radius: 8px;
        color: #6c757d;
    }
    
    .existing-transactions-section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e9ecef;
    }
    
    .transaction-type {
        text-transform: capitalize;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
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
    
    .transaction-type.reconciliation {
        background-color: #f3e5f5;
        color: #9c27b0;
    }
</style> 
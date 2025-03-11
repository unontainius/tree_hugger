<script lang="ts">
    import { currentUser } from '$lib/utils/authUtils';
    import budgetDb, { type CashflowRowWithCells } from '$lib/services/budgetDb';
	import MIcon from '$lib/components/common/MIcon.svelte';
    
    // State
    let rows: CashflowRowWithCells[] = $state([]);
    let weeks: number[] = $state([]);
    let error: string | null = $state(null);
    let isLoading = $state(true);
    let showAddRow = $state(false);
    let newRowName = $state('');
    let newRowType = $state<'income' | 'expense'>('expense');
    let newRowGroup = $state('Other');
    let newRowIsRecurring = $state(false);
    let newRowRecurringAmount = $state<number | null>(null);
    let selectedGroup: string | null = $state(null);
    
    // Add new state variables for editing
    let editingGroup: { originalName: string; newName: string } | null = $state(null);
    let editingRow: CashflowRowWithCells | null = $state(null);
    let editRowName = $state('');
    let editRowGroup = $state('');
    let editRowType = $state<'income' | 'expense'>('expense');
    let editRowIsRecurring = $state(false);
    let editRowRecurringAmount = $state<number | null>(null);
    
    // Initialize weeks (1-52)
    $effect(() => {
        weeks = Array.from({ length: 52 }, (_, i) => i + 1);
    });
    
    // Load data when user is authenticated
    $effect(() => {
        if ($currentUser) {
            loadCashflowData();
            setTimeout(scrollToCurrentWeek, 100);
        }
    });
    
    async function loadCashflowData() {
        if (!$currentUser) return;
        
        try {
            isLoading = true;
            const data = await budgetDb.Cashflow.getRows($currentUser.id);
            rows = data;
        } catch (err) {
            console.error('Error loading cashflow data:', err);
            error = 'Failed to load cashflow data';
        } finally {
            isLoading = false;
        }
    }
    
    // Get unique groups from rows
    function getGroups(): string[] {
        const groups = new Set(rows.map(row => row.group_name));
        return Array.from(groups).sort();
    }
    
    // Filter rows by selected group
    function getFilteredRows(): CashflowRowWithCells[] {
        if (!selectedGroup) return rows;
        return rows.filter(row => row.group_name === selectedGroup);
    }
    
    // Get rows organized by groups
    function getGroupedRows(): { group: string; rows: CashflowRowWithCells[] }[] {
        const filteredRows = getFilteredRows();
        const groups = new Set(filteredRows.map(row => row.group_name));
        return Array.from(groups).sort().map(group => ({
            group,
            rows: filteredRows
                .filter(row => row.group_name === group)
                .sort((a, b) => a.name.localeCompare(b.name))
        }));
    }
    
    async function handleAddRow() {
        if (!$currentUser || !newRowName) return;
        
        try {
            const row = await budgetDb.Cashflow.createRow({
                user_id: $currentUser.id,
                name: newRowName,
                type: newRowType,
                group_name: newRowGroup,
                is_recurring: newRowIsRecurring,
                recurring_amount: newRowIsRecurring ? newRowRecurringAmount || 0 : undefined
            });
            
            if (row) {
                // If recurring, create cells for all weeks in a single operation
                if (newRowIsRecurring && newRowRecurringAmount) {
                    await budgetDb.Cashflow.updateCells(
                        row.id,
                        weeks.map(weekNum => ({
                            week_number: weekNum,
                            amount: newRowRecurringAmount || 0
                        }))
                    );
                }
                
                // Reload data
                await loadCashflowData();
                
                // Reset form
                newRowName = '';
                newRowType = 'income';
                newRowGroup = 'Other';
                newRowIsRecurring = false;
                newRowRecurringAmount = null;
                showAddRow = false;
            }
        } catch (err) {
            console.error('Error adding row:', err);
            error = 'Failed to add row';
        }
    }
    
    async function handleDeleteRow(rowId: number) {
        if (!confirm('Are you sure you want to delete this row?')) return;
        
        try {
            await budgetDb.Cashflow.deleteRow(rowId);
            await loadCashflowData();
        } catch (err) {
            console.error('Error deleting row:', err);
            error = 'Failed to delete row';
        }
    }
    
    async function handleCellInput(event: Event, rowId: number, weekNumber: number) {
        const input = event.target as HTMLInputElement;
        const value = parseFloat(input.value);
        
        if (!isNaN(value)) {
            try {
                await budgetDb.Cashflow.updateCell(rowId, weekNumber, { amount: value });
                await loadCashflowData();
            } catch (err) {
                console.error('Error updating cell:', err);
                error = 'Failed to update cell';
            }
        }
    }
    
    function calculateWeeklyTotal(weekIndex: number): number {
        return rows.reduce((total, row) => {
            const cell = row.cells.find(c => c.week_number === weekIndex + 1);
            const amount = cell?.amount || 0;
            return total + (row.type === 'income' ? amount : -amount);
        }, 0);
    }
    
    function calculateRowTotal(row: CashflowRowWithCells): number {
        return row.cells.reduce((total, cell) => total + (cell?.amount || 0), 0);
    }
    
    async function handleEditGroup(originalName: string) {
        editingGroup = {
            originalName,
            newName: originalName
        };
    }
    
    async function handleSaveGroup() {
        if (!editingGroup || !$currentUser) return;
        
        const { originalName, newName } = editingGroup;
        if (!newName) return;
        
        try {
            // Update all rows with this group name
            const rowsToUpdate = rows.filter(row => row.group_name === originalName);
            await Promise.all(
                rowsToUpdate.map(row => 
                    budgetDb.Cashflow.updateRow(row.id, { group_name: newName })
                )
            );
            
            // Reload data
            await loadCashflowData();
            editingGroup = null;
        } catch (err) {
            console.error('Error updating group:', err);
            error = 'Failed to update group';
        }
    }
    
    function startEditingRow(row: CashflowRowWithCells) {
        editingRow = row;
        editRowName = row.name;
        editRowGroup = row.group_name;
        editRowType = row.type;
        editRowIsRecurring = row.is_recurring;
        editRowRecurringAmount = row.recurring_amount ?? null;
    }
    
    async function handleSaveRow() {
        if (!editingRow || !$currentUser) return;
        
        const row = editingRow;
        if (!editRowName || !editRowGroup) return;
        
        try {
            // Check if recurring status changed from true to false
            const clearCells = row.is_recurring && !editRowIsRecurring;
            
            // Update the row
            await budgetDb.Cashflow.updateRow(row.id, {
                name: editRowName,
                group_name: editRowGroup,
                type: editRowType,
                is_recurring: editRowIsRecurring,
                recurring_amount: editRowIsRecurring ? editRowRecurringAmount || 0 : undefined
            });
            
            // If recurring status changed to true, update all cells with recurring amount
            if (!row.is_recurring && editRowIsRecurring && editRowRecurringAmount) {
                await Promise.all(
                    weeks.map(weekNum => 
                        budgetDb.Cashflow.updateCell(row.id, weekNum, { 
                            amount: editRowRecurringAmount ?? undefined 
                        })
                    )
                );
            }
            
            // If recurring status changed to false, clear all cells
            if (clearCells) {
                await Promise.all(
                    weeks.map(weekNum => 
                        budgetDb.Cashflow.updateCell(row.id, weekNum, { amount: 0 })
                    )
                );
            }
            
            // Reload data
            await loadCashflowData();
            editingRow = null;
        } catch (err) {
            console.error('Error updating row:', err);
            error = 'Failed to update row';
        }
    }
    
    function getWeekDates(weekNumber: number): { start: Date; end: Date } {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        return { start: startDate, end: endDate };
    }
    
    function formatMonthLabel(weekNumber: number): string {
        const { start, end } = getWeekDates(weekNumber);
        const startMonth = start.toLocaleString('en-US', { month: 'short' });
        const endMonth = end.toLocaleString('en-US', { month: 'short' });
        return startMonth === endMonth ? startMonth : `${startMonth}/${endMonth}`;
    }
    
    function getCurrentWeek(): number {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now.getTime() - start.getTime();
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        return Math.ceil(diff / oneWeek);
    }
    
    let gridRef: HTMLDivElement;
    let currentWeek = $state(getCurrentWeek());
    
    function scrollToCurrentWeek() {
        if (!gridRef) return;
        
        // Get the group and account column widths
        const groupWidth = 150;  // Width of the Group column
        const accountWidth = 300; // Width of the Account column
        
        // Calculate the scroll position to show the current week as first visible column
        const weekWidth = 100;   // Width of each week column
        const scrollPosition = (currentWeek - 1) * weekWidth;
        
        // Set the scroll position
        gridRef.scrollLeft = scrollPosition;
    }
</script>

<div class="cashflow-page">
    <header>
        <div class="header-content">
            <h1>Cashflow Grid</h1>
            <p>Track your income and expenses over 52 weeks</p>
        </div>
        <div class="header-actions">
            <select bind:value={selectedGroup}>
                <option value={null}>All Groups</option>
                {#each getGroups() as group}
                    <option value={group}>{group}</option>
                {/each}
            </select>
            <button class="btn primary" onclick={() => showAddRow = !showAddRow}>
                {showAddRow ? 'Cancel' : 'Add Row'}
            </button>
        </div>
    </header>
    
    {#if error}
        <div class="error-message">{error}</div>
    {/if}
    
    {#if showAddRow}
        <form 
            class="add-row-form"
            onsubmit={(e) => {
                e.preventDefault();
                handleAddRow();
            }}
        >
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" bind:value={newRowName} placeholder="e.g., Salary or Rent" />
            </div>
            
            <div class="form-group">
                <label for="type">Type:</label>
                <select id="type" bind:value={newRowType}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="group">Group:</label>
                <input 
                    type="text" 
                    id="group" 
                    bind:value={newRowGroup} 
                    list="existing-groups"
                    placeholder="e.g., Housing, Transportation"
                />
                <datalist id="existing-groups">
                    {#each getGroups() as group}
                        <option value={group}></option>
                    {/each}
                </datalist>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" bind:checked={newRowIsRecurring} />
                    Recurring Amount
                </label>
            </div>
            
            {#if newRowIsRecurring}
                <div class="form-group">
                    <label for="recurring-amount">Amount:</label>
                    <input 
                        type="number" 
                        id="recurring-amount" 
                        bind:value={newRowRecurringAmount} 
                        placeholder="Enter amount" 
                    />
                </div>
            {/if}
            
            <button type="submit" class="btn primary">Add Row</button>
        </form>
    {/if}
    
    {#if isLoading}
        <div class="loading">Loading cashflow data...</div>
    {:else}
        <div class="cashflow-grid" bind:this={gridRef}>
            <table>
                <thead>
                    <tr>
                        <th class="group-header" rowspan="2">Group</th>
                        <th class="account-header" rowspan="2">Account</th>
                        {#each weeks as week}
                            <th class="week-header month-label {week === currentWeek ? 'week-1' : ''}">
                                {formatMonthLabel(week)}
                            </th>
                        {/each}
                        <th class="total-header" rowspan="2">Total</th>
                    </tr>
                    <tr>
                        {#each weeks as week}
                            <th class="week-header {week === currentWeek ? 'week-1' : ''}">Week {week}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each getGroupedRows() as { group, rows }, groupIndex}
                        {#each rows as row, rowIndex}
                            <tr class="account-row {row.type}">
                                {#if rowIndex === 0}
                                    <td class="group-cell" rowspan={rows.length}>
                                        {#if editingGroup?.originalName === group}
                                            <div class="edit-group">
                                                <input 
                                                    type="text" 
                                                    bind:value={editingGroup.newName}
                                                    placeholder="Group name"
                                                />
                                                <div class="edit-actions">
                                                    <button 
                                                        class="btn small success" 
                                                        onclick={() => handleSaveGroup()}
                                                    >
                                                        Save
                                                    </button>
                                                    <button 
                                                        class="btn small" 
                                                        onclick={() => editingGroup = null}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        {:else}
                                            <div class="group-name-container">
                                                <button 
                                                    class="group-name-btn" 
                                                    onclick={() => handleEditGroup(group)}
                                                    title="Click to edit group"
                                                >
                                                    {group}
                                                </button>
                                            </div>
                                        {/if}
                                    </td>
                                {/if}
                                <td class="account-name">
                                    {#if editingRow?.id === row.id}
                                        <div class="edit-row-form">
                                            <input 
                                                type="text" 
                                                bind:value={editRowName}
                                                placeholder="Account name"
                                            />
                                            <select bind:value={editRowType}>
                                                <option value="income">Income</option>
                                                <option value="expense">Expense</option>
                                            </select>
                                            <input 
                                                type="text" 
                                                bind:value={editRowGroup}
                                                list="existing-groups"
                                                placeholder="Group"
                                            />
                                            <label class="recurring-checkbox">
                                                <input 
                                                    type="checkbox" 
                                                    bind:checked={editRowIsRecurring}
                                                />
                                                Recurring
                                            </label>
                                            {#if editRowIsRecurring}
                                                <input 
                                                    type="number" 
                                                    bind:value={editRowRecurringAmount}
                                                    placeholder="Amount"
                                                />
                                            {/if}
                                            <div class="edit-actions">
                                                <button 
                                                    class="btn small success" 
                                                    onclick={() => handleSaveRow()}
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    class="btn small" 
                                                    onclick={() => editingRow = null}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    {:else}
                                        <div class="account-info">
                                            <button 
                                                class="account-name-btn" 
                                                onclick={() => startEditingRow(row)}
                                                title="Click to edit account"
                                            >
                                                {row.name}
                                            </button>
                                        </div>
                                        {#if row.is_recurring}
                                            <span class="recurring-badge" title="Recurring: ${row.recurring_amount}">
                                                <MIcon name="repeat" size="24px" color="dodgerblue"/>
                                            </span>
                                        {/if}
                                        <button 
                                            class="delete-row-btn" 
                                            onclick={() => handleDeleteRow(row.id)}
                                            title="Delete row"
                                        >
                                            <MIcon name="close" size="16px" color="red"/>
                                        </button>
                                    {/if}
                                </td>
                                {#each weeks as week}
                                    {@const cell = row.cells.find(c => c.week_number === week)}
                                    <td class="amount-cell {week === currentWeek ? 'current-week' : ''}">
                                        <input
                                            type="number"
                                            value={cell?.amount || 0}
                                            oninput={(e) => handleCellInput(e, row.id, week)}
                                        />
                                        {#if cell?.note}
                                            <span class="note-indicator" title={cell.note}>📝</span>
                                        {/if}
                                    </td>
                                {/each}
                                <td class="row-total">
                                    ${calculateRowTotal(row).toLocaleString()}
                                </td>
                            </tr>
                        {/each}
                        {#if rows.length > 0}
                            <tr class="group-total-row">
                                <td colspan="2">Total for {group}</td>
                                {#each weeks as week}
                                    {@const total = rows.reduce((sum, row) => {
                                        const cell = row.cells.find(c => c.week_number === week);
                                        const amount = cell?.amount || 0;
                                        return sum + (row.type === 'income' ? amount : -amount);
                                    }, 0)}
                                    <td class="total-cell {total >= 0 ? 'positive' : 'negative'} {week === currentWeek ? 'week-1' : ''}">
                                        ${total.toLocaleString()}
                                    </td>
                                {/each}
                                <td class="group-total">
                                    ${rows.reduce((total, row) => total + calculateRowTotal(row) * (row.type === 'income' ? 1 : -1), 0).toLocaleString()}
                                </td>
                            </tr>
                        {/if}
                    {/each}
                    <tr class="totals-row">
                        <td colspan="2">Net Cash Flow</td>
                        {#each weeks as week}
                            {@const total = calculateWeeklyTotal(week - 1)}
                            <td class="total-cell {total >= 0 ? 'positive' : 'negative'} {week === currentWeek ? 'week-1 bottom-border' : ''}">
                                ${total.toLocaleString()}
                            </td>
                        {/each}
                        <td class="grand-total">
                            ${getFilteredRows().reduce((total, row) => total + calculateRowTotal(row) * (row.type === 'income' ? 1 : -1), 0).toLocaleString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .cashflow-page {
        padding: 2rem;
    }
    
    header {
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .add-row-form {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .form-group input[type="text"],
    .form-group input[type="number"],
    .form-group select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
    }
    
    .cashflow-grid {
        overflow-x: auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        min-width: 1200px;
    }
    
    th, td {
        padding: 0.2rem 0.75rem;
        border: 1px solid #e2e8f0;
    }
    
    .group-header {
        position: sticky;
        left: 0;
        background: white;
        z-index: 10;
        min-width: 150px;
    }
    
    .account-header {
        position: sticky;
        left: 150px;
        background: white;
        z-index: 10;
        min-width: 200px;
    }
    
    .week-header {
        min-width: 100px;
        text-align: right;
        padding: 0.2rem;
        padding-inline-end: 1rem;
    }
    .week-header.week-1 {
        border-left: 2px solid dodgerblue;
        border-right: 2px solid dodgerblue;
        background: dodgerblue;
        color: white;
        font-weight: 500;
    }
    
    .month-label {
        border-bottom: none;
        color: #64748b;
        font-size: 0.875rem;
        padding-bottom: 0;
    }
    .month-label.week-1 {
        border-left: 2px solid dodgerblue;
        border-right: 2px solid dodgerblue;
        border-top: 2px solid dodgerblue;
        background: dodgerblue;
        color: white;
        font-weight: 500;
    }
    tr:nth-child(2) .week-header {
        padding-top: 0;
    }
    
    .total-header {
        position: sticky;
        right: 0;
        background: white;
        z-index: 10;
    }
    
    .group-cell {
        position: sticky;
        left: 0;
        background: white;
        z-index: 5;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
    }
    
    .account-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        left: 150px;
        background: white;
        width: 200px;
        z-index: 5;
        border: none;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .delete-row-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 50%;
        background: none;
        font-size: 1.5rem;
        font-weight: 700;
        cursor: pointer;
        padding: 0.25rem;
        margin:0;
        margin-left: 0.5rem;
        width: 32px;
        height: 32px;
        box-shadow: none;
    }
    
    .delete-row-btn:hover {
        opacity: 1;
    }
    
    .amount-cell {
        padding:0;
        margin:0;
        position: relative;
    }
    
    .amount-cell input {
        width: 100%;
        border: none;
        padding: 0.2rem;
        padding-inline-end: 1rem;
        text-align: right;
        font-family: monospace;
    }
    
    .amount-cell input:focus {
        outline: 2px solid #3b82f6;
        border-radius: 4px;
    }
    
    .note-indicator {
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 0.75rem;
        opacity: 0.5;
        cursor: help;
    }
    
    .recurring-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        font-size: 0.75rem;
        margin-left: 0.5rem;
        cursor: help;
    }
    
    .total-cell {
        font-weight: 500;
        text-align: right;
        padding: 0.2rem;
        padding-inline-end: 1rem;
    }
    .total-cell.week-1 {
        border-left: 2px solid dodgerblue;
        border-right: 2px solid dodgerblue;
    }
    .total-cell.positive {
        color: #16a34a;
    }
    .total-cell.positive.week-1 {
        border-left: 2px solid dodgerblue;
        border-right: 2px solid dodgerblue;
    }
    .total-cell.negative {
        color: #dc2626;
    }
    .total-cell.negative.week-1 {
        border-left: 2px solid dodgerblue;
        border-right: 2px solid dodgerblue;
    }

    .total-cell.positive.week-1.bottom-border {
        border-left: 2px solid dodgerblue;
        border-right: 2px solid dodgerblue;
        border-bottom: 2px solid dodgerblue;
    }

    .total-cell.negative.week-1.bottom-border {
        border-left: 2px solid dodgerblue;
        border-right: 2px solid dodgerblue;
        border-bottom: 2px solid dodgerblue;
    }


    
    .row-total {
        position: sticky;
        right: 0;
        background: white;
        z-index: 5;
        text-align: right;
        font-weight: 500;
    }
    
    .grand-total {
        position: sticky;
        right: 0;
        background: #f8fafc;
        z-index: 5;
        text-align: right;
        font-weight: 600;
    }
    
    .error-message {
        background: #fee2e2;
        color: #dc2626;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .loading {
        text-align: center;
        padding: 2rem;
        color: #6b7280;
    }
    
    .header-content {
        flex: 1;
    }
    
    .header-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    
    .header-actions select {
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        min-width: 150px;
    }
    
    .account-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        border: none;
    }

    .account-name-btn {
        background: none;
        cursor: pointer;
        transition: color 0.2s;
        width: 100%;
        text-align: left;
        color: steelblue;
        box-shadow: none;
        padding: 0;
        margin: 0;
    }
    
    .account-name-btn:hover {
        color: #3b82f6;
    }
    
    .recurring-checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .edit-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .btn.small {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }
    
    .btn.success {
        background: #16a34a;
        color: white;
    }
    
    .btn.success:hover {
        background: #15803d;
    }
    
    .group-total-row {
        background: #f8fafc;
        font-weight: 500;
    }
    
    .group-total-row td:first-child {
        position: sticky;
        left: 0;
        background: #f8fafc;
        z-index: 5;
        border-right: 2px solid #e2e8f0;
    }
    
    .group-total-row td:nth-child(2) {
        position: sticky;
        left: 150px;
        background: #f8fafc;
        z-index: 5;
    }
    
    .group-total {
        position: sticky;
        right: 0;
        background: #f8fafc;
        z-index: 5;
        text-align: right;
        font-weight: 600;
    }
    
    .totals-row td:first-child {
        position: sticky;
        left: 0;
        background: #f8fafc;
        z-index: 5;
        border-right: 2px solid #e2e8f0;
    }
    
    .totals-row td:nth-child(2) {
        position: sticky;
        left: 150px;
        background: #f8fafc;
        z-index: 5;
    }
    
    .group-name-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .group-name-btn {
        background: none;
        border: none;
        padding: 0.2rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: steelblue;
        cursor: pointer;
        transition: color 0.2s;
        width: 100%;
        text-align: left;
        box-shadow: none;
        margin:0;
    }
    
    .group-name-btn:hover {
        color: #3b82f6;
    }
    
    .edit-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
    }
    
    .edit-row-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
        background: #f8fafc;
        border-radius: 4px;
    }
    
    .edit-row-form input,
    .edit-row-form select {
        padding: 0.25rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
    }
    
    /* Base styles for current week column */
    td.current-week {
        position: relative;
        border-left: 2px solid dodgerblue !important;
        border-right: 2px solid dodgerblue !important;
    }

    /* Top border for month header */

    /* Bottom border for totals */
    tr.totals-row td.current-week {
        border-bottom: 2px solid dodgerblue !important;
    }

    /* Keep internal borders light */
    td.current-week {
        border-top-color: #e2e8f0 !important;
        border-bottom-color: #e2e8f0 !important;
    }

    .current-week input {
        position: relative;
        z-index: 0;
    }
</style> 
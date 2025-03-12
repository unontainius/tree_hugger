<script lang="ts">
    import { currentUser } from '$lib/utils/authUtils';
    import budgetDb, { type CashflowRowWithCells } from '$lib/services/budgetDb';
	import MIcon from '$lib/components/common/MIcon.svelte';
    
    const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

    // Sample data structure
    const sampleData = [
        { group: 'Housing', accounts: ['Rent', 'Utilities', 'Insurance', 'Maintenance', 'Property Tax'] },
        { group: 'Transportation', accounts: ['Car Payment', 'Gas', 'Insurance', 'Maintenance', 'Public Transit'] },
        { group: 'Food', accounts: ['Groceries', 'Dining Out', 'Coffee Shops', 'Snacks'] },
        { group: 'Healthcare', accounts: ['Insurance', 'Medications', 'Doctor Visits', 'Dental Care'] },
        { group: 'Entertainment', accounts: ['Streaming Services', 'Movies', 'Hobbies', 'Sports'] },
        { group: 'Personal', accounts: ['Clothing', 'Hair Care', 'Gym', 'Personal Care'] },
        { group: 'Education', accounts: ['Tuition', 'Books', 'Supplies', 'Online Courses'] },
        { group: 'Savings', accounts: ['Emergency Fund', 'Retirement', 'Investments', 'Vacation Fund'] },
        { group: 'Income', accounts: ['Salary', 'Bonus', 'Side Gig', 'Investments', 'Rental Income'] },
        { group: 'Debt', accounts: ['Credit Card', 'Student Loans', 'Personal Loan', 'Line of Credit'] }
    ];

    // Generate all possible unique combinations
    const allPossibleRows = sampleData.flatMap(groupData => 
        groupData.accounts.map(account => ({
            group: groupData.group,
            account,
            key: `${groupData.group}-${account}`
        }))
    );

    // Shuffle array
    const shuffledRows = [...allPossibleRows]
        .sort(() => Math.random() - 0.5)
        .slice(0, 60);

    // Sort by group and account
    const rows = shuffledRows.sort((a, b) => 
        a.group === b.group 
            ? a.account.localeCompare(b.account) 
            : a.group.localeCompare(b.group)
    );

    // Group the rows by group name
    const groupedRows = rows.reduce((acc, row) => {
        const group = acc.find(g => g.name === row.group);
        if (group) {
            group.rows.push(row);
        } else {
            acc.push({ name: row.group, rows: [row] });
        }
        return acc;
    }, [] as { name: string; rows: typeof rows }[]);
</script>

<div class="cashflow-grid">
    <table>
        <thead>
            <tr>
                <th class="group-header">Group</th>
                <th class="account-header">Account</th>
                {#each weeks as week}
                    <th class="column-header-cell">week {week}</th>
                {/each}
                <th class="total-header">Total</th>
            </tr>
        </thead>
        <tbody>
            {#each groupedRows as group}
                {#each group.rows as row, rowIndex}
                    <tr class="cashflow-row">
                        {#if rowIndex === 0}
                            <td class="group-cell" rowspan={group.rows.length}>
                                {row.group}
                            </td>
                        {/if}
                        <td class="account-cell">
                            {row.account}
                        </td>
                        {#each weeks as week}
                            <td class="cell">
                                <input type="number" class="amount-cell" />
                            </td>
                        {/each}
                        <td class="total-cell">0</td>
                    </tr>
                {/each}
            {/each}
        </tbody>
    </table>
</div>

<style>
    .cashflow-grid {
        overflow: auto;
        height: calc(100dvh - 6rem);
        width: 90%;
        margin: 0 auto;
        border: 1px solid #a7a6a6;
        position: relative;
        background-color: #f8fafc;
    }
    
    /* ===== TABLE STRUCTURE ===== */
    table {
        border-collapse: collapse;
        width: max-content;
        position: relative;
        table-layout: fixed;
    }
    
    /* ===== HEADER STYLES ===== */
    /* Group header */
    .group-header {
        position: sticky;
        left: 0;
        top: 0;
        z-index: 60;
        width: 120px;
        min-width: 120px;
        max-width: 120px;
        height: 47px;
        text-align: center;
        padding: 0.75rem;
        background: rgb(228, 227, 227);
        border-right: 1px solid #a7a6a6;
        border-bottom: 1px solid #a7a6a6;
        font-weight: bold;
    }
    
    /* Account header */
    .account-header {
        position: sticky;
        left: 120px;
        top: 0;
        z-index: 50;
        width: 180px;
        min-width: 180px;
        max-width: 180px;
        height: 47px;
        text-align: right;
        padding: 0.75rem 1rem 0.75rem 0.75rem;
        background: rgb(228, 227, 227);
        border-right: 2px solid #a7a6a6;
        border-bottom: 1px solid #a7a6a6;
        font-weight: bold;
    }
    
    /* Week column headers */
    .column-header-cell {
        position: sticky;
        top: 0;
        width: 90px;
        min-width: 90px;
        max-width: 90px;
        height: 47px;
        padding: 0.75rem;
        text-align: right;
        background: rgb(228, 227, 227);
        border-right: 1px solid #a7a6a6;
        border-bottom: 1px solid #a7a6a6;
        z-index: 40;
        box-sizing: border-box;
        vertical-align: middle;
    }
    
    /* Total header */
    .total-header {
        position: sticky;
        top: 0;
        right: 0;
        width: 90px;
        min-width: 90px;
        max-width: 90px;
        height: 47px;
        padding: 0.75rem;
        text-align: right;
        background: rgb(228, 227, 227);
        border-left: 2px solid #a7a6a6;
        border-bottom: 1px solid #a7a6a6;
        z-index: 50;
        box-sizing: border-box;
        vertical-align: middle;
    }
    
    /* ===== GROUP AND ACCOUNT CELLS ===== */
    /* Group cells */
    .group-cell {
        position: sticky;
        left: 0;
        width: 120px;
        min-width: 120px;
        max-width: 120px;
        text-align: center;
        vertical-align: middle;
        font-weight: 500;
        padding: 0.75rem;
        z-index: 20;
        border-bottom: 1px solid #a7a6a6;
    }
    
    /* Account cells */
    .account-cell {
        position: sticky;
        left: 120px;
        width: 180px;
        min-width: 180px;
        max-width: 180px;
        height: 47px;
        text-align: right;
        padding: 0.75rem 1rem 0.75rem 0.75rem;
        background: white;
        border-right: 2px solid #a7a6a6;
        border-bottom: 1px solid #a7a6a6;
        vertical-align: middle;
        z-index: 20;
    }
    
    /* ===== DATA CELL STYLES ===== */
    .cell {
        width: 90px;
        min-width: 90px;
        max-width: 90px;
        height: 47px;
        padding: 0;
        background: white;
        border-right: 1px solid #a7a6a6;
        border-bottom: 1px solid #a7a6a6;
        box-sizing: border-box;
    }
    
    /* Total column cells */
    .total-cell {
        position: sticky;
        right: 0;
        width: 90px;
        min-width: 90px;
        max-width: 90px;
        height: 47px;
        padding: 0.75rem;
        text-align: right;
        background: rgb(228, 227, 227);
        z-index: 20;
        border-left: 2px solid #a7a6a6;
        border-bottom: 1px solid #a7a6a6;
        box-sizing: border-box;
    }
    
    /* ===== INPUT STYLES ===== */
    .amount-cell {
        width: 100%;
        height: 100%;
        padding: 0.75rem;
        box-sizing: border-box;
    }
    
    input {
        width: 100%;
        border: none;
        margin: 0;
        padding: 0;
        text-align: right;
        font-family: monospace;
        /* Hide spinner controls */
        appearance: textfield;
        -moz-appearance: textfield;
        box-sizing: border-box;
    }
    
    /* Hide spinner for Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    input:focus {
        outline: 2px solid #3b82f6;
        outline-offset: -2px;
        border-radius: 4px;
    }
</style>

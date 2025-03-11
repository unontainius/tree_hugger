<script lang="ts">
    import { page } from '$app/stores';
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();
</script>

<nav>
    <a href="/budget" class="nav-link" class:active={$page.url.pathname === '/budget'}>Dashboard</a>
    <a href="/budget/accounts" class="nav-link" class:active={$page.url.pathname === '/budget/accounts'}>Accounts</a>
    <a href="/budget/categories" class="nav-link" class:active={$page.url.pathname === '/budget/categories'}>Categories</a>
    <a href="/budget/transactions" class="nav-link" class:active={$page.url.pathname === '/budget/transactions'}>Transactions</a>
    <a href="/budget/cashflow" class="nav-link" class:active={$page.url.pathname === '/budget/cashflow'}>Cashflow Grid</a>
</nav>
{@render children()}
<style>
    nav {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .nav-link {
        color: #64748b;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: all 0.2s;
    }
    
    .nav-link:hover {
        background: #f1f5f9;
        color: #0f172a;
    }
    
    .nav-link.active {
        background: #e2e8f0;
        color: #0f172a;
        font-weight: 500;
    }
</style> 
<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/utils/authUtils';
    import budgetDb, { type SharedUser } from '$lib/services/budgetDb';

    let sharedUsers: SharedUser[] = [];
    let email = '';
    let isSharing = false;
    let shareError: string | null = null;
    let isLoading = true;
    
    onMount(async () => {
        if ($currentUser) {
            await loadSharedUsers();
        }
    });
    
    async function loadSharedUsers() {
        if (!$currentUser) return;
        isLoading = true;
        
        try {
            sharedUsers = await budgetDb.Sharing.getSharedUsers($currentUser.id);
        } catch (err) {
            console.error('Error loading shared users:', err);
        } finally {
            isLoading = false;
        }
    }
    
    async function shareAccess() {
        if (!$currentUser) return;
        isSharing = true;
        shareError = null;
        
        try {
            // Find the user by email
            const user = await budgetDb.Sharing.findUserByEmail(email);
            
            if (!user) {
                shareError = 'User not found';
                return;
            }
            
            // Don't share with yourself
            if (user.id === $currentUser.id) {
                shareError = 'You cannot share with yourself';
                return;
            }
            
            // Create the sharing record
            await budgetDb.Sharing.shareAccess($currentUser.id, user.id);
            
            // Reload shared users and reset form
            await loadSharedUsers();
            email = '';
        } catch (err) {
            console.error('Error sharing access:', err);
            shareError = err instanceof Error ? err.message : 'Failed to share access. Please try again.';
        } finally {
            isSharing = false;
        }
    }
    
    async function removeAccess(sharedWithId: string) {
        if (!$currentUser) return;
        try {
            await budgetDb.Sharing.removeAccess($currentUser.id, sharedWithId);
            await loadSharedUsers();
        } catch (err) {
            console.error('Error removing access:', err);
            alert('Failed to remove access. Please try again.');
        }
    }
</script>

<div class="page-container">
    <header class="page-header">
        <div class="header-content">
            <h1>Manage Sharing</h1>
            <div class="header-actions">
                <a href="/settings" class="btn secondary">Back to Settings</a>
            </div>
        </div>
        <p class="header-description">
            Share access to your budget data with other users.
        </p>
    </header>
    
    <div class="sharing-container">
        <div class="sharing-form">
            <h2>Share with a User</h2>
            <form on:submit|preventDefault={shareAccess}>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        bind:value={email} 
                        placeholder="Enter user's email address"
                        required
                    />
                </div>
                
                {#if shareError}
                    <div class="error-message">{shareError}</div>
                {/if}
                
                <button type="submit" class="btn primary" disabled={isSharing}>
                    {isSharing ? 'Sharing...' : 'Share Access'}
                </button>
            </form>
        </div>
        
        <div class="shared-users-list">
            <h2>Users with Access</h2>
            
            {#if isLoading}
                <p>Loading shared users...</p>
            {:else if sharedUsers.length === 0}
                <p>You haven't shared your data with anyone yet.</p>
            {:else}
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each sharedUsers as sharedUser}
                            <tr>
                                <td>{sharedUser.display_name || sharedUser.email}</td>
                                <td>
                                    <button 
                                        class="btn small danger" 
                                        on:click={() => removeAccess(sharedUser.id)}
                                    >
                                        Remove Access
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
    </div>
</div>

<style>
    .page-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
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
    
    .sharing-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    
    .sharing-form, .shared-users-list {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .form-group input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
    }
    
    .error-message {
        color: #dc3545;
        margin-bottom: 1rem;
    }
    
    .users-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .users-table th, .users-table td {
        padding: 0.75rem;
        border-bottom: 1px solid #e9ecef;
    }
    
    .users-table th {
        text-align: left;
        font-weight: 600;
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
    
    .btn.secondary {
        background-color: #6c757d;
        color: white;
        text-decoration: none;
    }
    
    .btn.danger {
        background-color: #dc3545;
        color: white;
    }
    
    .btn.small {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }
    
    @media (max-width: 768px) {
        .sharing-container {
            grid-template-columns: 1fr;
        }
    }
</style>

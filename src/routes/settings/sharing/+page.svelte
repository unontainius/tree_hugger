<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase, user } from '$lib/supabase';
    
    interface SharedUser {
        id: string;
        email: string;
        display_name?: string;
    }
    
    let sharedUsers: SharedUser[] = [];
    let email = '';
    let isSharing = false;
    let shareError: string | null = null;
    let isLoading = true;
    
    onMount(async () => {
        if ($user) {
            await loadSharedUsers();
        }
    });
    
    async function loadSharedUsers() {
        isLoading = true;
        
        try {
            const { data, error } = await supabase
                .from('shared_access')
                .select(`
                    shared_with_id,
                    shared_users:shared_with_id(
                        id,
                        email,
                        display_name
                    )
                `)
                .eq('owner_id', $user.id);
                
            if (error) throw error;
            
            sharedUsers = data.map(item => item.shared_users);
            console.log('Shared users:', sharedUsers);
        } catch (err) {
            console.error('Error loading shared users:', err);
        } finally {
            isLoading = false;
        }
    }
    
    async function shareAccess() {
        isSharing = true;
        shareError = null;
        
        try {
            // First find the user by email
            const { data: users, error: userError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', email);
                
            if (userError) throw userError;
            
            if (!users || users.length === 0) {
                shareError = 'User not found';
                return;
            }
            
            const sharedWithId = users[0].id;
            
            // Don't share with yourself
            if (sharedWithId === $user.id) {
                shareError = 'You cannot share with yourself';
                return;
            }
            
            // Create the sharing record
            const { error } = await supabase
                .from('shared_access')
                .insert([{ 
                    owner_id: $user.id, 
                    shared_with_id: sharedWithId 
                }]);
                
            if (error) {
                if (error.code === '23505') { // Unique violation
                    shareError = 'Already shared with this user';
                } else {
                    throw error;
                }
            } else {
                // Reload shared users
                await loadSharedUsers();
                email = '';
            }
        } catch (err) {
            console.error('Error sharing access:', err);
            shareError = 'Failed to share access. Please try again.';
        } finally {
            isSharing = false;
        }
    }
    
    async function removeAccess(sharedWithId: string) {
        try {
            const { error } = await supabase
                .from('shared_access')
                .delete()
                .eq('owner_id', $user.id)
                .eq('shared_with_id', sharedWithId);
                
            if (error) throw error;
            
            // Reload shared users
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

<script lang="ts">
    import Modal from './Modal.svelte';
    import type { BudgetGroup, BudgetAccount } from '$lib/services/cashflowService';
    import MIcon from './common/MIcon.svelte';
    import { enhance } from '$app/forms';
    
    let { show = $bindable(false), group = $bindable(null), accountExample = '', onGroupCreated, onGroupUpdated, onClose }: {
        show: boolean;
        group: BudgetGroup | null;
        accountExample: string;
        onGroupCreated: (event: CustomEvent<BudgetGroup>) => void;
        onGroupUpdated: (event: CustomEvent<BudgetGroup>) => void;
        onClose: () => void;
    } = $props();
    
    
    // Reactive props for form
    let name = $state('');
    let newAccountName = $state('');
    let accounts: string[] = $state([]);
    let isEditing = $state(false);
    let isAddingAccount = $state(false);
    let error = $state('');
    let success = $state('');
    let submitting = $state(false);
    
    // Initialize form when modal opens
    $effect(() => {
        if (show) {
            isEditing = !!group;
            name = group?.name || '';
            accounts = group?.accounts?.map((acc: BudgetAccount) => acc.name) || [];
            error = '';
            success = '';
            submitting = false;
        }
    });
    
    function addAccount() {
        if (!newAccountName.trim()) {
            error = 'Account name is required';
            return;
        }
        
        if (accounts.includes(newAccountName)) {
            error = 'Account with this name already exists';
            return;
        }
        
        accounts = [...accounts, newAccountName];
        newAccountName = '';
        isAddingAccount = false;
        error = '';
    }
    
    function removeAccount(index: number) {
        accounts = accounts.filter((_, i) => i !== index);
    }
    
    function closeModal() {
        show = false;
        onClose();
    }

    function handleResult(result: any) {
        submitting = false;
        
        if (result.type === 'failure' || result.error) {
            error = result.error || 'An error occurred';
            return;
        }
        
        if ((result.type === 'success' || result.success) && result.data?.group) {
            success = isEditing 
                ? 'Group updated successfully' 
                : 'Group created successfully';
            
            // Create a custom event with the group data
            const event = new CustomEvent(isEditing ? 'groupUpdated' : 'groupCreated', {
                detail: result.data.group
            });
            
            // Call the appropriate handler
            if (isEditing) {
                onGroupUpdated(event);
            } else {
                onGroupCreated(event);
            }
            
            // Automatically close after success
            setTimeout(() => {
                closeModal();
            }, 1500);
        }
    }
</script>

<Modal bind:show={show} title={isEditing ? 'Edit Group' : 'Add New Group'} width="450px">
    <div class="form-container">
        {#if error}
            <div class="error-message">{error}</div>
        {/if}
        
        {#if success}
            <div class="success-message">{success}</div>
        {/if}
        
        <form 
            method="POST" 
            action={isEditing ? '?/updateGroup' : '?/createGroup'} 
            use:enhance={({form, data, action, cancel}) => {
                submitting = true;
                error = '';
                success = '';
                
                return async ({result, update}) => {
                    submitting = false;
                    
                    if (result.type === 'failure') {
                        error = result.data?.error || 'An error occurred';
                        return;
                    }
                    
                    if (result.type === 'success') {
                        const group = result.data?.group;
                        if (group) {
                            success = isEditing 
                                ? 'Group updated successfully' 
                                : 'Group created successfully';
                            
                            // Create a custom event with the group data
                            const event = new CustomEvent(isEditing ? 'groupUpdated' : 'groupCreated', {
                                detail: group
                            });
                            
                            // Call the appropriate handler
                            if (isEditing) {
                                onGroupUpdated(event);
                            } else {
                                onGroupCreated(event);
                            }
                            
                            // Update the page but prevent default redirect
                            update({ reset: false });
                            
                            // Automatically close after success
                            setTimeout(() => {
                                closeModal();
                            }, 1500);
                        }
                    }
                };
            }}
        >
            <div class="form-group">
                <label for="groupName">Group Name</label>
                <input 
                    type="text" 
                    id="groupName"
                    name="name"
                    bind:value={name} 
                    placeholder="Enter group name (e.g. Housing, Food)"
                    required
                />
            </div>
            
            {#if isEditing && group}
                <input type="hidden" name="id" value={group.id} />
            {:else}
                <input type="hidden" name="accounts" value={JSON.stringify(accounts)} />
                
                <div class="accounts-section">
                    <div class="accounts-header">
                        <h4>Accounts</h4>
                        <button 
                            type="button" 
                            class="add-account-btn" 
                            onclick={() => isAddingAccount = true}
                        >
                            Add Account
                        </button>
                    </div>
                    
                    {#if isAddingAccount}
                        <div class="add-account-form">
                            <input 
                                type="text" 
                                bind:value={newAccountName} 
                                placeholder={`Account name (e.g. ${accountExample || 'Rent'})`}
                            />
                            <div class="account-actions">
                                <button type="button" class="cancel-btn" onclick={() => isAddingAccount = false}>
                                    <MIcon name="close" size="14px" color="white"/>
                                </button>
                                <button type="button" class="add-btn" onclick={addAccount}>
                                    Add
                                </button>
                            </div>
                        </div>
                    {/if}
                    
                    {#if accounts.length === 0}
                        <p class="no-accounts">No accounts added yet</p>
                    {:else}
                        <ul class="accounts-list">
                            {#each accounts as account, i}
                                <li>
                                    <span>{account}</span>
                                    <button type="button" class="remove-btn" onclick={() => removeAccount(i)}>
                                        <MIcon name="close" size="16px" color="white"/>
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
            {/if}
            
            <div class="form-footer">
                <button type="button" class="cancel-modal-btn" onclick={closeModal}>
                    Cancel
                </button>
                <button type="submit" class="save-btn" disabled={submitting}>
                    {#if submitting}
                        Saving...
                    {:else}
                        {isEditing ? 'Update' : 'Create'} Group
                    {/if}
                </button>
            </div>
        </form>
    </div>
</Modal>

<style>
    .form-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .form-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 10px;
    }
    
    label {
        font-weight: 500;
        font-size: 0.9rem;
        color: #4b5563;
    }
    
    input[type="text"] {
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.95rem;
    }
    
    input[type="text"]:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
    }
    
    .accounts-section {
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 15px;
    }
    
    .accounts-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .accounts-header h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 500;
    }
    
    .add-account-btn {
        background-color: transparent;
        color: #3b82f6;
        border: 1px solid #3b82f6;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 0.8rem;
        cursor: pointer;
    }
    
    .add-account-btn:hover {
        background-color: rgba(59, 130, 246, 0.1);
    }
    
    .add-account-form {
        margin-bottom: 15px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 10px;
        background-color: #f9fafb;
    }
    
    .account-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 10px;
    }
    
    .no-accounts {
        color: #6b7280;
        font-style: italic;
        text-align: center;
        margin: 15px 0;
    }
    
    .accounts-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .accounts-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 10px;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .accounts-list li:last-child {
        border-bottom: none;
    }
    
    .remove-btn {
        display: flex;  
        justify-content: center;
        align-items: center;
        background: none;
        border: none;
        cursor: pointer;
        background-color: #d40000;
        color:white;
        padding: 4px;
        border-radius: 50%;

    }
    
    .remove-btn:hover {
        background-color: #fc0404;
    }
    
    .error-message {
        background-color: #fee2e2;
        color: #b91c1c;
        padding: 10px;
        border-radius: 4px;
        border-left: 3px solid #ef4444;
    }
    
    .success-message {
        background-color: #d1fae5;
        color: #065f46;
        padding: 10px;
        border-radius: 4px;
        border-left: 3px solid #10b981;
    }
    
    /* Footer buttons */
    .cancel-modal-btn {
        background-color: #f3f4f6;
        color: #4b5563;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
    }
    
    .cancel-modal-btn:hover {
        background-color: #e5e7eb;
    }
    
    .save-btn {
        background-color: #3b82f6;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
    }
    
    .save-btn:hover {
        background-color: #2563eb;
    }
    
    .cancel-btn, .add-btn {
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
    }
    
    .cancel-btn {
        background-color: #f3f4f6;
        color: #4b5563;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .add-btn {
        background-color: #3b82f6;
        color: white;
    }
</style> 
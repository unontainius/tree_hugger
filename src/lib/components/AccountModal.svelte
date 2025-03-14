<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { BudgetGroup, BudgetAccount } from '$lib/services/cashflowService';
    import MIcon from '$lib/components/common/MIcon.svelte';
    
    // Props
    const { 
        show = false, 
        groups = [], 
        editMode = false,
        accountToEdit = null 
    } = $props<{
        show?: boolean;
        groups?: BudgetGroup[];
        editMode?: boolean;
        accountToEdit?: { id: string, name: string, group_id: string } | null;
    }>();
    
    // State
    let selectedGroupId = $state('');
    let accounts = $state<{id?: string, name: string, isValid: boolean}[]>([{ name: '', isValid: false }]);
    let isSubmitting = $state(false);
    let error = $state('');
    let modalTitle = $state('Add New Accounts');
    let modalId = $state(`account-modal-${Math.random().toString(36).substring(2, 9)}`);
    
    // Event dispatcher
    const dispatch = createEventDispatcher<{
        accountsCreated: { name: string, group_id: string }[];
        accountUpdated: { id: string, name: string, group_id: string };
        close: void;
    }>();
    
    // Watch for show changes to reset form
    $effect(() => {
        if (show) {
            resetForm();
        }
    });
    
    // Reset the form to initial state
    function resetForm() {
        if (editMode && accountToEdit) {
            // Edit mode - populate with existing account data
            selectedGroupId = accountToEdit.group_id;
            accounts = [{ id: accountToEdit.id, name: accountToEdit.name, isValid: true }];
            modalTitle = 'Edit Account';
        } else {
            // Add mode - start with empty form
            selectedGroupId = groups.length > 0 ? groups[0].id : '';
            accounts = [{ name: '', isValid: false }];
            modalTitle = 'Add New Accounts';
        }
        error = '';
        isSubmitting = false;
    }
    
    // Add a new account input field
    function addAccountField() {
        if (!editMode) {
            accounts = [...accounts, { name: '', isValid: false }];
        }
    }
    
    // Remove an account input field
    function removeAccountField(index: number) {
        if (!editMode && accounts.length > 1) {
            accounts = accounts.filter((_, i) => i !== index);
        }
    }
    
    // Validate an account name
    function validateAccountName(index: number, name: string) {
        const trimmedName = name.trim();
        const isValid = trimmedName.length > 0;
        accounts[index].isValid = isValid;
        accounts[index].name = trimmedName;
    }
    
    // Check if form is valid
    function isFormValid(): boolean {
        // Must have a selected group
        if (!selectedGroupId) return false;
        
        // Must have at least one valid account
        return accounts.some(account => account.isValid);
    }
    
    // Handle form submission
    async function handleSubmit(e: Event) {
        e.preventDefault();
        
        if (!isFormValid()) {
            error = 'Please fill in all required fields';
            return;
        }
        
        isSubmitting = true;
        error = '';
        
        try {
            if (editMode && accountToEdit && accounts.length === 1) {
                // Edit mode - update existing account
                const updatedAccount = {
                    id: accountToEdit.id,
                    name: accounts[0].name,
                    group_id: selectedGroupId
                };
                
                // Dispatch event with updated account
                dispatch('accountUpdated', updatedAccount);
            } else {
                // Add mode - create new accounts
                // Filter out empty account names
                const validAccounts = accounts
                    .filter(account => account.isValid)
                    .map(account => ({
                        name: account.name,
                        group_id: selectedGroupId
                    }));
                
                // Dispatch event with created accounts
                dispatch('accountsCreated', validAccounts);
            }
            
            // Close the modal
            handleClose();
        } catch (err) {
            console.error('Error processing account:', err);
            error = err instanceof Error ? err.message : 'An unknown error occurred';
        } finally {
            isSubmitting = false;
        }
    }
    
    // Handle modal close
    function handleClose() {
        dispatch('close');
    }
    
    // Handle escape key press
    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            handleClose();
        }
    }
</script>

<!-- Modal backdrop -->
{#if show}
    <div 
        class="modal-backdrop" 
        onclick={handleClose}
        role="presentation"
    >
        <!-- Modal container with proper role -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <div 
            class="modal-container"
            role="dialog"
            aria-labelledby={`${modalId}-title`}
            aria-modal="true"
            aria-describedby={error ? `${modalId}-error` : undefined}
            onclick={handleClose}
        >
           
            <!-- Modal header -->
            <div class="modal-header">
                <h2 id={`${modalId}-title`}>{modalTitle}</h2>
                <button 
                    class="close-button" 
                    onclick={handleClose}
                    aria-label="Close modal"
                    type="button"
                >
                    <MIcon name="close" size="24px" />
                </button>
            </div>
            
            <!-- Modal content -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="modal-content" onclick={e => e.stopPropagation()}>
                {#if error}
                    <div 
                        class="error-message" 
                        id={`${modalId}-error`}
                        role="alert"
                    >
                        {error}
                    </div>
                {/if}
                
                <form id={`${modalId}-form`} onsubmit={handleSubmit} aria-labelledby={`${modalId}-title`}>
                    <!-- Group selection -->
                    <div class="form-group">
                        <label for={`${modalId}-group-select`}>Select Group</label>
                        <select 
                            id={`${modalId}-group-select`} 
                            bind:value={selectedGroupId}
                            disabled={isSubmitting}
                            required
                            aria-required="true"
                            aria-invalid={!selectedGroupId}
                            aria-describedby={`${modalId}-group-desc`}
                        >
                            {#if groups.length === 0}
                                <option value="" disabled>No groups available</option>
                            {:else}
                                {#each groups as group}
                                    <option value={group.id}>{group.name}</option>
                                {/each}
                            {/if}
                        </select>
                        <div id={`${modalId}-group-desc`} class="sr-only">Select the group this account belongs to</div>
                    </div>
                    
                    <!-- Account inputs -->
                    <div class="accounts-container">
                        <h3 id={`${modalId}-accounts-heading`}>Accounts</h3>
                        <div role="group" aria-labelledby={`${modalId}-accounts-heading`}>
                            {#each accounts as account, i}
                                <div class="account-input-row">
                                    <div class="form-group account-name">
                                        <label for={`${modalId}-account-${i}`}>Account Name</label>
                                        <input 
                                            type="text" 
                                            id={`${modalId}-account-${i}`} 
                                            placeholder="e.g., Rent, Utilities, Salary" 
                                            value={account.name}
                                            oninput={(e) => validateAccountName(i, e.currentTarget.value)}
                                            disabled={isSubmitting}
                                            required={i === 0}
                                            aria-required={i === 0 ? "true" : "false"}
                                            aria-invalid={i === 0 && !account.isValid}
                                            aria-describedby={`${modalId}-account-desc-${i}`}
                                        />
                                        <div id={`${modalId}-account-desc-${i}`} class="sr-only">
                                            Enter a name for this account
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="button" 
                                        class="remove-button" 
                                        onclick={() => removeAccountField(i)}
                                        disabled={accounts.length === 1 || isSubmitting || editMode}
                                        style={editMode ? 'visibility: hidden;' : ''}
                                        aria-label={`Remove account ${i + 1}`}
                                    >
                                        <span class="sr-only">Remove this account</span>
                                        <MIcon name="close" size="16px" color="red" />
                                    </button>
                                </div>
                            {/each}
                        </div>
                        
                        {#if !editMode}
                            <button 
                                type="button" 
                                class="add-button" 
                                onclick={addAccountField}
                                disabled={isSubmitting}
                                aria-label="Add another account"
                            >
                                <MIcon name="add" size="16px" />
                                <span>Add Another Account</span>
                            </button>
                        {/if}
                    </div>
                    
                    <!-- Form actions -->
                    <div class="form-actions">
                        <button 
                            type="button" 
                            class="cancel-button" 
                            onclick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        
                        <button 
                            type="submit" 
                            class="submit-button" 
                            disabled={!isFormValid() || isSubmitting}
                            aria-busy={isSubmitting ? "true" : "false"}
                        >
                            {#if isSubmitting}
                                {editMode ? 'Updating...' : 'Creating...'}
                            {:else}
                                {editMode ? 'Update Account' : 'Create Accounts'}
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-container {
        background-color: white;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #1f2937;
    }
    
    .close-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
    }
    
    .modal-content {
        padding: 1rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #374151;
    }
    
    .form-group input,
    .form-group select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    .accounts-container {
        margin-top: 1.5rem;
    }
    
    .accounts-container h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1rem;
        color: #374151;
    }
    
    .account-input-row {
        display: flex;
        align-items: flex-end;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .account-name {
        flex: 1;
        margin-bottom: 0.5rem;
    }
    
    .remove-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .remove-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .add-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: transparent;
        border: 1px dashed #d1d5db;
        border-radius: 4px;
        padding: 0.5rem;
        width: 100%;
        cursor: pointer;
        margin-top: 0.5rem;
        color: #4b5563;
    }
    
    .add-button:hover {
        background-color: #f9fafb;
    }
    
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .cancel-button {
        padding: 0.5rem 1rem;
        background-color: white;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
    }
    
    .submit-button {
        padding: 0.5rem 1rem;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
    }
    
    .submit-button:disabled {
        background-color: #93c5fd;
        cursor: not-allowed;
    }
    
    .error-message {
        background-color: #fee2e2;
        color: #b91c1c;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
</style> 
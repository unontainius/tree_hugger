<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import MIcon from './common/MIcon.svelte';
    
    export let show = false;
    export let title = '';
    export let width = '500px';
    
    let bodyStyle: string | undefined = undefined;
    
    const close = () => {
        show = false;
    };
    
    // Only run DOM-related code in the browser environment
    onMount(() => {
        if (browser) {
            bodyStyle = document.body.style.overflow;
        }
    });
    
    // Prevent background scrolling when modal is open - only in browser
    $: if (show && browser) {
        console.log('Modal is now visible:', title);
        document.body.style.overflow = 'hidden';
    } else if (browser && bodyStyle !== undefined) {
        document.body.style.overflow = bodyStyle;
    }
    
    // Cleanup on component destruction - only in browser
    onDestroy(() => {
        if (browser && bodyStyle !== undefined) {
            document.body.style.overflow = bodyStyle;
        }
    });
    
    // Close modal when Escape key is pressed
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && show) {
            close();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
    <div class="modal-backdrop" onclick={close} onkeydown={handleKeydown} role="button" tabindex="0"></div>
    <div 
        class="modal-container" 
        style:max-width={width}
        onclick={(e) => e.stopPropagation()}
        onkeydown={handleKeydown}
        role="button"
        tabindex="0"
    >
        <div class="modal-header">
            <h3 class="modal-title">{title}</h3>
            <button 
                type="button" 
                class="close-button" 
                onclick={close}
                aria-label="Close modal"
            >
                <MIcon name="close" size="16px" color="red"/>
            </button>
        </div>
        
        <div class="modal-content">
            <slot></slot>
        </div>
        
        <div class="modal-footer">
            <slot name="footer"></slot>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000; /* Increase z-index to ensure visibility */
    }
    
    .modal-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        z-index: 1001; /* Increase z-index to be above backdrop */
        max-width: 90%;
        width: 100%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        cursor: default;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 14px 16px 24px;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .modal-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
    }
    
    .close-button {
        background: none;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        color: #6b7280;
        padding: 4px 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .close-button:hover {
        background-color: #f3f4f6;
        color: #111827;
    }
    
    .modal-content {
        padding: 24px;
        overflow-y: auto;
        flex: 1;
    }
    
    .modal-footer {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
</style> 
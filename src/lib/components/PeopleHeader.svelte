<script lang="ts">
    import MIcon from './MIcon.svelte';
    import { isLoggedIn } from '$lib/utils/authUtils';
    import { goto } from '$app/navigation';

    let { isLoading } = $props<{ isLoading: boolean }>();

    async function handleAddNewperson() {
        if (await isLoggedIn()) {
            goto('0');
        }
    }
</script>

<div class="nav-container">
    <a class="back-btn" href="/admin">
        <MIcon name="back" size="5rem" />
    </a>
    {#if !isLoading}
        <div class="btn-add-container">
            <button class="btn-add-new-person" onclick={handleAddNewperson}>
                <MIcon name="plus" size="52px" />
            </button>
        </div>
    {/if}
</div>

<style>
    .nav-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 2rem;
        position: absolute;
        top: 0;
        left: 0;
        color: white;
    }

    .btn-add-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .btn-add-new-person {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border-radius: 5rem;
        padding: 0.5rem;
        background-color: dodgerblue;
    }
</style> 
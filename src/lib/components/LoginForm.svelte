<script lang="ts">
    import { authService } from '$lib/services/authService';
    import MIcon from './MIcon.svelte';
    import { toasts } from '$lib/stores/toastStore';
    let email = $state('');
    let password = $state('');
    let isLoading = $state(false);

    const { onclose } = $props();

    async function handleSubmit() {
        if (!email || !password) return;
        isLoading = true;
        
        try {
            await authService.login(email, password);
            onclose()
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            isLoading = false;
        }
    }
</script>

<form class="login-form" onsubmit={
    (e) => {
        e.preventDefault();
        handleSubmit();
    }
}>

    <div class="field">
        <label for="email">Email</label>
        <input 
            type="email" 
            id="email"
            bind:value={email}
            required
            disabled={isLoading}
            autocomplete="on"
        />
    </div>
    <div class="field">
        <label for="password">Password</label>
        <input 
            type="password" 
            id="password"
            bind:value={password}
            required
            disabled={isLoading}
            autocomplete="on"
        />
    </div>
    <div class="btns" >    
        <button type="button" class="danger" onclick={onclose}>
            Cancel  
        </button>

        <button type="submit" disabled={isLoading}>
            {#if isLoading}
                <MIcon name="loading" size="1.5rem" />
            {:else}
                Login
            {/if}
        </button>
    </div>
</form>

<style>
    .login-form {
        display: flex;
        flex-direction: column;
        margin: 0;
        gap: 1rem;
        width: 100%;
        height: 100%;
        padding: 1rem;
        padding-inline: 2rem;
        background: white;
        border-bottom-right-radius: 1rem;
        border-bottom-left-radius: 1rem;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    input {
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        padding: 0.5rem;
    }   
    .btns {
        display: flex;
        justify-content: space-between;
    }
    .danger {
        background: rgb(66, 66, 66);
    }

</style> 
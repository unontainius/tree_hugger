<script lang="ts">
    import { loginRequestedState } from '$lib/stores/authStore';
    import { authService } from '$lib/services/authService';
    import MIcon from './MIcon.svelte';

    let username = $state('');
    let password = $state('');
    let error = $state('');
    let isLoading = $state(false);

    const { onclose } = $props();

    async function handleSubmit() {
        try {
            await authService.login(username, password);
            loginRequestedState.set(false);
            error = '';
            onclose();
        } catch (err) {
            error = err instanceof Error ? err.message : 'Login failed';
        }
    }

    function handleClose() {
        loginRequestedState.set(false);
        onclose();
    }
</script>

<div class="login-form">
    <form onsubmit = {(e) => {e.preventDefault;handleSubmit()}}>
        <div class="form-group">
            <label for="username">Username:</label>
            <input 
                type="text" 
                id="username"
                bind:value={username}
                required
                disabled={isLoading}
                autocomplete="username"
            />
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input 
                type="password" 
                id="password"
                bind:value={password}
                required
                disabled={isLoading}
                autocomplete="current-password"
            />
        </div>
        {#if error}

            <div class="error">{error}</div>
        {/if}
        <div class="button-group">
            <button type="button" onclick={handleClose}>Cancel</button>
            <button type="submit" disabled={isLoading}>Login</button>
        </div>
    </form>
</div>

<style>
    .login-form {
        width: 100%;
        padding: 2rem;
        padding-block-end: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
    }


    .error {
        color: red;
        margin-bottom: 1rem;
    }
    .button-group {
        display: flex;
        justify-content: flex-end;
    }
    button {
        margin:0;
        margin-left: 1rem;
    }
    input {
        padding: 0.5rem;
        border: 1px solid #b6b6b6;
        border-radius: 0.25rem;
    }
</style> 
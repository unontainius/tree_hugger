<script lang="ts">
	import "../app.css";
	import Toast from '$lib/components/Toast.svelte';
	import { user } from '$lib/stores/authStore';
	import { authService } from '$lib/services/authService';
	import { onMount } from 'svelte';
	import { toasts } from '$lib/stores/toastStore';
	import { loginRequestedState } from '$lib/stores/authStore';

	let { children } = $props();

	onMount(() => {
		authService.getCurrentUser();
	});

	async function handleLogout() {
		if ($user) {
			await authService.logout();
			loginRequestedState.update((state: boolean) => false);
		}
	}

	function toggleLogin() {
		loginRequestedState.update((state: boolean) => !state);
		toasts.success('Login state set to ' + $loginRequestedState);
	}
</script>

<Toast message="message not required other than to stop the compiler complaining" />


	<nav>
		{#if $user}
			<button onclick={handleLogout}>Logout</button>
		{:else}
			<button onclick={toggleLogin}>
				{$user ? 'Logout' : $loginRequestedState ? 'Cancel Login' : 'Login'}
			</button>
		{/if}
	</nav>

{@render children()}

<style>
	nav {
		position: fixed;
		top: 0;
		right: 0;
	}
</style>

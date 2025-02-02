<script lang="ts">
	import "../app.css";
	import Toast from '$lib/components/Toast.svelte';
	import { user } from '$lib/stores/authStore';
	import { authService } from '$lib/services/authService';
	import { onMount } from 'svelte';
	import Modal from "$lib/components/Modal.svelte";
	import LoginForm from "$lib/components/LoginForm.svelte";
	import { toasts } from '$lib/stores/toastStore';

	let { children } = $props();
	let showLogin = $state(false);

	onMount(() => {
		authService.getCurrentUser();
	});

	async function handleLogout() {
		if ($user) {
			await authService.logout();
		} else {
			showLogin = true;
		}
	}
	function processdialogResult(result: string) {
		showLogin = false;
	}
</script>

<Toast message="message not required other than to stop the compiler complaining" />


	<nav>
		<button onclick={handleLogout}>{$user ? 'Logout' : 'Login'}</button>
	</nav>


{#if showLogin}
	<Modal
		visible={showLogin}
		title="Login"
		acceptBtnText="Login"
		cancelBtnText="Cancel"
		showOverlay={true}
		cancelOnOverlayClick={true}
		dialogReason={processdialogResult}
		showFooter={false}

	>
		<LoginForm onclose={() => showLogin = false} />
	</Modal>
{/if}
{@render children()}

<style>
	nav {
		position: fixed;
		top: 0;
		right: 0;
	}
</style>

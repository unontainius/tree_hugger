<script lang="ts">
	import '../app.css';
	import Toast from '$lib/components/Toast.svelte';
	import { user } from '$lib/stores/authStore';
	import { authService } from '$lib/services/authService';
	import { onMount } from 'svelte';
	import { toasts } from '$lib/stores/toastStore';
	import { loginRequestedState } from '$lib/stores/authStore';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import Window from '$lib/components/Window.svelte';

	let { children } = $props();
	let ShowLoginForm = $state(false);

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
		ShowLoginForm = !ShowLoginForm;
	}

	function processdialogResult(result: string) {
		if (result !== '') {
			loginRequestedState.update((state: boolean) => false);
		}
	}
</script>


	<Toast message="message not required other than to stop the compiler complaining" />

	<nav>
		{#if $user}
			<button onclick={handleLogout}>Logout</button>
		{:else}
			<button onclick={toggleLogin}>
				{$user ? 'Logout' : ShowLoginForm ? 'Cancel Login' : 'Login'}
			</button>
		{/if}
	</nav>

	{#if ShowLoginForm}
		<!-- showMinimize={false} showMaximize={false}  -->
		<Window
			title="Login"
			onClose={() => {
				ShowLoginForm = false;
			}}
			showMinimize={false}
			showMaximize={false}
			showFooter={false}
		>


			<LoginForm
				onclose={() => {
					ShowLoginForm = false;
				}}
			/>
		</Window>
	{/if}

	{@render children()}
	<div class="wave-container">
		<div class="wave">
		</div>
		<div class="wave">
		</div>
		<div class="wave">
		</div>
	</div>




<style>

	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		background-color: #013d55;
		color: white;
	}
	:global(input), :global(select) {
		color: black;
	}


	nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;

		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 5rem;
	}

	:global(.spinner) {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

@keyframes gradient {
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 0% 0%;
    }
}

.wave {
    background: rgb(255 255 255 / 25%);
    border-radius: 1000% 1000% 0 0;
    position: fixed;
    width: 200%;
    height: 12em;
    animation: wave 10s -3s linear infinite;
    transform: translate3d(0, 0, 0);
    opacity: 0.8;
    bottom: 0;
    left: 0;
    z-index: -1;
}

.wave:nth-of-type(2) {
    bottom: -1.25em;
    animation: wave 18s linear reverse infinite;
    opacity: 0.8;
}

.wave:nth-of-type(3) {
    bottom: -2.5em;
    animation: wave 20s -1s reverse infinite;
    opacity: 0.9;
}

@keyframes wave {
    2% {
        transform: translateX(1);
    }

    25% {
        transform: translateX(-25%);
    }

    50% {
        transform: translateX(-50%);
    }

    75% {
        transform: translateX(-25%);
    }

    100% {
        transform: translateX(1);
    }
}</style>

<script lang="ts">
	import { loginRequestedState } from '$lib/stores/authStore';
	import { authService } from '$lib/services/authService';

	let username = $state('');
	let password = $state('');
	let error = $state('');
	let isLoading = $state(false);

	const { onclose } = $props();

	async function handleSubmit(e: Event) {
		e.preventDefault();
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

	// TODO: focus on username input 100ms after page loads
	$effect(() => {
		setTimeout(() => {
			const usernameInput = document.getElementById('username');
			if (usernameInput) {
				usernameInput.focus();
			}
		}, 100);
	});
</script>

<div class="login-form">
	<form
		onsubmit={(e) => {
			handleSubmit(e);
		}}
	>
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
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 100%;
		background: linear-gradient(0deg, rgba(20, 33, 51, 0.96), rgba(85, 139, 189, 0.96));
		border-bottom-left-radius: 0.4rem;
		border-bottom-right-radius: 0.4rem;
	}

	.form-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
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
		margin: 0;
		margin-left: 1rem;
	}

	input {
		padding: 0.5rem;
		border: 1px solid #b6b6b6;
		border-radius: 0.25rem;
	}
</style>

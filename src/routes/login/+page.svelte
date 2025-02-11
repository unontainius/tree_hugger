<script lang="ts">
	import LoginForm from '$lib/components/LoginForm.svelte';
</script>

<div class="login-page">
	<LoginForm />
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: grid;
		place-items: center;
		background: #f5f5f5;
	}
</style>

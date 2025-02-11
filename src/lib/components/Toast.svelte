<script lang="ts">
	import { toasts, type Toast } from '$lib/stores/toastStore';
	import { fly } from 'svelte/transition';
	import MIcon from './MIcon.svelte';

	// const { message } = $props();
	let visibleToasts = $state<Toast[]>([]);

	$effect(() => {
		visibleToasts = $toasts;
	});
</script>

<div class="toast-container">
	{#each visibleToasts as toast (toast.id)}
		<div class="toast {toast.type}" transition:fly={{ x: 100, duration: 300 }}>
			<p>{toast.message}</p>
			<button onclick={() => toasts.remove(toast.id)}><MIcon name="close" size="32px" /></button>
		</div>
	{/each}
</div>

<style>
	p {
		padding: 1rem;
	}
	button {
		border-radius: 50%;
	}
	.toast-container {
		position: fixed;
		top: 5.25rem;
		right: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		z-index: 2000;
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* padding: 1rem; */
		border-radius: 0.5rem;
		color: white;
		border-left: 6px solid #f1f1f1;
		min-width: 200px;
		max-width: 400px;
		pointer-events: auto;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toast-highlight {
		width: 1rem;
		background-color: #ffffff;
		overflow: hidden;
	}

	.toast p {
		margin: 0;
		padding-right: 1rem;
	}

	.toast button {
		background: none;
		border: none;
		color: white;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
	}

	.success {
		background-color: #4caf50;
	}

	.error {
		background-color: #f44336;
	}

	.info {
		background-color: #2196f3;
	}

	.warning {
		background-color: #ff9800;
	}
</style>

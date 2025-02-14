<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children } = $props<{ children: Snippet }>();
</script>

<div class="rounded-tab">
	{@render children()}
</div>

<style>
	.rounded-tab {
		--r: 1em; /* control the curvature */
		display: flex;
		justify-content: flex-end;
		align-items: center;
		background: rgb(32, 32, 32);
		width: 10rem;
		border-inline: var(--r) solid #0000;
		border-radius: calc(2 * var(--r)) calc(2 * var(--r)) 0 0 / var(--r);
		mask:
			radial-gradient(var(--r) at var(--r) 0, #0000 98%, #000 101%) calc(-1 * var(--r)) 100%/100%
				var(--r) repeat-x,
			conic-gradient(#000 0 0) padding-box;
	}
</style>

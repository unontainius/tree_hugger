<script lang="ts">
	import type { Snippet } from 'svelte';

	let key = $state<string>('');
	let { children } = $props<{ children: Snippet }>();

	function pageTransition(
		node: HTMLElement,
		{ duration = 150, delay = 0 }: { duration?: number; delay?: number }
	) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			delay,
			duration,
			css: (t: number) => `
				transform: ${transform} scale(${t});
				opacity: ${t}
			`
		};
	}
</script>

{#key key}
	<div in:pageTransition={{ duration: 150, delay: 150 }} out:pageTransition={{ duration: 150 }}>
		{@render children()}
	</div>
{/key}

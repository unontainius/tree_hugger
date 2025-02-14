<script lang="ts">
	let { name, size = '48px', color = 'white' } = $props();

	let isBlank = $derived(name.includes('blank'));
	let iconError = $state(false);
	let iconComponent = $state<HTMLElement | null>(null);

	async function loadSvg() {
		try {
			const response = await fetch(`/icons/${name}.svg`);
			const text = await response.text();

			// Create a DOM parser
			const parser = new DOMParser();
			const doc = parser.parseFromString(text, 'image/svg+xml');

			// Get the SVG element
			const svg = doc.querySelector('svg');
			if (!svg) throw new Error('No SVG element found');

			// Set attributes safely
			svg.setAttribute('width', size);
			svg.setAttribute('height', size);

			// Clear existing content
			if (iconComponent) {
				iconComponent.innerHTML = '';
				iconComponent.appendChild(svg);
			}
		} catch (error) {
			iconError = true;
			console.warn(`${error} Icon not found: ${name}`);
		}
	}

	$effect(() => {
		if (!isBlank) {
			loadSvg();
		}
	});
</script>

<div
	class="icon"
	style="width: {size}; height: {size}; color: {isBlank ? 'transparent' : color};"
	aria-label={name}
	bind:this={iconComponent}
>
	{#if isBlank}
		<div class="blank"></div>
	{:else if iconError}
		<div class="icon-error">!</div>
	{/if}
</div>

<style>
	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.blank {
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.icon-error {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 0, 0, 0.2);
		color: red;
		font-weight: bold;
		border-radius: 4px;
	}
</style>

<!-- src/lib/components/SkillItem.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	
	let { name, icon, percentage, showWindow = false, onShowWindow } = $props<{
		name: string;
		icon: string;
		percentage: number;
		showWindow?: boolean;
		onShowWindow?: (show: boolean) => void;
	}>();
	
	let visible = $state(false);
	let element: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);

		observer.observe(element);
	});
</script>

<div class="column item" bind:this={element}>
	<div class="row">
		
		<div class="column">
			{#if name === 'Svelte'}
				<button class="icon-button" onclick={() => onShowWindow?.(!showWindow)}>
					<img src={icon} alt={name} />
				</button>
			{:else}
				<img src={icon} alt={name} />
			{/if}
		</div>
		<div class="column text">
			<span>{name}</span>
			<span class="percentage">{percentage}%</span>
		</div>
		<div class="column">
			<div class="circle" style="--percentage: {percentage};"></div>
		</div>
	</div>
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		min-width: 110px;
		max-height: 40px;
		margin: 0;
		border-radius: 1rem;
	}
	.column {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 0;
	}
	.column img {
		width: 60px;
	}
	.icon-button {
		background-color: transparent;
		border: none;
		padding: 0;
		margin: 0;
		width: 60px;
		height: 60px;
		box-shadow: none;

	}
	.item {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: space-between;
		padding: 0.5rem 1rem;
		background: transparent;
		border-radius: 3rem;
		border-top-left-radius: 1rem;
		border-bottom-left-radius: 1rem;
		border: 1px solid #c5c5c5;
		margin: 0.5rem;
		padding: 0.5rem;
		padding-inline-start: 0;
	}
	.text {
		padding-inline: 0.5rem;
		text-shadow: 0 0 10px #000000;
		width: 100px;
	}
	.circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: conic-gradient(#33ff00 calc(var(--percentage) * 1%), #ff0101);
		position: relative;
		width: 40px;
	}

	.percentage {
		color: #021f2b;
		font-size: 1rem;
		font-weight: 800;
		margin-inline-start: 0.7rem;
		text-shadow: none;
	}

	@media (max-width: 480px) {
		.item {
			border: none;
		}
		.text {
			font-size: 1rem;
			width: 170px;
		}
	}	
	
</style>

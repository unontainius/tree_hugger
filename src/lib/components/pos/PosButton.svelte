<script lang="ts">
	import MIcon from "../common/MIcon.svelte";
	import type { MouseEventHandler } from 'svelte/elements';
	import { browser } from "$app/environment";

	let buttonElement: HTMLButtonElement;

	let { 
		bgColor,
		foregroundColor,
		borderColor,
		icon,
		iconSize = "24px", // Default size if not provided
		onclick = (() => {}) as MouseEventHandler<HTMLButtonElement>,
		selected = false
	} = $props();
</script>

<button 
	bind:this={buttonElement}
	onclick={onclick} 
	style={`background: ${bgColor}; color: ${foregroundColor}; border: 3px solid ${borderColor}; ${selected ? 'box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);' : ''}`}
>
	<MIcon name={icon} size={iconSize} color={foregroundColor}/>
</button>

<style>
	button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		border-radius: 2rem;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	button:hover {
		transform: scale(0.98);
		filter: brightness(1.1);
	}

	button:active {
		transform: scale(0.95);
	}

	@media (max-width: 768px) {
		button {
			border-radius: 1rem;
		}
	}
</style>

<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types';
	import PersonCard from './PersonCard.svelte';
	import { goto } from '$app/navigation';

	let { people } = $props<{ people: PersonRow[] | null }>();

	function handlePersonClick(id: string) {
		goto(`/admin/person/${id}`);
	}
</script>

<div class="catalog">
	{#if people}
		{#each people as person}
			{#if person.first_name != 'No'}
				<PersonCard {person} onclick={() => handlePersonClick(person.id)} />
			{/if}
		{/each}
	{/if}
</div>

<style>
	.catalog {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 90vw;
		margin: 0 auto;
		gap: 1rem;
	}
</style>

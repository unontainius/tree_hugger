<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types';
	import db from '$lib/services/treeDb';
	import MIcon from '$lib/components/common/MIcon.svelte';
	import PeopleCatalog from '$lib/components/family-tree/PeopleCatalog.svelte';
	import RadioButtons from '$lib/components/common/RadioButtons.svelte';
	import { onMount } from 'svelte';
	import { debounce } from '$lib/utils/debounce';
	import { user } from '$lib/stores/authStore';

	let people = $state<PersonRow[] | null>(null);
	let initialLoading = $state(true);
	let searchInput = $state<HTMLInputElement | null>(null);
	let sortAscending = $state(true);
	let sortField = $state<string | 'first_name' | 'last_name' | 'born'>('first_name');

	// Simpler search function without caching for now
	async function loadData() {
		const filterCriteria = searchInput?.value.toLowerCase() || '%';

		try {
			const data = await db.Person.all(filterCriteria, sortField, sortAscending);
			people = data || [];
			initialLoading = false;
		} catch (error) {
			console.error('Error loading people:', error);
			people = [];
			initialLoading = false;
		}
	}

	// Debounce the search with a shorter delay
	const debouncedSearch = debounce(loadData, 200);

	onMount(() => {
		loadData(); // Initial load
	});

	$effect(() => {
		if (searchInput) {
			searchInput.focus();
		}
	});
</script>


<div class="row">
	<div class="search-group">
		<div class="search-icon-container">
			<MIcon name="search" size="24px" color="black" />
		</div>
		<input
			bind:this={searchInput}
			id="search-input"
			type="text"
			placeholder="Search"
			onkeyup={debouncedSearch}
		/>
	</div>

	<!-- SORT ORDER -->
	<!-- TODO: add a filter by sex -->
	<div class="sort-group">
		<button
			class="sort-direction-btn"
			onclick={() => {
				sortAscending = !sortAscending;
				loadData(); // Direct call for immediate feedback
			}}
		>
			{#if sortAscending}
				<MIcon name="sort-asc" size="24px" />
			{:else}
				<MIcon name="sort-desc" size="24px" />
			{/if}
		</button>

		<RadioButtons
			options={[
				{ label: 'First Name', value: 'first_name' },
				{ label: 'Last Name', value: 'last_name' },
				{ label: 'Born', value: 'born' }
			]}
			bind:currentValue={sortField}
			onChange={loadData}
		/>

		<a 
			href={$user ? "/admin/person/new" : undefined}
			class="add-button"
			class:disabled={!$user}
			onclick={e => !$user && e.preventDefault()}
			title={!$user ? "Please log in to add new people" : "Add New Person"}
		>
			<MIcon name="add" size="24px" />
			New
		</a>
	</div>
</div>

{#if initialLoading}
	<div class="loading-container">
		<div class="loading-icon-container">
			<MIcon name="people" size="128px" />
		</div>
		<h1>Loading People onto the bus...</h1>
		<p>Some of them them are not on the bus yet ...</p>
		<p class="loading-subtitle">So this may take a while ...</p>
	</div>
{:else}
	<PeopleCatalog {people} />
{/if}

<style>
	h1 {
		font-size: 2rem;
		font-weight: 600;
		color: white;
	}
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding-block-start: 5rem;
		flex-wrap: wrap;
		gap: 1rem;
		padding-block-end: 1rem;
		color: rgb(32, 32, 32);
		background-color: #464646;
		margin-block-end: 1rem;
	}
	.search-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background-color: #f3f3f3;
		border: 1px solid #5555552a;
		border-radius: 2rem;
		padding: 0.5rem 1.5rem;
		margin-inline: 0.5rem;
		color: rgb(32, 32, 32);
	}

	.search-icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		color: dodgerblue;
	}
	.sort-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		color: dodgerblue;
	}
	.sort-direction-btn {
		padding: 0;
		margin: 0;
		padding-block: 0.5rem;
		padding-inline: 0.5rem;
		border-radius: 2rem;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		width: 100%;
		height: 40vh;
		color: rgba(255, 255, 255, 0.589);
	}
	.loading-icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		width: 64px;
		height: 64px;
	}
	.loading-subtitle {
		color: #666;
		font-size: 0.9rem;
	}

	input {
		padding: 0.5rem;
		padding-block: 0.45rem;
		border: 1px solid #b6b6b6;
		border-radius: 0.25rem;
	}

	.add-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: dodgerblue;
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.add-button:hover:not(.disabled) {
		background: rgb(24, 100, 177);
		transform: translateY(-2px);
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: gray;
		pointer-events: none;
	}
</style>

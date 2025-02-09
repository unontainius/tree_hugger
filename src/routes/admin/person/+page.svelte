<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types';
	import db from '$lib/services/treeDb';
	import MIcon from '$lib/components/MIcon.svelte';
	import PeopleCatalog from '$lib/components/PeopleCatalog.svelte';
	import RadioButtons from '$lib/components/RadioButtons.svelte';

	let people = $state<PersonRow[] | null>(null);
	let initialLoading = $state(true); // For initial load only
	let searchInput = $state<HTMLInputElement | null>(null);
	let sortAscending = $state(true);
	let sortField = $state<string | 'first_name' | 'last_name' | 'born'>('first_name');

	async function loadData() {
		const filterCriteria = searchInput?.value.toLowerCase() || '%';

		try {
			const data = await db.Person.all(filterCriteria, sortField, sortAscending);
			people = data || [];
		} catch (error) {
			console.log('Error loading people:', error);
			people = [];
		} finally {
			initialLoading = false; // Only set this to false after initial load
		}
	}

	// Initial load
	loadData();

	$effect(() => {
		setTimeout(() => {
			const searchInput = document.getElementById('search-input');

			if (searchInput) {
				searchInput.focus();
			}
		}, 100);
	});
</script>

<div class="row">
	<div class="search-group">
		<MIcon name="search" size="24px" />
		<input
			bind:this={searchInput}
			id="search-input"
			type="text"
			placeholder="Search"
			onkeyup={loadData}
		/>
	</div>

	<!-- SORT ORDER -->
	<!-- TODO: add a filter by sex -->
	<div class="sort-group">
		<button
			class="sort-direction-btn"

			onclick={() => {
				sortAscending = !sortAscending;
				loadData();
			}}
		>
			{#if sortAscending}
				<MIcon name="sort-asc" size="24px" />
			{:else}
				<MIcon name="sort-desc" size="24px" />
			{/if}
		</button>

		<RadioButtons 
			options={[{label: 'First Name', value: 'first_name'}, 
					{label: 'Last Name', value: 'last_name'}, 
					{label: 'Born', value: 'born'}]} 
			bind:currentValue={sortField} 
			onChange={loadData} 
		/>
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
	}
	.search-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background-color: #ffffff2a;
		border-radius: 0.5rem;
		padding: 0.5rem;
		margin-inline: 0.5rem;
	}

	.sort-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}
	.sort-direction-btn {
		padding:0;
		margin:0;
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
</style>

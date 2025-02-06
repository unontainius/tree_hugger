<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types';
	import db from '$lib/services/treeDb';
	import MIcon from '$lib/components/MIcon.svelte';
	import PersonCard from '$lib/components/PersonCard.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';


	let people = $state<PersonRow[] | null>(null);
	let filters = $state<{ [key: string]: string }>({});
	let sortState = $state<{ field: string; ascending: boolean }[]>([]);
	let isLoading = $state(false);


	async function loadData() {
		console.log('Loading data, isLoading:', isLoading);
		isLoading = true;
		try {
			const data = await db.Person.all(
				Object.entries(filters).map(([fieldname, fieldvalue]) => ({ fieldname, fieldvalue }))
			);
			console.log('Data loaded:', data);
			
			if (data) {
				people = data;
				applySort();
			} else {
				people = [];
			}
		} catch (error) {
			console.error('Error loading people:', error);
			people = [];
		} finally {
			isLoading = false;
			console.log('Loading complete, isLoading:', isLoading);
		}
	}

	onMount(() => {
		loadData();
	});

	$effect(() => {
		if (Object.keys(filters).length > 0) {
			loadData();
		}
	});



	function updateFilter(value: string) {
		filters = { ...filters, 'first_name': value, 'last_name': value, 'email': value, 'alias': value, 'born': value, 'died': value,  'sex': value };
	}



	function applySort() {
		if (people) {
			people = [...people].sort((a, b) => {
				for (const { field, ascending } of sortState) {
					const aValue = a[field as keyof PersonRow];
					const bValue = b[field as keyof PersonRow];

					// Handle null or empty values
					if (aValue == null || aValue === '') return ascending ? 1 : -1;
					if (bValue == null || bValue === '') return ascending ? -1 : 1;

					if (aValue < bValue) return ascending ? -1 : 1;
					if (aValue > bValue) return ascending ? 1 : -1;
				}
				return 0;
			});
		}
	}
	
	function isValidPerson(person: any): person is PersonRow {
		return (
			typeof person.id === 'string' &&
			typeof person.first_name === 'string' &&
			typeof person.last_name === 'string' &&
			(typeof person.email === 'string' || person.email === null) &&
			(typeof person.alias === 'string' || person.alias === null) &&
			(typeof person.born === 'string' || person.born === null) &&
			(typeof person.died === 'string' || person.died === null) &&
			(typeof person.image_url === 'string' || person.image_url === null) &&
			(typeof person.last_edited_by === 'string' || person.last_edited_by === null) &&
			typeof person.created_at === 'string' &&
			['Male', 'Female', 'Other'].includes(person.sex)
		);
	}
	function handlePersonClick(id: string) {
		goto(`/admin/person/${id}`);
	}
</script>


<div class="nav-container">
	<a class="back-btn" href="/admin"><MIcon name="back" size="5rem" /></a>
	{#if !isLoading}
		<div class="btn-add-container">
			<a class="btn-add-new-person" href="/admin/person/0">
				<MIcon name="plus" size="52px" />
			</a>
		</div>
	{/if}
</div>
{#if isLoading}
	<div class="loading-container">
		<div class="loading-icon-container">
			<MIcon name="people" size="128px"  />
		</div>
		<h1>Loading People onto the bus...</h1>
		<p>Some of them them are not on the bus yet ...</p>
		<p class="loading-subtitle">So this may take a while ...</p>
	</div>

{:else}
	<div class="row">
		<div class="btn-group">
			<p>Sort by:</p>
			<button class="btn-icon blue with-text"
				onclick={() => {
					sortState = [];
					applySort();
				}}>First Name
			</button>

			<button class="btn-icon blue with-text"
				onclick={() => {
					sortState = [];
					applySort();
				}}>Last Name
			</button>
		</div>
	</div>
	<button
		class="btn-icon blue with-text"
		onclick={() => {
			filters = {};
			loadData();
		}}><MIcon name="no-filter" size="24px" />Filters</button
	>

	<div class="catalog">
		{#if people}
			{#each people as person}
				{#if person.first_name != 'No'}
					<PersonCard {person} onclick={() => handlePersonClick(person.id)} />
				{/if}
			{/each}
		{/if}
		<!-- <div class="wave"></div>
		<div class="wave"></div>
		<div class="wave"></div> -->
	</div>
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

		padding-block-end: 1rem;
	}
	.btn-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0;
		background-color: #ffffff2a;
		border-radius: 0.5rem;
		padding: 0.5rem;
	}
	.catalog {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 90vw;
		margin: 0 auto;
	}
	.nav-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		gap: 2rem;
		position: absolute;
		top: 0;
		left: 0;
		color: white;

	}
	.btn-add-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.btn-add-new-person {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-radius: 5rem;
		padding: 0.5rem;
		background-color: dodgerblue;
		border-radius: 5rem;

	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		width: 100%;
		height: 40vh;
		color: white;

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
    a:hover {
        color: #ff00f2;
    }


</style>
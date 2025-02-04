<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types';
	import db from '$lib/services/treeDb';
	import MIcon from '$lib/components/MIcon.svelte';
	import PersonCard from '$lib/components/PersonCard.svelte';
	import { goto } from '$app/navigation';

	let people = $state<PersonRow[] | null>(null);
	let selectedPerson = $state<PersonRow | null>(null);
	let filters = $state<{ [key: string]: string }>({});
	let personFields: string[] = $state([]);
	let sortState = $state<{ field: string; ascending: boolean }[]>([]);
	let enabledRow = $state<string | null>(null);
	let showEditor = $state(false);
	let editModalResponse = $state<string | null>(null);
	let showFilter = $state(false);
	let isLoading = $state(false);

	// Array of field names to exclude from filter and sorting selection
	const excludedFields = ['id', `created_at`, `last_edited_by`];
	// Array of field names requiring special attention, formatting etc
	const specialFields = ['born', 'sex', 'image_url'];

	// Function to modify a field name to keep only the first word (use for captions only)
	function modifyFieldname(fieldname: string) {
		return fieldname.split('_')[0].replace(/\b\w/g, (char) => char.toUpperCase());
	}
	function enableRow(id: string) {
		enabledRow = enabledRow === id ? null : id;
	}
	function handleShowModal(id: string) {
		selectedPerson = pluckPerson(id);
		editModalResponse = 'edit';
	}
	// enabledRow = '189f1ddd-41b6-480b-b269-d34687704956';

	$effect(() => {
		async function loadData() {
			isLoading = true;
			try {
		
				const data = await db.Person.all(
					Object.entries(filters).map(([fieldname, fieldvalue]) => ({ fieldname, fieldvalue }))
				);
				
				if (data) {
					people = data;
					if (people.length > 0) {
						personFields = Object.keys(people[0]).filter((field) => !excludedFields.includes(field));
					}
					applySort();
				} else {
					people = [];
				}
			} catch (error) {
				console.error('Error loading people:', error);
				people = [];
			} finally {
				isLoading = false;
			}
		}

		loadData();
	});

	function formatDateToLocal(date: string) {
		if (date.length > 8) {
			return new Date(date).toLocaleDateString();
		}
		return date;
	}
	function updateFilter(fieldname: string, value: string) {
		filters = { ...filters, [fieldname]: value };
	}
	function toggleSort(fieldname: string, event: MouseEvent) {
		const isCtrlPressed = event.ctrlKey;
		const existingSortIndex = sortState.findIndex((sort) => sort.field === fieldname);

		if (existingSortIndex !== -1) {
			const existingSort = sortState[existingSortIndex];
			if (existingSort.ascending) {
				// Change to descending
				sortState[existingSortIndex].ascending = false;
			} else {
				// Remove from sortState (not sorted)
				sortState.splice(existingSortIndex, 1);
			}
		} else {
			if (!isCtrlPressed) {
				sortState = [];
			}
			sortState = [...sortState, { field: fieldname, ascending: true }];
		}

		applySort();
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
	function getSortIcon(fieldname: string): string {
		const sort = sortState.find((s) => s.field === fieldname);
		if (sort) {
			return sort.ascending ? '▲' : '▼'; // Use appropriate icons or characters
		}
		return ''; // No icon for not sorted
	}
	function handleDelete(id: string) {
		db.delete('person', id);
	}
	function pluckPerson(id: string): PersonRow | null {
		enabledRow = null;
		applySort();
		// return the person from people array
		const pluckedPerson = people?.find((p) => p.id === id) ?? null;
		return pluckedPerson;
	}
	function handleSave(id: string) {
		const person = pluckPerson(id);
		if (person && isValidPerson(person)) {
			db.Person.update(id, person);
		} else {
			console.error('Invalid person data or person not found');
		}
	}
	function handleSelectChange(fieldname: string, value: string) {
		console.log(`Selected value for ${fieldname}:`, value);
		const person = pluckPerson(enabledRow ?? '');
		if (person) {
			person[fieldname as keyof PersonRow] = value as 'Male' | 'Female' | 'Other';
			// handleSave(person.id);
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
		<div class="wave"></div>
		<div class="wave"></div>
		<div class="wave"></div>

	</div>

{:else}
	<div class="row">

		<button
			class="btn-icon blue with-text"
			onclick={() => {
				sortState = [];
				applySort();
			}}><MIcon name="no-sort" size="24px" /> Clear Sort</button
		>
		<button
			class="btn-icon blue with-text"
			onclick={() => {
				handleShowModal('');
			}}><MIcon name="no-filter" size="24px" />Filters</button
		>
	</div>

	<div class="catalog">
		{#if people}
			{#each people as person}
				{#if person.first_name != 'No'}
					<PersonCard {person} onclick={() => handlePersonClick(person.id)} />
				{/if}
			{/each}
		{/if}
		<div class="wave"></div>
		<div class="wave"></div>
		<div class="wave"></div>
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
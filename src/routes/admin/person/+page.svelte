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
		db.Person.all(
			Object.entries(filters).map(([fieldname, fieldvalue]) => ({ fieldname, fieldvalue }))
		).then((data: PersonRow[] | null) => {
			if (data) {
				people = data;
				if (people.length > 0) {
					personFields = Object.keys(people[0]).filter((field) => !excludedFields.includes(field));
				}
				applySort();
			} else {
				people = [];
			}
		});
	});

	function formatDateToLocal(date: string) {
        if(date.length > 8){
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
		onclick={() => {handleShowModal('')}}><MIcon name="no-filter" size="24px" />Filters</button
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
</div>


<style>
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.catalog{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 90vw;
		margin: 0 auto;
	}
	
</style>

<script lang="ts">
	import type { PersonRow, TieInsertRow } from '$lib/types/database.types';
	import db from '$lib/services/treeDb';
	import { onMount } from 'svelte';

	const {
		person_a,
		person_b,
		person_c,
		onclose
	}: {
		person_a: PersonRow | null;
		person_b: PersonRow | null;
		person_c: PersonRow | null;
		onclose: () => void;
	} = $props();

	let tie = $state<TieInsertRow>({
		name_a: '',
		name_b: '',
		name_c: '',
		person_a: person_a?.id || '',
		person_b: person_b?.id || '',
		person_c: person_c?.id || null,
		tie_relation: 'Child'
	});

	let people: PersonRow[] = $state([]);
	let savable: boolean = $derived(tie.person_a !== '' && tie.person_b !== '');
	
	onMount(async () => {
		people = (await loadPeople()) || [];
	});

	$effect(() => {
		$inspect(`a: ${tie.person_a} b: ${tie.person_b} c: ${tie.person_c}`);
	});

	async function handleSubmit() {
		if (!tie) return;
		await db.Tie.insert(tie);
		onclose();
	}

	async function loadPeople() {
		return await db.Person.all('%', 'first_name', true);
	}
</script>

<div class="content">
	<div class="flex flex-col gap-2">
		<label for="person_a">This person</label>
		<select bind:value={tie.person_a}>
			{#each people as person}
				<option value={person.id}>{person.first_name} {person.last_name}</option>
			{/each}
		</select>
	</div>
	<div class="flex flex-col gap-2">
		<label for="tie_relation">Is the</label>
		<select bind:value={tie.tie_relation}>
			<option value="Child">Child</option>
			<option value="Pet">Pet</option>
		</select>
	</div>
	<div class="flex flex-col gap-2">
		<label for="person_b">Of this person</label>
		<select bind:value={tie.person_b}>
			{#each people as person}
				<option value={person.id}>{person.first_name} {person.last_name}</option>
			{/each}
		</select>
	</div>
	<div class="flex flex-col gap-2">
		<label for="person_c">And (optionally) this person</label>
		<select bind:value={tie.person_c}>
			{#each people as person}
				<option value={person.id}>{person.first_name} {person.last_name}</option>
			{/each}
		</select>
	</div>
	<div class="my-2 flex flex-row justify-between gap-2">
		<button class="submit-btn" onclick={handleSubmit} disabled={!savable}>Apply</button>
		<button class="cancel-btn" onclick={onclose}>Cancel</button>
	</div>
</div>

<style>
	select {
		border-radius: 0.25rem;
		width: 100%;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.cancel-btn {
		background-color: #949494;
		color: #ffffff;
	}
	.submit-btn {
		background-color: green;
		color: #ffffff;
	}
	.content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem;
		background-color: rgb(96, 136, 160);
		border-bottom-left-radius: 0.4rem;
		border-bottom-right-radius: 0.4rem;
		width: 100%;
		height: 430px;
	}
</style>

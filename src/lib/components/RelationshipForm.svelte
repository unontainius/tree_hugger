<script lang="ts">
    import type { PersonRow, TieInsertRow } from '$lib/types/database.types';
    import { toasts } from '$lib/stores/toastStore';
    import  db  from '$lib/services/treeDb';
    import { onMount } from 'svelte';

    const { person_a, person_b, person_c, onclose }: 
    { 
        person_a: PersonRow | null, 
        person_b: PersonRow | null, 
        person_c: PersonRow | null, 
        onclose: () => void 
    } = $props();

    let tie = $state<TieInsertRow>({
        name_a: '',
        name_b: '',
        name_c: '',
        person_a: person_a?.id || '',
        person_b: person_b?.id || '',
        person_c: person_c?.id || '',
        tie_relation: 'Child'
    });

    let people: PersonRow[] = $state([]);
    let savable: boolean = $derived(tie.person_a !== '' && tie.person_b !== '');
    onMount(async () => {
        people = await loadPeople() || [];
    });

    async function handleSubmit() {
        if (!tie) return;
        const createdTie = await db.Tie.insert(tie);
        onclose();
    }

    async function loadPeople() {
        return await db.Person.all(null, 'first_name', true);
    }
</script>

<div class="flex flex-col gap-2 p-4">
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
    <div class="flex flex-row gap-2 justify-between">
        <button class="cancel-btn" onclick={onclose}>Cancel</button>
        <button class="submit-btn" onclick={handleSubmit} disabled={!savable}>Submit</button>
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
        background-color:green;
        color: #ffffff;
    }
</style>


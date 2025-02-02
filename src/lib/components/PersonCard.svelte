<script lang="ts">
    import type { PersonRow } from '$lib/types/database.types';
	import MIcon from './MIcon.svelte';

     let {person, onclick}: {person: PersonRow, onclick: () => void} = $props();

</script>

<button class="person-card" onclick={onclick}>
    {#if person.image_url && person.image_url !== ''}
        <img src={person.image_url} alt="Person Avatar" />
    {:else}
        <MIcon name="no-image" size="80px" /> 
    {/if}
    <div class="person-info">
        <h1>{person.first_name} {person.last_name}</h1>
        <p>{person.born}</p>
        <p>{person.alias}</p>
    </div>
</button>

<style>
    h1 {
        color: #222222;
        font-size: 1rem;
        font-weight: 800;
    }
    p {
        color: #222222;
        font-size: 0.75rem;
        font-weight: 400;
    }

    img {
        width: 80px;
        height: 100%;
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        object-fit: cover;
    }

    .person-card{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 1rem;
        align-items: center;
        border: 1px solid #adadad;
        background-color: rgba(255, 255, 255, 0.445);
        padding: 0;
        border-radius: 0.5rem;
        margin: 0.5rem auto;
        min-width: 260px;
        max-width: 95vw;
        box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.4);
    }
    button:hover{
        background-color: rgb(30, 255, 41);
        color: white;
        cursor: pointer;
        z-index: 100;
    }
    .person-info{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        height: 80px;
    }


</style>



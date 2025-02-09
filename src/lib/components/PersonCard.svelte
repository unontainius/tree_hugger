<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types';
	import MIcon from './MIcon.svelte';
	import { user } from '$lib/stores/authStore';

	let LoggedIn = $state(false);

	$effect(() => {
		// This will run whenever $user changes
		LoggedIn = $user !== null;
	});

	let { person, onclick }: { person: PersonRow; onclick: () => void } = $props();

	function formatDateToLocal(date: string) {
		if (date.length > 8) {
			return new Date(date).toLocaleDateString();
		}
		return date;
	}
</script>

<button class="person-card" {onclick}>
	{#if person.image_url && person.image_url !== ''}
		<img src={person.image_url} alt="missing avatar" />
	{:else}
		<img src="/images/noimage3.png" alt="no avatar" />
	{/if}

	<div class="person-info">
		<div class={LoggedIn ? '' : 'blurred'}>
			<h1>{person.first_name} {person.last_name}</h1>
		</div>
		<div class="info-content">
			<div class={LoggedIn ? '' : 'blurred'}>
				<p>{formatDateToLocal(person.born ?? '')}</p>
			</div>
			<div class={LoggedIn ? '' : 'blurred'}>
				<p>{person.alias}</p>
			</div>

		</div>
	</div>
</button>

<style>
	h1 {
		color: #222222;
		font-size: 1rem;
		font-weight: 800;
        text-align: left;
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

	.person-card {
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
        width: 80px;
	}
	button:hover {
		background-color: rgb(30, 255, 41);
		color: white;
		cursor: pointer;
		z-index: 100;
	}
	.person-info {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		height: 80px;
	}

	.info-content {
		transition: all 0.3s ease;
	}

    .blurred {
		filter: blur(3px);
	}

    @media (max-width: 468px) {
        .person-card {
            flex-direction: row;
            width: 95%;
            height: 120px;
        }
        img {
            width: 120px;
            height: 120px;
            object-fit: cover;
        }

        .person-info {
            height: 120px;
            gap: 0.5rem;
        }
        h1 {
            font-size: 1.1rem;
        }
        p {
            font-size: 1rem;
            text-align: left;
            width: 100%;
        }

    }

</style>



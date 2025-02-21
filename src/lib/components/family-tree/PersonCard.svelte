<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types';
	import { user } from '$lib/stores/authStore';
	import MIcon from '../common/MIcon.svelte';

	let {
		person,
		onclick,
		ondelete,
		showDeleteButton = true
	}: {
		person: PersonRow;
		onclick: () => void;
		ondelete: (personId: string) => void;
		showDeleteButton?: boolean;
	} = $props();

	function formatDateToLocal(date: string) {
		if (date.length > 8) {
			return new Date(date).toLocaleDateString();
		}
		return date;
	}

	function handleDeleteParent(e: Event, personId: string) {
		e.preventDefault();
		console.log('delete', `${personId} ${person.first_name} ${person.last_name}`);
		ondelete(personId);
	}
</script>

<button class="person-card" {onclick}>
	{#if person.image_url && person.image_url !== ''}
		<img src={person.image_url} alt="missing avatar" />
	{:else}
		<img src="/images/noimage3.png" alt="no avatar" />
	{/if}

	<div class="person-info">
		<div class={$user ? '' : 'blurred'}>
			<h1>{person.first_name} {person.last_name}</h1>
		</div>
		<div class="info-row">
			<div class="info-content">
				<div class={$user ? '' : 'blurred'}>
					<p>{formatDateToLocal(person.born ?? '')}</p>
				</div>
				<div class={$user ? '' : 'blurred'}>
					<p>{person.alias}</p>
				</div>
			</div>
			{#if $user && showDeleteButton}
				<div class="actions">
					<div
						class="btn-delete"
						onclick={(e) => {
							e.stopPropagation();
							handleDeleteParent(e, person.id);
						}}
						onkeydown={(e) => {
							if (e.key === 'Delete') {
								e.stopPropagation();
								handleDeleteParent(e, person.id);
							}
						}}
						role="button"
						tabindex="0"
					>
						<MIcon name="close" size="16px" color="#b90404" />
					</div>
				</div>
			{/if}
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
		margin: 0;
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
	.info-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
	.person-info {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		flex-grow: 1;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
	}

	.info-content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		max-height: 100%;
	}

	.blurred {
		filter: blur(3px);
	}
	.btn-delete {
		color: #b90404;
		cursor: pointer;
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

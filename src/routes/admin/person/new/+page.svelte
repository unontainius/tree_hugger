<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types.js';
	import { user } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import db from '$lib/services/treeDb';
	import { toasts } from '$lib/stores/toastStore';
	import MIcon from '$lib/components/common/MIcon.svelte';

	let person = $state<PersonRow>({
		alias: null,
		born: null,
		created_at: new Date().toISOString(),
		died: null,
		email: null,
		first_name: '',
		id: crypto.randomUUID(),
		image_url: null,
		last_name: '',
		maiden_name: null,
		middle_name: null,
		phone_number: null,
		sex: 'Female',
		last_edited_by: ''
	});

	let formIsDirty = $state(false);

	function resetForm() {
		formIsDirty = false;
		person = {
			alias: null,
			born: null,
			created_at: new Date().toISOString(),
			died: null,
			email: null,
			first_name: '',
			id: crypto.randomUUID(),
			image_url: null,
			last_name: '',
			maiden_name: null,
			middle_name: null,
			phone_number: null,
			sex: 'Female',
			last_edited_by: ''
		};

		const fileInputs = document.querySelectorAll('input[type="file"]');
		fileInputs.forEach(input => {
			(input as HTMLInputElement).value = '';
		});
	}
	async function handleSaveForm() {
		if (!$user) return;
		if (!person) return;
		
		try {
			const newPerson = await db.Person.create(person);
			if (newPerson) {
				toasts.success(`Created ${newPerson.first_name} ${newPerson.last_name}`);
				resetForm();
			}
		} catch (error) {
			console.error('Error creating person:', error);
			toasts.error('Failed to create person');
		}
	}
	function handleCancel() {
		goto('/admin/person');
	}
</script>

<div class="page-container">
	<h1>New Person</h1>
	
	<div class="form-container">
		<div class="form-columns">
			<!-- First Column -->
			<div class="form-row">
				<div class="field">
					<div class="required-row">
						<h2>First</h2>
						<MIcon name="asterisk" size="24px" />
					</div>
					<input
						type="text"
						bind:value={person.first_name}
						class={$user ? '' : 'blurred'}
						onchange={() => (formIsDirty = true)}
						disabled={!$user}
						required
					/>
				</div>
				<div class="field">
					<h2>Middle</h2>
					<input
						type="text"
						bind:value={person.middle_name}
						class={$user ? '' : 'blurred'}
						onchange={() => (formIsDirty = true)}
						disabled={!$user}
					/>
				</div>
				<div class="field">
					<div class="required-row">
						<h2>Last</h2>
						<MIcon name="asterisk" size="24px" />
					</div>
					<input
						type="text"
						bind:value={person.last_name}
						class={$user ? '' : 'blurred'}
						onchange={() => (formIsDirty = true)}
						disabled={!$user}
						required
					/>
				</div>
				<div class="field">
					<h2>Maiden</h2>
					<input
						type="text"
						bind:value={person.maiden_name}
						class={$user ? '' : 'blurred'}
						onchange={() => (formIsDirty = true)}
						disabled={!$user}
					/>
				</div>
				<div class="field">
					<h2>Alias</h2>
					<input
						type="text"
						bind:value={person.alias}
						class={$user ? '' : 'blurred'}
						onchange={() => (formIsDirty = true)}
						disabled={!$user}
					/>
				</div>
			</div>

			<!-- Second Column -->
			<div class="form-row">
				<div class="field">
					<h2>Gender</h2>
					<select
						bind:value={person.sex}
						class={$user ? '' : 'blurred'}
						disabled={!$user}
					>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Other">Other</option>
					</select>
				</div>
				<div class="field">
					<div class="required-row">
						<h2>Born</h2>
						<MIcon name="asterisk" size="24px" />
					</div>
					<div class="date-row">
						<input
							type="date"
							bind:value={person.born}
							class={$user ? '' : 'blurred'}
							onchange={() => (formIsDirty = true)}
							disabled={!$user}
							required
						/>
						{#if person.born}
							<button
								class="btn-clear"
								onclick={() => {
									if (person) person.born = null;
								}}
								disabled={!$user}
							>
								<MIcon name="close" size="1.5rem" />
							</button>
						{/if}
					</div>
				</div>
				<div class="field">
					<h2>Phone</h2>
					<input
						type="text"
						bind:value={person.phone_number}
						class={$user ? '' : 'blurred'}
						onchange={() => (formIsDirty = true)}
						disabled={!$user}
					/>
				</div>
				<div class="field">
					<h2>Email</h2>
					<input
						type="email"
						bind:value={person.email}
						class={$user ? '' : 'blurred'}
						onchange={() => (formIsDirty = true)}
						disabled={!$user}
					/>
				</div>
				<div class="field">
					<h2>Died</h2>
					<div class="date-row">
						<input
							type="date"
							bind:value={person.died}
							class={$user ? '' : 'blurred'}
							onchange={() => (formIsDirty = true)}
							disabled={!$user}
						/>
						{#if person.died}
							<button
								class="btn-clear"
								onclick={() => {
									if (person) person.died = null;
								}}
								disabled={!$user}
							>
								<MIcon name="close" size="1.5rem" />
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Button Row -->
		<div class="button-row">
			<button class="btn-cancel" onclick={handleCancel}>
				<MIcon name="close" size="24px" />
				<span>Close</span>
			</button>
			<button class="btn-save" onclick={handleSaveForm} disabled={!formIsDirty}>
				<MIcon name="save" size="24px" />
				<span>Save Changes</span>
			</button>
		</div>
	</div>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 2rem;
		padding-block-start: 6rem;
		gap: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
	}

	.form-container {
		width: min(600px, 90%);
		margin: 0 auto;
	}

	.form-columns {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.form-row {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field h2 {
		color: #fff;
		font-size: 1rem;
		margin: 0;
	}

	.required-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	input, select {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 0.25rem;
		background: white;
		width: 100%;
	}

	.date-row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.btn-clear {
		background: none;
		border: none;
		padding: 0;
		color: #ff3333;
		cursor: pointer;
	}

	.button-row {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.btn-cancel, .btn-save {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		border: none;
		color: white;
		cursor: pointer;
	}

	.btn-cancel {
		background-color: #dc3545;
	}

	.btn-save {
		background-color: #28a745;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.blurred {
		filter: blur(3px);
	}

	input:disabled, select:disabled {
		background: #eee;
		color: #666;
	}

	@media (max-width: 640px) {
		.form-columns {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.button-row {
			justify-content: center;
		}

		.form-container {
			width: 100%;
			padding: 0 1rem;
		}
	}
</style>

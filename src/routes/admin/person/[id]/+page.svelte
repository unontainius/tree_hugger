<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types.js';
	import MIcon from '$lib/components/MIcon.svelte';
	import db from '$lib/services/treeDb';
	import { onMount, onDestroy } from 'svelte';
	import PersonCard from '$lib/components/PersonCard.svelte';
	import ImageCropper from '$lib/components/ImageCropper.svelte';
	import ImageSelector from '$lib/components/ImageSelector.svelte';
	import { imageService } from '$lib/services/imageService';
	import { isLoggedIn } from '$lib/utils/authUtils';
	import ModalDraggable from '$lib/components/Modal.svelte';
	import { toasts } from '$lib/stores/toastStore';
	import { goto, invalidate } from '$app/navigation';
	import RelationshipForm from '$lib/components/RelationshipForm.svelte';
	import Modal from '$lib/components/Modal.svelte';
	
	let { data } = $props();
	let person = $state<PersonRow | null>(data.data as PersonRow);
	let parents = $state<{ parent_b: PersonRow[]; parent_c: PersonRow[] } | null>(null);
	let siblings = $state<PersonRow[] | null>(null);
	let children = $state<{ partners: { partner: PersonRow; children: PersonRow[] }[] } | null>(null);

	let relationshipType = $state<string | 'all' | 'parents' | 'children' | 'siblings' | 'partners' | 'children' | 'partners' | 'unknown'>('all');
	let relationshipFormPersonA = $state<PersonRow | null>(null);
	let relationshipFormPersonB = $state<PersonRow | null>(null);
	let relationshipFormPersonC = $state<PersonRow | null>(null);


	let isLoading = $state(true);

	// Add a hidden file input
	let fileInput: HTMLInputElement;
	let tempImageUrl: string | null = $state(null);

	let showCropper = $state(false);
	let showImageSelector = $state(false);
	let showDeleteConfirmation = $state(false);
	let showRemoveImageConfirmation = $state(false);
	let showRelationshipForm = $state(false);

	let formIsDirty = $state(false);
	let fileToUpload: File | null = $state(null);

	onMount(async () => {
		await loadPageData();
	});

	async function loadPageData(loadWhat: string = 'all') {
		if (!person) return;
		
		try {
			toasts.info(`Loading data for ${person.first_name} ${person.last_name}`, 1000);
			
			if (loadWhat === 'all') {
				// Get fresh person data
				const freshPerson = await db.Person.single(person.id);
				if (freshPerson) {
					person = freshPerson;
				}
			}
			// Load relationships
			if (loadWhat === 'all' ||loadWhat === 'parents' || loadWhat === 'siblings') {
				parents = await db.Tie.Parents(person.id);
				if (parents) {
					for (const parentB of parents.parent_b) {
						for (const parentC of parents.parent_c) {
							siblings = await db.Tie.Siblings(person.id, parentB, parentC);
						}
					}
				}
			}

			if (loadWhat === 'all' || loadWhat === 'children' || loadWhat === 'partners') {
				children = await db.Tie.Children(person.id);
			}

		} catch (error) {
			console.error('Error loading data:', error);
			toasts.error('Failed to load person data');
		} finally {
			isLoading = false;
		}
	}

	async function changePerson(newPerson: PersonRow) {
		if (!newPerson) return;
		if (formIsDirty) {
			await handleSaveForm();
		}
		// Replace current URL in history instead of adding new entry
		await goto(`/admin/person/${newPerson.id}`, {
			replaceState: true // This prevents adding to browser history
		});
		
		// Update the person state
		person = newPerson;
		formIsDirty = false;
		// Reset other states
		parents = null;
		siblings = null;
		children = null;
		isLoading = true;
		
		// Load the new data
		await loadPageData();
	}

	function handleConfirmationRecived(reason: string) {
		showImageSelector = false;
	}

	async function handleRemoveImage() {
		if (!await isLoggedIn()) return;
		console.log('remove image');
	}
	async function handleDeletePerson() {
		if (!await isLoggedIn()) return;
		console.log('delete person');
	}
	async function handleDeleteImage() {
		if (!await isLoggedIn()) return;
		if (!person?.image_url) return;
		
		try {
			// Extract path from URL
			const path = person.image_url.split('/').pop();
			if (!path) throw new Error('Invalid image URL');
			
			await imageService.deleteImage(path);
			
			// Update person record
			await db.Person.update(person.id, { image_url: null });
			const updatedPerson = await db.Person.single(person.id);
			if (updatedPerson) {
				person = updatedPerson;
			}
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	}
	async function handleAddImageFromLocal() {
		if (!await isLoggedIn()) return;
		
		if (!fileInput) {
			fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.accept = 'image/*';
			fileInput.style.display = 'none';
			document.body.appendChild(fileInput);

			fileInput.onchange = async (e: Event) => {
				const target = e.target as HTMLInputElement;
				const file = target.files?.[0];
				
				if (file) {
					try {
						fileToUpload = file;
						tempImageUrl = URL.createObjectURL(file);
						showCropper = true;
					} catch (error) {
						console.error('Error handling file:', error);
					}
				}
			};
		}
		fileInput.click();
	}
	async function handleAddImageFromDatabase() {
		if (!await isLoggedIn()) return;
		showImageSelector = true;
	}

	async function handleImageSelectorComplete() {
		showImageSelector = false;
		// Refresh the person data to show the new image
		if (person) {
			const updatedPerson = await db.Person.single(person.id);
			if (updatedPerson) {
				person = updatedPerson;
			}
		}
	}

	async function handleImageCropComplete(croppedBlob: Blob) {

		
		try {
			// Upload to Supabase Storage
			const { url } = await imageService.uploadImage(croppedBlob);

			// Update person record
			if (person) {
				await db.Person.update(person.id, { image_url: url });
				const updatedPerson = await db.Person.single(person.id);
				if (updatedPerson) {
					person = updatedPerson;
				}
			}
		} catch (e) {
			console.error('Error saving image:', e);
		} finally {
			// Clean up
			if (tempImageUrl) {
				URL.revokeObjectURL(tempImageUrl);
				tempImageUrl = null;
			}
			fileToUpload = null;
			showCropper = false;
		}
	}

	function handleCropCancel() {
		if (tempImageUrl) {
			URL.revokeObjectURL(tempImageUrl);
			tempImageUrl = null;
		}
		fileToUpload = null;
		showCropper = false;
	}
	async function handleSaveForm() {
		if (!await isLoggedIn()) return;
		if (!person) return;
		toasts.success(`saving changes for ${person.first_name} ${person.last_name}`);
		await db.Person.update(person.id, {
			first_name: person.first_name,
			middle_name: person.middle_name,
			last_name: person.last_name,
			maiden_name: person.maiden_name,
			alias: person.alias,
			sex: person.sex,
			born: person.born,
			died: person.died,
			phone_number: person.phone_number,
			email: person.email,
		});
		formIsDirty = false;
	}
	
	$effect(() => {
		if (formIsDirty) {
			toasts.info('Form is dirty', 1500);
		}
	});

	// 	// Refresh the person data
	// 	if (person) {
	// 		const updatedPerson = await db.Person.single(person.id);
	// 		if (updatedPerson) {
	// 			person = updatedPerson;
	// 		}
	// 	}
	// }

	// Clean up on component unmount
	onDestroy(async () => {
		if (tempImageUrl) {
			URL.revokeObjectURL(tempImageUrl);
		}
		if (fileInput) {
			fileInput.remove();
		}
		if (formIsDirty) {
			await handleSaveForm();
		}
		formIsDirty = false;
	});

async function handleAddRelationship(relationship: string = 'unknown', otherPerson: PersonRow | null = null) {
	if (!await isLoggedIn()) return;
	relationshipType = relationship;
	relationshipFormPersonA = null;
	relationshipFormPersonB = null;
	relationshipFormPersonC = null;
	if (relationship === 'Parent') {
		relationshipFormPersonA = person;
		relationshipFormPersonB = null;
		relationshipFormPersonC = null;
	} else if (relationship === 'Sibling') {
		relationshipFormPersonA = null;
		relationshipFormPersonB = parents?.parent_b[0] || null;
		relationshipFormPersonC = parents?.parent_c[0] || null;
	} else if (relationship === 'Partner') {
		relationshipFormPersonA = null;
		relationshipFormPersonB = person;
		relationshipFormPersonC = otherPerson;
	} else if (relationship === 'Child') {
		relationshipFormPersonA = null;
		relationshipFormPersonB = person;
		relationshipFormPersonC = otherPerson;
	}
	showRelationshipForm = true;

}

async function handleRelationshipFormResponse(reason: string) {
	showRelationshipForm = false;
}
async function handleCloseRelationshipForm() {
	if (!person) return;
	changePerson(person);
}
</script>

<div class="nav-container">
	<a class="back-btn" href="/admin/person"><MIcon name="back" size="5rem" /></a>
</div>

{#if showRelationshipForm}
<Modal 
	visible={showRelationshipForm}
	title={`Add ${relationshipType}`}
	showOverlay={true}
	cancelOnOverlayClick={true}
	acceptBtnText="Accept"
	cancelBtnText="Cancel"
	showFooter={false}
	dialogReason={handleRelationshipFormResponse}
	>
	<RelationshipForm 
		person_a = {relationshipFormPersonA}
		person_b = {relationshipFormPersonB}
		person_c = {relationshipFormPersonC}
		onclose={() => handleCloseRelationshipForm()}
	/>
</Modal>
{/if}

<div class="page-container">
	<div class="content-container">
		{#if !person}
			<p>Loading ...</p>
		{:else}
			<!-- Parents -->
			<div class="row-container">
				<div class="column-container">
					<div class="header">
						Parents
						<button class="btn-add" onclick={() => handleAddRelationship('Parent')}>

							<MIcon name="plus" size="42px" />
						</button>
					</div>

					<div class="row-content-container">
						{#if parents}
							<!-- Parent B -->
							{#each parents.parent_b as parent}
								<PersonCard person={parent} onclick={() => changePerson(parent)} />
							{/each}
							<!-- Parent C -->
							{#each parents.parent_c as parent}
								<PersonCard person={parent} onclick={() => changePerson(parent)} />
							{/each}
						{/if}
					</div>
				</div>
			</div>
			<!-- Immediate Family -->
			<div class="row-container">
				<div class="column-container">
					<div class="header">
						Imediate Family
						<button class="btn-add" onclick={() => handleAddRelationship('Sibling')}>
							<MIcon name="plus" size="42px" />
						</button>
					</div>
					<div class="row-content-container">
						{#if siblings}
							{#each siblings as sibling}
								<PersonCard person={sibling} onclick={() => changePerson(sibling)} />
							{/each}
						{/if}
					</div>
				</div>
			</div>
			<!-- Main Character info -->
			<div class="image-controls-row">
				<div class="image-container-column">
					<h1>{person.first_name} {person.last_name}</h1>

					<div class="image-header-row">
						<div class="image-container-column">
							<!-- Image -->
							<div class="image">
								<img src={person.image_url} alt="Person Avatar" />
							</div>
							<!-- Image buttons -->
						</div>
						<div class="image-buttons-column">
							<button class="image-btn" 
								onclick={handleAddImageFromLocal} 
								title="Load Image from your Device"
							>
								<MIcon name="open-file" size="32px" />
							</button>
							<button class="image-btn" 
								onclick={handleAddImageFromDatabase} 
								title="Download Image from our database"
							>
								<MIcon name="download" size="32px" />
							</button>
							<button
								class="image-btn"
								onclick={handleRemoveImage}
								title="Remove this Image from this Person"
							>
								<MIcon name="no-image" size="32px" />
							</button>

						</div>
					</div>
					<div class="image-delete-row">
						<button class="btn-delete" 
							onclick={handleDeletePerson}
							title="Permanently Delete this Person from the database"
						>
							<MIcon name="bomb" size="24px" />
							Erase this Person from Existance
						</button>
					</div>
				</div>

				<!-- Person info (2 columns)-->
				<div class="info-column">
					<div class="info-row">
						<div class="info-content-column">
							<div class="field">
								<h2>First</h2>
								<input type="text" bind:value={person.first_name} onchange={() => formIsDirty = true}/>
							</div>
							<div class="field">
								<h2>Middle</h2>
								<input type="text" bind:value={person.middle_name} onchange={() => formIsDirty = true}/>
							</div>
							<div class="field">
								<h2>Last Name</h2>
								<input type="text" bind:value={person.last_name} onchange={() => formIsDirty = true}/>
							</div>
							<div class="field">
								<h2>Maiden</h2>
								<input type="text" bind:value={person.maiden_name} onchange={() => formIsDirty = true}/>
							</div>
							<div class="field">
								<h2>Alias</h2>
								<input type="text" bind:value={person.alias} onchange={() => formIsDirty = true}/>
							</div>
						</div>
						<div class="info-content-column">
							<div class="field">
								<h2>Gender</h2>
								<select bind:value={person.sex}>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
							</div>
							<div class="field">
								<h2>Born</h2>
								<div class="row-content-container-text">
									<input type="date" bind:value={person.born} onchange={() => formIsDirty = true}/>
									{#if person.born}
										<button
											class="btn-clear"
											onclick={() => {
												if (person) {
													person.born = null;
												}
											}}
										>
											<MIcon name="x" size="1.5rem" />
										</button>
									{/if}
								</div>
							</div>
	
							<div class="field">
								<h2>Phone</h2>
								<input type="text" bind:value={person.phone_number} onchange={() => formIsDirty = true}/>
							</div>
							<div class="field">
								<h2>Email</h2>
								<input type="email" bind:value={person.email} onchange={() => formIsDirty = true}/>
							</div>
	
							<div class="field">
								<h2>Died</h2>
								<div class="row-content-container-text">
									<input type="date" bind:value={person.died} onchange={() => formIsDirty = true}/>
									{#if person.died}
										<button
											class="btn-clear"
											onclick={() => {
												if (person) {
													person.died = null;
												}
											}}
										>
											<MIcon name="x" size="1.5rem" />
										</button>
									{/if}
								</div>
							</div>
						</div>
					</div>
					<div class="flex flex-row self-end gap-2">
						<button class="btn-save" onclick={() => handleSaveForm()} disabled={!formIsDirty}>
							<MIcon name="tick-2" size="42px" /> Save Changes
						</button>
					</div>
				</div>
			</div>

			<!-- Relationships -->
			{#if isLoading}
				<p>Loading ...</p>
			{:else}
				<div class="row-content-container">
					{#if children && children.partners.length > 0}
						{#each children.partners as partnerGroup}
							<div class="row-container left">
								<div class="column-container">
									<div class="header">
										Partnership
										<button class="btn-add" onclick={() => handleAddRelationship('Partner')}>
											<MIcon name="plus" size="42px" />
										</button>
									</div>
									<PersonCard person={partnerGroup.partner} onclick={() => changePerson(partnerGroup.partner)} />
								</div>
								<div class="column-container left">
									<div class="header left">
										Children
										<button class="btn-add" onclick={() => handleAddRelationship('Child', partnerGroup.partner)}>
											<MIcon name="plus" size="42px" />
										</button>
									</div>
									<div class="row-content-container">
										{#each partnerGroup.children as child}
											{#if child.first_name !== 'No'}
												<PersonCard person={child} onclick={() => changePerson(child)} />
											{/if}
										{/each}
									</div>
								</div>
							</div>
						{/each}
					{:else}
						<!-- Show empty state with add buttons -->
						<div class="row-container left">
							<div class="column-container">
								<div class="header">
									Partnership
									<button class="btn-add" onclick={() => handleAddRelationship('Partner')}>
										<MIcon name="plus" size="42px" />
									</button>
								</div>
							</div>
							<div class="column-container left">
								<div class="header left">
									Children
									<button class="btn-add" onclick={() => handleAddRelationship('Child')}>
										<MIcon name="plus" size="42px" />
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</div>
{#if person}
	{#if showCropper}
		<ImageCropper 
			personId={person.id} 
			imageUrl={tempImageUrl || person.image_url}
			{showCropper}
			onComplete={handleImageCropComplete}
			onCancel={handleCropCancel}
		/>
	{/if}

	{#if showImageSelector}
		<ModalDraggable
			visible={showImageSelector}
			title="Select Image"
			showOverlay={true}
			cancelOnOverlayClick={true}
			acceptBtnText="Select"
			cancelBtnText="Cancel"
			showFooter={false}
			dialogReason={(reason: string) => {
				handleConfirmationRecived(reason);
			}}
			>
			<ImageSelector 
				personId={person.id} 
				onComplete={handleImageSelectorComplete}
				/>
		</ModalDraggable>
	{/if}
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}
	.page-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f0f0f0;
		background-image: url('/images/leaves.jpg');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		padding: 0;
		margin: 0;
		padding-block: 1rem;
		width: 100%;
		box-sizing: border-box;
	}
	.content-container {
		display: flex;
		flex-direction: column;
		background-color: #f0f0f0;
		gap: 1rem;
		max-width: 1224px;
		width: 100%;
		background-color: transparent;
		padding: 0.5rem;
		border-radius: 0.5rem;
		box-sizing: border-box;
	}
	.column-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
	}
	.row-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		background-color: rgba(255, 255, 255, 0.205);
		width: 100%;
		min-height: 200px;
		padding: 0.5rem;
		padding-block-start: 0;
		border-radius: 0.25rem;
		border: none;
	}
	.row-content-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		width: 100%;
	}
	.row-content-container-text {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
		flex-wrap: wrap;
		width: 100%;
		position: relative;
	}
	.image {
		width: 320px;
		height: 360px;
		background-color: rgb(255, 255, 255);
		padding: 10px;
		padding-bottom: 40px;
		transform: rotate(3deg);
		transition: transform 0.3s ease-in-out;
		border-radius: 0.5rem;
		box-shadow: 0 0 1.5rem 0 rgba(0, 0, 0, 0.8);
	}
	.image:hover {
		transform: rotate(0deg) scale(1.4);
		box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.8);
		z-index: 100;
	}
	.image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		background-color: rgb(22, 22, 22);
		color: rgb(212, 212, 212);
	}
	.image-controls-row {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
		gap: 2rem;
		width: 100%;
		flex-wrap: wrap;
		background-color: rgba(255, 255, 255, 0.322);
		border-radius: 0.5rem;
		padding-block: 1rem;
	}
	.image-container-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		min-width: 320px;
		max-width: 420px;
		flex: 1;
	}
	.image-header-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		width: 100%;
	}
	.image-buttons-column {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
		padding: 0.5rem;
		min-width: 48px;
	}
	.image-delete-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.info-column {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		padding: 1rem;
		min-width: 320px;
		max-width: 520px;
		flex: 1;
	}	
	.info-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.info-content-column {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		width: 100%;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0;
		padding: 0;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
	}
	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: medium;
		margin: 0;
		padding: 0;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
		letter-spacing: 0.1rem;
		margin-block-end: 0.5rem;
		width: 100%;
	}
	input,
	select {
		border-radius: 0.25rem;
		border: 1px solid rgb(122, 122, 122);
		box-shadow: 0 0 0.25rem 0 rgba(0, 0, 0, 0.5);
	}

	.field {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0.35rem;
	}

	.btn-clear {
		position: absolute;
		top: 2px;
		/* transform: translateY(-45%); */
		right: -5px;
		background-color: white;
		border: none;
		border-radius: 0;
		padding: 0;
		color: red;
		box-shadow: none;
		z-index: 10;
	}

	.btn-add {
		border-radius: 0;
		padding: 0.25rem;
		color: rgb(255, 255, 255);
		width: 48px;
		height: 48px;
		border-radius: 50%;
	}
	.btn-delete {
		background-color: red;
		margin-block-start: 1.5rem;
	}
	.btn-save {
		padding-inline: 0;
		padding-inline-end: 1rem;
		padding-block: 0;
		background-color: green;
		margin-block-start: 2rem;
		margin-inline-end: 4rem;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.nav-container {
		position: absolute;
		top: 2rem;
		left: 1.5rem;
		color: white;
	}
	.left {
		justify-content: flex-start;
		align-items: center;
	}
	.row-container.left {
		justify-content: flex-start;
		align-items: start;
	}


	@media (max-width: 768px) {
		.image-controls-row {
			flex-direction: column;
			align-items: center;
		}

		.image-container-column,
		.info-column {
			width: 100%;
			max-width: 600px;
			padding: 0.5rem;
		}

		.info-row {
			gap: 0;
			justify-content: space-between;
		}

		.info-content-column {
			padding: 0 0.5rem;
			max-width: 50%;
		}

		.field {
			padding: 0.25rem;
		}

		.image {
			width: 90%;
			max-width: 380px;
			height: auto;
			aspect-ratio: 1/1.1;
		}
	}

	@media (max-width: 480px) {
		.info-row {
			flex-direction: column;
		}

		.info-content-column {
			width: 100%;
		}

		input, select {
			width: 100%;
		}

		.image-header-row {
			flex-direction: column;
			gap: 0.5rem;
		}

		.image-buttons-column {
			flex-direction: row;
			gap: 0.25rem;
			padding: 0.5rem;
			min-width: unset;
			width: 100%;
			justify-content: center;
		}

		.image-btn {
			margin: 8px;
			padding-inline: 0.5rem;
			transform: scale(0.9);
		}
	}
</style>

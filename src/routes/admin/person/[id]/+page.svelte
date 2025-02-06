<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types.js';
	import { onMount, onDestroy } from 'svelte';
	import { imageService } from '$lib/services/imageService';
	import { isLoggedIn } from '$lib/utils/authUtils';
	import { toasts } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { authService } from '$lib/services/authService';
	import MIcon from '$lib/components/MIcon.svelte';
	import db from '$lib/services/treeDb';
	import PersonCard from '$lib/components/PersonCard.svelte';
	import ImageCropper from '$lib/components/ImageCropper.svelte';
	import ImageSelector from '$lib/components/ImageSelector.svelte';
	import RelationshipForm from '$lib/components/RelationshipForm.svelte';
	import Window from '$lib/components/Window.svelte';
	import { user } from '$lib/stores/authStore';

	let { data } = $props();
	let person = $state<PersonRow | null>(data.data as PersonRow);
	let parents = $state<{ parent_b: PersonRow[]; parent_c: PersonRow[] } | null>(null);
	let siblings = $state<PersonRow[] | null>(null);
	let children = $state<{ partners: { partner: PersonRow; children: PersonRow[] }[] } | null>(null);

	let relationshipType = $state<
		| string
		| 'all'
		| 'parents'
		| 'children'
		| 'siblings'
		| 'partners'
		| 'children'
		| 'partners'
		| 'unknown'
	>('all');
	let relationshipFormPersonA = $state<PersonRow | null>(null);
	let relationshipFormPersonB = $state<PersonRow | null>(null);
	let relationshipFormPersonC = $state<PersonRow | null>(null);

	let isLoading = $state(true);

	// Add a hidden file input
	let fileInput: HTMLInputElement;
	let tempImageUrl: string | null = $state(null);

	let showCropper = $state(false);
	let showImageSelector = $state(false);
	let imageSelectorWidth = $state(0);
	let imageSelectorHeight = $state(0);
	let showDeletePersonConfirmation = $state(false);
	let showDeleteImageConfirmation = $state(false);
	let itemToDelete = $state<'Person' | 'Image' | null>(null);
	let showRelationshipForm = $state(false);
	let addingNewUser = $state(false);

	let formIsDirty = $state(false);
	let fileToUpload: File | null = $state(null);

	let LoggedIn = $state(false);

	$effect(() => {
		// This will run whenever $user changes
		LoggedIn = $user !== null;
	});

	onMount(() => {
		// Set dimensions only after component is mounted (client-side)
		imageSelectorWidth = window.innerWidth * 0.8;
		imageSelectorHeight = window.innerHeight * 0.8;
	});

	onMount(async () => {
		await loadPageData();
	});

	async function loadPageData(loadWhat: string = 'all') {
		if (!person) {
			addingNewUser = true;
			person = {
				alias: null,
				born: new Date().toISOString(),
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
				last_edited_by: (await authService.getCurrentUser())?.email || ''
			};
		}
		67;
		if (!addingNewUser) {
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
				if (loadWhat === 'all' || loadWhat === 'parents' || loadWhat === 'siblings') {
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
	}

	async function changePerson(newPerson: PersonRow | null) {
		if (formIsDirty) {
			await handleSaveForm();
		}
		// Replace current URL in history instead of adding new entry
		await goto(`/admin/person/${newPerson?.id}`, {
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
		if (!(await isLoggedIn())) return;
		console.log('remove image');
	}
	async function handleDeleteConfirmation(item: 'Person' | 'Image') {
		if (!(await isLoggedIn())) return;
		itemToDelete = item;
		if (item === 'Person') {
			showDeletePersonConfirmation = true;
		} else if (item === 'Image') {
			showDeleteImageConfirmation = true;
		}
	}
	async function handleDeleteImage() {
		if (!(await isLoggedIn())) return;
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
		if (!(await isLoggedIn())) return;

		if (!fileInput) {
			fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.accept = 'image/*';
			fileInput.style.display = 'none';
			document.body.appendChild(fileInput);

			fileInput.onchange = async (e: Event) => {
				const file = (e.target as HTMLInputElement).files?.[0];
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
		if (!(await isLoggedIn())) return;
		// debugState.showImageSelector = true;
		// debugState.personId = person?.id || null;
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
		if (!(await isLoggedIn())) return;
		if (!person) return;
		console.log('handleSaveForm', person);
		toasts.success(`saving changes for ${person.first_name} ${person.last_name}`);
		if (addingNewUser) {
			const data = await db.Person.create(person).then(async (newPerson) => {
				if (newPerson) {
					addingNewUser = false;
					goto(`/admin/person/${newPerson.id}`, { replaceState: true });
				}
			});
		} else {
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
				email: person.email
			});
		}
		formIsDirty = false;
	}

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

	async function handleAddRelationship(
		relationship: string = 'unknown',
		otherPerson: PersonRow | null = null
	) {
		if (!(await isLoggedIn())) return;
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

	async function handleCloseRelationshipForm() {
		if (!person) return;
		showRelationshipForm = false;
		changePerson(person);
	}

	// Update the state with both the boolean and a message
	function openImageSelector() {
		showImageSelector = true;
		// debugMessage = 'Image selector opened';
	}

	function closeImageSelector() {
		// debugState.showImageSelector = false;
		// debugState.personId = null;
		showImageSelector = false;
	}

	function handleDeleteConfirmationResponce(response: boolean) {
		if (response) {
			handleDeleteItem();
		}
	}
	async function handleDeleteItem() {
		if (itemToDelete === 'Person') {
			if (!person) return;
			await db.delete('person', person.id);
			showDeletePersonConfirmation = false;
			await goto('/admin/person', { replaceState: true });
		} else if (itemToDelete === 'Image') {
			if (!person) return;
			person.image_url = null;
			await db.Person.update(person.id, { image_url: null });
			showDeleteImageConfirmation = false;
		}

		itemToDelete = null;
		toasts.success(`Item successfully removed from the database.`);
	}
</script>

<div class="nav-container">
	<a class="back-btn" href="/admin/person"><MIcon name="back" size="5rem" /></a>
	{#if !addingNewUser}
		<div class="btn-add-container">
			<button class="btn-add-new-person" onclick={() => changePerson(null)}>
				<MIcon name="plus" size="52px" />
			</button>
		</div>
	{/if}
</div>

<div class="page-container">
	<div class="content-container">
		{#if !addingNewUser}
			{#if person}
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
			{/if}
		{/if}
		<!-- Main Character info -->
		<div class="image-controls-row">
			{#if !addingNewUser}
				{#if person}
					<div class="image-container-column">
						<div class="redacted-container">
							<h1 class = { LoggedIn ? 'image-header-title' : 'image-header-title blurredx2'}>
								{person.first_name} {person.last_name}
							</h1>
						</div>

						<div class="image-header-row">
							<div class="image-container-column">
								<!-- Image -->
								<div class="image">
									{#if person.image_url?.length && person.image_url.length > 10}
										<img src={person.image_url} alt="Person Avatar" />
									{:else}
										<img src="/images/noimage3.png" alt=" no Personal Avatar yet" />
									{/if}
								</div>
								<!-- Image buttons -->
							</div>
							<div class="image-buttons-column">
								<button
									class="image-btn"
									onclick={handleAddImageFromLocal}
									title="Load Image from your Device"
								>
									<MIcon name="open-file" size="32px" />
								</button>
								<button
									class="image-btn"
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
							<button
								class="btn-delete"
								onclick={() => handleDeleteConfirmation('Person')}
								title="Permanently Delete this Person from the database"
							>
								<MIcon name="bomb" size="64px" />
								<div class="column-container">
									<p>Forever! No backsies.</p>
									<p>The end. Finito</p>
								</div>
							</button>
						</div>
					</div>
				{/if}
			{:else}
				<div class="new-person-col">
					<h1>New Person</h1>
				</div>
			{/if}
			{#if person}
				<!-- Person info (2 columns)-->

				<div class="info-column">
					<div class="info-row">
						<div class="info-content-column">
							<div class="field">
								<h2>First</h2>

									<input class={LoggedIn ? '' : 'blurred'}
										type="text"
										bind:value={person.first_name}
										onchange={() => (formIsDirty = true)}
										disabled={LoggedIn === false}

									/>
							</div>
							<div class="field">
								<h2>Middle</h2>
								<div class="redacted-container">
									<input class={LoggedIn ? '' : 'blurred'}
										type="text"
										bind:value={person.middle_name}
										onchange={() => (formIsDirty = true)}
										disabled={LoggedIn === false}
									/>
								</div>
							</div>
							<div class="field">

								<h2>Last Name</h2>
								<div class="redacted-container">
									<input class={LoggedIn ? '' : 'blurred'}
										type="text"
										bind:value={person.last_name}
										onchange={() => (formIsDirty = true)}
										disabled={LoggedIn === false}
									/>
								</div>
							</div>
							<div class="field">
								<h2>Maiden</h2>
								<div class="redacted-container">
									<input class={LoggedIn ? '' : 'blurred'}
										type="text"
										bind:value={person.maiden_name}
										onchange={() => (formIsDirty = true)}
										disabled={LoggedIn === false}
									/>
								</div>
							</div>
							<div class="field">
								<h2>Alias</h2>
								<div class="redacted-container">
									<input class={LoggedIn ? '' : 'blurred'}
										type="text"
										bind:value={person.alias}
										onchange={() => (formIsDirty = true)}
										disabled={LoggedIn === false}
									/>
								</div>
							</div>
						</div>
						<div class="info-content-column">
							<div class="field">
								<h2>Gender</h2>
								<div class={LoggedIn ? '' : 'blurred'}>
									<select bind:value={person.sex} disabled={LoggedIn === false}>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</select>
								</div>
							</div>
							<div class="field">
								<h2>Born</h2>
								<div class="row-content-container-text">
									<div class="redacted-container">
										<input class={LoggedIn ? '' : 'blurred'}
											type="date"
											bind:value={person.born}
											onchange={() => (formIsDirty = true)}
											disabled={LoggedIn === false}
										/>
										{#if person.born}
											<button
												class="btn-clear"
												onclick={() => {
													if (person) {
														person.born = null;
													}
												}}
												disabled={LoggedIn === false}
											>
												<MIcon name="x" size="1.5rem" />
											</button>
										{/if}
									</div>
								</div>
							</div>

							<div class="field">
								<h2>Phone</h2>
								<div class="redacted-container">
									<input class={LoggedIn ? '' : 'blurred'}
										type="text"
										bind:value={person.phone_number}
										onchange={() => (formIsDirty = true)}
										disabled={LoggedIn === false}
									/>
								</div>
							</div>
							<div class="field">
								<h2>Email</h2>
								<div class="redacted-container">
									<input class={LoggedIn ? '' : 'blurred'}
										type="email"
										bind:value={person.email}
										onchange={() => (formIsDirty = true)}
										disabled={LoggedIn === false}
									/>

								</div>
							</div>

							<div class="field">
								<h2>Died</h2>
								<div class="row-content-container-text">
									<div class="redacted-container">
										<input class={LoggedIn ? '' : 'blurred'}
											type="date"
											bind:value={person.died}
											onchange={() => (formIsDirty = true)}
											disabled={LoggedIn === false}
										/>
										{#if person.died}
											<button
												class="btn-clear"
												onclick={() => {
													if (person) {
														person.died = null;
													}
												}}
												disabled={LoggedIn === false}
											>
												<MIcon name="x" size="1.5rem" />
											</button>
										{/if}

									</div>
								</div>
							</div>
							<button class="btn-save" onclick={() => handleSaveForm()} disabled={!formIsDirty}>
								<MIcon name={LoggedIn ? 'tick-2' : 'locked'} size="42px" /> Save Changes
							</button>
						</div>
					</div>
					<div class="flex flex-row gap-2 self-end"></div>
				</div>
			{/if}
		</div>

		{#if !addingNewUser}
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
									<PersonCard
										person={partnerGroup.partner}
										onclick={() => changePerson(partnerGroup.partner)}
									/>
								</div>
								<div class="column-container left">
									<div class="header left">
										Children
										<button
											class="btn-add"
											onclick={() => handleAddRelationship('Child', partnerGroup.partner)}
										>
											<MIcon name="plus" size="42px" />
										</button>
									</div>
									<div class="row-content-container">
										{#if partnerGroup.children.length > 0}
											{#if partnerGroup.children[0].first_name !== 'No'}
												<MIcon name="chevron-right" size="42px" />
											{/if}
											{#each partnerGroup.children as child}
												{#if child.first_name !== 'No'}
													<PersonCard person={child} onclick={() => changePerson(child)} />
												{/if}
											{/each}
										{/if}
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

{#if person && showImageSelector}
	<div style="position: fixed; inset: 0; z-index: 9998;">
		<Window
			title="Image Selector"
			onClose={closeImageSelector}
			showMinimize={false}
			showMaximize={true}
			showFooter={false}
			preset="large"
		>
			<ImageSelector personId={person.id} onComplete={handleImageSelectorComplete} />
		</Window>
	</div>
{/if}

{#if person && showCropper}
	<div style="position: fixed; inset: 0; z-index: 9998;">
		<Window
			title="Crop Image"
			onClose={handleCropCancel}
			showMinimize={false}
			showMaximize={false}
			showFooter={false}
			initialSize={{ width: window.innerWidth > 520 ? 520 : window.innerWidth, height: 660 }}
			initialPosition={{
				x: window.innerWidth / 2 - (window.innerWidth > 520 ? 520 : window.innerWidth / 2),
				y: window.innerHeight / 2 - 660 / 2
			}}
		>
			<ImageCropper
				personId={person.id}
				imageUrl={tempImageUrl || person.image_url}
				{showCropper}
				onComplete={handleImageCropComplete}
				onCancel={handleCropCancel}
			/>
		</Window>
	</div>
{/if}

{#if (person && showDeletePersonConfirmation) || showDeleteImageConfirmation}
	<div style="position: fixed; inset: 0; z-index: 9998;">
		<Window
			title="Delete Confirmation"
			showMinimize={false}
			showMaximize={false}
			onClose={() => {
				itemToDelete === 'Person'
					? (showDeletePersonConfirmation = false)
					: (showDeleteImageConfirmation = false);
			}}
			showFooter={true}
			acceptButtonText={`Yes, remove ${itemToDelete === 'Person' ? person?.first_name : ' this Image'}`}
			cancelButtonText="Cancel"
			preset="small"
			initialSize={{ width: window.innerWidth > 520 ? 520 : window.innerWidth, height: 660 }}
			initialPosition={{
				x: window.innerWidth / 2 - (window.innerWidth > 520 ? 520 : window.innerWidth / 2),
				y: window.innerHeight / 2 - 660 / 2
			}}
			onDialogResponse={handleDeleteConfirmationResponce}
		>
			<div class="item-to-delete-container">
				<MIcon name="exclamation" size="128px" />
				<p>
					Are you sure you want to Remove this {itemToDelete === 'Person' ? 'person' : 'image'}?
				</p>
			</div>
		</Window>
	</div>
{/if}

{#if person && showRelationshipForm}
	<div style="position: fixed; inset: 0; z-index: 9998;">
		<Window
			title={`Add ${relationshipType}`}
			onClose={() => {
				showRelationshipForm = false;
			}}
			showMinimize={false}
			showMaximize={false}
			showFooter={false}
			initialSize={{ width: 320, height: 500 }}
		>
			<RelationshipForm
				person_a={relationshipFormPersonA}
				person_b={relationshipFormPersonB}
				person_c={relationshipFormPersonC}
				onclose={() => handleCloseRelationshipForm()}
			/>
		</Window>
	</div>
{/if}

<style>

	.page-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
		z-index: 10000;
		transform: rotate(0deg) scale(1.5);
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
	.image-header-title {
		width: 100%;
		justify-self: flex-start;
		font-size: 2.5rem;
		margin: 0;
		margin-block-end: 2rem;
		padding-inline-start: 1rem;
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
		justify-content: start;
		width: 100%;
	}
	.image-btn {
		margin: 8px;
		padding: 1rem;
		transform: scale(0.9);
		border-radius: 2rem;
	}
	.info-column {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		padding: 1rem;
		padding-block-start: 2rem;
		min-width: 320px;
		max-width: 520px;
		flex: 1;
	}
	.info-row {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: center;
		width: 100%;
		padding-block-start: 2rem;
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
		color: black;
	}
	.blurred {
		filter: blur(3px);
	}
	.blurredx2 {
		filter: blur(6px);
	}
	input:disabled,
	select:disabled {
		background-color: #bbbbbb;
		color: #222222;
	}
	.field button:disabled {
		background-color: #bbbbbb;
		color: #222222;
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
		border-top-left-radius: 2rem;
		border-bottom-left-radius: 2rem;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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

	.left {
		justify-content: flex-start;
		align-items: center;
	}
	.row-container.left {
		justify-content: flex-start;
		align-items: start;
	}
	.new-person-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.btn-add-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}
	.btn-add-new-person {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-radius: 5rem;
		padding: 0.5rem;
	}
	.item-to-delete-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		height: 100%;
		width: 100%;
		background-color: rgba(255, 0, 0, 0.5);
		color: white;
		padding: 1rem;
		padding-block: 0;
		font-size: 1.5rem;
		font-weight: medium;
		text-align: center;
	}

	.lock-icon {
		position: absolute;
		right: 35%;
		top: 50%;
		transform: translateY(-50%);
		font-size: 14px;
	}
	.censor-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.25rem;
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
		.image-header-title {
			padding-inline-start: 0rem;
			justify-self: center;
			text-align: center;
		}
		.info-row {
			gap: 0;
			justify-content: space-between;
			padding: 0;
		}

		.info-content-column {
			padding: 0 0.5rem;
			max-width: 50%;
		}

		.field {
			padding-block-start: 1rem;
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
			flex-direction: row;
		}

		.info-content-column {
			width: 180px;
		}

		input,
		select {
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
	}
</style>

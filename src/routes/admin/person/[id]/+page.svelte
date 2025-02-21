<script lang="ts">
	import type { PersonRow } from '$lib/types/database.types.js';
	import { onMount, onDestroy } from 'svelte';
	import { imageService } from '$lib/services/imageService';
	import { isLoggedIn } from '$lib/utils/authUtils';
	import { toasts } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { authService } from '$lib/services/authService';
	import MIcon from '$lib/components/common/MIcon.svelte';
	import db from '$lib/services/treeDb';
	import PersonCard from '$lib/components/family-tree/PersonCard.svelte';
	import ImageCropper from '$lib/components/common/ImageCropper.svelte';
	import ImageSelector from '$lib/components/common/ImageSelector.svelte';
	import RelationshipForm from '$lib/components/family-tree/RelationshipForm.svelte';
	import Window from '$lib/components/common/Window.svelte';
	import { user } from '$lib/stores/authStore';
	import { menuRequired, menuName } from '$lib/stores/menuStore';
	import { PersonIdStore } from '$lib/stores/signalStore.js';

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
	let isPageLoading = $state(true);

	// Add a hidden file input
	let fileInput: HTMLInputElement;
	let tempImageUrl: string | null = $state(null);

	let showCropper = $state(false);
	let showImageSelector = $state(false);

	let showDeletePersonConfirmation = $state(false);
	let showDeleteImageConfirmation = $state(false);
	let showDeleteParentConfirmation = $state(false);

	let showDeleteConfirmation = $state(false);
	let deleteFunction = $state<() => Promise<void>>(() => Promise.resolve());
	let deleteMessage = $state<string | null>(null);

	let itemToDelete = $state<'Person' | 'Image' | 'Parent' | null>(null);
	let showRelationshipForm = $state(false);
	let addingNewUser = $state(false);

	let formIsDirty = $state(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let fileToUpload: File | null = $state(null);

	onMount(async () => {
		isPageLoading = true;
		// Keep menu but ensure it's properly configured
		$menuRequired = true;
		$menuName = 'family-tree'; // Set the correct menu for this page

		await loadPageData();
		isPageLoading = false;
	});

	async function loadPageData(loadWhat: string = 'all') {
		// Check for "0" or null ID to trigger new person creation
		if (!person || data.data === null || person.id === '0') {
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
			return; // Exit early since we're creating a new person
		}

		if (!addingNewUser) {
			try {
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
		// if (!(await isLoggedIn())) return;
		if (formIsDirty) {
			await handleSaveForm();
		}

		// Reset states when changing person
		addingNewUser = false; // Reset this first
		person = null; // Reset person before loading new data
		parents = null;
		siblings = null;
		children = null;
		isLoading = true;
		formIsDirty = false;

		// Replace current URL in history instead of adding new entry
		await goto(`/admin/person/${newPerson?.id || '0'}`, {
			replaceState: true // This prevents adding to browser history
		});

		// Update the person state and load data
		if (newPerson) {
			person = newPerson;
		}

		// Load the new data (this will handle creating new person if id is "0")
		await loadPageData();
	}
	async function handleRemoveImage() {
		if (!user) return;
		console.log('remove image');
	}
	async function handleDeleteConfirmation(item: 'Person' | 'Image' | 'Parent') {
		if (!user) return;
		itemToDelete = item;
		if (item === 'Person') {
			showDeletePersonConfirmation = true;
		} else if (item === 'Image') {
			showDeleteImageConfirmation = true;
		}
	}
		async function handleAddImageFromLocal() {
		if (!(await isLoggedIn())) return;

		// Remove existing fileInput if it exists
		if (fileInput) {
			fileInput.remove();
		}

		// Create new file input
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
					// Revoke previous tempImageUrl if it exists
					if (tempImageUrl) {
						URL.revokeObjectURL(tempImageUrl);
					}
					tempImageUrl = URL.createObjectURL(file);
					showCropper = true;
				} catch (error) {
					console.error('Error handling file:', error);
				}
			}
		};

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
			await db.Person.create(person).then(async (newPerson) => {
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

		// Reset menu name when leaving
		$menuName = 'home';
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
			console.log('handleAddRelationship', relationship, otherPerson, person?.id);
		}
		showRelationshipForm = true;
	}
	async function handleCloseRelationshipForm() {
		if (!person) return;
		showRelationshipForm = false;
		relationshipFormPersonA = null;
		relationshipFormPersonB = null;
		relationshipFormPersonC = null;
		changePerson(person);
	}

	function closeImageSelector() {
		// debugState.showImageSelector = false;
		// debugState.personId = null;
		showImageSelector = false;
	}
	function handleDeleteConfirmationResponce(response: boolean) {
		// console.log('handleDeleteConfirmationResponce', response);
		if (response) {
			handleDeleteItem();
		} else {
			showDeletePersonConfirmation = false;
			showDeleteImageConfirmation = false;
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
	async function handleDeleteParent(parentId: string) {
		if (!person) return;
		// set the delete function and message
		console.log('handleDeleteParent', parentId);
		deleteFunction = () => deleteParent(parentId);
		
		deleteMessage = `
			<div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem;">
				<p style="font-size: 1.2rem; font-weight: bold;">Remove this Parent?</p>
				<p>Only the relationship will be removed.  NOT the person.</p>
			</div>`;
		showDeleteConfirmation = true;
	}

	async function deleteParent(parentId: string) {
		if (!person) return;
		const response = await db.Tie.deleteParent(person.id, parentId);
		if (response) {
			await changePerson(person);
		}
		// reset the delete confirmation
		showDeleteConfirmation = false;
		deleteFunction = () => Promise.resolve();
		deleteMessage = null;
	}

	function handleDeleteSibling(siblingId: string) {
		if (!person) return;
		console.log('handle DEL', siblingId);
		showDeleteConfirmation = true;
		deleteFunction = () => deleteSibling(siblingId);
		deleteMessage = `
				<div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem;">
					<p style="font-size: 1.2rem; font-weight: bold;">Remove this Sibling?</p>
				<p>Only the relationship will be removed.  NOT the person.</p>
			</div>`;
	}
	async function deleteSibling(siblingId: string) {	
		if (!person) return;
		console.log('call DEL', siblingId);
		const success = await db.Tie.deleteSibling(siblingId);
		if (success) {
			await changePerson(person);
		}
		showDeleteConfirmation = false;
		deleteFunction = () => Promise.resolve();
		deleteMessage = null;
	}

	function handleDeletePartner(partnerId: string) {
		if (!person) return;
		showDeleteConfirmation = true;
		deleteFunction = () => deletePartner(person?.id || '', partnerId);
		deleteMessage = `
			<div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem;">
				<p style="font-size: 1.2rem; font-weight: bold;">Remove this Partner?</p>
				<p>Only the relationship will be removed.  NOT the person.</p>
			</div>`;
	}
	async function deletePartner(personId: string, partnerId: string) {
		if (!person) return;
		const success = await db.Tie.deletePartner(personId, partnerId);
		if (success) {
			console.log('deletePartner', personId, partnerId);
			await changePerson(person);
		}
		showDeleteConfirmation = false;
		deleteFunction = () => Promise.resolve();
		deleteMessage = null;
	}
	function handleDeleteChild(partnerId: string, childId: string) {
		console.log(`handle delete child  Child:${childId} partner:${partnerId} Person:${person?.id}`);
		showDeleteConfirmation = true;
		deleteFunction = () => deleteChild(childId, partnerId, person?.id || '');
		deleteMessage = `
			<div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem;">
				<p style="font-size: 1.2rem; font-weight: bold;">Remove this Child?</p>
				<p>Only the relationship will be removed.  NOT the person.</p>
			</div>`;
	}
	async function deleteChild(childId: string, partnerId: string, personId: string) {
		if (!person) return;
		const success = await db.Tie.deleteChild(childId, partnerId, personId);
		if (success) {
			await changePerson(person);
		}
		showDeleteConfirmation = false;
		deleteFunction = () => Promise.resolve();
		deleteMessage = null;
	}
</script>


{#if isPageLoading}
	<div class="loading">
		<span class="loader"></span>
	</div>
{:else}
	<div class="page-container">
		<div class="content-container">


			<!-- Main Character info -->
			<div class="image-controls-row">
				{#if person}
					<div class="image-container-column">

						<h1 class={$user ? 'image-header-title' : 'image-header-title blurredx2'}>
							{person.first_name} {person.last_name}
						</h1>



						<div class="image-header-row">
							<div class="image-container-column">
								<!-- Image -->
								<div class="image">
									{#if person.image_url?.length && person.image_url.length > 10}
										<img src={person.image_url} alt="Person Avatar" />
									{:else}
										<img src="/images/noimage3.png" alt=" no Personal Avatar yet" />
									{/if}
									{#if person.alias}
										<h2 class="alias"><em>"{person.alias}"</em></h2>
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
									<MIcon name="upload" size="32px" />
								</button>
								<button
									class="image-btn"
									onclick={handleAddImageFromDatabase}
									title="Download Image from our database"
								>
									<MIcon name="download" size="32px" />
								</button>
								<button
									class="image-btn red"
									onclick={handleRemoveImage}
									title="Remove this Image from this Person"
								>
									<MIcon name="remove-image" size="32px" />
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
					<!-- Person info (2 columns)-->
					<div class="info-column">
						<div class="main-char-buttons">
							<button class="btn-add-person" onclick={() => goto('/admin/person')}>
								<span><MIcon name="search" size="24px" /></span>
								<p>Search</p>
							</button>
							<button
								class="btn-add-person"
								onclick={() => goto('/admin/person/new')}
								disabled={!$user}
							>
								<span><MIcon name="new" size="24px" /></span>
								<p>New Person</p>
							</button>
						</div>

						<div class="info-row">
							<div class="info-content-column">
								<div class="field">
									<h2>First</h2>
									<input
										class={$user ? '' : 'blurred'}
										type="text"
										bind:value={person.first_name}
										onchange={() => (formIsDirty = true)}
										disabled={!$user }
									/>
								</div>
								<div class="field">
									<h2>Middle</h2>
									<input
										class={$user ? '' : 'blurred'}
										type="text"
										bind:value={person.middle_name}
										onchange={() => (formIsDirty = true)}
										disabled={!$user}
									/>
								</div>
								<div class="field">
									<h2>Last Name</h2>
									<input
										class={$user ? '' : 'blurred'}
										type="text"
										bind:value={person.last_name}
										onchange={() => (formIsDirty = true)}
										disabled={!$user}
									/>
								</div>
								<div class="field">
									<h2>Maiden</h2>
									<input
										class={$user ? '' : 'blurred'}
										type="text"
										bind:value={person.maiden_name}
										onchange={() => (formIsDirty = true)}
										disabled={!$user}
									/>
								</div>
								<div class="field">
									<h2>Alias</h2>
									<input
										class={$user ? '' : 'blurred'}
										type="text"
										bind:value={person.alias}
										onchange={() => (formIsDirty = true)}
										disabled={!$user}
									/>
								</div>
								<div class="field"></div>
							</div>
							<div class="info-content-column">
								<div class="field">
									<h2>Gender</h2>
									<div class={$user ? '' : 'blurred'}>
										<select bind:value={person.sex} disabled={!$user}>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											<option value="Other">Other</option>
										</select>
									</div>
								</div>
								<div class="field">
									<h2>Born</h2>
									<div class="row-content-container-text">
										<input
											class={$user ? '' : 'blurred'}
											type="date"
											bind:value={person.born}
											onchange={() => (formIsDirty = true)}
											disabled={!$user}
										/>
										{#if person.born}
											<button
												class="btn-clear"
												onclick={() => {
													if (person) {
														person.born = null;
													}
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
										class={$user ? '' : 'blurred'}
										type="text"
										bind:value={person.phone_number}
										onchange={() => (formIsDirty = true)}
										disabled={!$user}
									/>
								</div>
								<div class="field">
									<h2>Email</h2>
									<input
										class={$user ? '' : 'blurred'}
										type="email"
										bind:value={person.email}
										onchange={() => (formIsDirty = true)}
										disabled={!$user}
									/>
								</div>

								<div class="field">
									<h2>Died</h2>
									<div class="row-content-container-text">
										<input
											class={$user ? '' : 'blurred'}
											type="date"
											bind:value={person.died}
											onchange={() => (formIsDirty = true)}
											disabled={!$user}
										/>
										{#if person.died}
											<button
												class="btn-clear"
												onclick={() => {
													if (person) {
														person.died = null;
													}
												}}
												disabled={!$user}
											>
												<MIcon name="close" size="1.5rem" />
											</button>
										{/if}
									</div>
								</div>
								<div class="field">
									<button class="btn-save" onclick={() => handleSaveForm()} disabled={!formIsDirty}>
										{#if $user}
											<span><MIcon name="save" size="24px" /></span>
											<p>{formIsDirty ? 'Save Changes' : 'Saved'}</p>
										{:else}
											<div>
												<MIcon name="locked" size="24px" />
											</div>
										{/if}
									</button>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<!-- Relationships -->
			{#if isLoading}
				<div class="row-content-container left">
					<div class="column-container">
						<div class="section-header">
							loading relatives
							<span class="loader"></span>
						</div>
					</div>
				</div>
			{:else}
				<div class="row-content-container left">
					{#if children && children.partners.length > 0}
						{#each children.partners as partnerGroup}
							<div class="partner-children-container">
								<div class="partner-children-row">
									<div class="partner-column">
										<div class="section-header">
											Partner
											<button
												class="section-header-icon"
												onclick={() => handleAddRelationship('Partner')}
											>
												<MIcon name="add" size="24px" />
											</button>
										</div>
										<div class="section-content">
											<PersonCard
												person={partnerGroup.partner}
												onclick={() => changePerson(partnerGroup.partner)}
												ondelete={(id) => handleDeletePartner(id)}
											/>
										</div>
									</div>
									{#if partnerGroup.children.some((child) => child.first_name !== 'No')}
										<div class="children-column">
											<div class="section-header">
												Children
												<button
													class="section-header-icon"
													onclick={() => handleAddRelationship('Child',partnerGroup.partner)}
												>
													<MIcon name="add" size="24px" />
												</button>
											</div>
											<div class="section-content children-content">
												{#if partnerGroup.children.length > 0}
													{#each partnerGroup.children as child}
														{#if child.first_name !== 'No'}
															<PersonCard
																person={child}
																onclick={() => changePerson(child)}
																ondelete={(id) => handleDeleteChild(partnerGroup.partner.id, child.id)}
															/>
														{/if}
													{/each}
												{:else}
													<p class="empty-section">No children recorded</p>
												{/if}
											</div>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					{:else}
						<!-- Show empty state with add buttons -->
						<div class="row-container left">
							<div class="column-container">
								<div class="section-header">
									Partner
									<button
										class="section-header-icon"
										onclick={() => handleAddRelationship('Partner')}
									>
										<MIcon name="add" size="24px" />
									</button>
								</div>

								<div class="section-header">
									Children
									<button
										class="section-header-icon"
										onclick={() => handleAddRelationship('Child')}
									>
										<MIcon name="add" size="24px" />
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>
				<div class="divider">&nbsp;</div>
				<!-- Immediate Family -->
				<div class="row-container center">
					<div class="column-container center">
						<div class="section-header center">
							Siblings
							<button class="section-header-icon" onclick={() => handleAddRelationship('Sibling')}>
								<MIcon name="add" size="24px" />
							</button>
						</div>
						<div class="section-content">
							{#if siblings}
								{#each siblings as sibling}
									<PersonCard
										person={sibling}
										onclick={() => changePerson(sibling)}
										ondelete={(id) => handleDeleteSibling(id)}
									/>
								{/each}
							{:else}
								<p class="empty-section">No siblings recorded</p>
							{/if}
						</div>
					</div>
				</div>
				<!-- Parents -->
				<div class="row-container center">
					<div class="column-container">
						<div class="section-header center">
							Parents
							<button class="section-header-icon" onclick={() => handleAddRelationship('Parent')}>
								<MIcon name="add" size="24px" />
							</button>
						</div>
						<div class="section-content">
							{#if parents && (parents.parent_b.length > 0 || parents.parent_c.length > 0)}
								<!-- Parent B -->
								{#each parents.parent_b as parent}
									<PersonCard
										person={parent}
										onclick={() => changePerson(parent)}
										ondelete={(id) => handleDeleteParent(id)}
									/>
								{/each}
								<!-- Parent C -->
								{#each parents.parent_c as parent}
									<PersonCard
										person={parent}
										onclick={() => changePerson(parent)}
										ondelete={(id) => handleDeleteParent(id)}
									/>
								{/each}
							{:else}
								<p class="empty-section">No parents recorded</p>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

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
				if (itemToDelete === 'Person') {
					showDeletePersonConfirmation = false;
				} else {
					showDeleteImageConfirmation = false;
				}
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
<!-- generic delete confirmation -->
{#if showDeleteConfirmation}
	<div style="position: fixed; inset: 0; z-index: 9998;">
		<Window
			title="User Confirmation Required"
			showMinimize={false}
			showMaximize={false}
			onClose={() => {
				showDeleteConfirmation = false;
				deleteFunction = () => Promise.resolve();
				deleteMessage = null;
			}}
			showFooter={true}
			acceptButtonText="Yes, remove"
			cancelButtonText="Cancel"
			preset="small"
			onDialogResponse={(result) => {
				result ? deleteFunction() : showDeleteConfirmation = false;
			}}
		>
			<div class="item-to-delete-container">
				<MIcon name="exclamation" size="128px" />
				{@html deleteMessage}
			</div>
		</Window>
	</div>
{/if}
{#if person && showRelationshipForm}
	<div style="position: fixed; inset: 0; z-index: 9998;">
		<Window
			title={`Add ${relationshipType}`}
			onClose={() => {
				handleCloseRelationshipForm();
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
		padding-block-start: 5rem;
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
		flex-wrap: wrap;
	}
	.column-container {
		display: flex;

		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* padding: 0.5rem; */
		flex-wrap: wrap;
	}
	.row-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		/* background-color: rgba(255, 255, 255, 0.205); */
		width: 100%;
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
		align-items: flex-start;
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
		transform: rotate(-3deg);
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
		padding-inline-end: 4rem;
		margin-block-end: 1.5rem;
	}
	.alias {
		font-size: 1.5rem;
		font-weight: 300;
		color: rgba(32, 32, 32, 0.5);
		text-align: center;
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
	.image-btn.red {
		background-color: red;
	}
	.info-column {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		padding: 1rem;
		padding-block-start: 0;
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

	.btn-delete {
		background-color: red;
		margin-block-start: 1.5rem;
	}
	.btn-save {
		width: 100%;
		margin-inline: 0;
		background-color: green;
	}
	.btn-add-person {
		margin-inline: 0;
		background-color: dodgerblue;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.left {
		justify-content: flex-start;
		align-items: center;
	}
	.row-container.left {
		justify-content: flex-start;
		align-items: start;
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

	/* Section Headers */
	.section-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		gap: 2rem;
		font-size: 2rem;
		font-weight: 300;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
		margin: 0.5rem;
		margin-block-start: 0;
		text-align: left;
		width: 100%;
	}
	.section-header-icon {
		background-color: dodgerblue;
		border: none;
		padding: 0.5rem;
		margin: 0;
		cursor: pointer;
		border-radius: 2rem;
	}
	/* Section Content */
	.section-content {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 1rem;
		padding: 0.5rem;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		width: 100%;
	}
	.center {
		justify-content: center;
		align-items: center;
	}
	/* Empty Section Message */
	.empty-section {
		color: rgba(255, 255, 255, 0.5);
		font-style: italic;
		text-align: center;
		padding: 1rem;
	}

	.partner-children-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
		width: 100%;
		min-width: 100%;
		/* background-color: rgba(255, 255, 255, 0.05); */
		border-radius: 0.5rem;
		/* padding: 0.5rem; */
		margin-bottom: 0.5rem;
	}

	.partner-children-row {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		width: 100%;
		flex-wrap: wrap;
	}

	.partner-column {
		flex: 0 0 auto;
	}

	.children-column {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.children-content {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 1rem;
		width: 100%;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 70vh;
	}

	.loader {
		transform: rotateZ(45deg);
		perspective: 1000px;
		border-radius: 50%;
		width: 148px;
		height: 148px;
		color: #fff;
	}
	.loader:before,
	.loader:after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: inherit;
		height: inherit;
		border-radius: 50%;
		transform: rotateX(70deg);
		animation: 1s spin linear infinite;
	}
	.loader:after {
		color: #ff3d00;
		transform: rotateY(70deg);
		animation-delay: 0.4s;
	}
	.divider {
		display: flex;
		flex: 1;
		width: 100%;
		height: 3px;
		font-size: 2px;
		background-color: #5f7b8c;
		margin-block: 1rem;
		border-radius: 1rem;
	}

	@keyframes rotate {
		0% {
			transform: translate(-50%, -50%) rotateZ(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotateZ(360deg);
		}
	}

	@keyframes rotateccw {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(-360deg);
		}
	}

	@keyframes spin {
		0%,
		100% {
			box-shadow: 0.2em 0px 0 0px currentcolor;
		}
		12% {
			box-shadow: 0.2em 0.2em 0 0 currentcolor;
		}
		25% {
			box-shadow: 0 0.2em 0 0px currentcolor;
		}
		37% {
			box-shadow: -0.2em 0.2em 0 0 currentcolor;
		}
		50% {
			box-shadow: -0.2em 0 0 0 currentcolor;
		}
		62% {
			box-shadow: -0.2em -0.2em 0 0 currentcolor;
		}
		75% {
			box-shadow: 0px -0.2em 0 0 currentcolor;
		}
		87% {
			box-shadow: 0.2em -0.2em 0 0 currentcolor;
		}
	}

	.main-char-buttons {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
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

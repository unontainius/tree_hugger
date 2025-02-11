<script lang="ts">
	import { onMount } from 'svelte';
	import db from '$lib/services/treeDb';
	import MIcon from './MIcon.svelte';
	import { imageService } from '$lib/services/imageService';
	import { isLoggedIn } from '$lib/utils/authUtils';
	import { toasts } from '$lib/stores/toastStore';
	import Window from './Window.svelte';

	const { personId, onComplete } = $props<{
		personId: string;
		onComplete: () => void;
	}>();

	$effect(() => {
		console.log('ImageSelector mounted:', { personId });
	});

	let images = $state<{ name: string; url: string; path: string }[]>([]);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let selectedImage = $state<{ url: string; path: string } | null>(null);
	let showConfirmation = $state(false);

	onMount(() => {
		loadImages();
	});

	async function loadImages() {
		isLoading = true;
		error = null;

		try {
			const files = await imageService.listImages();

			// Store both URL and path
			images = files.map((file) => ({
				name: file.name,
				path: file.name, // This is the path we need for deletion
				url: imageService.getPublicUrl(file.name)
			}));
		} catch (e) {
			error = 'Error loading images';
			console.error('Error loading images:', e);
		} finally {
			isLoading = false;
		}
	}

	async function handleSelect() {
		if (!(await isLoggedIn())) return;
		if (!selectedImage) return;

		try {
			// Update person record with the selected image URL
			await db.Person.update(personId, { image_url: selectedImage.url });

			const updatedPerson = await db.Person.single(personId);
			if (!updatedPerson) {
				throw new Error('Failed to verify person update');
			}

			selectedImage = null;
			onComplete?.();
		} catch (e) {
			error = 'Error updating image';
			console.error('Error updating:', e);
			toasts.error('Failed to update image');
		}
	}

	function handleCancel() {
		selectedImage = null;
		error = null;
		showConfirmation = false;
		onComplete?.();
	}
	function handleDelete() {
		if (!selectedImage) return;
		showConfirmation = true;
	}
	async function deleteImage() {
		if (!selectedImage) return;
		try {
			await imageService.deleteImage(selectedImage.path);
			await loadImages(); // Refresh the image list
			toasts.success('Image deleted successfully');
		} catch (error) {
			console.error('Delete failed:', error);
		}
	}

	function handleDeleteConfirmation(deleteTheImage: boolean) {
		showConfirmation = false;
		if (deleteTheImage) {
			deleteImage();
		} else {
			toasts.info('Delete cancelled');
		}
		selectedImage = null;
	}
</script>

<div class="selector">
	{#if isLoading}
		<div class="loading">Loading images...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if images.length === 0}
		<div class="empty">No images available</div>
	{:else}
		<div class="image-grid">
			{#each images as image}
				<button
					class="image-item {selectedImage?.url === image.url ? 'selected' : ''}"
					onclick={() => (selectedImage = { url: image.url, path: image.path })}
				>
					<img src={image.url} alt="Selectable" />
				</button>
			{/each}
		</div>
		<div class="controls">
			<button class="btn-cancel" onclick={handleCancel}> Cancel </button>
			{#if selectedImage}
				<button class="btn-delete" onclick={handleDelete}> Delete Image </button>
				<button class="btn-select" onclick={handleSelect}> Accept Selection </button>
			{/if}
		</div>
	{/if}
</div>

{#if selectedImage && showConfirmation}
	<div style="position: fixed; inset: 0; z-index: 9998;">
		<Window
			title="Delete Confirmation"
			showMinimize={false}
			showMaximize={false}
			onClose={() => {
				showConfirmation = false;
			}}
			showFooter={true}
			acceptButtonText={`Yes, remove this Image'}`}
			cancelButtonText="Cancel"
			preset="small"
			initialSize={{ width: window.innerWidth > 520 ? 520 : window.innerWidth, height: 660 }}
			initialPosition={{
				x: window.innerWidth / 2 - (window.innerWidth > 520 ? 520 : window.innerWidth / 2),
				y: window.innerHeight / 2 - 660 / 2
			}}
			onDialogResponse={handleDeleteConfirmation}
		>
			<div class="item-to-delete-container">
				<MIcon name="exclamation" size="128px" />
				<p>Are you sure you want to Remove this Image from the database permanently?</p>
			</div>
		</Window>
	</div>
{/if}

<style>
	.selector {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: rgb(32, 32, 32);
		padding: 1rem;
		box-sizing: border-box;
		overflow: hidden;
		border-bottom-left-radius: 0.4rem;
		border-bottom-right-radius: 0.4rem;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 1rem;
		flex: 1;
		width: 100%;
		overflow-y: scroll;
		padding: 1rem;
		background: rgb(22, 22, 22);
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		min-height: 0;
	}

	.image-grid::-webkit-scrollbar {
		width: 8px;
	}

	.image-grid::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}

	.image-grid::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 4px;
	}

	.image-grid::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.image-item {
		aspect-ratio: 1;
		height: 120px; /* Fixed height */
		width: 120px; /* Fixed width */
		cursor: pointer;
		border: 2px solid transparent;
		border-radius: 0.25rem;
		overflow: hidden;
		transition: all 0.2s;
		background: rgb(32, 32, 32);
		justify-self: center; /* Center in grid cell */
		padding: 0;
		margin: 0;
	}

	.image-item:hover {
		transform: scale(1.1);
		z-index: 1;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}

	.image-item.selected {
		border-color: #2196f3;
	}

	.image-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.controls {
		flex: 0 0 auto;
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		padding: 1rem;
		background: rgb(22, 22, 22);
		border-radius: 0.5rem;
	}

	.btn-select,
	.btn-cancel,
	.btn-delete {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-select {
		background: #4caf50;
		color: white;
	}

	.btn-cancel {
		background: #292929;
		color: white;
	}

	.btn-delete {
		background: #f44336;
		color: white;
	}

	.btn-select:hover,
	.btn-cancel:hover,
	.btn-delete:hover {
		transform: scale(1.05);
	}

	.loading,
	.error,
	.empty {
		text-align: center;
		padding: 2rem;
		color: #666;
	}

	.error {
		color: #f44336;
	}

	/* Add responsive breakpoints */
	@media (max-width: 768px) {
		.image-item {
			height: 100px;
			width: 100px;
		}

		.image-grid {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
			gap: 0.5rem;
			padding: 0.5rem;
		}
	}

	@media (max-width: 480px) {
		.image-item {
			height: 80px;
			width: 80px;
		}

		.image-grid {
			grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
			gap: 0.25rem;
			padding: 0.25rem;
		}
	}
</style>

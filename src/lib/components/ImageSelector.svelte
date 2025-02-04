<script lang="ts">
	import { onMount } from 'svelte';
	import db from '$lib/services/treeDb';
	import MIcon from './MIcon.svelte';
	import { imageService } from '$lib/services/imageService';
	import { isLoggedIn } from '$lib/utils/authUtils';
	import Modal from './Modal.svelte';
	import { toasts } from '$lib/stores/toastStore';

	let { personId, onComplete } = $props<{
		personId: string;
		onComplete?: () => void;
	}>();

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
        } catch (error) {
            console.error('Delete failed:', error);
        }
    }
    // svelte-ignore non_reactive_update
        function handleDeleteConfirmation(reason: string) {
        showConfirmation = false;
        if (reason === 'accept') {
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
					onclick={() => selectedImage = { url: image.url, path: image.path }}
				>
					<img src={image.url} alt="Selectable" />
                </button>
			{/each}
		</div>
		<div class="controls">
			<button class="btn-cancel" onclick={handleCancel}> Cancel </button>
            {#if selectedImage}
                <button class="btn-delete" onclick={handleDelete}>
                    Delete Image
                </button>
                <button class="btn-select" onclick={handleSelect}>
                    Accept Selection
                </button>
            {/if}
		</div>
	{/if}
</div>

{#if selectedImage && showConfirmation}
    <Modal visible={showConfirmation} 
        title="Confirm Delete" bind:dialogReason={handleDeleteConfirmation} acceptBtnText="Delete" cancelBtnText="No!  Don't Delete" showOverlay={true} cancelOnOverlayClick={true} >
        <div class="confirmation">
            <p>Are you sure you want to delete this image?</p>
         </div>
    </Modal>
{/if}

<style>
    .confirmation p {
        text-align: center;
        padding: 4rem;
    }
	.selector {
		width: 80vw;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 0.1rem;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
		width: 100%;
		height: calc(80vh - 100px); /* Leave space for controls */
		overflow-y: auto;
		padding: 1rem;
		align-content: start; /* Prevent bunching */
	}

	.image-item {
		aspect-ratio: 1;
		cursor: pointer;
		border: 2px solid transparent;
		border-radius: 0.25rem;
		overflow: hidden;
		transition: all 0.2s;
		background: white;
		height: 150px; /* Fixed height */
	}

	.image-item:hover {
		transform: scale(1.4);
		z-index: 1000;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.image-item.selected {
		border-color: #2196f3;
	}

	.image-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.controls {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		padding: 1rem;
		width: 100%;
		background: white;
		border-top: 1px solid #eee;
		position: relative;
		bottom: 0;
		border-bottom-right-radius: 12px;
		border-bottom-left-radius: 12px;
	}

	.btn-select {
		background: #4caf50;
		color: white;
	}

	.btn-cancel {
		background: #292929a6;
		color: white;
	}

    .btn-delete {
        background: #f44336;
        color: white;
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

	.image-grid button {
		padding: 0rem;
		margin: 0rem;
	}

	@media (max-width: 600px) {
		.image-grid {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		}

		.image-item {
			height: 100px;
		}
	}
</style>

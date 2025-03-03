<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import supabase from '$lib/supabaseClient';
	import MIcon from '$lib/components/common/MIcon.svelte';
	import { toasts } from '$lib/stores/toastStore';
	import SupabaseStorageFileUploader from './SupabaseStorageFileUploader.svelte';
	import Window from './Window.svelte';

	let {
		path = '',
		navigationAllowed = true,
		viewedFolder = '',
		canAddNewImages = false,
		canDeleteImages = false
	} = $props();

	interface ImageItem {
		name: string;
		url: string;
		size: number;
		isFolder?: boolean;
	}

	let images = $state<ImageItem[]>([]);
	let selectedImage = $state<ImageItem | null>(null);
	let isLoading = $state(true);
	let currentIndex = $state(0);
	let currentPath = $state<string[]>([]);
	let showDeleteConfirm = $state(false);
	let imageToDelete = $state<ImageItem | null>(null);
	let previousPath = '';

	// Split the path into bucket and subfolder parts

	async function loadImages() {
		const [bucket, ...pathParts] = path.split('/');
		const subfolderPath = pathParts.join('/');
		try {
			isLoading = true;

			// Just use the subfolderPath directly, ignore currentPath
			const listPath = subfolderPath || '';

			// console.log('Final list path:', listPath);

			const { data, error } = await supabase.storage.from(bucket).list(listPath);

			if (error) throw error;

			// console.log('Loading images from:', {
			// 	bucket,
			// 	subfolderPath,
			// 	data
			// });

			// Filter for image files and get their public URLs
			const imageFiles = data
				.filter((file) => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
				.map((file) => {
					const {
						data: { publicUrl }
					} = supabase.storage.from(bucket).getPublicUrl(`${subfolderPath}/${file.name}`);

					return {
						name: file.name,
						url: publicUrl,
						size: file.metadata?.size || 0,
						isFolder: false
					};
				});

			images = imageFiles;
		} catch (err) {
			console.error('Error loading images:', err);
			toasts.error(
				`Failed to load images: ${err instanceof Error ? err.message : 'Unknown error'}`
			);
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		if (path) {
			loadImages();
		}
	});

	// console.log('PATH', path);

	function navigateToFolder(folderName: string) {
		currentPath = [...currentPath, folderName];
		loadImages();
	}

	function navigateBack() {
		if (currentPath.length > 0) {
			currentPath = currentPath.slice(0, -1);
			loadImages();
		}
	}

	function getFilteredImages() {
		return images.filter((img) => !img.isFolder);
	}

	function selectImage(image: ImageItem, index: number) {
		if (image.isFolder) {
			navigateToFolder(image.name);
			return;
		}
		selectedImage = image;
		currentIndex = getFilteredImages().findIndex((img) => img.url === image.url);
	}

	function closeViewer() {
		selectedImage = null;
	}

	function showNext() {
		const filteredImages = getFilteredImages();
		const currentFilteredIndex = filteredImages.findIndex((img) => img.url === selectedImage?.url);

		if (currentFilteredIndex < filteredImages.length - 1) {
			selectedImage = filteredImages[currentFilteredIndex + 1];
			currentIndex = currentFilteredIndex + 1;
		}
	}

	function showPrevious() {
		const filteredImages = getFilteredImages();
		const currentFilteredIndex = filteredImages.findIndex((img) => img.url === selectedImage?.url);

		if (currentFilteredIndex > 0) {
			selectedImage = filteredImages[currentFilteredIndex - 1];
			currentIndex = currentFilteredIndex - 1;
		}
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (!selectedImage) return;

		switch (event.key) {
			case 'ArrowLeft':
				showPrevious();
				break;
			case 'ArrowRight':
				showNext();
				break;
			case 'Escape':
				closeViewer();
				break;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	async function deleteImage(image: ImageItem) {
		try {
			// Get the full path from the URL by removing the base storage URL
			const storageUrl =
				'https://axogabedvxdwvhrjcjpq.supabase.co/storage/v1/object/public/project/';
			const filePath = image.url.replace(storageUrl, '');

			// console.log('Deleting file:', {
			// 	bucket: 'project',
			// 	filePath,
			// 	originalUrl: image.url,
			// 	decodedPath: decodeURIComponent(filePath)
			// });

			const { error } = await supabase.storage
				.from('project')
				.remove([decodeURIComponent(filePath)]);

			if (error) {
				console.error('Delete error:', error);
				throw error;
			}

			toasts.success('Image deleted successfully from ' + filePath);
			closeViewer();
			loadImages();
		} catch (err) {
			console.error('Delete error:', err);
			toasts.error(
				`Failed to delete image: ${err instanceof Error ? err.message : 'Unknown error'}`
			);
		}
	}

	function handleImageSaved(newPath: string) {
		loadImages(); // Reload images after new upload
	}
</script>

{#if showDeleteConfirm && imageToDelete}
	<Window
		title="Confirm Delete"
		onClose={() => {
			showDeleteConfirm = false;
			imageToDelete = null;
		}}
		onDialogResponse={(confirmed) => {
			if (confirmed && imageToDelete) {
				deleteImage(imageToDelete);
			}
			showDeleteConfirm = false;
			imageToDelete = null;
		}}
	>
		<div class="window-body">
			<p>Are you sure you want to delete this image?</p>
		</div>
	</Window>
{/if}
<div class="gallery-container">
	<div class="gallery-header">
		{#if canAddNewImages}
			<div class="gallery-header-left">
				<SupabaseStorageFileUploader bucketName={path} imageSaved={handleImageSaved} />
			</div>
		{/if}

		{#if navigationAllowed}
			<div class="breadcrumb">
				<button
					class="folder-button"
					onclick={() => {
						currentPath = [];
						loadImages();
					}}
				>
					<MIcon name="home" size="16px" />
				</button>
				{#each currentPath as folder, i}
					<span class="separator">/</span>
					<button
						class="breadcrumb-item"
						onclick={() => {
							currentPath = currentPath.slice(0, i + 1);
							loadImages();
						}}
					>
						{folder}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if isLoading}
		<div class="loading">Loading images...</div>
	{:else if images.length === 0}
		<div class="no-images">No images found</div>
	{:else}
		<div class="thumbnail-grid">
			{#if currentPath.length > 0}
				<button class="thumbnail-button folder-button" onclick={navigateBack}>
					<MIcon name="left" size="48px" />
					<span>Back</span>
				</button>
			{/if}

			{#each images as image, index}
				{#if image.isFolder}
					{#if navigationAllowed}
						<button
							class="thumbnail-button {image.isFolder ? 'folder-button' : ''}"
							onclick={() => selectImage(image, index)}
						>
							{#if image.isFolder}
								<MIcon name="folder" size="64px" />
								<span>{image.name}</span>
							{:else}
								<img src={image.url} alt={image.name} loading="lazy" />
							{/if}
						</button>
					{/if}
				{:else}
					<button class="thumbnail-button" onclick={() => selectImage(image, index)}>
						<img src={image.url} alt={image.name} loading="lazy" />
					</button>
				{/if}
			{/each}
		</div>
	{/if}

	{#if selectedImage}
		<div class="image-viewer">
			{#if canDeleteImages}
				<button
					class="delete-button"
					onclick={() => {
						imageToDelete = selectedImage;
						showDeleteConfirm = true;
					}}
				>
					<MIcon name="delete" size="24px" />
				</button>
			{/if}
			<button class="close-button" onclick={closeViewer}>
				<MIcon name="close" size="24px" />
			</button>

			<img 
				src={selectedImage.url} 
				alt={selectedImage.name} 
				class="viewer-image"
			/>

			{#if currentIndex > 0}
				<button class="nav-button prev" onclick={showPrevious}>
					<MIcon name="left" size="48px" />
				</button>
			{/if}

			{#if currentIndex < getFilteredImages().length - 1}
				<button class="nav-button next" onclick={showNext}>
					<MIcon name="right" size="48px" />
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.window-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: rgb(163, 0, 0);
		padding-inline: 2rem;
	}
	.window-body p {
		font-size: 1.5rem;
		font-weight: 600;
		color: #ffffff;
	}
	.gallery-container {
		width: 100%;
		padding: 1rem;
		background: rgb(39, 39, 39);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
		border: 1px solid #ffffff1f;
	}

	.thumbnail-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}

	.thumbnail-button {
		width: 100%;
		aspect-ratio: 1;
		border: none;
		padding: 0;
		cursor: pointer;
		background: #f0f0f02d;
		border-radius: 4px;
		overflow: hidden;
		transition: transform 0.2s;
	}

	.thumbnail-button:hover {
		transform: scale(1.05);
	}

	.thumbnail-button img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-viewer {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.viewer-image {
		max-width: 80vw;
		max-height: 80vh;
		object-fit: contain;
	}

	.nav-button {
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(0, 0, 0);
		color: white;
		border: none;
		width: 6rem;
		height: 6rem;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1001;
		border: 1px solid #ffffff1f;
		padding: 0;
	}

	.nav-button:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.close-button {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 1002;
		background: rgba(0, 0, 0, 0.7);
		border: none;
		color: white;
		padding: 0.5rem;
		border-radius: 50%;
		cursor: pointer;
	}

	.close-button:hover {
		background: rgba(0, 0, 0, 0.9);
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		color: #666;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		background: #f0f0f02d;
		border-radius: 0.5rem;
		flex-wrap: wrap;
		margin: 0;
		width: 100%;
	}

	.breadcrumb-item {
		background: none;
		border: none;
		color: #333;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		transition: color 0.2s;
	}

	.breadcrumb-item:hover {
		color: #007bff;
	}

	.separator {
		color: #666;
		margin: 0 0.25rem;
	}

	.folder-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: dodgerblue;
		color: #fff;
	}

	.folder-button span {
		font-size: 0.9rem;
		color: #fff;
		text-align: center;
		word-break: break-word;
	}

	@media (max-width: 768px) {
		.thumbnail-grid {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		}

		.nav-button {
			padding: 0.5rem;
		}
	}

	.delete-button {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 2;
		background: rgba(255, 0, 0, 0.7);
		border: none;
		color: white;
		padding: 0.5rem;
		border-radius: 50%;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.delete-button:hover {
		background: rgba(255, 0, 0, 0.9);
	}

	.gallery-header {
		display: flex;
		align-items: center;
		padding: 1rem;
		gap: 0.5rem;
	}
	.gallery-header-left {
		min-width: 200px;
	}

	.prev { 
		left: 2rem; 
	}
	
	.next { 
		right: 2rem; 
	}
</style>

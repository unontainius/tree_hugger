<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import supabase from '$lib/supabaseClient';
    import MIcon from '$lib/components/common/MIcon.svelte';
    import { toasts } from '$lib/stores/toastStore';
	import SupabaseStorageFileUploader from './SupabaseStorageFileUploader.svelte';
    import Window from './Window.svelte';

    let { 
        bucketName, 
        path = '',
        navigationAllowed = true, 
        viewedFolder = $bindable(), 
        canAddNewImages = false,
        canDeleteImages = false
    } = $props<{ 
        bucketName: string, 
        path?: string,
        navigationAllowed?: boolean, 
        viewedFolder?: string, 
        canAddNewImages?: boolean,
        canDeleteImages?: boolean
    }>();
    
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

    function removeSpaces(str: string) {
        return str.replace(/\s+/g, '-');
    }
    async function loadImages(subPath: string = '') {
        try {
            // Extract the project name from the full path if it exists
            const projectPath = path || bucketName.split('/')[1];
            // Replace spaces with hyphens to match how files are stored
            const cleanProjectPath = projectPath.replace(/\s+/g, '-');
            const fullPath = cleanProjectPath ? `${cleanProjectPath}/${subPath}`.replace(/\/+/g, '/').replace(/^\/|\/$/g, '') : subPath;

            console.log('Loading from bucket:', {
                bucket: 'project',
                projectPath,
                cleanProjectPath,
                fullPath,
                originalPath: path,
                originalBucketName: bucketName
            });

            const { data, error } = await supabase.storage
                .from('project')
                .list(fullPath);

            if (error) {
                console.error('Error listing bucket contents:', error);
                toasts.error(`Failed to list contents: ${error.message}`);
                return;
            }

            console.log('Bucket contents:', data);

            const imageUrls = await Promise.all(
                data.map(async (file) => {
                    if (!file.metadata || file.name.includes('/')) {
                        return {
                            name: file.name,
                            isFolder: true,
                            size: 0,
                            url: ''
                        };
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('project')
                        .getPublicUrl(fullPath ? `${fullPath}/${file.name}` : file.name);
                    
                    return {
                        name: file.name,
                        url: publicUrl,
                        size: file.metadata?.size || 0,
                        isFolder: false
                    };
                })
            );

            images = imageUrls;
        } catch (error) {
            console.error('Error:', error);
            toasts.error(`Failed to load images: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            isLoading = false;
        }
    }

    function navigateToFolder(folderName: string) {
        currentPath = [...currentPath, folderName];
        loadImages(currentPath.join('/'));
    }

    function navigateBack() {
        if (currentPath.length > 0) {
            currentPath = currentPath.slice(0, -1);
            loadImages(currentPath.join('/'));
        }
    }

    function getFilteredImages() {
        return images.filter(img => !img.isFolder);
    }

    function selectImage(image: ImageItem, index: number) {
        if (image.isFolder) {
            navigateToFolder(image.name);
            return;
        }
        selectedImage = image;
        currentIndex = getFilteredImages().findIndex(img => img.url === image.url);
    }

    function closeViewer() {
        selectedImage = null;
    }

    function showNext() {
        const filteredImages = getFilteredImages();
        const currentFilteredIndex = filteredImages.findIndex(img => img.url === selectedImage?.url);
        
        if (currentFilteredIndex < filteredImages.length - 1) {
            selectedImage = filteredImages[currentFilteredIndex + 1];
            currentIndex = currentFilteredIndex + 1;
        }
    }

    function showPrevious() {
        const filteredImages = getFilteredImages();
        const currentFilteredIndex = filteredImages.findIndex(img => img.url === selectedImage?.url);
        
        if (currentFilteredIndex > 0) {
            selectedImage = filteredImages[currentFilteredIndex - 1];
            currentIndex = currentFilteredIndex - 1;
        }
    }

    // Handle keyboard navigation
    function handleKeydown(event: KeyboardEvent) {
        if (!selectedImage) return;
        
        switch(event.key) {
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

    $effect(() => {
        // Reset state when bucketName or path changes
        currentPath = [];
        selectedImage = null;
        currentIndex = 0;
        images = [];
        loadImages();
    });

    onMount(() => {
        loadImages();
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    });
    onDestroy(() => {
        window.removeEventListener('keydown', handleKeydown);
    });

    async function deleteImage(image: ImageItem) {
        try {
            // Get the full path from the URL by removing the base storage URL
            const storageUrl = 'https://axogabedvxdwvhrjcjpq.supabase.co/storage/v1/object/public/project/';
            const filePath = image.url.replace(storageUrl, '');

            console.log('Deleting file:', {
                bucket: 'project',
                filePath,
                originalUrl: image.url,
                decodedPath: decodeURIComponent(filePath)
            });

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
            toasts.error(`Failed to delete image: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
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
    {#if isLoading}
        <div class="loading">Loading images...</div>
    {:else if selectedImage}
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
            
            <div class="nav-controls">
                {#if currentIndex > 0}
                    <button class="nav-button prev" onclick={showPrevious}>
                        <MIcon name="left" size="24px" />
                    </button>
                {/if}
                
                <img src={selectedImage.url} alt={selectedImage.name} />
                
                {#if currentIndex < getFilteredImages().length - 1}
                    <button class="nav-button next" onclick={showNext}>
                        <MIcon name="right" size="24px" />
                    </button>
                {/if}
            </div>
        </div>
    {:else}
        {#if navigationAllowed}
        <div class="breadcrumb">
            {#if canAddNewImages}
                <SupabaseStorageFileUploader bucketName={bucketName} imageSaved={() => {
                    loadImages();
                }}/>
            {/if}
            <button 
                class="breadcrumb-item" 
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
                        loadImages(currentPath.join('/'));
                    }}
                >
                    {folder}
                </button>
            {/each}
            </div>
        {/if}

        <div class="thumbnail-grid">
            {#if currentPath.length > 0}
                <button 
                    class="thumbnail-button folder-button"
                    onclick={navigateBack}
                >
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
                                <img 
                                    src={image.url} 
                                    alt={image.name}
                                    loading="lazy"
                                />
                            {/if}
                        </button>
                    {/if}
                {:else}
                    <button 
                        class="thumbnail-button"
                        onclick={() => selectImage(image, index)}
                    >
                        <img src={image.url} alt={image.name} loading="lazy" />
                    </button>
                {/if}
            {/each}
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
        height: 100%;
        position: relative;
    }

    .thumbnail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
        padding: 1rem;
    }

    .thumbnail-button {
        padding: 0;
        margin: 0;
        border: none;
        background: none;
        cursor: pointer;
        aspect-ratio: 1;
        overflow: hidden;
        border-radius: 0.5rem;
        transition: transform 0.2s ease;
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
        position: relative;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nav-controls {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.7);
        border: none;
        color: white;
        padding: 1rem 0.5rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .nav-button:hover {
        background: rgba(0, 0, 0, 0.9);
    }

    .prev {
        left: 1rem;
    }

    .next {
        right: 1rem;
    }

    .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 2;
        background: rgba(0, 0, 0, 0.7);
        border: none;
        color: white;
        padding: 0.5rem;
        border-radius: 50%;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .close-button:hover {
        background: rgba(0, 0, 0, 0.9);
    }

    .image-viewer img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
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
        background: rgba(255, 255, 255, 0.1);
        border-radius: 0.5rem;
        margin-inline: 1rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }

    .breadcrumb-item {
        background: none;
        border: none;
        color: #fff;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .breadcrumb-item:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .separator {
        color: #fff;
        margin: 0 0.25rem;
        opacity: 0.7;
    }

    .folder-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: rgba(0, 0, 0, 0.05);
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
</style> 
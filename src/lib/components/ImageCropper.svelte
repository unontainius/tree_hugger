<script lang="ts">
    import Cropper from 'cropperjs';
    import 'cropperjs/dist/cropper.css';
    import supabase from '$lib/supabaseClient';
    import db from '$lib/services/treeDb';
    import MIcon from './MIcon.svelte';

    let { personId, imageUrl, showCropper, onComplete, onCancel } = $props<{
        personId: string;
        imageUrl: string | null;
        showCropper: boolean;
        onComplete: (croppedBlob: Blob) => void;
        onCancel: () => void;
    }>();

    let cropperInstance: Cropper | null = $state(null);
    let imageElement: HTMLImageElement | null = $state(null);
    let isLoading = $state(false);
    let error = $state<string | null>(null);

    function initCropper() {
        if (imageElement && imageUrl) {
            cropperInstance = new Cropper(imageElement, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                restore: false,
                modal: true,
                guides: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
            });
        }
    }

    async function handleSave() {
        if (!cropperInstance) return;
        isLoading = true;
        error = null;

        try {
            // Get cropped canvas
            const canvas = cropperInstance.getCroppedCanvas({
                width: 400,    // Output size
                height: 400,
                fillColor: '#fff'
            });

            // Convert to blob
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to create blob'));
                }, 'image/jpeg', 0.9);
            });

            onComplete(blob);
        } catch (e) {
            error = 'Error cropping image';
            console.error('Error cropping:', e);
        } finally {
            isLoading = false;
            if (cropperInstance) {
                cropperInstance.destroy();
                cropperInstance = null;
            }
        }
    }

    function handleCancel() {
        if (cropperInstance) {
            cropperInstance.destroy();
            cropperInstance = null;
        }
        onCancel();
    }

    $effect(() => {
        if (showCropper) {
            setTimeout(initCropper, 100);
        }
    });
</script>

<div class="cropper-container">
    {#if showCropper && imageUrl}
        <div class="cropper-wrapper">
            <div class="cropper">
                <img
                    bind:this={imageElement}
                    src={imageUrl}
                    alt="To crop"
                    crossorigin="anonymous"
                />
            </div>
            <div class="controls">
                <div class="buttons">
                    <button 
                        class="btn-cancel" 
                        onclick={handleCancel}
                        disabled={isLoading}
                    >
                        <MIcon name="x" size="1.5rem" />
                        Cancel
                    </button>
                    <button 
                        class="btn-save" 
                        onclick={handleSave}
                        disabled={isLoading}
                    >
                        <MIcon name="save" size="1.5rem" />
                        Save
                    </button>
                </div>
            </div>
        </div>
    {/if}

    {#if error}
        <div class="error">
            {error}
        </div>
    {/if}

    <button 
        class="btn-crop"
        onclick={() => showCropper = true}
        disabled={!imageUrl}
    >
        <MIcon name="crop" size="1.5rem" />
        Crop Image
    </button>
</div>

<style>
    .cropper-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .cropper-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .cropper {
        width: 100%;
        max-width: 500px;
        height: 500px;
        position: relative;
        background: #333;
    }

    .cropper img {
        max-width: 100%;
        max-height: 100%;
    }

    .controls {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        max-width: 500px;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }

    .btn-save, .btn-cancel, .btn-crop {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-save {
        background: #4CAF50;
        color: white;
    }

    .btn-cancel {
        background: #f44336;
        color: white;
    }

    .btn-crop {
        background: #2196F3;
        color: white;
    }

    .error {
        color: #f44336;
        padding: 0.5rem;
        border-radius: 0.25rem;
        background: rgba(244, 67, 54, 0.1);
    }

    @media (max-width: 600px) {
        .cropper {
            height: 300px;
        }
    }
</style> 
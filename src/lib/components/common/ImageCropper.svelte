<script lang="ts">
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';
	import MIcon from '$lib/components/common/MIcon.svelte';

	let { imageUrl, showCropper, onComplete, onCancel } = $props<{
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
				toggleDragModeOnDblclick: false
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
				width: 400, // Output size
				height: 400,
				fillColor: '#fff'
			});

			// Convert to blob
			const blob = await new Promise<Blob>((resolve, reject) => {
				canvas.toBlob(
					(blob) => {
						if (blob) resolve(blob);
						else reject(new Error('Failed to create blob'));
					},
					'image/jpeg',
					0.9
				);
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
		<div class="controls">
			<div class="buttons">
				<button class="btn-cancel" onclick={handleCancel} disabled={isLoading}>
					<MIcon name="x" size="1.5rem" />
					Cancel
				</button>
				<button class="btn-save" onclick={handleSave} disabled={isLoading}>
					<MIcon name="save" size="1.5rem" />
					Save
				</button>
			</div>
		</div>
		<div class="cropper-wrapper">
			<img bind:this={imageElement} src={imageUrl} alt="To crop" crossorigin="anonymous" />
		</div>
	{/if}

	{#if error}
		<div class="error">{error}</div>
	{/if}
</div>

<style>
	.cropper-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: rgb(32, 32, 32);
		padding: 1rem;
		box-sizing: border-box;
	}

	.controls {
		flex: 0 0 auto;
		padding: 0.5rem;
		background: rgb(22, 22, 22);
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	.buttons {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	.cropper-wrapper {
		flex: 1 1 auto;
		position: relative;
		width: 100%;
		height: calc(100% - 80px);
		background: rgb(22, 22, 22);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.cropper-wrapper img {
		display: block;
		max-width: 100%;
		max-height: 100%;
	}

	.btn-save,
	.btn-cancel {
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
		background: #4caf50;
		color: white;
	}

	.btn-cancel {
		background: #f44336;
		color: white;
	}

	.btn-save:hover,
	.btn-cancel:hover {
		transform: scale(1.05);
	}

	.btn-save:disabled,
	.btn-cancel:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error {
		color: #f44336;
		padding: 0.5rem;
		margin-top: 0.5rem;
		border-radius: 0.25rem;
		background: rgba(244, 67, 54, 0.1);
	}
</style>

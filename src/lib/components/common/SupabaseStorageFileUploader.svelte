<script lang="ts">
    import supabase from '$lib/supabaseClient'; 
    import { toasts } from '$lib/stores/toastStore';
    import { uploadFile, getPublicUrl } from '$lib/services/StorageBucketService';
    // Define types for props
    type FileUploaderProps = {
        bucketName: string; // Now accepts paths like "project/anchors"
        imageSaved: (path: string) => void;
    };

    // Incoming $props
    let { bucketName, imageSaved }: FileUploaderProps = $props();

    // Internal state
    let fileInput: HTMLInputElement | null = null; // Reference to the file input element
    let isLoading = $state(false); // State to track loading
    let error = $state<string>(''); // State to store any error messages
    let selectedFile: File | null = $state(null); // State to store the selected file

    // Function to trigger the file input dialog
    function triggerFileSelect(): void {
        fileInput?.click(); // Programmatically trigger the file input dialog
    }

    // Function to handle file selection
    function handleFileSelect(event: Event): void {
        const target = event.target as HTMLInputElement;
        const files = target.files;

        if (files && files.length > 0) {
            selectedFile = files[0];
            console.log('Selected file name:', selectedFile.name);  // Log original name
            error = '';
            sendFile();
        } else {
            selectedFile = null;
        }
    }

    // Improved getBaseFilename function
    // function getBaseFilename(filename: string): string {
    //     // Check if filename has the timestamp pattern (13 digits followed by dash)
    //     const hasTimestamp = /^\d{13}-/.test(filename);
    //     if (hasTimestamp) {
    //         return filename.slice(14).toLowerCase();
    //     }
    //     return filename.toLowerCase();
    // }

    // Function to upload the selected file to Supabase storage
    async function sendFile(): Promise<void> {
        try {
            if (!selectedFile) {
                error = 'No file selected.';
                return;
            }

            isLoading = true;
            error = '';

            // Pass the original file name without modification
            const result = await uploadFile(bucketName, selectedFile.name, selectedFile);
            if (!result) {
                toasts.error('Upload failed' + result);
                throw new Error('Upload failed');
            }
            // build the public url
            const publicUrl = getPublicUrl(bucketName, result.path);
            imageSaved(publicUrl);
            toasts.warning('Image uploaded - Remember to save the project to keep changes');
            
            // Reset form
            if (fileInput) fileInput.value = '';
            selectedFile = null;

        } catch (err) {
            console.error('Upload error:', err);
            error = err instanceof Error ? err.message : 'Unknown error';
            toasts.error(`Upload failed: ${error}`);
        } finally {
            isLoading = false;
        }
    }


</script>

<!-- Template -->
<div>
    <!-- Add type="button" to prevent form submission -->
    <button
        type="button"
        class="file-upload-button"
        onclick={(e) => {
            e.preventDefault();  // Prevent any form submission
            triggerFileSelect();
        }}
        disabled={isLoading}
    >
        {#if isLoading}
            Uploading...
        {:else}
            Add an Image
        {/if}
    </button>

    <!-- Hidden file input -->
    <input
        id="file-upload"
        type="file"
        accept="image/*"
        bind:this={fileInput}
        onchange={handleFileSelect}
        style="display: none;"
    />

    <!-- Display the selected file name -->
    {#if selectedFile}
        <p class="file-name">Selected file: {selectedFile.name}</p>
    {/if}

    <!-- Display error message -->
    {#if error}
        <p class="error">{error}</p>
    {/if}

</div>

<style>
    .file-upload-button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
    }

    .file-upload-button:hover {
        background-color: #0056b3;
    }

    .file-name {
        margin-top: 10px;
        font-size: 14px;
    }

    .error {
        color: red;
        margin-top: 10px;
    }
</style>
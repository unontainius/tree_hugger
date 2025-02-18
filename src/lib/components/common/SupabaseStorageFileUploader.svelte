<script lang="ts">
    import supabase from '$lib/supabaseClient'; 
    import { toasts } from '$lib/stores/toastStore';
    import { createStorageBucket, removeSpaces, bucketExists, uploadFile } from '$lib/services/StorageBucketService';
    // Define types for props
    type FileUploaderProps = {
        bucketName: string;
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
            selectedFile = files[0]; // Store the selected file in state
            error = ''; // Clear any previous errors
            sendFile();
        } else {
            selectedFile = null; // Reset if no file is selected
        }
    }

    // Function to upload the selected file to Supabase storage
    async function sendFile(): Promise<void> {
        try {
            if (!selectedFile) {
                error = 'No file selected.';
                return;
            }

            if (!bucketName) {
                error = 'Bucket name is missing.';
                return;
            }

            isLoading = true;
            error = '';

            // Extract the project name from the full path (e.g., "project/Svelte Family Tree" -> "Svelte Family Tree")
            const projectPath = bucketName.split('/')[1];
            
            console.log('Uploading to project bucket:', {
                bucket: 'project',
                projectPath,
                fileName: selectedFile.name
            });

            // Upload directly to the project bucket with the project folder path
            const filePath = `${projectPath}/${Date.now()}-${selectedFile.name}`.replace(/\s+/g, '-');
            
            const { data, error: uploadError } = await supabase.storage
                .from('project')
                .upload(filePath, selectedFile);

            if (uploadError) throw uploadError;

            console.log('File uploaded successfully:', data);
            imageSaved(data?.path || '');
            toasts.success('File uploaded successfully');
            
            // Reset form
            if (fileInput) fileInput.value = '';
            selectedFile = null;

        } catch (err) {
            console.error('Upload error:', err);
            error = err instanceof Error ? err.message : 'Unknown error';
        } finally {
            isLoading = false;
        }
    }


</script>

<!-- Template -->
<div>
    <!-- Button to trigger file selection -->
    <button
        class="file-upload-button"
        onclick={triggerFileSelect}
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
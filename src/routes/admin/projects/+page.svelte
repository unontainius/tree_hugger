<script lang="ts">
    import supabase from "$lib/supabaseClient";
	import { onMount } from "svelte";
    import { user, loginRequestedState } from "$lib/stores/authStore";
    import { toasts } from "$lib/stores/toastStore";
	import MIcon from "$lib/components/common/MIcon.svelte";
    import { goto } from "$app/navigation";
	import ImageSelector from "$lib/components/common/ImageSelector.svelte";
	import ImageGallery from "$lib/components/common/ImageGallery.svelte";
	import SupabaseStorageFileUploader from "$lib/components/common/SupabaseStorageFileUploader.svelte";
    import { browser } from '$app/environment';
    interface ProjectTableRow {
        id: number;
        project_name: string;
    }

    interface ProjectRow {
        id?: number;
        project_name: string;
        category: string;
        client: string;
        century: string;
        technologies: string;
        overview: string;
        solution: string;
        img_url: string;
    }

    let project = $state<ProjectRow>({
        project_name: '',
        category: '',
        client: '',
        century: '',
        technologies: '',
        overview: '',
        solution: '',
        img_url: ''
    });

    let existingProjects = $state<ProjectTableRow[]>([]);
    let selectedId = $state<number | null>(null);

    async function loadProjects() {
        const { data, error } = await supabase
            .from('project')
            .select('id, project_name');
        
        console.log('Loading projects for user:', $user?.id);
        console.log('Projects data:', data);
        console.log('Error if any:', error);
        
        if (data) existingProjects = data;
    }

    $effect(() => {
        if ($user) {
            loadProjects();
        } else {
            existingProjects = [];
            selectedId = null;
        }
    });

    onMount(async () => {
        // Only try to load projects if user is logged in
        if ($user) {
            await loadProjects();
        }
    });

    async function selectProject(id: number) {
        selectedId = id;
        const { data, error } = await supabase
            .from('project')
            .select('*')
            .eq('id', id)
            .single();
            
        if (data) {
            console.log('Selected project data:', data);
            console.log('Image URL:', data.img_url);
            project = data;
        }
    }

    async function handleSubmit(event: Event) {
        event.preventDefault();
        
        // When adding new project, don't include id in the upsert
        const projectData = selectedId 
            ? { ...project, id: selectedId }
            : { ...project };

        const { error } = await supabase
            .from('project')
            .upsert([projectData]);

        if (error) {
            console.error('Save error:', error);
            toasts.error(`Failed to save: ${error.message}`);
            return;
        }
        
        toasts.success('Project saved successfully');
        await loadProjects();
        
        // Reset form
        selectedId = null;
        project = {
            project_name: '',
            category: '',
            client: '',
            century: '',
            technologies: '',
            overview: '',
            solution: '',
            img_url: ''
        };
    }

    async function getAndSaveAndUpdateImage() {
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        
        if (!fileInput?.files?.length) {
            toasts.error('No file selected');
            return;
        }

        const fileData = fileInput.files[0];
        const filePath = `${Date.now()}_${fileData.name}`;

        // Debug storage connection
        try {
            // 1. List all buckets
            const { data: buckets, error: bucketError } = await supabase
                .storage
                .listBuckets();
            

            if (bucketError) {
                console.error('Bucket list error:', bucketError);
                toasts.error(`Failed to list buckets: ${bucketError.message}`);
                return;
            }

            // 2. Check if our bucket exists
            const projectBucket = buckets?.find(b => b.name === 'project');


            if (!projectBucket) {
                toasts.error('Project bucket not found. Please check Supabase configuration.');
                return;
            }

            // 3. Attempt upload
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('project')
                .upload(filePath, fileData, {
                    upsert: true,
                    cacheControl: '3600'
                });

            if (uploadError) {
                console.error('Upload error details:', uploadError);
                toasts.error(`Upload failed: ${uploadError.message}`);
                return;
            }

            // 4. Get public URL
            const { data: urlData } = supabase.storage
                .from('project')
                .getPublicUrl(filePath);

            // Just update the URL, don't save the project
            project = {
                ...project,
                img_url: urlData.publicUrl
            };
        } catch (e) {
            console.error('Detailed error:', e);
            toasts.error(`Unexpected error: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
    }

    // Debug function to log current state
    function logState(location: string) {
        console.log(`[${location}] Auth State:`, {
            user: $user,
            loginRequested: $loginRequestedState,
            email: $user?.email
        });
    }

    // Single auth handler with no state management
    async function handleAuthAction() {
        if ($user) {
            // Force immediate signout
            await supabase.auth.signOut();
            await goto('/resume');
        } else {
            window.location.href = '/auth'; // Direct navigation to auth page
        }
    }

    // Add effect to watch auth state changes
    $effect(() => {
        logState('effect - auth state changed');
    });
</script>

<div class="header-section">
    <div class="login-container">
        <button class="home-button" onclick={() => goto('/resume')}>
            <MIcon name="home" size="24px" />
            <span>Resume</span>
        </button>

        <button 
            class={$user ? 'logout-button' : 'login-button'} 
            onclick={handleAuthAction}
        >
            <MIcon name={$user ? 'logout' : 'login'} size="24px" />
            <span>{$user ? `Logout (${$user.email})` : 'Login'}</span>
        </button>
    </div>
</div>

<div class="page-layout">
    <div class="projects-table">
        <div class="table-header">
            <h2>Projects</h2>
            <button 
                type="button" 
                onclick={() => {
                    selectedId = null;
                    project = {
                        project_name: '',
                        category: 'Bespoke Software Solution',
                        client: '',
                        century: '',
                        technologies: '',
                        overview: '',
                        solution: '',
                        img_url: ''
                    };
                    // Focus the project name input after state update
                    setTimeout(() => {
                        document.getElementById('project_name')?.focus();
                    }, 0);
                }}
            >
                Add Project
            </button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Project Name</th>
                </tr>
            </thead>
            <tbody>
                {#each existingProjects as proj}
                    <tr 
                        class:selected={selectedId === proj.id}
                        onclick={() => selectProject(proj.id)}
                    >
                        <td>{proj.id}</td>
                        <td>{proj.project_name}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <form onsubmit={handleSubmit}>
        <div class="form-grid">
            <h2>{selectedId ? 'Edit' : 'Add'} Project</h2>
            <div class="field-row four-columns">
                <div class="field">
                    <label for="project_name">Project Name</label>
                    <input id="project_name" bind:value={project.project_name} placeholder="Project Name" required />
                </div>

                <div class="field">
                    <label for="category">Category</label>
                    <input id="category" bind:value={project.category} placeholder="Category" required />
                </div>

                <div class="field">
                    <label for="client">Client</label>
                    <input id="client" bind:value={project.client} placeholder="Client" required />
                </div>

                <div class="field">
                    <label for="century">Century</label>
                    <input id="century" bind:value={project.century} placeholder="Century" required />
                </div>
            </div>

            <div class="field">
                <label for="technologies">Technologies</label>
                <textarea id="technologies" bind:value={project.technologies} placeholder="Technologies" required></textarea>
            </div>

            <div class="field">
                <label for="overview">Overview</label>
                <textarea id="overview" bind:value={project.overview} placeholder="Overview" required></textarea>
            </div>

            <div class="field">
                <label for="solution">Solution</label>
                <textarea id="solution" bind:value={project.solution} placeholder="Solution" required></textarea>
            </div>

            <div class="field">
                <label for="img_url">Front Page Image</label>
                <input id="img_url" bind:value={project.img_url} type="hidden" />
                <div class="image-upload-container">
                    <img 
                        src={project.img_url} 
                        alt="Project logo" 
                        style="display: {project.img_url ? 'block' : 'none'}" 
                    />
                    <div class="upload-controls">
                        <input 
                            type="file" 
                            id="image-upload" 
                            accept="image/*" 
                            style="display: none"
                            onchange={async () => await getAndSaveAndUpdateImage()}
                        />

                        <div 
                            class="drop-zone" 
                            role="button"
                            aria-label="Drop zone for image upload"
                            tabindex="0"
                            ondragover={(e) => e.preventDefault()}
                            ondrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer?.files[0];
                                if (file) {
                                    const input = document.getElementById('image-upload') as HTMLInputElement;
                                    const dataTransfer = new DataTransfer();
                                    dataTransfer.items.add(file);
                                    input.files = dataTransfer.files;
                                    getAndSaveAndUpdateImage();
                                }
                            }}
                        >
                            <p>Drag image here to upload</p>
                        </div>
                        <SupabaseStorageFileUploader
                        bucketName="project"
                        imageSaved={(path) => {
                            project.img_url = path;
                        }}
                    />
                    </div>
                </div>
            </div>

            <button type="submit" class="save-button">Save Changes</button>
        </div>
    </form>
</div>
{#if selectedId}
    <h2>Images of the project</h2>
    <div class="image-selector">
        <ImageGallery bucketName={`project/${project.project_name}`} canAddNewImages={true} canDeleteImages={true} />
    </div>
{/if}

<!-- Add debug display -->
{#if import.meta.env.DEV}
    <pre style="position: fixed; bottom: 0; right: 0; background: black; color: white; padding: 10px; font-size: 12px; z-index: 9999;">
        User: {$user ? 'Logged in' : 'Not logged in'}
        Email: {$user?.email ?? 'none'}
        LoginRequested: {$loginRequestedState}
    </pre>
{/if}

<style>
    h2 {
        display: flex;
        justify-content: center;
        margin-block-start: 0;
        margin-block-end: 0;
        padding-block-start: 0;
        font-size: 2.5rem;
        color: #ecd402;
        border-block-start: 1px solid #71a9f3;
    }
    .image-selector {
        width: 100%;
        height: 90vh;
        padding: 1rem;
        background: rgb(34, 34, 34);
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .page-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        padding: 2rem;
    }

    .projects-table {
        background: white;
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 0.5rem;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    th {
        font-weight: bold;
        background: #f5f5f5;
    }

    .form-grid {
        display: grid;
        gap: 1rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
        padding-block-start:0;
        color: #e6e7e7;
        grid-template-columns: 1fr;
    }
    .form-grid h2 {
        color: yellow;
        font-size: 2rem;
        font-weight: 600;
        margin-block-start: 0;

    }
    .field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }

    input, textarea {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        color: #013164;
    }

    textarea {
        min-height: 100px;
    }

    button {
        background: dodgerblue;
        color: white;
        border: none;
        cursor: pointer;
    }
    .save-button {
        background: green;
        width: 200px;
        justify-self: flex-end;
    }
    tr {
        cursor: pointer;
        color: #013164;
    }
    tr:hover {
        background: #f0f0f0;
    }
    tr.selected {
        background: #e0e0e0;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-weight: 500;
        color: #e6e7e7;
    }

    .image-upload-container {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }

    .image-upload-container img {
        max-width: 200px;
        max-height: 200px;
        object-fit: contain;
    }

    .upload-controls {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .drop-zone {
        border: 2px dashed #929292;
        border-radius: 4px;
        padding: 1.5rem;
        text-align: center;
        width: 250px;
        height: 150px;
        margin-top: 0.5rem;
        background: rgba(233, 233, 233, 0.514);
        transition: all 0.2s;
        color: #013164;
    }

    .drop-zone:hover {
        background: rgba(1, 49, 100, 0.2);
        cursor: pointer;
        color: #b3d7fd;
    }

    .drop-zone p {
        margin: 0;
        color: #2c2c2c;
    }
    .drop-zone:hover p {
        color: #b3d7fd;
    }

    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .table-header h2 {
        margin: 0;
        color: #013164;
    }

    .header-section {
        padding: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
    }

    .login-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .login-status {
        margin-left: 0;
        flex: 1;
        min-width: 200px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .status-dot {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: #ff4444;
        display: inline-block;
        flex-shrink: 0;
    }

    .status-dot.logged-in {
        background: #44ff44;
    }

    .status-text {
        color: #e6e7e7;
        font-size: 0.9rem;
        flex: 1;
    }

    .home-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: transparent;
        padding: 0.5rem 1rem;
        border: 1px solid #e6e7e7;
        border-radius: 4px;
    }

    .home-button:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .four-columns {
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
    }

    @media (max-width: 1200px) {
        .form-grid {
            max-width: 95%;
        }

        .four-columns {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .page-layout {
            grid-template-columns: 1fr;
            padding: 1rem;
        }

        .form-grid {
            margin: 1rem auto;
        }

        .four-columns {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .projects-table {
            overflow-x: auto;
        }

        table {
            min-width: 100%;
        }

        .image-upload-container {
            flex-direction: column;
        }

        .image-upload-container img {
            max-width: 100%;
        }

        .save-button {
            width: 100%;
        }

        .header-section {
            flex-direction: column;
            align-items: stretch;
        }

        .login-container {
            flex-direction: column;
            width: 100%;
        }

        .login-status {
            text-align: center;
        }
    }

    @media (max-width: 480px) {
        .table-header {
            flex-direction: column;
            gap: 1rem;
        }

        .table-header button {
            width: 100%;
        }

        th, td {
            padding: 0.25rem;
            font-size: 0.9rem;
        }
    }

    .logout-button {
        background: #ff4444;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: background-color 0.3s ease;
    }

    .logout-button:hover {
        background: #cc0000;
    }

    .login-button {
        background: #4444ff;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: background-color 0.3s ease;
    }

    .login-button:hover {
        background: #0000cc;
    }
</style> 
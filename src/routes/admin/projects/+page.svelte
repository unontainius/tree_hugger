<script lang="ts">
    import { onMount } from 'svelte';
    import supabase from '$lib/supabaseClient';
    import { user, loginRequestedState } from '$lib/stores/authStore';
    import { toasts } from '$lib/stores/toastStore';
    import { goto } from '$app/navigation';
    import ImageGallery from '$lib/components/common/ImageGallery.svelte';
    import MIcon from '$lib/components/common/MIcon.svelte';
    import SupabaseStorageFileUploader from '$lib/components/common/SupabaseStorageFileUploader.svelte';
    import { RemovePublicDomain, getPublicUrl } from '$lib/services/StorageBucketService';

    interface ProjectRow {
        id: string;
        project_name: string;
        category: string;
        client: string;
        century: string;
        technologies: string;
        overview: string;
        solution: string;
        img_url: string;
    }

    // State
    let existingProjects = $state<ProjectRow[]>([]);
    let selectedId = $state<string | null>(null);
    let project = $state<ProjectRow>({
        id: '',
        project_name: '',
        category: 'Bespoke Software Solution',
        client: '',
        century: '',
        technologies: '',
        overview: '',
        solution: '',
        img_url: ''
    });

    // Load projects
    async function loadProjects() {
        const { data } = await supabase
            .from('project')
            .select('*');
        
        if (data) existingProjects = data;
    }

    // Select project
    function selectProject(id: string) {
        const selected = existingProjects.find(p => p.id === id);
        if (selected) {
            project = { ...selected };
            selectedId = id;
        }
    }

    // Handle form submission
    async function handleSubmit(event: Event) {
        event.preventDefault();
        
        try {
            if (selectedId) {
                // Update existing project
                const { error } = await supabase
                    .from('project')
                    .update({
                        project_name: project.project_name,
                        category: project.category,
                        client: project.client,
                        century: project.century,
                        technologies: project.technologies,
                        overview: project.overview,
                        solution: project.solution,
                        img_url: project.img_url
                    })
                    .eq('id', selectedId);

                if (error) throw error;
                toasts.success('Project updated successfully');
            } else {
                // Insert new project without id
                const { error } = await supabase
                    .from('project')
                    .insert([{
                        project_name: project.project_name,
                        category: project.category,
                        client: project.client,
                        century: project.century,
                        technologies: project.technologies,
                        overview: project.overview,
                        solution: project.solution,
                        img_url: project.img_url
                    }]);

                if (error) throw error;
                toasts.success('New project created successfully');
            }

            await loadProjects();  // Refresh the project list
        } catch (error) {
            console.error('Save error:', error);
            toasts.error(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Auth handler
    async function handleAuthAction() {
        if ($user) {
            await supabase.auth.signOut();
            existingProjects = [];
            selectedId = null;
            project = {
                id: '',
                project_name: '',
                category: '',
                client: '',
                century: '',
                technologies: '',
                overview: '',
                solution: '',
                img_url: ''
            };
            await goto('/resume');
        } else {
            loginRequestedState.set(true);
        }
        }

    function addNewProject() {
        selectedId = null;
        project = {
            id: '',
            project_name: '',
            category: 'Bespoke Software Solution',
            client: '',
            century: '',
            technologies: '',
            overview: '',
            solution: '',
            img_url: ''
        };
    }

    onMount(async () => {
        if ($user) {
            await loadProjects();
        }
    });
</script>

<div class="header-section">
    <button class="home-button" onclick={() => goto('/resume')}>
        <MIcon name="home" size="24px" />
        <span>Resumé</span>
    </button>

    <button 
        class={$user ? 'logout-button' : 'login-button'} 
        onclick={handleAuthAction}
    >
        <MIcon name={$user ? 'logout' : 'login'} size="24px" />
        <span>{$user ? `Logout (${$user.email})` : 'Login'}</span>
    </button>
</div>

<div class="page-layout">
    <!-- Projects List -->
    <div class="projects-table">
        <div class="table-header">
            <h2>Projects</h2>
            <div class="table-header-buttons">
                <button class="refresh-button" onclick={() => loadProjects()}>
                    <MIcon name="refresh" size="24px" />
                    Refresh
                </button>
                <button class="add-new-button" 
                    type="button" 
                    onclick={() => {addNewProject()}}
                >
                    <MIcon name="add" size="24px" />
                    Add
                </button>
            </div>
        </div>
        <table>
            <thead style="display:none;">
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
                        <td style="display:none;">{proj.id}</td>
                        <td>{proj.project_name}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <!-- Project Form -->
    <div class="project-form">
        <form class="project-form" onsubmit={handleSubmit}>
            <div class="form-fields">
                <!-- Image Upload Area -->
                <div class="image-upload-area">
                    {#if project.img_url}
                        <div class="image-preview">
                            <img 
                                src={project.img_url} 
                                alt="Project thumbnail" 
                                class="project-image"
                            />
                        </div>
                    {:else}
                        <div class="image-placeholder">
                            <MIcon name="image" size="48px" />
                            <span>No image selected</span>
                        </div>
                    {/if}
                    
                    <div class="upload-controls">
                            <div class="add-image-controls">
                                <SupabaseStorageFileUploader
                                    bucketName={project.project_name ? `project` : ''}
                                imageSaved={(path) => {
                                    project.img_url = path;
                                }}
                            />
                            <a href={project.img_url} target="_blank">{RemovePublicDomain(project.img_url)}</a>    
                        </div>
                        <div class="drag-area">
                            <span>or drag and drop an image here</span>
                        </div>
                    </div>
                </div>

                <!-- Rest of the form -->
                <div class="field-row">
                    <div class="field">
                        <label for="project_name">Project Name </label>
                        <input 
                            id="project_name"
                            type="text"
                            bind:value={project.project_name}
                            placeholder="Enter the name of the project"
                            required
                        />
                    </div>
                    <div class="field">
                        <label for="category">Category </label>
                        <input 
                            id="category"
                            type="text"
                            bind:value={project.category}
                            placeholder="e.g., Bespoke Software Solution"
                            required
                        />
                    </div>
                    <div class="field">
                        <label for="client">Client Name </label>
                        <input 
                            id="client"
                            type="text"
                            bind:value={project.client}
                            placeholder="Name of the client"
                            required
                        />
                    </div>
                    <div class="field">
                        <label for="century">Year </label>
                        <input 
                            id="century"
                            type="text"
                            bind:value={project.century}
                            placeholder="e.g., 2024"
                            required
                        />
                    </div>
                </div>

                <div class="field">
                    <label for="technologies">Technologies Used </label>
                    <textarea 
                        id="technologies"
                        bind:value={project.technologies}
                        placeholder="List of technologies, frameworks, and tools used"
                        required
                        ></textarea>
                    <span class="help-text">e.g., Frontend: React, Svelte
                            Backend: Node.js, PostgreSQL
                            Tools: Docker, Git</span>
                </div>
                <div class="field">
                    <label for="overview">Project Overview </label>
                    <textarea 
                        id="overview"
                        bind:value={project.overview}
                        placeholder="Describe the project's background and objectives"
                        required
                        ></textarea>
                    <span class="help-text">Provide context about the project and its goals</span>
                </div>
                <div class="field">
                    <label for="solution">Solution Details </label>
                    <textarea 
                        id="solution"
                        bind:value={project.solution}
                        placeholder="Describe the solution implemented"
                        required
                    ></textarea>
                    <span class="help-text">Explain how the solution addressed the client's needs</span>
                </div>
            </div>
            <button type="submit" class="save-button">
                {selectedId ? 'Update Project' : 'Create Project'}
            </button>
        </form>
    </div>

    <!-- Image Gallery -->
    <div class="gallery-section">
        {#if project.project_name}
            <ImageGallery 
                path={`project/${project.project_name}`}
                canAddNewImages={true} 
                canDeleteImages={true} 
            />
        {/if}
    </div>
</div>

<style>
    .page-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        grid-template-areas: 
            "sidebar form"
            "sidebar gallery";
        gap: 2rem;
        padding: 2rem;
    }

    .projects-table {
        grid-area: sidebar;
        background: white;
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .table-header {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        color: dodgerblue;
    }
    .table-header h2 {
        color: dodgerblue;
        font-size: 2rem;
    }
    .table-header-buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding-inline: 2rem;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 0.5rem;
        text-align: left;
        border-bottom: 1px solid #eee;
        color: #333;
    }

    tr {
        cursor: pointer;
        transition: background-color 0.2s, color 0.2s;
        color: #333;
    }

    tr:hover {
        background-color: #f0f0f0;
    }

    tr.selected {
        background-color: #007bff;
        color: white;
    }

    tr.selected td {
        color: white;
    }

    .project-form {
        grid-area: form;
        background: white;
        padding: 2rem;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        color: #333;
    }

    .field-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .field {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: #333;
    }

    input, textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        color: #333;
        background-color: white;
    }

    textarea {
        height: 150px;
        font-family: inherit;
        line-height: 1.5;
        resize: vertical;
    }

    .save-button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .save-button:hover {
        background: #0056b3;
    }

    .header-section {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .home-button, .login-button, .logout-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .home-button, .refresh-button, .add-new-button {
        background: dodgerblue;
    }

    .login-button {
        background: #28a745;
        color: white;
    }

    .logout-button {
        background: #dc3545;
        color: white;
    }

    .help-text {
        display: block;
        font-size: 0.875rem;
        color: #666;
        margin-top: 0.25rem;
    }

    label::after {
        content: " *";
        color: #dc3545;
    }

    .image-upload-area {
        margin-bottom: 2rem;
        padding: 1rem;
        border: 2px dashed #ddd;
        border-radius: 8px;
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 1rem;
        align-items: start;
    }

    .project-image {
        width: 100%;
        height: auto;
        max-height: 300px;
        object-fit: contain;
        border-radius: 4px;
        background: #f8f9fa;
    }

    .image-placeholder {
        width: 100%;
        aspect-ratio: 16/9;
        background: #f8f9fa;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #666;
        border-radius: 4px;
    }

    .upload-controls {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }

    .drag-area {
        padding: 2rem;
        border: 1px dashed #999;
        border-radius: 4px;
        text-align: center;
        color: #666;
        background: #f8f9fa;
    }

    /* .drag-area.dragging {
        background: #e9ecef;
        border-color: #007bff;
    } */

    .image-preview{
        width: 100%;
        height: auto;
        max-height: 300px;
        object-fit: contain;
        border-radius: 0.5rem;
        background-color: #faf9f8;
    }
    .image-preview img {
        border-radius: 1rem;
    }

    .gallery-section {
        grid-area: gallery;
        width: 100%;
    }
</style>

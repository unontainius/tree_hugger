<script lang="ts">

    interface ProjectRow {
        id: number;
        created_at: string;
        category: string;
        client: string;
        century: string;
        technologies: string;
        overview: string;
        solution: string;
        project_name: string;
    }

    let {project, showMore}: {project: ProjectRow, showMore: () => void} = $props();
</script>

<div class="project-back-page">
    <h2>{project.project_name}</h2>
    <p>{project.category}</p>
    <p>{project.client}</p>
    <p>{project.century}</p>
    <button onclick={showMore}>Show More ...</button>
</div>

<style>
    .project-back-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
    }
    .project-back-page h2 {
        font-size: 1.5rem;
        margin: 0;
    }
    .project-back-page p {
        margin: 0;
    }
    .project-back-page button {
        width: 130px;
        justify-self: center;
        background-color: #212121;
        color: #fff;
        border: none;
        padding: 0.5rem 1rem;
    }
</style>


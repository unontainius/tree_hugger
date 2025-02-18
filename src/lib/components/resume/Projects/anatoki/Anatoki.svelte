<script lang="ts">
    import { onMount } from 'svelte';
    import logo from '$lib/components/resume/Projects/anatoki/anatoki.png';

</script>

<div class="project-container">
    <div class="project-header">
        <img src={logo} alt="Anatoki Logo" />
    </div>
</div>

<style>
    .project-container {
        width: 100%;
        height: 100%;
    }
    .project-header {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #2b2b2be0;
        color: rgb(177, 177, 177);
        border-radius: 1rem;
    }
</style>



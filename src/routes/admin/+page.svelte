<script lang="ts">
	import MIcon from "$lib/components/MIcon.svelte";
</script>

    <div class="nav-container">
        <a class="back-btn" href="/"><MIcon name="back" size="5rem" /></a>
    </div>

    <div class="row">
        <a href="/admin/person">
            <MIcon name="people" size="1.5rem" />
            People
        </a>

    </div>

<style>
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
    a:hover {
        color: #ff00f2;
    }
</style>
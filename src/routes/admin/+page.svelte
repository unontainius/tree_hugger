<script lang="ts">
	import MIcon from "$lib/components/MIcon.svelte";


</script>

<div class="row">
    <a href="/admin/person">
        <MIcon name="people" size="1.5rem" />
        People
    </a>
    <a href="/test/window">
        <MIcon name="people" size="1.5rem" />
        Windows
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

</style>
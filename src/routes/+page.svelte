<script lang="ts">
	import MIcon from '$lib/components/MIcon.svelte';
</script>




    <div class="column">
        <a href="/admin">
            <MIcon name="admin" size="1.5rem" />
            Admin
        </a>
    </div>


<style>
	.column {
		padding-block-start: 5rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
</style>

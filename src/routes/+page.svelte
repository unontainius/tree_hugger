<script lang="ts">
	import MIcon from '$lib/components/common/MIcon.svelte';
	import { user } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import FamilyMenuItem from '$lib/components/family-tree/FamilyMenuItem.svelte';

</script>

<div class="welcome-container">
	<FamilyMenuItem
		title="Family Tree"
		description="Browse and search your family members"
		image="/images/familytree.png"
		loggedIn={$user !== null}
		onclick={() => goto('/admin')}
	/>

	<FamilyMenuItem
		title="Resume"
		description="My professional journey"
		image="/images/marcus.jpg"
		loggedIn={$user !== null}
		onclick={() => goto('/resume')}
	/>
	<FamilyMenuItem
		title="POS"
		description="Point of Sale"
		image="/images/pos.jpg"
		loggedIn={$user !== null}
		onclick={() => goto('/pos')}
	/>
</div>

<style>
	.welcome-container {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: center;
		z-index: 1;
		min-height: 100vh;
		width: 100vw;
		gap: 2rem;
		flex-wrap: wrap;
		margin-block: 6rem;
	}

	:global(.welcome-container > *) {
		height: 100%;
		min-height: 400px;
		width: 200px;
	}
</style>

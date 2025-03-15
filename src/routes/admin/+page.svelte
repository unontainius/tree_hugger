<script lang="ts">
	import { user } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import FamilyMenuItem from '$lib/components/family-tree/FamilyMenuItem.svelte';

	async function setFamilyTreeMenu() {
		goto('/admin/person');
	}
</script>

<div class="welcome-container">
	<FamilyMenuItem
		title="Family Tree&nbsp;Hugger"
		description="Show me the People"
		image="https://axogabedvxdwvhrjcjpq.supabase.co/storage/v1/object/public/images//familytree.png"
		loggedIn={$user !== null}
		onclick={setFamilyTreeMenu}
	/>

	<FamilyMenuItem
		title="Photos & Memories"
		description="HEAD SHOT!"
		image="https://axogabedvxdwvhrjcjpq.supabase.co/storage/v1/object/public/images//sniper.jpg"
		loggedIn={$user !== null}
		onclick={() => goto('/comming-soon')}
	/>

	<FamilyMenuItem
		title="Stories & Tall&nbsp;Tales"
		description="Once upon a time ..."
		image="https://axogabedvxdwvhrjcjpq.supabase.co/storage/v1/object/public/images//book.jpg"
		loggedIn={$user !== null}
		onclick={() => goto('/comming-soon')}
	/>

	<FamilyMenuItem
		title="Anniversaries & Birthdays"
		description="Oh!  Was that today?"
		image="https://axogabedvxdwvhrjcjpq.supabase.co/storage/v1/object/public/images//celebration.jpg"
		loggedIn={$user !== null}
		onclick={() => goto('/comming-soon')}
	/>
</div>

<style>
	.welcome-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		z-index: 1;
		min-height: 70vh;
		width: 100vw;
		gap: 2rem;
		flex-wrap: wrap;
		margin-block: 6rem;
	}
</style>

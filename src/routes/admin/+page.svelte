<script lang="ts">
	import MIcon from '$lib/components/MIcon.svelte';
	import { user } from '$lib/stores/authStore';
	import { loginRequestedState } from '$lib/stores/authStore';
	import { menuName } from '$lib/stores/menuStore';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import FamilyMenuItem from '$lib/components/FamilyMenuItem.svelte';

	let LoggedIn = $state(false);

	$effect(() => {
		LoggedIn = $user !== null;
	});

	async function setFamilyTreeMenu() {
		$menuName = 'family-tree';
		await tick();
		goto('/admin/person');
	}

	async function setFamilyPhotosMenu() {
		$menuName = 'photos';
		await tick();
		goto('/photos');
	}

	async function setAnniversariesMenu() {
		$menuName = 'anniversaries';
		await tick();
		goto('/anniversaries');
	}

	async function setFamilyStoriesMenu() {
		$menuName = 'stories';
		await tick();
		goto('/stories');
	}

</script>

<div class="welcome-container">

	<FamilyMenuItem title="Family Tree&nbsp;Hugger" 
		description="Show me the People" 
		image="/images/familytree.png"
		loggedIn={LoggedIn}
		onclick={setFamilyTreeMenu} 
	/>

	<FamilyMenuItem title="Photos & Memories" 
		description="HEAD SHOT!" 
		image="/images/sniper.jpg" 
		loggedIn={LoggedIn}
		onclick={setFamilyPhotosMenu} 
	/>

	<FamilyMenuItem title="Stories & Tall&nbsp;Tales" 
		description="Once upon a time ..." 
		image="/images/book.jpg" 
		loggedIn={LoggedIn}
		onclick={setFamilyStoriesMenu} 
	/>

	<FamilyMenuItem title="Anniversaries & Birthdays" 
		description="Oh!  Was that today?" 
		image="/images/celebration.jpg" 
		loggedIn={LoggedIn}
		onclick={setAnniversariesMenu} 
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

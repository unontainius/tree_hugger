<script lang="ts">
	import MIcon from '$lib/components/MIcon.svelte';
	import { user } from '$lib/stores/authStore';
	import { loginRequestedState } from '$lib/stores/authStore';
	import { menuName } from '$lib/stores/menuStore';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';

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

</script>

<div class="welcome-container">

		<div class="card">
			<button onclick={setFamilyTreeMenu} >
				<div class="row">
					<div class="column center">
						<div class="gold">	
							<img src="/images/familytree.png" alt="Tree Hugger" />
						</div>
					</div>
					<div class="column center">
						<h2>Family Tree Hugger</h2>
						<p>Browse and search your family members</p>
						{#if !LoggedIn}
							<div class="login-hint">
								Hint: 
								<MIcon name="login" size="24px" />
								<span>Login to edit</span>
							</div>
						{/if}
					</div>
				</div>
			</button>
		</div>

		<div class="card">
			<button onclick={setFamilyPhotosMenu} >
				<div class="row">
					<div class="column center">
						<div class="gold">	
							<img src="/images/leaves.jpg" alt="Tree Hugger" />
						</div>
					</div>
					<div class="column center">
						<h2>photos</h2>
						<p>Browse family photos</p>
						{#if !LoggedIn}
							<div class="login-hint">
								Hint: 
								<MIcon name="login" size="24px" />
								<span>Login to edit</span>
							</div>
						{/if}
					</div>
				</div>
			</button>
		</div>

		<div class="card">
			<button onclick={setAnniversariesMenu} >
				<div class="row">
					<div class="column center">
						<div class="gold">	
							<img src="/images/celebration.jpg" alt="Tree Hugger" />
						</div>
					</div>
					<div class="column center">
						<h2>Anniversaries</h2>
						<p>Browse family anniversaries</p>
						{#if !LoggedIn}
							<div class="login-hint">
								Hint: 
								<MIcon name="login" size="24px" />
								<span>Login to edit</span>
							</div>
						{/if}
					</div>
				</div>
			</button>
		</div>

</div>

<style>
	button {
		cursor: pointer;
		pointer-events: auto;
		background: transparent;
		border: none;
		border-radius: 1rem;
		padding: 0;
		margin: 0;
		font: inherit;
		color: inherit;
		box-shadow: none;
	}
	
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		background: linear-gradient(0deg, #1a1a1a79, #5f5f5f50);

		border-radius: 1rem;
		text-decoration: none;
		color: white;
		width: 100%;
		height: 100%;
	}
	.row:hover {
		transform: translateY(-5px);
		background: rgba(0, 0, 0, 0.568);
	}
	.column {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		width: 100%;
		height: 100%;
		flex-wrap: wrap;
		min-width: 300px;
		text-align: center;
	}
	.card {
		width: 340px;
		max-width: 95%;
	}
	.column img {
		width: 200px;
		height: 200px;
		object-fit: cover;
		justify-content: center;
	}
	.center {
		align-items: center;
		justify-content: center;
	}
	.welcome-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		z-index: 1;
		min-height: 90vh;
		width: 100vw;
		gap: 2rem;
		flex-wrap: wrap;
	}

	h2 {
		font-size: 2rem;
		margin-block-start: 1rem;
		background: linear-gradient(0deg, #064e09, #88ff00);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	p {
		font-size: 1rem;
		margin-block-end: 1rem;
		color: rgba(255, 255, 255, 0.5);
	}
	.login-hint {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
		color: #aaa;
		font-size: 0.9rem;
		margin-block-end: 2rem;
	}
	.gold {
		margin-block-start: 1rem;
		width: 220px;
		height:220px;
		border-radius: 50%;
		padding: 0.5rem;
		background: radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),
					radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%);
	}
	.gold img {
		position: relative;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;

	}

	@media (max-width: 768px) {
	}
</style>

<script lang="ts">
	import MIcon from '$lib/components/MIcon.svelte';
	import { user } from '$lib/stores/authStore';
	import { menuName, menuRequired } from '$lib/stores/menuStore';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';

	let LoggedIn = $state(false);

	$effect(() => {
		LoggedIn = $user !== null;
	});

	async function setFamilyTreeMenu() {
		$menuRequired = true;
		$menuName = 'family-tree';
		await tick();
		goto('/admin');
	}

	async function setResumeMenu() {
		$menuRequired = false;
		$menuName = 'resume';
		await tick();
		goto('/resume');
	}
</script>

<div class="welcome-container">
	<div class="gold-border">
		<div class="card">
			<button onclick={setFamilyTreeMenu}>
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
	</div>

	<div class="gold-border">
		<div class="card">
			<button class="resume-button" onclick={setResumeMenu}>
				<div class="row">
					<div class="column center">
						<div class="gold">
							<img src="/images/familytree.png" alt="Tree Hugger" />
						</div>
					</div>
					<div class="column center">
						<h2 class="resume-title">Resume</h2>
						<p>My professional journey</p>
					</div>
					{#if !LoggedIn}
						<div class="resume-spacer">
							Hint:
							<span>Login to edit</span>
						</div>
					{/if}
				</div>
			</button>
		</div>
	</div>
</div>

<style>
	.resume-title {
		font-size: 2rem;
		margin-block-start: 1rem;
		background: linear-gradient(0deg, #064e09, #88ff00);
		background-clip: text;
		-webkit-background-clip: text;
	}
	.resume-spacer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
		color: transparent;
		font-size: 0.9rem;
		margin-block-end: 2rem;
	}

	button {
		cursor: pointer;
		pointer-events: auto;
		background: rgb(26, 114, 180);
		background: -moz-linear-gradient(180deg, rgba(26, 114, 180, 1) 0%, rgba(30, 41, 59, 1) 54%);
		background: -webkit-linear-gradient(180deg, rgba(26, 114, 180, 1) 0%, rgba(30, 41, 59, 1) 54%);
		background: linear-gradient(180deg, rgba(26, 114, 180, 1) 0%, rgba(30, 41, 59, 1) 54%);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#1a72b4",endColorstr="#1e293b",GradientType=1);
		border: none;
		border-radius: 1rem;
		padding: 0;
		margin: 0;
		font: inherit;
		color: inherit;
		box-shadow: none;
	}
	.resume-button {
		background: rgb(26, 114, 180);
		background: -moz-linear-gradient(180deg, rgba(26, 114, 180, 1) 0%, rgb(0, 0, 0) 54%);
		background: -webkit-linear-gradient(180deg, rgba(26, 114, 180, 1) 0%, rgba(30, 41, 59, 1) 54%);
		background: linear-gradient(180deg, rgb(255, 169, 39) 0%, rgba(30, 41, 59, 1) 54%);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#1a72b4",endColorstr="#1e293b",GradientType=1);
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
		/* transform: translateY(-5px); */
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
		margin: 2px;
		width: 340px;
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
		min-height: 70vh;
		width: 100vw;
		gap: 2rem;
		flex-wrap: wrap;
		margin-block: 6rem;
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
		height: 220px;
		border-radius: 50%;
		padding: 0.5rem;
		background: radial-gradient(
				ellipse farthest-corner at right bottom,
				#fedb37 0%,
				#fdb931 8%,
				#9f7928 30%,
				#8a6e2f 40%,
				transparent 80%
			),
			radial-gradient(
				ellipse farthest-corner at left top,
				#ffffff 0%,
				#ffffac 8%,
				#d1b464 25%,
				#5d4a1f 62.5%,
				#5d4a1f 100%
			);
	}
	.gold img {
		position: relative;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}
	.gold-border {
		padding: 0;
		margin: 0;
		border-radius: 1rem;
		background: radial-gradient(
				ellipse farthest-corner at right bottom,
				#fedb37 0%,
				#fdb931 8%,
				#9f7928 30%,
				#8a6e2f 40%,
				transparent 80%
			),
			radial-gradient(
				ellipse farthest-corner at left top,
				#ffffff 0%,
				#ffffac 8%,
				#d1b464 25%,
				#5d4a1f 62.5%,
				#5d4a1f 100%
			);
	}
	@media (max-width: 768px) {
	}
</style>

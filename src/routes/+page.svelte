<script lang="ts">
	import MIcon from '$lib/components/MIcon.svelte';
	import { user } from '$lib/stores/authStore';
	import { loginRequestedState } from '$lib/stores/authStore';

	let LoggedIn = $state(false);

	$effect(() => {
		LoggedIn = $user !== null;
	});
</script>

<div class="welcome-container">
	<div class="content">
		<div class="card">
			<a href="/admin/person" class="">
				<div class="row">
					<div class="column center">
						<div class="blob">	
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
			</a>
		</div>
	</div>
</div>

<style>
	
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
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		position: relative;
		z-index: 1;
		padding-block-start: 7rem;
	}

	.content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
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
	.blob {
		position: relative;
		top: 10px;
		left: -17px;
		border-radius: 50%;
		width: 320px;
		height: 320px;
	}

	.blob img {
		position: relative;
		top: -5px;
		left: 1.05rem;
		width: 100%;
		height: 100%;
		object-fit: cover;
		outline: 8px solid #013d55;
		border-radius: 50%;
		outline-offset: -6px;
	}

	@media (max-width: 768px) {
	}
</style>

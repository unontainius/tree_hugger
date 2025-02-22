<script lang="ts">
	import MIcon from '$lib/components/common/MIcon.svelte';
	import { user } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';

</script>

<div class="welcome-container">
	<div class="gold-border">
		<div class="card">
			<button onclick={() => {goto('/admin')}}>
				<div class="row">
					<div class="gold">
						<img src="/images/familytree.png" alt="Tree Hugger" />
					</div>
					<div class="text-content">
						<h2>Family Tree Hugger</h2>
						<p>Browse and search your family members</p>
						{#if !$user}
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
			<button class="resume-button" onclick={() => {goto('/resume')}}>
				<div class="row">
					<div class="gold">
						<img src="/images/marcus.jpg" alt="Tree Hugger" />
					</div>
					<div class="text-content">
						<h2 class="resume-title">Resume</h2>
						<p>My professional journey</p>
						{#if !$user}
							<div class="resume-spacer">
								Hint:
								<span>Login to edit</span>
							</div>
						{/if}
					</div>
				</div>
			</button>
		</div>
	</div>
</div>

<style>
	.resume-title {
		font-size: 2rem;
		margin-block-start: 1rem;

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
		border: none;
		border-radius: 1rem;
		background: none;
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
		text-align: center;
	}
	.card {
		margin: 2px;
		width: 300px;
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
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}
	p {
		font-size: 1rem;
		margin-block-end: 1rem;
		color: rgba(22, 22, 22, 0.5);
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
		background: white;
	}
	.text-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		text-align: center;
	}
	@media (max-width: 768px) {
		.welcome-container {
			flex-direction: column;
			gap: 1rem;
			padding-inline: 1rem;
		}

		.card {
			width: 100%;
		}

		.row {
			flex-wrap: nowrap;
			flex-direction: row;
			justify-content: flex-start;
			padding: 0.5rem;
		}

		.column {
			width: auto;
			flex: 0 0 auto;
		}

		.column.center {
			align-items: flex-start;
			padding-left: 1rem;
			justify-content: center;
		}

		.gold {
			width: 80px;
			height: 80px;
			margin: 0;
		}

		h2 {
			font-size: 1.5rem;
			margin-block-start: 0;
		}

		.login-hint {
			margin-block-end: 0;
		}

		.text-content {
			align-items: flex-start;
			text-align: left;
		}
	}
</style>

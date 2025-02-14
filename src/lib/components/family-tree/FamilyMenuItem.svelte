<script lang="ts">
	import MIcon from '$lib/components/common/MIcon.svelte';

	let {
		title = '',
		description = '',
		loggedIn = false,
		image = '',
		onclick = () => {}
	} = $props<{
		title: string;
		description: string;
		loggedIn: boolean;
		image: string;
		onclick: () => void;
	}>();
	let LoggedIn = $state(false);

	$effect(() => {
		LoggedIn = loggedIn;
	});
</script>

<div class="gold-border">
	<div class="card">
		<button {onclick}>
			<div class="row">
				<div class="column center">
					<div class="gold">
						<img src={image} alt={title} />
					</div>
				</div>
			</div>
			<div class="column center">
				<h2 class="gold-text">{title}</h2>
				<p>{description}</p>
				{#if !LoggedIn}
					<div class="login-hint">
						Hint:
						<MIcon name="login" size="24px" />
						<span>Login to edit</span>
					</div>
				{/if}
			</div>
		</button>
	</div>
</div>

<style>
	h2 {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
		font-size: 1.5rem;
		width: 150px;
	}
	.gold-border {
		padding: 3px;
		margin: 1rem;
		border-radius: 0.5rem;
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
				rgb(170, 136, 57) 62.5%,
				rgb(146, 123, 68) 100%
			);
	}

	.gold-text {
		background: linear-gradient(
			to right,
			#8b625f 0,
			#cb9b51 22%,
			#f6e27a 45%,
			#f6f2c0 50%,
			#f6e27a 55%,
			#cb9b51 78%,
			#8b625f 100%
		);

		color: transparent;
		-webkit-background-clip: text;
		background-clip: text;
		font-weight: bold;
		text-shadow: 0px 0px 4px rgba(203, 155, 81, 0.3);
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgb(32, 32, 32);
		padding: 0.5rem;
		border-radius: 0.5rem;
		width: 100%;
		height: 100%;
	}

	button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		padding: 0;
		box-shadow: none;
	}

	.row {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.center {
		align-items: center;
		text-align: center;
	}

	.gold {
		padding: 6px;
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
		border-radius: 50%;
	}

	img {
		width: 140px;
		height: 140px;
		object-fit: cover;
		border-radius: 50%;
	}

	.login-hint {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: #666;
	}
</style>

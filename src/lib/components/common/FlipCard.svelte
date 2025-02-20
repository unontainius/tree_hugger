<script lang="ts">

	let { frontPage, backPage } = $props();
</script>

<!-- Usage In the CALLING Page or component -->
<!-- {#snippet frontPage()}
	<div>
		<p>
			This is the front page of the card. It contains the main information about the card.
		</p>
	</div>
{/snippet}

{#snippet backPage()}
	<div>Back</div>
	<div>
		<p>
			This is the back page of the card. It contains more information about the card.
		</p>
	</div>
{/snippet} -->


<div class="flip-card">
	<div class="flip-card-inner">
		<div class="flip-card-front">
			{@render frontPage()}
		</div>
		<div class="flip-card-back">
			{@render backPage()}
		</div>
	</div>
</div>

<style>
	.flip-card {
		background-color: transparent;
		width: 100%;
		min-width: 250px;
		height: 100%;
		min-height: 250px;
		perspective: 1000px;
		border-radius: 1rem;

	}

	.flip-card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		text-align: center;
		transition: transform 0.6s;
		transform-style: preserve-3d;

	}

	.flip-card:hover .flip-card-inner {
		transform: rotateY(180deg);
	}

	.flip-card-front,
	.flip-card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		border-radius: 1rem;
	}

	.flip-card-front {
		background-color: transparent;
		color: rgb(177, 177, 177);
		border-radius: 1rem;
	}

	.flip-card-back {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		color: white;
		transform: rotateY(180deg);
		border-radius: 1rem;
		height: 80%;
	}
</style>

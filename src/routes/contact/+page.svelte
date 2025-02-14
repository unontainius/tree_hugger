<script lang="ts">
	import MIcon from '$lib/components/common/MIcon.svelte';
</script>

<div class="content">
	<div class="header">
		<div class="gold">
			<img src="/images/familytree.png" alt="logo" />
		</div>

		<div class="col-center">
			<h1 class="gold-text">Contact</h1>
			<div class="col-start">
				<div class="flex flex-row gap-4"><MIcon name="email" size="2rem" /> marcus@v-sys.co.nz</div>
				<div class="flex flex-row gap-4"><MIcon name="phone" size="2rem" /> 64 27 2212 880</div>
				<div class="flex flex-row gap-4">
					<MIcon name="web" size="2rem" />
					<a href="https://v-sys.co.nz" target="_blank"> https://v-sys.co.nz</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	h1 {
		font-size: 4rem;
		color: rgba(255, 255, 255, 0.308);
	}
	a:hover {
		color: rgb(241, 4, 241);
	}
	.gold-text {
		background: linear-gradient(
			to right,
			#462523 0,
			#cb9b51 22%,
			#f6e27a 45%,
			#f6f2c0 50%,
			#f6e27a 55%,
			#cb9b51 78%,
			#462523 100%
		);
		color: transparent;
		-webkit-background-clip: text;
		background-clip: text;
		font-weight: bold;
		text-shadow: 1px 1px 1px rgba(203, 155, 81, 0.7);
	}
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 70vh;
	}
	.header {
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin-block-start: 3.5rem;
	}

	.col-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.col-start {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: start;

		gap: 1rem;
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
</style>

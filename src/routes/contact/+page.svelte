<script lang="ts">
	import MIcon from '$lib/components/common/MIcon.svelte';
</script>

<div class="content">
	<div class="header">
		<MIcon name="contact" size="256px" color="rgba(0, 0, 0, 0.645)"/>

		<div class="col-center">
			<h1>Contact</h1>
			<div class="col-start">
				<div class="info-row"><MIcon name="email" size="2rem" color="black"/> marcus@v-sys.co.nz</div>
				<div class="info-row"><MIcon name="phone" size="2rem" color="black"/> 64 27 2212 880</div>
				<div class="info-row">
					<MIcon name="web" size="2rem" color="black"/>
					<a href="https://v-sys.co.nz" target="_blank"> https://v-sys.co.nz</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	h1 {
		font-size: 4rem;
		font-weight: 600;
		color: rgb(255, 255, 255);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.945);
	}
	a:hover {
		color: rgb(241, 4, 241);
	}
	.info-row {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 1.5rem;
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

</style>

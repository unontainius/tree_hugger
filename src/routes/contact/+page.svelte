<script lang="ts">
	import InnerCurve from '$lib/components/InnerCurve.svelte';
	import MIcon from '$lib/components/MIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="content">

		<div class="header">
			<div class="gold">
				<img src="/images/familytree.png" alt="logo" />
			</div>
			
			<div class="col-center">
				<h1 class="">Contact</h1>
				<div class="col-start">
					<span><MIcon name="email" size="2rem" /> marcus@v-sys.co.nz</span>
					<span><MIcon name="logout" size="2rem" /> 64 27 2212 880</span>
					<span><MIcon name="web" size="2rem" /> <a href="https://v-sys.co.nz" target="_blank"> https://v-sys.co.nz</a></span>
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
		color:rgb(241, 4, 241);
	}
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 70vh;

	}
	.header {
		padding:0;
		margin:0;
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
        justify-content: start;
        align-items: start;


        gap: 1rem;

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
</style>

<script lang="ts">
	import InnerCurve from '$lib/components/InnerCurve.svelte';
	import MIcon from '$lib/components/MIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="col pt-40">
	<div class="row">
		<div class="col mr-10">
			<div class="blob">
				<img src="/images/familytree.png" alt="logo" />
			</div>

		</div>
		<div class="col-start">
			<h1 class="">Contact</h1>

			<div class="row">
				<p><MIcon name="email" size="2rem" /> marcus@v-sys.co.nz</p>


			</div>

			<div class="row">
				<p><MIcon name="logout" size="2rem" /> 64 27 2212 880</p>
			</div>


			<div class="row">
				<p><MIcon name="web" size="2rem" /> https://v-sys.co.nz</p>
			</div>
		</div>
	</div>
</div>

<style>
    h1 {
        font-size: 4rem;
        color: rgba(255, 255, 255, 0.308);
    }
	.col {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}
    .row p {
        font-size: 1.5rem;
        color: rgba(255, 255, 255, 0.637);
        padding-block-end: 0.5rem;
    }
	.row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		height: 100%;
	}

    .col-start {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        height: 100%;
        gap: 1.5rem;

    }

	.blob {
		position: relative;
		top: 20px;
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
		outline: 16px solid #013d55;
		border-radius: 50%;
		outline-offset: -6px;
	}
</style>

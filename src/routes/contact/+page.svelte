<script lang="ts">
	import InnerCurve from '$lib/components/InnerCurve.svelte';
	import MIcon from '$lib/components/MIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="content">

		<div class="header">
			<div class="blob">
				<img src="/images/familytree.png" alt="logo" />
			</div>
			
			<div class="col-start">
				<h1 class="">Contact</h1>
				<span><MIcon name="email" size="2rem" /> marcus@v-sys.co.nz</span>
				<span><MIcon name="logout" size="2rem" /> 64 27 2212 880</span>
				<span><MIcon name="web" size="2rem" /> https://v-sys.co.nz</span>
			</div>
		</div>

</div>

<style>
    h1 {
        font-size: 4rem;
        color: rgba(255, 255, 255, 0.308);
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


    .col-start {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        gap: 1rem;

    }

	.blob {
		position: relative;
		top: 20px;
		border-radius: 50%;
		width: 220px;
		height: 220px;
	}

	.blob img {
		position: relative;
		top: -5px;
		/* left: 1.05rem; */
		width: 100%;
		height: 100%;
		object-fit: cover;
		outline: 6px solid #013d55;
		border-radius: 50%;
		outline-offset: -6px;
	}
</style>

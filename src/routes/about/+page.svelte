<script lang="ts">
	import InnerCurve from '$lib/components/InnerCurve.svelte';
	import MIcon from '$lib/components/MIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<!-- <div class="col pt-40"> -->

	<div class="col">
		<div class="header">
			<div class="blob">
				<img src="/images/familytree.png" alt="logo" />
			</div>
			<h1>About</h1>
		</div>
	</div>

	<div class="row">
		<div class="col-start">

			<p>
				&#x201F;My intention is to keep developing this site with more and more features as I think of them, or as the users, you, suggest them to me.&#x201D;
			</p>

			<p>
				&#x201F;I'd like to add the ability to add pictures and stories to individuals.  A quick "show me birthdays" or "show me anniversaries" could be a nice features too.&#x201D;
			</p>
            <div class="signed">
                Marcus

            </div>
		</div>
	</div>
<!-- </div> -->

<style>
	h1 {
		font-size: 4rem;
		color: rgba(255, 255, 255, 0.63);
	}
	p {
		font-size: 1.5rem;
		color: white;
		max-width: 50ch;
		border-radius: 8px;
		border-left: 8px solid rgba(255, 255, 255, 0.623);
		padding-left: 1rem;
		margin-inline: 2rem;
		margin-block-start: 2rem;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
	}

	.header {
		padding:0;
		margin:0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;

	}
	.col-start p {
		font-size: 1.5rem;
		font-weight: 100;
		color: rgba(255, 255, 255, 0.67);
		max-width: 50ch;
        border-radius: 8px;
		border-left: 8px solid rgba(255, 255, 255, 0.623);
		padding-left: 1rem;
		margin-inline: 2rem;
		margin-block-start: 2rem;

	}
	.col {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}
	.signed {
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.608);
		max-width: 50ch;
		width: 100%;
		text-align: right;
		padding-inline-end: 2rem;
	}
       
	.row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		height: 100%;
		margin-block-end: 2rem;
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
		margin-block-start: 5rem;
		position: relative;
		top: 20px;
		border-radius: 50%;
		width: 220px;
		eight: 220px;
	}
	.blob img {
		position: relative;
		top: -5px;
		/* left: 1.05rem; */
		min-width: 100%;
		min-height: 100%;
		object-fit: cover;
		outline: 6px solid #013d55;
		border-radius: 50%;
		outline-offset: -6px;

	}

@media (max-width: 768px) {

}
</style>

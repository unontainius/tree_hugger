<script lang="ts">
	import InnerCurve from '$lib/components/InnerCurve.svelte';
	import MIcon from '$lib/components/MIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="content">

	<div class="row">
		<div class="header">
			<div class="gold">
				<img src="/images/familytree.png" alt="logo" />
			</div>
			<h1 class="gold-text">About</h1>
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
                Marcus 😉
            </div>
		</div>
	</div>
</div>

<style>
	    .gold-text {
        background: linear-gradient(to right, #462523 0, #cb9b51 22%, #f6e27a 45%, #f6f2c0 50%, #f6e27a 55%, #cb9b51 78%, #462523 100%);
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        font-weight: bold;
        text-shadow: 1px 1px 1px rgba(203, 155, 81, 0.7);
    }

    /* Alternative simpler version */

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
	.content {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}


	.header {
		padding:0;
		margin: 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: flex-end;
		flex-wrap: wrap;
		gap: 1rem;
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

	}
	.col-start {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		height: 100%;
		gap: 1.5rem;
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

@media (max-width: 768px) {

}
</style>

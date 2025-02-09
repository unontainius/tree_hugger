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
			<h1 class="">About</h1>

			<p>
				&#x201F;My intention is to keep developing this site with more and more features as I think of them, or as the users, you, suggest them to me.&#x201D;
			</p>

			<p>
				&#x201F;I want to add the ability to add pictures and stories to individuals.  A quick "show me birthdays" or "show me anniversaries" could be a nice features too.&#x201D;
			</p>
            <div class="signed">
                Marcus
            </div>
		</div>
	</div>
</div>

<style>
	h1 {
		font-size: 4rem;
		color: rgba(255, 255, 255, 0.63);
	}
	.col-start p {
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.308);
		max-width: 50ch;

        border-radius: 8px;
		border-left: 8px solid rgba(255, 255, 255, 0.623);
		padding-left: 1rem;

	}
	.col {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}
.signed {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.308);
    max-width: 50ch;
    width: 100%;
    text-align: right;
    padding-inline-end: 1rem;
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

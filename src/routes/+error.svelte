<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="col">
	<div class="error ">
		<h1>Error</h1>
		<p>Page: {page.url.pathname}</p>
		<p>Message: {page.error?.message}</p>
	</div>
</div>

<style>
	h1 {
		font-size: 2rem;
		font-weight: bold;
	}
	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		animation: fadeIn 2.5s ease-in-out;
		animation-fill-mode: forwards;

	}
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease-in-out;
		transform: translateY(40vh);
	}
</style>

<script lang="ts">
	let { children, backgroundColor = '#ED303C' } = $props();
</script>

<div class="inner-curve" style="background: {backgroundColor}">
	{@render children()}
</div>

<style>
	/* HTML: <div class="inner-curve"></div> */
	.inner-curve {
		--r: 20px; /* control the rounded part */
		--s: 160px; /* control the size of the cut */
		--a: 20deg; /* control the depth of the curvature */
		--p: 20%; /* control the position */
		display: flex;
		justify-content: flex-start;
		padding: 1.5rem;
		align-items: center;
		height: 300px;
		aspect-ratio: 7/2;
		max-width: 100%;
		border-radius: var(--r);
		--_m: var(--r), #000 calc(100% - 1px), #0000;
		--_d: (var(--s) + var(--r)) * cos(var(--a));
		mask:
			radial-gradient(var(--r) at calc(var(--p) + var(--_d)) var(--_m)),
			radial-gradient(var(--r) at calc(var(--p) - var(--_d)) var(--_m)),
			radial-gradient(
					var(--s) at var(--p) calc(-1 * sin(var(--a)) * var(--s)),
					#0000 100%,
					#000 calc(100% + 1px)
				)
				0 calc(var(--r) * (1 - sin(var(--a)))) no-repeat,
			linear-gradient(
				90deg,
				#000 calc(var(--p) - var(--_d)),
				#0000 0 calc(var(--p) + var(--_d)),
				#000 0
			);
	}
</style>

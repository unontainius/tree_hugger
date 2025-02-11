<script lang="ts">
	import { menuName } from '$lib/stores/menuStore';
	import { onMount } from 'svelte';

	onMount(() => {
		$menuName = 'family-tree';
	});
</script>

<slot />

<script lang="ts">
    import { cubicIn } from 'svelte/easing';

    let { data, duration = 300, children }: { data: any, duration?: number, delay?: number, children: any } = $props();

    type params = {
        duration?: number,
        delay?: number,
        easing?: (t: number) => number,
        direction?: 'in' | 'out' | 'both',
    }

    const origin = {
		in: 'bottom center',
		out: 'bottom center',
		both: 'center center',
	} as const;

	function scaleInOut(
		node: HTMLElement, 
		{ delay = 0, duration = 300, easing = cubicIn }: params = {},
		{ direction = 'both' }: { direction?: keyof typeof origin } = {}
	) {
		return {
			delay,
			duration,
			easing,
			css: (t: number) => `scale: ${t}; transform-origin: ${origin[direction]};`
		};
	}
</script>

{#key data.url}

    <div in:scaleInOut={{duration: 300, delay: duration}} 
        out:scaleInOut={{duration: 300}}>
        <main >
            {@render children()}
        </main>
    </div>

{/key}
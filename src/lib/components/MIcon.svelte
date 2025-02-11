<script lang="ts">
    let { 
        name, 
        size = '48px',
        color = 'white'
    } = $props();

    let isBlank = $derived(name.includes('blank'));
    let iconError = $state(false);
    let svgContent = $state('');

    async function loadSvg() {
        try {
            const response = await fetch(`/icons/${name}.svg`);
            let content = await response.text();
            // Ensure SVG has width and height attributes
            content = content.replace(/<svg/, `<svg width="${size}" height="${size}"`);
            svgContent = content;
        } catch (error) {
            iconError = true;
            console.warn(`Icon not found: ${name}`);
        }
    }

    $effect(() => {
        if (!isBlank) {
            loadSvg();
        }
    });
</script>

<div 
    class="icon" 
    style="width: {size}; height: {size}; color: {isBlank ? 'transparent' : color};"
    aria-label={name}
>
    {#if isBlank}
        <div class="blank"></div>
    {:else if iconError}
        <div class="icon-error">!</div>
    {:else}
        {@html svgContent}
    {/if}
</div>

<style>
    .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .icon :global(svg) {
        width: 100%;
        height: 100%;
    }

    .blank {
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    .icon-error {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,0,0,0.2);
        color: red;
        font-weight: bold;
        border-radius: 4px;
    }
</style> 
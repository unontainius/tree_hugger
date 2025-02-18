<script lang="ts">
    // Internal state for animation control
    let isAnimating = true; // State to track whether the animation is active

    // Function to toggle the animation on/off
    function toggleAnimation() {
        const earthElement = document.querySelector('.earth-rotating') as HTMLElement; // Cast to HTMLElement
        earthElement.style.animationPlayState = isAnimating ? 'paused' : 'running';
        isAnimating = !isAnimating;
        console.log("Animation toggled. isAnimating:", isAnimating); // Debugging
    }
</script>

<!-- Template -->
<div class="earth-container">
    <!-- Rotating Earth Surface -->
    <div class="earth-rotating"></div>
    <!-- Toggle Animation Button -->
    <!-- <button class="toggle-button" onclick={toggleAnimation}>
        {#if isAnimating}
            Pause Rotation
        {:else}
            Start Rotation
        {/if}
    </button> -->
</div>

<style>
    /* Container for the Earth display */
    .earth-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 20px auto;
        width: 300px;
        height: 300px;
        position: relative;
    }

    /* Rotating Earth Surface */
    .earth-rotating {
        width: 100%;
        height: 100%;
        border-radius: 50%; /* Make it circular */

          overflow: hidden;
        background-image: url('https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg'); /* Earth texture */
        background-size: 200% 100%; /* Extend the texture horizontally for smooth scrolling */
        background-repeat: repeat-x; /* Repeat the texture horizontally */
        animation: rotateSurface 10s linear infinite; /* Default animation */
        /* Add blur effect to edges */
        box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.7) inset;
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.7));
    }

    /* Keyframes for horizontal scrolling */
    @keyframes rotateSurface {
        from {
            background-position: 0% 50%; /* Start at the left edge */
        }
        to {
            background-position: 200% 50%; /* Scroll to the right edge */
        }
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
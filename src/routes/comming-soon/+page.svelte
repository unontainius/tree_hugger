<script lang="ts">
import 'animate.css';


let showText = $state(true);

function handleAnimationEnd() {
    showText = false;
}

</script>

<div class="container">
    <img src="/images/eventually.jpg" alt="Coming Soon" />
    <h1>Coming Sooner or later</h1>
    {#if showText}
        <p class="animate__animated animate__hinge" onanimationend={handleAnimationEnd}>
            Under construction. Please check back sooner or later.
        </p>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 90vh;
        transform: rotate(-22deg);
    }
    img {
        width: 400px;
        height: 200px;
        object-fit: cover;
        border-radius: 10px;

    }
    h1 {
        font-size: 2rem;
        font-weight: bold;
        color: #333;
    }
    
    .animate__hinge {
        animation-duration: 2s;
    }
</style>
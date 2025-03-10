<script lang="ts">
    import POS from "$lib/components/pos/POS.svelte";

    interface Dimensions {
        width: string;
        height: string;
    }

    const emulatedViewPort: Dimensions[] = [{
        width: "1180px",
        height: "820px" 
    }, {
        width: "1024px",
        height: "768px"
    }, {
        width: "800px",
        height: "600px"
    }, {
        width: "640px",
        height: "480px"
    }];


    let selectedIndex = $state(0);
    let sizeToView = $derived(emulatedViewPort[selectedIndex]);

</script>

<div class="page-container">
    <div class="mockup-container">
        Mock-up from an  <a href="/images/pos.jpg" target="_blank">image </a> I saw:
    </div>
    <div class="perspective-container">
        <div class="tablet-wrapper">
            <div class="tablet-container">
                <POS />
            </div>
            <div class="tablet-depth"></div>
        </div>
    </div>
</div>

<style>
    .page-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        padding: 1rem;
        box-sizing: border-box;
        padding-block-start: 5rem;
        overflow: hidden;
    }
    
    .perspective-container {
        position: relative;
        top: -4rem;
        perspective:600px;
        perspective-origin: left;
        width: calc(1180px + 4rem);
        height: calc(820px + 8rem);
        margin: auto;
        transform: rotateX(-18deg) rotateY(-2deg) rotateZ(-14deg) translateZ(-200px);
    }
    
    /* Wrapper to keep tablet and depth element together */
    .tablet-wrapper {
        position: relative;
        width: calc(1180px + 4rem);
        height: calc(820px + 5rem);
        transform: rotateX(20deg) rotateY(5deg) translateZ(0px);
        transform-origin: center bottom;
        transition: transform 0.5s ease;
    }
    
    .tablet-wrapper:hover {
        transform: rotateX(18deg) rotateY(5deg) translateZ(20px);
    }
    
    .tablet-container {
        position: relative;
        width: calc(1180px + 4rem);
        height: calc(820px + 4rem);
        background-color: #000000;
        border-radius: 2rem;
        border: 2rem solid #0c0c0c;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    /* Trapezoidal depth element */
    .tablet-depth {
        position: absolute;
        width: 96%;
        height: 10px;
        background-color: #222;
        bottom: 6px;
        left: 24px;
        /* Create trapezoidal shape to match perspective */
        clip-path: polygon(
            0% 0%,          /* top-left */
            100% 0%,        /* top-right */
            95% 100%,       /* bottom-right - shifted left to match perspective */
            5% 100%         /* bottom-left - shifted right to match perspective */
        );
        border-radius: 0 0 10px 10px;
    }
    .mockup-container {
        position: absolute;
        top: 5rem;
        right: 1rem;
        font-size: 1.4rem;
        margin-bottom: 1rem;
    }
    a {
        color: #0431c4;
        text-decoration: underline;
        font-size: 1.4rem;
        margin-bottom: 1rem;
    }
</style>




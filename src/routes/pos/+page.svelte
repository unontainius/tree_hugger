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
    <a href="/images/pos.jpg" target="_blank">Mock-up from an image I saw</a>
    <div class="tablet-container">
        <POS />
    </div>
</div>

<style>
    .page-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        padding: 1rem;
        box-sizing: border-box;
        padding-block-start: 5rem;
    }
    .tablet-container {
        width: calc(1180px + 4rem);
        height: calc(820px + 4rem);
        margin: auto;
        background-color: #000000;
        border-radius: 2rem;
        border: 2rem solid #0c0c0c;
        overflow: hidden;
    }
    a {
        color: #0431c4;
        text-decoration: underline;
        font-size: 1.4rem;
        margin-bottom: 1rem;
    }

</style>




<script>
	import PosButton from "./PosButton.svelte";
    import { browser } from "$app/environment";

    let containerWidth = 0;
    let containerHeight = 0;

    // Svelte action to measure element dimensions
 
    let width = $derived(`${containerWidth * 0.24}px`);
    let height = $derived(`${containerHeight * 0.3}px`);

    let data = {
        name: "Uber",
        icon: "add-new",
        onclick: () => {}
    }
</script>

<div class="categories" >
    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="pizza" 
        iconSize="90px"
        onclick={() => {}} 
    >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="burger" 
        iconSize="90px"
        onclick={() => {}} 
        >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="beef" 
        iconSize="90px"
        onclick={() => {}} 
    >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="pasta" 
        iconSize="90px"
        onclick={() => {}} 
    >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="desert" 
        iconSize="90px"
        onclick={() => {}} 
    >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="fries" 
        iconSize="90px"
        onclick={() => {}} 
    >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="salad" 
        iconSize="90px"
        onclick={() => {}} 
    >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="fish" 
        iconSize="90px"
        onclick={() => {}} 
    >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="ice-cream" 
        iconSize="90px"
        onclick={() => {}} 
    >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="alcohole" 
        iconSize="90px"
        onclick={() => {}} 
    >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="cola" 
        iconSize="64px"
        onclick={() => {}} 
    >
    </PosButton>

    <PosButton
        bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
        foregroundColor="white" 
        borderColor="black" 
        icon="hot-drink" 
        iconSize="64px"
        onclick={() => {}} 
    >   
    </PosButton>
</div>

<style>
    .categories {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 0.5rem;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        background-color: transparent;
        padding:0.25rem;
    }
</style>

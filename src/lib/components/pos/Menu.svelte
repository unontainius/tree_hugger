<script>
	import ButtonGradientBorder from "../ButtonGradientBorder.svelte";


</script>

<div class="menu">
    <div class="pos-menu-column">
        <ButtonGradientBorder text="Beef Lasangna" color="white" background="#0e2545" onclick={() => {}} />
        <ButtonGradientBorder text="Beef Ravioli" color="white" background="#0e2545" onclick={() => {}} />
        <ButtonGradientBorder text="Bolognese" color="white" background="#0e2545" onclick={() => {}} />
    </div>
    <div class="pos-menu-column">
        <ButtonGradientBorder text="Cabonara" color="white" background="#0e2545" onclick={() => {}} />
        <ButtonGradientBorder text="Chef's Gnocchi" color="white" background="#0e2545" onclick={() => {}} />
        <ButtonGradientBorder text="Fettuccine Alfredo" color="white" background="#0e2545" onclick={() => {}} />
    </div>
    <div class="pos-menu-column">
        <ButtonGradientBorder text="Penne Arrabbiata" color="white" background="#0e2545" onclick={() => {}} />
        <ButtonGradientBorder text="Spinach Ravioli" color="white" background="#0e2545" onclick={() => {}} />
        <ButtonGradientBorder text="Tortellini Rose" color="white" background="#0e2545" onclick={() => {}} />
    </div>
</div>

<style>
    .menu {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        gap: 0.5rem;
        background-color: transparent;
        border: 1px solid #5555552a;
        overflow: hidden;
        overflow-x: auto;
        padding: 0.25rem;
        scrollbar-width: thin;
        scrollbar-color: rgba(204, 0, 255, 0.993) transparent;
    }

    .pos-menu-column {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width:320px;
    }

    /* Adjust button text size for better vertical fit */
    :global(.pos-menu-column .button) {
        font-size: clamp(0.8rem, 1.5vh, 1.1rem);
        padding: clamp(0.3em, 1vh, 0.6em) clamp(0.4em, 2vw, 0.8em);
    }

    /* Webkit scrollbar styles */
    .menu::-webkit-scrollbar {
        height: 8px;
    }

    .menu::-webkit-scrollbar-track {
        background: transparent;
    }

    .menu::-webkit-scrollbar-thumb {
        background: rgba(0, 195, 255, 0.5);
        border-radius: 4px;
    }

    /* iPad Air specific adjustments */
    @media screen and (min-width: 768px) and (max-width: 1180px) {
        .menu {
            gap: 0.2rem;
            padding: 0.2rem;
        }
        
        .pos-menu-column {
            min-width: 340px;
            max-width: 380px;
            gap: 0.5rem;
            padding-block-end: 0.7rem;
        }
    }

    /* Smaller tablets */
    @media screen and (max-width: 767px) {
        .pos-menu-column {
            min-width: 200px;
            max-width: 240px;
        }
    }
</style>

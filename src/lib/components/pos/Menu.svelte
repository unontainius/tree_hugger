<script>
	import ButtonGradientBorder from "../ButtonGradientBorder.svelte";
</script>

<div class="menu-container">
    <div class="menu">
        <div class="pos-menu-column">
            <ButtonGradientBorder text="Beef Lasangna" color="white" background="#0e2545" fontSize="1.2rem" onclick={() => {}} />
            <ButtonGradientBorder text="Beef Ravioli" color="white" background="#0e2545" fontSize="1.2rem" onclick={() => {}} />
            <ButtonGradientBorder text="Bolognese" color="white" background="#0e2545" fontSize="1.2rem" onclick={() => {}} />
        </div>
        <div class="pos-menu-column">
            <ButtonGradientBorder text="Cabonara" color="white" background="#0e2545" fontSize="1.2rem" onclick={() => {}} />
            <ButtonGradientBorder text="Chef's Gnocchi" color="white" background="#0e2545" fontSize="1.2rem" onclick={() => {}} />
            <ButtonGradientBorder text="Fettuccine Alfredo" color="white" background="#0e2545" fontSize="1.2rem" onclick={() => {}} />
        </div>
        <div class="pos-menu-column">
            <ButtonGradientBorder text="Penne Arrabbiata" color="white" background="#0e2545" fontSize="1.1rem" onclick={() => {}} />
            <ButtonGradientBorder text="Spinach Ravioli" color="white" background="#0e2545" fontSize="1.1rem" onclick={() => {}} />
            <ButtonGradientBorder text="Tortellini Rose" color="white" background="#0e2545" fontSize="1.1rem" onclick={() => {}} />
        </div>
    </div>
</div>

<style>
    .menu-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: 1px solid #5555552a;
        display: flex;
        flex-direction: column;
    }
    
    .menu {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: calc(100% - 12px);
        gap: 0.5rem;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0.5rem;
        padding-bottom: 12px;
        scrollbar-width: thin;
        scrollbar-color: rgba(204, 0, 255, 0.7) transparent;
        align-items: flex-start;
    }

    .pos-menu-column {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(3, minmax(3rem, auto));
        gap: 0.5rem;
        min-width: min(255px, 29vw);
        max-width: 320px;
        flex-shrink: 0;
        align-content: start;
    }

    :global(.pos-menu-column .button-gradient-border) {
        margin-top: 0;
        height: 3rem;
    }

    /* Webkit scrollbar styles */
    .menu::-webkit-scrollbar {
        height: 8px;
        width: auto;
    }

    .menu::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    .menu::-webkit-scrollbar-thumb {
        background: rgba(204, 0, 255, 0.7);
        border-radius: 4px;
    }

    /* Media queries for different screen sizes */
    @media screen and (min-width: 768px) and (max-width: 1180px) {
        .pos-menu-column {
            min-width: 240px;
            max-width: 280px;
        }
    }

    @media screen and (max-width: 767px) {
        .pos-menu-column {
            min-width: 200px;
            max-width: 240px;
        }
    }
</style>

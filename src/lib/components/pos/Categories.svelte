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

<div class="categories-container">
    <div class="categories">
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="pizza" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>
        
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="burger" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>
        

        
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="beef" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="yellow" 
                icon="pasta" 
                iconSize="64px"
                selected={true}
                onclick={() => {}} 
            />
        </div>
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="desert" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>


        
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="fries" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>
        
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="salad" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>
        
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="fish" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>
        
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="ice-cream" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>
        
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="alcohole" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>
        
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="cola" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>
        
        <div class="category-item">
            <PosButton
                bgColor="linear-gradient(81deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%)" 
                foregroundColor="white" 
                borderColor="black" 
                icon="hot-drink" 
                iconSize="64px"
                onclick={() => {}} 
            />
        </div>
    </div>
</div>

<style>
    .categories-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: 1px solid #5555552a;
    }
    
    .categories {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: minmax(80px, 1fr);
        gap: 0.5rem;
        width: 100%;
        height: calc(100% - 12px);
        overflow-x: auto;
        overflow-y: auto;
        padding: 0.5rem;
        margin-bottom: 12px;
        scrollbar-width: thin;
        scrollbar-color: rgba(204, 0, 255, 0.7) transparent;
    }
    
    .category-item {
        width: 100%;
        height: 100%;
        min-height: 80px;
    }
    
    /* Webkit scrollbar styles */
    .categories::-webkit-scrollbar {
        height: 8px;
        width: 8px;
    }

    .categories::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    .categories::-webkit-scrollbar-thumb {
        background: rgba(204, 0, 255, 0.7);
        border-radius: 4px;
    }
</style>

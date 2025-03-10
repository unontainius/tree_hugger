<script>
	import MIcon from "../common/MIcon.svelte";


</script>

<div class="seating">
    <div class="seating-scroll">

        <button class="pos-seating-table-row-cell">
            <p>Uber</p>
            <p>Eats</p>
        </button>
        <button class="pos-seating-table-row-cell seating-table-icon">
            <p class="seating-table-number">12</p>
            <MIcon name="tables" size="5rem" color="white"/>
        </button>
        <button class="pos-seating-table-row-cell">
            <p>Door</p>
            <p>Dash</p>
        </button>
        <button class="pos-seating-table-row-cell">
            <p>Menu</p>
            <p>Log</p>
        </button>
        <button class="pos-seating-table-row-cell seating-table-icon">
            <p class="seating-table-number">04</p>
            <MIcon name="tables" size="5rem" color="white"/>
        </button>
        <button class="pos-seating-table-row-cell seating-table-icon">
            <p class="seating-table-number">08</p>
            <MIcon name="tables" size="5rem" color="white"/>
        </button>
        <button class="pos-seating-table-row-cell">
            <p>Deep</p>
            <p>Dish</p>
        </button>
        <button class="pos-seating-table-row-cell">
            <p>Bar</p>
            <p>Steward</p>
        </button>
    </div>
</div>

<style>
    .seating {
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        background-color: transparent;
        border: 1px solid #5555552a;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        height: 130px; /* Increased overall height */
    }

    .seating-scroll {
        display: flex;
        /* gap: 0.5rem; */
        overflow-x: scroll;
        overflow-y: hidden;
        /* padding: 0.5rem; */
        padding-block-start: 0.5rem;
        margin-bottom: 4px; /* Space for scrollbar */
        width: 100%;
        height: 120px; /* Fixed content height */
        scrollbar-width: thin;
        scrollbar-color: rgba(204, 0, 255, 0.993) transparent;
    }

    /* Webkit scrollbar styles */
    .seating-scroll::-webkit-scrollbar {
        height: 8px;
        width: auto;
    }

    .seating-scroll::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    .seating-scroll::-webkit-scrollbar-thumb {
        background: rgba(204, 0, 255, 0.7);
        border-radius: 4px;
    }

    .pos-seating-table-row-cell {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 84px;
        height: 84px;
        background-color: #f3f3f3;
        border: 1px solid #5555552a;
        border-radius: 50%;
        padding: 0;
        margin: 0.5rem; /* Reduced margin */
        gap: 0;
        color: #555555;
        position: relative; /* For proper positioning */
    }
    .seating-table-icon {
        background-color: transparent;
        border: none;
        padding-block-start: 1.5rem;
    }
    .seating-table-number {
        position: absolute;
        top: -32px;
        left: 18px;
        font-size: 3.0rem;
        font-weight: 600;
        color: #53d7ff;
    }
    p {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
</style>

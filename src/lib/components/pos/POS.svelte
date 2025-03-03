<script lang="ts">
    import POSNav from "$lib/components/pos/Nav.svelte";
    import Seating from "$lib/components/pos/Seating.svelte";
    import Menu from "$lib/components/pos/Menu.svelte";
    import Categories from "$lib/components/pos/Categories.svelte";
    import TableDetail from "$lib/components/pos/TableDetail.svelte";

</script>

<div class="pos-container">
    <div class="pos-nav">
        <POSNav></POSNav>
    </div>
    <div class="pos-content">
        <Seating></Seating>
        <Menu></Menu>
        <Categories></Categories>
    </div>
    <div class="pos-aside">
        <TableDetail></TableDetail>
    </div>
</div>

<style>


    /* Adjust the container since nav is hidden */
    .pos-container {    
        display: grid;
        grid-template-columns: 1.3fr 6fr 2.3fr;
        grid-template-rows: 1fr;
        gap: 0.5rem;
        align-items: stretch;
        justify-content: center;
        width: 100%;
        height: 100%; /* Changed since nav is hidden */
        padding: 0;
        margin: 0; /* Remove top margin since nav is hidden */
        background: rgb(17, 17, 17);
            background: -moz-linear-gradient(180deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%);
            background: -webkit-linear-gradient(180deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%);
            background: linear-gradient(180deg, rgba(0,19,33,1) 0%, rgba(1,72,125,1) 77%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#001321",endColorstr="#01487d",GradientType=1);    
            border-radius: 2rem;
        }
    

    .pos-content {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1.8fr 2.5fr 7fr;
        height: 100%;
        background-color: transparent;
        padding: 0;
        min-width: 0;
        overflow: hidden;
        gap: 0.5rem;
    }
    .pos-nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: transparent;
        border-top-left-radius: 2rem;
        border-bottom-left-radius: 2rem;
        min-width: 0;
        overflow: hidden;
    }



    .pos-aside {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: transparent;
        min-width: 0;
        overflow: hidden;
        border-top-right-radius: 2rem;
        border-bottom-right-radius: 2rem;
    }

    :global(.pos-content > .content-scroll > :global(*)) {
        width: 100%;
        min-width: 0;
        max-width: 100%;
    }

</style>




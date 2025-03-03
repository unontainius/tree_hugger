<script>

    import PosButton from "./PosButton.svelte";

</script>


<div class="pos-nav-container">
    <PosButton bgColor="white" foregroundColor="black" borderColor="white" icon="people" iconSize="6rem"/>
    <PosButton bgColor="white" foregroundColor="black" borderColor="white" icon="plus-2" iconSize="6rem"/>
    <PosButton bgColor="white" foregroundColor="black" borderColor="white" icon="gears" iconSize="6rem"/>
    <PosButton bgColor="white" foregroundColor="black" borderColor="white" icon="graph" iconSize="6rem"/>
    <PosButton bgColor="white" foregroundColor="black" borderColor="white" icon="total-take" iconSize="6rem"/>
</div>


<style>

    .pos-nav-container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
        gap: 0.5rem;
        row-gap: 1rem;
        width: 100%;
        height: 100%;
        padding: 0.5rem;
        background: rgb(176,83,255);
        background: -moz-linear-gradient(87deg, rgba(176,83,255,1) 0%, rgba(120,239,240,1) 100%);
        background: -webkit-linear-gradient(87deg, rgba(176,83,255,1) 0%, rgba(120,239,240,1) 100%);
        background: linear-gradient(87deg, rgba(176,83,255,1) 0%, rgba(120,239,240,1) 100%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#b053ff",endColorstr="#78eff0",GradientType=1);

    }

</style>


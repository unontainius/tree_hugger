<script lang="ts">
    import ModalDraggable from '$lib/components/ModalDraggable.svelte'

    let show = $state(false)
    let dialogResult = $state('')

    function processdialogResult(result: string) {
        show = false
        dialogResult = result
    }
</script>   

<h1>Welcome to SvelteKit</h1>
<button onclick={() => { show = true }} class="footer-button button-other">Show</button>


{#if show}
	<ModalDraggable visible={show} title="Add-Edit Modal" acceptBtnText="Accept" cancelBtnText="No.  don't do it!" showOverlay={true} cancelOnOverlayClick={false} dialogReason={processdialogResult}>
		<p>Some content of some description ehere ...</p>
	</ModalDraggable>
{/if}

<p>
    current state : {show}
</p>
<p>
    
	Modal result : {dialogResult}
</p>


<style>

</style>
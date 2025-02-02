<script lang="ts">
	import LoginForm from '$lib/components/LoginForm.svelte';
	import MIcon from '$lib/components/MIcon.svelte';
	import ModalDraggable from '$lib/components/Modal.svelte';

	let show = $state(false);
	let dialogResult = $state('');

	function processdialogResult(result: string) {
		show = false;
		dialogResult = result;
	}
</script>

<button
	onclick={() => {
		show = true;
	}}
	class="dodger-blue"
	>Login</button
>

{#if show}
	<ModalDraggable
		visible={show}
		title="Login"
		acceptBtnText="Login"
		cancelBtnText="Cancel"
		showOverlay={true}
		cancelOnOverlayClick={true}
		dialogReason={processdialogResult}
		showFooter={false}

	>
		<LoginForm onclose={() => show = false}/>
	</ModalDraggable>
{/if}

<div class="row">

    <div class="row">
        <a href="/admin">
            <MIcon name="admin" size="1.5rem" />
            Admin
        </a>
    </div>
</div>
<div class="debug-window">
	<p>Show state : {show}</p>
	<p>Modal result : {dialogResult}</p>
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.dodger-blue {
		background-color: dodgerblue;
	}

	.debug-window {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 200px;
		height: 100px;
		background-color: rgb(37, 37, 37);
		color: white;
		padding: 1rem;
		border-radius: 1rem;
		border: 2px solid white;
		box-shadow: 2px 2px 10px 0 rgba(141, 141, 141, 0.6);
	}
</style>

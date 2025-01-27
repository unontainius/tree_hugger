<script lang="ts">
	import MIcon from '$lib/components/MIcon.svelte';
	import ModalDraggable from '$lib/components/ModalDraggable.svelte';

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
	>Show <MIcon name="exclamation" size="1.5rem" color="yellow" /> Show</button
>

{#if show}
	<ModalDraggable
		visible={show}
		title="Add-Edit Modal"
		acceptBtnText="Accept"
		cancelBtnText="No.  don't do it!"
		showOverlay={true}
		cancelOnOverlayClick={true}
		dialogReason={processdialogResult}
	>
		<p>Some content of some description ehere ...</p>
	</ModalDraggable>
{/if}

<div class="row">
	<button>
		<MIcon name="open-file" size="1.5rem" color="yellow" />
		<span>Open File</span>
	</button>
	<button>
		<MIcon name="add" size="1.5rem" color="yellow" />
		<span>Add</span>
	</button>
	<button>
		<MIcon name="add-circle" size="1.5rem" color="yellow" />
		<span>Add Circle</span>
	</button>
	<button>
		<MIcon name="edit" size="1.5rem" color="yellow" />
		<span>Edit</span>
	</button>
	<button>
		<MIcon name="delete" size="1.5rem" color="yellow" />
		<span>Delete</span>
	</button>
	<button>
		<MIcon name="save" size="1.5rem" color="yellow" />
		<span>Save</span>
	</button>
	<button>
		<MIcon name="download" size="1.5rem" color="yellow" />
		<span>Download</span>
	</button>
	<button>
		<MIcon name="link" size="1.5rem" color="yellow" />
		<span>Link</span>
	</button>
	<button>
		<MIcon name="menu" size="1.5rem" color="yellow" />
		<span>Menu</span>
	</button>
	<button>
		<MIcon name="search" size="1.5rem" color="yellow" />
		<span>Search</span>
	</button>
	<button>
		<MIcon name="add-image" size="1.5rem" color="yellow" />
		<span>Add Image</span>
	</button>
	<button>
		<MIcon name="bomb" size="1.5rem" color="yellow" />
		<span>Bomb</span>
	</button>
	<button>
		<MIcon name="happy" size="1.5rem" color="yellow" />
		<span>Happy</span>
	</button>
	<button>
		<MIcon name="sad" size="1.5rem" color="yellow" />
		<span>Sad</span>
	</button>
	<button>
		<MIcon name="star" size="1.5rem" color="yellow" />
		<span>Star</span>
	</button>
	<button>
		<MIcon name="close" size="1.5rem" color="yellow" />
		<span>Close</span>
	</button>
	<button>
		<MIcon name="menu-circle" size="1.5rem" color="yellow" />
		<span>Menu Circle</span>
	</button>
	<button>
		<MIcon name="menu-dots" size="1.5rem" color="yellow" />
		<span>Menu Dots</span>
	</button>
	<button>
		<MIcon name="add-image" size="1.5rem" color="yellow" />
		<span>Add Image</span>
	</button>
	<button>
		<MIcon name="menu-dots" size="1.5rem" color="yellow" />
		<span>Menu Dots</span>
	</button>
	<button>
		<MIcon name="exclamation" size="1.5rem" color="yellow" />
		<span>Exclamation</span>
	</button>
	<button>
		<MIcon name="x" size="1.5rem" color="yellow" />
		<span>X</span>
	</button>
	<button>
		<MIcon name="fat-x" size="1.5rem" color="yellow" />
		<span>Fat X</span>
	</button>
	<button>
		<MIcon name="upload" size="1.5rem" color="yellow" />
		<span>Upload</span>
	</button>
</div>

<div class="debug-window">
	<p>Show state : {show}</p>
	<p>Modal result : {dialogResult}</p>
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
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

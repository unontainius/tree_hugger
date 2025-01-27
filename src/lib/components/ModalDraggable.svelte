<script lang="ts">
	let { visible, title, children, dialogReason, acceptBtnText, cancelBtnText, showOverlay, cancelOnOverlayClick } = $props();

	let show = $state(visible);

	function dragMe(node: HTMLElement) {
		let moving = false;
		let left = window.innerWidth / 2 - 250;
		let top = window.innerHeight / 2 - 200;

		node.style.position = 'absolute';
		node.style.top = `${top}px`;
		node.style.left = `${left}px`;
		node.style.cursor = 'move';
		node.style.userSelect = 'none';

		node.addEventListener('mousedown', () => {
			moving = true;
		});

		window.addEventListener('mousemove', (e) => {
			if (moving) {
				left += e.movementX;
				top += e.movementY;
				node.style.top = `${top}px`;
				node.style.left = `${left}px`;
			}
		});

		window.addEventListener('mouseup', () => {
			moving = false;
		});
	}
	function showModal() {
		show = !show;
	}
	function handleClose(result: string) {
		show = false;
		dialogReason(result);
	}
</script>

{#if show}
	{#if showOverlay}
		<button
			onclick={() => {
				cancelOnOverlayClick ? handleClose('cancel') : {};
			}}
			class="overlay"
			aria-label="Close"
		>
		</button>
	{/if}

	<div class="my-form" use:dragMe>
		<div class="header">
			<div class="header-text">{title}</div>
			<button
				onclick={() => {
					showModal();
				}}
				class="form-close"
				aria-label="Close"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
					<path
						fill="currentColor"
						d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12"
					/>
					<path
						fill="currentColor"
						d="M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"
					/>
				</svg>
			</button>
		</div>
		<div class="detail">
			<form action="" class="form">
				{@render children()}
			</form>
		</div>
		<div class="footer">
			<button
				onclick={() => {
					handleClose('cancel');
				}}
				class="footer-button cancel">{cancelBtnText}</button
			>
			<button
				onclick={() => {
					handleClose('accept');
				}}
				class="footer-button accept">{acceptBtnText}</button
			>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: absolute;
		top: 0;
        left: 0;
        right: 0;
        bottom: 0;
  
		z-index: 10;
		padding: 0;
		margin: 0;
		opacity: 0.5;
		width: 100%;
		height: 100%;
		/* background-color: darkgrey; */
        background: rgb(19,19,19);
        background: -moz-radial-gradient(circle, rgba(19,19,19,1) 0%, rgba(126,126,126,1) 100%);
        background: -webkit-radial-gradient(circle, rgba(19,19,19,1) 0%, rgba(126,126,126,1) 100%);
        background: radial-gradient(circle, rgba(19,19,19,1) 0%, rgba(126,126,126,1) 100%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#131313",endColorstr="#7e7e7e",GradientType=1);
	}
	.my-form {
		z-index: 20;
		background-color: lightgrey;
		outline: 2px solid white;
		box-shadow: 0px 8px 15px darkgrey;
		border-radius: 12px;
		border: solid 1px grey;
	}

	.header {
		display: flex;
		flex-direction: row;

		font-size: 1.4rem;
		font-weight: 600;
		background-color: #325266;
		color: white;
		padding: 8px 8px 8px 32px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		/* box-shadow: 0 4px 8px #156387; */
	}
	.header-text {
		flex-grow: 1;
	}
	.form-close {
		height: 24px;
		width: 24px;
	}
	button {
		padding: 0;
		margin: 0;
		color: white;
		background-color: transparent;
		border: 0;
		cursor: pointer;
        transform: scale(1);
	}
    .button:hover {
        transform: scale(1);
    }
	.detail {
		padding: 32px;
	}
	.footer {
		display: flex;
		flex-direction: row;
		justify-content: end;
		font-size: 1.4rem;
		font-weight: 600;
		background-color: #325266;
		color: white;
		padding: 8px 32px;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	.footer-button {
		font-size: 1.1rem;
		padding: 8px 22px;
		margin: 4px;
		border-radius: 8px;
		color: white;
		box-shadow: 2px 2px 5px #092536;
		cursor: pointer;
	}
	.accept {
		background-color: green;
	}
	.cancel {
		background-color: red;
	}

	.form {
		align-self: center;
	}

</style>

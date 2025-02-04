<script lang="ts">
	let {
		visible,
		title,
		children,
		dialogReason = $bindable(),
		acceptBtnText,
		cancelBtnText,
		showOverlay,
		cancelOnOverlayClick,
		showFooter = true
	} = $props();

	let show = $state(visible);
	let footerShown = $state(showFooter);

	function handleClose(result: string) {
		show = false;
		dialogReason(result);
	}
</script>

{#if show}
	<div
		class="modal-backdrop"
		onclick={() => handleClose('cancel')}
		onkeydown={() => handleClose('cancel')}
		tabindex="-1"
		role="button"
	>
		<div class="modal-content" 
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			tabindex="-1"
			role="button"
		>
			{@render children()}
		</div>
	</div>

{/if}

{#if show}
	{#if showOverlay}
		<button
			class="overlay"
			onclick={() => cancelOnOverlayClick && handleClose('cancel')}
			aria-label="Close Dialogue"
		>
		</button>
	{/if}

	<div class="my-form">
		<div class="header">
			<div class="header-text">{title}</div>
			<button onclick={() => handleClose('cancel')} class="form-close" aria-label="Close">
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
			<form class="form">
				{@render children()}
			</form>
		</div>
		{#if showFooter}
			<div class="footer">
				<button onclick={() => handleClose('cancel')} class="footer-button cancel"
					>{cancelBtnText}</button
				>
				<button onclick={() => handleClose('accept')} class="footer-button accept"
					>{acceptBtnText}</button
				>
			</div>
		{/if}
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}

	.my-form {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		min-width: 320px;
		max-width: 85vw;
		background-color: lightgrey;
		border-radius: 12px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		z-index: 1001;
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
		cursor: move;
		user-select: none;
	}
	.header-text {
		flex-grow: 1;
	}
	.form-close {
		margin-block-start: 0.25rem;
		transition: all 0.3s ease;
		height: 24px;
		width: 24px;
		border-radius: 50%;
	}
	.form-close:hover {
		color: yellow;
		transform: scale(1.3);
	}
	button {
		padding: 0;
		margin: 0;
		color: white;
		background-color: transparent;
		border: 0;
		border-radius: 0;
		cursor: pointer;
		transform: scale(1);
	}

	.detail {
		padding: 0;
	}
	.footer {
		display: flex;
		flex-direction: row;
		justify-content: end;
		font-size: 1.4rem;
		font-weight: 600;
		background-color: #325266;
		color: white;
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

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		padding: 20px;
		border-radius: 4px;
		min-width: 300px;
	}
</style>

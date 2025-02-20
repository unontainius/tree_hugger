<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { windows } from '$lib/stores/windowStore';
	import { taskbarStore } from '$lib/stores/taskbarStore';
	import MIcon from './MIcon.svelte';
	import { cubicOut } from 'svelte/easing';
	import Tab from '../Tab.svelte';
	import type { Snippet } from 'svelte';

	interface WindowState {
		position: { x: number; y: number };
		size: { width: number; height: number };
		isMaximized: boolean;
		isMinimized: boolean;
	}

	type WindowSize = 'small' | 'medium' | 'large' | 'custom';

	const {
		title = '',
		onClose,
		footerButtons = [],
		children,
		initialPosition = {
			x: Math.min((window.innerWidth - 400) / 2, window.innerWidth - 400),
			y: Math.min((window.innerHeight - 400) / 3.5, window.innerHeight - 290)
		},
		initialSize = { width: 400, height: 300 },
		onPositionChange,
		onSizeChange,
		minWidth = 300,
		minHeight = 150,
		preset = 'custom',
		showFooter = true,
		acceptButtonText = 'Accept',
		cancelButtonText = 'Cancel',
		showMinimize = true,
		showMaximize = true,
		showClose = true,
		onDialogResponse
	} = $props<{
		title: string;
		onClose: () => void;
		footerButtons?: { text: string; onClick: () => void }[];
		children?: Snippet;
		initialPosition?: { x: number; y: number };
		initialSize?: { width: number; height: number };
		onPositionChange?: (position: { x: number; y: number }) => void;
		onSizeChange?: (size: { width: number; height: number }) => void;
		minWidth?: number;
		minHeight?: number;
		preset?: WindowSize;
		showFooter?: boolean;
		acceptButtonText?: string;
		cancelButtonText?: string;
		showMinimize?: boolean;
		showMaximize?: boolean;
		showClose?: boolean;
		onDialogResponse?: (response: boolean) => void;
	}>();

	function getPresetSize(preset: WindowSize): { width: number; height: number } {
		const isBrowser = typeof window !== 'undefined';
		const defaultSize = { width: 400, height: 300 };

		if (!isBrowser) return defaultSize;

		switch (preset) {
			case 'small':
				return { width: 400, height: 250 };
			case 'medium':
				return {
					width: Math.floor(window.innerWidth * 0.5),
					height: Math.floor(window.innerHeight * 0.4)
				};
			case 'large':
				return {
					width: Math.floor(window.innerWidth * 0.85),
					height: Math.floor(window.innerHeight * 0.95)
				};
			default:
				return initialSize || defaultSize;
		}
	}

	function getCenteredPosition(windowSize: { width: number; height: number }) {
		const isBrowser = typeof window !== 'undefined';
		if (!isBrowser) return { x: 0, y: 0 };

		return {
			x: Math.floor((window.innerWidth - windowSize.width) / 2),
			y: Math.floor((window.innerHeight - windowSize.height) / 2)
		};
	}

	const id = crypto.randomUUID();
	let shell: HTMLDivElement;
	let presetSize =
		preset !== 'custom' ? getPresetSize(preset) : initialSize || { width: 400, height: 300 };
	let position = $state(
		preset !== 'custom' ? getCenteredPosition(presetSize) : initialPosition || { x: 100, y: 100 }
	);
	let size = $state(presetSize);
	let isDragging = $state(false);
	let isResizing = $state(false);
	let dragTimer: ReturnType<typeof setTimeout> | null = null;
	// let zIndex = $state(1000);
	let resizeMode = $state<'none' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'>('none');
	let resizeStart = $state({ x: 0, y: 0 });
	let resizeInitialSize = $state({ width: 0, height: 0 });
	const minSize = { width: minWidth, height: minHeight };
	const maxSize = { width: window.innerWidth, height: window.innerHeight };

	// Add touch support variables
	let touchStartX = 0;
	let touchStartY = 0;

	// Add touch resize variables
	let touchResizeMode: typeof resizeMode = 'none';
	let touchResizeStart = { x: 0, y: 0 };
	let touchResizeInitialSize = { width: 0, height: 0 };

	let isMaximized = $state(false);
	let isMinimized = $state(false);
	let normalState: WindowState | null = null;
	let previousState: WindowState | null = null;

	$effect(() => {
		$windows.find((w) => w.id === id);
	});

	$effect(() => {
		onPositionChange?.(position);
	});

	$effect(() => {
		onSizeChange?.(size);
	});

	$effect(() => {
		const unsubscribe = taskbarStore.subscribe((value) => {
			const item = value.find((i) => i.id === id);
			if (item && !item.isMinimized && isMinimized) {
				// Restore window
				position = item.position;
				size = item.size;
				isMinimized = false;
				if (isMaximized && !normalState) {
					normalState = {
						position: item.position,
						size: item.size,
						isMaximized: false,
						isMinimized: false
					};
				}
				// Remove from taskbar
				taskbarStore.removeItem(id);
			}
		});
		return unsubscribe;
	});

	function handleMouseDown(e: MouseEvent) {
		if (e.target instanceof HTMLElement && e.target.closest('.header')) {
			dragTimer = setTimeout(() => {
				isDragging = true;
			}, 100);
		}
		windows.focus(id);
	}

	function handleResizeStart(e: MouseEvent, mode: typeof resizeMode) {
		isResizing = true;
		resizeMode = mode;
		resizeStart = { x: e.clientX, y: e.clientY };
		resizeInitialSize = { ...size };
	}

	function handleResize(e: MouseEvent) {
		if (!isResizing) return;

		const deltaX = e.clientX - resizeStart.x;
		const deltaY = e.clientY - resizeStart.y;
		// let maxWidth = window.innerWidth - position.x;
		// let maxHeight = window.innerHeight - position.y;
		let newSize = { ...size };
		let newPosition = { ...position };

		switch (resizeMode) {
			case 'e':
				newSize.width = Math.min(
					maxSize.width,
					Math.max(minSize.width, resizeInitialSize.width + deltaX)
				);
				break;
			case 's':
				newSize.height = Math.min(
					maxSize.height,
					Math.max(minSize.height, resizeInitialSize.height + deltaY)
				);
				break;
			case 'se':
				newSize.width = Math.min(
					maxSize.width,
					Math.max(minSize.width, resizeInitialSize.width + deltaX)
				);
				newSize.height = Math.min(
					maxSize.height,
					Math.max(minSize.height, resizeInitialSize.height + deltaY)
				);
				break;
		}

		onPositionChange?.(newPosition);
		onSizeChange?.(newSize);
		position = newPosition;
		size = newSize;
	}

	function handleMouseMove(e: MouseEvent) {
		if (isDragging) {
			const newX = Math.max(-10, Math.min(window.innerWidth - (size.width - 10), position.x + e.movementX));
			const newY = Math.max(-10, Math.min(window.innerHeight - (size.height - 10), position.y + e.movementY));
			onPositionChange?.({ x: newX, y: newY });
			position = { x: newX, y: newY };
		} else if (isResizing) {
			handleResize(e);
		}
	}

	function handleMouseUp() {
		if (dragTimer) clearTimeout(dragTimer);
		isDragging = false;
		isResizing = false;
	}

	function handleTouchStart(e: TouchEvent) {
		const touch = e.touches[0];
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;

		// Check if touch started on a resize handle
		if (e.target instanceof HTMLElement) {
			const handle = e.target.closest('.resize-handle');
			if (handle instanceof HTMLElement) {
				isResizing = true;
				touchResizeMode = handle.classList[1] as typeof resizeMode;
				touchResizeStart = { x: touch.clientX, y: touch.clientY };
				touchResizeInitialSize = { ...size };
				e.preventDefault(); // Prevent scrolling while resizing
				return;
			}
		}

		if (e.target instanceof HTMLElement && e.target.closest('.header')) {
			dragTimer = setTimeout(() => {
				isDragging = true;
			}, 100);
		}
		windows.focus(id);
	}

	function handleTouchMove(e: TouchEvent) {
		const touch = e.touches[0];
		const movementX = touch.clientX - touchStartX;
		const movementY = touch.clientY - touchStartY;
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;

		if (isDragging) {
			const newX = Math.max(0, Math.min(window.innerWidth - size.width, position.x + movementX));
			const newY = Math.max(0, Math.min(window.innerHeight - size.height, position.y + movementY));
			onPositionChange?.({ x: newX, y: newY });
			position = { x: newX, y: newY };
		} else if (isResizing) {
			const deltaX = touch.clientX - touchResizeStart.x;
			const deltaY = touch.clientY - touchResizeStart.y;
			let newSize = { ...size };
			let newPosition = { ...position };

			switch (touchResizeMode) {
				case 'e':
					newSize.width = Math.min(
						maxSize.width,
						Math.max(minSize.width, touchResizeInitialSize.width + deltaX)
					);
					break;
				case 's':
					newSize.height = Math.min(
						maxSize.height,
						Math.max(minSize.height, touchResizeInitialSize.height + deltaY)
					);
					break;
				case 'se':
					newSize.width = Math.min(
						maxSize.width,
						Math.max(minSize.width, touchResizeInitialSize.width + deltaX)
					);
					newSize.height = Math.min(
						maxSize.height,
						Math.max(minSize.height, touchResizeInitialSize.height + deltaY)
					);
					break;
			}

			onPositionChange?.(newPosition);
			onSizeChange?.(newSize);
			position = newPosition;
			size = newSize;
		}
	}

	onMount(() => {
		console.log('<Window>onMount', id);
		windows.register(id);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('touchmove', handleTouchMove, { capture: true });
		document.addEventListener('touchend', handleMouseUp, { capture: true });
		shell?.addEventListener('touchstart', handleTouchStart, { capture: true });
	});

	onDestroy(() => {
		windows.remove(id);
		taskbarStore.removeItem(id);
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		document.removeEventListener('touchmove', handleTouchMove, { capture: true });
		document.removeEventListener('touchend', handleMouseUp, { capture: true });
		shell?.removeEventListener('touchstart', handleTouchStart, { capture: true });
	});

	// Animation utility
	function getTransitionStyles(
		from: { x: number; y: number; width: number; height: number },
		to: { x: number; y: number; width: number; height: number }
	) {
		const dx = to.x - from.x;
		const dy = to.y - from.y;
		const dw = to.width - from.width;
		const dh = to.height - from.height;

		return {
			duration: 200,
			css: (t: number) => {
				const eased = cubicOut(t);
				return `
                    transform: translate(${from.x + dx * eased}px, ${from.y + dy * eased}px);
                    width: ${from.width + dw * eased}px;
                    height: ${from.height + dh * eased}px;
                `;
			}
		};
	}

	// Update maximize/minimize handlers to use animations
	async function handleMaximize() {
		if (isMaximized && previousState) {
			const stateToRestore = normalState || previousState;
			const from = { x: position.x, y: position.y, ...size };
			const to = { ...stateToRestore.position, ...stateToRestore.size };
			const { duration } = getTransitionStyles(from, to);

			shell.style.transition = `all ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
			await new Promise((resolve) => {
				shell.ontransitionend = resolve;
				if (stateToRestore) {
					position = stateToRestore.position;
					size = stateToRestore.size;
				}
			});
			shell.style.transition = '';
			previousState = null;
			if (!isMinimized) {
				normalState = null;
			}
			isMaximized = false;
		} else {
			normalState = {
				position: { ...position },
				size: { ...size },
				isMaximized: false,
				isMinimized: false
			};
			previousState = normalState;
			const from = { x: position.x, y: position.y, ...size };
			const to = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
			const { duration } = getTransitionStyles(from, to);

			shell.style.transition = `all ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
			await new Promise((resolve) => {
				shell.ontransitionend = resolve;
				position = { x: 0, y: 0 };
				size = { width: window.innerWidth, height: window.innerHeight };
			});
			shell.style.transition = '';
			isMaximized = true;
		}
	}

	async function handleMinimize() {
		if (isMinimized && previousState) {
			taskbarStore.removeItem(id);
			const from = { x: position.x, y: position.y, ...size };
			const to = { ...previousState.position, ...previousState.size };
			const { duration } = getTransitionStyles(from, to);

			shell.style.transition = `all ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
			await new Promise((resolve) => {
				shell.ontransitionend = resolve;
				if (previousState) {
					position = previousState.position;
					size = previousState.size;
					isMaximized = previousState.isMaximized;
				}
			});
			shell.style.transition = '';
			previousState = null;
		} else {
			if (isMaximized && !normalState) {
				normalState = {
					position: { ...position },
					size: { ...size },
					isMaximized: false,
					isMinimized: false
				};
			}
			previousState = {
				position: { ...position },
				size: { ...size },
				isMaximized: isMaximized,
				isMinimized: false
			};
			taskbarStore.addItem({
				id,
				title,
				isMinimized: true,
				position: { ...position },
				size: { ...size }
			});
			const from = { x: position.x, y: position.y, ...size };
			const to = { x: 0, y: window.innerHeight, width: 200, height: 40 };
			const { duration } = getTransitionStyles(from, to);

			shell.style.transition = `all ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
			await new Promise((resolve) => {
				shell.ontransitionend = resolve;
				position = { x: 0, y: window.innerHeight };
				size = { width: 200, height: 40 };
			});
			shell.style.transition = '';
		}
		isMinimized = !isMinimized;
	}

	function handleHeaderDoubleClick() {
		if (isMaximized) {
			// Restore to normal state
			const stateToRestore = normalState || {
				position: { x: 100, y: 100 },
				size: getPresetSize(preset)
			};
			position = stateToRestore.position;
			size = stateToRestore.size;
			isMaximized = false;
			normalState = null;
		} else {
			// Save current state and maximize
			normalState = {
				position: { ...position },
				size: { ...size },
				isMaximized: false,
				isMinimized: false
			};
			position = { x: 0, y: 0 };
			size = { width: window.innerWidth, height: window.innerHeight };
			isMaximized = true;
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="shell {isMaximized ? 'maximized' : ''} {isMinimized ? 'minimized' : ''}"
	bind:this={shell}
	style="
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        transform: translate({position.x}px, {position.y}px);
        width: {size.width}px;
        height: {size.height}px;
        cursor: {isDragging ? 'grabbing' : 'default'};
        visibility: {isMinimized ? 'hidden' : 'visible'};
    "
	onmousedown={handleMouseDown}
>
	<div class="gold-border">
		<div
			class="header"
			ondblclick={handleHeaderDoubleClick}
			aria-label="Window Header"
			aria-roledescription="Window Header"
		>
			<span class="title">{title}</span>
			<div class="window-controls">
				<Tab>
					{#if showMinimize}
						<button class="control-btn minimize" onclick={handleMinimize}>
							<MIcon name={isMinimized ? 'maximize' : 'minimize'} size="24px" />
						</button>
					{/if}
					{#if showMaximize}
						<button class="control-btn maximize" onclick={handleMaximize}>
							<MIcon name={isMaximized ? 'normalize' : 'maximize'} size="24px" />
						</button>
					{/if}
					{#if showClose}
						<button class="control-btn close" onclick={onClose}>
							<MIcon name="close" size="24px" />
						</button>
					{/if}
				</Tab>
			</div>
		</div>

		<div class="body">
			{#if children}
				<div class="body-content">
					{@render children()}
				</div>
			{:else}
				<div class="body-content">
					<p>No component provided</p>
				</div>
			{/if}
		</div>

		{#if showFooter}
			<div class="footer">
				<div class="footer-buttons">
					{#if footerButtons.length > 0}
						{#each footerButtons as button}
							<button onclick={button.onClick}>{button.text}</button>
						{/each}
					{:else if acceptButtonText && cancelButtonText}
						<button class="accept-button" onclick={() => onDialogResponse?.(true)}
							>{acceptButtonText}</button
						>
						<button class="cancel-button" onclick={() => onDialogResponse?.(false)}
							>{cancelButtonText}</button
						>
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<!-- All resize handles -->
	<div class="resize-handle e" onmousedown={(e) => handleResizeStart(e, 'e')}></div>
	<div class="resize-handle s" onmousedown={(e) => handleResizeStart(e, 's')}></div>
	<div class="resize-handle se" onmousedown={(e) => handleResizeStart(e, 'se')}></div>
</div>

<style>
	button {
		margin: 0 5px;
	}
	.shell {
		position: fixed;
		background: rgb(32, 32, 32);
		border-radius: 0.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		color: white;
	}
	.gold-border {
		padding: 3px;
		margin: 0;
		border-radius: 0.5rem;
		background: radial-gradient(
				ellipse farthest-corner at right bottom,
				#fedb37 0%,
				#fdb931 8%,
				#9f7928 30%,
				#8a6e2f 40%,
				transparent 80%
			),
			radial-gradient(
				ellipse farthest-corner at left top,
				#ffffff 0%,
				#ffffac 8%,
				#d1b464 25%,
				#5d4a1f 62.5%,
				#5d4a1f 100%
			);
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.header {
		height: 60px;
		min-height: 60px;
		flex: 0 0 60px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #013d55;
		cursor: grab;
		user-select: none;
		color: white;
		border-top-left-radius: 0.4rem;
		border-top-right-radius: 0.4rem;
	}
	.title {
		font-size: 1.2rem;
		font-weight: 600;
	}
	.body {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		position: relative;
		overflow: hidden;
	}

	.body-content {
		flex: 1;
		padding: 0;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow: auto;
	}

	.footer {
		height: 60px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		background: #f5f5f5;
		gap: 10px;
		flex-shrink: 0;
	}

	.resize-handle {
		position: absolute;
		background: transparent;
	}

	.resize-handle.e {
		right: 0;
		top: 0;
		width: 8px;
		height: 100%;
		cursor: e-resize;
	}

	.resize-handle.s {
		bottom: 0;
		left: 0;
		height: 8px;
		width: 100%;
		cursor: s-resize;
	}

	.resize-handle.se {
		right: 0;
		bottom: 0;
		width: 16px;
		height: 16px;
		cursor: se-resize;
	}

	.window-controls {
		position: relative;
		top: 11px;
		right: 0px;
		height: 42px;
		display: flex;
		align-items: center;
	}

	.control-btn {
		background: none;
		border: none;
		padding: 8px;
		cursor: pointer;
		color: #666;
		border-radius: 4px;
		margin-inline: 0;
		box-shadow: none;
	}

	.control-btn:hover {
		transform: scale(1.4);
	}

	.control-btn.close {
		justify-self: flex-end;
		color: #ff4444;
	}

	.shell.maximized {
		border-radius: 0;
	}
	.footer-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}
	.shell.minimized {
		resize: none;
		.body,
		.footer {
			display: none;
		}
		.header {
			height: 40px;
		}
	}
	.accept-button {
		background-color: green;
		color: white;
	}
	.cancel-button {
		background-color: #888888;
		color: white;
	}
</style>

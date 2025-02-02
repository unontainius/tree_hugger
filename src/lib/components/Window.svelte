<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { windows } from '$lib/stores/windowStore';
    import { taskbarStore } from '$lib/stores/taskbarStore';
    import MIcon from './MIcon.svelte';
    import { cubicOut } from 'svelte/easing';
    import type { SvelteComponent } from 'svelte';

    interface WindowState {
        position: { x: number; y: number };
        size: { width: number; height: number };
        isMaximized: boolean;
        isMinimized: boolean;
    }

    const { 
        title = '', 
        onClose, 
        footerButtons = [],
        component,
        componentProps = {},
        initialPosition,
        initialSize,
        onPositionChange,
        onSizeChange
    } = $props<{
        title: string;
        onClose: () => void;
        footerButtons?: { text: string; onClick: () => void; }[];
        component?: typeof SvelteComponent;
        componentProps?: Record<string, any>;
        initialPosition?: { x: number; y: number };
        initialSize?: { width: number; height: number };
        onPositionChange?: (position: { x: number; y: number }) => void;
        onSizeChange?: (size: { width: number; height: number }) => void;
    }>();

    const id = crypto.randomUUID();
    let shell: HTMLDivElement;
    let position = $state(initialPosition || { x: 100, y: 100 });
    let size = $state(initialSize || { width: 400, height: 300 });
    let isDragging = $state(false);
    let isResizing = $state(false);
    let dragTimer: ReturnType<typeof setTimeout> | null = null;
    let zIndex = $state(1000);
    let resizeMode = $state<'none' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'>('none');
    let resizeStart = $state({ x: 0, y: 0 });
    let resizeInitialSize = $state({ width: 0, height: 0 });
    const minSize = { width: 200, height: 150 };
    const maxSize = { width: window.innerWidth - 40, height: window.innerHeight - 40 };

    // Add touch support variables
    let touchStartX = 0;
    let touchStartY = 0;

    let isMaximized = $state(false);
    let isMinimized = $state(false);
    let normalState: WindowState | null = null;
    let previousState: WindowState | null = null;

    $effect(() => {
        const window = $windows.find(w => w.id === id);
        if (window) {
            zIndex = window.zIndex;
        }
    });

    $effect(() => {
        onPositionChange?.(position);
    });

    $effect(() => {
        onSizeChange?.(size);
    });

    $effect(() => {
        const unsubscribe = taskbarStore.subscribe(value => {
            const item = value.find(i => i.id === id);
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

        switch (resizeMode) {
            case 'n':
                const newHeightN = resizeInitialSize.height - deltaY;
                if (newHeightN >= minSize.height && newHeightN <= maxSize.height) {
                    position.y += deltaY;
                    size.height = newHeightN;
                }
                break;
            case 'w':
                const newWidthW = resizeInitialSize.width - deltaX;
                if (newWidthW >= minSize.width && newWidthW <= maxSize.width) {
                    position.x += deltaX;
                    size.width = newWidthW;
                }
                break;
            case 'nw':
                const newHeightNW = resizeInitialSize.height - deltaY;
                const newWidthNW = resizeInitialSize.width - deltaX;
                if (newHeightNW >= minSize.height && newHeightNW <= maxSize.height) {
                    position.y += deltaY;
                    size.height = newHeightNW;
                }
                if (newWidthNW >= minSize.width && newWidthNW <= maxSize.width) {
                    position.x += deltaX;
                    size.width = newWidthNW;
                }
                break;
            case 'ne':
                const newHeightNE = resizeInitialSize.height - deltaY;
                if (newHeightNE >= minSize.height && newHeightNE <= maxSize.height) {
                    position.y += deltaY;
                    size.height = newHeightNE;
                }
                size.width = Math.min(maxSize.width, Math.max(minSize.width, resizeInitialSize.width + deltaX));
                break;
            case 'sw':
                const newWidthSW = resizeInitialSize.width - deltaX;
                if (newWidthSW >= minSize.width && newWidthSW <= maxSize.width) {
                    position.x += deltaX;
                    size.width = newWidthSW;
                }
                size.height = Math.min(maxSize.height, Math.max(minSize.height, resizeInitialSize.height + deltaY));
                break;
            case 'se':
                size.width = Math.min(maxSize.width, Math.max(minSize.width, resizeInitialSize.width + deltaX));
                size.height = Math.min(maxSize.height, Math.max(minSize.height, resizeInitialSize.height + deltaY));
                break;
            case 'e':
                size.width = Math.min(maxSize.width, Math.max(minSize.width, resizeInitialSize.width + deltaX));
                break;
            case 's':
                size.height = Math.min(maxSize.height, Math.max(minSize.height, resizeInitialSize.height + deltaY));
                break;
        }
    }

    function handleMouseMove(e: MouseEvent) {
        if (isDragging) {
            const newX = Math.max(0, Math.min(window.innerWidth - size.width, position.x + e.movementX));
            const newY = Math.max(0, Math.min(window.innerHeight - size.height, position.y + e.movementY));
            position.x = newX;
            position.y = newY;
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
            position.x = newX;
            position.y = newY;
        } else if (isResizing) {
            handleResize({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
        }
    }

    onMount(() => {
        windows.register(id);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleMouseUp);
    });

    onDestroy(() => {
        windows.remove(id);
        taskbarStore.removeItem(id);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
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
            await new Promise(resolve => {
                shell.ontransitionend = resolve;
                if (stateToRestore) {
                    position = stateToRestore.position;
                    size = stateToRestore.size;
                }
            });
            shell.style.transition = '';
            previousState = null;
            normalState = null;
        } else {
            normalState = { position: {...position}, size: {...size}, isMaximized: false, isMinimized: false };
            previousState = { position: {...position}, size: {...size}, isMaximized: false, isMinimized: false };
            const from = { x: position.x, y: position.y, ...size };
            const to = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
            const { duration, css } = getTransitionStyles(from, to);
            
            shell.style.transition = `all ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
            await new Promise(resolve => {
                shell.ontransitionend = resolve;
                position = { x: 0, y: 0 };
                size = { width: window.innerWidth, height: window.innerHeight };
            });
            shell.style.transition = '';
        }
        isMaximized = !isMaximized;
    }

    async function handleMinimize() {
        if (isMinimized && previousState) {
            taskbarStore.removeItem(id);
            const from = { x: position.x, y: position.y, ...size };
            const to = { ...previousState.position, ...previousState.size };
            const { duration, css } = getTransitionStyles(from, to);
            
            shell.style.transition = `all ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
            await new Promise(resolve => {
                shell.ontransitionend = resolve;
                if (previousState) {
                    position = previousState.position;
                    size = previousState.size;
                }
            });
            shell.style.transition = '';
            if (isMaximized && normalState) {
                previousState = normalState;
            } else {
                previousState = null;
            }
        } else {
            if (isMaximized && !normalState) {
                normalState = { position: {...position}, size: {...size}, isMaximized: false, isMinimized: false };
            }
            previousState = { position: {...position}, size: {...size}, isMaximized: isMaximized, isMinimized: false };
            taskbarStore.addItem({
                id,
                title,
                isMinimized: true,
                position: { ...position },
                size: { ...size }
            });
            const from = { x: position.x, y: position.y, ...size };
            const to = { x: 0, y: window.innerHeight, width: 200, height: 40 };
            const { duration, css } = getTransitionStyles(from, to);
            
            shell.style.transition = `all ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
            await new Promise(resolve => {
                shell.ontransitionend = resolve;
                position = { x: 0, y: window.innerHeight };
                size = { width: 200, height: 40 };
            });
            shell.style.transition = '';
        }
        isMinimized = !isMinimized;
    }

    function handleHeaderDoubleClick() {
        handleMaximize();
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="shell {isMaximized ? 'maximized' : ''} {isMinimized ? 'minimized' : ''}"
    bind:this={shell}
    style="
        z-index: {zIndex};
        transform: translate({position.x}px, {position.y}px);
        width: {size.width}px;
        height: {size.height}px;
        cursor: {isDragging ? 'grabbing' : 'default'};
        visibility: {isMinimized ? 'hidden' : 'visible'};
    "
    onmousedown={handleMouseDown}
    ontouchstart={handleTouchStart}
>
    <div class="header" ondblclick={handleHeaderDoubleClick} aria-label="Window Header" aria-roledescription="Window Header">
        <span class="title">{title}</span>
        <div class="window-controls">
            <button class="control-btn minimize" onclick={handleMinimize}>
                <MIcon name={isMinimized ? "maximize" : "minimize"} size="24px" />
            </button>
            <button class="control-btn maximize" onclick={handleMaximize}>
                <MIcon name={isMaximized ? "restore" : "maximize"} size="24px" />
            </button>
            <button class="control-btn close" onclick={onClose}>
                <MIcon name="x" size="24px" />
            </button>
        </div>
    </div>
    
    <div class="body">
        {#if component}
            <svelte:component this={component} {...componentProps} />
        {:else}
            <slot />
        {/if}
    </div>
    
    <div class="footer">
        <div class="footer-buttons">
            {#each footerButtons as button}
                <button onclick={button.onClick}>{button.text}</button>
            {/each}
        </div>
    </div>

    <!-- All resize handles -->
    <div class="resize-handle n" onmousedown={(e) => handleResizeStart(e, 'n')}></div>
    <div class="resize-handle e" onmousedown={(e) => handleResizeStart(e, 'e')}></div>
    <div class="resize-handle s" onmousedown={(e) => handleResizeStart(e, 's')}></div>
    <div class="resize-handle w" onmousedown={(e) => handleResizeStart(e, 'w')}></div>
    <div class="resize-handle ne" onmousedown={(e) => handleResizeStart(e, 'ne')}></div>
    <div class="resize-handle nw" onmousedown={(e) => handleResizeStart(e, 'nw')}></div>
    <div class="resize-handle se" onmousedown={(e) => handleResizeStart(e, 'se')}></div>
    <div class="resize-handle sw" onmousedown={(e) => handleResizeStart(e, 'sw')}></div>
</div>

<style>
    button {
        margin: 0 5px;
    }
    .shell {
        position: fixed;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .header {
        height: 60px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f5f5f5;
        cursor: grab;
        user-select: none;
    }

    .body {
        flex: 1;
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
    }

    .resize-handle {
        position: absolute;
        background: transparent;
    }

    .resize-handle.n {
        top: 0;
        left: 0;
        height: 4px;
        width: 100%;
        cursor: n-resize;
    }

    .resize-handle.e {
        right: 0;
        top: 0;
        width: 4px;
        height: 100%;
        cursor: e-resize;
    }

    .resize-handle.s {
        bottom: 0;
        left: 0;
        height: 4px;
        width: 100%;
        cursor: s-resize;
    }

    .resize-handle.w {
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        cursor: w-resize;
    }

    .resize-handle.ne {
        right: 0;
        top: 0;
        width: 8px;
        height: 8px;
        cursor: ne-resize;
    }

    .resize-handle.nw {
        left: 0;
        top: 0;
        width: 8px;
        height: 8px;
        cursor: nw-resize;
    }

    .resize-handle.se {
        right: 0;
        bottom: 0;
        width: 8px;
        height: 8px;
        cursor: se-resize;
    }

    .resize-handle.sw {
        left: 0;
        bottom: 0;
        width: 8px;
        height: 8px;
        cursor: sw-resize;
    }

    .window-controls {
        display: flex;
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
        background: rgba(0,0,0,0.1);
    }

    .control-btn.close:hover {
        background: #ff4444;
        color: white;
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
        .body, .footer {
            display: none;
        }
        .header {
            height: 40px;
        }
    }
</style> 
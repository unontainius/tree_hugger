<script lang="ts">
    import { taskbarStore } from '$lib/stores/taskbarStore';
    import type { TaskBarItem } from '$lib/stores/taskbarStore';
    import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    
    let items = $state<TaskBarItem[]>([]);
    let contextMenuPosition = $state<{ x: number; y: number } | null>(null);
    let activeItemId = $state<string | null>(null);
    let contextMenuRef: HTMLDivElement | null = $state(null);

    // Handle click outside context menu
    function handleClickOutside(event: MouseEvent) {
        if (contextMenuPosition && contextMenuRef && !contextMenuRef.contains(event.target as Node)) {
            closeContextMenu();
        }
    }

    $effect(() => {
        if (contextMenuPosition) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    });

    // Subscribe to taskbar store
    $effect(() => {
        const unsubscribe = taskbarStore.subscribe(value => {
            items = value;
        });
        
        return unsubscribe;
    });

    function handleItemClick(item: TaskBarItem) {
        taskbarStore.updateItem(item.id, { 
            isMinimized: false,
            position: item.position,
            size: item.size
        });
        closeContextMenu();
    }

    function handleContextMenu(e: MouseEvent, item: TaskBarItem) {
        e.preventDefault();
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        contextMenuPosition = { 
            x: rect.left,
            y: rect.top - 76  // Menu height (68px) + small gap (8px)
        };
        activeItemId = item.id;
    }

    function closeContextMenu() {
        contextMenuPosition = null;
        activeItemId = null;
    }

    function handleOpen() {
        if (activeItemId) {
            const item = items.find(i => i.id === activeItemId);
            if (item) {
                taskbarStore.updateItem(activeItemId, { 
                    isMinimized: false,
                    position: item.position,
                    size: item.size
                });
            }
            closeContextMenu();
        }
    }

    function handleClose() {
        if (activeItemId) {
            taskbarStore.removeItem(activeItemId);
            closeContextMenu();
        }
    }
</script>

<div class="taskbar" style:display={items.length ? 'flex' : 'none'}>
    <div class="items">
        {#each items as item (item.id)}
            <div
                class="item"
                onclick={() => handleItemClick(item)}
                oncontextmenu={(e) => handleContextMenu(e, item)}
                animate:flip={{ duration: 300 }}
            >
                {item.title}
            </div>
        {/each}
    </div>

    {#if contextMenuPosition}
        <div 
            class="context-menu"
            bind:this={contextMenuRef}
            style="
                left: {contextMenuPosition.x}px; 
                top: {contextMenuPosition.y}px;
                bottom: unset;
            "
            transition:fade={{ duration: 150 }}
        >
            <div class="menu-item" onclick={handleOpen}>
                Open
            </div>
            <div class="menu-item" onclick={handleClose}>
                Close
            </div>
        </div>
    {/if}
</div>

<style>
    .taskbar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: #f5f5f5;
        border-top: 1px solid #ddd;
        display: flex;
        align-items: center;
        padding: 0 20px;
        z-index: 2000;
    }

    .items {
        display: flex;
        gap: 10px;
        flex: 1;
    }

    .item {
        padding: 8px 16px;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: all 0.2s ease;
        animation: slideIn 0.3s ease-out;
    }

    .item:hover {
        background: #f0f0f0;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .context-menu {
        position: fixed;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 4px 0;
        min-width: 150px;
        animation: fadeIn 0.15s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .menu-item {
        padding: 8px 16px;
        cursor: pointer;
    }

    .menu-item:hover {
        background: #f0f0f0;
    }
</style> 
<script lang="ts">
    import Window from '$lib/components/Window.svelte';
    import Test1 from '$lib/components/Test1.svelte';
    import { windowPersist } from '$lib/stores/windowPersistStore';
    import TaskBar from '$lib/components/TaskBar.svelte';
    import { onMount } from 'svelte';
    
    let windows = $state<{
        id: number;
        title: string;
        color: string;
        position: { x: number; y: number };
        size: { width: number; height: number };
    }[]>([]);
    let nextId = 0;

    function clearAllWindows() {
        windowPersist.clear();
        windows = [];
        nextId = 0;
    }

    onMount(() => {
        const savedWindows = windowPersist.load();
        
        const uniqueIds = new Set();
        const validWindows = savedWindows
            .filter(w => {
                const id = parseInt(w.id);
                if (!isNaN(id) && !uniqueIds.has(id)) {
                    uniqueIds.add(id);
                    return true;
                }
                return false;
            })
            .map(w => ({
                id: parseInt(w.id),
                title: w.title,
                color: w.color || '#' + Math.floor(Math.random()*16777215).toString(16),
                position: w.position || { x: 100, y: 100 },
                size: w.size || { width: 400, height: 300 }
            }));

        windows = validWindows;
        if (validWindows.length > 0) {
            const maxId = Math.max(...validWindows.map(w => w.id));
            nextId = isNaN(maxId) ? 0 : maxId + 1;
        }
    });

    function addWindow() {
        // Try to find a free spot by checking existing window positions
        const usedPositions = new Set(windows.map(w => `${w.position.x},${w.position.y}`));
        let position = { x: 100, y: 100 };
        
        // If default position is taken, increment by 20px until we find a free spot
        while (usedPositions.has(`${position.x},${position.y}`)) {
            position.x += 20;
            position.y += 20;
            
            // Reset to top if we've gone too far
            if (position.x > window.innerWidth - 400 || position.y > window.innerHeight - 300) {
                position = { x: 100, y: 100 };
            }
        }

        const size = { width: 400, height: 300 };

        const newWindow = { 
            id: nextId++, 
            title: `Window ${nextId - 1}`,
            color: '#' + Math.floor(Math.random()*16777215).toString(16),
            position,
            size
        };
        windows = [...windows, newWindow];
        windowPersist.save({
            id: newWindow.id.toString(),
            title: newWindow.title,
            position,
            size,
            isMaximized: false,
            isMinimized: false,
            color: newWindow.color
        });
    }

    function closeWindow(id: number) {
        windowPersist.remove(id.toString());
        windows = windows.filter(w => w.id !== id);
    }

    function updateWindowPosition(id: number, newPosition: { x: number; y: number }) {
        const window = windows.find(w => w.id === id);
        if (window) {
            window.position = newPosition;
            windowPersist.save({
                id: id.toString(),
                title: window.title,
                position: newPosition,
                size: window.size,
                isMaximized: false,
                isMinimized: false,
                color: window.color
            });
        }
    }

    function updateWindowSize(id: number, newSize: { width: number; height: number }) {
        const window = windows.find(w => w.id === id);
        if (window) {
            window.size = newSize;
            windowPersist.save({
                id: id.toString(),
                title: window.title,
                position: window.position,
                size: newSize,
                isMaximized: false,
                isMinimized: false,
                color: window.color
            });
        }
    }

    function handleFooterAction(action: string) {
        alert(`Footer action: ${action}`);
    }
</script>

<div class="test-container">
    <div class="button-container">
        <button class="add-btn" onclick={addWindow}>
            Add Window
        </button>
        <button class="clear-btn" onclick={clearAllWindows}>
            Clear All Windows
        </button>
    </div>

    {#each windows as window (window.id)}
        <Window
            title={window.title}
            onClose={() => closeWindow(window.id)}
            footerButtons={[
                { text: 'Save', onClick: () => handleFooterAction('save') },
                { text: 'Cancel', onClick: () => handleFooterAction('cancel') }
            ]}
            component={Test1}
            componentProps={{ backgroundColor: window.color }}
            initialPosition={window.position}
            initialSize={window.size}
            onPositionChange={(pos) => updateWindowPosition(window.id, pos)}
            onSizeChange={(size) => updateWindowSize(window.id, size)}
        >
            <div class="window-content">
                <h2>Window Content</h2>
                <p>This is window #{window.id}</p>
                <p>Try:</p>
                <ul>
                    <li>Drag the header (hold for 200ms)</li>
                    <li>Double-click header to maximize</li>
                    <li>Use window controls (minimize, maximize, close)</li>
                    <li>Resize from any edge or corner</li>
                </ul>
            </div>
        </Window>
    {/each}
</div>

<TaskBar />

<style>
    :global(body) {
        background-color: #474747;
    }
    .test-container {
        padding: 0px;
        margin: 0px;
    }

    .button-container {
        position: fixed;
        top: 20px;
        left: 20px;
        display: flex;
        gap: 10px;
        z-index: 3000;
    }

    .add-btn,
    .clear-btn {
        padding: 10px 20px;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .add-btn {
        background: #4CAF50;
    }

    .clear-btn {
        background: #f44336;
    }

    .add-btn:hover {
        background: #45a049;
    }

    .clear-btn:hover {
        background: #d32f2f;
    }

    .window-content {
        padding: 20px;
    }

    .window-content h2 {
        margin-top: 0;
    }

    ul {
        padding-left: 20px;
    }

    li {
        margin: 5px 0;
    }

    :global(body) {
        margin-bottom: 60px;
    }
</style> 
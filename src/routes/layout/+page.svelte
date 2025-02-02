<script lang="ts">
    // ... other imports and code ...

    let modalPosition = $state({ x: 0, y: 0 });
    let isDragging = $state(false);
    let dragStart = $state({ x: 0, y: 0 });

    function handleMouseDown(e: MouseEvent) {
        if (!(e.target as HTMLElement).closest('.header')) return;
        isDragging = true;
        dragStart = {
            x: e.clientX - modalPosition.x,
            y: e.clientY - modalPosition.y
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(e: MouseEvent) {
        if (!isDragging) return;
        modalPosition = {
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        };
    }

    function handleMouseUp() {
        isDragging = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }

    onDestroy(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    });
</script>

 
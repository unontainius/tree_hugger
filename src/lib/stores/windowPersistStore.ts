import { browser } from '$app/environment';

interface PersistedWindow {
    id: string;
    title: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    isMaximized: boolean;
    isMinimized: boolean;
    color?: string;
}

const STORAGE_KEY = 'persisted-windows';

function loadWindows(): PersistedWindow[] {
    if (!browser) return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveWindows(windows: PersistedWindow[]) {
    if (!browser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(windows));
}

export const windowPersist = {
    save: (window: PersistedWindow) => {
        const windows = loadWindows();
        const index = windows.findIndex(w => w.id === window.id);
        if (index >= 0) {
            windows[index] = window;
        } else {
            windows.push(window);
        }
        saveWindows(windows);
    },
    load: () => loadWindows(),
    remove: (id: string) => {
        const windows = loadWindows().filter(w => w.id !== id);
        saveWindows(windows);
    },
    clear: () => {
        if (browser) {
            localStorage.removeItem(STORAGE_KEY);
        }
    }
}; 
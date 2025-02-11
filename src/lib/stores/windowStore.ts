import { writable } from 'svelte/store';

interface WindowState {
	id: string;
	zIndex: number;
	isActive: boolean;
}

function createWindowStore() {
	const { subscribe, update } = writable<WindowState[]>([]);
	const baseZIndex = 1000;

	return {
		subscribe,
		register: (id: string) =>
			update((windows) => {
				const maxZ = windows.length ? Math.max(...windows.map((w) => w.zIndex)) : baseZIndex;
				return [
					...windows.map((w) => ({ ...w, isActive: false })),
					{ id, zIndex: maxZ + 1, isActive: true }
				];
			}),
		focus: (id: string) =>
			update((windows) => {
				const maxZ = Math.max(...windows.map((w) => w.zIndex));
				return windows.map((w) => ({
					...w,
					isActive: w.id === id,
					zIndex: w.id === id ? maxZ + 1 : w.zIndex
				}));
			}),
		remove: (id: string) => update((windows) => windows.filter((w) => w.id !== id))
	};
}

export const windows = createWindowStore();

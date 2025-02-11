import { writable } from 'svelte/store';

interface TaskBarItemInterface {
	id: string;
	title: string;
	isMinimized: boolean;
	position: { x: number; y: number };
	size: { width: number; height: number };
}

function createTaskBarStore() {
	const { subscribe, update, set } = writable<TaskBarItemInterface[]>([]);

	return {
		subscribe,
		addItem: (item: TaskBarItemInterface) => update((items) => [...items, item]),
		removeItem: (id: string) => update((items) => items.filter((i) => i.id !== id)),
		updateItem: (id: string, updates: Partial<TaskBarItemInterface>) =>
			update((items) => items.map((item) => (item.id === id ? { ...item, ...updates } : item))),
		clear: () => set([])
	};
}

export const taskbarStore = createTaskBarStore();
export type TaskBarItem = TaskBarItemInterface;

import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: number;
	type: ToastType;
	message: string;
	duration?: number;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);
	let count = 0;

	function addToast(message: string, type: ToastType, duration: number = 3000) {
		const id = count++;

		update((toasts) => [...toasts, { id, message, type }]);

		setTimeout(() => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		}, duration);
	}

	return {
		subscribe,
		success: (message: string, duration?: number) => addToast(message, 'success', duration),
		error: (message: string, duration?: number) => addToast(message, 'error', duration),
		info: (message: string, duration?: number) => addToast(message, 'info', duration),
		warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
		remove: (id: number) => update((toasts) => toasts.filter((t) => t.id !== id))
	};
}

export const toasts = createToastStore();

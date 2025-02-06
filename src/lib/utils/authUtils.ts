import { toasts } from '$lib/stores/toastStore';
import { get } from 'svelte/store';
import { user } from '$lib/stores/authStore';

export async function isLoggedIn(): Promise<boolean> {
    const currentUser = get(user);
    if (!currentUser) {
        toasts.error('You must be logged in to perform this activity');
        return false;
    }
    return true;
} 


import supabase from '$lib/supabaseClient';
import { loginRequestedState, user } from '$lib/stores/authStore';
import { toasts } from '$lib/stores/toastStore';

// import type { User, AuthError } from '@supabase/supabase-js';
// import { writable } from 'svelte/store';

// export function loginStateSet(state: boolean) {
//     loginState.update(state => state = state);
// }

export const authService = {
	async login(email: string, password: string) {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) throw error;
			user.set(data.user);
			toasts.success('Successfully logged in', 500);
			return data.user;
		} catch (error) {
			console.error('Login error:', error);
			toasts.error('Login failed');
			throw error;
		}
	},

	async logout() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			user.set(null);
			toasts.success('Successfully logged out', 500);
		} catch (error) {
			console.error('Logout error:', error);
			toasts.error('Logout failed');
			throw error;
		}
	},

	async getCurrentUser() {
		try {
			const {
				data: { user: currentUser }
			} = await supabase.auth.getUser();
			user.set(currentUser);
			return currentUser;
		} catch (error) {
			console.error('Get user error:', error);
			return null;
		}
	},

	loginRequestedStateSet(state: boolean) {
		loginRequestedState.set(state);
	},

	getLoginRequestedState() {
		return loginRequestedState;
	}
};

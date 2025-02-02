import supabase from '$lib/supabaseClient';
import { user } from '$lib/stores/authStore';
import { toasts } from '$lib/stores/toastStore';

export const authService = {
    async login(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            user.set(data.user);
            toasts.success('Successfully logged in');
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
            toasts.success('Successfully logged out');
        } catch (error) {
            console.error('Logout error:', error);
            toasts.error('Logout failed');
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            user.set(currentUser);
            return currentUser;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }
}; 
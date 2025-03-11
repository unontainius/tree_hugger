import { writable, get } from 'svelte/store';
import supabase from '../supabaseClient';
import type { User } from '@supabase/supabase-js';

// Create a store for the user
export const currentUser = writable<User | null>(null);

// Initialize the user store
export async function initUser(): Promise<void> {
	// Get the current session
	const { data: { session } } = await supabase.auth.getSession();
	
	if (session?.user) {
		currentUser.set(session.user);
	} else {
		currentUser.set(null);
	}
	
	// Listen for auth state changes
	supabase.auth.onAuthStateChange((_event, session) => {
		if (session?.user) {
			currentUser.set(session.user);
		} else {
			currentUser.set(null);
		}
	});
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});
	
	if (error) {
		return { success: false, error: error.message };
	}
	
	if (data.user) {
		currentUser.set(data.user);
		return { success: true };
	}
	
	return { success: false, error: 'No user data received' };
}

// Sign up with email and password
export async function signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
	const { data, error } = await supabase.auth.signUp({
		email,
		password
	});
	
	if (error) {
		return { success: false, error: error.message };
	}
	
	if (data.user) {
		currentUser.set(data.user);
		return { success: true };
	}
	
	return { success: false, error: 'No user data received' };
}

// Sign out
export async function signOut(): Promise<void> {
	await supabase.auth.signOut();
	currentUser.set(null);
}

// Get the current user
export function getCurrentUser(): User | null {
	return get(currentUser);
}

// Check if the user is authenticated (sync version)
export function isAuthenticated(): boolean {
	return !!getCurrentUser();
}

// Check if the user is logged in (async version)
export async function isLoggedIn(): Promise<boolean> {
	const { data: { session } } = await supabase.auth.getSession();
	if (session?.user) {
		// Update the store to ensure consistency
		currentUser.set(session.user);
		return true;
	}
	currentUser.set(null);
	return false;
}

// Initialize authentication on module load
initUser().catch(console.error);

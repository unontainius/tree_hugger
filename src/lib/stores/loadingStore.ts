import { writable } from 'svelte/store';

// Create a writable store for the loading state
export const loading = writable(false);

// Create a writable store for the loading message
export const loadingMessage = writable('Loading...');

// Helper functions to control the loading state
export function showLoading(message = 'Loading...') {
  loading.set(true);
  loadingMessage.set(message);
}

export function hideLoading() {
  loading.set(false);
}

// Function to execute an async operation with loading state
export async function withLoading<T>(
  operation: () => Promise<T>, 
  message = 'Loading...'
): Promise<T> {
  try {
    showLoading(message);
    return await operation();
  } finally {
    hideLoading();
  }
} 
import { showLoading, hideLoading } from '$lib/stores/loadingStore';

/**
 * Executes an async function with loading state management
 * @param fn The async function to execute
 * @param loadingMessage The message to display while loading
 * @returns The result of the async function
 */
export async function executeWithLoading<T>(
  fn: () => Promise<T>,
  loadingMessage = 'Loading...'
): Promise<T> {
  try {
    showLoading(loadingMessage);
    return await fn();
  } finally {
    hideLoading();
  }
}

/**
 * Creates a function that will show loading state while executing
 * @param fn The function to wrap
 * @param loadingMessage The message to display while loading
 * @returns A function that will show loading state while executing
 */
export function createLoadingFunction<T>(
  fn: () => Promise<T>,
  loadingMessage = 'Loading...'
): () => Promise<T> {
  return async () => {
    return executeWithLoading(fn, loadingMessage);
  };
} 
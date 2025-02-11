import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [ sveltekit()],
	server: {
		fs: {
			// Allow serving files from these directories
			allow: ['static']
		}
	}
});

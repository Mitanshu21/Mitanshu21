import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Prerender everything to static files (GitHub Pages has no server).
			adapter: adapter(),

			// Set by the deploy workflow to "/<repo-name>" for GitHub Pages project sites.
			// Empty locally and on a user site (mitanshu21.github.io) or custom domain.
			paths: {
				base: (process.env.BASE_PATH as `/${string}` | undefined) || ''
			}
		})
	]
});

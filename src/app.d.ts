// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Injected by Vite `define` at build time (see vite.config.ts).
	const __BUILD_SHA__: string;
}

export {};

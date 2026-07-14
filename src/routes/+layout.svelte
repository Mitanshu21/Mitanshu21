<script lang="ts">
	import '@fontsource-variable/archivo/standard.css';
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/700.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	$effect(() => {
		const signal = 'color:#ff4d00;font-family:monospace';
		const dim = 'color:#8a8a85;font-family:monospace';
		console.log('%c[boot] paper/ink/signal — prerendered, nothing to hydrate late', signal);
		console.log('%c[model] visitor_classifier: "curious developer" (confidence: 0.98)', dim);
		console.log('%c[hint] press ⌘K — there is a terminal in here. try `sudo hire mitanshu`', dim);
		console.log('%c[meta] handcrafted with svelte 5 · no trackers · view source, it is readable', dim);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

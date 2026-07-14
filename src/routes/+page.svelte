<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import IndexOverlay from '$lib/components/IndexOverlay.svelte';
	import Chrome from '$lib/components/Chrome.svelte';
	import { profile } from '$lib/data';

	const title = `${profile.name} — ${profile.role}`;
	const description = `${profile.tagline} Portfolio of ${profile.name}, full-stack developer working with Svelte, React, Node.js and Python.`;

	// Numeral parallax drift: one passive scroll listener writes --sy on :root.
	$effect(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let raf = 0;
		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(() => {
				document.documentElement.style.setProperty('--sy', String(window.scrollY));
				raf = 0;
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
</svelte:head>

<a class="skip" href="#about">SKIP TO CONTENT</a>

<Terminal />
<IndexOverlay />
<Chrome />

<main id="main">
	<Hero />
	<About />
	<Experience />
	<Projects />
	<Contact />
</main>
<Footer />

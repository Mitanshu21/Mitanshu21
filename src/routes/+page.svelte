<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Evolution from '$lib/components/Evolution.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import IndexOverlay from '$lib/components/IndexOverlay.svelte';
	import Chrome from '$lib/components/Chrome.svelte';
	import { profile } from '$lib/data';

	const title = `${profile.name} — ${profile.role}`;
	const description = `${profile.tagline} Portfolio of ${profile.name}, AI engineer shipping models, APIs and interfaces — with live neural-network demos running in your browser.`;

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
	<Evolution />
	<Experience />
	<Projects />
	<Contact />
</main>
<Footer />

<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Writing from '$lib/components/Writing.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { profile } from '$lib/data';

	const title = `${profile.name} — ${profile.role}`;
	const description = `${profile.tagline} Portfolio of ${profile.name}, ${profile.role.toLowerCase()} working with Svelte, React, Node.js and Python.`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
</svelte:head>

<Nav />
<main>
	<Hero />
	<About />
	<Experience />
	<Projects />
	<Writing />
	<Contact />
</main>
<Footer />

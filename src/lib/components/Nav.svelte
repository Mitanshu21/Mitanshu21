<script lang="ts">
	import { profile } from '$lib/data';

	let scrollY = $state(0);
	const scrolled = $derived(scrollY > 24);

	const links = [
		{ href: '#about', label: 'About' },
		{ href: '#experience', label: 'Experience' },
		{ href: '#work', label: 'Work' },
		{ href: '#contact', label: 'Contact' }
	];
</script>

<svelte:window bind:scrollY />

<header class:scrolled>
	<nav class="container">
		<a href="#top" class="logo" aria-label="Back to top">
			<span class="bracket">[</span>MP<span class="bracket">]</span>
		</a>
		<ul>
			{#each links as link (link.href)}
				<li><a href={link.href}>{link.label}</a></li>
			{/each}
		</ul>
		<a class="gh" href={profile.github} target="_blank" rel="noopener noreferrer">
			GitHub <span aria-hidden="true">↗</span>
		</a>
	</nav>
</header>

<style>
	header {
		position: fixed;
		inset: 0 0 auto;
		z-index: 10;
		border-bottom: 1px solid transparent;
		transition:
			border-color 0.3s ease,
			background 0.3s ease;
	}

	header.scrolled {
		background: rgba(8, 8, 12, 0.75);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom-color: var(--line);
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 4rem;
	}

	.logo {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 0.95rem;
		letter-spacing: 0.06em;
	}

	.bracket {
		color: var(--accent);
	}

	ul {
		display: flex;
		gap: 2rem;
		list-style: none;
	}

	ul a,
	.gh {
		font-size: 0.85rem;
		color: var(--muted);
		transition: color 0.2s ease;
	}

	ul a:hover,
	.gh:hover {
		color: var(--text);
	}

	.gh span {
		color: var(--accent);
	}

	@media (max-width: 640px) {
		ul {
			display: none;
		}
	}
</style>

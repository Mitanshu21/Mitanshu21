<script lang="ts">
	import { profile } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';

	let copied = $state(false);

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(profile.email);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard unavailable — the mailto link still works.
		}
	}
</script>

<section class="section" id="contact">
	<div class="container">
		<p class="section-label" use:reveal>04 — Contact</p>

		<div class="inner" use:reveal>
			<h2 class="section-title">Let’s build something.</h2>
			<p class="blurb">
				Whether it’s a role, a project or just an idea worth talking about — my inbox is open.
			</p>

			<div class="row">
				<a class="email" href="mailto:{profile.email}">{profile.email}</a>
				<button onclick={copyEmail} class:copied aria-label="Copy email address">
					{copied ? 'Copied ✓' : 'Copy'}
				</button>
			</div>

			<div class="socials">
				<a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
				{#if profile.linkedin}
					<a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.inner {
		text-align: center;
		padding: 2rem 0;
	}

	.blurb {
		color: var(--muted);
		max-width: 46ch;
		margin: 0 auto 2.5rem;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}

	.email {
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 3vw, 1.6rem);
		font-weight: 600;
		letter-spacing: -0.01em;
		border-bottom: 1px solid var(--line-strong);
		padding-bottom: 2px;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.email:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	button {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		color: var(--muted);
		border: 1px solid var(--line);
		border-radius: 99px;
		padding: 0.35rem 0.9rem;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
	}

	button:hover,
	button.copied {
		color: var(--accent);
		border-color: var(--accent);
	}

	.socials {
		display: flex;
		justify-content: center;
		gap: 2rem;
	}

	.socials a {
		font-size: 0.88rem;
		color: var(--muted);
		transition: color 0.2s ease;
	}

	.socials a:hover {
		color: var(--accent);
	}
</style>

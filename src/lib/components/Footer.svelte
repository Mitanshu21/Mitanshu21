<script lang="ts">
	import { profile } from '$lib/data';
</script>

<footer>
	<div class="container">
		<p>© {new Date().getFullYear()} {profile.name}</p>
		<p class="built">Designed & built with Svelte — no trackers, no bloat.</p>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--line);
		padding: 2rem 0;
	}

	footer .container {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	p {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		color: var(--faint);
	}

	.built {
		color: var(--faint);
	}
</style>

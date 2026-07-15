<script lang="ts">
	// The only fixed UI: section ticker (bottom-left) + ⌘K chip (bottom-right).
	// Both invert over ink slabs via mix-blend-mode: difference.
	import { ui } from '$lib/ui.svelte';
	import { magnetic } from '$lib/actions/magnetic';

	let current = $state('01 / 06 — INDEX');

	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						current = (entry.target as HTMLElement).dataset.section ?? current;
					}
				}
			},
			{ threshold: 0.5 }
		);
		document.querySelectorAll<HTMLElement>('[data-section]').forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});
</script>

<div class="chrome" aria-hidden="true">
	{#key current}
		<p class="ticker v-mono-s">{current}</p>
	{/key}
</div>
<button
	class="chip v-mono-s"
	onclick={() => (ui.terminal = true)}
	use:magnetic
	aria-label="Open terminal (Command K)"
>
	⌘K
</button>

<style>
	.chrome,
	.chip {
		position: fixed;
		bottom: 1rem;
		z-index: 40;
	}

	/* both carry solid backgrounds — blend modes over text collide,
	   and difference turns signal-orange blue */
	.chrome {
		left: 2vw;
		pointer-events: none;
		background: var(--ink);
		color: var(--paper);
		border: 1px solid var(--paper);
		border-radius: 2px;
		padding: 0.3rem 0.7rem;
	}

	.ticker {
		animation: roll 0.2s var(--ease-expo) both;
	}

	@keyframes roll {
		from {
			transform: translateY(0.6em);
			opacity: 0;
		}
	}

	.chip {
		right: 2vw;
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		background: var(--ink);
		color: var(--paper);
		border: 1px solid var(--paper);
		border-radius: 2px;
	}

	.chip:hover {
		background: var(--signal);
		color: var(--ink);
		border-color: var(--ink);
	}

	@media (max-width: 768px) {
		.chrome {
			display: none;
		}
	}
</style>

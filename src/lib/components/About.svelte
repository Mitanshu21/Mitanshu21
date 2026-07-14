<script lang="ts">
	import { about } from '$lib/data';
	import { rise } from '$lib/actions/rise';
</script>

<section class="rule-top" id="about" data-numeral data-section="02 / 05 — ABOUT">
	<span class="numeral left" aria-hidden="true">02</span>
	<h2 class="sr-only">About</h2>

	<div class="broadsheet body">
		<p class="lede v-lede" use:rise>
			I’m Mitanshu — a full-stack developer shipping end-to-end products in Svelte, React,
			Node.js and Python. I obsess over the <mark>milliseconds</mark>: this page carries
			<mark>less JavaScript than most cookie banners</mark>.
		</p>

		<div class="prose" use:rise={{ delay: 80 }}>
			{#each about.paragraphs as paragraph (paragraph)}
				<p class="v-body">{paragraph}</p>
			{/each}
		</div>
	</div>

	<div class="ledger">
		{#each about.skills as { group, items } (group)}
			<div class="row rule-top" use:rise={{ delay: 60 }}>
				<span class="v-mono-s group">{group.toUpperCase()}</span>
				<span class="v-mono items">{items.join(' / ').toUpperCase()}</span>
			</div>
		{/each}
	</div>
</section>

<style>
	section {
		padding-top: clamp(6rem, 14vh, 12rem);
	}

	.body {
		position: relative;
		z-index: 1;
	}

	.lede {
		grid-column: 4 / 13;
		margin-bottom: 4rem;
	}

	mark {
		background: var(--signal);
		color: var(--ink);
		padding-inline: 0.12em;
	}

	.prose {
		grid-column: 6 / 13;
		margin-bottom: 6rem;
	}

	.prose p + p {
		margin-top: 1.25rem;
	}

	.ledger .row {
		display: grid;
		grid-template-columns: minmax(120px, 14vw) 1fr;
		gap: 2vw;
		padding: 0.85rem 2vw;
		transition:
			background 0.15s ease,
			color 0.15s ease;
	}

	.ledger .row:hover {
		background: var(--ink);
		color: var(--paper);
	}

	.items {
		font-size: 13px;
	}

	@media (max-width: 768px) {
		.lede {
			grid-column: 1 / -1;
		}
		.prose {
			grid-column: 2 / -1;
			margin-bottom: 4rem;
		}
		.ledger .row {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}
</style>

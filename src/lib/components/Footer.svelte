<script lang="ts">
	import { profile, marqueeText } from '$lib/data';
	import Marquee from './Marquee.svelte';

	// Keep in sync with the measured build output (gzipped JS total).
	const JS_KB = 42;

	const receipt: [string, string][] = [
		['JS SHIPPED', `${JS_KB} KB GZIP`],
		['FONTS', '2 FAMILIES, SELF-HOSTED'],
		['FRAMEWORK CSS', 'NONE'],
		['TRACKING', 'NONE'],
		['X-FRAMEWORKS-CRIED-FOR', '0'],
		['LIGHTHOUSE', 'GO ON, RUN IT'],
		['BUILD', `${__BUILD_SHA__} · SVELTE 5 · GITHUB PAGES`]
	];
</script>

<footer class="rule-top">
	<div class="cols broadsheet">
		<p class="colophon v-mono-s">
			© {new Date().getFullYear()}
			{profile.name.toUpperCase()} — SET IN ARCHIVO & JETBRAINS MONO
		</p>

		<dl class="till v-mono-s">
			{#each receipt as [k, v] (k)}
				<div class="line">
					<dt>{k}</dt>
					<dd>— {v}</dd>
				</div>
			{/each}
			<div class="line rm-only">
				<dt>REDUCED MOTION</dt>
				<dd>— RESPECTED ✓</dd>
			</div>
		</dl>
	</div>

	<div class="strip rule-top">
		<Marquee text={marqueeText.toUpperCase()} reverse alternate duration={30} />
	</div>
</footer>

<style>
	.cols {
		padding-block: 3rem;
		align-items: end;
	}

	.colophon {
		grid-column: 1 / 6;
	}

	.till {
		grid-column: 7 / 13;
	}

	.line {
		display: flex;
		justify-content: space-between;
		gap: 2rem;
	}

	dd {
		text-align: right;
	}

	.rm-only {
		display: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.rm-only {
			display: flex;
			color: var(--signal);
		}
	}

	@media (max-width: 768px) {
		.colophon,
		.till {
			grid-column: 1 / -1;
		}
		.colophon {
			margin-bottom: 2rem;
			order: 2;
		}
		.till {
			order: 1;
			margin-bottom: 2rem;
		}
	}
</style>

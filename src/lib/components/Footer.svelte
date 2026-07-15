<script lang="ts">
	import { profile } from '$lib/data';

	// Keep in sync with the measured build output (gzipped JS total).
	const JS_KB = 43;

	const receipt: [string, string][] = [
		['JS SHIPPED', `${JS_KB} KB GZIP — FLUID ENGINE LAZY-LOADED`],
		['FONTS', '2 FAMILIES, SELF-HOSTED'],
		['FRAMEWORK CSS', 'NONE'],
		['TRACKING', 'NONE'],
		['FLUID SIM', 'HAND-ROLLED NAVIER–STOKES'],
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

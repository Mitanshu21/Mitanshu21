<script lang="ts">
	import { bioVariants, about } from '$lib/data';
	import { rise } from '$lib/actions/rise';

	let temp = $state(0.7);
	let shown = $state(bioVariants.mid);
	let typing = 0;

	const variant = $derived(temp < 0.45 ? bioVariants.low : temp < 1.0 ? bioVariants.mid : bioVariants.high);
	const tempClass = $derived(temp < 0.45 ? 'low' : temp < 1.0 ? 'mid' : 'high');

	// re-sample: the paragraph re-types like fresh model output
	$effect(() => {
		const target = variant;
		if (target === shown) return;
		clearInterval(typing);
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			shown = target;
			return;
		}
		let i = 0;
		shown = '';
		typing = setInterval(() => {
			i += 7; // chars per tick — fast, like a good token stream
			shown = target.slice(0, i);
			if (i >= target.length) clearInterval(typing);
		}, 12) as unknown as number;
		return () => clearInterval(typing);
	});
</script>

<section class="rule-top" id="description" data-section="§1 — GENERAL DESCRIPTION">
	<div class="sec-bar">
		<h2>1. GENERAL DESCRIPTION</h2>
		<span class="note">OUTPUT VARIES WITH SAMPLING TEMPERATURE</span>
	</div>

	<div class="inner" use:rise>
		<div class="dial v-mono-s">
			<label for="temp">SAMPLING TEMPERATURE</label>
			<input
				id="temp"
				type="range"
				min="0.1"
				max="1.4"
				step="0.01"
				bind:value={temp}
				aria-label="Sampling temperature — changes how the description reads"
			/>
			<output class={tempClass}>T = {temp.toFixed(2)}</output>
			<span class="scale-note"
				>{temp < 0.45 ? 'DETERMINISTIC · CORPORATE' : temp < 1.0 ? 'BALANCED · HUMAN' : 'CREATIVE · UNHINGED'}</span
			>
		</div>

		<p class="bio v-body" class:high={tempClass === 'high'} aria-live="polite">
			{shown}<span class="caret" aria-hidden="true"></span>
		</p>
	</div>

	<div class="skills" use:rise={{ delay: 80 }}>
		<p class="v-label table-cap">TABLE 1-1 · SUPPORTED INSTRUCTION SETS</p>
		<table class="ds-table">
			<tbody>
				{#each about.skills as { group, items } (group)}
					<tr>
						<td class="grp">{group.toUpperCase()}</td>
						<td>{items.join('  ·  ').toUpperCase()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	.inner {
		padding: 1.5rem 1.25rem;
	}

	.dial {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.25rem;
	}

	input[type='range'] {
		appearance: none;
		-webkit-appearance: none;
		width: min(320px, 60vw);
		height: 2px;
		background: var(--ink);
		outline-offset: 6px;
		cursor: ew-resize;
	}

	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		-webkit-appearance: none;
		width: 16px;
		height: 16px;
		background: var(--signal);
		border: 2px solid var(--ink);
		cursor: ew-resize;
	}

	input[type='range']::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 0;
		background: var(--signal);
		border: 2px solid var(--ink);
		cursor: ew-resize;
	}

	output {
		font-weight: 700;
		min-width: 7ch;
	}

	output.high {
		color: var(--signal);
	}

	.scale-note {
		opacity: 0.5;
	}

	.bio {
		min-height: 7.5em;
		max-width: 72ch;
	}

	.bio.high {
		font-style: italic;
	}

	.caret {
		display: inline-block;
		width: 0.55em;
		height: 1em;
		margin-left: 2px;
		background: var(--signal);
		vertical-align: -0.15em;
		animation: blink 1.06s steps(2, start) infinite;
	}

	@keyframes blink {
		to {
			visibility: hidden;
		}
	}

	.skills {
		padding: 0 1.25rem 1.75rem;
	}

	.table-cap {
		display: block;
		margin-bottom: 0.6rem;
	}

	.grp {
		color: var(--signal);
		font-weight: 700;
		white-space: nowrap;
	}
</style>

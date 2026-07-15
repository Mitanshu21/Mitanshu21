<script lang="ts">
	// 04 — EVOLUTION: career as character progression. LV.1 spawn point
	// to the current arc, with an XP bar and per-level unlocks.
	import { evolution } from '$lib/data';
	import { rise } from '$lib/actions/rise';

	const MAX = evolution.length;
	const BAR = 24; // xp bar width in glyphs

	let filled = $state(0);
	let sectionEl = $state<HTMLElement>();

	const bar = $derived('█'.repeat(filled) + '░'.repeat(BAR - filled));

	$effect(() => {
		if (!sectionEl) return;
		const target = Math.round(BAR * 0.92); // current level, almost topped out
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			filled = target;
			return;
		}
		let timer = 0;
		const io = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || filled > 0) return;
			timer = setInterval(() => {
				filled = Math.min(target, filled + 1);
				if (filled >= target) clearInterval(timer);
			}, 45) as unknown as number;
			io.disconnect();
		});
		io.observe(sectionEl);
		return () => {
			clearInterval(timer);
			io.disconnect();
		};
	});
</script>

<section
	class="rule-top"
	id="evolution"
	data-numeral
	data-section="03 / 06 — EVOLUTION"
	bind:this={sectionEl}
>
	<span class="numeral right" aria-hidden="true">03</span>
	<h2 class="sr-only">Evolution — career progression</h2>

	<div class="head broadsheet" use:rise>
		<p class="section-label">03 — Evolution</p>
		<p class="note v-mono-s">CHARACTER PROGRESSION · EST. 2021</p>
	</div>

	<div class="xp broadsheet" use:rise={{ delay: 60 }}>
		<p class="v-mono xp-line">
			<span class="lv">LV.{MAX}</span>
			<span class="bar" aria-hidden="true">{bar}</span>
			<span class="pct">XP {Math.round((filled / BAR) * 100)}%</span>
			<span class="next">NEXT UNLOCK: CLASSIFIED</span>
		</p>
	</div>

	<ol class="levels">
		{#each evolution as e, i (e.lv)}
			<li class="broadsheet" class:current={e.current} use:rise={{ delay: (i % 3) * 80 }}>
				<div class="rail-cell" aria-hidden="true">
					<span class="node"></span>
					{#if i < evolution.length - 1}<span class="rail"></span>{/if}
				</div>
				<div class="lv-cell">
					<p class="lv-tag v-mono">LV.{e.lv}</p>
					<p class="year v-mono-s">{e.year.toUpperCase()}</p>
				</div>
				<div class="body-cell">
					<h3 class="v-display">
						{e.title.toUpperCase()}
						{#if e.current}<span class="here v-mono-s">← YOU ARE HERE</span>{/if}
					</h3>
					<p class="story v-body">{e.story}</p>
					<p class="unlocks v-mono-s">
						UNLOCKED:
						{#each e.unlocked as u (u)}
							<span class="chip">{u.toUpperCase()}</span>
						{/each}
					</p>
				</div>
			</li>
		{/each}
	</ol>
</section>

<style>
	section {
		padding-top: clamp(6rem, 14vh, 12rem);
		padding-bottom: 3rem;
	}

	.head {
		position: relative;
		z-index: 1;
		align-items: baseline;
		margin-bottom: 2rem;
	}

	.head .section-label {
		grid-column: 1 / 8;
	}

	.note {
		grid-column: 8 / 13;
		text-align: right;
		opacity: 0.6;
	}

	/* ── XP bar ── */
	.xp {
		position: relative;
		z-index: 1;
		margin-bottom: 3.5rem;
	}

	.xp-line {
		grid-column: 1 / 13;
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
		align-items: baseline;
	}

	.lv {
		font-weight: 700;
		color: var(--signal);
	}

	.bar {
		letter-spacing: 0.05em;
		color: var(--signal);
	}

	.pct {
		opacity: 0.7;
	}

	.next {
		opacity: 0.45;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	/* ── levels ── */
	.levels {
		list-style: none;
		position: relative;
		z-index: 1;
	}

	li {
		position: relative;
		padding-block: 2.25rem;
		border-top: 1px solid var(--line);
	}

	.rail-cell {
		grid-column: 1 / 2;
		position: relative;
		display: flex;
		justify-content: center;
	}

	.node {
		width: 13px;
		height: 13px;
		border: 2px solid var(--ink);
		background: var(--paper);
		rotate: 45deg;
		margin-top: 0.4rem;
		z-index: 1;
	}

	li.current .node {
		background: var(--signal);
		border-color: var(--signal);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		50% {
			opacity: 0.45;
		}
	}

	.rail {
		position: absolute;
		top: 1.4rem;
		bottom: -2.3rem;
		width: 1px;
		background: var(--line);
	}

	/* the rail lights up as levels enter the viewport (.in added at runtime) */
	li:global(.in) .rail {
		background: var(--signal);
		transition: background 0.8s ease 0.4s;
	}

	.lv-cell {
		grid-column: 2 / 4;
	}

	.lv-tag {
		font-weight: 700;
		color: var(--signal);
	}

	.year {
		opacity: 0.55;
		margin-top: 0.2rem;
	}

	.body-cell {
		grid-column: 4 / 12;
	}

	h3 {
		font-size: clamp(26px, 3.6vw, 56px);
		margin-bottom: 0.75rem;
	}

	.here {
		color: var(--signal);
		vertical-align: middle;
		margin-left: 1rem;
		white-space: nowrap;
	}

	.story {
		max-width: 58ch;
		color: color-mix(in srgb, var(--ink) 78%, transparent);
		margin-bottom: 1rem;
	}

	.unlocks {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
		opacity: 0.9;
	}

	.chip {
		border: 1px solid var(--ink);
		border-radius: 99px;
		padding: 0.15rem 0.65rem;
	}

	li.current .chip {
		border-color: var(--signal);
		color: var(--signal);
	}

	@media (max-width: 768px) {
		.rail-cell {
			display: none;
		}
		.lv-cell {
			grid-column: 1 / -1;
			display: flex;
			gap: 1rem;
			align-items: baseline;
		}
		.body-cell {
			grid-column: 1 / -1;
			margin-top: 0.5rem;
		}
		.here {
			display: block;
			margin: 0.4rem 0 0;
		}
	}
</style>

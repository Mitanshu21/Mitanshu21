<script lang="ts">
	import { profile, marqueeText } from '$lib/data';
	import { ui } from '$lib/ui.svelte';
	import { physicsBody, onHeadlineGrab } from '$lib/actions/physics';
	import { magnetic } from '$lib/actions/magnetic';
	import Marquee from './Marquee.svelte';

	// Prerendered fallback copy is replaced by the real on-device measurement.
	let loadedLine = $state('LOADED IN 0.2S — PRERENDERED, NOTHING TO WAIT FOR.');
	let jsLine = $state('LESS JS THAN A COOKIE BANNER.');
	// undocumented: the name is grabbable. The quips only exist for
	// visitors who discover that on their own.
	let quip = $state('');
	// masks clip the intro rise, then release so thrown letters aren't chopped
	let played = $state(false);

	$effect(() => {
		const t = setTimeout(() => (played = true), 900);
		return () => clearTimeout(t);
	});

	const LINE1 = 'MITAN—';
	const LINE2A = 'SHU';
	const LINE2B = 'PATEL';

	// the headline talks back as you rough it up
	onHeadlineGrab((n) => {
		if (n === 2) quip = 'SO YOU FOUND THE PHYSICS.';
		else if (n === 5) quip = 'CAREFUL — I KERNED THAT BY HAND.';
		else if (n === 9) quip = 'THE LETTERS HAVE FEELINGS, YOU KNOW.';
		else if (n === 13) {
			quip = 'FINE. YOU WIN.';
			console.log('%c[physics] visitor reclassified as: chaos agent', 'color:#ff4d00');
			ui.greeting = 'ok, you clearly like breaking things. let’s talk — type `help`.';
			ui.terminal = true;
		} else if (n === 20) quip = 'THE NAME HAS FILED A COMPLAINT.';
	});

	$effect(() => {
		// Any interaction during the intro jumps straight to the end state.
		const skip = () => document.documentElement.classList.add('skip-intro');
		const opts = { once: true, passive: true };
		window.addEventListener('keydown', skip, opts);
		window.addEventListener('pointerdown', skip, opts);
		window.addEventListener('wheel', skip, opts);

		// Measure at first frame after hydration — on the visitor's device.
		requestAnimationFrame(() => {
			const s = performance.now() / 1000;
			if (s > 0 && s < 30) {
				loadedLine = `LOADED IN ${s.toFixed(2)}S — MEASURED ON YOUR DEVICE, NOT CLAIMED.`;
				jsLine = s > 1 ? 'STILL LESS JS THAN A COOKIE BANNER.' : 'LESS JS THAN A COOKIE BANNER.';
			}
		});

		return () => {
			window.removeEventListener('keydown', skip);
			window.removeEventListener('pointerdown', skip);
			window.removeEventListener('wheel', skip);
		};
	});
</script>

<section class="hero" id="top" class:played data-section="01 / 06 — INDEX">
	<header class="masthead rule-row">
		<p class="v-mono-s">{profile.name.toUpperCase()} — PORTFOLIO, EST. {profile.est}</p>
		<div class="masthead-right v-mono-s">
			<a href="mailto:{profile.email}">{profile.email.toUpperCase()}</a>
			<button onclick={() => (ui.index = true)}>INDEX</button>
			<button class="chip" onclick={() => (ui.terminal = true)} use:magnetic aria-label="Open terminal">
				⌘K
			</button>
		</div>
	</header>

	<div class="name-zone">
		<h1 aria-label="{profile.name} — {profile.role}">
			<span class="mask"
				><span class="line l1" aria-hidden="true"
					>{#each LINE1.split('') as ch, i (i)}<b use:physicsBody>{ch}</b>{/each}</span
				></span
			>
			<span class="mask"
				><span class="line l2" aria-hidden="true"
					><i class="block" use:physicsBody></i>{#each LINE2A.split('') as ch, i (i)}<b
							use:physicsBody>{ch}</b
						>{/each}<span class="sp"></span>{#each LINE2B.split('') as ch, i (i)}<b
							class="outlined"
							use:physicsBody>{ch}</b
						>{/each}</span
				></span
			>
		</h1>

		<aside class="meta v-mono">
			<div class="row"><span>ROLE</span><span>{profile.role.toUpperCase()}</span></div>
			<div class="row"><span>STACK</span><span>LLMS · PYTHON · SVELTE · NODE</span></div>
			<div class="row">
				<span>STATUS</span><span><i class="dot" aria-hidden="true"></i> OPEN TO WORK</span>
			</div>
			<div class="row">
				<span>TERMINAL</span><span><span class="fine">PRESS ⌘K</span><span class="coarse"
						>TAP ⌘K, BOTTOM RIGHT</span
					></span>
			</div>
			{#if quip}
				{#key quip}
					<p class="drag-hint">{quip}</p>
				{/key}
			{/if}
		</aside>

		<p class="receipt v-mono-s">
			{loadedLine}<br />{jsLine}
		</p>

		<p class="scroll-cue v-mono-s" aria-hidden="true">SCROLL ↓</p>
	</div>

	<div class="strip rule-top">
		<Marquee text={marqueeText.toUpperCase()} alternate />
	</div>
</section>

<style>
	.hero {
		min-height: 100svh;
		display: grid;
		/* minmax(0,1fr): the marquee's max-content width must not
		   inflate the grid — it once stretched the hero to 10,000px+ */
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: auto 1fr auto;
		overflow: clip;
	}

	/* ── masthead ── */
	.masthead {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.9rem 2vw;
		border-bottom: 1px solid var(--ink);
		gap: 1rem;
	}

	.masthead-right {
		display: flex;
		align-items: center;
	}

	.masthead-right > * {
		padding-inline: 1rem;
		border-left: 1px solid var(--ink);
	}

	.masthead-right > :first-child {
		border-left: 0;
	}

	.masthead-right a:hover,
	.masthead-right button:hover {
		color: var(--signal);
	}

	.chip {
		border: 1px solid var(--ink) !important;
		border-radius: 2px;
		padding: 0.2rem 0.6rem !important;
		margin-left: 1rem;
	}

	/* ── name zone ── */
	.name-zone {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 4rem 2vw 5rem;
	}

	h1 {
		font-variation-settings: 'wght' 850, 'wdth' 125;
		text-transform: uppercase;
		font-size: clamp(44px, 12.5vw, 230px);
		line-height: 0.86;
		letter-spacing: -0.03em;
	}

	.mask {
		display: block;
		overflow: clip;
	}

	.played .mask,
	:global(html.skip-intro) .mask {
		overflow: visible;
	}

	/* Intro choreography is pure CSS — it starts at first paint, runs with
	   JS disabled, and html.skip-intro (inline head script / interaction)
	   cuts straight to the end state. */
	.line {
		display: block;
		animation: line-rise 0.6s var(--ease-expo) both;
		animation-delay: 80ms;
	}

	.mask:nth-child(2) .line {
		animation-delay: 160ms;
	}

	@keyframes line-rise {
		from {
			transform: translateY(110%);
		}
	}

	:global(html.skip-intro) .line {
		animation: none;
	}

	.l2 {
		padding-left: 0.55em; /* the staircase */
		position: relative;
	}

	b,
	.line i.block {
		display: inline-block;
		font-style: normal;
		font-weight: inherit;
	}

	b.outlined {
		-webkit-text-stroke-color: var(--ink);
	}

	.sp {
		display: inline-block;
		width: 0.18em;
	}

	.block {
		position: absolute;
		left: 0.3em;
		top: -0.08em;
		width: 14vw;
		height: 0.8em;
		background: var(--signal);
		z-index: -1;
		transform-origin: bottom;
		animation: block-in 0.5s var(--ease-expo) 160ms both;
	}

	@keyframes block-in {
		from {
			scale: 1 0;
		}
	}

	:global(html.skip-intro) .block {
		animation: none;
	}

	/* ── meta block ── */
	.meta {
		position: absolute;
		top: 1.5rem;
		right: 2vw;
		min-width: min(340px, 40vw);
		animation: meta-in 0.2s ease 0.4s both;
	}

	@keyframes meta-in {
		from {
			opacity: 0;
		}
	}

	:global(html.skip-intro) .meta {
		animation: none;
	}

	.meta .row {
		display: flex;
		justify-content: space-between;
		gap: 2rem;
		border-top: 1px solid var(--ink);
		padding-block: 0.35rem;
	}

	.meta .row:last-of-type {
		border-bottom: 1px solid var(--ink);
	}

	.coarse {
		display: none;
	}

	@media (pointer: coarse) {
		.fine {
			display: none;
		}
		.coarse {
			display: inline;
		}
	}

	.dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--signal);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		50% {
			opacity: 0.35;
		}
	}

	.drag-hint {
		margin-top: 0.75rem;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.05em;
		color: var(--signal);
		animation: quip-in 0.3s var(--ease-expo) both;
	}

	@keyframes quip-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	/* ── receipt + cue ── */
	.receipt {
		position: absolute;
		bottom: 1.25rem;
		left: 2vw;
		background: var(--paper);
		padding: 0.35rem 0.6rem 0.35rem 0;
		z-index: 1;
	}

	.scroll-cue {
		position: absolute;
		bottom: 3.5rem;
		right: 1rem;
		writing-mode: vertical-rl;
	}

	/* ── marquee strip ── */
	.strip {
		border-bottom: 1px solid var(--ink);
	}

	@media (max-width: 768px) {
		.masthead {
			flex-wrap: wrap;
			row-gap: 0.4rem;
		}

		.meta {
			position: static;
			min-width: 0;
			margin-top: 2.5rem;
		}

		.name-zone {
			padding-top: 2.5rem;
			padding-bottom: 6rem;
		}

		.block {
			width: 22vw;
		}

		.scroll-cue {
			display: none;
		}
	}
</style>

<script lang="ts">
	import { profile, features, applications, maxRatings } from '$lib/data';
	import { ui } from '$lib/ui.svelte';
	import { physicsBody, onHeadlineGrab } from '$lib/actions/physics';

	// Prerendered fallback copy is replaced by the real on-device measurement.
	let loaded = $state('0.2s (prerendered)');
	// undocumented: the part number is grabbable. The quips only exist
	// for visitors who discover that on their own.
	let quip = $state('');

	const PART = 'MITANSHU-21';

	onHeadlineGrab((n) => {
		if (n === 2) quip = 'NOTE: PART IS RATED FOR ROUGH HANDLING.';
		else if (n === 5) quip = 'CAREFUL — I KERNED THAT BY HAND.';
		else if (n === 9) quip = 'WARNING: THE LETTERS HAVE FEELINGS.';
		else if (n === 13) {
			quip = 'FINE. YOU WIN.';
			console.log('%c[qa] visitor reclassified as: drop-test engineer', 'color:#0533ff');
			ui.greeting = 'ok, you clearly like breaking things. let’s talk — type `help`.';
			ui.terminal = true;
		} else if (n === 20) quip = 'THE PART NUMBER HAS FILED A COMPLAINT.';
	});

	$effect(() => {
		requestAnimationFrame(() => {
			const s = performance.now() / 1000;
			if (s > 0 && s < 30) loaded = `${s.toFixed(2)}s — measured on your device`;
		});
	});
</script>

<header class="cover" id="top" data-section="COVER — MITANSHU-21">
	<div class="masthead">
		<p class="v-mono-s brand"><b>PATEL</b> SEMICONDUCTOR OF ONE</p>
		<p class="v-mono-s center">PRODUCT DATA SHEET</p>
		<div class="right v-mono-s">
			<a href="mailto:{profile.email}">{profile.email.toUpperCase()}</a>
			<button onclick={() => (ui.index = true)}>CONTENTS</button>
		</div>
	</div>

	<div class="part-row">
		<div class="part-cell">
			<h1 aria-label="{profile.part} — {profile.name}, {profile.role}">
				<span class="part v-display" aria-hidden="true"
					>{#each PART.split('') as ch, i (i)}<b use:physicsBody class:blue={ch === '-'}
							>{ch}</b
						>{/each}</span
				>
			</h1>
			<p class="sub v-mono">{profile.name.toUpperCase()} · {profile.role.toUpperCase()}</p>
			{#if quip}
				{#key quip}
					<p class="quip v-mono-s">{quip}</p>
				{/key}
			{/if}
		</div>

		<div class="status-cell v-mono-s">
			<p><span class="dot" aria-hidden="true"></span> {profile.availabilityNote.toUpperCase()}</p>
			<p class="dim">EST. {profile.est} · REV 4.0</p>
			<p class="dim">PAGE RENDER: {loaded.toUpperCase()}</p>
			<p class="dim">CONSOLE: ⌘K</p>
		</div>
	</div>

	<p class="desc v-body">{profile.shortDesc}</p>

	<div class="cols rule-top">
		<div class="col">
			<p class="v-label">FEATURES</p>
			<ul class="v-mono">
				{#each features as f (f)}
					<li><span class="bullet" aria-hidden="true">●</span>{f}</li>
				{/each}
			</ul>
		</div>
		<div class="col rule-left">
			<p class="v-label">APPLICATIONS</p>
			<ul class="v-mono">
				{#each applications as a (a)}
					<li><span class="bullet" aria-hidden="true">●</span>{a}</li>
				{/each}
			</ul>
			<p class="v-label ratings-label">ABSOLUTE MAXIMUM RATINGS ¹</p>
			<table class="ds-table">
				<tbody>
					{#each maxRatings as r (r.symbol)}
						<tr>
							<td>{r.param}</td>
							<td class="sym">{r.symbol}</td>
							<td class="num">{r.value}</td>
							<td>{r.unit}</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="footnote v-mono-s">¹ EXCEEDING THESE RATINGS MAY IMPAIR RELIABILITY.</p>
		</div>
	</div>
</header>

<style>
	.cover {
		border-top: 1.5px solid var(--line);
	}

	/* ── masthead ── */
	.masthead {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 1rem;
		align-items: baseline;
		padding: 0.7rem 1.25rem;
		border-bottom: 1.5px solid var(--line);
	}

	.brand b {
		color: var(--signal);
	}

	.center {
		text-align: center;
	}

	.right {
		display: flex;
		justify-content: flex-end;
		gap: 1.5rem;
	}

	.right a:hover,
	.right button:hover {
		color: var(--signal);
	}

	/* ── part number ── */
	.part-row {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 2rem;
		align-items: end;
		padding: 2.5rem 1.25rem 1.5rem;
	}

	.part {
		display: block;
		font-size: clamp(34px, 7.2vw, 100px);
		white-space: nowrap;
	}

	.part b {
		display: inline-block;
		font-style: normal;
		font-weight: inherit;
	}

	.part b.blue {
		color: var(--signal);
	}

	.sub {
		margin-top: 0.75rem;
	}

	.quip {
		margin-top: 0.5rem;
		color: var(--signal);
		animation: quip-in 0.3s var(--ease-expo) both;
	}

	@keyframes quip-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	.status-cell {
		text-align: right;
		line-height: 2;
		border: 1px solid var(--line);
		padding: 0.6rem 0.9rem;
	}

	.status-cell .dim {
		opacity: 0.55;
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

	.desc {
		padding: 0 1.25rem 1.5rem;
		max-width: 72ch;
	}

	/* ── features / applications ── */
	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.col {
		padding: 1.1rem 1.25rem 1.5rem;
	}

	.rule-left {
		border-left: 1.5px solid var(--line);
	}

	ul {
		list-style: none;
		margin-top: 0.6rem;
	}

	li {
		display: flex;
		gap: 0.6rem;
		padding-block: 0.2rem;
	}

	.bullet {
		color: var(--signal);
		font-size: 8px;
		line-height: 2.6;
	}

	.ratings-label {
		display: block;
		margin-top: 1.5rem;
		margin-bottom: 0.6rem;
	}

	.sym {
		color: var(--signal);
	}

	.num {
		text-align: right;
		font-weight: 700;
	}

	.footnote {
		margin-top: 0.5rem;
		opacity: 0.5;
	}

	@media (max-width: 768px) {
		.masthead {
			grid-template-columns: 1fr;
			gap: 0.2rem;
		}
		.center,
		.right {
			text-align: left;
			justify-content: flex-start;
		}
		.part-row {
			grid-template-columns: 1fr;
			align-items: start;
			gap: 1.25rem;
		}
		.status-cell {
			text-align: left;
		}
		.cols {
			grid-template-columns: 1fr;
		}
		.rule-left {
			border-left: 0;
			border-top: 1.5px solid var(--line);
		}
	}
</style>

<script lang="ts">
	import { profile, revisions } from '$lib/data';

	// Keep in sync with the measured build output (gzipped JS total).
	const JS_KB = 49; // rated absolute maximum: 50 (see cover) — still in spec
</script>

<footer class="rule-top">
	<div class="sec-bar">
		<h2>REVISION HISTORY</h2>
		<span class="note">THIS DOCUMENT IS ITS OWN CHANGELOG</span>
	</div>

	<div class="wrap">
		<table class="ds-table">
			<thead>
				<tr><th>REV</th><th>DATE</th><th>CHANGE</th></tr>
			</thead>
			<tbody>
				{#each revisions as r (r.rev)}
					<tr>
						<td class="rev">{r.rev}</td>
						<td class="date">{r.date}</td>
						<td class="chg">{r.change}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="pkg v-mono-s">
			<p class="v-label">PACKAGE INFORMATION</p>
			<p>JS SHIPPED — {JS_KB} KB GZIP · FONTS — 2 FAMILIES, SELF-HOSTED · TRACKING — NONE</p>
			<p>NEURAL NETS — HAND-ROLLED, 0 LIBRARIES · LIGHTHOUSE — GO ON, RUN IT</p>
			<p class="dim">BUILD {__BUILD_SHA__} · SVELTE 5 · GITHUB PAGES · © {new Date().getFullYear()} {profile.name.toUpperCase()} — SET IN ARCHIVO & JETBRAINS MONO</p>
		</div>

		<div class="barcode" aria-hidden="true"></div>
	</div>
</footer>

<style>
	.wrap {
		padding: 1.5rem 1.25rem 2rem;
	}

	.rev {
		color: var(--signal);
		font-weight: 700;
		width: 4rem;
	}

	.date {
		white-space: nowrap;
		width: 6.5rem;
	}

	.chg {
		font-family: var(--font-body);
		font-size: 14px;
	}

	.pkg {
		margin-top: 1.5rem;
		line-height: 2;
	}

	.pkg .v-label {
		display: block;
		margin-bottom: 0.3rem;
	}

	.dim {
		opacity: 0.5;
	}

	.barcode {
		margin-top: 1.5rem;
		height: 34px;
		width: min(280px, 60vw);
		background: repeating-linear-gradient(
			90deg,
			var(--ink) 0 2px,
			transparent 2px 5px,
			var(--ink) 5px 9px,
			transparent 9px 11px,
			var(--ink) 11px 12px,
			transparent 12px 16px
		);
	}
</style>

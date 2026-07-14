<script lang="ts">
	import { rise } from '$lib/actions/rise';

	const inputs = ['COFFEE_IN', 'REQUIREMENTS', 'VAGUE_FEEDBACK', 'DEADLINE_CLK'];
	const outputs = ['SHIPPED_PRODUCT', 'CLEAN_API', 'COMMITS', 'DRY_HUMOR'];
</script>

<section class="rule-top" id="diagram" data-section="§2 — BLOCK DIAGRAM">
	<div class="sec-bar">
		<h2>2. BLOCK DIAGRAM</h2>
		<span class="note">FUNCTIONAL · NOT TO SCALE</span>
	</div>

	<figure use:rise>
		<svg
			viewBox="0 0 880 380"
			role="img"
			aria-label="Functional block diagram: coffee, requirements, vague feedback and deadlines flow into the MITANSHU-21 core — frontend unit, API unit, neural coprocessor and caffeine regulator — which outputs shipped product, clean APIs, commits and dry humor."
		>
			<!-- input pins -->
			{#each inputs as pin, i (pin)}
				<g class="mono">
					<text x="8" y={78 + i * 60} class="pin-label">{pin}</text>
					<line x1="150" y1={74 + i * 60} x2="240" y2={74 + i * 60} class="wire" />
					<circle cx="240" cy={74 + i * 60} r="3.5" class="node" />
				</g>
			{/each}

			<!-- core package -->
			<rect x="240" y="30" width="400" height="320" class="core" />
			<text x="440" y="60" text-anchor="middle" class="core-title">MITANSHU-21 CORE</text>

			<rect x="270" y="85" width="160" height="70" class="unit" />
			<text x="350" y="115" text-anchor="middle" class="unit-label">FRONTEND UNIT</text>
			<text x="350" y="133" text-anchor="middle" class="unit-sub">SVELTE / REACT</text>

			<rect x="450" y="85" width="160" height="70" class="unit" />
			<text x="530" y="115" text-anchor="middle" class="unit-label">API UNIT</text>
			<text x="530" y="133" text-anchor="middle" class="unit-sub">NODE / PYTHON</text>

			<rect x="270" y="185" width="160" height="70" class="unit accent" />
			<text x="350" y="215" text-anchor="middle" class="unit-label accent-t">NEURAL</text>
			<text x="350" y="233" text-anchor="middle" class="unit-label accent-t">COPROCESSOR ²</text>

			<rect x="450" y="185" width="160" height="70" class="unit" />
			<text x="530" y="215" text-anchor="middle" class="unit-label">CAFFEINE</text>
			<text x="530" y="233" text-anchor="middle" class="unit-sub">REGULATOR</text>

			<rect x="270" y="285" width="340" height="40" class="unit" />
			<text x="440" y="310" text-anchor="middle" class="unit-sub">SHARED PERFECTIONISM BUS</text>

			<!-- internal wires -->
			<line x1="350" y1="155" x2="350" y2="185" class="wire" />
			<line x1="530" y1="155" x2="530" y2="185" class="wire" />
			<line x1="350" y1="255" x2="350" y2="285" class="wire" />
			<line x1="530" y1="255" x2="530" y2="285" class="wire" />
			<line x1="430" y1="120" x2="450" y2="120" class="wire" />

			<!-- output pins -->
			{#each outputs as pin, i (pin)}
				<g class="mono">
					<circle cx="640" cy={74 + i * 60} r="3.5" class="node" />
					<line x1="640" y1={74 + i * 60} x2="730" y2={74 + i * 60} class="wire" />
					<text x="738" y={78 + i * 60} class="pin-label">{pin}</text>
				</g>
			{/each}
		</svg>
		<figcaption class="fig-cap">
			<b>Figure 2-1.</b> Functional block diagram. The neural coprocessor is real — see §4 for
			live characteristic curves. ² Backprop implemented by hand.
		</figcaption>
	</figure>
</section>

<style>
	figure {
		padding: 1.5rem 1.25rem 1.75rem;
	}

	svg {
		width: 100%;
		height: auto;
	}

	.wire {
		stroke: var(--ink);
		stroke-width: 1.5;
	}

	.node {
		fill: var(--signal);
	}

	.core {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2;
	}

	.unit {
		fill: rgba(5, 51, 255, 0.04);
		stroke: var(--ink);
		stroke-width: 1.2;
	}

	.unit.accent {
		fill: rgba(5, 51, 255, 0.12);
		stroke: var(--signal);
		stroke-width: 2;
	}

	text {
		font-family: var(--font-mono);
		fill: var(--ink);
	}

	.pin-label {
		font-size: 13px;
		letter-spacing: 0.05em;
	}

	.core-title {
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.12em;
	}

	.unit-label {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.unit-sub {
		font-size: 11px;
		opacity: 0.6;
		letter-spacing: 0.08em;
	}

	.accent-t {
		fill: var(--signal);
	}
</style>

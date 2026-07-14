<script lang="ts">
	import { profile } from '$lib/data';
	import { rise } from '$lib/actions/rise';

	let copied = $state(false);

	async function copyEmail(e: MouseEvent) {
		// left-click copies; the anchor still carries the real mailto for
		// right-click / long-press / keyboard.
		e.preventDefault();
		try {
			await navigator.clipboard.writeText(profile.email);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			location.href = `mailto:${profile.email}`;
		}
	}
</script>

<section class="rule-top" id="contact" data-section="§6 — APPLICATION CIRCUIT">
	<div class="sec-bar">
		<h2>6. TYPICAL APPLICATION CIRCUIT</h2>
		<span class="note">RECOMMENDED WIRING</span>
	</div>

	<figure use:rise>
		<svg
			viewBox="0 0 880 130"
			role="img"
			aria-label="Application circuit: your problem, wired into MITANSHU-21, outputs shipped software."
		>
			<rect x="10" y="35" width="200" height="60" class="unit" />
			<text x="110" y="70" text-anchor="middle" class="lbl">YOUR PROBLEM</text>
			<line x1="210" y1="65" x2="330" y2="65" class="wire" />
			<circle cx="330" cy="65" r="3.5" class="node" />
			<rect x="330" y="20" width="220" height="90" class="core" />
			<text x="440" y="60" text-anchor="middle" class="lbl core-lbl">MITANSHU-21</text>
			<text x="440" y="82" text-anchor="middle" class="sub">THIS DATASHEET</text>
			<circle cx="550" cy="65" r="3.5" class="node" />
			<line x1="550" y1="65" x2="670" y2="65" class="wire" />
			<rect x="670" y="35" width="200" height="60" class="unit shipped" />
			<text x="770" y="70" text-anchor="middle" class="lbl shipped-lbl">SHIPPED ✓</text>
		</svg>
		<figcaption class="fig-cap">
			<b>Figure 6-1.</b> No external components required. Connect via any channel below.
		</figcaption>
	</figure>

	<div class="connect" use:rise={{ delay: 80 }}>
		<p class="v-label">ORDERING INFORMATION</p>
		<a class="email" href="mailto:{profile.email}" onclick={copyEmail} aria-live="polite">
			{copied ? 'COPIED — NOW WRITE ME.' : profile.email.toUpperCase()}
		</a>
		<table class="ds-table">
			<tbody>
				<tr>
					<td class="ch">EMAIL</td>
					<td
						><a class="lnk" href="mailto:{profile.email}" onclick={copyEmail}
							>{profile.email} — click to copy</a
						></td
					>
				</tr>
				<tr>
					<td class="ch">GITHUB</td>
					<td
						><a class="lnk" href={profile.github} target="_blank" rel="noopener noreferrer"
							>{profile.githubHandle} ↗</a
						></td
					>
				</tr>
				{#if profile.linkedin}
					<tr>
						<td class="ch">LINKEDIN</td>
						<td
							><a class="lnk" href={profile.linkedin} target="_blank" rel="noopener noreferrer"
								>PROFILE ↗</a
							></td
						>
					</tr>
				{/if}
				<tr>
					<td class="ch">CONSOLE</td>
					<td>PRESS ⌘K, THEN TRY <b>`SUDO HIRE MITANSHU`</b></td>
				</tr>
			</tbody>
		</table>
	</div>
</section>

<style>
	figure {
		padding: 1.5rem 1.25rem 0.5rem;
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

	.unit {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.2;
	}

	.unit.shipped {
		fill: rgba(5, 51, 255, 0.08);
		stroke: var(--signal);
		stroke-width: 2;
	}

	.core {
		fill: var(--ink);
	}

	text {
		font-family: var(--font-mono);
		fill: var(--ink);
	}

	.lbl {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.core-lbl {
		fill: var(--paper);
	}

	.sub {
		font-size: 10px;
		fill: var(--paper);
		opacity: 0.6;
		letter-spacing: 0.1em;
	}

	.shipped-lbl {
		fill: var(--signal);
	}

	.connect {
		padding: 1rem 1.25rem 2rem;
	}

	.email {
		display: inline-block;
		font-variation-settings: 'wght' 850, 'wdth' 118;
		text-transform: uppercase;
		font-size: clamp(20px, 4.6vw, 72px);
		line-height: 1.05;
		letter-spacing: -0.01em;
		margin: 0.75rem 0 1.25rem;
		border-bottom: 3px solid var(--ink);
		transition:
			color 0.15s ease,
			border-color 0.15s ease,
			background 0.2s ease;
	}

	.email:hover {
		color: var(--signal);
		border-color: var(--signal);
	}

	.email:active {
		background: rgba(5, 51, 255, 0.1);
	}

	.ch {
		color: var(--signal);
		font-weight: 700;
		width: 9rem;
	}

	.lnk {
		border-bottom: 1px solid var(--ink);
	}

	.lnk:hover {
		color: var(--signal);
		border-color: var(--signal);
	}
</style>

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

<section class="rule-top" id="contact" data-numeral data-section="06 / 06 — CONTACT">
	<span class="numeral right" aria-hidden="true">06</span>
	<h2 class="sr-only">Contact</h2>

	<div class="head broadsheet" use:rise>
		<p class="section-label">06 — Contact</p>
		<p class="note v-mono-s">INBOX OPEN · REPLIES FAST</p>
	</div>

	<div class="inner">
		<p class="kicker v-mono" use:rise>HAVE SOMETHING THAT NEEDS TO FEEL INSTANT?</p>

		<a
			class="email v-display"
			use:rise={{ delay: 80 }}
			class:copied
			href="mailto:{profile.email}"
			onclick={copyEmail}
			aria-live="polite"
		>
			{copied ? 'COPIED — NOW WRITE ME.' : profile.email.toUpperCase()}
		</a>

		<div class="table" use:rise={{ delay: 150 }}>
			<p class="row v-mono">
				<span>GITHUB</span>
				<a href={profile.github} target="_blank" rel="noopener noreferrer"
					>{profile.githubHandle} ↗</a
				>
			</p>
			{#if profile.linkedin}
				<p class="row v-mono">
					<span>LINKEDIN</span>
					<a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>
				</p>
			{/if}
			<p class="row v-mono">
				<span>TERMINAL</span>
				<span>TRY `SUDO HIRE MITANSHU`</span>
			</p>
		</div>
	</div>
</section>

<style>
	.head {
		position: relative;
		z-index: 1;
		align-items: baseline;
		margin-bottom: 1rem;
	}

	.head .section-label {
		grid-column: 1 / 8;
	}

	.note {
		grid-column: 8 / 13;
		text-align: right;
		opacity: 0.6;
	}

	section {
		min-height: 70svh;
		display: grid;
		align-content: center;
		padding-block: clamp(6rem, 14vh, 12rem);
	}

	.inner {
		position: relative;
		z-index: 1;
		padding-inline: 2vw;
	}

	.kicker {
		margin-bottom: 2rem;
	}

	.email {
		display: inline-block;
		font-size: clamp(21px, 5.2vw, 105px);
		border-bottom: 4px solid var(--ink);
		padding-bottom: 0.05em;
		transition:
			background 0.25s ease,
			color 0.15s ease;
	}

	.email:hover {
		color: var(--signal);
		border-color: var(--signal);
	}

	.email.copied {
		background: var(--signal);
		color: var(--ink);
		border-color: var(--ink);
	}

	.table {
		margin-top: 4rem;
		max-width: 660px;
	}

	.row {
		display: flex;
		justify-content: space-between;
		gap: 2rem;
		border-top: 1px solid var(--ink);
		padding-block: 0.5rem;
	}

	.row:last-child {
		border-bottom: 1px solid var(--ink);
	}

	.row a:hover {
		color: var(--signal);
	}
</style>

<script lang="ts">
	import { experience } from '$lib/data';
	import { rise } from '$lib/actions/rise';
</script>

<section class="rule-top" id="experience" data-numeral data-section="03 / 06 — EXPERIENCE">
	<span class="numeral right" aria-hidden="true">03</span>
	<h2 class="sr-only">Experience</h2>

	{#each experience as job (job.company + job.period)}
		<article class="row rule-top broadsheet" use:rise>
			<p class="period v-mono-s">{job.period.toUpperCase()}</p>
			<div class="role-cell">
				<h3 class="v-display">
					{job.role.toUpperCase()} — <span class="outlined">{job.company.toUpperCase()}</span>
				</h3>
				<p class="highlights v-mono-s">{job.highlights.join(' / ').toUpperCase()}</p>
			</div>
			<div class="side">
				<p class="v-body summary">{job.summary}</p>
				<p class="status v-mono-s" class:running={job.current}>
					{#if job.current}<i class="dot" aria-hidden="true"></i> RUNNING{:else}EXITED 0{/if}
				</p>
			</div>
		</article>
	{/each}
</section>

<style>
	section {
		padding-top: clamp(6rem, 14vh, 12rem);
	}

	.row {
		grid-template-rows: auto;
		align-items: start;
		padding-block: 2.5rem;
		position: relative;
		z-index: 1;
		transition:
			background 0.15s ease,
			color 0.15s ease;
	}

	.row:hover {
		background: var(--ink);
		color: var(--paper);
	}

	.row:hover .outlined {
		-webkit-text-stroke-color: var(--paper);
	}

	.period {
		grid-column: 1 / 3;
		padding-top: 0.5rem;
	}

	.role-cell {
		grid-column: 3 / 10;
	}

	h3 {
		font-size: clamp(32px, 5vw, 88px);
	}

	.highlights {
		margin-top: 1rem;
		opacity: 0.7;
	}

	.side {
		grid-column: 10 / 13;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.summary {
		font-size: 14px;
	}

	.status {
		text-align: right;
		opacity: 0.45;
	}

	.status.running {
		opacity: 1;
	}

	.dot {
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--signal);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		50% {
			opacity: 0.35;
		}
	}

	@media (max-width: 768px) {
		.period,
		.role-cell,
		.side {
			grid-column: 1 / -1;
		}
		.side {
			margin-top: 1rem;
		}
		.status {
			text-align: left;
		}
	}
</style>

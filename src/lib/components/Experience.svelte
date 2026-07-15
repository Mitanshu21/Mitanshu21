<script lang="ts">
	import { experience } from '$lib/data';
	import { rise } from '$lib/actions/rise';
</script>

<section class="rule-top" id="experience" data-numeral data-section="04 / 06 — EXPERIENCE">
	<span class="numeral right" aria-hidden="true">04</span>
	<h2 class="sr-only">Experience</h2>

	<div class="head broadsheet" use:rise>
		<p class="section-label">04 — Experience</p>
		<p class="note v-mono-s">DEPLOYMENT RECORD · NO UNPLANNED DOWNTIME</p>
	</div>

	<ol class="jobs">
		{#each experience as job, i (job.company + job.period)}
			<li class="broadsheet" class:current={job.current} use:rise={{ delay: (i % 3) * 80 }}>
				<div class="when-cell">
					<p class="period v-mono">{job.period.toUpperCase()}</p>
					<p class="status v-mono-s">
						{#if job.current}<span class="dot" aria-hidden="true"></span> RUNNING{:else}EXITED
							0{/if}
					</p>
				</div>
				<div class="body-cell">
					<h3 class="v-display">
						{job.role.toUpperCase()} <span class="at">·</span>
						{job.company.toUpperCase()}
					</h3>
					<p class="summary v-body">{job.summary}</p>
					<p class="stack v-mono-s">
						STACK:
						{#each job.highlights as tag (tag)}
							<span class="chip">{tag.toUpperCase()}</span>
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

	.jobs {
		list-style: none;
		position: relative;
		z-index: 1;
	}

	li {
		padding-block: 2.25rem;
		border-top: 1px solid var(--line);
	}

	.when-cell {
		grid-column: 1 / 4;
	}

	.period {
		font-weight: 700;
		color: var(--signal);
	}

	.status {
		margin-top: 0.3rem;
		opacity: 0.55;
	}

	li.current .status {
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

	.body-cell {
		grid-column: 4 / 12;
	}

	h3 {
		font-size: clamp(26px, 3.6vw, 56px);
		margin-bottom: 0.75rem;
	}

	.at {
		color: var(--signal);
	}

	.summary {
		max-width: 58ch;
		color: color-mix(in srgb, var(--ink) 78%, transparent);
		margin-bottom: 1rem;
	}

	.stack {
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
		.when-cell {
			grid-column: 1 / -1;
			display: flex;
			gap: 1rem;
			align-items: baseline;
		}
		.body-cell {
			grid-column: 1 / -1;
			margin-top: 0.5rem;
		}
	}
</style>

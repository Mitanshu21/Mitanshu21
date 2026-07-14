<script lang="ts">
	import { experience } from '$lib/data';
	import { rise } from '$lib/actions/rise';
</script>

<section class="rule-top" id="experience" data-section="§5 — OPERATING HISTORY">
	<div class="sec-bar">
		<h2>5. OPERATING HISTORY</h2>
		<span class="note">FIELD RECORD · CONTINUOUS DUTY</span>
	</div>

	<div class="wrap" use:rise>
		<table class="ds-table">
			<thead>
				<tr>
					<th>PERIOD</th>
					<th>DEPLOYMENT</th>
					<th>NOTES</th>
					<th class="st">STATUS</th>
				</tr>
			</thead>
			<tbody>
				{#each experience as job (job.company + job.period)}
					<tr>
						<td class="period">{job.period.toUpperCase()}</td>
						<td>
							<b>{job.role.toUpperCase()}</b><br />
							<span class="co">{job.company.toUpperCase()}</span><br />
							<span class="hl">{job.highlights.join(' / ').toUpperCase()}</span>
						</td>
						<td class="notes">{job.summary}</td>
						<td class="st">
							{#if job.current}<span class="dot" aria-hidden="true"></span> IN OPERATION{:else}<span
									class="ret">RETIRED</span
								>{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<p class="fig-cap"><b>Table 5-1.</b> No unplanned downtime on record.</p>
	</div>
</section>

<style>
	.wrap {
		padding: 1.5rem 1.25rem 1.75rem;
	}

	.period {
		white-space: nowrap;
		color: var(--signal);
		font-weight: 700;
	}

	.co {
		opacity: 0.65;
	}

	.hl {
		font-size: 11px;
		opacity: 0.5;
	}

	.notes {
		font-family: var(--font-body);
		font-size: 14px;
		max-width: 44ch;
	}

	.st {
		white-space: nowrap;
		text-align: right;
		font-weight: 700;
	}

	.ret {
		opacity: 0.45;
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
		.notes {
			display: none;
		}
	}
</style>

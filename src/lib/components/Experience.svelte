<script lang="ts">
	import { experience } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';
</script>

<section class="section" id="experience">
	<div class="container">
		<p class="section-label" use:reveal>02 — Experience</p>

		<ol>
			{#each experience as job, i (job.company + job.period)}
				<li use:reveal={{ delay: i * 100 }}>
					<div class="period">{job.period}</div>
					<div>
						<h3>{job.role} <span class="at">·</span> {job.company}</h3>
						<p>{job.summary}</p>
						<ul class="tags">
							{#each job.highlights as tag (tag)}
								<li>{tag}</li>
							{/each}
						</ul>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	ol {
		list-style: none;
		display: flex;
		flex-direction: column;
	}

	ol > li {
		display: grid;
		grid-template-columns: 180px 1fr;
		gap: 1.5rem;
		padding: 2rem 0;
		border-bottom: 1px solid var(--line);
	}

	ol > li:first-child {
		padding-top: 0;
	}

	ol > li:last-child {
		border-bottom: none;
	}

	.period {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.05em;
		color: var(--faint);
		padding-top: 0.35rem;
	}

	h3 {
		font-size: 1.15rem;
		margin-bottom: 0.5rem;
	}

	.at {
		color: var(--accent);
	}

	p {
		color: var(--muted);
		max-width: 60ch;
		margin-bottom: 0.9rem;
	}

	.tags {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tags li {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.05em;
		color: var(--muted);
		border: 1px solid var(--line);
		border-radius: 99px;
		padding: 0.2rem 0.7rem;
		background: rgba(255, 255, 255, 0.02);
	}

	@media (max-width: 640px) {
		ol > li {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
	}
</style>

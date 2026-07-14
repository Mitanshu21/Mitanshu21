<script lang="ts">
	import { projects } from '$lib/data';
	import { rise } from '$lib/actions/rise';

	let open = $state(0); // first benchmark ships expanded
</script>

<section class="rule-top" id="work" data-section="§3 — BENCHMARKS">
	<div class="sec-bar">
		<h2>3. BENCHMARKS</h2>
		<span class="note">{String(projects.length).padStart(2, '0')} PARTS SHIPPED · METRICS FROM THE FIELD</span>
	</div>

	<div class="wrap" use:rise>
		<table class="ds-table">
			<thead>
				<tr>
					<th class="idx">#</th>
					<th>BENCHMARK</th>
					<th>STACK</th>
					<th class="result">RESULT</th>
				</tr>
			</thead>
			{#each projects as project, i (project.repo)}
				<tbody class:open={open === i}>
					<tr>
						<td class="idx">{String(i + 1).padStart(2, '0')}</td>
						<td class="title-cell">
							<button
								aria-expanded={open === i}
								aria-controls="bench-{i}"
								onclick={() => (open = open === i ? -1 : i)}
							>
								<span class="glyph" aria-hidden="true">{open === i ? '▾' : '▸'}</span>
								{project.title.toUpperCase()}
							</button>
						</td>
						<td class="stack">{project.tech.join(' / ').toUpperCase()}</td>
						<td class="result">
							{#if project.stars > 0}★ {project.stars}{:else}PASS{/if}
						</td>
					</tr>
					<tr class="detail" id="bench-{i}" inert={open !== i}>
						<td></td>
						<td colspan="3">
							<p class="v-body">{project.description}</p>
							<p class="links v-mono-s">
								<a href={project.github} target="_blank" rel="noopener noreferrer">GITHUB ↗</a>
								{#if project.live}
									<a href={project.live} target="_blank" rel="noopener noreferrer">LIVE DEMO ↗</a>
								{/if}
							</p>
						</td>
					</tr>
				</tbody>
			{/each}
		</table>
		<p class="fig-cap">
			<b>Table 3-1.</b> Shipped parts, public and open source. Click a row for test notes.
		</p>
	</div>
</section>

<style>
	.wrap {
		padding: 1.5rem 1.25rem 1.75rem;
	}

	.idx {
		width: 3.5rem;
		color: var(--signal);
	}

	.result {
		text-align: right;
		white-space: nowrap;
		font-weight: 700;
	}

	.title-cell button {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.05em;
		display: flex;
		gap: 0.6rem;
		width: 100%;
		text-align: left;
	}

	.title-cell button:hover {
		color: var(--signal);
	}

	.glyph {
		color: var(--signal);
	}

	.stack {
		opacity: 0.65;
		white-space: nowrap;
	}

	tbody.open td {
		background: rgba(5, 51, 255, 0.045);
	}

	.detail {
		display: none;
	}

	tbody.open .detail {
		display: table-row;
	}

	.detail p.v-body {
		padding-block: 0.35rem;
		font-family: var(--font-body);
	}

	.links {
		display: flex;
		gap: 2rem;
		padding-block: 0.35rem;
	}

	.links a {
		color: var(--signal);
		font-weight: 700;
		border-bottom: 1px solid var(--signal);
		padding-bottom: 1px;
	}

	.links a:hover {
		color: var(--ink);
		border-color: var(--ink);
	}

	@media (max-width: 768px) {
		.stack {
			display: none;
		}
	}
</style>

<script lang="ts">
	import { projects, profile } from '$lib/data';
	import { rise } from '$lib/actions/rise';
</script>

<section class="ink rule-top" id="work" data-numeral data-section="05 / 06 — WORK">
	<span class="numeral filled left" aria-hidden="true">05</span>

	<div class="head broadsheet" use:rise>
		<p class="section-label">05 — Selected work</p>
		<p class="note v-mono-s">
			{String(projects.length).padStart(2, '0')} REPOS · PUBLIC · OPEN SOURCE
		</p>
	</div>

	<ol class="rows">
		{#each projects as project, i (project.repo)}
			<li class="broadsheet" use:rise={{ delay: (i % 3) * 80 }}>
				<div class="num-cell">
					<p class="idx v-mono">{String(i + 1).padStart(2, '0')}</p>
					{#if project.stars > 0}
						<p class="stars v-mono-s">★ {project.stars}</p>
					{/if}
				</div>
				<div class="body-cell">
					<h3 class="v-display">{project.title.toUpperCase()}</h3>
					<p class="desc v-body">{project.description}</p>
					<p class="meta v-mono-s">
						{#each project.tech as tag (tag)}
							<span class="chip">{tag.toUpperCase()}</span>
						{/each}
						<a class="lnk" href={project.github} target="_blank" rel="noopener noreferrer"
							>GITHUB ↗</a
						>
						{#if project.live}
							<a class="lnk" href={project.live} target="_blank" rel="noopener noreferrer"
								>LIVE DEMO ↗</a
							>
						{/if}
					</p>
				</div>
			</li>
		{/each}
	</ol>

	<p class="more v-mono-s broadsheet" use:rise>
		<span class="more-inner"
			>FULL ARCHIVE ON <a href={profile.github} target="_blank" rel="noopener noreferrer"
				>GITHUB ↗</a
			></span
		>
	</p>
</section>

<style>
	section {
		padding-top: clamp(6rem, 14vh, 12rem);
		padding-bottom: 3.5rem;
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

	.rows {
		list-style: none;
		position: relative;
		z-index: 1;
	}

	li {
		padding-block: 2.25rem;
		border-top: 1px solid rgba(242, 240, 234, 0.25);
	}

	.num-cell {
		grid-column: 1 / 4;
	}

	.idx {
		font-weight: 700;
		color: var(--signal);
	}

	.stars {
		margin-top: 0.3rem;
		opacity: 0.7;
	}

	.body-cell {
		grid-column: 4 / 12;
	}

	h3 {
		font-size: clamp(26px, 3.6vw, 56px);
		margin-bottom: 0.75rem;
		transition: color 0.15s ease;
	}

	li:hover h3 {
		color: var(--signal);
	}

	.desc {
		max-width: 58ch;
		color: color-mix(in srgb, var(--paper) 78%, transparent);
		margin-bottom: 1rem;
	}

	.meta {
		display: flex;
		gap: 0.5rem 0.6rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.chip {
		border: 1px solid rgba(242, 240, 234, 0.4);
		border-radius: 99px;
		padding: 0.15rem 0.65rem;
	}

	.lnk {
		margin-left: 0.75rem;
		color: var(--signal);
		font-weight: 700;
		border-bottom: 1px solid var(--signal);
		padding-bottom: 1px;
	}

	.lnk:hover {
		color: var(--paper);
		border-color: var(--paper);
	}

	.more {
		margin-top: 2.5rem;
	}

	.more-inner {
		grid-column: 4 / 12;
		opacity: 0.7;
	}

	.more a {
		color: var(--signal);
	}

	@media (max-width: 768px) {
		.num-cell {
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

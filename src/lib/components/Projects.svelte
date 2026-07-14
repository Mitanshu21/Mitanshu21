<script lang="ts">
	import { projects, profile } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';
</script>

<section class="section" id="work">
	<div class="container">
		<p class="section-label" use:reveal>03 — Selected work</p>

		<div class="grid">
			{#each projects as project, i (project.title)}
				<article use:reveal={{ delay: (i % 2) * 100 }}>
					<div class="top">
						<h3>{project.title}</h3>
						{#if project.stars > 1}
							<span class="stars" title="{project.stars} GitHub stars">★ {project.stars}</span>
						{/if}
					</div>

					<p>{project.description}</p>

					<ul class="tags">
						{#each project.tech as tag (tag)}
							<li>{tag}</li>
						{/each}
					</ul>

					<div class="links">
						<a href={project.github} target="_blank" rel="noopener noreferrer">
							Code <span aria-hidden="true">↗</span>
						</a>
						{#if project.live}
							<a href={project.live} target="_blank" rel="noopener noreferrer">
								Live demo <span aria-hidden="true">↗</span>
							</a>
						{/if}
					</div>
				</article>
			{/each}
		</div>

		<p class="more" use:reveal>
			More on <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
		</p>
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.25rem;
	}

	article {
		position: relative;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 1.75rem;
		background: var(--bg-raised);
		transition:
			border-color 0.25s ease,
			transform 0.25s var(--ease-out),
			box-shadow 0.25s ease;
	}

	article:hover {
		border-color: rgba(94, 234, 212, 0.45);
		transform: translateY(-4px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
	}

	.top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	h3 {
		font-size: 1.15rem;
	}

	.stars {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--accent);
		white-space: nowrap;
	}

	article > p {
		color: var(--muted);
		font-size: 0.92rem;
		margin-bottom: 1.25rem;
		flex-grow: 1;
	}

	.tags {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}

	.tags li {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.05em;
		color: var(--muted);
		border: 1px solid var(--line);
		border-radius: 99px;
		padding: 0.15rem 0.65rem;
	}

	.links {
		display: flex;
		gap: 1.5rem;
	}

	.links a {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text);
		transition: color 0.2s ease;
	}

	.links a span {
		color: var(--accent);
		display: inline-block;
		transition: transform 0.2s var(--ease-out);
	}

	.links a:hover {
		color: var(--accent);
	}

	.links a:hover span {
		transform: translate(2px, -2px);
	}

	.more {
		margin-top: 2.5rem;
		color: var(--muted);
		font-size: 0.9rem;
	}

	.more a {
		color: var(--accent);
	}

	@media (max-width: 720px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>

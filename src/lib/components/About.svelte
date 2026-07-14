<script lang="ts">
	import { about } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';
</script>

<section class="section" id="about">
	<div class="container">
		<p class="section-label" use:reveal>01 — About</p>

		<div class="cols">
			<div class="text" use:reveal>
				{#each about.paragraphs as paragraph (paragraph)}
					<p>{paragraph}</p>
				{/each}
			</div>

			<div class="skills">
				{#each about.skills as { group, items }, i (group)}
					<div class="skill-group" use:reveal={{ delay: i * 80 }}>
						<h3>{group}</h3>
						<ul>
							{#each items as item (item)}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.cols {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: clamp(2rem, 6vw, 5rem);
	}

	.text p {
		color: var(--muted);
		margin-bottom: 1.25rem;
		max-width: 58ch;
	}

	.skills {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem 1.5rem;
		align-content: start;
	}

	h3 {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 0.75rem;
	}

	ul {
		list-style: none;
	}

	li {
		font-size: 0.9rem;
		color: var(--muted);
		padding: 0.3rem 0;
		border-bottom: 1px solid var(--line);
	}

	li:last-child {
		border-bottom: none;
	}

	@media (max-width: 768px) {
		.cols {
			grid-template-columns: 1fr;
		}
	}
</style>

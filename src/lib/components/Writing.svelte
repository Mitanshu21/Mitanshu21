<script lang="ts">
	import { writing } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';
</script>

{#if writing.length > 0}
	<section class="section" id="writing">
		<div class="container">
			<p class="section-label" use:reveal>04 — Writing</p>

			<ul>
				{#each writing as post, i (post.url)}
					<li use:reveal={{ delay: i * 80 }}>
						<a href={post.url} target="_blank" rel="noopener noreferrer">
							<span class="date">{post.date}</span>
							<span class="title">{post.title}</span>
							<span class="arrow" aria-hidden="true">↗</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	ul {
		list-style: none;
	}

	li a {
		display: grid;
		grid-template-columns: 120px 1fr auto;
		gap: 1.5rem;
		align-items: baseline;
		padding: 1.1rem 0;
		border-bottom: 1px solid var(--line);
		transition: color 0.2s ease;
	}

	li a:hover {
		color: var(--accent);
	}

	.date {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--faint);
	}

	.title {
		font-weight: 500;
	}

	.arrow {
		color: var(--accent);
	}

	@media (max-width: 640px) {
		li a {
			grid-template-columns: 1fr auto;
		}
		.date {
			display: none;
		}
	}
</style>

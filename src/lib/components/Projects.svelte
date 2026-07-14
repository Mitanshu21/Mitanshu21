<script lang="ts">
	import { projects } from '$lib/data';
	import { rise } from '$lib/actions/rise';

	let open = $state(0); // row 1 ships pre-expanded
	let sectionEl = $state<HTMLElement>();
	let pill = $state<HTMLElement>();
	let pillText = $state('OPEN +');
	let pillVisible = $state(false);

	function toggle(i: number) {
		open = open === i ? -1 : i;
		pillText = open === i ? 'CLOSE −' : 'OPEN +';
	}

	// Cursor-chasing pill — pointer:fine only, lerped at 0.15/frame.
	$effect(() => {
		if (!sectionEl || !pill || !matchMedia('(pointer: fine)').matches) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const el = sectionEl;
		const p = pill;
		let tx = 0;
		let ty = 0;
		let x = 0;
		let y = 0;
		let raf = 0;

		function loop() {
			x += (tx - x) * 0.15;
			y += (ty - y) * 0.15;
			p.style.transform = `translate(${x - 45}px, ${y - 18}px)`;
			// stop once converged and hidden — no idle 60fps loop
			if (!pillVisible && Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5) {
				raf = 0;
				return;
			}
			raf = requestAnimationFrame(loop);
		}

		function onMove(e: PointerEvent) {
			tx = e.clientX;
			ty = e.clientY;
			const row = (e.target as HTMLElement).closest('.row-head');
			pillVisible = !!row;
			if (row) {
				const i = Number((row as HTMLElement).dataset.index);
				pillText = open === i ? 'CLOSE −' : 'OPEN +';
			}
			if (!raf) {
				x = tx;
				y = ty;
				raf = requestAnimationFrame(loop);
			}
		}

		function onLeave() {
			pillVisible = false;
			cancelAnimationFrame(raf);
			raf = 0;
		}

		el.addEventListener('pointermove', onMove);
		el.addEventListener('pointerleave', onLeave);
		return () => {
			cancelAnimationFrame(raf);
			el.removeEventListener('pointermove', onMove);
			el.removeEventListener('pointerleave', onLeave);
		};
	});
</script>

<section class="ink rule-top" id="work" data-numeral data-section="04 / 05 — WORK">
	<span class="numeral filled left" aria-hidden="true">04</span>

	<header class="head broadsheet" use:rise>
		<h2 class="v-display outlined">SELECTED WORK</h2>
		<p class="v-mono-s note">{String(projects.length).padStart(2, '0')} REPOS / PUBLIC / OPEN SOURCE</p>
	</header>

	<div class="rows">
		{#each projects as project, i (project.repo)}
			<article class="rule-row" class:open={open === i} use:rise={{ delay: (i % 3) * 70 }}>
				<button
					class="row-head"
					data-index={i}
					aria-expanded={open === i}
					aria-controls="proj-{i}"
					onclick={() => toggle(i)}
				>
					<span class="index v-mono">{String(i + 1).padStart(2, '0')}</span>
					<span class="title v-display">{project.title.toUpperCase()}</span>
					<span class="meta v-mono-s">
						{project.tech.join(' / ').toUpperCase()}{project.stars > 0
							? `  ·  ★ ${project.stars}`
							: ''}
						<span class="glyph" aria-hidden="true">{open === i ? '−' : '+'}</span>
					</span>
				</button>

				<div class="panel" id="proj-{i}" inert={open !== i}>
					<div class="panel-inner broadsheet">
						<p class="desc v-body">{project.description}</p>
						<p class="links v-mono">
							<a href={project.github} target="_blank" rel="noopener noreferrer">GITHUB ↗</a>
							{#if project.live}
								<a href={project.live} target="_blank" rel="noopener noreferrer">LIVE ↗</a>
							{/if}
						</p>
					</div>
				</div>
			</article>
		{/each}
	</div>
</section>

<div class="pill v-mono-s" class:visible={pillVisible} bind:this={pill} aria-hidden="true">
	{pillText}
</div>

<style>
	section {
		padding-top: clamp(6rem, 14vh, 12rem);
		padding-bottom: 4rem;
	}

	.head {
		align-items: baseline;
		margin-bottom: 3rem;
		position: relative;
		z-index: 1;
	}

	h2 {
		grid-column: 1 / 10;
		font-size: clamp(44px, 10vw, 200px);
		-webkit-text-stroke-color: var(--paper);
	}

	.note {
		grid-column: 10 / 13;
		text-align: right;
		align-self: end;
	}

	.rows {
		position: relative;
		z-index: 1;
	}

	article {
		border-top: 1px solid var(--paper);
	}

	article:last-child {
		border-bottom: 1px solid var(--paper);
	}

	.row-head {
		display: grid;
		grid-template-columns: minmax(48px, 6vw) 1fr auto;
		align-items: baseline;
		gap: 2vw;
		width: 100%;
		text-align: left;
		padding: 1.4rem 2vw;
		cursor: pointer;
	}

	.title {
		font-size: clamp(28px, 6vw, 110px);
		transition: color 0.15s ease;
	}

	.row-head:hover .title,
	.row-head:focus-visible .title,
	.open .title {
		color: var(--signal);
	}

	.meta {
		white-space: nowrap;
		opacity: 0.7;
	}

	.glyph {
		display: inline-block;
		margin-left: 1.5rem;
		opacity: 1;
	}

	/* accordion — grid-template-rows 0fr → 1fr */
	.panel {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.open .panel {
		grid-template-rows: 1fr;
	}

	.panel-inner {
		overflow: clip;
	}

	.desc {
		grid-column: 3 / 9;
		padding-bottom: 2rem;
	}

	.links {
		grid-column: 9 / 13;
		display: flex;
		gap: 2.5rem;
		justify-content: flex-end;
		align-items: start;
	}

	.links a {
		border-bottom: 1px solid var(--paper);
		padding-bottom: 2px;
		transition:
			color 0.15s ease,
			border-color 0.15s ease;
	}

	.links a:hover {
		color: var(--signal);
		border-color: var(--signal);
	}

	/* cursor pill */
	.pill {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 45;
		width: 90px;
		height: 36px;
		display: grid;
		place-items: center;
		background: var(--paper);
		color: var(--ink);
		border-radius: 999px;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	.pill.visible {
		opacity: 1;
	}

	@media (max-width: 768px) {
		h2 {
			grid-column: 1 / -1;
		}
		.note {
			grid-column: 1 / -1;
			text-align: left;
		}
		.row-head {
			grid-template-columns: 1fr;
			gap: 0.3rem;
			padding-block: 1.1rem;
		}
		.index {
			display: none;
		}
		.desc {
			grid-column: 1 / -1;
		}
		.links {
			grid-column: 1 / -1;
			justify-content: flex-start;
			padding-bottom: 1.5rem;
		}
		.pill {
			display: none;
		}
	}

	@media (pointer: coarse), (prefers-reduced-motion: reduce) {
		.pill {
			display: none;
		}
	}
</style>

<script lang="ts">
	import { tick } from 'svelte';
	import { ui } from '$lib/ui.svelte';
	import { sections } from '$lib/data';
	import { scrollToSection } from '$lib/scroll';

	let panel = $state<HTMLElement>();
	let restoreTo: HTMLElement | null = null;

	function jump(id: string) {
		ui.index = false;
		scrollToSection(id);
	}

	function trap(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			ui.index = false;
			return;
		}
		if (e.key !== 'Tab' || !panel) return;
		const focusables = panel.querySelectorAll<HTMLElement>('a, button');
		const first = focusables[0];
		const last = focusables[focusables.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	$effect(() => {
		if (ui.index) {
			restoreTo = document.activeElement as HTMLElement | null;
			document.body.style.overflow = 'hidden';
			tick().then(() => panel?.querySelector('a')?.focus());
		} else {
			document.body.style.overflow = '';
			restoreTo?.focus();
			restoreTo = null;
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if ui.index}
	<div
		class="overlay ink"
		role="dialog"
		aria-modal="true"
		aria-label="Site index"
		tabindex="-1"
		bind:this={panel}
		onkeydown={trap}
	>
		<div class="head">
			<p class="v-mono-s">INDEX</p>
			<button class="v-mono-s" onclick={() => (ui.index = false)}>CLOSE ✕</button>
		</div>
		<nav>
			{#each sections as s, i (s.id)}
				<a
					href="#{s.id}"
					style="--d: {i * 40}ms"
					onclick={(e) => {
						e.preventDefault();
						jump(s.id);
					}}
				>
					<span class="num outlined v-display">{s.num}</span>
					<span class="label v-display">{s.label.toUpperCase()}</span>
					<span class="note v-mono-s">{s.note ? `— ${s.note.toUpperCase()}` : ''}</span>
					<span class="arrow" aria-hidden="true">→</span>
				</a>
			{/each}
		</nav>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 60;
		display: flex;
		flex-direction: column;
		animation: wipe 0.4s var(--ease-expo) both;
	}

	@keyframes wipe {
		from {
			transform: translateY(-100%);
		}
	}

	.head {
		display: flex;
		justify-content: space-between;
		padding: 1rem 2vw;
		border-bottom: 1px solid var(--paper);
	}

	.head button:hover {
		color: var(--signal);
	}

	nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	a {
		display: flex;
		align-items: baseline;
		gap: 3vw;
		padding: 0.6rem 2vw;
		border-top: 1px solid var(--paper);
		font-size: clamp(34px, 8vw, 120px);
		animation: row-in 0.3s ease both;
		animation-delay: var(--d);
		transition: color 0.15s ease;
	}

	a:first-child {
		border-top: 0;
	}

	@keyframes row-in {
		from {
			opacity: 0;
		}
	}

	.num {
		font-size: 0.5em;
		-webkit-text-stroke-color: var(--paper);
	}

	.label {
		font-size: 1em;
		line-height: 1;
	}

	.note {
		opacity: 0.6;
	}

	.arrow {
		margin-left: auto;
		font-size: 0.4em;
		transform: translateX(-12px);
		opacity: 0;
		transition:
			transform 0.2s var(--ease-expo),
			opacity 0.2s ease;
	}

	a:hover,
	a:focus-visible {
		color: var(--signal);
	}

	a:hover .num,
	a:focus-visible .num {
		-webkit-text-stroke-color: var(--signal);
	}

	a:hover .arrow,
	a:focus-visible .arrow {
		transform: translateX(0);
		opacity: 1;
	}
</style>

<script lang="ts">
	import { profile } from '$lib/data';
	import { base } from '$app/paths';
</script>

<section class="hero" id="top">
	<div class="grid-bg" aria-hidden="true"></div>
	<div class="glow" aria-hidden="true"></div>

	<div class="container">
		{#if profile.available}
			<p class="status anim" style="--i: 0">
				<span class="dot" aria-hidden="true"></span>
				{profile.availabilityNote}
			</p>
		{/if}

		<p class="kicker anim" style="--i: 1">
			{profile.name} · {profile.role}
		</p>

		<h1 class="anim" style="--i: 2">{profile.tagline}</h1>

		<p class="intro anim" style="--i: 3">{profile.intro}</p>

		<div class="actions anim" style="--i: 4">
			<a class="btn primary" href="#work">Selected work</a>
			<a class="btn" href="mailto:{profile.email}">Get in touch</a>
			{#if profile.resume}
				<a class="btn" href="{base}/{profile.resume}" target="_blank" rel="noopener">Resume</a>
			{/if}
		</div>
	</div>

	<a class="scroll-hint" href="#about" aria-label="Scroll to about section">
		<span></span>
	</a>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100svh;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	/* Faint blueprint grid, fading toward the bottom */
	.grid-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: radial-gradient(ellipse 90% 70% at 50% 20%, black 30%, transparent 75%);
		-webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 20%, black 30%, transparent 75%);
	}

	.glow {
		position: absolute;
		top: -25%;
		left: 50%;
		transform: translateX(-50%);
		width: 70vw;
		height: 60vh;
		background: radial-gradient(ellipse at center, rgba(94, 234, 212, 0.09), transparent 65%);
		filter: blur(40px);
		pointer-events: none;
	}

	.container {
		position: relative;
		width: 100%;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		color: var(--muted);
		border: 1px solid var(--line);
		border-radius: 99px;
		padding: 0.35rem 0.9rem;
		margin-bottom: 2rem;
		background: rgba(255, 255, 255, 0.02);
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 8px var(--accent);
		animation: pulse 2.4s ease-in-out infinite;
	}

	@keyframes pulse {
		50% {
			opacity: 0.4;
		}
	}

	.kicker {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 1.25rem;
	}

	h1 {
		font-size: clamp(2.4rem, 6.5vw, 4.6rem);
		max-width: 16ch;
		margin-bottom: 1.75rem;
	}

	.intro {
		max-width: 54ch;
		color: var(--muted);
		font-size: clamp(1rem, 1.6vw, 1.15rem);
		margin-bottom: 2.75rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 500;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			transform 0.2s var(--ease-out);
	}

	.btn:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
	}

	.btn.primary {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--bg);
	}

	.btn.primary:hover {
		box-shadow: 0 0 24px rgba(94, 234, 212, 0.35);
	}

	.scroll-hint {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		width: 22px;
		height: 36px;
		border: 1px solid var(--line-strong);
		border-radius: 11px;
		display: flex;
		justify-content: center;
		padding-top: 7px;
	}

	.scroll-hint span {
		width: 3px;
		height: 7px;
		border-radius: 2px;
		background: var(--accent);
		animation: drift 2s ease-in-out infinite;
	}

	@keyframes drift {
		50% {
			transform: translateY(8px);
			opacity: 0.3;
		}
	}

	/* Staggered entrance */
	.anim {
		animation: rise 0.8s var(--ease-out) both;
		animation-delay: calc(var(--i) * 110ms);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(26px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.anim {
			animation: none;
		}
	}
</style>

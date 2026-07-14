<script lang="ts">
	import { tick } from 'svelte';
	import { ui } from '$lib/ui.svelte';
	import { profile, about, experience, projects, sections } from '$lib/data';
	import { scrollToSection } from '$lib/scroll';

	let sheetEl = $state<HTMLElement>();

	type Line = { text: string; kind: 'cmd' | 'out' | 'ok' | 'dim' };

	const stamp = () => `[${(performance.now() / 1000).toFixed(2).padStart(6, '0')}]`;

	let lines = $state<Line[]>([
		{ text: 'mitanshu.sh — last login: just now, from somewhere curious', kind: 'dim' },
		{ text: 'type `help` for commands, or just ask me something.', kind: 'dim' }
	]);
	let input = $state('');
	let busy = $state(false);
	let inputEl = $state<HTMLInputElement>();
	let bodyEl = $state<HTMLDivElement>();

	const out = (text: string): Line => ({ text, kind: 'out' });
	const ok = (text: string): Line => ({ text, kind: 'ok' });
	const dim = (text: string): Line => ({ text, kind: 'dim' });

	const HELP: Line[] = [
		out('available commands:'),
		ok('  whoami            who is this guy'),
		ok('  projects          selected work'),
		ok('  open <n>          open project n on github'),
		ok('  stack             technologies I use'),
		ok('  experience        where I have worked'),
		ok('  contact           reach me'),
		ok('  copy email        clipboard it'),
		ok('  goto <section>    about · experience · work · contact'),
		ok('  ping              measure this machine'),
		ok('  sudo hire mitanshu'),
		ok('  clear · exit'),
		dim('or ask in plain words — e.g. "do you know svelte?"')
	];

	function whoami(): Line[] {
		return [
			ok(`${profile.name} — ${profile.role}`),
			out(profile.tagline),
			dim(`status: ${profile.availabilityNote.toLowerCase()}`)
		];
	}

	function listProjects(): Line[] {
		return [
			...projects.map((p, i) =>
				out(`  ${i + 1}. ${p.title}${p.stars > 1 ? ` ★${p.stars}` : ''} — ${p.tech.join(', ')}`)
			),
			dim('try `open 1`')
		];
	}

	function stack(): Line[] {
		return about.skills.map((s) => out(`  ${s.group.padEnd(10)} ${s.items.join(', ')}`));
	}

	function jobs(): Line[] {
		return experience.map((j) =>
			out(`  ${j.period}  ${j.role} · ${j.company}${j.current ? '  ● running' : ''}`)
		);
	}

	function contact(): Line[] {
		return [
			ok(`  email    ${profile.email}`),
			ok(`  github   ${profile.github}`),
			dim('or take the shortcut: `sudo hire mitanshu`')
		];
	}

	function answer(query: string): Line[] {
		const q = query.toLowerCase();
		if (/\b(svelte|react|node|python|django|mongo|stack|tech|skill)/.test(q))
			return [out('yes — here is the full stack:'), ...stack()];
		if (/\b(hire|hiring|job|available|freelance|work with|open to)/.test(q))
			return [ok(profile.availabilityNote + '.'), ...contact()];
		if (/\b(project|work|built|portfolio|repo)/.test(q)) return listProjects();
		if (/\b(who|about|you|name)\b/.test(q)) return whoami();
		if (/\b(hi|hello|hey|yo)\b/.test(q)) return [ok('hey 👋 — try `help`')];
		if (/\b(fast|performance|speed|light)/.test(q))
			return [
				out('this whole site ships less JavaScript than most cookie banners.'),
				dim('that is the point.')
			];
		return [dim('no model loaded for that query — try `help`')];
	}

	async function print(response: Line[]) {
		busy = true;
		for (const line of response) {
			lines.push(line);
			await tick();
			bodyEl?.scrollTo({ top: bodyEl.scrollHeight });
			await new Promise((r) => setTimeout(r, 45));
		}
		busy = false;
		await tick();
		if (matchMedia('(pointer: fine)').matches) inputEl?.focus();
	}

	async function run(raw: string) {
		const [cmd, ...rest] = raw.toLowerCase().split(/\s+/);
		const arg = rest.join(' ');

		switch (cmd) {
			case 'help':
				return print(HELP);
			case 'whoami':
				return print(whoami());
			case 'projects':
			case 'ls':
				return print(listProjects());
			case 'open': {
				const p = projects[Number(arg) - 1];
				if (!p) return print([dim(`open <1-${projects.length}>`)]);
				window.open(p.github, '_blank', 'noopener');
				return print([ok(`${stamp()} opening ${p.title} ↗`)]);
			}
			case 'stack':
			case 'skills':
				return print(stack());
			case 'experience':
				return print(jobs());
			case 'contact':
			case 'email':
				return print(contact());
			case 'copy': {
				try {
					await navigator.clipboard.writeText(profile.email);
					return print([ok(`${stamp()} ✓ copied ${profile.email}`)]);
				} catch {
					return print([dim('clipboard unavailable — email is in `contact`')]);
				}
			}
			case 'goto': {
				const target = sections.find((s) => s.label.toLowerCase() === arg || s.id === arg);
				if (!target) return print([dim('goto <about|experience|work|contact>')]);
				ui.terminal = false;
				scrollToSection(target.id);
				return;
			}
			case 'ping': {
				const t0 = performance.now();
				await new Promise(requestAnimationFrame);
				const dt = performance.now() - t0;
				return print([
					ok(`${stamp()} pong — ${dt.toFixed(2)}ms frame roundtrip, measured live`),
					dim('no server was involved. there is no server.')
				]);
			}
			case 'resume':
			case 'cv':
				return print([dim('resume.pdf not mounted yet — `contact` works faster anyway.')]);
			case 'sudo': {
				if (!/hire/.test(arg)) return print([dim('visitor is not in the sudoers file.')]);
				await print([
					out('[sudo] password for visitor: ********'),
					ok('permission granted — drafting email…')
				]);
				setTimeout(() => (location.href = `mailto:${profile.email}`), 500);
				return;
			}
			case 'clear':
				lines = [];
				return;
			case 'exit':
			case 'q':
				ui.terminal = false;
				return;
			default:
				return print(answer(raw));
		}
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const raw = input.trim();
		if (!raw || busy) return;
		lines.push({ text: raw, kind: 'cmd' });
		input = '';
		void run(raw);
	}

	function onKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			ui.terminal = !ui.terminal;
			return;
		}
		if (e.key === 'Escape' && ui.terminal) {
			ui.terminal = false;
		}
	}

	// keep Tab inside the sheet while it is open (aria-modal promises this)
	function trap(e: KeyboardEvent) {
		if (e.key !== 'Tab' || !sheetEl) return;
		const focusables = sheetEl.querySelectorAll<HTMLElement>('button, input, a[href]');
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
		if (ui.terminal) {
			if (ui.greeting) {
				lines.push({ text: ui.greeting, kind: 'ok' });
				ui.greeting = '';
			}
			tick().then(() => {
				// never auto-focus on touch — it summons the keyboard over the sheet
				if (matchMedia('(pointer: fine)').matches) inputEl?.focus();
				bodyEl?.scrollTo({ top: bodyEl.scrollHeight });
			});
		}
	});
</script>

<svelte:window onkeydown={onKeydown} />

{#if ui.terminal}
	<div
		class="backdrop"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) ui.terminal = false;
		}}
	>
		<div
			class="sheet ink"
			role="dialog"
			aria-modal="true"
			aria-label="Interactive terminal"
			tabindex="-1"
			bind:this={sheetEl}
			onkeydown={trap}
		>
			<div class="bar">
				<p class="v-mono-s">MITANSHU@INDIDINO:~$ — INTERACTIVE</p>
				<button class="v-mono-s" onclick={() => (ui.terminal = false)}>ESC ✕</button>
			</div>

			<div class="body" bind:this={bodyEl} role="log" aria-live="polite">
				{#each lines as line, i (i)}
					<p class={line.kind}>
						{#if line.kind === 'cmd'}<span class="prompt">mitanshu@indidino:~$</span>{/if}{line.text}
					</p>
				{/each}

				<form onsubmit={submit}>
					<span class="prompt">mitanshu@indidino:~$</span>
					<input
						bind:this={inputEl}
						bind:value={input}
						spellcheck="false"
						autocomplete="off"
						autocapitalize="off"
						aria-label="Terminal command"
						placeholder={busy ? '' : 'help'}
					/>
					<span class="cursor" aria-hidden="true"></span>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 70;
		display: flex;
		align-items: flex-end;
	}

	.sheet {
		width: 100%;
		max-height: 46vh;
		display: flex;
		flex-direction: column;
		border-top: 4px solid var(--signal);
		animation: rise-up 0.3s var(--ease-expo) both;
	}

	@keyframes rise-up {
		from {
			transform: translateY(100%);
		}
	}

	.bar {
		display: flex;
		justify-content: space-between;
		padding: 0.75rem 2vw;
		border-bottom: 1px solid var(--paper);
	}

	.bar button:hover {
		color: var(--signal);
	}

	.body {
		overflow-y: auto;
		padding: 1rem 2vw 1.25rem;
		font-family: var(--font-mono);
		font-size: 14px;
		font-feature-settings: 'liga' 0;
		line-height: 1.7;
	}

	p {
		white-space: pre-wrap;
		word-break: break-word;
		opacity: 0.85;
		animation: line-in 0.15s ease both;
	}

	@keyframes line-in {
		from {
			opacity: 0;
			transform: translateY(3px);
		}
	}

	p.cmd {
		opacity: 1;
	}

	p.ok {
		color: var(--signal);
		opacity: 1;
	}

	p.dim {
		opacity: 0.5;
	}

	.prompt {
		color: var(--signal);
		margin-right: 0.6rem;
		user-select: none;
	}

	form {
		display: flex;
		align-items: center;
	}

	input {
		background: none;
		border: none;
		outline: none;
		color: var(--paper);
		font: inherit;
		flex: 1;
		caret-color: var(--signal);
	}

	/* block cursor, steps(2) blink — only where the input can hug its text */
	.cursor {
		display: none;
		width: 0.6em;
		height: 1.2em;
		background: var(--signal);
		animation: blink 1.06s steps(2, start) infinite;
	}

	@supports (field-sizing: content) {
		input {
			flex: 0 1 auto;
			field-sizing: content;
			min-width: 2px;
			caret-color: transparent;
		}
		.cursor {
			display: block;
		}
	}

	@keyframes blink {
		to {
			visibility: hidden;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor {
			animation: none;
		}
	}

	input::placeholder {
		color: var(--paper);
		opacity: 0.3;
	}

	@media (max-width: 768px) {
		.sheet {
			max-height: calc(100svh - 48px);
			height: calc(100svh - 48px);
		}
	}
</style>

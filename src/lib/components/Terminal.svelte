<script lang="ts">
	import { tick } from 'svelte';
	import { ui } from '$lib/ui.svelte';
	import { profile, about, experience, projects, sections } from '$lib/data';
	import { scrollToSection } from '$lib/scroll';

	let sheetEl = $state<HTMLElement>();

	type Line = { text: string; kind: 'cmd' | 'out' | 'ok' | 'dim'; run?: string };

	const stamp = () => `[${(performance.now() / 1000).toFixed(2).padStart(6, '0')}]`;

	let lines = $state<Line[]>([
		{ text: 'mitanshu.sh — last login: just now, from somewhere curious', kind: 'dim' },
		{ text: 'click a command below, hit Tab to autocomplete — or just ask me something.', kind: 'dim' }
	]);
	let input = $state('');
	let busy = $state(false);
	let inputEl = $state<HTMLInputElement>();
	let bodyEl = $state<HTMLDivElement>();

	// oh-my-zsh comforts: clickable chips, ghost autosuggest, history
	const SUGGESTIONS = [
		'whoami',
		'projects',
		'stack',
		'experience',
		'contact',
		'ping',
		'sudo hire mitanshu'
	];
	const COMPLETIONS = [...SUGGESTIONS, 'help', 'goto lab', 'goto work', 'goto contact', 'open 1', 'copy email', 'clear', 'exit'];
	const history: string[] = [];
	let histIdx = $state(-1);
	const ghost = $derived.by(() => {
		const q = input.toLowerCase();
		if (!q) return '';
		const match = COMPLETIONS.find((c) => c.startsWith(q) && c !== q);
		return match ? match.slice(input.length) : '';
	});

	const out = (text: string): Line => ({ text, kind: 'out' });
	const ok = (text: string): Line => ({ text, kind: 'ok' });
	const dim = (text: string): Line => ({ text, kind: 'dim' });

	const HELP: Line[] = [
		out('available commands (click to run):'),
		{ text: '  whoami            who is this guy', kind: 'ok', run: 'whoami' },
		{ text: '  projects          selected work', kind: 'ok', run: 'projects' },
		{ text: '  open <n>          open project n on github', kind: 'ok', run: 'open 1' },
		{ text: '  stack             technologies I use', kind: 'ok', run: 'stack' },
		{ text: '  experience        where I have worked', kind: 'ok', run: 'experience' },
		{ text: '  contact           reach me', kind: 'ok', run: 'contact' },
		{ text: '  copy email        clipboard it', kind: 'ok', run: 'copy email' },
		{ text: '  goto <section>    work · lab · experience · contact', kind: 'ok', run: 'goto lab' },
		{ text: '  ping              measure this machine', kind: 'ok', run: 'ping' },
		{ text: '  sudo hire mitanshu', kind: 'ok', run: 'sudo hire mitanshu' },
		{ text: '  clear · exit', kind: 'ok', run: 'clear' },
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
			...projects.map(
				(p, i): Line => ({
					text: `  ${i + 1}. ${p.title}${p.stars > 1 ? ` ★${p.stars}` : ''} — ${p.tech.join(', ')}`,
					kind: 'out',
					run: `open ${i + 1}`
				})
			),
			dim('click a project (or `open <n>`) to see it on github')
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
			{ text: `  email    ${profile.email}  (click to copy)`, kind: 'ok', run: 'copy email' },
			{ text: `  github   ${profile.github}`, kind: 'ok', run: 'open 1' },
			{ text: '  or take the shortcut: `sudo hire mitanshu`', kind: 'dim', run: 'sudo hire mitanshu' }
		];
	}

	function answer(query: string): Line[] {
		const q = query.toLowerCase();
		if (/\b(ai|ml|llm|model|neural|machine learning)/.test(q))
			return [
				out('the lab on this page is training a neural net in your browser right now.'),
				{ text: '  → goto lab', kind: 'ok', run: 'goto lab' }
			];
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
				if (!target) return print([dim('goto <description|diagram|work|lab|experience|contact>')]);
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

	function exec(raw: string) {
		if (!raw || busy) return;
		lines.push({ text: raw, kind: 'cmd' });
		history.push(raw);
		histIdx = -1;
		input = '';
		void run(raw);
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		exec(input.trim());
	}

	function onInputKeydown(e: KeyboardEvent) {
		if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghost) {
			// accept the ghost suggestion (zsh-autosuggestions style)
			e.preventDefault();
			e.stopPropagation();
			input = input + ghost;
		} else if (e.key === 'ArrowUp' && history.length) {
			e.preventDefault();
			histIdx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
			input = history[histIdx];
		} else if (e.key === 'ArrowDown' && histIdx !== -1) {
			e.preventDefault();
			histIdx = histIdx === history.length - 1 ? -1 : histIdx + 1;
			input = histIdx === -1 ? '' : history[histIdx];
		}
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
				<p class="v-mono-s">MITANSHU-21 — INFERENCE CONSOLE</p>
				<button class="v-mono-s" onclick={() => (ui.terminal = false)}>ESC ✕</button>
			</div>

			<div class="body" bind:this={bodyEl} role="log" aria-live="polite">
				{#each lines as line, i (i)}
					{#if line.run}
						<p class={line.kind}>
							<button class="runnable" onclick={() => exec(line.run!)}>{line.text}</button>
						</p>
					{:else}
						<p class={line.kind}>
							{#if line.kind === 'cmd'}<span class="prompt">mitanshu@portfolio:~$</span
								>{/if}{line.text}
						</p>
					{/if}
				{/each}

				<form onsubmit={submit}>
					<span class="prompt">mitanshu@portfolio:~$</span>
					<input
						bind:this={inputEl}
						bind:value={input}
						onkeydown={onInputKeydown}
						spellcheck="false"
						autocomplete="off"
						autocapitalize="off"
						aria-label="Terminal command"
						placeholder={busy ? '' : 'help'}
					/>
					{#if ghost}<span class="ghost" aria-hidden="true">{ghost}</span>{/if}
					<span class="cursor" aria-hidden="true"></span>
				</form>
			</div>

			<div class="chips" role="toolbar" aria-label="Quick commands">
				{#each SUGGESTIONS as s (s)}
					<button class="cmd-chip" onclick={() => exec(s)} disabled={busy}>{s}</button>
				{/each}
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

	/* clickable output lines */
	.runnable {
		font: inherit;
		color: inherit;
		text-align: left;
		white-space: pre-wrap;
		word-break: break-word;
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.runnable:hover {
		color: var(--paper);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	p.ok .runnable:hover {
		color: var(--signal);
		filter: brightness(1.3);
	}

	/* ghost autosuggestion (accept with Tab or →) */
	.ghost {
		opacity: 0.35;
		white-space: pre;
	}

	/* quick-command chips */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.75rem 2vw 1rem;
		border-top: 1px solid rgba(242, 240, 234, 0.2);
	}

	.cmd-chip {
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.04em;
		color: var(--paper);
		border: 1px solid rgba(242, 240, 234, 0.35);
		border-radius: 999px;
		padding: 0.3rem 0.85rem;
		transition:
			color 0.15s ease,
			border-color 0.15s ease,
			background 0.15s ease;
	}

	.cmd-chip:hover:not(:disabled) {
		color: var(--ink);
		background: var(--signal);
		border-color: var(--signal);
	}

	.cmd-chip:disabled {
		opacity: 0.4;
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

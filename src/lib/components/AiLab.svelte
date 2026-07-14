<script lang="ts">
	// THE LAB — two real machine-learning experiments running entirely in
	// the visitor's browser. Hand-written forward/backward passes, no
	// libraries, no server. This section is the proof of the "AI engineer"
	// claim: view source.
	import { rise } from '$lib/actions/rise';

	const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ═══ EXP 01 — a neural net learning a 2D decision boundary ═══ */
	type P2 = { x: number; y: number; c: number };
	type DataKind = 'rings' | 'spiral' | 'xor';

	let nn1 = $state<HTMLCanvasElement>();
	let kind = $state<DataKind>('rings');
	let paused = $state(false);
	let addClass = $state(1);
	let steps = $state(0);
	let loss = $state(0);
	let acc = $state(0);

	const H = 12; // hidden units per layer
	let pts: P2[] = [];
	let W1: number[][], B1: number[], W2: number[][], B2: number[], W3: number[], B3: number;

	const rand = (s: number) => (Math.random() * 2 - 1) * s;

	function initNet() {
		W1 = Array.from({ length: H }, () => [rand(1), rand(1)]);
		B1 = Array.from({ length: H }, () => rand(0.1));
		W2 = Array.from({ length: H }, () => Array.from({ length: H }, () => rand(0.5)));
		B2 = Array.from({ length: H }, () => rand(0.1));
		W3 = Array.from({ length: H }, () => rand(0.5));
		B3 = rand(0.1);
		steps = 0;
	}

	function makeData(k: DataKind): P2[] {
		const out: P2[] = [];
		if (k === 'rings') {
			for (let i = 0; i < 110; i++) {
				const t = Math.random() * Math.PI * 2;
				const r0 = Math.random() * 0.4;
				out.push({ x: Math.cos(t) * r0 + rand(0.04), y: Math.sin(t) * r0 + rand(0.04), c: 1 });
				const r1 = 0.62 + Math.random() * 0.3;
				out.push({ x: Math.cos(t) * r1 + rand(0.04), y: Math.sin(t) * r1 + rand(0.04), c: 0 });
			}
		} else if (k === 'spiral') {
			for (let i = 0; i < 110; i++) {
				const t = (i / 110) * 2.6 * Math.PI;
				const r = (i / 110) * 0.9 + 0.08;
				out.push({ x: r * Math.cos(t) + rand(0.05), y: r * Math.sin(t) + rand(0.05), c: 1 });
				out.push({ x: -r * Math.cos(t) + rand(0.05), y: -r * Math.sin(t) + rand(0.05), c: 0 });
			}
		} else {
			for (let i = 0; i < 220; i++) {
				const x = rand(0.9);
				const y = rand(0.9);
				out.push({ x, y, c: x * y > 0 ? 1 : 0 });
			}
		}
		return out;
	}

	function forward(x: number, y: number) {
		const h1 = new Array(H);
		for (let i = 0; i < H; i++) h1[i] = Math.tanh(W1[i][0] * x + W1[i][1] * y + B1[i]);
		const h2 = new Array(H);
		for (let i = 0; i < H; i++) {
			let s = B2[i];
			for (let j = 0; j < H; j++) s += W2[i][j] * h1[j];
			h2[i] = Math.tanh(s);
		}
		let o = B3;
		for (let i = 0; i < H; i++) o += W3[i] * h2[i];
		return { h1, h2, out: 1 / (1 + Math.exp(-o)) };
	}

	function trainStep(lr: number) {
		// full-batch SGD, binary cross-entropy — the classic, by hand
		const gW1 = W1.map(() => [0, 0]);
		const gB1 = new Array(H).fill(0);
		const gW2 = W2.map(() => new Array(H).fill(0));
		const gB2 = new Array(H).fill(0);
		const gW3 = new Array(H).fill(0);
		let gB3 = 0;
		let L = 0;
		let correct = 0;

		for (const p of pts) {
			const { h1, h2, out } = forward(p.x, p.y);
			L += -(p.c * Math.log(out + 1e-9) + (1 - p.c) * Math.log(1 - out + 1e-9));
			if ((out > 0.5 ? 1 : 0) === p.c) correct++;
			const dO = out - p.c;
			const dH2 = new Array(H);
			for (let i = 0; i < H; i++) {
				gW3[i] += dO * h2[i];
				dH2[i] = dO * W3[i] * (1 - h2[i] * h2[i]);
			}
			gB3 += dO;
			const dH1 = new Array(H).fill(0);
			for (let i = 0; i < H; i++) {
				gB2[i] += dH2[i];
				for (let j = 0; j < H; j++) {
					gW2[i][j] += dH2[i] * h1[j];
					dH1[j] += dH2[i] * W2[i][j];
				}
			}
			for (let j = 0; j < H; j++) {
				const d = dH1[j] * (1 - h1[j] * h1[j]);
				gW1[j][0] += d * p.x;
				gW1[j][1] += d * p.y;
				gB1[j] += d;
			}
		}

		const n = pts.length || 1;
		const k = lr / n;
		for (let i = 0; i < H; i++) {
			W1[i][0] -= k * gW1[i][0];
			W1[i][1] -= k * gW1[i][1];
			B1[i] -= k * gB1[i];
			for (let j = 0; j < H; j++) W2[i][j] -= k * gW2[i][j];
			B2[i] -= k * gB2[i];
			W3[i] -= k * gW3[i];
		}
		B3 -= k * gB3;
		loss = L / n;
		acc = Math.round((correct / n) * 100);
		steps++;
	}

	function resetExp1(k: DataKind) {
		kind = k;
		pts = makeData(k);
		initNet();
	}

	$effect(() => {
		if (!nn1) return;
		const canvas = nn1;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		resetExp1(kind);
		if (reduced()) paused = true;

		const dpr = Math.min(devicePixelRatio || 1, 2);
		const G = 52; // boundary grid resolution
		const grid = document.createElement('canvas');
		grid.width = G;
		grid.height = G;
		const gctx = grid.getContext('2d')!;
		let raf = 0;
		let visible = false;
		let frame = 0;

		function size() {
			const w = canvas.clientWidth;
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(w * dpr);
		}

		function drawBoundary() {
			const img = gctx.createImageData(G, G);
			for (let gy = 0; gy < G; gy++) {
				for (let gx = 0; gx < G; gx++) {
					const out = forward((gx / (G - 1)) * 2 - 1, (gy / (G - 1)) * 2 - 1).out;
					const i = (gy * G + gx) * 4;
					if (out > 0.5) {
						// signal #FF4D00, confidence → alpha
						img.data[i] = 255;
						img.data[i + 1] = 77;
						img.data[i + 2] = 0;
						img.data[i + 3] = Math.round((out - 0.5) * 2 * 150);
					} else {
						img.data[i] = 17;
						img.data[i + 1] = 17;
						img.data[i + 2] = 17;
						img.data[i + 3] = Math.round((0.5 - out) * 2 * 130);
					}
				}
			}
			gctx.putImageData(img, 0, 0);
		}

		function draw() {
			const s = canvas.width;
			ctx!.clearRect(0, 0, s, s);
			ctx!.imageSmoothingEnabled = true;
			ctx!.drawImage(grid, 0, 0, s, s);
			const R = Math.max(3, s * 0.008);
			for (const p of pts) {
				ctx!.beginPath();
				ctx!.arc(((p.x + 1) / 2) * s, ((p.y + 1) / 2) * s, R, 0, Math.PI * 2);
				ctx!.fillStyle = p.c === 1 ? '#FF4D00' : '#111111';
				ctx!.fill();
				ctx!.strokeStyle = '#F2F0EA';
				ctx!.lineWidth = 1;
				ctx!.stroke();
			}
		}

		function loop() {
			if (!paused) {
				for (let i = 0; i < 5; i++) trainStep(0.6);
				if (frame % 3 === 0) drawBoundary();
			}
			draw();
			frame++;
			raf = visible ? requestAnimationFrame(loop) : 0;
		}

		function onClick(e: MouseEvent) {
			const r = canvas.getBoundingClientRect();
			pts.push({
				x: ((e.clientX - r.left) / r.width) * 2 - 1,
				y: ((e.clientY - r.top) / r.height) * 2 - 1,
				c: addClass
			});
			if (paused) {
				drawBoundary();
				draw();
			}
		}

		size();
		drawBoundary();
		draw();

		const ro = new ResizeObserver(() => {
			size();
			draw();
		});
		ro.observe(canvas);
		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible && !raf) raf = requestAnimationFrame(loop);
		});
		io.observe(canvas);
		canvas.addEventListener('click', onClick);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
			canvas.removeEventListener('click', onClick);
		};
	});

	/* ═══ EXP 02 — gradient descent chasing draggable points ═══ */
	let gd = $state<HTMLCanvasElement>();
	let mse = $state(0);
	let iters = $state(0);

	$effect(() => {
		if (!gd) return;
		const canvas = gd;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = Math.min(devicePixelRatio || 1, 2);
		// normalized x ∈ [-1,1]; model y = a + bx + cx² + dx³
		let dots = Array.from({ length: 8 }, (_, i) => {
			const x = -0.9 + (i / 7) * 1.8;
			return { x, y: Math.sin(x * 2.2) * 0.5 + rand(0.12) };
		});
		let a = 0,
			b = 0,
			c = 0,
			d = 0;
		let raf = 0;
		let visible = false;
		let dragging = -1;

		function size() {
			const w = canvas.clientWidth;
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(w * 0.62 * dpr);
		}

		const px = (x: number) => ((x + 1) / 2) * canvas.width;
		const py = (y: number) => ((1 - (y + 1) / 2) * 0.8 + 0.1) * canvas.height;
		const model = (x: number) => a + b * x + c * x * x + d * x * x * x;

		function stepGD(lr: number) {
			let ga = 0,
				gb = 0,
				gc = 0,
				gdd = 0,
				L = 0;
			for (const p of dots) {
				const e = model(p.x) - p.y;
				L += e * e;
				ga += e;
				gb += e * p.x;
				gc += e * p.x * p.x;
				gdd += e * p.x * p.x * p.x;
			}
			const n = dots.length;
			a -= (lr * 2 * ga) / n;
			b -= (lr * 2 * gb) / n;
			c -= (lr * 2 * gc) / n;
			d -= (lr * 2 * gdd) / n;
			mse = L / n;
			iters++;
		}

		function draw() {
			const w = canvas.width;
			ctx!.clearRect(0, 0, w, canvas.height);
			// residuals
			ctx!.strokeStyle = 'rgba(17,17,17,0.25)';
			ctx!.lineWidth = 1;
			for (const p of dots) {
				ctx!.beginPath();
				ctx!.moveTo(px(p.x), py(p.y));
				ctx!.lineTo(px(p.x), py(model(p.x)));
				ctx!.stroke();
			}
			// fitted curve
			ctx!.beginPath();
			for (let i = 0; i <= 100; i++) {
				const x = -1 + (i / 100) * 2;
				const yy = py(model(x));
				if (i === 0) ctx!.moveTo(px(x), yy);
				else ctx!.lineTo(px(x), yy);
			}
			ctx!.strokeStyle = '#FF4D00';
			ctx!.lineWidth = Math.max(2, w * 0.0035);
			ctx!.stroke();
			// points
			const R = Math.max(5, w * 0.009);
			for (let i = 0; i < dots.length; i++) {
				ctx!.beginPath();
				ctx!.arc(px(dots[i].x), py(dots[i].y), i === dragging ? R * 1.5 : R, 0, Math.PI * 2);
				ctx!.fillStyle = '#111111';
				ctx!.fill();
				ctx!.strokeStyle = '#F2F0EA';
				ctx!.lineWidth = 2;
				ctx!.stroke();
			}
		}

		function loop() {
			for (let i = 0; i < 25; i++) stepGD(0.08);
			draw();
			raf = visible ? requestAnimationFrame(loop) : 0;
		}

		function toData(e: PointerEvent) {
			const r = canvas.getBoundingClientRect();
			return {
				x: ((e.clientX - r.left) / r.width) * 2 - 1,
				y: (1 - ((e.clientY - r.top) / r.height - 0.1) / 0.8) * 2 - 1
			};
		}

		function onDown(e: PointerEvent) {
			const m = toData(e);
			let best = -1;
			let bestD = 0.12;
			dots.forEach((p, i) => {
				const dd = Math.hypot(p.x - m.x, p.y - m.y);
				if (dd < bestD) {
					bestD = dd;
					best = i;
				}
			});
			dragging = best;
			if (best !== -1) canvas.setPointerCapture(e.pointerId);
		}

		function onMove(e: PointerEvent) {
			if (dragging === -1) return;
			const m = toData(e);
			dots[dragging] = {
				x: Math.max(-1, Math.min(1, m.x)),
				y: Math.max(-1.1, Math.min(1.1, m.y))
			};
			if (reduced()) {
				for (let i = 0; i < 400; i++) stepGD(0.08);
				draw();
			}
		}

		function onUp() {
			dragging = -1;
		}

		size();
		if (reduced()) {
			for (let i = 0; i < 2000; i++) stepGD(0.08);
			draw();
		}

		const ro = new ResizeObserver(() => {
			size();
			draw();
		});
		ro.observe(canvas);
		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting && !reduced();
			if (visible && !raf) raf = requestAnimationFrame(loop);
		});
		io.observe(canvas);
		canvas.addEventListener('pointerdown', onDown);
		canvas.addEventListener('pointermove', onMove);
		canvas.addEventListener('pointerup', onUp);
		canvas.addEventListener('pointercancel', onUp);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
			canvas.removeEventListener('pointerdown', onDown);
			canvas.removeEventListener('pointermove', onMove);
			canvas.removeEventListener('pointerup', onUp);
			canvas.removeEventListener('pointercancel', onUp);
		};
	});
</script>

<section class="rule-top" id="lab" data-numeral data-section="05 / 06 — LAB">
	<span class="numeral left" aria-hidden="true">05</span>
	<h2 class="sr-only">Lab — live AI demos</h2>

	<div class="head" use:rise>
		<p class="title v-display">THE LAB</p>
		<p class="sub v-mono">
			TWO EXPERIMENTS · HAND-WRITTEN BACKPROP · 0 LIBRARIES · 0 SERVERS — IT ALL RUNS IN YOUR
			BROWSER, RIGHT NOW.
		</p>
	</div>

	<div class="bench">
		<article class="card" use:rise>
			<header>
				<p class="v-mono-s exp">EXP 01 — A NEURAL NET, LEARNING</p>
				<p class="v-mono-s readout">
					STEP {steps} · LOSS {loss.toFixed(3)} · ACC {acc}%
				</p>
			</header>
			<canvas bind:this={nn1} aria-label="Live neural network training visualization"></canvas>
			<footer>
				<div class="group">
					{#each ['rings', 'spiral', 'xor'] as k (k)}
						<button
							class="ctl v-mono-s"
							class:active={kind === k}
							onclick={() => resetExp1(k as DataKind)}>{k.toUpperCase()}</button
						>
					{/each}
				</div>
				<div class="group">
					<button
						class="ctl v-mono-s"
						onclick={() => (addClass = addClass === 1 ? 0 : 1)}
						title="Class of points added on click"
					>
						ADD: {addClass === 1 ? '● SIGNAL' : '○ INK'}
					</button>
					<button class="ctl v-mono-s" onclick={() => (paused = !paused)}>
						{paused ? '▶ TRAIN' : '❚❚ PAUSE'}
					</button>
				</div>
			</footer>
			<p class="hint v-mono-s">
				A 2-12-12-1 NETWORK, TRAINED WITH BACKPROP I WROTE BY HAND. CLICK THE CANVAS TO ADD
				DATA — WATCH IT ADAPT.
			</p>
		</article>

		<article class="card" use:rise={{ delay: 100 }}>
			<header>
				<p class="v-mono-s exp">EXP 02 — GRADIENT DESCENT, CHASING YOU</p>
				<p class="v-mono-s readout">ITER {iters} · MSE {mse.toFixed(4)}</p>
			</header>
			<canvas
				bind:this={gd}
				class="gd"
				aria-label="Interactive gradient descent curve fitting"
			></canvas>
			<p class="hint v-mono-s">
				A CUBIC FIT, RE-CONVERGING LIVE VIA GRADIENT DESCENT. DRAG THE POINTS — THE CURVE
				FIGHTS BACK.
			</p>
		</article>
	</div>
</section>

<style>
	section {
		padding-top: clamp(6rem, 14vh, 12rem);
		padding-bottom: clamp(4rem, 8vh, 7rem);
	}

	.head {
		position: relative;
		z-index: 1;
		padding-inline: 2vw;
		margin-bottom: 3rem;
	}

	.title {
		font-size: clamp(44px, 10vw, 200px);
	}

	.sub {
		margin-top: 1rem;
		max-width: 62ch;
	}

	.bench {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2vw;
		padding-inline: 2vw;
	}

	.card {
		border: 1px solid var(--ink);
		background: var(--paper);
		display: flex;
		flex-direction: column;
	}

	.card header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.7rem 1rem;
		border-bottom: 1px solid var(--ink);
	}

	.exp {
		color: var(--signal);
	}

	.readout {
		font-variant-numeric: tabular-nums;
	}

	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 1;
		cursor: crosshair;
	}

	canvas.gd {
		aspect-ratio: 100 / 62;
		cursor: grab;
		touch-action: none;
	}

	.card footer {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		flex-wrap: wrap;
		padding: 0.6rem 1rem;
		border-top: 1px solid var(--ink);
	}

	.group {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.ctl {
		border: 1px solid var(--ink);
		border-radius: 999px;
		padding: 0.25rem 0.7rem;
		transition:
			background 0.15s ease,
			color 0.15s ease;
	}

	.ctl:hover,
	.ctl.active {
		background: var(--ink);
		color: var(--paper);
	}

	.ctl.active {
		background: var(--signal);
		border-color: var(--signal);
		color: var(--ink);
	}

	.hint {
		padding: 0.6rem 1rem 0.8rem;
		opacity: 0.6;
		border-top: 1px solid var(--ink);
	}

	@media (max-width: 900px) {
		.bench {
			grid-template-columns: 1fr;
			gap: 4vw;
		}
	}
</style>

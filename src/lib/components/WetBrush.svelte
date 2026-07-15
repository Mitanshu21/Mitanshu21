<script lang="ts">
	// WET BRUSH — an opt-in fluid-ink overlay for the hero. Hand-written
	// Navier–Stokes (Stam stable fluids, raw WebGL1, no libraries). Paint
	// ink strokes that swirl with real dynamics; hold still to well up
	// orange; stop, and the paper slowly drinks it all back.
	let {
		active = false,
		clearSignal = 0
	}: { active?: boolean; clearSignal?: number } = $props();

	let canvas = $state<HTMLCanvasElement>();
	let supported = $state(true);

	const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

	const VERT = `
		attribute vec2 aPos; varying vec2 vUv;
		void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;
	const ADVECT = `
		precision highp float; varying vec2 vUv;
		uniform sampler2D uVel; uniform sampler2D uSrc;
		uniform float uDt; uniform float uDiss;
		void main() {
			vec2 coord = vUv - uDt * texture2D(uVel, vUv).xy;
			gl_FragColor = uDiss * texture2D(uSrc, coord);
		}`;
	const SPLAT = `
		precision highp float; varying vec2 vUv;
		uniform sampler2D uSrc; uniform vec2 uPoint; uniform vec3 uValue;
		uniform float uRadius; uniform float uAspect;
		void main() {
			vec2 d = vUv - uPoint; d.x *= uAspect;
			float g = exp(-dot(d, d) / uRadius);
			gl_FragColor = texture2D(uSrc, vUv) + vec4(uValue, 0.0) * g;
		}`;
	const CURL = `
		precision highp float; varying vec2 vUv;
		uniform sampler2D uVel; uniform vec2 uTexel;
		void main() {
			float L = texture2D(uVel, vUv - vec2(uTexel.x, 0.0)).y;
			float R = texture2D(uVel, vUv + vec2(uTexel.x, 0.0)).y;
			float B = texture2D(uVel, vUv - vec2(0.0, uTexel.y)).x;
			float T = texture2D(uVel, vUv + vec2(0.0, uTexel.y)).x;
			gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
		}`;
	const VORTICITY = `
		precision highp float; varying vec2 vUv;
		uniform sampler2D uVel; uniform sampler2D uCurl;
		uniform vec2 uTexel; uniform float uEps; uniform float uDt;
		void main() {
			float L = texture2D(uCurl, vUv - vec2(uTexel.x, 0.0)).x;
			float R = texture2D(uCurl, vUv + vec2(uTexel.x, 0.0)).x;
			float B = texture2D(uCurl, vUv - vec2(0.0, uTexel.y)).x;
			float T = texture2D(uCurl, vUv + vec2(0.0, uTexel.y)).x;
			float C = texture2D(uCurl, vUv).x;
			vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
			force /= length(force) + 0.0001;
			force *= uEps * C * vec2(1.0, -1.0);
			gl_FragColor = vec4(texture2D(uVel, vUv).xy + force * uDt, 0.0, 1.0);
		}`;
	const DIVERGENCE = `
		precision highp float; varying vec2 vUv;
		uniform sampler2D uVel; uniform vec2 uTexel;
		void main() {
			float L = texture2D(uVel, vUv - vec2(uTexel.x, 0.0)).x;
			float R = texture2D(uVel, vUv + vec2(uTexel.x, 0.0)).x;
			float B = texture2D(uVel, vUv - vec2(0.0, uTexel.y)).y;
			float T = texture2D(uVel, vUv + vec2(0.0, uTexel.y)).y;
			gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
		}`;
	const PRESSURE = `
		precision highp float; varying vec2 vUv;
		uniform sampler2D uPressure; uniform sampler2D uDiv; uniform vec2 uTexel;
		void main() {
			float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
			float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
			float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
			float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
			float div = texture2D(uDiv, vUv).x;
			gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
		}`;
	const GRADIENT = `
		precision highp float; varying vec2 vUv;
		uniform sampler2D uPressure; uniform sampler2D uVel; uniform vec2 uTexel;
		void main() {
			float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
			float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
			float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
			float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
			gl_FragColor = vec4(texture2D(uVel, vUv).xy - 0.5 * vec2(R - L, T - B), 0.0, 1.0);
		}`;
	const FADE = `
		precision highp float; varying vec2 vUv;
		uniform sampler2D uDye; uniform float uRate;
		void main() {
			vec4 dye = texture2D(uDye, vUv);
			gl_FragColor = dye * (1.0 - uRate);
		}`;
	const COMPOSITE = `
		precision highp float; varying vec2 vUv;
		uniform sampler2D uDye; uniform vec2 uTexel;
		void main() {
			vec4 dye = texture2D(uDye, vUv);
			float ink = clamp(dye.r, 0.0, 1.0);
			float orange = clamp(dye.g, 0.0, 1.0);
			vec3 inkCol = vec3(0.066, 0.067, 0.078);
			vec3 sigCol = vec3(1.0, 0.302, 0.0);
			float a = clamp(ink + orange, 0.0, 0.96);
			vec3 col = (inkCol * ink + sigCol * orange) / max(0.001, ink + orange);
			// wet gloss
			float hL = texture2D(uDye, vUv - vec2(uTexel.x, 0.0)).r;
			float hR = texture2D(uDye, vUv + vec2(uTexel.x, 0.0)).r;
			float hB = texture2D(uDye, vUv - vec2(0.0, uTexel.y)).r;
			float hT = texture2D(uDye, vUv + vec2(0.0, uTexel.y)).r;
			vec3 n = normalize(vec3(hL - hR, hB - hT, 0.35));
			float spec = pow(max(dot(n, normalize(vec3(0.4, 0.55, 0.73))), 0.0), 24.0);
			col += spec * 0.35 * a;
			gl_FragColor = vec4(col * a, a);
		}`;

	$effect(() => {
		if (!canvas || reduced()) {
			supported = false;
			return;
		}
		const el = canvas;
		const gl = el.getContext('webgl', { alpha: true, depth: false, stencil: false, antialias: false, premultipliedAlpha: true });
		const extHF = gl?.getExtension('OES_texture_half_float');
		const extHFL = gl?.getExtension('OES_texture_half_float_linear');
		if (!gl || !extHF || !extHFL) {
			supported = false;
			return;
		}
		supported = true;
		const HALF = extHF.HALF_FLOAT_OES as number;

		const quad = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, quad);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

		function makeProgram(frag: string) {
			const vs = gl!.createShader(gl!.VERTEX_SHADER)!;
			gl!.shaderSource(vs, VERT);
			gl!.compileShader(vs);
			const fs = gl!.createShader(gl!.FRAGMENT_SHADER)!;
			gl!.shaderSource(fs, frag);
			gl!.compileShader(fs);
			if (!gl!.getShaderParameter(fs, gl!.COMPILE_STATUS)) console.error(gl!.getShaderInfoLog(fs));
			const p = gl!.createProgram()!;
			gl!.attachShader(p, vs);
			gl!.attachShader(p, fs);
			gl!.linkProgram(p);
			return { p, loc: gl!.getAttribLocation(p, 'aPos') };
		}

		const progs = {
			advect: makeProgram(ADVECT),
			splat: makeProgram(SPLAT),
			curl: makeProgram(CURL),
			vorticity: makeProgram(VORTICITY),
			divergence: makeProgram(DIVERGENCE),
			pressure: makeProgram(PRESSURE),
			gradient: makeProgram(GRADIENT),
			fade: makeProgram(FADE),
			composite: makeProgram(COMPOSITE)
		};
		type Prog = ReturnType<typeof makeProgram>;

		function makeFBO(w: number, h: number, filter: number) {
			const tex = gl!.createTexture()!;
			gl!.bindTexture(gl!.TEXTURE_2D, tex);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
			gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, HALF, null);
			const fbo = gl!.createFramebuffer()!;
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
			gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
			gl!.clearColor(0, 0, 0, 0);
			gl!.clear(gl!.COLOR_BUFFER_BIT);
			return { tex, fbo, w, h };
		}
		type FBO = ReturnType<typeof makeFBO>;
		function makePair(w: number, h: number, filter: number) {
			return {
				a: makeFBO(w, h, filter),
				b: makeFBO(w, h, filter),
				swap() {
					const t = this.a;
					this.a = this.b;
					this.b = t;
				}
			};
		}

		function blit(target: FBO | null) {
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, target ? target.fbo : null);
			gl!.viewport(0, 0, target ? target.w : el.width, target ? target.h : el.height);
			gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
		}

		function use(prog: Prog, uniforms: Record<string, number[] | number>, textures: Record<string, WebGLTexture>) {
			gl!.useProgram(prog.p);
			gl!.bindBuffer(gl!.ARRAY_BUFFER, quad);
			gl!.enableVertexAttribArray(prog.loc);
			gl!.vertexAttribPointer(prog.loc, 2, gl!.FLOAT, false, 0, 0);
			let unit = 0;
			for (const [name, tex] of Object.entries(textures)) {
				gl!.activeTexture(gl!.TEXTURE0 + unit);
				gl!.bindTexture(gl!.TEXTURE_2D, tex);
				gl!.uniform1i(gl!.getUniformLocation(prog.p, name), unit);
				unit++;
			}
			for (const [name, v] of Object.entries(uniforms)) {
				const loc = gl!.getUniformLocation(prog.p, name);
				if (typeof v === 'number') gl!.uniform1f(loc, v);
				else if (v.length === 2) gl!.uniform2f(loc, v[0], v[1]);
				else if (v.length === 3) gl!.uniform3f(loc, v[0], v[1], v[2]);
			}
		}

		const dpr = Math.min(devicePixelRatio || 1, 1.5);
		let W = 0, Hn = 0, simW = 0, simH = 0, dyeW = 0, dyeH = 0;
		let vel: ReturnType<typeof makePair>;
		let dye: ReturnType<typeof makePair>;
		let pressure: ReturnType<typeof makePair>;
		let curlF: FBO, divF: FBO;

		function size() {
			W = el.clientWidth;
			Hn = el.clientHeight;
			el.width = Math.round(W * dpr);
			el.height = Math.round(Hn * dpr);
			simW = Math.max(64, Math.round(el.width / 4));
			simH = Math.max(64, Math.round(el.height / 4));
			dyeW = Math.max(128, Math.round(el.width / 2));
			dyeH = Math.max(128, Math.round(el.height / 2));
			vel = makePair(simW, simH, gl!.LINEAR);
			pressure = makePair(simW, simH, gl!.NEAREST);
			dye = makePair(dyeW, dyeH, gl!.LINEAR);
			curlF = makeFBO(simW, simH, gl!.NEAREST);
			divF = makeFBO(simW, simH, gl!.NEAREST);
		}

		let raf = 0;
		let visible = false;
		let hasInk = false;
		let pointerDown = false;
		let lastX = 0, lastY = 0, lastT = 0, lastMoveAt = 0, lastInput = -1e4;
		let frame = 0;

		function splat(tgt: ReturnType<typeof makePair>, x: number, y: number, vals: [number, number, number], radius: number) {
			use(progs.splat, { uPoint: [x, y], uValue: vals, uRadius: radius, uAspect: W / Hn }, { uSrc: tgt.a.tex });
			blit(tgt.b);
			tgt.swap();
		}

		function clearAll() {
			for (const f of [vel.a, vel.b, dye.a, dye.b, pressure.a, pressure.b]) {
				gl!.bindFramebuffer(gl!.FRAMEBUFFER, f.fbo);
				gl!.clearColor(0, 0, 0, 0);
				gl!.clear(gl!.COLOR_BUFFER_BIT);
			}
			hasInk = false;
			blit(null);
			gl!.clearColor(0, 0, 0, 0);
			gl!.clear(gl!.COLOR_BUFFER_BIT);
		}

		let clearSeen = clearSignal;
		$effect(() => {
			if (clearSignal !== clearSeen) {
				clearSeen = clearSignal;
				clearAll();
			}
		});

		function step() {
			const dt = 1 / 60;
			const texel: [number, number] = [1 / simW, 1 / simH];
			const now = performance.now();

			if (pointerDown && now - lastMoveAt > 250) {
				splat(dye, lastX, lastY, [0, 0.02, 0], 0.0035); // orange wells up
				hasInk = true;
			}

			use(progs.curl, { uTexel: texel }, { uVel: vel.a.tex });
			blit(curlF);
			use(progs.vorticity, { uTexel: texel, uEps: 1.8, uDt: dt }, { uVel: vel.a.tex, uCurl: curlF.tex });
			blit(vel.b);
			vel.swap();
			use(progs.divergence, { uTexel: texel }, { uVel: vel.a.tex });
			blit(divF);
			for (let i = 0; i < 18; i++) {
				use(progs.pressure, { uTexel: texel }, { uPressure: pressure.a.tex, uDiv: divF.tex });
				blit(pressure.b);
				pressure.swap();
			}
			use(progs.gradient, { uTexel: texel }, { uPressure: pressure.a.tex, uVel: vel.a.tex });
			blit(vel.b);
			vel.swap();
			use(progs.advect, { uDt: dt, uDiss: 0.995 }, { uVel: vel.a.tex, uSrc: vel.a.tex });
			blit(vel.b);
			vel.swap();
			use(progs.advect, { uDt: dt, uDiss: 1.0 }, { uVel: vel.a.tex, uSrc: dye.a.tex });
			blit(dye.b);
			dye.swap();

			// the paper drinks the ink back after 1.5s of stillness
			if (now - lastInput > 1500) {
				use(progs.fade, { uRate: 0.012 }, { uDye: dye.a.tex });
				blit(dye.b);
				dye.swap();
			}

			use(progs.composite, { uTexel: [1 / dyeW, 1 / dyeH] }, { uDye: dye.a.tex });
			blit(null);
			frame++;
		}

		function loop() {
			step();
			// keep running while visible and there is ink or recent input
			const idleLong = performance.now() - lastInput > 12000;
			raf = visible && (!idleLong || pointerDown) ? requestAnimationFrame(loop) : 0;
		}

		function wake() {
			if (!raf && visible) raf = requestAnimationFrame(loop);
		}

		function uv(e: PointerEvent) {
			const r = el.getBoundingClientRect();
			return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
		}

		function onDown(e: PointerEvent) {
			if (!e.isPrimary) return;
			const p = uv(e);
			lastX = p.x;
			lastY = p.y;
			lastT = performance.now();
			lastMoveAt = lastT;
			lastInput = lastT;
			pointerDown = true;
			try {
				el.setPointerCapture(e.pointerId);
			} catch {
				/* synthetic */
			}
			splat(dye, p.x, p.y, [0.12, 0, 0], 0.004);
			hasInk = true;
			wake();
		}

		function onMove(e: PointerEvent) {
			if (!pointerDown) return;
			const now = performance.now();
			const p = uv(e);
			const dt = Math.max(1, now - lastT) / 1000;
			const vx = (p.x - lastX) / dt;
			const vy = (p.y - lastY) / dt;
			const speed = Math.hypot(vx, vy);
			const fast = Math.min(1, Math.max(0, (speed - 0.6) / 1.2));
			splat(vel, p.x, p.y, [vx * (0.10 + fast * 0.1), vy * (0.10 + fast * 0.1), 0], 0.012 - fast * 0.007);
			splat(dye, p.x, p.y, [0.14, 0, 0], 0.005 - fast * 0.002);
			hasInk = true;
			lastX = p.x;
			lastY = p.y;
			lastT = now;
			lastMoveAt = now;
			lastInput = now;
			wake();
		}

		function onUp() {
			pointerDown = false;
			lastInput = performance.now();
		}

		size();
		const ro = new ResizeObserver(() => size());
		ro.observe(el);
		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting && !document.hidden;
			if (visible) wake();
		});
		io.observe(el);
		const onVis = () => {
			visible = !document.hidden;
			if (visible) wake();
		};
		document.addEventListener('visibilitychange', onVis);
		el.addEventListener('pointerdown', onDown);
		el.addEventListener('pointermove', onMove);
		el.addEventListener('pointerup', onUp);
		el.addEventListener('pointercancel', onUp);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
			document.removeEventListener('visibilitychange', onVis);
			el.removeEventListener('pointerdown', onDown);
			el.removeEventListener('pointermove', onMove);
			el.removeEventListener('pointerup', onUp);
			el.removeEventListener('pointercancel', onUp);
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		};
	});
</script>

<canvas
	bind:this={canvas}
	class:active
	class:hidden={!supported}
	aria-label="Wet ink brush — paint over the page; the paper drinks it back"
></canvas>

<style>
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 5;
		pointer-events: none;
	}

	canvas.active {
		pointer-events: auto;
		cursor: crosshair;
		touch-action: none;
	}

	canvas.hidden {
		display: none;
	}
</style>

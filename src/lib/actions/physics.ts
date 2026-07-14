import type { Action } from 'svelte/action';

/**
 * Shared 2D physics for the hero headline: every letter (and the orange
 * block) is a body. Grab one and throw it — it collides with its
 * neighbours, knocks them flying, and everything springs back home.
 * One rAF loop, active only while something is displaced.
 * Disabled under prefers-reduced-motion.
 */

type XY = { x: number; y: number };

type PhysicsBody = {
	el: HTMLElement;
	x: number;
	y: number;
	vx: number;
	vy: number;
	r: number; // collision radius, from the element's size
	home: XY | null; // viewport center when at rest — lazily measured
	grab: number | null; // active pointerId
	gx: number;
	gy: number;
	px: number; // previous position, for throw velocity
	py: number;
};

const bodies: PhysicsBody[] = [];
let raf = 0;
let last = 0;
let interactions = 0;
let onInteract: ((count: number) => void) | null = null;

/** Register a callback fired every time a visitor grabs a body. */
export function onHeadlineGrab(cb: (count: number) => void) {
	onInteract = cb;
}

const K = 110; // spring stiffness
const C = 11; // damping

function measureHome(b: PhysicsBody) {
	const rect = b.el.getBoundingClientRect();
	b.home = { x: rect.x + rect.width / 2 - b.x, y: rect.y + rect.height / 2 - b.y };
	b.r = Math.max(rect.width, rect.height) * 0.42;
}

function tick(now: number) {
	const dt = Math.min(32, now - last) / 1000;
	last = now;
	let active = false;

	// springs
	for (const b of bodies) {
		if (b.grab !== null) {
			active = true;
			continue;
		}
		b.vx += (-K * b.x - C * b.vx) * dt;
		b.vy += (-K * b.y - C * b.vy) * dt;
		b.x += b.vx * dt * 60;
		b.y += b.vy * dt * 60;
		if (
			Math.abs(b.x) > 0.3 ||
			Math.abs(b.y) > 0.3 ||
			Math.abs(b.vx) > 0.3 ||
			Math.abs(b.vy) > 0.3
		) {
			active = true;
		} else {
			b.x = b.y = b.vx = b.vy = 0;
		}
	}

	// collisions — only energetic bodies shove their neighbours; resting
	// letters overlap by design (that's kerning), so they never push back
	const energetic = (bd: PhysicsBody) =>
		bd.grab !== null || Math.hypot(bd.vx, bd.vy) > 3;

	for (let i = 0; i < bodies.length; i++) {
		const a = bodies[i];
		if (!a.home) measureHome(a);
		for (let j = i + 1; j < bodies.length; j++) {
			const b = bodies[j];
			if (!b.home) measureHome(b);
			if (!energetic(a) && !energetic(b)) continue;
			const ax = a.home!.x + a.x;
			const ay = a.home!.y + a.y;
			const bx = b.home!.x + b.x;
			const by = b.home!.y + b.y;
			const dx = bx - ax;
			const dy = by - ay;
			const dist = Math.hypot(dx, dy) || 1;
			const minDist = (a.r + b.r) * 0.72;
			if (dist >= minDist) continue;
			const push = ((minDist - dist) / dist) * 14;
			const nx = dx * push;
			const ny = dy * push;
			if (a.grab === null) {
				a.vx -= nx;
				a.vy -= ny;
			}
			if (b.grab === null) {
				b.vx += nx;
				b.vy += ny;
			}
			active = true;
		}
	}

	for (const b of bodies) {
		b.el.style.transform = b.x || b.y ? `translate(${b.x}px, ${b.y}px)` : '';
	}

	raf = active ? requestAnimationFrame(tick) : 0;
}

function wake() {
	if (!raf) {
		last = performance.now();
		raf = requestAnimationFrame(tick);
	}
}

export const physicsBody: Action<HTMLElement> = (node) => {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const b: PhysicsBody = {
		el: node,
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		r: 40,
		home: null,
		grab: null,
		gx: 0,
		gy: 0,
		px: 0,
		py: 0
	};
	bodies.push(b);

	node.style.touchAction = 'pan-y'; // vertical swipes still scroll on touch
	node.style.cursor = 'grab';
	node.style.willChange = 'transform';

	// homes shift when layout changes — remeasure everything on resize
	const onResize = () => bodies.forEach((body) => (body.home = null));
	window.addEventListener('resize', onResize);

	function onDown(e: PointerEvent) {
		if (b.grab !== null || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
		b.grab = e.pointerId;
		b.gx = e.clientX - b.x;
		b.gy = e.clientY - b.y;
		b.px = b.x;
		b.py = b.y;
		try {
			node.setPointerCapture(e.pointerId);
		} catch {
			// synthetic/inactive pointer — drag still works while over the node
		}
		node.style.cursor = 'grabbing';
		onInteract?.(++interactions);
		wake();
	}

	function onMove(e: PointerEvent) {
		if (e.pointerId !== b.grab) return;
		b.px = b.x;
		b.py = b.y;
		b.x = e.clientX - b.gx;
		b.y = e.clientY - b.gy;
		b.vx = (b.x - b.px) * 3; // carry throw velocity
		b.vy = (b.y - b.py) * 3;
		wake();
	}

	function onUp(e: PointerEvent) {
		if (e.pointerId !== b.grab) return;
		b.grab = null;
		node.style.cursor = 'grab';
		wake();
	}

	node.addEventListener('pointerdown', onDown);
	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerup', onUp);
	node.addEventListener('pointercancel', onUp);

	return {
		destroy() {
			bodies.splice(bodies.indexOf(b), 1);
			if (!bodies.length) {
				cancelAnimationFrame(raf);
				raf = 0;
			}
			window.removeEventListener('resize', onResize);
			node.removeEventListener('pointerdown', onDown);
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerup', onUp);
			node.removeEventListener('pointercancel', onUp);
		}
	};
};

import type { Action } from 'svelte/action';

/** Elements lean gently toward the cursor and spring back on leave. */
export const magnetic: Action<HTMLElement> = (node) => {
	if (
		matchMedia('(prefers-reduced-motion: reduce)').matches ||
		matchMedia('(pointer: coarse)').matches
	) {
		return;
	}

	const strength = 0.25;

	function onMove(e: PointerEvent) {
		const rect = node.getBoundingClientRect();
		const dx = e.clientX - (rect.left + rect.width / 2);
		const dy = e.clientY - (rect.top + rect.height / 2);
		node.style.transition = 'transform 0.1s linear';
		node.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
	}

	function onLeave() {
		node.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
		node.style.transform = 'translate(0, 0)';
	}

	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', onLeave);
	return {
		destroy() {
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
		}
	};
};

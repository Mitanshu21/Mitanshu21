import type { Action } from 'svelte/action';

/**
 * Fades/slides an element in the first time it enters the viewport.
 * Usage: <div use:reveal> or <div use:reveal={{ delay: 120 }}>
 * Motion is disabled automatically via CSS for prefers-reduced-motion.
 */
export const reveal: Action<HTMLElement, { delay?: number } | undefined> = (node, params) => {
	node.classList.add('reveal');
	if (params?.delay) node.style.transitionDelay = `${params.delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('revealed');
					observer.unobserve(node);
				}
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);
	return {
		destroy() {
			observer.disconnect();
		}
	};
};

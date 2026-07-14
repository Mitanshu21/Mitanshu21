import type { Action } from 'svelte/action';

/**
 * Apple-style scroll entrance: elements rise and fade in the first time
 * they enter the viewport. The hidden state only exists under `html.js`
 * (set pre-paint in app.html), so content is never gated on JS.
 */
export const rise: Action<HTMLElement, { delay?: number } | undefined> = (node, params) => {
	node.classList.add('rise');
	if (params?.delay) node.style.setProperty('--rise-d', `${params.delay}ms`);

	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				node.classList.add('in');
				observer.disconnect();
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};

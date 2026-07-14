/** Scroll to a section, honouring prefers-reduced-motion. */
export function scrollToSection(id: string) {
	document.getElementById(id)?.scrollIntoView({
		behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
	});
}

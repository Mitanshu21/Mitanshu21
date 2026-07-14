// ─────────────────────────────────────────────────────────────
// All site content lives here. Edit this file — nothing else —
// to change what the portfolio says.
// ─────────────────────────────────────────────────────────────
import stars from './stars.json';

export const profile = {
	name: 'Mitanshu Patel',
	role: 'Full-Stack Developer',
	est: 2021,
	tagline: 'Software that feels instant.',
	intro:
		'I’m Mitanshu — a full-stack developer shipping end-to-end products in Svelte, React, Node.js and Python. I obsess over the milliseconds: this page carries less JavaScript than most cookie banners.',
	email: 'mitanshu@indidino.com',
	github: 'https://github.com/Mitanshu21',
	githubHandle: 'GITHUB.COM/MITANSHU21',
	// Add your LinkedIn URL to show the link, e.g. 'https://linkedin.com/in/...'
	linkedin: '',
	// Drop resume.pdf into /static and set this to 'resume.pdf' to show the link
	resume: '',
	available: true,
	availabilityNote: 'Open to work'
};

export const about = {
	paragraphs: [
		'I build products end to end — from data models and APIs to pixel-level UI polish. My work spans dashboards, admin tools, CMS plugins and consumer-facing apps.',
		'Lately I’ve been deep in the Svelte ecosystem for its speed and simplicity, while shipping production work in React and Node. I like small bundles, fast first paints and code that the next developer can actually read.'
	],
	skills: [
		{ group: 'Frontend', items: ['Svelte — SvelteKit', 'React', 'Next.js', 'TypeScript', 'Redux'] },
		{ group: 'Backend', items: ['Node — Express', 'Django', 'Python'] },
		{ group: 'Data', items: ['MongoDB', 'MySQL', 'Firebase', 'AWS S3', 'Strapi'] },
		{ group: 'Design', items: ['Figma', 'Design systems'] }
	]
};

// TODO(Mitanshu): confirm the dates. Only real employment renders here —
// never fake dates in a ruled ledger.
export const experience = [
	{
		role: 'Full Stack Developer',
		company: 'Indidino',
		period: '2023 — Present',
		current: true,
		summary:
			'Building and shipping full-stack products — React and Svelte frontends backed by Node.js services, MongoDB and AWS.',
		highlights: ['React', 'Svelte', 'Node.js', 'MongoDB', 'AWS S3']
	}
];

export const projects = [
	{
		title: 'React Calculator',
		repo: 'react-calculator',
		description:
			'A study in getting the basics pixel-perfect. Starred by 39 developers, forked 68 times — learners around the world use it as their reference build.',
		tech: ['React', 'JS', 'CSS'],
		github: 'https://github.com/Mitanshu21/react-calculator',
		live: 'https://mitanshu21.github.io/react-calculator/'
	},
	{
		title: 'Strapi S3 Plugin',
		repo: 'strapi-s3-upload-custom-plugin',
		description:
			'Hit a real production gap, closed it, open-sourced it — direct-to-S3 image uploads with tagging for Strapi CMS. Still doing its job today.',
		tech: ['Strapi', 'Node', 'AWS S3'],
		github: 'https://github.com/Mitanshu21/strapi-s3-upload-custom-plugin',
		live: ''
	},
	{
		title: 'Control Center',
		repo: 'control-center',
		description:
			'An operations dashboard that loads before you finish blinking — Svelte, sub-second everything, barely any JavaScript shipped.',
		tech: ['Svelte', 'TS'],
		github: 'https://github.com/Mitanshu21/control-center',
		live: ''
	},
	{
		title: 'Admin Panel',
		repo: 'admin-panel',
		description:
			'Data tables, CRUD flows, auth — the unglamorous internal tooling every product team runs on, built to just work.',
		tech: ['React', 'Node', 'MongoDB'],
		github: 'https://github.com/Mitanshu21/admin-panel',
		live: ''
	},
	{
		title: 'Discussion Forum',
		repo: 'Discussion-Forum',
		description:
			'Threads, replies, accounts — my first full data model, designed from scratch. It taught me more than any tutorial ever did.',
		tech: ['HTML', 'JS', 'MySQL'],
		github: 'https://github.com/Mitanshu21/Discussion-Forum',
		live: ''
	},
	{
		title: 'React Todo',
		repo: 'react-todo',
		description:
			'Small scope, carefully finished — tidy component architecture, local persistence, no loose ends.',
		tech: ['React', 'JS'],
		github: 'https://github.com/Mitanshu21/react-todo',
		live: 'https://mitanshu21.github.io/react-todo/'
	}
].map((p) => ({ ...p, stars: (stars as Record<string, number>)[p.repo] ?? 0 }));

export const sections = [
	{ id: 'top', num: '01', label: 'Index', note: '' },
	{ id: 'about', num: '02', label: 'About', note: 'Who' },
	{ id: 'experience', num: '03', label: 'Experience', note: 'Where' },
	{ id: 'work', num: '04', label: 'Work', note: 'Proof' },
	{ id: 'contact', num: '05', label: 'Contact', note: 'Talk' }
];

export const marqueeText = 'Software that feels instant — ';

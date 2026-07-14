// ─────────────────────────────────────────────────────────────
// All site content lives here. Edit this file — nothing else —
// to change what the datasheet says.
// ─────────────────────────────────────────────────────────────
import stars from './stars.json';

export const profile = {
	name: 'Mitanshu Patel',
	part: 'MITANSHU-21',
	role: 'AI & Full-Stack Engineer',
	est: 2021,
	tagline: 'A human, documented like hardware.',
	shortDesc:
		'General-purpose AI & full-stack engineer. Ships models, APIs and interfaces end to end. Low latency, high reliability, self-documenting.',
	email: 'mitanshu2531@gmail.com',
	github: 'https://github.com/Mitanshu21',
	githubHandle: 'GITHUB.COM/MITANSHU21',
	// Add your LinkedIn URL to show the link, e.g. 'https://linkedin.com/in/...'
	linkedin: '',
	// Drop resume.pdf into /static and set this to 'resume.pdf' to show the link
	resume: '',
	available: true,
	availabilityNote: 'In production — open to work'
};

export const features = [
	'Full-stack: Svelte, React, Node.js, Python — one package',
	'On-device AI demos included (see §4, Characteristic Curves)',
	'39★ open-source track record, 68 forks in the field',
	'Sub-second render targets on all interfaces',
	'LLM-integration ready, prompt-tolerant',
	'Self-hosting, self-documenting, self-deprecating'
];

export const applications = [
	'Startups shipping their first product',
	'AI features that need to reach production',
	'Dashboards, admin tools, internal platforms',
	'CMS builds and content pipelines',
	'Freelance rescues of stalled codebases'
];

// ABSOLUTE MAXIMUM RATINGS — exceeding these may impair reliability
export const maxRatings = [
	{ param: 'Consecutive meetings', symbol: 'N(MTG)', value: '3', unit: 'meetings' },
	{ param: 'Caffeine intake', symbol: 'C(MAX)', value: '400', unit: 'mg/day' },
	{ param: 'Scope creep tolerance', symbol: 'S(CRP)', value: '15', unit: '%/sprint' },
	{ param: 'Time to first commit', symbol: 't(FC)', value: '24', unit: 'h' },
	{ param: 'JavaScript shipped per page', symbol: 'JS(MAX)', value: '50', unit: 'kB gzip' }
];

// §1 GENERAL DESCRIPTION at three sampling temperatures.
// The visitor drags the dial; the text re-samples.
export const bioVariants = {
	low: 'MITANSHU-21 is a versatile engineering unit designed for end-to-end software delivery. The device integrates model-layer, API-layer and interface-layer processing in a single package, and has been validated in production environments since 2021. Typical applications include AI-enabled products, dashboards and content platforms. Contact sales for volume enquiries.',
	mid: 'I’m Mitanshu — an AI engineer who ships the whole stack: models, APIs and interfaces. The curves in §4 aren’t stock photos; they’re neural networks training in your browser right now, with backprop I wrote by hand. I like small bundles, fast first paints and code the next engineer can actually read.',
	high: 'ok so imagine a guy who thinks cold starts are a personal insult. that’s me. i write backprop for FUN. i have opinions about kerning. my neural nets live in YOUR browser rent-free. svelte chose ME. somewhere out there a cookie banner is shipping more javascript than this entire website and honestly? unforgivable. hire me before the temperature goes higher.'
};

export const about = {
	paragraphs: [
		'I build products end to end — from data models and APIs to pixel-level UI polish. My work spans dashboards, admin tools, CMS plugins and consumer-facing apps.',
		'Lately I’ve been deep in the Svelte ecosystem for its speed and simplicity, while shipping production work in React and Node. I like small bundles, fast first paints and code that the next developer can actually read.'
	],
	skills: [
		// TODO(Mitanshu): tune the AI/ML row to match your real experience
		{
			group: 'AI / ML',
			items: ['LLM integration', 'Python', 'Neural nets from scratch', 'Prompt engineering']
		},
		{ group: 'Frontend', items: ['Svelte — SvelteKit', 'React', 'Next.js', 'TypeScript'] },
		{ group: 'Backend', items: ['Node — Express', 'Django', 'Python'] },
		{ group: 'Data', items: ['MongoDB', 'MySQL', 'Firebase', 'AWS S3', 'Strapi'] },
		{ group: 'Design', items: ['Figma', 'Design systems'] }
	]
};

// §5 OPERATING HISTORY
// TODO(Mitanshu): entries below the first are DEMO placeholders —
// replace roles, companies, dates and summaries with your real history.
export const experience = [
	{
		role: 'Full Stack Developer',
		company: 'Indidino',
		period: '2023 — Present',
		current: true,
		summary:
			'Building and shipping full-stack products — React and Svelte frontends backed by Node.js services, MongoDB and AWS.',
		highlights: ['React', 'Svelte', 'Node.js', 'MongoDB', 'AWS S3']
	},
	{
		role: 'Frontend Developer',
		company: 'Previous Company', // TODO: replace
		period: '2022 — 2023', // TODO: replace
		current: false,
		summary:
			'Built and maintained production React applications — component libraries, dashboards and client-facing features shipped on tight cycles.',
		highlights: ['React', 'TypeScript', 'Redux', 'REST APIs']
	},
	{
		role: 'Freelance Web Developer',
		company: 'Self-Employed', // TODO: replace
		period: '2021 — 2022', // TODO: replace
		current: false,
		summary:
			'Took client projects end to end — landing pages, small web apps and CMS builds — owning everything from estimate to deploy.',
		highlights: ['JavaScript', 'Node.js', 'MySQL', 'Firebase']
	}
];

// §3 BENCHMARKS
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

// table of contents / section registry
export const sections = [
	{ id: 'top', num: '0', label: 'Cover', note: 'Part summary' },
	{ id: 'description', num: '1', label: 'General Description', note: 'Adjustable temperature' },
	{ id: 'diagram', num: '2', label: 'Block Diagram', note: 'Functional' },
	{ id: 'work', num: '3', label: 'Benchmarks', note: 'Shipped & measured' },
	{ id: 'lab', num: '4', label: 'Characteristic Curves', note: 'Live, in-browser' },
	{ id: 'experience', num: '5', label: 'Operating History', note: 'Field record' },
	{ id: 'contact', num: '6', label: 'Application Circuit', note: 'How to connect' }
];

// footer REVISION HISTORY (newest first) — keep honest, keep short
export const revisions = [
	{ rev: '4.0', date: '2026-07', change: 'Complete redesign — the datasheet. You are reading it.' },
	{ rev: '3.0', date: '2026-07', change: 'Editorial broadsheet, headline physics, the lab, ⌘K console.' },
	{ rev: '2.0', date: '2026-07', change: 'Dark neural-canvas concept. Rejected: looked like a template.' },
	{ rev: '1.0', date: '2026-07', change: 'First SvelteKit build.' },
	{ rev: '0.1', date: '2021', change: 'Initial silicon: first commit to GitHub.' }
];

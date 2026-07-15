// ─────────────────────────────────────────────────────────────
// All site content lives here. Edit this file — nothing else —
// to change what the portfolio says.
// ─────────────────────────────────────────────────────────────
import stars from './stars.json';

export const profile = {
	name: 'Mitanshu Patel',
	role: 'AI & Full-Stack Engineer',
	est: 2021,
	tagline: 'Software that feels instant.',
	intro:
		'I’m Mitanshu — an AI engineer who ships the whole stack: models, APIs and interfaces. Even this page is hand-written down to its physics — grab the headline, or flip the brush and paint on it.',
	email: 'mitanshu2531@gmail.com',
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
		// TODO(Mitanshu): tune the AI/ML row to match your real experience
		{ group: 'AI / ML', items: ['LLM integration', 'Python', 'Neural nets from scratch', 'Prompt engineering'] },
		{ group: 'Frontend', items: ['Svelte — SvelteKit', 'React', 'Next.js', 'TypeScript'] },
		{ group: 'Backend', items: ['Node — Express', 'Django', 'Python'] },
		{ group: 'Data', items: ['MongoDB', 'MySQL', 'Firebase', 'AWS S3', 'Strapi'] },
		{ group: 'Design', items: ['Figma', 'Design systems'] }
	]
};

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
	{ id: 'top', num: '01', label: 'Index', note: 'Wet brush lives here' },
	{ id: 'about', num: '02', label: 'About', note: 'Who' },
	{ id: 'evolution', num: '03', label: 'Evolution', note: 'Level up' },
	{ id: 'experience', num: '04', label: 'Experience', note: 'Where' },
	{ id: 'work', num: '05', label: 'Work', note: 'Proof' },
	{ id: 'contact', num: '06', label: 'Contact', note: 'Talk' }
];

// 04 — EVOLUTION: the character progression screen.
// TODO(Mitanshu): dates and stories for LV.2-LV.4 are best guesses — correct them.
export const evolution = [
	{
		lv: 1,
		year: '2021',
		title: 'Spawn point',
		story: 'First commit pushed to GitHub. HTML, CSS and vanilla JS — the starter kit.',
		unlocked: ['HTML/CSS', 'JavaScript', 'Git']
	},
	{
		lv: 2,
		year: '2021 — 2022',
		title: 'Freelance quests',
		story: 'First real clients, first real deadlines. Landing pages, small apps and CMS builds — shipped end to end, alone.',
		unlocked: ['React', 'Node.js', 'MySQL', 'Client diplomacy']
	},
	{
		lv: 3,
		year: '2022 — 2023',
		title: 'Production arc',
		story: 'Production React applications — component libraries, dashboards, tight release cycles.',
		unlocked: ['TypeScript', 'Redux', 'REST APIs']
	},
	{
		lv: 4,
		year: '2023',
		title: 'Full-stack class change',
		story: 'Joined Indidino. Owning features from database schema to final pixel.',
		unlocked: ['MongoDB', 'AWS S3', 'Django']
	},
	{
		lv: 5,
		year: '2024 — 2025',
		title: 'Weapon of choice',
		story: 'Discovered Svelte and never looked back — speed became the whole point.',
		unlocked: ['Svelte', 'SvelteKit', 'Performance obsession']
	},
	{
		lv: 6,
		year: '2025 — NOW',
		title: 'The AI arc',
		story: 'Neural nets written by hand, LLMs in production — shipping intelligence, not demos.',
		unlocked: ['Backprop by hand', 'LLM integration', 'Python ML'],
		current: true
	}
];

export const marqueeText = 'Software that feels instant — ';

// ─────────────────────────────────────────────────────────────
// All site content lives here. Edit this file — nothing else —
// to change what the portfolio says.
// ─────────────────────────────────────────────────────────────

export const profile = {
	name: 'Mitanshu Patel',
	role: 'Full Stack Developer',
	tagline: 'Building fast, minimal software for the modern web.',
	intro:
		'I’m Mitanshu — a full-stack developer working across Svelte, React, Node.js and Python. I care about performance, clean architecture and interfaces that feel effortless.',
	email: 'mitanshu@indidino.com',
	github: 'https://github.com/Mitanshu21',
	// Add your LinkedIn URL to show the link, e.g. 'https://linkedin.com/in/...'
	linkedin: '',
	// Drop resume.pdf into /static and set this to 'resume.pdf' to show the button
	resume: '',
	available: true,
	availabilityNote: 'Open to new opportunities'
};

export const about = {
	paragraphs: [
		'I build products end to end — from data models and APIs to pixel-level UI polish. My work spans dashboards, admin tools, CMS plugins and consumer-facing apps.',
		'Lately I’ve been deep in the Svelte ecosystem for its speed and simplicity, while shipping production work in React and Node. I like small bundles, fast first paints and code that the next developer can actually read.'
	],
	skills: [
		{ group: 'Frontend', items: ['Svelte / SvelteKit', 'React', 'Next.js', 'TypeScript', 'Redux'] },
		{ group: 'Backend', items: ['Node.js', 'Express', 'Django', 'Python'] },
		{ group: 'Data & Infra', items: ['MongoDB', 'MySQL', 'Firebase', 'AWS S3', 'Strapi'] },
		{ group: 'Design', items: ['Figma', 'Design systems'] }
	]
};

// TODO(Mitanshu): replace with your real work history — titles, companies and dates below are placeholders.
export const experience = [
	{
		role: 'Full Stack Developer',
		company: 'Indidino',
		period: '2023 — Present',
		summary:
			'Building and shipping full-stack products — React and Svelte frontends backed by Node.js services, MongoDB and AWS.',
		highlights: ['React', 'Svelte', 'Node.js', 'MongoDB', 'AWS S3']
	},
	{
		role: 'Software Developer',
		company: 'Previous Company', // TODO: replace
		period: '2021 — 2023', // TODO: replace
		summary:
			'Developed internal tools and client applications; owned features from database schema to deployed UI.',
		highlights: ['JavaScript', 'Express', 'MySQL']
	}
];

export const projects = [
	{
		title: 'React Calculator',
		description:
			'A clean iOS-style calculator built with React. One of my most-used open-source repos — starred by 39 developers and forked 68 times as a learning reference.',
		tech: ['React', 'JavaScript', 'CSS'],
		github: 'https://github.com/Mitanshu21/react-calculator',
		live: 'https://mitanshu21.github.io/react-calculator/',
		stars: 39
	},
	{
		title: 'Strapi S3 Upload Plugin',
		description:
			'A custom Strapi CMS plugin that uploads images to an AWS S3 bucket with tagging support — built to solve a real production need and open-sourced.',
		tech: ['Strapi', 'Node.js', 'AWS S3'],
		github: 'https://github.com/Mitanshu21/strapi-s3-upload-custom-plugin',
		live: '',
		stars: 1
	},
	{
		title: 'Control Center',
		description:
			'An operations dashboard built with Svelte — fast, reactive UI with minimal JavaScript shipped to the browser.',
		tech: ['Svelte', 'TypeScript'],
		github: 'https://github.com/Mitanshu21/control-center',
		live: '',
		stars: 0
	},
	{
		title: 'Admin Panel',
		description:
			'A full admin dashboard with data tables, CRUD flows and authentication — the kind of internal tooling every product team needs.',
		tech: ['React', 'Node.js', 'MongoDB'],
		github: 'https://github.com/Mitanshu21/admin-panel',
		live: '',
		stars: 1
	},
	{
		title: 'Discussion Forum',
		description:
			'A community discussion platform with threads, replies and user accounts — an early full-stack build that taught me a lot about data modelling.',
		tech: ['HTML', 'JavaScript', 'MySQL'],
		github: 'https://github.com/Mitanshu21/Discussion-Forum',
		live: '',
		stars: 0
	},
	{
		title: 'React Todo',
		description:
			'A task manager with a tidy component architecture and local persistence. Small scope, carefully finished.',
		tech: ['React', 'JavaScript'],
		github: 'https://github.com/Mitanshu21/react-todo',
		live: 'https://mitanshu21.github.io/react-todo/',
		stars: 5
	}
];

// Add posts here to reveal the Writing section, e.g.
// { title: 'Why I moved to Svelte', url: 'https://...', date: '2026-07-01' }
export const writing: { title: string; url: string; date: string }[] = [];

// Refreshes src/lib/stars.json from the GitHub API before build.
// On any failure the committed values are kept — the ledger never lies,
// it just gets a little stale.
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../src/lib/stars.json', import.meta.url);
const current = JSON.parse(await readFile(FILE, 'utf8'));

try {
	const res = await fetch('https://api.github.com/users/Mitanshu21/repos?per_page=100');
	if (!res.ok) throw new Error(`GitHub API ${res.status}`);
	const repos = await res.json();
	for (const repo of repos) {
		if (repo.name in current) current[repo.name] = repo.stargazers_count;
	}
	await writeFile(FILE, JSON.stringify(current, null, '\t') + '\n');
	console.log('[stars] refreshed:', current);
} catch (err) {
	console.warn('[stars] fetch failed, keeping committed values —', err.message);
}

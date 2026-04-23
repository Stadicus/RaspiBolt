// Refresh the committed contributor list at lib/contributors.json.
// Source of truth is the upstream repo's GitHub API, filtered to human
// accounts and reduced to the fields the <Contributors /> component needs.
// Run via `npm run update:contributors`. Intentionally off the build
// critical path; the committed JSON is what ships.
//
// Override defaults via env:
//   REPO=owner/name    (default raspibolt/raspibolt)
//   GITHUB_TOKEN=ghp_…  (optional, lifts the 60/h unauth rate limit)

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = process.env.REPO ?? 'raspibolt/raspibolt';
const url = `https://api.github.com/repos/${repo}/contributors?per_page=100`;

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'raspibolt-build-script',
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const res = await fetch(url, { headers });
if (!res.ok) {
  const body = await res.text().catch(() => '');
  throw new Error(`GitHub API ${res.status}: ${body.slice(0, 200)}`);
}

const raw = await res.json();

// Drop bots (type=Bot) and the web-flow synthetic account that represents
// commits made through the GitHub web UI (merges, direct edits).
const skipLogins = new Set(['web-flow']);
const list = raw
  .filter((c) => c.type === 'User' && !skipLogins.has(c.login))
  .map((c) => ({
    login: c.login,
    avatar_url: c.avatar_url,
    html_url: c.html_url,
    contributions: c.contributions,
  }));

const out = resolve('lib/contributors.json');
writeFileSync(out, JSON.stringify(list, null, 2) + '\n');
console.log(`Wrote ${list.length} contributors from ${repo} to ${out}`);

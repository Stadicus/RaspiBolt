export const appName = 'RaspiBolt';
export const appTagline = 'Self-custody Bitcoin & Lightning on a Raspberry Pi';
export const appDescription =
  'A step-by-step guide to building your own sovereign Bitcoin and Lightning node on a Raspberry Pi. No custodian, no cloud, just you and the protocol.';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// Canonical site URL for Open Graph, Twitter cards, sitemap, and
// canonical links. Defaults to the GitHub Pages staging target;
// override via NEXT_PUBLIC_SITE_URL when cutting over to raspibolt.org.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stadicus.github.io/RaspiBolt';

// True when we're building for the canonical production domain.
// Everything else (staging, PR previews, local dev) is treated as
// non-production and kept out of search indexes.
export const isProductionSite = siteUrl === 'https://raspibolt.org';

export const gitConfig = {
  user: 'Stadicus',
  repo: 'RaspiBolt',
  branch: 'feature/v4-rewrite',
};

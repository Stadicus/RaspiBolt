import { source } from './source';

// Build a url->metadata map for every page in the docs tree. Server-only;
// used by the docs layout to hand a single static manifest down to the
// client-side link-preview component. The manifest is small (~60 pages,
// ~12 kB), so it rides in the initial HTML instead of being fetched.
export type PageManifestEntry = {
  title: string;
  description?: string;
};

export type PageManifest = Record<string, PageManifestEntry>;

export function getPageManifest(): PageManifest {
  const manifest: PageManifest = {};
  for (const page of source.getPages()) {
    manifest[page.url] = {
      title: page.data.title,
      description: page.data.description,
    };
  }
  return manifest;
}

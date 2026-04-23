import { getPageImage, source } from './source';
import { appName, siteUrl } from './shared';

type Page = ReturnType<typeof source.getPage>;

// Schema.org Article + BreadcrumbList for a docs page. Emitted as two
// <script type="application/ld+json"> blocks. Google uses Article for
// rich results on developer docs; BreadcrumbList shows the nav path in
// SERP snippets.

export function articleSchema(page: NonNullable<Page>) {
  const lastModified = (page.data as { lastModified?: Date | string }).lastModified;
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.data.title,
    description: page.data.description,
    image: `${siteUrl}${getPageImage(page).url}`,
    ...(lastModified
      ? {
          datePublished: new Date(lastModified).toISOString(),
          dateModified: new Date(lastModified).toISOString(),
        }
      : {}),
    author: { '@type': 'Person', name: 'Stadicus', url: 'https://stadicus.com' },
    publisher: {
      '@type': 'Organization',
      name: appName,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.png` },
    },
    mainEntityOfPage: `${siteUrl}${page.url}`,
  };
}

export function breadcrumbSchema(slugs: string[]) {
  const items: { name: string; url: string }[] = [{ name: 'Docs', url: `${siteUrl}/docs` }];

  for (let i = 1; i <= slugs.length; i++) {
    const partial = slugs.slice(0, i);
    const p = source.getPage(partial);
    if (p) items.push({ name: p.data.title, url: `${siteUrl}${p.url}` });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };
}

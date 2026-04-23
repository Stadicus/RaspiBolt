import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { siteUrl } from '@/lib/shared';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();
  const now = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...pages.map((page) => {
      const lastModified = (page.data as { lastModified?: Date | string }).lastModified ?? now;
      return {
        url: `${siteUrl}${page.url}`,
        lastModified: typeof lastModified === 'string' ? new Date(lastModified) : lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
    }),
  ];
}

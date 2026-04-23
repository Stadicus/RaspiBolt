import type { MetadataRoute } from 'next';
import { isProductionSite, siteUrl } from '@/lib/shared';

export const dynamic = 'force-static';

// On non-production builds (staging, PR previews, local dev) ship a
// Disallow-all robots.txt so crawlers that respect it won't index
// the mirror. The <meta name="robots" content="noindex"> handles the
// ones that don't read robots.txt.
export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

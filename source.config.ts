import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import { remarkVariables } from './lib/remark-variables';

// Content lives in /guide/ at the repo root. The Next.js project sits
// alongside it so external contributors can find and edit MDX without
// touching any application code.
export const docs = defineDocs({
  dir: 'guide',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkPlugins: (v) => [remarkVariables, remarkMdxMermaid, ...v],
    rehypeCodeOptions: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      // Inherit Fumadocs defaults for langs, langAlias, transformers (tabs,
      // icon). Only the theme changes.
    },
  },
});

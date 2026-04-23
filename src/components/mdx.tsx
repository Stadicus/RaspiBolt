import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Mermaid } from './mermaid';
import { AnchorWithPreview } from './link-preview';
import { Contributors } from './contributors';
import { Screenshot } from './screenshot';
import { VideoEmbed } from './video-embed';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Mermaid,
    Contributors,
    Screenshot,
    VideoEmbed,
    a: AnchorWithPreview,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

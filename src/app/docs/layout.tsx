import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { ReadingProgress } from '@/components/reading-progress';
import { PageManifestProvider } from '@/components/link-preview';
import { getPageManifest } from '@/lib/page-manifest';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const manifest = getPageManifest();
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      <ReadingProgress />
      <PageManifestProvider manifest={manifest}>{children}</PageManifestProvider>
    </DocsLayout>
  );
}

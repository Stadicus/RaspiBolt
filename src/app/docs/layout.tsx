import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { AccordionFolder, SidebarAccordionProvider } from '@/components/sidebar-accordion';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      sidebar={{ components: { Folder: AccordionFolder } }}
      {...baseOptions()}
    >
      <SidebarAccordionProvider>{children}</SidebarAccordionProvider>
    </DocsLayout>
  );
}

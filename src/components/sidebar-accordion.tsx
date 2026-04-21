'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import Link from 'fumadocs-core/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'fumadocs-ui/components/ui/collapsible';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type * as PageTree from 'fumadocs-core/page-tree';
import { cn } from '@/lib/cn';

// Single-open accordion for the top level of the Fumadocs docs sidebar.
// Fumadocs' built-in SidebarFolder uses internal useState(defaultOpen) and
// does not accept a controlled `open` prop, so top-level folders cannot
// coordinate with each other out of the box. This component drives Radix
// Collapsible directly from a shared context: clicking one top-level
// section closes the previously-open one.
//
// The component registers as `DocsLayout.sidebar.components.Folder`. Only
// depth-1 items (the root-level sections in guide/meta.json) participate;
// nested folders fall through to Fumadocs' default rendering via the same
// component tree returned from renderChildren.

type AccordionContextValue = {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

const AccordionContext = createContext<AccordionContextValue>({
  activeId: null,
  setActiveId: () => {},
});

export function SidebarAccordionProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const value = useMemo(() => ({ activeId, setActiveId }), [activeId]);
  return <AccordionContext.Provider value={value}>{children}</AccordionContext.Provider>;
}

function folderContainsPath(folder: PageTree.Folder, pathname: string): boolean {
  if (folder.index?.url === pathname) return true;
  return folder.children.some((child: PageTree.Node) => {
    if ('url' in child && child.url === pathname) return true;
    if (child.type === 'folder') return folderContainsPath(child, pathname);
    return false;
  });
}

const rowClasses =
  'inline-flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground data-[state=open]:text-fd-foreground';

function SingleOpenFolder({ item, children }: { item: PageTree.Folder; children: ReactNode }) {
  const pathname = usePathname();
  const { activeId, setActiveId } = useContext(AccordionContext);

  const id =
    (item as PageTree.Folder & { $id?: string }).$id ?? item.index?.url ?? String(item.name ?? '');

  const hasActiveChild = folderContainsPath(item, pathname);
  const open = activeId === id || hasActiveChild;
  const linkActive = item.index?.url === pathname;

  const onOpenChange = (next: boolean) => {
    setActiveId(next ? id : activeId === id ? null : activeId);
  };

  const trigger = item.index ? (
    <CollapsibleTrigger asChild>
      <Link
        href={item.index.url}
        data-active={linkActive}
        className={cn(
          rowClasses,
          'data-[active=true]:text-fd-primary data-[active=true]:bg-fd-primary/10',
        )}
      >
        {item.icon}
        <span className="flex-1 text-start">{item.name}</span>
        <ChevronDown
          data-icon
          className={cn('size-4 transition-transform', !open && '-rotate-90')}
        />
      </Link>
    </CollapsibleTrigger>
  ) : (
    <CollapsibleTrigger className={rowClasses}>
      {item.icon}
      <span className="flex-1 text-start">{item.name}</span>
      <ChevronDown data-icon className={cn('size-4 transition-transform', !open && '-rotate-90')} />
    </CollapsibleTrigger>
  );

  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="flex flex-col">
      {trigger}
      <CollapsibleContent className="border-fd-border my-0.5 ms-3 flex flex-col border-s ps-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

// Default folder rendering for nested (non-top-level) folders. Uses the
// same Collapsible primitive but with Fumadocs' standard meta.json-driven
// defaultOpen, not the shared accordion state.
function NestedFolder({ item, children }: { item: PageTree.Folder; children: ReactNode }) {
  const pathname = usePathname();
  const hasActiveChild = folderContainsPath(item, pathname);
  const defaultOpen = item.defaultOpen ?? hasActiveChild;
  const linkActive = item.index?.url === pathname;

  const trigger = item.index ? (
    <CollapsibleTrigger asChild>
      <Link
        href={item.index.url}
        data-active={linkActive}
        className={cn(
          rowClasses,
          'data-[active=true]:text-fd-primary data-[active=true]:bg-fd-primary/10',
        )}
      >
        {item.icon}
        <span className="flex-1 text-start">{item.name}</span>
        <ChevronDown
          data-icon
          className="size-4 transition-transform group-data-[state=closed]/col:-rotate-90"
        />
      </Link>
    </CollapsibleTrigger>
  ) : (
    <CollapsibleTrigger className={rowClasses}>
      {item.icon}
      <span className="flex-1 text-start">{item.name}</span>
      <ChevronDown
        data-icon
        className="size-4 transition-transform group-data-[state=closed]/col:-rotate-90"
      />
    </CollapsibleTrigger>
  );

  return (
    <Collapsible defaultOpen={defaultOpen} className="group/col flex flex-col">
      {trigger}
      <CollapsibleContent className="border-fd-border my-0.5 ms-3 flex flex-col border-s ps-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

// The Folder slot entry point Fumadocs calls for every folder in the tree.
// Top-level folders (direct children of tree root) get accordion behaviour;
// nested folders (Bonus > Bitcoin bonus, etc.) get default per-folder state.
export function AccordionFolder({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  const { root } = useTreeContext();
  const isTopLevel = root.children.includes(item);
  return isTopLevel ? (
    <SingleOpenFolder item={item}>{children}</SingleOpenFolder>
  ) : (
    <NestedFolder item={item}>{children}</NestedFolder>
  );
}

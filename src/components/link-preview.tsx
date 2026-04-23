'use client';

import Link from 'fumadocs-core/link';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';
import type { PageManifest } from '@/lib/page-manifest';

const PageManifestContext = createContext<PageManifest>({});

export function PageManifestProvider({
  manifest,
  children,
}: {
  manifest: PageManifest;
  children: React.ReactNode;
}) {
  return <PageManifestContext.Provider value={manifest}>{children}</PageManifestContext.Provider>;
}

// Extract a /docs/... href from either a relative link rewritten by
// fumadocs createRelativeLink or a bare absolute-path link.
function normaliseHref(href: string | undefined, pathname: string): string | null {
  if (!href) return null;
  if (href.startsWith('/docs/')) return href.replace(/\/$/, '');
  if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return null;
  // Relative: resolve against current pathname. Strip trailing slash
  // because the manifest keys don't include it.
  try {
    const url = new URL(href, `http://local${pathname}`);
    if (url.pathname.startsWith('/docs/')) return url.pathname.replace(/\/$/, '');
  } catch {
    /* fall through */
  }
  return null;
}

const HOVER_DELAY_MS = 250;
const HIDE_DELAY_MS = 120;

export function AnchorWithPreview(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const manifest = useContext(PageManifestContext);
  const ref = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  // resolve preview entry from href
  const pathname = typeof window === 'undefined' ? '' : window.location.pathname;
  const normalised = normaliseHref(props.href, pathname);
  const entry = normalised ? manifest[normalised] : undefined;

  useEffect(() => {
    return () => {
      if (showTimer.current) window.clearTimeout(showTimer.current);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  if (!entry) {
    // Non-internal or unknown: plain link, no preview
    return <Link {...props} />;
  }

  const onEnter = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    showTimer.current = window.setTimeout(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setPos({
        left: Math.min(rect.left, window.innerWidth - 320),
        top: rect.bottom + 6,
      });
      setOpen(true);
    }, HOVER_DELAY_MS);
  };

  const onLeave = () => {
    if (showTimer.current) {
      window.clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    hideTimer.current = window.setTimeout(() => setOpen(false), HIDE_DELAY_MS);
  };

  return (
    <>
      <Link
        {...props}
        ref={ref}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
      />
      {open && pos && (
        <div
          role="tooltip"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
          className={cn(
            'pointer-events-auto fixed z-50 w-80 max-w-[calc(100vw-1rem)]',
            'bg-fd-card text-fd-card-foreground rounded-lg border p-3 text-sm shadow-lg',
            'border-fd-border',
          )}
        >
          <p className="text-fd-foreground leading-snug font-semibold">{entry.title}</p>
          {entry.description && (
            <p className="text-fd-muted-foreground mt-1 line-clamp-3 text-xs leading-normal">
              {entry.description}
            </p>
          )}
        </div>
      )}
    </>
  );
}

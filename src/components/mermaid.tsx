'use client';

import { useEffect, useId, useState, useSyncExternalStore } from 'react';
import mermaid from 'mermaid';

// Amber-tinted Mermaid theme matching the Fumadocs Fd color tokens.
// Both palettes are kept in sync with src/app/theme.css.
const lightTheme = {
  theme: 'base' as const,
  themeVariables: {
    fontFamily: 'var(--font-sans), system-ui, sans-serif',
    fontSize: '14px',
    primaryColor: 'hsl(35, 30%, 98%)',
    primaryTextColor: 'hsl(24, 10%, 20%)',
    primaryBorderColor: 'hsl(38, 92%, 50%)',
    lineColor: 'hsl(24, 70%, 45%)',
    secondaryColor: 'hsl(35, 50%, 95%)',
    tertiaryColor: 'hsl(35, 80%, 92%)',
    mainBkg: 'hsl(35, 30%, 98%)',
    clusterBkg: 'hsl(35, 50%, 95%)',
    clusterBorder: 'hsl(38, 60%, 70%)',
    edgeLabelBackground: 'hsl(35, 30%, 98%)',
  },
};

const darkTheme = {
  theme: 'base' as const,
  themeVariables: {
    fontFamily: 'var(--font-sans), system-ui, sans-serif',
    fontSize: '14px',
    primaryColor: 'hsl(24, 15%, 12%)',
    primaryTextColor: 'hsl(35, 30%, 92%)',
    primaryBorderColor: 'hsl(38, 85%, 58%)',
    lineColor: 'hsl(38, 70%, 60%)',
    secondaryColor: 'hsl(24, 15%, 16%)',
    tertiaryColor: 'hsl(24, 15%, 20%)',
    mainBkg: 'hsl(24, 15%, 12%)',
    clusterBkg: 'hsl(24, 15%, 16%)',
    clusterBorder: 'hsl(38, 50%, 35%)',
    edgeLabelBackground: 'hsl(24, 15%, 12%)',
  },
};

function getIsDark() {
  return document.documentElement.classList.contains('dark');
}

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replaceAll(':', '');
  const [svg, setSvg] = useState<string>('');
  const isDark = useSyncExternalStore(subscribeToTheme, getIsDark, () => false);

  useEffect(() => {
    let cancelled = false;
    mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', ...(isDark ? darkTheme : lightTheme) });
    mermaid
      .render(`mermaid-${id}`, chart)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch(() => {
        if (!cancelled) setSvg('');
      });
    return () => {
      cancelled = true;
    };
  }, [chart, id, isDark]);

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-fd-border bg-fd-card p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

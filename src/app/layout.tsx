import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Provider } from '@/components/provider';
import { appDescription, appName, appTagline, isProductionSite, siteUrl } from '@/lib/shared';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${appName} — ${appTagline}`,
    template: `%s · ${appName}`,
  },
  description: appDescription,
  applicationName: appName,
  keywords: [
    'Bitcoin',
    'Lightning Network',
    'Raspberry Pi',
    'self-custody',
    'full node',
    'Bitcoin Core',
    'LND',
    'Electrs',
    'self-hosting',
    'sovereign node',
  ],
  authors: [{ name: 'Stadicus' }],
  creator: 'Stadicus',
  openGraph: {
    type: 'website',
    siteName: appName,
    title: `${appName} — ${appTagline}`,
    description: appDescription,
    url: siteUrl,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appName} — ${appTagline}`,
    description: appDescription,
    creator: '@stadicus',
  },
  // Only the canonical production domain (raspibolt.org) should be
  // indexed. Staging (stadicus.github.io/RaspiBolt) and PR previews
  // get full noindex so they don't compete with prod in search.
  robots: isProductionSite
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      },
  alternates: {
    canonical: '/',
  },
};

// Geist everywhere — same family for sans and mono keeps the site
// visually coherent. Exposed as CSS variables so Tailwind's font-sans
// and font-mono utilities (wired in theme.css) resolve to these.
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

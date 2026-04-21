import { Geist, Geist_Mono } from 'next/font/google';
import { Provider } from '@/components/provider';
import './global.css';

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

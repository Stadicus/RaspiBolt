import { HomeLayout } from 'fumadocs-ui/layouts/home';
import Link from 'next/link';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  const opts = baseOptions();
  return (
    <HomeLayout
      {...opts}
      nav={{
        ...opts.nav,
        children: (
          <div className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 items-center max-sm:hidden">
            <Link
              href="/docs/backstory"
              className="inline-flex items-center rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-sm font-semibold text-amber-900 transition hover:border-amber-500/60 hover:bg-amber-500/20 dark:text-amber-300"
            >
              To the Guide
            </Link>
          </div>
        ),
      }}
    >
      {children}
    </HomeLayout>
  );
}

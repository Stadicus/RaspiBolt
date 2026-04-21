import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Zap } from 'lucide-react';
import { gitConfig } from './shared';

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.57 8.16-1.86 8.77c-.14.62-.51.77-1.03.48l-2.85-2.1-1.37 1.32c-.15.15-.28.28-.57.28l.2-2.9 5.27-4.76c.23-.2-.05-.32-.36-.12L8.5 13.05l-2.81-.88c-.61-.19-.62-.61.13-.91l10.99-4.24c.51-.18.96.13.76 1.14z" />
    </svg>
  );
}

function RedditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M12 0C5.37 0 0 5.37 0 12a11.96 11.96 0 0 0 5.05 9.77c-.03-.21-.05-.42-.05-.64 0-2.05 3.13-3.71 7-3.71s7 1.66 7 3.71c0 .22-.02.43-.05.64A11.96 11.96 0 0 0 24 12c0-6.63-5.37-12-12-12zm-3.5 11a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 17.75c-1.54 0-2.94-.43-4.02-1.14a.5.5 0 0 1 .55-.84c.9.59 2.11.98 3.47.98s2.57-.39 3.47-.98a.5.5 0 0 1 .55.84A7.4 7.4 0 0 1 12 17.75z" />
    </svg>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2">
          <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-sm shadow-amber-500/30">
            <Zap className="h-3.5 w-3.5 fill-white text-white" />
          </span>
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-700 bg-clip-text text-base font-bold tracking-tight text-transparent dark:from-amber-300 dark:via-orange-400 dark:to-amber-500">
            RaspiBolt
          </span>
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        type: 'icon',
        url: 'https://t.me/raspibolt',
        icon: <TelegramIcon />,
        text: 'Telegram',
        label: 'RaspiBolt on Telegram',
        external: true,
      },
      {
        type: 'icon',
        url: 'https://www.reddit.com/r/raspibolt/',
        icon: <RedditIcon />,
        text: 'Reddit',
        label: 'RaspiBolt on Reddit',
        external: true,
      },
    ],
  };
}

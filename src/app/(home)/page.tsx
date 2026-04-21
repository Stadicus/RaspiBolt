import Link from 'next/link';
import {
  ArrowRight,
  Boxes,
  Crown,
  EyeOff,
  Zap,
  Server,
  Database,
  Search,
  Clock,
  Globe,
  Code2,
  MessageCircle,
  Send,
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50/60 via-transparent to-orange-50/40 dark:from-amber-950/20 dark:via-transparent dark:to-orange-950/10" />
        <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b1a_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b1a_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-medium text-amber-900 dark:text-amber-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            Version 4, in active development
          </div>

          <h1 className="text-fd-foreground mt-6 text-5xl font-bold tracking-tight md:text-7xl">
            Build your own{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              do-everything-yourself
            </span>{' '}
            Bitcoin full node.
          </h1>
          <p className="text-fd-muted-foreground mt-6 max-w-2xl text-xl leading-relaxed">
            Become a sovereign peer in the Bitcoin and Lightning network, on a small, cheap
            Raspberry Pi sitting in the corner of your room.
          </p>
          <p className="mt-4 text-xl font-semibold tracking-tight text-amber-700 dark:text-amber-300">
            No need to trust anyone else.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/docs/backstory"
              className="group inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:bg-amber-600 hover:shadow-amber-500/40"
            >
              Start building
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/docs/backstory"
              className="border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-accent inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold transition"
            >
              Read the backstory
            </Link>
          </div>

          <div className="mt-16 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            <Stat value="A weekend" label="To build" />
            <Stat value="~700 GB" label="Blockchain validated" />
            <Stat value="24/7" label="Always online" />
            <Stat value="100%" label="Self-sovereignty" />
          </div>
        </div>
      </section>

      {/* ─────────────────── Why run a node? ─────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold tracking-widest text-amber-600 uppercase dark:text-amber-400">
            Why bother?
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            There are plenty of reasons to run your own node.
          </h2>
          <p className="text-fd-muted-foreground mt-4 text-lg leading-relaxed">
            Any one of these is enough. Combined, they&apos;re hard to argue with.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Reason
            icon={<Boxes className="h-5 w-5" />}
            title="Keep Bitcoin decentralized"
            description="Your node helps enforce Bitcoin's consensus rules. Every additional full node makes the network harder to capture."
          />
          <Reason
            icon={<Crown className="h-5 w-5" />}
            title="Take back your sovereignty"
            description="Your node validates your own transactions. No third-party tells you what happened on-chain, you check for yourself."
          />
          <Reason
            icon={<EyeOff className="h-5 w-5" />}
            title="Improve your privacy"
            description="Connect your wallets directly to your own node and stop broadcasting your financial history to external servers."
          />
          <Reason
            icon={<Zap className="h-5 w-5" />}
            title="Be part of Lightning"
            description="Run a Lightning node for everyday payments and help build a robust, decentralized payment network on top of Bitcoin."
          />
        </div>

        <p className="text-fd-muted-foreground mt-10 text-lg italic">
          Did we mention that it&apos;s fun, as well?
        </p>
      </section>

      {/* ─────────────────── What you'll run ─────────────────── */}
      <section className="border-fd-border bg-fd-muted/20 border-y">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest text-amber-600 uppercase dark:text-amber-400">
              What you&apos;ll run
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              A complete self-sovereignty stack.
            </h2>
            <p className="text-fd-muted-foreground mt-4 text-lg leading-relaxed">
              Standard Debian Linux commands throughout, so the guide also works on other hardware
              and cloud servers. The core is carefully maintained and kept up to date.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Server className="h-5 w-5" />}
              title="Bitcoin Core"
              description="Direct, trustless participation in the Bitcoin peer-to-peer network. Every block and every transaction, validated by you."
            />
            <Feature
              icon={<Database className="h-5 w-5" />}
              title="Electrum server"
              description="Connect your own wallets (including hardware wallets) to your own node instead of a stranger's."
            />
            <Feature
              icon={<Search className="h-5 w-5" />}
              title="Blockchain Explorer"
              description="Private, local block and transaction lookup. No information leaks to third-party explorers."
            />
            <Feature
              icon={<Zap className="h-5 w-5" />}
              title="Lightning"
              description="Full Lightning node with long-term channels, plus web and mobile management interfaces."
            />
            <Feature
              icon={<Clock className="h-5 w-5" />}
              title="Always on, always synced"
              description="Services stay available 24/7, quietly keeping themselves up to date while you sleep."
            />
            <Feature
              icon={<Globe className="h-5 w-5" />}
              title="Reachable from anywhere"
              description="A Tailscale mesh VPN lets you reach the Pi from any device, anywhere, no open ports, no dynamic DNS."
            />
          </div>
        </div>
      </section>

      {/* ─────────────────── Who this is for ─────────────────── */}
      <section className="mx-auto w-full max-w-4xl px-6 py-20 md:py-28">
        <div className="text-xs font-semibold tracking-widest text-amber-600 uppercase dark:text-amber-400">
          Who this is for
        </div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Foolproof instructions, no shortcuts.
        </h2>
        <div className="text-fd-foreground mt-6 space-y-4 text-lg leading-relaxed">
          <p>
            The goal is to do everything yourself. Shortcuts that involve trusting someone else
            aren&apos;t allowed here, that&apos;s the whole point.
          </p>
          <p>
            This makes the guide technical, but the path is as straightforward as we can make it.
            Along the way you&apos;ll pick up a working understanding of Linux, Bitcoin, and
            Lightning, not because you have to memorize it, but because you&apos;ll actually use
            it.
          </p>
          <p className="text-fd-muted-foreground">
            If you enjoy tinkering, care about self-sovereignty, and have a weekend to spare, this
            guide is for you.
          </p>
        </div>
      </section>

      {/* ─────────────────── Community ─────────────────── */}
      <section className="border-fd-border border-t">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest text-amber-600 uppercase dark:text-amber-400">
              Community
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              You&apos;re not alone.
            </h2>
            <p className="text-fd-muted-foreground mt-4 text-lg leading-relaxed">
              RaspiBolt started in 2017 as a Medium post. It has grown into a community project with
              many contributors, thousands of nodes running in the wild, and help available wherever
              Bitcoiners gather.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CommunityLink
              icon={<Code2 className="h-5 w-5" />}
              title="GitHub"
              description="Issues, knowledge base, contributions"
              href="https://github.com/raspibolt/raspibolt/issues"
            />
            <CommunityLink
              icon={<MessageCircle className="h-5 w-5" />}
              title="Reddit"
              description="r/raspibolt for questions & discussion"
              href="https://www.reddit.com/r/raspibolt/"
            />
            <CommunityLink
              icon={<Send className="h-5 w-5" />}
              title="Telegram"
              description="t.me/raspibolt for real-time help"
              href="https://t.me/raspibolt"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────── Final CTA ─────────────────── */}
      <section className="border-fd-border bg-fd-muted/30 border-t">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Ready to build your own?
          </h2>
          <p className="text-fd-muted-foreground mx-auto mt-5 max-w-xl text-lg leading-relaxed">
            Grab a Raspberry Pi, a 2 TB SSD, and a weekend. Start with the preparations chapter,
            we&apos;ll take it from there.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/docs/raspberry-pi/preparations"
              className="group inline-flex items-center gap-2 rounded-xl bg-amber-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:bg-amber-600 hover:shadow-amber-500/40"
            >
              Start with preparations
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/docs/backstory"
              className="border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-accent inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-base font-semibold transition"
            >
              Browse the full guide
            </Link>
          </div>
          <p className="text-fd-muted-foreground mt-12 text-sm">
            Running an earlier RaspiBolt? A clean rebuild is the recommended path, see the{' '}
            <Link
              href="/docs/faq"
              className="underline underline-offset-2 hover:text-amber-600 dark:hover:text-amber-400"
            >
              FAQ
            </Link>{' '}
            for details. Looking for older versions? Check the archived source of{' '}
            <a
              href="https://github.com/raspibolt/raspibolt/tree/1.0"
              className="underline underline-offset-2 hover:text-amber-600 dark:hover:text-amber-400"
            >
              v1
            </a>{' '}
            and{' '}
            <a
              href="https://v2.raspibolt.org"
              className="underline underline-offset-2 hover:text-amber-600 dark:hover:text-amber-400"
            >
              v2
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

/* ───────────────────── Component bits ───────────────────── */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-fd-border bg-fd-background/50 rounded-xl border px-4 py-3 backdrop-blur">
      <div className="text-fd-foreground text-2xl font-bold">{value}</div>
      <div className="text-fd-muted-foreground mt-1 text-xs tracking-wide uppercase">{label}</div>
    </div>
  );
}

function Reason({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group border-fd-border bg-fd-card relative rounded-2xl border p-6 transition hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 text-amber-700 dark:text-amber-300">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-fd-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group border-fd-border bg-fd-background/60 relative rounded-xl border p-5 backdrop-blur transition hover:border-amber-500/40">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
          {icon}
        </div>
        <h3 className="font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="text-fd-muted-foreground mt-3 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function CommunityLink({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group border-fd-border bg-fd-card hover:bg-fd-accent flex items-center gap-4 rounded-xl border p-5 transition hover:border-amber-500/40"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold tracking-tight">{title}</div>
        <div className="text-fd-muted-foreground text-sm">{description}</div>
      </div>
      <ArrowRight className="text-fd-muted-foreground h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
    </a>
  );
}

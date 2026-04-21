# RaspiBolt v4: open decisions and deferred work

Tracking file for non-urgent items: open design decisions, deferred content work, tooling nice-to-haves. One place to look when a session starts, without touching `CLAUDE.md` (which is in the prompt cache; every edit invalidates it).

Add new items at the top of the relevant section. Strike items by moving them to the "Done" section with the commit hash, or just delete them.

---

## Open decisions

### v3 archive

`master` branch still serves the live guide at <https://raspibolt.org>. Needs a permanent archive URL before v4 goes live. Options: keep `master` branch as archive, redirect to `v3.raspibolt.org`, or similar. Decide with upstream maintainers.

---

## Deferred content

- **Bonus sections** (`guide/bonus/**`) are stubs with v3 source links. Full content migration deferred until the main path is battle-tested.
- **Test Tailscale install flow on a Pi 5 Trixie**. The privacy.mdx Tailscale steps are written from upstream docs but haven't been walked on real hardware. Verify before v4 goes live.

---

## Deferred tooling

- **Playwright for web-UI screenshots**. Automate screenshots of RTL, BTC RPC Explorer, Mempool via headless browser. Desktop apps (Sparrow, Raspberry Pi Imager) stay manual. Requires self-hosted runner decision (public repo + self-hosted = fork-PR security concern).
- **CI end-to-end install test in VM**. Weekly Vagrant + Debian 13 Trixie run of the full Hardware + Bitcoin install. Catches upstream package changes before readers hit them. Needs self-hosted runner.
- **Browserless for mobile reading audit**. Self-hosted rendering, not publicly accessible.
- **Bonus page triage**. Pick the ~8 most-demand bonus pages (Mempool, Sparrow Terminal, Fulcrum, LNbits, ThunderHub, ...) and do full v4 rewrites; cut the rest from nav.
- **OG image polish** per page for social sharing. Fumadocs generates them; audit quality.
- **eslint-plugin-mdx** is configured but currently runs on zero files. Either force-include via CLI globs or accept that markdownlint covers MDX adequately.
- **Unit tests for Fumadocs-specific helpers**. Only `lib/remark-variables.ts` has tests. If we add more build-time plugins, wire them the same way.
- **Image optimisation** pending first content page that actually uses images. Decide on `sharp` via `next/image` (needs `output: 'export'` compatibility check) vs pre-optimised PNGs committed to `public/images/`.
- **Preview deploys for PRs**. Not doing this now (user decision). Revisit if the project starts receiving external content PRs.

---

## Done (recent)

- `966f7a7` Search-quality: troubleshooting triage cards + description audit for Orama ranking
- `6129fbf` Architecture page with Mermaid diagrams (service flow + trust boundary)
- `3165d34` Per-page "Last updated" and "Edit on GitHub" footer
- `67ecce2` Strip em-dashes and LLM writing tells across 71 files
- `d0483ff` CLAUDE.md: add banned writing patterns (em-dashes, leverage, utilize, seamlessly, etc.)
- `9eea6aa` Swap Tor hidden-service SSH for Tailscale; Tor stays for bitcoind/lnd P2P privacy; Headscale callout
- Full Raspberry Pi section migrated (7 pages)
- Backstory, FAQ, Troubleshooting migrated from v3
- Bitcoin section migrated (5 pages: Bitcoin Core 30.2, Electrs 0.11.1, BTC RPC Explorer, Sparrow wallet)
- Lightning section migrated (5 pages: LND 0.20.1-beta, RTL 0.15.6, Zeus over Tor, SCB with systemd.path + scp)
- Bonus sections stubbed (48 pages; v4 structure in place, content migration deferred)
- Sidebar cleanup: Welcome removed, "Raspberry Pi" renamed to "Hardware", sections collapsed by default, Copy/Open/Ask-AI buttons removed, Telegram + Reddit icons next to GitHub
- `7f947bb` Remove `/fonts` playground (Geist chosen)
- `7cae9df` Switch to Geist family (sans + mono) site-wide
- `6faa199` Amber theme + `/styleguide` reference page
- `b673afa` Landing page rewritten with real v3 copy
- `3204c6c` Migration Quarto to Next.js + Fumadocs

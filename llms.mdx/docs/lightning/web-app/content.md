# Web app (/docs/lightning/web-app)



What does a Lightning node look like once you step away from the
command line? For this guide, it looks like
[Ride The Lightning](https://github.com/Ride-The-Lightning/RTL)
(RTL), a well-maintained open-source web dashboard for LND that
covers channels, on-chain, routing, and fees in one place. No
phone-home telemetry, no account, no upstream service; RTL runs on
your Pi and talks to LND over the loopback interface.

You'll install Node.js 22, clone RTL 0.15.6 as its own
unprivileged user, point it at LND's macaroon and TLS certificate,
and expose it behind Caddy at `https://rtl.raspibolt.local` on your
LAN.

## Install Node.js 22 [#install-nodejs-22]

RTL is a Node.js application and needs a recent LTS runtime. The
NodeSource repository gives you upstream Node without waiting for
Debian backports.

1. As user `admin`, add the NodeSource GPG key and apt source:

   ```bash
   sudo apt update
   sudo apt install -y ca-certificates curl gnupg
   sudo mkdir -p /etc/apt/keyrings
   curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
   echo "deb [arch=arm64 signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
     | sudo tee /etc/apt/sources.list.d/nodesource.list
   ```

2. Install Node and verify:

   ```bash
   sudo apt update
   sudo apt install -y nodejs
   node --version
   npm --version
   ```

   Expected output, a `v22.x` line from `node`, and an `11.x` or
   newer line from `npm`.

<Callout type="info" title="If you already installed Node for the Bitcoin Explorer">
  BTC RPC Explorer uses the same NodeSource setup. If Node 22 is
  already present, skip this whole section.
</Callout>

## Create the rtl user [#create-the-rtl-user]

RTL should not run as the `lnd` user, it's a web app with an
exposed HTTP port, and a compromise there should not hand an
attacker LND's admin macaroon. A dedicated `rtl` user keeps the
blast radius small.

1. Create the user and copy in a read-only copy of LND's admin
   macaroon. RTL only needs to **read** the macaroon; the copy is
   what keeps `rtl` out of `/data/lnd`:

   ```bash
   sudo adduser --disabled-password --gecos "" rtl
   sudo mkdir -p /home/rtl/lnd
   sudo cp /data/lnd/data/chain/bitcoin/mainnet/admin.macaroon /home/rtl/lnd/admin.macaroon
   sudo cp /data/lnd/tls.cert /home/rtl/lnd/tls.cert
   sudo chown -R rtl:rtl /home/rtl/lnd
   sudo chmod 600 /home/rtl/lnd/admin.macaroon
   ```

<Callout type="warn" title="The admin macaroon is the keys to the castle">
  Anyone with `admin.macaroon` and network reach to LND's gRPC port
  can open channels, close channels, and send payments. It is not
  the seed, but it can drain active channels. Keep the file locked
  down and do not commit it to any repository.
</Callout>

## Install RTL [#install-rtl]

1. Become the `rtl` user, clone the repo, and check out the pinned
   release tag:

   ```bash
   sudo su - rtl
   git clone https://github.com/Ride-The-Lightning/RTL.git
   cd RTL
   git checkout v0.15.6
   ```

2. Verify the tag signature. RTL tags are signed by Suheb; fetch
   the key and verify:

   ```bash
   curl https://keybase.io/suheb/pgp_keys.asc | gpg --import
   git verify-tag v0.15.6
   ```

   Look for `Good signature from "saubyk"`. The primary key
   fingerprint is `3E9B D443 6C28 8039 CA82 7A92 00C9 E2BC 2E45 666F`.

3. Install production dependencies. This pulls a few hundred
   packages and can take ten minutes or more, the process
   occasionally appears frozen on a single package, it's fine:

   ```bash
   npm install --omit=dev --legacy-peer-deps
   ```

   Success looks like `added NNN packages ... found 0 vulnerabilities`.

## Configure RTL [#configure-rtl]

RTL ships a sample config; you copy it, edit a handful of fields,
and you're done.

1. As user `rtl`, still in `/home/rtl/RTL`:

   ```bash
   cp Sample-RTL-Config.json RTL-Config.json
   nano RTL-Config.json
   ```

2. Change these four values. `multiPass` is the password you'll
   use to log into the RTL UI, make it a new one, password `[E]`,
   not reused from anywhere else:

   ```json
   "multiPass": "PASSWORD_E",
   "macaroonPath": "/home/rtl/lnd",
   "swapMacaroonPath": "/home/rtl/lnd",
   "boltzMacaroonPath": "/home/rtl/lnd"
   ```

3. Further down in the `nodes` → `settings` block, point RTL at
   LND on loopback. Leave the URLs as-is if the sample already
   uses `127.0.0.1`; change `localhost` to `127.0.0.1` if you see
   it, Node 18+ resolves `localhost` via IPv6 first, which LND
   doesn't listen on:

   ```json
   "lnServerUrl": "https://127.0.0.1:8080",
   "swapServerUrl": "https://127.0.0.1:8081",
   "boltzServerUrl": "https://127.0.0.1:9003"
   ```

   Also set `fiatConversion` to `true` if you want USD/EUR totals
   in the UI, and leave `Authentication → logoutRedirectLink`
   alone.

4. Save, exit, and leave the `rtl` user session:

   ```bash
   exit
   ```

<Callout type="info" title="Multi-node support">
  RTL can manage multiple LND, Core Lightning, or Eclair nodes from
  one UI. This guide sticks to a single LND node for simplicity,
  when you're ready, the
  [RTL docs](https://github.com/Ride-The-Lightning/RTL#readme)
  walk through adding more in the same `RTL-Config.json`.
</Callout>

## systemd unit [#systemd-unit]

1. As `admin`, create the unit file:

   ```bash
   sudo nano /etc/systemd/system/rtl.service
   ```

2. Paste:

   ```ini
   # RaspiBolt: systemd unit for Ride The Lightning
   # /etc/systemd/system/rtl.service

   [Unit]
   Description=Ride The Lightning
   Wants=lnd.service
   After=lnd.service

   [Service]
   WorkingDirectory=/home/rtl/RTL
   ExecStart=/usr/bin/node rtl
   User=rtl
   Restart=always
   RestartSec=30

   # Hardening
   PrivateTmp=true
   ProtectSystem=full
   NoNewPrivileges=true

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable rtl
   sudo systemctl start rtl
   sudo journalctl -f -u rtl
   ```

   The log should end with
   `Server is up and running, please open the UI at http://localhost:3000`.
   Exit the tail with `Ctrl-C`.

## Expose RTL through Caddy [#expose-rtl-through-caddy]

RTL listens on `127.0.0.1:3000`, plain HTTP, bound to loopback.
You'll front it with **Caddy** (already installed in the Bitcoin
section) so you can reach it over HTTPS from anywhere on your LAN.
Caddy's internal CA issues a self-signed cert on the fly, which
your browser will warn about exactly once when you trust the root.

1. Open Caddy's site config:

   ```bash
   sudo nano /etc/caddy/Caddyfile
   ```

2. Add a site block for RTL. The `tls internal` line tells Caddy
   to mint a cert from its own CA rather than trying Let's Encrypt
   (which won't work for a `.local` hostname anyway):

   ```text
   rtl.raspibolt.local {
     reverse_proxy localhost:3000
     tls internal
   }
   ```

3. Reload Caddy and open the firewall for HTTPS on the LAN:

   ```bash
   sudo systemctl reload caddy
   sudo ufw allow from 192.168.0.0/16 to any port 443 proto tcp comment 'HTTPS LAN only'
   ```

   Replace `192.168.0.0/16` with whatever your home LAN actually
   uses. If you want RTL reachable from anywhere on the LAN
   without LAN-scoping, drop the `from` clause, but think twice.

4. Point your desktop browser at `https://rtl.raspibolt.local`.
   If your router resolves `.local` mDNS names, this works as-is;
   if not, either add a DNS entry on your router or hit the Pi's
   IP directly and trust the cert warning for that hostname.

   Log in with password `[E]`.

<Callout type="info" title="Why self-signed is fine at home">
  Let's Encrypt needs a public DNS name and an internet-reachable
  port 80 or a DNS-01 challenge. Your home node has neither, and
  publishing the RTL dashboard on the open internet is not something
  this guide recommends. Caddy's internal CA produces a perfectly
  good TLS cert; the browser warning is a one-time "I trust this
  host on my LAN" click. If you want a trusted cert for your LAN,
  use DNS-01 with a real domain you own, but that's a separate
  bonus guide.
</Callout>

## Walk around the UI [#walk-around-the-ui]

First-login tour:

* **Home**, headline numbers. On-chain balance, channel balance,
  payments, invoices, and node ranking at a glance.
* **Lightning → Channels**, open channels, pending channels, and
  the button to open a new one. Channel policy (base fee, fee
  rate, time lock) lives in the per-channel view.
* **Lightning → Payments**, pay an invoice by pasting it, or
  generate one to receive. The payments table shows every Lightning
  payment the node has sent.
* **Routing**, earnings from forwarded payments, plus a per-peer
  breakdown. This is where you'll see whether your channel policy
  is attracting any volume.
* **On-chain**, deposits, sends, UTXOs, and the sweep tool.
* **Node Settings → Services → Watchtowers**, the towers you
  configured with `lncli wtclient add` show up here too.

**Main takeaway:** you now have a proper dashboard on your LAN.
Everything `lncli` does, RTL does with a mouse, plus graphs.

## Upgrading RTL [#upgrading-rtl]

1. As `admin`, stop the service and become `rtl`:

   ```bash
   sudo systemctl stop rtl
   sudo su - rtl
   cd /home/rtl/RTL
   ```

2. Fetch, find the latest tag, check it out, verify the signature,
   reinstall dependencies:

   ```bash
   git fetch
   git reset --hard
   latest=$(git tag | grep -E "v[0-9]+\.[0-9]+\.[0-9]+$" | sort --version-sort | tail -n 1)
   echo "$latest"
   git checkout "$latest"
   git verify-tag "$latest"
   npm install --omit=dev --legacy-peer-deps
   exit
   ```

3. Update `0.15.6` in `lib/versions.ts` to keep this
   guide honest, then restart:

   ```bash
   sudo systemctl start rtl
   sudo journalctl -f -u rtl
   ```

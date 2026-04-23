# Mempool Explorer (/docs/bonus/bitcoin/mempool)



[Mempool](https://github.com/mempool/mempool) is the same open-source
code that runs mempool.space, self-hosted on your own node. Transaction
lookups, fee estimates, and UTXO queries stay on your LAN and never
reach a third party.

This guide builds Mempool v3.3.1 from source. The backend
stores indexed data in MariaDB and serves the API on port 8999. Caddy
puts the Angular frontend behind HTTPS on port 4080.

## Requirements [#requirements]

* [Electrum server](/docs/bitcoin/electrum-server) running (Electrs on port 50001)
* [BTC RPC Explorer](/docs/bitcoin/blockchain-explorer) complete (Node.js 22 and Caddy already installed)
* \~2 GB free on the SSD for build output and the MariaDB database

## Create the user [#create-the-user]

A dedicated system user limits the blast radius of any bug. Adding it
to the `bitcoin` group lets Mempool authenticate to Bitcoin Core via
the cookie file, the same approach BTC RPC Explorer uses.

```bash
sudo adduser --disabled-password --gecos "" mempool
sudo adduser mempool bitcoin
```

## Install build dependencies [#install-build-dependencies]

Mempool's backend includes a Rust-native block-template builder (GBT).
Debian 13 Trixie ships Rust 1.85, which meets the 1.84 requirement:

```bash
sudo apt install rustc cargo
```

## Set up MariaDB [#set-up-mariadb]

```bash
sudo apt install mariadb-server
```

Open the MariaDB shell:

```bash
sudo mysql
```

Create the database and a dedicated user. Replace `YourPasswordM` with
your &#x2A;*password \[M]** (new, used only for MariaDB here):

```sql
CREATE DATABASE mempool;
GRANT ALL PRIVILEGES ON mempool.* TO 'mempool'@'localhost' IDENTIFIED BY 'YourPasswordM';
EXIT;
```

## Install Mempool [#install-mempool]

Switch to the `mempool` user:

```bash
sudo su - mempool
```

Clone and check out the release:

```bash
git clone https://github.com/mempool/mempool
cd mempool
git checkout v3.3.1
```

### Build the backend [#build-the-backend]

```bash
cd backend
npm install --prod
npm run build
```

<Callout type="info" title="Build time: 10-20 minutes">
  `npm install` triggers a Rust compilation step before installing the
  Node.js packages. On a Pi 5 that takes 5-10 minutes. The TypeScript
  compilation that follows is quick.
</Callout>

### Configure the backend [#configure-the-backend]

```bash
nano mempool-config.json
```

Paste the following. Replace `YourPasswordM` with your password \[M]:

```json
{
  "MEMPOOL": {
    "NETWORK": "mainnet",
    "BACKEND": "electrum",
    "HTTP_PORT": 8999,
    "SPAWN_CLUSTER_PROCS": 0,
    "API_URL_PREFIX": "/api/v1/",
    "POLL_RATE_MS": 2000,
    "CACHE_DIR": "./cache",
    "CACHE_ENABLED": true,
    "CLEAR_PROTECTION_MINUTES": 20,
    "RECOMMENDED_FEE_PERCENTILE": 50,
    "BLOCK_WEIGHT_UNITS": 4000000,
    "INITIAL_BLOCKS_AMOUNT": 8,
    "MEMPOOL_BLOCKS_AMOUNT": 8,
    "INDEXING_BLOCKS_AMOUNT": 0,
    "AUDIT": false,
    "RUST_GBT": true,
    "CPFP_INDEXING": false,
    "ALLOW_UNREACHABLE": true,
    "PRICE_UPDATES_PER_HOUR": 1
  },
  "CORE_RPC": {
    "HOST": "127.0.0.1",
    "PORT": 8332,
    "COOKIE": true,
    "COOKIE_PATH": "/data/bitcoin/.cookie"
  },
  "ELECTRUM": {
    "HOST": "127.0.0.1",
    "PORT": 50001,
    "TLS_ENABLED": false
  },
  "DATABASE": {
    "ENABLED": true,
    "HOST": "127.0.0.1",
    "PORT": 3306,
    "DATABASE": "mempool",
    "USERNAME": "mempool",
    "PASSWORD": "YourPasswordM"
  },
  "SOCKS5PROXY": {
    "ENABLED": false
  },
  "STATISTICS": {
    "ENABLED": true,
    "TX_PER_SECOND_SAMPLE_PERIOD": 150
  }
}
```

`INDEXING_BLOCKS_AMOUNT: 0` disables historical address indexing on
first run. Once the node is stable, raise it to `4320` (30 days) or
`11000` (about 3 months) to unlock address balance history in the UI.
Restart the service after changing it.

### Build the frontend [#build-the-frontend]

<Callout type="info" title="Build time: 20-30 minutes">
  Run the following in a `tmux` or `screen` session so a dropped SSH
  connection doesn't kill the build.
</Callout>

```bash
cd ~/mempool/frontend
npm install
npm run generate-themes
npm run generate-config
npm run ng -- build --configuration production
npm run sync-assets
exit
```

The built frontend lands in
`~/mempool/frontend/dist/mempool/browser`.

<Callout type="info" title="Why not npm run build?">
  The standard build script compiles all 33 translation locales, which
  takes several hours on a Pi. The commands above build only the English
  source locale and produce the same result.
</Callout>

## Autostart on boot [#autostart-on-boot]

Back as user `admin`, create the service file:

```bash
sudo nano /etc/systemd/system/mempool.service
```

Paste:

```ini
# RaspiBolt: systemd unit for Mempool
# /etc/systemd/system/mempool.service

[Unit]
Description=Mempool Bitcoin Explorer
After=network.target bitcoind.service electrs.service mariadb.service

[Service]
WorkingDirectory=/home/mempool/mempool/backend
ExecStart=/usr/bin/node --max-old-space-size=2048 dist/index.js
User=mempool
Restart=on-failure
RestartSec=60
PrivateTmp=true
ProtectSystem=full
NoNewPrivileges=true
PrivateDevices=true

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable mempool
sudo systemctl start mempool
sudo journalctl -f -u mempool
```

Wait for a line containing `Listening on http://127.0.0.1:8999/`. On
first start, Mempool syncs its database from Electrs and Bitcoin Core.
Expect 30-60 minutes before fee charts and address lookups populate
fully.

Press `Ctrl`-`C` to stop following the log.

## HTTPS on the LAN with Caddy [#https-on-the-lan-with-caddy]

Caddy already runs from the BTC RPC Explorer setup. Add a Mempool
block to the Caddyfile:

1. Open the Caddyfile:

   ```bash
   sudo nano /etc/caddy/Caddyfile
   ```

2. Add the Mempool block after your existing blocks:

   ```text
   # Mempool Explorer
   :4080 {
     tls internal

     handle /api/* {
       reverse_proxy localhost:8999
     }

     handle {
       root * /home/mempool/mempool/frontend/dist/mempool/browser
       try_files {path} /index.html
       file_server
     }
   }
   ```

   The `/api/*` block proxies API calls to the backend. Everything
   else is served as a static file, falling back to `index.html` so
   Angular's client-side routing works for deep links.

3. Open the firewall and reload Caddy:

   ```bash
   sudo ufw allow 4080/tcp comment 'Mempool Explorer (Caddy)'
   sudo systemctl reload caddy
   ```

4. Point your browser at `https://raspibolt.local:4080`. Accept the
   one-time certificate warning.

**Main takeaway:** you now have a private Bitcoin block explorer and
mempool visualizer. The node's own Electrs index answers every query.

## Upgrade [#upgrade]

Read the [release notes](https://github.com/mempool/mempool/releases)
before upgrading; some releases include a database migration.

```bash
sudo systemctl stop mempool
sudo su - mempool
cd ~/mempool
git fetch
git checkout v<new-version>
```

Rebuild the backend:

```bash
cd backend
npm install --prod
npm run build
```

Rebuild the frontend:

```bash
cd ~/mempool/frontend
npm install
npm run generate-themes
npm run generate-config
npm run ng -- build --configuration production
npm run sync-assets
exit
```

Start the service and confirm it's running:

```bash
sudo systemctl start mempool
sudo journalctl -u mempool --since "5 minutes ago"
```

## Uninstall [#uninstall]

```bash
sudo systemctl stop mempool
sudo systemctl disable mempool
sudo rm /etc/systemd/system/mempool.service
sudo ufw delete "allow 4080/tcp"
```

Remove the Mempool block from `/etc/caddy/Caddyfile`, then reload:

```bash
sudo systemctl reload caddy
```

Drop the database and user:

```bash
sudo mysql
```

```sql
DROP DATABASE mempool;
DROP USER 'mempool'@'localhost';
EXIT;
```

If MariaDB is no longer needed:

```bash
sudo apt remove --purge mariadb-server mariadb-client
sudo apt autoremove
```

Remove the user and home directory:

```bash
sudo deluser mempool
sudo rm -rf /home/mempool
```

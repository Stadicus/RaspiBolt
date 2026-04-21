# Samourai Dojo (/docs/bonus/bitcoin/dojo)



<Callout type="info" title="Migration in progress">
  This bonus page hasn't been rewritten for RaspiBolt v4 yet. The v3
  version still works, see the [original guide on GitHub](https://github.com/raspibolt/raspibolt/blob/master/guide/bonus/bitcoin/dojo.md)
  while we port it over.
</Callout>

[Samourai Dojo](https://code.samourai.io/dojo/samourai-dojo) is the
backing server for Samourai Wallet. It exposes HD account and BIP47
balance and transaction data, serves unspent output lists, and
broadcasts transactions through your own `bitcoind`, removing the
reliance on Samourai's hosted servers.

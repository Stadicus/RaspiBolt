# UPS with NUT (/docs/bonus/raspberry-pi/ups-nut)



<Callout type="info" title="Migration in progress">
  This bonus page hasn't been rewritten for RaspiBolt v4 yet. The v3
  version still works, see the [original guide on GitHub](https://github.com/raspibolt/raspibolt/blob/master/guide/bonus/raspberry-pi/ups-nut.md)
  while we port it over.
</Callout>

A sudden power loss can corrupt the Bitcoin or LND database and
force a lengthy resync. With a UPS and
[Network UPS Tools](https://networkupstools.org/) (NUT), your node
watches the battery level and triggers a clean shutdown before the
UPS runs out, turning a brownout into a five-minute nuisance
instead of hours of downtime.

import { describe, it, expect } from 'vitest';
import { remark } from 'remark';
import { remarkVariables } from './remark-variables';
import { versions, files, urls } from './versions';

function run(input: string): string {
  return remark().use(remarkVariables).processSync(input).toString();
}

describe('remark-variables', () => {
  it('resolves %versions.X% in flowing text', () => {
    const out = run('Bitcoin Core %versions.bitcoin_core% ships next week.');
    expect(out).toContain(`Bitcoin Core ${versions.bitcoin_core}`);
    expect(out).not.toContain('%versions.');
  });

  it('resolves %files.X% in flowing text', () => {
    const out = run('Archive name: %files.bitcoinArchive%');
    expect(out).toContain(files.bitcoinArchive);
  });

  it('resolves %urls.X% inside fenced code blocks', () => {
    const out = run('```bash\nwget %urls.bitcoinDownload%\n```');
    expect(out).toContain(urls.bitcoinDownload);
    expect(out).not.toContain('%urls.bitcoinDownload%');
  });

  it('resolves tokens in inline code', () => {
    const out = run('Pin to version `%versions.lnd%` for stability.');
    expect(out).toContain(`\`${versions.lnd}\``);
  });

  it('throws on an unknown token so typos fail the build', () => {
    expect(() => run('Missing: %versions.does_not_exist%')).toThrow(
      /\[remark-variables\] unknown token/,
    );
  });

  it('leaves %not.a.known.scope% alone (no collision with other %% content)', () => {
    // The regex only matches the three scopes, so arbitrary %x.y% passes through.
    const out = run('Discount %off.today% if you act fast');
    expect(out).toContain('%off.today%');
  });

  it('resolves multiple tokens in one paragraph', () => {
    const out = run(
      'Grab %files.bitcoinArchive% from %urls.bitcoinDownload%, verified against %files.bitcoinSha256%.',
    );
    expect(out).toContain(files.bitcoinArchive);
    expect(out).toContain(urls.bitcoinDownload);
    expect(out).toContain(files.bitcoinSha256);
  });
});

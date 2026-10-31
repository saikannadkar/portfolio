import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateSite } from '../validate.mjs';
import { createPreviewServer } from '../server.mjs';

test('source HTML, canonical URLs, structured data, sitemap and assets agree', async () => {
  await validateSite(process.cwd());
});

test('Vercel publishes static output without a catch-all homepage rewrite', async () => {
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  assert.equal(config.outputDirectory, 'dist');
  assert.equal(config.cleanUrls, true);
  assert.equal(config.trailingSlash, false);
  assert.equal(config.rewrites, undefined);
  assert.ok(config.redirects.some(rule => rule.source === '/index' && rule.destination === '/' && rule.permanent));
});

test('HTTP routes, redirects, real 404s and source-file protection', async t => {
  const server = createPreviewServer(process.cwd());
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const path of ['/', '/skills', '/experience', '/robots.txt', '/sitemap.xml', '/llms.txt', '/Resume_Sai_Kannadkar.pdf']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.ok((await response.arrayBuffer()).byteLength > 0);
  }
  for (const [path, target] of [['/index.html', '/'], ['/skills.html', '/skills'], ['/skills/', '/skills'], ['/experience.html', '/experience'], ['/experience/', '/experience']]) {
    const response = await fetch(base + path, { redirect: 'manual' });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), target);
  }
  for (const path of ['/missing', '/.git/config', '/server.mjs', '/package.json', '/assets/..%5cpackage.json']) assert.equal((await fetch(base + path)).status, 404, path);
  assert.equal((await fetch(base + '/%zz')).status, 400);
  assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
  const head = await fetch(base + '/skills', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});

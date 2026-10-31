import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function validateSite(root) {
  const origin = 'https://saikannadkar.me';
  const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(locations, [origin + '/', origin + '/skills', origin + '/experience']);
  const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent: \*\s+Allow: \//);
  assert.ok(!/^Disallow:\s*\S/m.test(robots), 'All crawlers must remain allowed');
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.match(await readFile(resolve(root, 'llms.txt'), 'utf8'), /^# Sai Kannadkar\s+>/);
  for (const [page, url] of [['index.html', origin + '/'], ['skills.html', origin + '/skills'], ['experience.html', origin + '/experience']]) {
    const html = await readFile(resolve(root, page), 'utf8');
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`), `${page}: canonical URL`);
    assert.ok(html.includes(`<meta property="og:url" content="${url}">`));
    assert.ok(!html.includes('noindex'));
    assert.ok(!/<script\s+src=/.test(html), 'Content must not need client JavaScript');
    assert.ok(html.includes('mailto:hey@saikannadkar.me'));
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(schemas.length, 1);
    const schema = JSON.parse(schemas[0][1]);
    assert.equal(schema['@context'], 'https://schema.org');
    assert.equal(schema['@graph'].find(node => node['@type'] === 'Person').name, 'Sai Kannadkar');
    assert.ok(schema['@graph'].some(node => node.url === url && /Page$/.test(node['@type'])));
    for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)[^"]*"/g)) {
      const pathname = match[1];
      const file = pathname === '/' ? 'index.html' : pathname === '/skills' ? 'skills.html' : pathname === '/experience' ? 'experience.html' : pathname.slice(1);
      assert.ok((await stat(resolve(root, file))).size > 0, `${page}: missing ${pathname}`);
    }
    assert.ok(!html.includes('figma.com/api/mcp/asset'));
    if (page === 'skills.html') assert.equal([...html.matchAll(/class="skill-card"/g)].length, 10);
    if (page === 'index.html') for (const id of ['top', 'about', 'projects', 'skills', 'experience', 'contact']) assert.ok(html.includes(`id="${id}"`));
  }
  const pdf = await readFile(resolve(root, 'Resume_Sai_Kannadkar.pdf'));
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.match(await readFile(resolve(root, '404.html'), 'utf8'), /noindex, follow/);
}

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
const publicFiles = new Set(['index.html', 'skills.html', 'experience.html', '404.html', 'styles.css', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'llms.txt', 'Resume_Sai_Kannadkar.pdf']);
export function createPreviewServer(root) {
  return createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-cache');
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { response.writeHead(400).end('Bad request'); return; }
    const aliases = { '/index.html': '/', '/index': '/', '/skills.html': '/skills', '/skills/': '/skills', '/experience.html': '/experience', '/experience/': '/experience' };
    if (aliases[pathname]) { response.writeHead(308, { Location: aliases[pathname] + new URL(request.url, 'http://localhost').search }).end(); return; }
    const file = pathname === '/' ? 'index.html' : pathname === '/skills' ? 'skills.html' : pathname === '/experience' ? 'experience.html' : pathname === '/Resume_Sai_Kannadkar' ? 'Resume_Sai_Kannadkar.pdf' : pathname.slice(1);
    const allowed = publicFiles.has(file) || /^assets\/[a-zA-Z0-9_-]+\.(?:svg|jpg|png)$/.test(file);
    try {
      if (!allowed) throw Object.assign(new Error('Not found'), { code: 'ENOENT' });
      const body = await readFile(resolve(root, file));
      response.writeHead(file === '404.html' ? 404 : 200, { 'Content-Type': types[extname(file)] });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      if (error.code !== 'ENOENT') { response.writeHead(500).end('Server error'); return; }
      const body = await readFile(resolve(root, '404.html')).catch(() => 'Not found');
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : body);
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(process.argv[2] || '.');
  createPreviewServer(root).listen(5174, '127.0.0.1', () => console.log('Portfolio: http://127.0.0.1:5174'));
}

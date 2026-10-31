import { mkdir, readFile, copyFile, rm, lstat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { validateSite } from './validate.mjs';

const root = process.cwd();
const output = resolve(root, 'dist');
await validateSite(root);
// Only replace this checkout's generated directory, never a symlink target.
if (dirname(output) !== root) throw new Error('Unexpected output directory');
const existing = await lstat(output).catch(error => { if (error.code !== 'ENOENT') throw error; });
if (existing?.isSymbolicLink()) throw new Error('dist must not be a symlink');
await rm(output, { recursive: true, force: true });
const files = new Set(['index.html', 'skills.html', 'experience.html', '404.html', 'styles.css', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'llms.txt', 'Resume_Sai_Kannadkar.pdf']);
for (const page of ['index.html', 'skills.html', 'experience.html']) {
  const html = await readFile(resolve(root, page), 'utf8');
  for (const match of html.matchAll(/src="\/(assets\/[^"?#]+)"/g)) files.add(match[1]);
}
for (const file of files) {
  const destination = resolve(output, file);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(root, file), destination);
}
await validateSite(output);
console.log(`Built and validated ${files.size} public files in dist/`);

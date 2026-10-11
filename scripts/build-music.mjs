import { cp, mkdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const target = new URL('public/music/', root);
await mkdir(target, { recursive: true });
for (const name of ['index.html', 'app.js', 'styles.css']) {
  await cp(new URL(`music/${name}`, root), new URL(name, target));
}
console.log('Built MapKAI Music.');

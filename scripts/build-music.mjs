import { cp, mkdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const target = new URL('public/music/', root);
await mkdir(target, { recursive: true });
for (const name of ['index.html', 'preferences.js', 'listening.js', 'lyrics-sync.js', 'tempo.js', 'app.js', 'styles.css', 'dock.js', 'dock.css']) {
  await cp(new URL(`music/${name}`, root), new URL(name, target));
}
await cp(new URL('music/videos/', root), new URL('videos/', target), { recursive: true });
console.log('Built MapKAI Music.');

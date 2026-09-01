import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import { Readable } from 'node:stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { onRequest as videos } from '../functions/api/factory/videos.js';
import { onRequest as video } from '../functions/api/factory/video.js';
import { onRequest as source } from '../functions/api/factory/source.js';
import { onRequest as signIn } from '../functions/api/pdc/validate-pass.js';
import { CATALOG_KEY } from '../functions/api/factory/_media.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4398);
if (!process.env.MAPKAI_FOUNDER_ACCESS_CODE) throw new Error('Set a local-only MAPKAI_FOUNDER_ACCESS_CODE to enable private preview.');
const catalog = async () => JSON.parse(await fs.readFile(path.join(root, 'mapkai-video-factory/runtime/delivery/review-catalog.json'), 'utf8'));
async function objectFile(key) {
  const data = await catalog();
  for (const item of data.items) {
    const file = path.resolve(root, item.rawVideoPath);
    if (!file.startsWith(`${root}${path.sep}`)) throw new Error('Invalid local video path');
    if (key === item.objectKey) return file;
    if (key === item.auditKey) return path.join(path.dirname(file), 'raw_video_delivery_receipt.json');
    const artifact = item.sourceKeys.find(entry => entry.key === key);
    if (artifact && ['overview.md', 'narrative_blueprint.md', 'video_prompt.md'].includes(artifact.name)) return path.join(path.dirname(file), artifact.name);
  }
  return null;
}
const env = { MAPKAI_FOUNDER_ACCESS_CODE: process.env.MAPKAI_FOUNDER_ACCESS_CODE, MAPKAI_REVIEW_MEDIA: {
  async head(key) { const file = await objectFile(key); return file ? { size: (await fs.stat(file)).size } : null; },
  async get(key, options) {
    if (key === CATALOG_KEY) return { json: catalog };
    const file = await objectFile(key);
    if (!file) return null;
    const range = options?.range;
    return { body: Readable.toWeb(createReadStream(file, range ? { start: range.offset, end: range.offset + range.length - 1 } : {})) };
  },
} };
const routes = { '/api/factory/videos': videos, '/api/factory/video': video, '/api/factory/source': source, '/api/pdc/validate-pass': signIn };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (routes[url.pathname]) {
      const chunks = []; let length = 0;
      for await (const chunk of req) { length += chunk.length; if (length > 16384) { res.writeHead(413).end(); return; } chunks.push(chunk); }
      const request = new Request(url, { method: req.method, headers: req.headers, ...(!['GET', 'HEAD'].includes(req.method) ? { body: Buffer.concat(chunks) } : {}) });
      const response = await routes[url.pathname]({ request, env });
      res.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) Readable.fromWeb(response.body).pipe(res); else res.end();
      return;
    }
    const file = ['/', '/factory-review.html'].includes(url.pathname) ? 'factory-review.html' : url.pathname === '/factory-review.js' ? 'factory-review.js' : null;
    if (!file) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': file.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY' });
    res.end(await fs.readFile(path.join(root, file)));
  } catch { res.writeHead(500).end('Private preview unavailable'); }
}).listen(port, '127.0.0.1', () => console.log(`Private MapKAI review preview: http://127.0.0.1:${port}/factory-review.html`));

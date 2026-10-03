// ASSETS service-binding responses can omit Content-Length. These lengths are
// fixed for the versioned files and are checked against the assets in tests.
const files = new Map([['wood-180-60min-v1.m4a', 4715697], ['beep-180-60min-v1.m4a', 4760826]]);

// Pages' static server can return 200 to Range requests. Safari's media loader
// needs actual byte ranges. Serve only our two public, versioned audio assets.
export async function onRequest({ request, env, params }) {
  if (!files.has(params.file)) return new Response('Not found', { status: 404 });
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  const url = new URL(request.url);
  url.search = '';
  const asset = await env.ASSETS.fetch(new Request(url, { method: request.method }));
  if (!asset.ok) return asset;
  const size = Number(asset.headers.get('Content-Length')) || files.get(params.file);
  if (!Number.isSafeInteger(size) || size <= 0 || !asset.headers.get('Content-Type')?.startsWith('audio/')) {
    await asset.body?.cancel();
    return new Response('Audio unavailable', { status: 502 });
  }
  const headers = new Headers(asset.headers);
  headers.set('Content-Length', String(size));
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  const range = request.headers.get('Range');
  const ifRange = request.headers.get('If-Range');
  // Ignore unsupported/multiple ranges and stale validators, returning the file.
  const match = range?.trim().match(/^bytes=(\d*)-(\d*)$/i);
  if (request.method === 'HEAD' || !match || (!match[1] && !match[2]) || (ifRange && ifRange !== headers.get('ETag'))) {
    return new Response(request.method === 'HEAD' ? null : asset.body, { status: 200, headers });
  }
  const suffix = !match[1];
  const first = Number(match[1]);
  const last = Number(match[2]);
  const start = suffix ? Math.max(0, size - last) : first;
  const end = suffix || !match[2] ? size - 1 : Math.min(last, size - 1);
  if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last) || start >= size || end < start || (suffix && last === 0)) {
    await asset.body?.cancel();
    headers.set('Content-Range', `bytes */${size}`);
    headers.set('Content-Length', '0');
    return new Response(null, { status: 416, headers });
  }
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  return new Response(sliceStream(asset.body, start, end), { status: 206, headers });
}

function sliceStream(body, start, end) {
  const reader = body.getReader();
  let position = 0;
  return new ReadableStream({
    async pull(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) { controller.close(); return; }
          const offset = position;
          position += value.byteLength;
          if (position <= start) continue;
          controller.enqueue(value.subarray(Math.max(0, start - offset), Math.min(value.byteLength, end + 1 - offset)));
          if (position > end) { controller.close(); await reader.cancel(); }
          return;
        }
      } catch (error) { controller.error(error); await reader.cancel().catch(() => {}); }
    },
    cancel(reason) { return reader.cancel(reason); },
  });
}

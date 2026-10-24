import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest as videos } from '../functions/api/music/videos.js';
import { onRequest as video } from '../functions/api/music/video.js';
import { MUSIC_VIDEOS, VIDEO_REVISION, findVideoQuality } from '../functions/api/music/_videos.js';
import { COST_GUARD_KEY, COST_GUARD_LIMITS } from '../functions/_shared/cost-guard.js';

const first = MUSIC_VIDEOS[0];
const rendition = first.qualities[0];
const url = (query = `id=${first.id}&quality=${rendition.id}`) => `https://www.mapkai.com/api/music/video?${query}`;
const bytesAt = (offset, length) => Uint8Array.from({ length }, (_, index) => (offset + index) % 251);

function fixture({ costMissing = false, reservationLimit = Infinity, missing = false, wrongSize = false,
  wrongEtag = false, changedOnGet = false, bodyMissing = false, storageError = false } = {}) {
  const calls = [];
  let reservations = 0;
  const database = { prepare() { return { bind(...values) { return { async first() {
    if (++reservations > reservationLimit) return null;
    return { guard_key: COST_GUARD_KEY, cycle_start: values[1], class_a_used: 0, class_b_used: reservations,
      upload_bytes_used: 0, storage_bytes_reserved: COST_GUARD_LIMITS.initialStorageBytes, updated_at: values[6] };
  } }; } }; } };
  const allowed = new Map(MUSIC_VIDEOS.flatMap(item => item.qualities.map(quality => [quality.objectKey, quality])));
  const headFor = key => {
    const item = allowed.get(key);
    return missing || !item ? null : { size: item.bytes + (wrongSize ? 1 : 0),
      etag: wrongEtag ? 'wrong-etag' : item.etag, httpEtag: `"${item.etag}"` };
  };
  const bucket = {
    async head(key) {
      calls.push({ operation: 'head', key });
      if (storageError) throw new Error('Provider credentials must not escape.');
      return headFor(key);
    },
    async get(key, options) {
      calls.push({ operation: 'get', key, options });
      const head = headFor(key);
      if (!head) return null;
      if (changedOnGet) return { ...head, etag: 'replaced-between-requests' };
      if (bodyMissing) return head;
      assert.equal(options.onlyIf.etagMatches, head.etag);
      const start = options.range?.offset || 0;
      const length = options.range?.length ?? head.size;
      let position = 0;
      const body = new ReadableStream({ pull(controller) {
        const size = Math.min(16384, length - position);
        if (!size) { controller.close(); return; }
        controller.enqueue(bytesAt(start + position, size));
        position += size;
      } });
      return { ...head, body };
    },
  };
  return { calls, env: { MAPKAI_REVIEW_MEDIA: bucket,
    ...(!costMissing ? { CLOUDFLARE_COST_DB: database } : {}) } };
}

test('catalog publishes four recordings, six renditions and only same-origin public metadata', async () => {
  const response = videos({ request: new Request('https://www.mapkai.com/api/music/videos') });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.deepEqual(data.items.map(item => item.id), ['leave-a-little-room', 'your-turn-asml', 'your-turn-artworks', 'your-turn-original']);
  assert.deepEqual(data.items.map(item => item.qualities.length), [2, 2, 1, 1]);
  assert.equal(data.items.filter(item => item.featured).length, 2);
  assert.equal(data.items[0].featured, true);
  for (const item of data.items) {
    assert.deepEqual(Object.keys(item).sort(), ['id', 'title', 'description', 'durationSeconds', 'poster', 'featured', 'version', 'qualities'].sort());
    assert.equal(item.poster, `/music/videos/posters/${item.id}.jpg`);
    assert.ok(item.title.zh && item.title.en && item.description.zh && item.description.en);
    for (const quality of item.qualities) {
      assert.deepEqual(Object.keys(quality).sort(), ['id', 'label', 'bytes', 'width', 'height', 'url'].sort());
      assert.ok(quality.label.zh && quality.label.en);
      assert.equal(quality.url, `/api/music/video?id=${item.id}&quality=${quality.id}&revision=${VIDEO_REVISION}`);
      assert.equal(Object.hasOwn(quality, 'downloadUrl'), false);
    }
  }
  assert.doesNotMatch(JSON.stringify(data), /objectKey|sha256|etag|\.workspace-backups|\/Users\/|source|credentials/);
  assert.ok(Object.isFrozen(MUSIC_VIDEOS) && Object.isFrozen(first.qualities[0]));
  assert.equal(findVideoQuality('your-turn-original', 'hd'), null);
  const head = videos({ request: new Request('https://www.mapkai.com/api/music/videos', { method: 'HEAD' }) });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});

test('all six frozen renditions stream only the approved object with conditional range reads', async () => {
  for (const item of MUSIC_VIDEOS) {
    for (const quality of item.qualities) {
      const { env, calls } = fixture();
      const response = await video({ request: new Request(url(`id=${item.id}&quality=${quality.id}`), { headers: { Range: 'bytes=4-7' } }), env });
      assert.equal(response.status, 206);
      assert.equal(response.headers.get('Content-Type'), 'video/mp4');
      assert.equal(response.headers.get('Content-Range'), `bytes 4-7/${quality.bytes}`);
      assert.equal(response.headers.get('Content-Length'), '4');
      assert.equal(response.headers.get('ETag'), `"${quality.etag}"`);
      assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
      assert.match(response.headers.get('Content-Disposition'), /^inline;/);
      assert.equal(response.headers.get('Cross-Origin-Resource-Policy'), 'same-origin');
      assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
      assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytesAt(4, 4));
      assert.deepEqual(calls, [{ operation: 'head', key: quality.objectKey }, { operation: 'get', key: quality.objectKey,
        options: { onlyIf: { etagMatches: quality.etag }, range: { offset: 4, length: 4 } } }]);
    }
  }
});

test('suffix and open-ended ranges return the right final bytes without downloading a full movie', async () => {
  for (const range of ['bytes=-4', `bytes=${rendition.bytes - 4}-`, `bytes=${rendition.bytes - 4}-${rendition.bytes + 100}`]) {
    const { env, calls } = fixture();
    const response = await video({ request: new Request(url(), { headers: { Range: range } }), env });
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('Content-Range'), `bytes ${rendition.bytes - 4}-${rendition.bytes - 1}/${rendition.bytes}`);
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytesAt(rendition.bytes - 4, 4));
    assert.equal(calls[1].options.range.length, 4);
  }
});

test('invalid or multiple ranges respond 416 after HEAD without fetching the video body', async () => {
  for (const range of ['bytes=0-1,4-5', `bytes=${rendition.bytes}-`, 'bytes=-0', 'bytes=a-b', 'bytes=8-4', 'items=0-2', 'bytes=9007199254740992-']) {
    const { env, calls } = fixture();
    const response = await video({ request: new Request(url(), { headers: { Range: range } }), env });
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get('Content-Range'), `bytes */${rendition.bytes}`);
    assert.deepEqual(calls.map(call => call.operation), ['head']);
  }
});

test('HEAD never reads a body, supports seeking and defaults to the phone rendition', async () => {
  for (const ranged of [false, true]) {
    const { env, calls } = fixture();
    const response = await video({ request: new Request(url(`id=${first.id}`), { method: 'HEAD',
      ...(ranged ? { headers: { Range: 'bytes=0-99' } } : {}) }), env });
    assert.equal(response.status, ranged ? 206 : 200);
    assert.equal(response.headers.get('Content-Length'), ranged ? '100' : String(rendition.bytes));
    assert.equal(await response.text(), '');
    assert.deepEqual(calls, [{ operation: 'head', key: rendition.objectKey }]);
  }
});

test('cache validators return 304 and If-Range prevents stale partial responses', async () => {
  const etag = `"${rendition.etag}"`;
  for (const validator of [etag, `W/${etag}`, `"other", ${etag}`, '*']) {
    const { env, calls } = fixture();
    const response = await video({ request: new Request(url(), { headers: { 'If-None-Match': validator, Range: 'invalid' } }), env });
    assert.equal(response.status, 304);
    assert.equal(await response.text(), '');
    assert.deepEqual(calls.map(call => call.operation), ['head']);
  }
  for (const [validator, expected] of [[etag, 206], ['"old"', 200], [`W/${etag}`, 200]]) {
    const { env, calls } = fixture();
    const response = await video({ request: new Request(url(), { headers: { 'If-Range': validator, Range: 'bytes=0-3' } }), env });
    assert.equal(response.status, expected);
    assert.equal(response.headers.has('Content-Range'), expected === 206);
    assert.equal(Boolean(calls[1].options.range), expected === 206);
    await response.body.cancel();
  }
});

test('all previous download links are rejected before any storage or budget operation', async () => {
  for (const item of MUSIC_VIDEOS) for (const quality of item.qualities) {
    for (const method of ['GET', 'HEAD']) for (const value of ['1', '0', '']) {
      const {env,calls}=fixture();
      const response=await video({request:new Request(url(`id=${item.id}&quality=${quality.id}&revision=${VIDEO_REVISION}&download=${value}`),{method,headers:{Range:'bytes=0-3'}}),env});
      assert.equal(response.status,404);
      assert.deepEqual(calls,[]);
    }
  }
});

test('unknown identifiers, qualities, duplicate controls and arbitrary object keys never reach storage', async () => {
  for (const query of ['', 'id=unreviewed', 'id=../../private', 'id=your-turn-original&quality=hd',
    `id=${first.id}&quality=4k`, `id=${first.id}&id=${first.id}`, `id=${first.id}&quality=phone&quality=hd`,
    `id=${first.id}&key=raw/private.mp4`, `id=${first.id}&download=other`, `id=${first.id}&download=1&download=0`, `id=${first.id}&revision=unknown`, `id=${first.id}&revision=${VIDEO_REVISION}&revision=${VIDEO_REVISION}`]) {
    const { env, calls } = fixture();
    assert.equal((await video({ request: new Request(url(query)), env })).status, 404, query);
    assert.deepEqual(calls, []);
  }
});

test('missing, mismatched or concurrently replaced objects fail closed', async () => {
  for (const config of [{ missing: true }, { wrongSize: true }, { wrongEtag: true }, { changedOnGet: true }, { bodyMissing: true }]) {
    const { env, calls } = fixture(config);
    const response = await video({ request: new Request(url(), { headers: { Range: 'bytes=0-3' } }), env });
    assert.equal(response.status, 404);
    assert.deepEqual(calls.map(call => call.operation), config.changedOnGet || config.bodyMissing ? ['head', 'get'] : ['head']);
  }
});

test('cost protection and same-origin policy block reads before touching storage', async () => {
  for (const [config, expected] of [[{ costMissing: true }, 503], [{ reservationLimit: 0 }, 429]]) {
    const { env, calls } = fixture(config);
    assert.equal((await video({ request: new Request(url()), env })).status, expected);
    assert.deepEqual(calls, []);
  }
  const limited = fixture({ reservationLimit: 1 });
  assert.equal((await video({ request: new Request(url()), env: limited.env })).status, 429);
  assert.deepEqual(limited.calls.map(call => call.operation), ['head']);
  for (const headers of [{ Origin: 'https://other.example' }, { 'Sec-Fetch-Site': 'cross-site' }, { 'Sec-Fetch-Mode': 'navigate' }, { 'Sec-Fetch-Dest': 'document' }]) {
    const { env, calls } = fixture();
    assert.equal((await video({ request: new Request(url(), { headers }), env })).status, 403);
    assert.deepEqual(calls, []);
  }
  const { env } = fixture({ storageError: true });
  const failed = await video({ request: new Request(url()), env });
  assert.equal(failed.status, 503);
  assert.doesNotMatch(await failed.text(), /Provider credentials/);
});

test('both endpoints reject write methods without reading or modifying storage', async () => {
  for (const handler of [videos, video]) {
    const { env, calls } = fixture();
    const response = await handler({ request: new Request(url(), { method: 'POST' }), env });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('Allow'), 'GET, HEAD');
    assert.deepEqual(calls, []);
  }
});

test('watch-only revision creates a fresh playback URL and preserves legacy inline playback', async () => {
  const {env,calls}=fixture();
  const response=await video({request:new Request(url(`id=${first.id}&quality=phone&revision=${VIDEO_REVISION}`),{method:'HEAD'}),env});
  assert.equal(response.status,200);
  assert.equal(calls[0].key,rendition.objectKey);
});

test('normal browser video requests and existing inline revision remain playable', async () => {
  for (const revision of [VIDEO_REVISION, 'song-names-20261024', 'ai-label-20261023']) {
    const {env}=fixture();
    const response=await video({request:new Request(url(`id=${first.id}&quality=phone&revision=${revision}`),{headers:{'Sec-Fetch-Site':'same-origin','Sec-Fetch-Dest':'video','Sec-Fetch-Mode':'no-cors',Range:'bytes=0-3'}}),env});
    assert.equal(response.status,206);
    assert.match(response.headers.get('Vary'), /Sec-Fetch-Dest/);
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()),bytesAt(0,4));
  }
});

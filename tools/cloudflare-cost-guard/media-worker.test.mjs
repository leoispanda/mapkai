import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { parseMediaRange } from './media-worker.mjs';
import { COST_GUARD_KEY, COST_GUARD_LIMITS } from './shared/cost-guard.mjs';

function fixture({ allowance = Infinity, fail, malformed, missing = false, objectMissing = false, changed = false } = {}) {
  const calls = { reserve: 0, head: [], get: [] };
  const content = new TextEncoder().encode('0123456789');
  const object = {
    etag: 'version-1', httpEtag: '"version-1"', size: content.length,
    uploaded: new Date('2026-10-01T12:00:00Z'),
    writeHttpMetadata(headers) { headers.set('Content-Type', 'video/mp4'); },
  };
  const database = {
    prepare() { return { bind(...values) { return { async first() {
      calls.reserve++;
      if (fail) throw new Error('Private provider error must not leak');
      if (malformed) return { bogus: true };
      if (calls.reserve > allowance) return null;
      return {
        guard_key: COST_GUARD_KEY, cycle_start: values[1], class_a_used: 0,
        class_b_used: calls.reserve, upload_bytes_used: 0,
        storage_bytes_reserved: COST_GUARD_LIMITS.initialStorageBytes,
        updated_at: values[6],
      };
    } }; } }; },
  };
  const bucket = {
    async head(key) { calls.head.push(key); return objectMissing ? null : object; },
    async get(key, options) {
      calls.get.push({ key, options });
      if (changed) return { ...object, body: undefined };
      const range = options.range;
      const data = range ? content.slice(range.offset, range.offset + range.length) : content;
      return { ...object, body: new Blob([data]).stream() };
    },
  };
  const env = { MAPKAI_FINANCE_MEDIA: bucket, TURNPO_MEDIA: bucket,
    ...(missing ? {} : { CLOUDFLARE_COST_DB: database }) };
  const request = (options = {}, url = 'https://media.mapkai.com/videos/demo.mp4') => worker.fetch(new Request(url, options), env);
  return { request, env, calls };
}

for (const [name, config, status] of [
  ['missing', { missing: true }, 503], ['failed', { fail: true }, 503],
  ['malformed', { malformed: true }, 503], ['exhausted', { allowance: 0 }, 429],
]) {
  test(`${name} ledger rejects before any R2 operation`, async () => {
    const { request, calls } = fixture(config);
    const response = await request();
    assert.equal(response.status, status);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('x-cloudflare-cost-guard'), 'protected');
    assert.equal(calls.head.length + calls.get.length, 0);
    assert.doesNotMatch(await response.text(), /Private provider/);
  });
}

test('GET exhaustion after HEAD blocks body read without refunding HEAD', async () => {
  const { request, calls } = fixture({ allowance: 1 });
  assert.equal((await request()).status, 429);
  assert.equal(calls.reserve, 2);
  assert.equal(calls.head.length, 1);
  assert.equal(calls.get.length, 0);
});

test('GET returns full bytes and validators after two reservations', async () => {
  const { request, calls } = fixture();
  const response = await request();
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '0123456789');
  assert.equal(response.headers.get('content-length'), '10');
  assert.equal(response.headers.get('content-type'), 'video/mp4');
  assert.equal(response.headers.get('etag'), '"version-1"');
  assert.equal(response.headers.get('accept-ranges'), 'bytes');
  assert.equal(calls.reserve, 2);
  assert.deepEqual(calls.get[0].options, { onlyIf: { etagMatches: 'version-1' } });
});

test('HEAD ignores range, returns length and never fetches a body', async () => {
  const { request, calls } = fixture();
  const response = await request({ method: 'HEAD', headers: { Range: 'bytes=2-4' } });
  assert.equal(response.status, 200);
  assert.equal(response.body, null);
  assert.equal(response.headers.get('content-length'), '10');
  assert.equal(response.headers.get('content-range'), null);
  assert.equal(calls.reserve, 1);
  assert.equal(calls.get.length, 0);
});

for (const [range, bytes, contentRange] of [
  ['bytes=2-4', '234', 'bytes 2-4/10'], ['bytes=8-', '89', 'bytes 8-9/10'],
  ['bytes=-3', '789', 'bytes 7-9/10'], ['bytes=8-100', '89', 'bytes 8-9/10'],
]) {
  test(`${range} returns the correct byte range`, async () => {
    const { request } = fixture();
    const response = await request({ headers: { Range: range } });
    assert.equal(response.status, 206);
    assert.equal(await response.text(), bytes);
    assert.equal(response.headers.get('content-range'), contentRange);
    assert.equal(response.headers.get('content-length'), String(bytes.length));
  });
}

test('invalid and multi-range requests consume only HEAD and return 416', async () => {
  for (const range of ['bytes=10-', 'bytes=4-2', 'bytes=-0', 'bytes=-', 'bytes=0-1,3-4', 'bytes=9007199254740992-']) {
    const { request, calls } = fixture();
    const response = await request({ headers: { Range: range } });
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get('content-range'), 'bytes */10');
    assert.equal(calls.get.length, 0);
  }
  assert.throws(() => parseMediaRange('bytes=0-', 0));
});

test('If-Range matching strong ETag or valid date permits range', async () => {
  for (const value of ['"version-1"', 'Thu, 01 Oct 2026 12:00:00 GMT']) {
    const { request } = fixture();
    assert.equal((await request({ headers: { Range: 'bytes=1-2', 'If-Range': value } })).status, 206);
  }
});

test('If-Range stale, weak and malformed validators return full object', async () => {
  for (const value of ['"version-2"', 'W/"version-1"', 'Wed, 30 Sep 2026 12:00:00 GMT', 'invalid']) {
    const { request } = fixture();
    const response = await request({ headers: { Range: 'bytes=1-2', 'If-Range': value } });
    assert.equal(response.status, 200, value);
    assert.equal(await response.text(), '0123456789');
    assert.equal(response.headers.get('content-range'), null);
  }
});

test('If-None-Match matches wildcard, strong and weak ETags without body reads', async () => {
  for (const value of ['*', '"version-1"', '"old", W/"version-1"']) {
    const { request, calls } = fixture();
    const response = await request({ headers: { 'If-None-Match': value } });
    assert.equal(response.status, 304, value);
    assert.equal(response.body, null);
    assert.equal(calls.get.length, 0);
  }
});

test('If-None-Match takes precedence over If-Modified-Since', async () => {
  const { request } = fixture();
  const response = await request({ headers: {
    'If-None-Match': '"old"', 'If-Modified-Since': 'Thu, 08 Oct 2026 12:00:00 GMT',
  } });
  assert.equal(response.status, 200);
});

test('If-Modified-Since recognizes unchanged media', async () => {
  const { request, calls } = fixture();
  assert.equal((await request({ headers: { 'If-Modified-Since': 'Thu, 01 Oct 2026 12:00:00 GMT' } })).status, 304);
  assert.equal(calls.get.length, 0);
});

test('changed object between HEAD and GET fails closed without stale length/body', async () => {
  const { request } = fixture({ changed: true });
  const response = await request();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('content-length'), null);
});

test('unknown or inherited hostnames, invalid keys, and unsupported methods do no storage work', async () => {
  for (const [url, options, status] of [
    ['https://example.com/file', {}, 404], ['https://constructor/file', {}, 404],
    ['https://media.mapkai.com/', {}, 404], ['https://media.mapkai.com/%00', {}, 404],
    ['https://media.mapkai.com/%ZZ', {}, 400],
    ['https://media.mapkai.com/file', { method: 'POST' }, 405],
    ['https://media.mapkai.com/file', { method: 'OPTIONS' }, 405],
  ]) {
    const { request, calls } = fixture();
    const response = await request(options, url);
    assert.equal(response.status, status, url);
    assert.equal(calls.reserve + calls.head.length + calls.get.length, 0);
  }
});

test('both intended hosts map to protected buckets and percent-encoded keys decode once', async () => {
  const { request, calls } = fixture();
  assert.equal((await request({}, 'https://media.turnpo.com/a%20b%2520.mp4')).status, 200);
  assert.equal(calls.head[0], 'a b%20.mp4');
  assert.equal(calls.get[0].key, 'a b%20.mp4');
});

test('missing media returns 404 after only its reserved HEAD', async () => {
  const { request, calls } = fixture({ objectMissing: true });
  assert.equal((await request()).status, 404);
  assert.equal(calls.reserve, 1);
  assert.equal(calls.get.length, 0);
});

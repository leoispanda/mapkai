import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { onRequest as auth } from '../functions/api/music/auth.js';
import { onRequest as tracks } from '../functions/api/music/tracks.js';
import { onRequest as audio } from '../functions/api/music/audio.js';
import { validateAudio } from '../functions/api/music/_audio-validation.js';
import { createFounderAccessCookie } from '../functions/api/pdc/_shared.js';
import { AUDIO_TYPES, MAX_LYRICS_CHARS, MAX_LYRICS_TIMING_CUES, MAX_LYRICS_TIMING_SECONDS, MAX_MUSIC_UPLOAD_BYTES,
  MAX_TRACK_METADATA_BYTES, TRACK_SCHEMA, audioKey, metadataKey, normalizeLyrics, normalizeLyricsTiming, publicTrack,
  readTrack, safeTrack } from '../functions/api/music/_shared.js';
import { COST_GUARD_KEY, COST_GUARD_LIMITS } from '../functions/_shared/cost-guard.js';

const id = '11111111-1111-4111-8111-111111111111';
const encoder = new TextEncoder();
const mp3Bytes = new Uint8Array(834);
mp3Bytes.set([0xff, 0xfb, 0x90, 0x00], 0);
mp3Bytes.set([0xff, 0xfb, 0x90, 0x00], 417);
const mp3File = () => new File([mp3Bytes], 'First song.mp3', { type: 'audio/mpeg' });

function fixture({ reservationLimit = Infinity, costMissing = false, failPublication = false } = {}) {
  const calls = [];
  const objects = new Map();
  let reserved = 0;
  let uploadedBytes = 0;
  let rateCount = 0;
  const costDatabase = {
    prepare() { return { bind(...values) { return { async first() {
      reserved++;
      if (reserved > reservationLimit) return null;
      uploadedBytes += values[4];
      return { guard_key: COST_GUARD_KEY, cycle_start: values[1], class_a_used: reserved,
        class_b_used: reserved, upload_bytes_used: uploadedBytes,
        storage_bytes_reserved: COST_GUARD_LIMITS.initialStorageBytes + uploadedBytes, updated_at: values[6] };
    } }; } }; },
  };
  const database = {
    prepare() { return { async run() {}, bind() { return { async first() {
      return { count: ++rateCount, reset_at: Math.floor(Date.now() / 1000) + 900 };
    } }; } }; },
  };
  const base = object => ({ size: object.bytes.length, etag: object.etag, httpEtag: `"${object.etag}"`, uploaded: new Date(), key: object.key });
  const bucket = {
    async put(key, value, options = {}) {
      calls.push({ operation: 'put', key, options });
      if (failPublication && key.startsWith('music/tracks/')) throw new Error('Provider secrets must not appear in responses.');
      if (options.onlyIf?.etagDoesNotMatch === '*' && objects.has(key)) return null;
      const bytes = value instanceof Blob ? new Uint8Array(await value.arrayBuffer()) : new Uint8Array(value);
      const object = { key, bytes, etag: createHash('md5').update(bytes).digest('hex') };
      objects.set(key, object);
      return base(object);
    },
    async list(options) {
      calls.push({ operation: 'list', options });
      const keys = [...objects.keys()].filter(key => key.startsWith(options.prefix)).sort();
      const offset = options.cursor ? Number(options.cursor) : 0;
      const page = keys.slice(offset, offset + options.limit);
      return { objects: page.map(key => base(objects.get(key))), truncated: offset + page.length < keys.length,
        cursor: offset + page.length < keys.length ? String(offset + page.length) : undefined };
    },
    async head(key) {
      calls.push({ operation: 'head', key });
      const object = objects.get(key);
      return object ? base(object) : null;
    },
    async get(key, options = {}) {
      calls.push({ operation: 'get', key, options });
      const object = objects.get(key);
      if (!object) return null;
      if (options.onlyIf?.etagMatches && options.onlyIf.etagMatches !== object.etag) return base(object);
      const bytes = options.range ? object.bytes.slice(options.range.offset, options.range.offset + options.range.length) : object.bytes;
      return { ...base(object), body: new Blob([bytes]).stream(), json: async () => JSON.parse(new TextDecoder().decode(bytes)) };
    },
  };
  const env = { MAPKAI_FOUNDER_ACCESS_CODE: 'fixture-code-not-real', MAPKAI_DB: database, MAPKAI_REVIEW_MEDIA: bucket,
    ...(!costMissing ? { CLOUDFLARE_COST_DB: costDatabase } : {}) };
  const install = (trackId = id, title = 'First song', metadata = {}) => {
    const bytes = mp3Bytes.slice();
    const objectKey = audioKey(trackId, 'mp3');
    const audioEtag = createHash('md5').update(bytes).digest('hex');
    objects.set(objectKey, { key: objectKey, bytes, etag: audioEtag });
    const track = { schemaVersion: TRACK_SCHEMA, visibility: 'PUBLIC', language: 'en', id: trackId, title, description: '', filename: 'First song.mp3',
      createdAt: '2026-10-11T10:00:00.000Z', extension: 'mp3', contentType: AUDIO_TYPES.mp3, fileSize: bytes.length, objectKey, audioEtag, ...metadata };
    const key = metadataKey(trackId);
    const data = encoder.encode(JSON.stringify(track));
    objects.set(key, { key, bytes: data, etag: createHash('md5').update(data).digest('hex') });
    return track;
  };
  return { env, calls, objects, install, reservations: () => reserved, uploadBytes: () => uploadedBytes };
}

async function uploadRequest(env, { owner = true, origin = 'https://www.mapkai.com', file = mp3File(), title = 'First song', description = '', language = 'en', lyrics } = {}) {
  const form = new FormData();
  form.set('file', file);
  form.set('title', title);
  form.set('description', description);
  if (language !== null) form.set('language', language);
  if (lyrics !== undefined) form.set('lyrics', lyrics);
  const cookie = owner ? (await createFounderAccessCookie(env)).split(';')[0] : '';
  return new Request('https://www.mapkai.com/api/music/tracks', { method: 'POST', body: form, headers: { Origin: origin, Cookie: cookie } });
}

test('owner cookie verifies and login sets only an HttpOnly signed cookie', async () => {
  const { env } = fixture();
  const guest = await auth({ request: new Request('https://www.mapkai.com/api/music/auth'), env });
  assert.deepEqual(await guest.json(), { owner: false, uploadConfigured: true });
  const login = await auth({ request: new Request('https://www.mapkai.com/api/music/auth', {
    method: 'POST', headers: { Origin: 'https://www.mapkai.com', 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: env.MAPKAI_FOUNDER_ACCESS_CODE }),
  }), env });
  assert.equal(login.status, 200);
  const body = await login.json();
  assert.deepEqual(body, { owner: true, uploadConfigured: true });
  assert.equal(Object.hasOwn(body, 'token'), false);
  assert.match(login.headers.get('Set-Cookie'), /HttpOnly; SameSite=Lax; Secure/);
  const owner = await auth({ request: new Request('https://www.mapkai.com/api/music/auth', { headers: { Cookie: login.headers.get('Set-Cookie').split(';')[0] } }), env });
  assert.equal((await owner.json()).owner, true);
});

test('authentication reports missing upload protection and rate limits guessing', async () => {
  const { env } = fixture({ costMissing: true });
  assert.equal((await (await auth({ request: new Request('https://www.mapkai.com/api/music/auth'), env })).json()).uploadConfigured, false);
  for (let index = 0; index < 6; index++) {
    const response = await auth({ request: new Request('https://www.mapkai.com/api/music/auth', { method: 'POST',
      headers: { Origin: 'https://www.mapkai.com', 'Content-Type': 'application/json' }, body: JSON.stringify({ code: 'incorrect' }) }), env });
    assert.equal(response.status, index < 5 ? 401 : 429);
  }
});

test('public and forged-cookie uploads never touch R2 or the cost ledger', async () => {
  const { env, calls, reservations } = fixture();
  const publicResponse = await tracks({ request: await uploadRequest(env, { owner: false }), env });
  assert.equal(publicResponse.status, 401);
  const forged = await uploadRequest(env, { owner: false });
  forged.headers.set('Cookie', 'mapkai_pdc_founder=1.fake');
  assert.equal((await tracks({ request: forged, env })).status, 401);
  const crossSite = await tracks({ request: await uploadRequest(env, { origin: 'https://attacker.example' }), env });
  assert.equal(crossSite.status, 403);
  assert.deepEqual(calls, []);
  assert.equal(reservations(), 0);
});

test('successful song uploads durably save audio then its individual public metadata', async () => {
  const { env, calls, objects, reservations, uploadBytes } = fixture();
  const response = await tracks({ request: await uploadRequest(env, { title: '夜航', description: 'Created with ElevenLabs' }), env });
  assert.equal(response.status, 201);
  const { track } = await response.json();
  assert.equal(track.title, '夜航');
  assert.equal(track.description, 'Created with ElevenLabs');
  assert.equal(track.language, 'en');
  assert.equal(track.aiGenerated, true);
  assert.equal(track.generationProvider, 'ElevenLabs');
  const stored = JSON.parse(new TextDecoder().decode(objects.get(metadataKey(track.id)).bytes));
  assert.equal(stored.aiGenerated, true);
  assert.equal(stored.generationProvider, 'ElevenLabs');
  assert.match(track.url, /^\/api\/music\/audio\?id=/);
  assert.equal(Object.hasOwn(track, 'objectKey'), false);
  assert.deepEqual(calls.map(call => call.operation), ['put', 'put']);
  assert.equal(calls[0].key, audioKey(track.id, 'mp3'));
  assert.equal(calls[1].key, metadataKey(track.id));
  assert.deepEqual(calls[0].options.onlyIf, { etagDoesNotMatch: '*' });
  assert.deepEqual(calls[1].options.onlyIf, { etagDoesNotMatch: '*' });
  assert.equal(reservations(), 2);
  assert.equal(uploadBytes(), [...objects.values()].reduce((sum, object) => sum + object.bytes.length, 0));
  const listed = await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env });
  assert.deepEqual((await listed.json()).tracks, [track]);
});

test('simultaneous uploads create separate tracks and retain both songs', async () => {
  const { env, objects } = fixture();
  const responses = await Promise.all(['One', 'Two'].map(async title => tracks({ request: await uploadRequest(env, { title }), env })));
  assert.ok(responses.every(response => response.status === 201));
  assert.equal([...objects.keys()].filter(key => key.startsWith('music/tracks/')).length, 2);
  const catalog = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
  assert.deepEqual(catalog.tracks.map(track => track.title).sort(), ['One', 'Two']);
});

test('a failed publication leaves audio unlisted and cannot play it by guessing its id', async () => {
  const { env, objects } = fixture({ failPublication: true });
  const response = await tracks({ request: await uploadRequest(env), env });
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /Provider secrets/);
  assert.equal(objects.size, 1);
  const catalog = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
  assert.deepEqual(catalog.tracks, []);
  const trackId = [...objects.keys()][0].split('/').pop().slice(0, -4);
  assert.equal((await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${trackId}`), env })).status, 404);
});

test('missing or exhausted protection blocks each read/write before R2 access', async () => {
  for (const config of [{ costMissing: true }, { reservationLimit: 0 }]) {
    const { env, calls, install } = fixture(config);
    install();
    const expected = config.costMissing ? 503 : 429;
    for (const [handler, request] of [
      [tracks, new Request('https://www.mapkai.com/api/music/tracks')],
      [audio, new Request(`https://www.mapkai.com/api/music/audio?id=${id}`)],
      [tracks, await uploadRequest(env)],
    ]) assert.equal((await handler({ request, env })).status, expected);
    assert.deepEqual(calls, []);
  }
  const { env, calls, install } = fixture({ reservationLimit: 1 });
  install();
  const response = await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`), env });
  assert.equal(response.status, 429);
  assert.deepEqual(calls.map(call => call.operation), ['get']);
});

test('audio supports streaming, seeking, HEAD, validators and rejects multiple or invalid ranges', async () => {
  const { env, calls, install, reservations } = fixture();
  const track = install();
  const response = await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`, { headers: { Range: 'bytes=4-7' } }), env });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), `bytes 4-7/${mp3Bytes.length}`);
  assert.equal(response.headers.get('Content-Type'), 'audio/mpeg');
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), mp3Bytes.slice(4, 8));
  assert.deepEqual(calls.map(call => call.operation), ['get', 'head', 'get']);
  assert.deepEqual(calls[2].options, { onlyIf: { etagMatches: track.audioEtag }, range: { offset: 4, length: 4 } });
  assert.equal(reservations(), 3);
  calls.length = 0;
  const head = await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`, { method: 'HEAD' }), env });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.deepEqual(calls.map(call => call.operation), ['get', 'head']);
  for (const range of ['bytes=0-1,4-5', 'bytes=9999-', 'bytes=-0', 'bytes=a-b']) {
    calls.length = 0;
    const invalid = await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`, { headers: { Range: range } }), env });
    assert.equal(invalid.status, 416);
    assert.deepEqual(calls.map(call => call.operation), ['get', 'head']);
  }
  const cached = await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`, { headers: { 'If-None-Match': `"${track.audioEtag}"` } }), env });
  assert.equal(cached.status, 304);
});

test('public responses never expose private bucket keys and arbitrary keys cannot be requested', async () => {
  const { env, calls, install } = fixture();
  install();
  const response = await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env });
  assert.doesNotMatch(await response.text(), /music\/audio\/|objectKey|audioEtag|schemaVersion|visibility/);
  calls.length = 0;
  for (const value of ['../../catalog/review-v1', 'raw/private-video.mp4', '']) {
    assert.equal((await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${encodeURIComponent(value)}`), env })).status, 404);
  }
  assert.deepEqual(calls, []);
});

test('uploads reject wrong signatures, mismatched MIME and oversized requests before writes', async () => {
  const { env, calls } = fixture();
  for (const file of [new File(['<html>not audio</html>'], 'bad.mp3', { type: 'audio/mpeg' }),
    new File([mp3Bytes], 'bad.mp3', { type: 'text/html' }), new File([mp3Bytes], 'bad.exe', { type: 'audio/mpeg' })]) {
    const response = await tracks({ request: await uploadRequest(env, { file }), env });
    assert.equal(response.status, 415);
  }
  const request = await uploadRequest(env);
  request.headers.set('Content-Length', String(MAX_MUSIC_UPLOAD_BYTES + 1));
  assert.equal((await tracks({ request, env })).status, 413);
  assert.deepEqual(calls, []);
});

test('a Dutch upload preserves its declaration and plays publicly beside existing English songs', async () => {
  const { env, objects, install } = fixture();
  const english = install(id, 'English song');
  const englishBefore = objects.get(metadataKey(id)).bytes.slice();
  const response = await tracks({ request: await uploadRequest(env, { title: 'Nederlandse Velden', language: 'nl' }), env });
  assert.equal(response.status, 201);
  const { track } = await response.json();
  assert.equal(track.language, 'nl');
  assert.equal(track.title, 'Nederlandse Velden');
  const stored = JSON.parse(new TextDecoder().decode(objects.get(metadataKey(track.id)).bytes));
  assert.equal(stored.language, 'nl');
  assert.deepEqual(objects.get(metadataKey(id)).bytes, englishBefore);
  const catalog = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
  assert.deepEqual(catalog.tracks.find(item => item.id === id), {
    id, title: english.title, description: english.description, language: 'en', lyrics: '', lyricsTiming: [],
    aiGenerated: null, generationProvider: null,
    url: `/api/music/audio?id=${id}`, durationSeconds: null, createdAt: english.createdAt, filename: english.filename,
  });
  assert.deepEqual(catalog.tracks.find(item => item.id === track.id), track);
  const playback = await audio({ request: new Request(`https://www.mapkai.com${track.url}`), env });
  assert.equal(playback.status, 200);
  assert.deepEqual(new Uint8Array(await playback.arrayBuffer()), mp3Bytes);
});

test('a Chinese ElevenLabs upload publishes its title, language and AI disclosure with playable audio', async () => {
  const { env, objects } = fixture();
  const response = await tracks({ request: await uploadRequest(env, { title: '再看一眼', language: 'zh' }), env });
  assert.equal(response.status, 201);
  const { track } = await response.json();
  assert.equal(track.title, '再看一眼');
  assert.equal(track.language, 'zh');
  assert.equal(track.aiGenerated, true);
  assert.equal(track.generationProvider, 'ElevenLabs');
  const stored = JSON.parse(new TextDecoder().decode(objects.get(metadataKey(track.id)).bytes));
  assert.equal(stored.language, 'zh');
  assert.equal(stored.aiGenerated, true);
  assert.equal(stored.generationProvider, 'ElevenLabs');
  const catalog = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
  assert.deepEqual(catalog.tracks, [track]);
  const playback = await audio({ request: new Request(`https://www.mapkai.com${track.url}`), env });
  assert.equal(playback.status, 200);
  assert.deepEqual(new Uint8Array(await playback.arrayBuffer()), mp3Bytes);
});

test('English and Chinese multi-section lyrics normalize, persist and appear in the public list', async () => {
  for (const [language, suppliedLyrics, expectedLyrics] of [
    ['en', '  [Verse 1]\r\nLook again\r\nFind a new way\r\n\r\n[Chorus]\rMapKAI, look again\r\n  ',
      '[Verse 1]\nLook again\nFind a new way\n\n[Chorus]\nMapKAI, look again'],
    ['zh', '\n[主歌]\r\n再看一眼\r\n让好奇心指路\r\n\r\n[副歌]\r世界就在眼前\n',
      '[主歌]\n再看一眼\n让好奇心指路\n\n[副歌]\n世界就在眼前'],
  ]) {
    const { env, objects, calls } = fixture();
    const response = await tracks({ request: await uploadRequest(env, { language, lyrics: suppliedLyrics }), env });
    assert.equal(response.status, 201);
    const { track } = await response.json();
    assert.equal(track.lyrics, expectedLyrics);
    const stored = JSON.parse(new TextDecoder().decode(objects.get(metadataKey(track.id)).bytes));
    assert.equal(stored.lyrics, expectedLyrics);
    assert.equal(stored.schemaVersion, TRACK_SCHEMA);
    assert.deepEqual(calls.map(call => call.operation), ['put', 'put']);
    const catalog = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
    assert.deepEqual(catalog.tracks, [track]);
    const playback = await audio({ request: new Request(`https://www.mapkai.com${track.url}`), env });
    assert.equal(playback.status, 200);
    assert.deepEqual(new Uint8Array(await playback.arrayBuffer()), mp3Bytes);
  }
});

test('legacy songs without lyrics remain playable and expose an empty string without rewriting metadata', async () => {
  const { env, install, objects } = fixture();
  const legacy = install();
  const before = objects.get(metadataKey(id)).bytes.slice();
  assert.equal(Object.hasOwn(legacy, 'lyrics'), false);
  assert.equal(safeTrack(legacy), true);
  const catalog = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
  assert.equal(catalog.tracks[0].lyrics, '');
  assert.equal((await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`), env })).status, 200);
  assert.deepEqual(objects.get(metadataKey(id)).bytes, before);
  const response = await tracks({ request: await uploadRequest(env), env });
  const { track } = await response.json();
  assert.equal(response.status, 201);
  assert.equal(track.lyrics, '');
  assert.equal(JSON.parse(new TextDecoder().decode(objects.get(metadataKey(track.id)).bytes)).lyrics, '');
});

test('12,000-character Chinese lyrics exceed the old metadata cap and still list/play completely', async () => {
  const { env, objects } = fixture();
  const lyrics = '再看一眼'.repeat(MAX_LYRICS_CHARS / 4);
  const response = await tracks({ request: await uploadRequest(env, { language: 'zh', lyrics }), env });
  assert.equal(response.status, 201);
  const { track } = await response.json();
  assert.equal(track.lyrics, lyrics);
  const metadataBytes = objects.get(metadataKey(track.id)).bytes.length;
  assert.ok(metadataBytes > 16 * 1024 && metadataBytes <= MAX_TRACK_METADATA_BYTES);
  const catalog = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
  assert.equal(catalog.tracks[0].lyrics, lyrics);
  assert.equal((await audio({ request: new Request(`https://www.mapkai.com${track.url}`), env })).status, 200);
});

test('lyrics reject malformed values, control characters and oversized text without storage writes', async () => {
  for (const value of [{ lines: ['Look again'] }, ['Look again'], null, 123, true]) {
    assert.throws(() => normalizeLyrics(value), error => error.musicInputError && error.status === 400);
  }
  for (const lyrics of [new File(['Look again'], 'lyrics.txt', { type: 'text/plain' }),
    'Line one\u0000Line two', 'Line one\tLine two', 'Line one\u0085Line two', 'x'.repeat(MAX_LYRICS_CHARS + 1)]) {
    const { env, calls, reservations } = fixture();
    const response = await tracks({ request: await uploadRequest(env, { lyrics }), env });
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /Lyrics/);
    assert.deepEqual(calls, []);
    assert.equal(reservations(), 0);
  }
  const { env, calls } = fixture();
  const request = await uploadRequest(env, { lyrics: 'First value' });
  const form = await request.formData();
  form.append('lyrics', 'Second value');
  const duplicate = new Request(request.url, { method: 'POST', body: form,
    headers: { Origin: request.headers.get('Origin'), Cookie: request.headers.get('Cookie') } });
  assert.equal((await tracks({ request: duplicate, env })).status, 400);
  assert.deepEqual(calls, []);
});

test('malformed stored lyrics cannot reach the public catalog or audio response', async () => {
  for (const lyrics of [{ text: 'Look again' }, null, 'Wrong\u0000control', 'x'.repeat(MAX_LYRICS_CHARS + 1)]) {
    const { env, install, calls } = fixture();
    const stored = install(id, 'Invalid lyrics', { lyrics });
    assert.equal(safeTrack(stored), false);
    assert.equal((await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).status, 503);
    calls.length = 0;
    assert.equal((await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`), env })).status, 503);
    assert.deepEqual(calls.map(call => call.operation), ['get']);
  }
});

test('lyrics timing uses normalized original line indexes and complete multilingual sung-line coverage', () => {
  const lyrics = '  [Verse 1]\r\nLook again\r\nFind a new way\r\n\r\n [副歌] \r\n再看一眼\r\n  ';
  const cues = [{ line: 1, start: 1.25, end: 3 }, { line: 2, start: 3, end: 5.2 }, { line: 5, start: 8, end: 10 }];
  const normalized = normalizeLyricsTiming(lyrics, cues);
  assert.deepEqual(normalized, cues);
  assert.notEqual(normalized, cues);
  assert.notEqual(normalized[0], cues[0]);
  assert.deepEqual(normalizeLyricsTiming('[Instrumental]\n\n[Outro]', []), []);
  assert.deepEqual(normalizeLyricsTiming('Final line', [{ line: 0, start: 0, end: MAX_LYRICS_TIMING_SECONDS }]),
    [{ line: 0, start: 0, end: MAX_LYRICS_TIMING_SECONDS }]);
  const maximumLyrics = Array(MAX_LYRICS_TIMING_CUES).fill('Line').join('\n');
  const maximumCues = Array.from({ length: MAX_LYRICS_TIMING_CUES }, (_, line) => ({ line, start: line, end: line + 1 }));
  assert.equal(normalizeLyricsTiming(maximumLyrics, maximumCues).length, MAX_LYRICS_TIMING_CUES);
});

test('lyrics timing rejects malformed, incomplete, unordered, overlapping and out-of-bound cues', () => {
  const lyrics = '[Verse]\nFirst line\n\n[Chorus]\nSecond line';
  const valid = [{ line: 1, start: 1, end: 2 }, { line: 4, start: 3, end: 4 }];
  const invalid = [undefined, null, {}, 'timing', [], valid.slice(0, 1), new Array(2),
    [null, valid[1]], [[1, 1, 2], valid[1]], [{ ...valid[0], text: 'First line' }, valid[1]],
    [{ start: 1, end: 2 }, valid[1]], [{ ...valid[0], line: '1' }, valid[1]],
    [{ ...valid[0], line: 0 }, valid[1]], [{ ...valid[0], line: 2 }, valid[1]],
    [valid[1], valid[0]], [valid[0], { ...valid[1], line: 1 }],
    [{ ...valid[0], start: '1' }, valid[1]], [{ ...valid[0], start: -1 }, valid[1]],
    [{ ...valid[0], start: NaN }, valid[1]], [{ ...valid[0], end: Infinity }, valid[1]],
    [{ ...valid[0], end: 1 }, valid[1]], [valid[0], { ...valid[1], start: 1.9 }],
    [valid[0], { ...valid[1], end: MAX_LYRICS_TIMING_SECONDS + 0.01 }],
  ];
  for (const value of invalid) assert.throws(() => normalizeLyricsTiming(lyrics, value),
    error => error.musicInputError && error.status === 400);
  const excessLyrics = Array(MAX_LYRICS_TIMING_CUES + 1).fill('Line').join('\n');
  const excessCues = Array.from({ length: MAX_LYRICS_TIMING_CUES + 1 }, (_, line) => ({ line, start: line, end: line + 1 }));
  assert.throws(() => normalizeLyricsTiming(excessLyrics, excessCues), /600 cues/);
});

test('stored lyric timing is public only after exact normalized UTF-8 hash verification', async () => {
  const { env, install, objects } = fixture();
  const suppliedLyrics = ' [Verse]\r\nLook again\r\n\r\n[副歌]\r\n再看一眼\r\n ';
  const lyrics = normalizeLyrics(suppliedLyrics);
  const lyricsTiming = [{ line: 1, start: 2.5, end: 5 }, { line: 4, start: 6, end: 9.25 }];
  const lyricsTimingSha256 = createHash('sha256').update(lyrics, 'utf8').digest('hex');
  const stored = install(id, 'Timed lyrics', { lyrics: suppliedLyrics, lyricsTiming, lyricsTimingSha256 });
  const before = objects.get(metadataKey(id)).bytes.slice();
  assert.equal(safeTrack(stored), true);
  assert.deepEqual(publicTrack(stored).lyricsTiming, []);
  const readable = await readTrack(env.MAPKAI_REVIEW_MEDIA, id);
  assert.notEqual(readable, stored);
  assert.deepEqual(publicTrack(readable).lyricsTiming, lyricsTiming);
  assert.deepEqual(publicTrack({ ...readable }).lyricsTiming, []);
  const publicCues = publicTrack(readable).lyricsTiming;
  publicCues[0].start = 100;
  assert.deepEqual(publicTrack(readable).lyricsTiming, lyricsTiming);
  readable.lyrics = lyrics.replace('Look again', 'Different words');
  assert.deepEqual(publicTrack(readable).lyricsTiming, []);
  const response = await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env });
  assert.equal(response.status, 200);
  const catalog = await response.json();
  assert.equal(catalog.tracks[0].lyrics, lyrics);
  assert.deepEqual(catalog.tracks[0].lyricsTiming, lyricsTiming);
  assert.equal(Object.hasOwn(catalog.tracks[0], 'lyricsTimingSha256'), false);
  assert.equal((await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`), env })).status, 200);
  assert.deepEqual(objects.get(metadataKey(id)).bytes, before);
});

test('missing, invalid or stale lyric timing falls back without blocking catalog, playback or seeking', async () => {
  const lyrics = '[Verse]\nFirst line\n\n[Chorus]\nSecond line';
  const lyricsTiming = [{ line: 1, start: 1, end: 2 }, { line: 4, start: 3, end: 4 }];
  const lyricsTimingSha256 = createHash('sha256').update(lyrics, 'utf8').digest('hex');
  for (const metadata of [
    {}, { lyricsTiming }, { lyricsTiming, lyricsTimingSha256: 'a'.repeat(64) },
    { lyricsTiming, lyricsTimingSha256: { toString: null } },
    { lyricsTiming, lyricsTimingSha256: [lyricsTimingSha256] },
    { lyricsTiming: null, lyricsTimingSha256 }, { lyricsTiming: {}, lyricsTimingSha256 },
    { lyricsTiming: [], lyricsTimingSha256 }, { lyricsTiming: lyricsTiming.slice(0, 1), lyricsTimingSha256 },
    { lyricsTiming: [lyricsTiming[0], { ...lyricsTiming[1], start: 1.5 }], lyricsTimingSha256 },
    { lyricsTiming, lyricsTimingSha256, lyrics: lyrics.replace('First line', 'Changed line') },
  ]) {
    const { env, install, objects } = fixture();
    const stored = install(id, 'Plain lyric fallback', { lyrics, ...metadata });
    const before = objects.get(metadataKey(id)).bytes.slice();
    assert.equal(safeTrack(stored), true);
    assert.deepEqual(publicTrack(stored).lyricsTiming, []);
    const readable = await readTrack(env.MAPKAI_REVIEW_MEDIA, id);
    assert.deepEqual(readable.lyricsTiming, []);
    assert.equal(Object.hasOwn(readable, 'lyricsTimingSha256'), false);
    const response = await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env });
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).tracks[0].lyricsTiming, []);
    const playback = await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`), env });
    assert.equal(playback.status, 200);
    assert.deepEqual(new Uint8Array(await playback.arrayBuffer()), mp3Bytes);
    const range = await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`, { headers: { Range: 'bytes=417-420' } }), env });
    assert.equal(range.status, 206);
    assert.deepEqual(new Uint8Array(await range.arrayBuffer()), mp3Bytes.slice(417, 421));
    assert.deepEqual(objects.get(metadataKey(id)).bytes, before);
  }
});

test('legacy provenance remains unknown while verified generation fields are public', async () => {
  const { env, install } = fixture();
  install(id, 'Unknown legacy song');
  const generatedId = '22222222-2222-4222-8222-222222222222';
  install(generatedId, 'Verified import', { language: 'nl', aiGenerated: true, generationProvider: 'ElevenLabs' });
  const catalog = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
  const legacy = catalog.tracks.find(track => track.id === id);
  assert.equal(legacy.aiGenerated, null);
  assert.equal(legacy.generationProvider, null);
  const generated = catalog.tracks.find(track => track.id === generatedId);
  assert.equal(generated.aiGenerated, true);
  assert.equal(generated.generationProvider, 'ElevenLabs');
  for (const trackId of [id, generatedId]) {
    assert.equal((await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${trackId}`), env })).status, 200);
  }
});

test('partial or invalid stored AI provenance cannot publish or serve audio', async () => {
  for (const metadata of [
    { aiGenerated: true }, { generationProvider: 'ElevenLabs' },
    { aiGenerated: 'true', generationProvider: 'ElevenLabs' },
    { aiGenerated: false, generationProvider: 'ElevenLabs' },
    { aiGenerated: true, generationProvider: 'Unknown provider' },
  ]) {
    const { env, install, calls } = fixture();
    install(id, 'Unverified disclosure', metadata);
    assert.equal((await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).status, 503);
    calls.length = 0;
    const response = await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${id}`), env });
    assert.equal(response.status, 503);
    assert.deepEqual(calls.map(call => call.operation), ['get']);
  }
});

test('upload clients cannot override server-owned generation disclosure', async () => {
  const { env, calls, reservations } = fixture();
  const request = await uploadRequest(env);
  const form = await request.formData();
  form.set('aiGenerated', 'false');
  form.set('generationProvider', 'Unknown provider');
  const tampered = new Request(request.url, { method: 'POST', body: form,
    headers: { Origin: request.headers.get('Origin'), Cookie: request.headers.get('Cookie') } });
  assert.equal((await tracks({ request: tampered, env })).status, 400);
  assert.deepEqual(calls, []);
  assert.equal(reservations(), 0);
});

test('uploads require a supported owner-declared language and public list/playback hide other languages', async () => {
  const { env, calls, objects, install } = fixture();
  for (const language of ['fr', 'de', 'EN', 'NL', 'ZH', 'zh-CN', '', null]) {
    const response = await tracks({ request: await uploadRequest(env, { language }), env });
    assert.equal(response.status, 400);
  }
  assert.deepEqual(calls, []);
  install(id, 'English song');
  const hiddenIds = [
    ['22222222-2222-4222-8222-222222222222', 'fr'],
    ['33333333-3333-4333-8333-333333333333', undefined],
  ];
  for (const [otherId, language] of hiddenIds) {
    const other = install(otherId, 'Other language');
    const bytes = encoder.encode(JSON.stringify({ ...other, language }));
    objects.set(metadataKey(otherId), { key: metadataKey(otherId), bytes, etag: createHash('md5').update(bytes).digest('hex') });
  }
  const catalog = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
  assert.deepEqual(catalog.tracks.map(track => [track.title, track.language]), [['English song', 'en']]);
  for (const [otherId] of hiddenIds) {
    assert.equal((await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${otherId}`), env })).status, 404);
  }
});

const concat = (...values) => {
  const output = new Uint8Array(values.reduce((sum, value) => sum + value.length, 0));
  let offset = 0;
  for (const value of values) { output.set(value, offset); offset += value.length; }
  return output;
};
const box = (type, payload) => {
  const header = new Uint8Array(8);
  new DataView(header.buffer).setUint32(0, payload.length + 8);
  header.set(encoder.encode(type), 4);
  return concat(header, payload);
};

test('MP3 ID3, PCM WAV and complete audio-only M4A containers validate while header shells reject', async () => {
  const tagged = new File([new Uint8Array([73, 68, 51, 4, 0, 0, 0, 0, 0, 0]), mp3Bytes], 'tagged.mp3', { type: 'audio/mpeg' });
  assert.equal((await validateAudio(tagged)).extension, 'mp3');
  const wav = new Uint8Array(46);
  const view = new DataView(wav.buffer);
  wav.set(encoder.encode('RIFF'), 0); view.setUint32(4, 38, true); wav.set(encoder.encode('WAVEfmt '), 8);
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, 8000, true);
  view.setUint32(28, 16000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  wav.set(encoder.encode('data'), 36); view.setUint32(40, 2, true);
  assert.equal((await validateAudio(new File([wav], 'sound.wav', { type: 'audio/wav' }))).extension, 'wav');
  const ftyp = box('ftyp', concat(encoder.encode('M4A '), new Uint8Array(4), encoder.encode('isom')));
  const uints = values => {
    const data = new Uint8Array(values.length * 4);
    values.forEach((value, index) => new DataView(data.buffer).setUint32(index * 4, value));
    return data;
  };
  const sampleEntry = new Uint8Array(28);
  const sampleView = new DataView(sampleEntry.buffer);
  sampleView.setUint16(6, 1); sampleView.setUint16(16, 2); sampleView.setUint16(18, 16); sampleView.setUint32(24, 44100 * 65536);
  const track = (handler, dataOffset = 0) => box('trak', box('mdia', concat(
    box('hdlr', concat(new Uint8Array(8), encoder.encode(handler), new Uint8Array(12))),
    box('minf', box('stbl', concat(
      box('stsd', concat(uints([0, 1]), box('mp4a', sampleEntry))),
      box('stsz', uints([0, 4, 1])), box('stts', uints([0, 1, 1, 1024])),
      box('stsc', uints([0, 1, 1, 1, 1])), box('stco', uints([0, 1, dataOffset])),
    ))),
  )));
  const moovSize = box('moov', track('soun')).length;
  const moov = box('moov', track('soun', ftyp.length + moovSize + 8));
  const m4a = new File([ftyp, moov, box('mdat', new Uint8Array(4))], 'sound.m4a', { type: 'audio/mp4' });
  assert.equal((await validateAudio(m4a)).extension, 'm4a');
  const video = new File([ftyp, box('moov', concat(track('soun'), track('vide')))], 'video.m4a', { type: 'audio/mp4' });
  await assert.rejects(validateAudio(video), error => error.status === 415);
  for (const file of [new File([new Uint8Array([0xff, 0xfb, 0x90, 0])], 'header.mp3', { type: 'audio/mpeg' }),
    new File([ftyp, moov], 'header.m4a', { type: 'audio/mp4' }),
    new File([ftyp, moov, box('mdat', new Uint8Array(3))], 'truncated.m4a', { type: 'audio/mp4' })]) {
    await assert.rejects(validateAudio(file), error => error.status === 415);
  }
});

test('pagination retains all songs without overwriting metadata objects', async () => {
  const { env, install } = fixture();
  for (let index = 0; index < 53; index++) install(`${String(index).padStart(8, '0')}-1111-4111-8111-111111111111`, `Song ${index}`);
  const page1 = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
  assert.equal(page1.tracks.length, 50);
  assert.ok(page1.nextCursor);
  const page2 = await (await tracks({ request: new Request(`https://www.mapkai.com/api/music/tracks?cursor=${page1.nextCursor}`), env })).json();
  assert.equal(page2.tracks.length, 3);
  assert.equal(page2.nextCursor, null);
  assert.equal(new Set([...page1.tracks, ...page2.tracks].map(track => track.id)).size, 53);
});

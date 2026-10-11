import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { onRequest as auth } from '../functions/api/music/auth.js';
import { onRequest as tracks } from '../functions/api/music/tracks.js';
import { onRequest as audio } from '../functions/api/music/audio.js';
import { validateAudio } from '../functions/api/music/_audio-validation.js';
import { createFounderAccessCookie } from '../functions/api/pdc/_shared.js';
import { AUDIO_TYPES, MAX_AUDIO_BYTES, TRACK_SCHEMA, audioKey, metadataKey } from '../functions/api/music/_shared.js';
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
  const install = (trackId = id, title = 'First song') => {
    const bytes = mp3Bytes.slice();
    const objectKey = audioKey(trackId, 'mp3');
    const audioEtag = createHash('md5').update(bytes).digest('hex');
    objects.set(objectKey, { key: objectKey, bytes, etag: audioEtag });
    const track = { schemaVersion: TRACK_SCHEMA, visibility: 'PUBLIC', language: 'en', id: trackId, title, description: '', filename: 'First song.mp3',
      createdAt: '2026-10-11T10:00:00.000Z', extension: 'mp3', contentType: AUDIO_TYPES.mp3, fileSize: bytes.length, objectKey, audioEtag };
    const key = metadataKey(trackId);
    const data = encoder.encode(JSON.stringify(track));
    objects.set(key, { key, bytes: data, etag: createHash('md5').update(data).digest('hex') });
    return track;
  };
  return { env, calls, objects, install, reservations: () => reserved, uploadBytes: () => uploadedBytes };
}

async function uploadRequest(env, { owner = true, origin = 'https://www.mapkai.com', file = mp3File(), title = 'First song', description = '', language = 'en' } = {}) {
  const form = new FormData();
  form.set('file', file);
  form.set('title', title);
  form.set('description', description);
  if (language !== null) form.set('language', language);
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
  request.headers.set('Content-Length', String(MAX_AUDIO_BYTES + 16 * 1024 + 1));
  assert.equal((await tracks({ request, env })).status, 413);
  assert.deepEqual(calls, []);
});

test('uploads require owner-declared English and public list/playback hide other languages', async () => {
  const { env, calls, objects, install } = fixture();
  for (const language of ['zh', 'EN', '', null]) {
    const response = await tracks({ request: await uploadRequest(env, { language }), env });
    assert.equal(response.status, 400);
  }
  assert.deepEqual(calls, []);
  install(id, 'English song');
  const otherId = '22222222-2222-4222-8222-222222222222';
  const other = install(otherId, 'Other language');
  const bytes = encoder.encode(JSON.stringify({ ...other, language: 'zh' }));
  objects.set(metadataKey(otherId), { key: metadataKey(otherId), bytes, etag: createHash('md5').update(bytes).digest('hex') });
  const catalog = await (await tracks({ request: new Request('https://www.mapkai.com/api/music/tracks'), env })).json();
  assert.deepEqual(catalog.tracks.map(track => [track.title, track.language]), [['English song', 'en']]);
  assert.equal((await audio({ request: new Request(`https://www.mapkai.com/api/music/audio?id=${otherId}`), env })).status, 404);
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

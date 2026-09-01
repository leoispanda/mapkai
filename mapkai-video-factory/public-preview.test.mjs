import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPublicPreviewCatalog } from './review-channel.mjs';
import { onRequest as listPublicVideos } from '../functions/api/factory/public-videos.js';
import { onRequest as servePublicVideo } from '../functions/api/factory/public-video.js';
import { PUBLIC_CATALOG_KEY, PUBLIC_PREVIEW_DISCLOSURE, PUBLIC_PREVIEW_LABEL } from '../functions/api/factory/_public.js';
import { CANONICAL_MAJOR_FIELDS, CANONICAL_MAJOR_FIELD_IDS } from '../functions/api/factory/_major-fields.js';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const box = (type, bytes = Buffer.alloc(0)) => { const head = Buffer.alloc(8); head.writeUInt32BE(8 + bytes.length); head.write(type, 4); return Buffer.concat([head, bytes]); };
const mp4 = Buffer.concat([box('ftyp', Buffer.from('mp42')), box('moov'), box('mdat', Buffer.alloc(20))]);
const names = CANONICAL_MAJOR_FIELDS;
const slug = name => name.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function publicItem(fieldId, bytes = mp4) {
  const id = `attempt-${fieldId}`;
  const sha256 = digest(Buffer.concat([Buffer.from(fieldId), bytes]));
  return {
    id, fieldId, fieldName: names[fieldId], slug: slug(names[fieldId]), title: `${names[fieldId]} preview`,
    objectKey: `raw/${fieldId}/${id}/${sha256}.mp4`, sha256, fileSize: bytes.length,
    videoDuration: 60, resolution: '1280x720', status: 'HUMAN_REVIEW_PENDING', publicationStatus: 'NOT_PUBLISHED',
    brandingStatus: 'NOT_APPLIED', aiGenerated: true, publicPreviewStatus: 'VIDEO_CONTENT_UNDER_REVIEW',
  };
}

function privateCatalog(fieldIds) {
  return {
    schemaVersion: 'mapkai-private-video-catalog.v1',
    visibility: 'FOUNDER_ONLY',
    items: fieldIds.map(fieldId => ({
      ...publicItem(fieldId),
      rawVideoPath: `/private/${fieldId}.mp4`,
      sourceKeys: [{ key: `private/${fieldId}/source.md` }],
      auditKey: `private/${fieldId}/audit.json`,
      notebookUrl: `https://notebook.invalid/${fieldId}`,
      policyBinding: { creatingPolicy: 'test-only' },
    })),
  };
}

function apiFixture(fieldIds = CANONICAL_MAJOR_FIELD_IDS) {
  const items = fieldIds.map(fieldId => publicItem(fieldId));
  const catalog = { schemaVersion: 'mapkai-public-preview-catalog.v1', visibility: 'PUBLIC_PREVIEW', items };
  const target = items.find(item => item.fieldId === '04');
  const env = { MAPKAI_REVIEW_MEDIA: {
    get: async (key, options) => {
      if (key === PUBLIC_CATALOG_KEY) return { json: async () => catalog };
      if (key !== target.objectKey) throw new Error(`Unexpected object access: ${key}`);
      const bytes = options?.range ? mp4.subarray(options.range.offset, options.range.offset + options.range.length) : mp4;
      return { body: new Response(bytes).body };
    },
    head: async key => key === target.objectKey ? { size: mp4.length } : null,
  } };
  const request = (url, options = {}) => new Request(`https://www.mapkai.com${url}`, options);
  return { env, request, catalog, target };
}

test('public preview follows the delivered canonical subset instead of a fixed field count', () => {
  const tenDelivered = CANONICAL_MAJOR_FIELD_IDS.filter(fieldId => fieldId !== '02');
  for (const deliveredIds of [tenDelivered, CANONICAL_MAJOR_FIELD_IDS]) {
    const publicCatalog = buildPublicPreviewCatalog(privateCatalog(deliveredIds));
    assert.deepEqual(publicCatalog.items.map(item => item.fieldId), deliveredIds);
    for (const item of publicCatalog.items) {
      assert.equal(item.rawVideoPath, undefined);
      assert.equal(item.sourceKeys, undefined);
      assert.equal(item.auditKey, undefined);
      assert.equal(item.notebookUrl, undefined);
      assert.equal(item.policyBinding, undefined);
    }
  }
});

test('public preview rejects duplicate and non-canonical major fields', () => {
  const duplicate = privateCatalog(['00', '01']);
  duplicate.items.push({ ...duplicate.items[0], id: 'duplicate-attempt' });
  assert.throws(() => buildPublicPreviewCatalog(duplicate), /duplicate or non-canonical/);
  const invented = privateCatalog(['00']);
  invented.items[0] = { ...invented.items[0], fieldId: '11', fieldName: 'Invented field' };
  assert.throws(() => buildPublicPreviewCatalog(invented), /duplicate or non-canonical/);
});

test('anonymous public listing exposes only learner-safe projections', async () => {
  const { env, request } = apiFixture();
  const response = await listPublicVideos({ env, request: request('/api/factory/public-videos') });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.items.length, CANONICAL_MAJOR_FIELD_IDS.length);
  assert.equal(data.reviewLabel, PUBLIC_PREVIEW_LABEL);
  assert.equal(data.disclosure, PUBLIC_PREVIEW_DISCLOSURE);
  for (const item of data.items) {
    assert.ok(item.slug && item.videoUrl);
    for (const privateKey of ['id', 'fieldId', 'objectKey', 'sha256', 'status', 'publicationStatus', 'brandingStatus', 'sourceKeys', 'notebookUrl']) {
      assert.equal(item[privateKey], undefined, `${privateKey} must not be public`);
    }
  }
});

test('public media allows exact slug playback and byte ranges without leaking hashes', async () => {
  const { env, request, target } = apiFixture();
  const response = await servePublicVideo({ env, request: request(`/api/factory/public-video?field=${target.slug}`, { headers: { Range: 'bytes=3-11' } }) });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Length'), '9');
  assert.equal(response.headers.get('Content-Range'), `bytes 3-11/${mp4.length}`);
  assert.equal(response.headers.get('ETag'), null);
  assert.match(response.headers.get('Content-Disposition'), /inline/);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), mp4.subarray(3, 12));
  const head = await servePublicVideo({ env, request: request(`/api/factory/public-video?field=${target.slug}`, { method: 'HEAD' }) });
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
});

test('public media rejects taxonomy IDs, arbitrary keys and invalid ranges', async () => {
  const { env, request } = apiFixture();
  for (const query of ['field=04', 'field=02', 'field=../../secret', 'objectKey=raw/04/anything']) {
    const response = await servePublicVideo({ env, request: request(`/api/factory/public-video?${query}`) });
    assert.equal(response.status, 404, query);
  }
  const invalidRange = await servePublicVideo({ env, request: request(`/api/factory/public-video?field=${slug(names['04'])}`, { headers: { Range: 'bytes=999999-' } }) });
  assert.equal(invalidRange.status, 416);
});

test('public handler fails closed when its catalog is not the public allowlist', async () => {
  const { env, request } = apiFixture();
  env.MAPKAI_REVIEW_MEDIA.get = async key => key === PUBLIC_CATALOG_KEY
    ? { json: async () => ({ schemaVersion: 'mapkai-private-video-catalog.v1', visibility: 'FOUNDER_ONLY', items: [] }) }
    : null;
  const response = await listPublicVideos({ env, request: request('/api/factory/public-videos') });
  assert.equal(response.status, 503);
});

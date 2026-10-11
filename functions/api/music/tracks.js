import { validateAudio } from './_audio-validation.js';
import { GENERATION_PROVIDER, MAX_MUSIC_UPLOAD_BYTES, SONG_LANGUAGES, TRACK_PREFIX, TRACK_SCHEMA, TRACK_ID_PATTERN, audioKey, errorResponse, inputError, json, metadataKey,
  musicBucket, normalizeLyrics, publicTrack, readBoundedBody, readTrack, requireOwner } from './_shared.js';

const clean = value => value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();

async function listTracks(request, env) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor') || undefined;
  if (cursor && (cursor.length > 2048 || /[\u0000-\u001f\u007f]/.test(cursor))) throw inputError('This song list link is invalid.');
  const bucket = musicBucket(env);
  const page = await bucket.list({ prefix: TRACK_PREFIX, limit: 50, ...(cursor ? { cursor } : {}) });
  if (!Array.isArray(page?.objects) || (page.truncated && typeof page.cursor !== 'string')) throw new Error('Invalid music index.');
  const tracks = await Promise.all(page.objects.map(async object => {
    const id = object.key?.slice(TRACK_PREFIX.length, -5);
    if (object.key !== metadataKey(id) || !TRACK_ID_PATTERN.test(id || '')) throw new Error('Invalid music index.');
    const track = await readTrack(bucket, id);
    return track ? publicTrack(track) : null;
  }));
  const publicTracks = tracks.filter(Boolean);
  publicTracks.sort((left, right) => right.createdAt.localeCompare(left.createdAt) || left.id.localeCompare(right.id));
  return json({ tracks: publicTracks, nextCursor: page.truncated ? page.cursor : null });
}

async function uploadTrack(request, env) {
  await requireOwner(request, env);
  const contentType = request.headers.get('Content-Type') || '';
  if (!/^multipart\/form-data\s*;/i.test(contentType)) throw inputError('Choose a song using the upload form.', 415);
  const bytes = await readBoundedBody(request, MAX_MUSIC_UPLOAD_BYTES);
  let form;
  try { form = await new Response(bytes, { headers: { 'Content-Type': contentType } }).formData(); }
  catch { throw inputError('The song upload could not be read.'); }
  if (form.getAll('file').length !== 1 || form.getAll('title').length > 1 || form.getAll('description').length > 1
    || form.getAll('lyrics').length > 1 || form.getAll('language').length !== 1
    || [...form.keys()].some(key => !['file', 'title', 'description', 'language', 'lyrics'].includes(key))) {
    throw inputError('Choose one audio file per upload and declare its language.');
  }
  const language = form.get('language');
  if (!SONG_LANGUAGES.includes(language)) throw inputError('Choose English, Dutch or Chinese as the song language.');
  const suppliedLyrics = form.get('lyrics');
  const lyrics = normalizeLyrics(suppliedLyrics === null ? '' : suppliedLyrics);
  const file = form.get('file');
  const { extension, contentType: audioType } = await validateAudio(file);
  const suppliedTitle = form.get('title');
  const suppliedDescription = form.get('description');
  if ((suppliedTitle !== null && typeof suppliedTitle !== 'string') || (suppliedDescription !== null && typeof suppliedDescription !== 'string')) {
    throw inputError('Song details must be text.');
  }
  const filename = clean(file.name.replace(/[\\/]/g, '-')).slice(0, 160);
  const title = clean(suppliedTitle || file.name.replace(/\.[^.]+$/, ''));
  const description = clean(suppliedDescription || '');
  if (!title || title.length > 120 || description.length > 1000) throw inputError('Use a song title up to 120 characters and a description up to 1,000 characters.');
  const id = crypto.randomUUID();
  const bucket = musicBucket(env);
  const objectKey = audioKey(id, extension);
  const audio = await bucket.put(objectKey, file, { onlyIf: { etagDoesNotMatch: '*' }, httpMetadata: { contentType: audioType } });
  if (!audio || audio.size !== file.size) throw new Error('Audio upload did not complete.');
  const track = { schemaVersion: TRACK_SCHEMA, visibility: 'PUBLIC', language, aiGenerated: true, generationProvider: GENERATION_PROVIDER,
    id, title, description, filename, lyrics,
    createdAt: new Date().toISOString(), extension, contentType: audioType, fileSize: file.size, objectKey, audioEtag: audio.etag };
  // Publish only after the durable audio write succeeds. Each track has its own
  // immutable index object, so simultaneous uploads never overwrite a catalog.
  const published = await bucket.put(metadataKey(id), JSON.stringify(track), {
    onlyIf: { etagDoesNotMatch: '*' }, httpMetadata: { contentType: 'application/json; charset=utf-8' },
  });
  if (!published) throw new Error('Track publication did not complete.');
  return json({ track: publicTrack(track) }, 201);
}

export async function onRequest({ request, env = {} }) {
  if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
  try { return request.method === 'GET' ? await listTracks(request, env) : await uploadTrack(request, env); }
  catch (error) { return errorResponse(error); }
}

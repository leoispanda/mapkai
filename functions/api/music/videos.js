import { json } from './_shared.js';
import { publicVideos } from './_videos.js';

export function onRequest({ request }) {
  if (!['GET', 'HEAD'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, HEAD' });
  const response = json({ items: publicVideos() }, 200, { 'Cache-Control': 'public, max-age=300' });
  return request.method === 'HEAD' ? new Response(null, response) : response;
}

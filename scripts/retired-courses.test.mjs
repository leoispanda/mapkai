import test from 'node:test';
import assert from 'node:assert/strict';
import { isRetiredCoursePath, retiredCourseResponse } from '../functions/_shared/retired-courses.js';
import { onRequest } from '../functions/_middleware.js';

test('retired course pages, lesson data and media stay unavailable, including encoded URLs', async () => {
  const paths = ['/learning/emba', '/learning/emba/unlock', '/learning/corporate-finance/day-1',
    '/zh/learning/corporate-finance/day-5/index.html', '/management/day-1-value-and-capital',
    '/finance/example.mp4', '/subtitles/finance/example.vtt', '/finance-course.js',
    '/assets/finance-course-og.png', '/content/management-column.js',
    '/content/management-lesson-stories.js', '/content/management-lesson-references.js',
    '/learning/%65mba', '/learning%2fcorporate-finance/day-1', '/learning/%2565mba'];
  for (const path of paths) {
    assert.equal(isRetiredCoursePath(path), true, path);
    const response = await onRequest({ request: new Request(`https://www.mapkai.com${path}`),
      next() { throw new Error('Retired content must not reach static assets'); } });
    assert.equal(response.status, 410, path);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.match(await response.text(), /course has been removed|课程已移除/);
  }
});

test('retirement covers all methods without requiring a password or database', async () => {
  for (const method of ['GET', 'HEAD', 'POST']) {
    const response = retiredCourseResponse(new Request('https://www.mapkai.com/learning/emba/unlock', { method }));
    assert.equal(response.status, 410);
    if (method === 'HEAD') assert.equal(await response.text(), '');
  }
});

test('retirement does not match unrelated subjects, routes or similarly named files', () => {
  for (const path of ['/', '/learning', '/learning/foundation', '/categories/04', '/fields/0412-finance-banking-and-insurance',
    '/music/', '/speaking/', '/toolbox/pdc', '/api/course-event', '/finance-tools', '/content/management-principles.js']) {
    assert.equal(isRetiredCoursePath(path), false, path);
    assert.equal(retiredCourseResponse(new Request(`https://www.mapkai.com${path}`)), null, path);
  }
});

test('Speaking retains its microphone and connection policy after course-gate removal', async () => {
  const response = await onRequest({ request: new Request('https://www.mapkai.com/speaking/'),
    next: async () => new Response('Speaking') });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Permissions-Policy'), /microphone=\(self\)/);
  assert.match(response.headers.get('Content-Security-Policy'), /wss:\/\/generativelanguage.googleapis.com/);
});

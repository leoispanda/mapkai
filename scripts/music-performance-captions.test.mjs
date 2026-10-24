import assert from 'node:assert/strict';
import test from 'node:test';
import { performanceCaptions } from '../functions/api/music/_performance-captions.js';
import { normalizeLyricsTiming } from '../functions/api/music/_shared.js';
import '../music/lyrics-sync.js';
const recording = { id: 'efc8308c-614f-4845-94ce-3b32425c2e4a', audioEtag: '9cdf198a59ac0e6bdf48bff5e4b12536', fileSize: 2801799 };

test('MV subtitles require the exact immutable recording; no filename/title match or other track can opt in', () => {
  for (const value of [null, {}, { ...recording, id: '8b9e3b50-efea-4e26-ba69-37dc4628d3ed' }, { ...recording, audioEtag: '000' }, { ...recording, fileSize: 42 }]) assert.equal(performanceCaptions(value), null);
  const captions = performanceCaptions(recording);
  assert.equal(captions.timing.length, 36); assert.equal(captions.approximate, true);
  assert.deepEqual(normalizeLyricsTiming(captions.text, captions.timing), captions.timing);
  assert.deepEqual(globalThis.MapKAILyricsSync.validateTiming(captions.text, captions.timing), captions.timing);
  assert.equal(captions.text.split('…').length - 1, 2);
  assert.match(captions.text, /ASML, born in eighty-four/);
  assert.equal(globalThis.MapKAILyricsSync.activeLineAt(captions.timing, 102), null, 'orchestral ending has no invented lyric');
  assert.equal(captions.text.includes('The past can’t live this life for you'), false, 'unsung manuscript lines are not assigned times');
  captions.timing[0].end = 900; assert.equal(performanceCaptions(recording).timing[0].end, 4.22);
});

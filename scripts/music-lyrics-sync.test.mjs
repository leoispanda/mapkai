import assert from 'node:assert/strict';
import test from 'node:test';
import '../music/lyrics-sync.js';

const { validateTiming, activeLineAt } = globalThis.MapKAILyricsSync;
const lyrics = '[Verse 1]\nLook again\n\nIdeas connect\n[Chorus]\nLearn another way';
const cues = [
  { line: 1, start: 1.25, end: 3 },
  { line: 3, start: 4, end: 6.5 },
  { line: 5, start: 6.5, end: 9 },
];

test('real cues retain original blank/heading line indexes and are copied', () => {
  const validated = validateTiming(lyrics, cues);
  assert.deepEqual(validated, cues);
  assert.notEqual(validated, cues);
  assert.notEqual(validated[0], cues[0]);
});

test('only complete section headings and blank lines are skipped', () => {
  assert.deepEqual(validateTiming('  [Verse]  \n \n[A[B]\n[]\nAn original line', [
    { line: 2, start: 0, end: 1 },
    { line: 3, start: 1, end: 2 },
    { line: 4, start: 2, end: 3 },
  ]), [
    { line: 2, start: 0, end: 1 },
    { line: 3, start: 1, end: 2 },
    { line: 4, start: 2, end: 3 },
  ]);
});

test('intros, instrumental gaps, exact end boundaries, and outro have no active line', () => {
  assert.equal(activeLineAt(cues, 0), null);
  assert.equal(activeLineAt(cues, 1.249), null);
  assert.equal(activeLineAt(cues, 1.25), 1);
  assert.equal(activeLineAt(cues, 2.99), 1);
  assert.equal(activeLineAt(cues, 3), null);
  assert.equal(activeLineAt(cues, 3.9), null);
  assert.equal(activeLineAt(cues, 4), 3);
  assert.equal(activeLineAt(cues, 6.5), 5);
  assert.equal(activeLineAt(cues, 9), null);
  assert.equal(activeLineAt(cues, 50), null);
});

test('selection uses current time directly after backward and forward seeks', () => {
  assert.equal(activeLineAt(cues, 7), 5);
  assert.equal(activeLineAt(cues, 2), 1);
  assert.equal(activeLineAt(cues, 3.5), null);
  assert.equal(activeLineAt(cues, 5), 3);
  assert.equal(activeLineAt(null, 2), null);
  assert.equal(activeLineAt(cues, NaN), null);
  assert.equal(activeLineAt(cues, -1), null);
});

test('missing, partial, malformed, overlapping, or unbounded timing stays unsynchronized', () => {
  for (const invalid of [
    undefined, [], cues.slice(0, 2), null,
    [null, ...cues.slice(1)],
    [[1, 1.25, 3], ...cues.slice(1)],
    [{ ...cues[0], extra: true }, ...cues.slice(1)],
    [{ line: 1, start: 1.25 }, ...cues.slice(1)],
    [{ ...cues[0], line: Number.MAX_SAFE_INTEGER + 1 }, ...cues.slice(1)],
    [cues[0], { ...cues[1], line: 1 }, cues[2]],
    [cues[0], { ...cues[1], line: 5 }, { ...cues[2], line: 3 }],
    [...cues, { line: 5, start: 9, end: 10 }],
    [{ ...cues[0], line: 0 }, ...cues.slice(1)],
    [{ ...cues[0], line: 2 }, ...cues.slice(1)],
    [{ ...cues[0], line: 99 }, ...cues.slice(1)],
    [{ ...cues[0], line: 1.5 }, ...cues.slice(1)],
    [{ ...cues[0], start: '1.25' }, ...cues.slice(1)],
    [{ ...cues[0], start: -1 }, ...cues.slice(1)],
    [{ ...cues[0], end: Infinity }, ...cues.slice(1)],
    [{ ...cues[0], end: cues[0].start }, ...cues.slice(1)],
    [cues[0], { ...cues[1], start: 2.9 }, cues[2]],
    [cues[1], cues[0], cues[2]],
    [...cues.slice(0, 2), { ...cues[2], end: 7200.1 }],
    Array.from({ length: 601 }, (_, index) => ({ line: 0, start: index, end: index + 1 })),
  ]) assert.equal(validateTiming(lyrics, invalid), null);
});

test('repeated sung lines remain distinct and complete valid bounds are accepted', () => {
  const repeated = validateTiming('Look again\n\nLook again', [
    { line: 0, start: 0, end: 0.5 }, { line: 2, start: 7199, end: 7200 },
  ]);
  assert.equal(activeLineAt(repeated, 0), 0);
  assert.equal(activeLineAt(repeated, 7199), 2);
  assert.equal(activeLineAt(repeated, 7200), null);
  const many = Array.from({ length: 600 }, (_, index) => ({ line: index, start: index, end: index + 1 }));
  assert.equal(validateTiming(Array(600).fill('Look again').join('\n'), many).length, 600);
});

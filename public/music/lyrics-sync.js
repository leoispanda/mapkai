(() => {
  'use strict';

  function isLyricLine(line) {
    const text = line.trim();
    return Boolean(text) && !/^\[[^\[\]\n]+\]$/.test(text);
  }

  function validateTiming(lyrics, timing) {
    if (typeof lyrics !== 'string' || !lyrics || !Array.isArray(timing) || !timing.length || timing.length > 600) return null;
    const lines = lyrics.split('\n');
    const required = lines.flatMap((line, index) => isLyricLine(line) ? [index] : []);
    if (timing.length !== required.length) return null;
    const cues = [];
    let previousEnd = 0;
    for (const [index, cue] of timing.entries()) {
      if (!cue || Object.getPrototypeOf(cue) !== Object.prototype
        || Object.keys(cue).length !== 3 || !Object.keys(cue).every(key => ['line', 'start', 'end'].includes(key))
        || !Number.isSafeInteger(cue.line) || cue.line !== required[index]
        || !Number.isFinite(cue.start) || !Number.isFinite(cue.end)
        || cue.start < previousEnd || cue.start < 0 || cue.end <= cue.start || cue.end > 7200) return null;
      cues.push({ line: cue.line, start: cue.start, end: cue.end });
      previousEnd = cue.end;
    }
    return cues;
  }

  function activeLineAt(timing, seconds) {
    if (!Array.isArray(timing) || !timing.length || !Number.isFinite(seconds) || seconds < 0) return null;
    let lower = 0;
    let upper = timing.length;
    while (lower < upper) {
      const middle = Math.floor((lower + upper) / 2);
      if (timing[middle].start <= seconds) lower = middle + 1;
      else upper = middle;
    }
    const cue = timing[lower - 1];
    return cue && seconds < cue.end ? cue.line : null;
  }

  globalThis.MapKAILyricsSync = Object.freeze({ isLyricLine, validateTiming, activeLineAt });
})();

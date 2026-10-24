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

  function playbackLyrics(track) {
    const original = validateTiming(track?.lyrics, track?.lyricsTiming);
    if (original) return { text: track.lyrics, timing: original, captions: false };
    const captions = track?.lyricCaptions;
    if (captions?.source !== 'music-video' || captions.approximate !== true
      || typeof captions.text !== 'string' || captions.text.length > 12000
      || /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f]/.test(captions.text)) return null;
    const timing = validateTiming(captions.text, captions.timing);
    return timing ? { text: captions.text, timing, captions: true } : null;
  }

  function lyricOffsetAt(cue, seconds, overflow) {
    if (!cue || !Number.isFinite(cue.start) || !Number.isFinite(cue.end) || cue.end <= cue.start
      || !Number.isFinite(seconds) || !Number.isFinite(overflow) || overflow <= 0) return 0;
    return Math.max(0, Math.min(1, (seconds - cue.start) / (cue.end - cue.start))) * overflow;
  }

  globalThis.MapKAILyricsSync = Object.freeze({ isLyricLine, validateTiming, activeLineAt, lyricOffsetAt, playbackLyrics });
})();

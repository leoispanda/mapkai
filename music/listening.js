/* Shared playback measurements. No listener identity or personal history. */
(() => {
  'use strict';
  if (globalThis.MapKAIMusicListening) return;
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  const storageKey = 'mapkaiMusicListeningSession.v1';
  const totals = new Map(), subscribers = new Set(), writes = new Map();
  let loaded = false, unavailable = false, refreshing = null, activated = false, writeSequence = 0;
  const notify = () => subscribers.forEach(callback => callback());
  function accept(row) {
    if (!row || !uuid.test(row.id) || ['starts', 'listens', 'completions', 'skips', 'earlySkips', 'listenedMs'].some(key => !Number.isSafeInteger(row[key]) || row[key] < 0)
      || row.listens > row.starts || row.completions > row.listens || row.completions + row.skips > row.starts || row.earlySkips > row.skips) throw new Error('Invalid listening total');
    return { ...row };
  }
  function get(id) {
    return totals.get(id) || { id, starts: 0, listens: 0, completions: 0, skips: 0, earlySkips: 0, listenedMs: 0 };
  }
  async function refresh() {
    activated = true;
    if (refreshing) return refreshing;
    refreshing = (async () => {
      const before = writeSequence;
      try {
        const response = await fetch('/api/music/listening', { credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error('Listening unavailable');
        const data = await response.json();
        if (!Array.isArray(data.totals) || data.totals.length > 5000) throw new Error('Invalid totals');
        const rows = data.totals.map(accept);
        if (new Set(rows.map(row => row.id)).size !== rows.length) throw new Error('Duplicate totals');
        const next = new Map(rows.map(row => [row.id, row]));
        // A GET begun before a confirmed checkpoint cannot roll it back.
        for (const [id, row] of totals) if ((writes.get(id) || 0) > before) next.set(id, row);
        totals.clear(); next.forEach((row, id) => totals.set(id, row)); loaded = true; unavailable = false;
      } catch { unavailable = true; }
      finally { refreshing = null; notify(); }
    })();
    return refreshing;
  }
  // Serialize writes so confirmed totals cannot regress within this page.
  let sending = Promise.resolve();
  function submit(body, immediate = false) {
    const send = async () => {
      try {
        const response = await fetch('/api/music/listening', { method: 'POST', credentials: 'same-origin', cache: 'no-store',
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true, signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error('Listening unavailable');
        const data = await response.json(), row = accept(data.total);
        if (data.sessionId !== body.sessionId || row.id !== body.id) throw new Error('Invalid receipt');
        if (!immediate) { totals.set(row.id, row); writes.set(row.id, ++writeSequence); }
      } catch { unavailable = true; }
      notify();
    };
    if (immediate) { void send(); return; }
    sending = sending.then(send);
  }

  function createTracker(audio) {
    let session = null, running = false, position = 0, at = performance.now(), segment = null;
    let pendingRestore = null;
    const listened = () => Math.min(session?.durationMs || 0, Math.round((session?.ranges || []).reduce((sum, [start, end]) => sum + end - start, 0) * 1000));
    const complete = () => session?.durationMs && listened() >= session.durationMs * 0.9;
    const qualified = () => session?.durationMs && listened() >= Math.min(30000, session.durationMs / 2);
    function persist() {
      if (!session?.sessionId) return;
      try { sessionStorage.setItem(storageKey, JSON.stringify({ ...session, position: audio.currentTime, savedAt: Date.now() })); } catch {}
    }
    function checkpoint(unload = false) {
      if (!session?.sessionId || !session.durationMs) return;
      const body = { id: session.id, sessionId: session.sessionId, listenedMs: listened(), durationMs: session.durationMs, skipped: session.skipped };
      const signature = JSON.stringify(body);
      if (unload) { submit(body, true); return; }
      if (signature === session.lastReport) return;
      session.lastReport = signature; session.reportedMs = body.listenedMs;
      // Preserve the queue's synchronous src -> native play handoff on phones.
      queueMicrotask(() => { persist(); submit(body); });
    }
    function sample() {
      const now = performance.now(), next = audio.currentTime;
      if (session?.sessionId && running && !audio.seeking && Number.isFinite(next)) {
        const delta = next - position, elapsed = Math.max(0, now - at) / 1000 * (audio.playbackRate || 1);
        // Seeking must never manufacture listening time, even on browsers that
        // omit seeking events. Only media progress supported by elapsed time counts.
        if (delta >= 0 && delta <= elapsed + 1) {
          // Media and wall clocks jitter independently. Bound each continuous
          // segment by cumulative elapsed time so adjacent samples cannot leave
          // tiny gaps and exhaust the range limit during ordinary playback.
          segment ||= { start: position, elapsed: 0 };
          segment.elapsed += elapsed;
          const wasQualified = qualified(), wasComplete = complete();
          const ranges = [...session.ranges, [segment.start, Math.min(next, segment.start + segment.elapsed)]]
            .map(([start, end]) => [Math.max(0, start), Math.min(session.durationMs / 1000, end)])
            .filter(([start, end]) => end > start).sort((a, b) => a[0] - b[0]);
          const merged = [];
          for (const range of ranges) {
            const last = merged.at(-1);
            if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]); else merged.push(range);
          }
          // Bounded navigation state; unusually fragmented listening is undercounted.
          session.ranges = merged.slice(-128);
          if (qualified() !== wasQualified || complete() !== wasComplete || listened() - session.reportedMs >= 30000) checkpoint();
        } else segment = null;
      }
      position = Number.isFinite(next) ? next : 0; at = now;
    }
    function begin() {
      if (!session || audio.paused || audio.ended || audio.error || !Number.isFinite(audio.duration) || audio.duration < 1 || audio.duration > 7200) return;
      if (!session.sessionId) {
        if (!globalThis.crypto?.randomUUID) return;
        session.sessionId = crypto.randomUUID(); session.durationMs = Math.round(audio.duration * 1000);
      }
      running = true; segment = null; position = audio.currentTime; at = performance.now(); checkpoint();
    }
    function select(id, { restart = false, restore = false } = {}) {
      if (!uuid.test(id)) return;
      sample();
      if (session && (session.id !== id || restart)) {
        if (session.sessionId && !session.ended && !complete()) session.skipped = true;
        checkpoint(); session = null; pendingRestore = null;
      }
      if (!session) {
        session = { id, sessionId: null, durationMs: 0, ranges: [], skipped: false, ended: false, reportedMs: 0 };
        if (restore) {
          try {
            const value = JSON.parse(sessionStorage.getItem(storageKey));
            if (value?.id === id && uuid.test(value.sessionId) && value.skipped === false && value.ended === false
              && Number.isFinite(value.savedAt) && Date.now() >= value.savedAt && Date.now() - value.savedAt < 86400000
              && Number.isSafeInteger(value.durationMs) && value.durationMs >= 1000 && value.durationMs <= 7200000
              && Number.isFinite(value.position) && value.position >= 0 && value.position <= value.durationMs / 1000
              && Array.isArray(value.ranges) && value.ranges.length <= 128
              && value.ranges.every((range, index) => Array.isArray(range) && range.length === 2 && range.every(Number.isFinite)
                && range[0] >= 0 && range[1] >= range[0] && range[1] <= value.durationMs / 1000 && (!index || range[0] > value.ranges[index - 1][1]))) {
              pendingRestore = { ...session, sessionId: value.sessionId, durationMs: value.durationMs, ranges: value.ranges, position: value.position };
            }
          } catch {}
        }
      }
      running = false; segment = null; position = 0; at = performance.now();
    }
    audio.addEventListener('playing', () => {
      if (pendingRestore) {
        if (pendingRestore.id === session?.id && Math.abs(audio.currentTime - pendingRestore.position) < 2 && Math.abs(audio.duration * 1000 - pendingRestore.durationMs) < 1000) {
          session = pendingRestore; session.lastReport = null;
        }
        pendingRestore = null;
      }
      begin();
    });
    audio.addEventListener('timeupdate', sample);
    for (const event of ['pause', 'waiting', 'stalled', 'error']) audio.addEventListener(event, () => { sample(); running = false; checkpoint(); });
    audio.addEventListener('seeking', () => { running = false; segment = null; position = audio.currentTime; at = performance.now(); });
    audio.addEventListener('seeked', () => { segment = null; position = audio.currentTime; at = performance.now(); running = !audio.paused && !audio.ended && !audio.error; });
    audio.addEventListener('ended', () => { sample(); running = false; if (session) session.ended = true; checkpoint(); });
    window.addEventListener('pagehide', () => { sample(); checkpoint(true); persist(); running = false; }, { capture: true });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { sample(); checkpoint(); persist(); } });
    return Object.freeze({ select });
  }
  document.addEventListener('visibilitychange', () => { if (activated && document.visibilityState === 'visible') refresh(); });
  setInterval(() => { if (activated && document.visibilityState === 'visible') refresh(); }, 60000);
  globalThis.MapKAIMusicListening = Object.freeze({ createTracker, get, refresh, status: () => ({ loaded, unavailable }),
    subscribe: callback => { subscribers.add(callback); return () => subscribers.delete(callback); } });
})();

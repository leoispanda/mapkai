(() => {
  'use strict';

  const ENDPOINT = '/api/music/votes';
  const PENDING_KEY = 'mapkaiMusicPendingVotes.v1';
  const MAX_PENDING = 128;
  const MAX_PENDING_CHARS = 40000;
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const REQUEST_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const featuredRank = new Map([
    ['c2a4a749-933b-4b4b-95fb-0d2d3f12ac6f', -1],
    ['ccb37c55-bae6-4f72-a80a-d1bc94e40ae0', 0],
    ['e4363fdb-2354-4e5c-98f0-9549b689b5c3', 1],
    ['bb5957e7-9e91-45e1-a978-5643451d7820', 2],
  ]);

  function validId(id) {
    return typeof id === 'string' && UUID.test(id) ? id.toLowerCase() : null;
  }

  function songNumber(track) {
    const match = /^([0-9]{3,}) /.exec(typeof track?.title === 'string' ? track.title : '');
    const number = match ? Number(match[1]) : 0;
    return Number.isSafeInteger(number) && number > 0 ? number : Number.POSITIVE_INFINITY;
  }

  function validTotal(value) {
    const id = validId(value?.id);
    if (!id || !Number.isSafeInteger(value.likes) || value.likes < 0
      || !Number.isSafeInteger(value.dislikes) || value.dislikes < 0
      || !Number.isSafeInteger(value.score) || value.score !== value.likes - value.dislikes) return null;
    return { id, likes: value.likes, dislikes: value.dislikes, score: value.score };
  }

  function createStore(options = {}) {
    const requestFetch = Object.hasOwn(options, 'fetch') ? options.fetch : globalThis.fetch?.bind(globalThis);
    const eventTarget = Object.hasOwn(options, 'eventTarget') ? options.eventTarget : globalThis;
    const pageDocument = Object.hasOwn(options, 'document') ? options.document : globalThis.document;
    const startTimer = options.setTimeout || globalThis.setTimeout?.bind(globalThis);
    const stopTimer = options.clearTimeout || globalThis.clearTimeout?.bind(globalThis);
    const randomUUID = options.randomUUID || (() => globalThis.crypto?.randomUUID());
    const now = options.now || Date.now;
    let recoveryStorage = null;
    try { recoveryStorage = Object.hasOwn(options, 'sessionStorage') ? options.sessionStorage : globalThis.sessionStorage; } catch {}
    const timeoutMs = options.timeoutMs ?? 10000;
    const pollMs = options.pollMs ?? 30000;
    const listeners = new Set();
    const totals = new Map();
    const submissions = new Map();
    let refreshPromise = null;
    let pollTimer = null;
    let started = false;
    let disposed = false;
    let loaded = false;
    let unavailable = false;
    let lastUpdated = null;
    let refreshError = null;
    let sessionRecovery = false;
    let recoveryFormatValid = false;

    try {
      if (typeof recoveryStorage?.getItem === 'function') {
        const raw = recoveryStorage.getItem(PENDING_KEY);
        if (raw === null) { recoveryFormatValid = true; sessionRecovery = true; }
        else if (typeof raw === 'string' && raw.length <= MAX_PENDING_CHARS) {
          const data = JSON.parse(raw);
          if (data && Object.keys(data).length === 2 && data.version === 1 && Array.isArray(data.requests) && data.requests.length <= MAX_PENDING) {
            const restored = new Map();
            for (const entry of data.requests) {
              const id = validId(entry?.id);
              if (!id || Object.keys(entry).length !== 3 || !['like', 'dislike'].includes(entry.reaction)
                || typeof entry.requestId !== 'string' || !REQUEST_UUID.test(entry.requestId) || restored.has(id)) throw new Error('Invalid recovery record');
              restored.set(id, { reaction: entry.reaction, requestId: entry.requestId.toLowerCase(), pending: false, unknown: true, error: 'unknown', promise: null });
            }
            for (const [id, value] of restored) submissions.set(id, value);
            recoveryFormatValid = true; sessionRecovery = true;
          }
        }
      }
    } catch {}

    function persistPending() {
      const requests = [...submissions].filter(([, entry]) => entry.pending || entry.unknown)
        .map(([id, entry]) => ({ id, reaction: entry.reaction, requestId: entry.requestId }));
      sessionRecovery = false;
      if (!recoveryFormatValid || typeof recoveryStorage?.setItem !== 'function' || requests.length > MAX_PENDING) return;
      const raw = JSON.stringify({ version: 1, requests });
      if (raw.length > MAX_PENDING_CHARS) return;
      try { recoveryStorage.setItem(PENDING_KEY, raw); sessionRecovery = true; } catch {}
    }

    function notify(source, id = null) {
      const detail = Object.freeze({ source, id });
      for (const listener of [...listeners]) {
        try { listener(detail); } catch {}
      }
    }

    function mergeTotal(total) {
      const previous = totals.get(total.id);
      // Server counters are append-only. Merge the two counters, not the score:
      // a newer dislike must still be able to lower the ranking.
      const likes = Math.max(previous?.likes || 0, total.likes);
      const dislikes = Math.max(previous?.dislikes || 0, total.dislikes);
      totals.set(total.id, Object.freeze({ likes, dislikes, score: likes - dislikes }));
    }

    function get(id) {
      const canonicalId = validId(id);
      const total = canonicalId && totals.get(canonicalId);
      const submission = canonicalId && submissions.get(canonicalId);
      return Object.freeze({
        likes: total?.likes || 0, dislikes: total?.dislikes || 0, score: total?.score || 0,
        known: Boolean(total) || loaded,
        pending: Boolean(submission?.pending), error: submission?.error || null,
        unknown: Boolean(submission?.unknown), reaction: submission?.reaction || null,
      });
    }

    function status() {
      return Object.freeze({ loaded, refreshing: Boolean(refreshPromise), unavailable, lastUpdated, error: refreshError, sessionRecovery });
    }

    function visible() { return pageDocument?.visibilityState !== 'hidden'; }

    function clearPoll() {
      if (pollTimer !== null) stopTimer?.(pollTimer);
      pollTimer = null;
    }

    function schedulePoll() {
      clearPoll();
      if (!started || disposed || !visible() || typeof startTimer !== 'function') return;
      pollTimer = startTimer(() => {
        pollTimer = null;
        if (visible() && !disposed) refresh();
      }, pollMs);
    }

    function onFocus() { if (visible() && !disposed) refresh(); }
    function onVisibility() { if (visible()) onFocus(); else clearPoll(); }

    function start() {
      if (started || disposed) return;
      started = true;
      eventTarget?.addEventListener?.('focus', onFocus);
      pageDocument?.addEventListener?.('visibilitychange', onVisibility);
    }

    async function request(init) {
      if (typeof requestFetch !== 'function') throw new Error('Unavailable');
      const controller = typeof AbortController === 'function' ? new AbortController() : null;
      let timer = null;
      try {
        return await Promise.race([
          Promise.resolve().then(async () => {
            const response = await requestFetch(ENDPOINT, {
              credentials: 'same-origin', cache: 'no-store', ...init,
              ...(controller ? { signal: controller.signal } : {}),
            });
            if (!response || !Number.isInteger(response.status)) throw new Error('Invalid response');
            if (!response.ok) return { status: response.status, ok: false, body: null };
            return { status: response.status, ok: true, body: await response.json() };
          }),
          new Promise((_, reject) => {
            if (typeof startTimer !== 'function') { reject(new Error('Unavailable')); return; }
            timer = startTimer(() => { controller?.abort(); reject(new Error('Timeout')); }, timeoutMs);
          }),
        ]);
      } finally { if (timer !== null) stopTimer?.(timer); }
    }

    function refresh() {
      if (disposed) return Promise.resolve(false);
      start();
      clearPoll();
      if (refreshPromise) return refreshPromise;
      refreshPromise = Promise.resolve().then(async () => {
        try {
          const response = await request({ method: 'GET' });
          if (!response.ok || !Array.isArray(response.body?.totals) || response.body.totals.length > 10000) throw new Error('Invalid totals');
          const received = response.body.totals.map(validTotal);
          if (received.some(total => !total) || new Set(received.map(total => total.id)).size !== received.length) throw new Error('Invalid totals');
          for (const total of received) mergeTotal(total);
          loaded = true; unavailable = false; refreshError = null; lastUpdated = now();
          return true;
        } catch {
          unavailable = true; refreshError = 'unavailable';
          return false;
        } finally {
          refreshPromise = null;
          schedulePoll();
          notify('refresh');
        }
      });
      notify('refresh-start');
      return refreshPromise;
    }

    function vote(id, reaction) {
      const canonicalId = validId(id);
      if (!canonicalId || !['like', 'dislike'].includes(reaction)) throw new TypeError('Invalid music vote.');
      if (disposed) return Promise.resolve({ ok: false, error: 'unavailable', unknown: false });
      const previous = submissions.get(canonicalId);
      if (typeof requestFetch !== 'function') {
        unavailable = true; refreshError = 'unavailable';
        if (previous?.unknown) {
          notify('vote-error', canonicalId);
          return Promise.resolve({ ok: false, error: 'unknown', unknown: true, requestId: previous.requestId });
        }
        submissions.set(canonicalId, { reaction, pending: false, unknown: false, error: 'unavailable' });
        notify('vote-error', canonicalId);
        return Promise.resolve({ ok: false, error: 'unavailable', unknown: false });
      }
      if (previous?.pending) return previous.promise;
      if (previous?.unknown && previous.reaction !== reaction) {
        return Promise.resolve({ ok: false, error: 'unknown', unknown: true, requestId: previous.requestId });
      }
      const wasUnknown = Boolean(previous?.unknown);
      let requestId = wasUnknown ? previous.requestId : null;
      if (!requestId) {
        try { requestId = randomUUID(); } catch {}
        if (typeof requestId !== 'string' || !REQUEST_UUID.test(requestId)) {
          submissions.set(canonicalId, { reaction, pending: false, unknown: false, error: 'unavailable' });
          notify('vote-error', canonicalId);
          return Promise.resolve({ ok: false, error: 'unavailable', unknown: false });
        }
        requestId = requestId.toLowerCase();
      }
      const submission = { reaction, requestId, pending: true, unknown: false, error: null, promise: null };
      submissions.set(canonicalId, submission);
      // Write the request identity before sending. A reload restores it as an
      // explicit retry; it never replays a vote automatically.
      persistPending();
      submission.promise = Promise.resolve().then(async () => {
        let outcome;
        try {
          const response = await request({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: canonicalId, reaction, requestId }) });
          if (!response.ok) {
            if (response.status >= 400 && response.status < 500) {
              // A rejected retry says nothing about whether the original POST
              // committed. Only a valid idempotent acknowledgement resolves it.
              outcome = wasUnknown
                ? { ok: false, error: 'unknown', unknown: true, requestId }
                : { ok: false, error: response.status === 429 ? 'rateLimited' : 'rejected', unknown: false, requestId };
            } else throw new Error('Unknown result');
          } else {
            const total = validTotal(response.body?.total);
            if (!total || total.id !== canonicalId || response.body.requestId !== requestId || typeof response.body.duplicate !== 'boolean') throw new Error('Unknown result');
            mergeTotal(total);
            unavailable = false; refreshError = null; lastUpdated = now();
            outcome = { ok: true, total: { id: canonicalId, ...totals.get(canonicalId) }, requestId, duplicate: response.body.duplicate };
          }
        } catch {
          unavailable = true; refreshError = 'unavailable';
          outcome = { ok: false, error: 'unknown', unknown: true, requestId };
        }
        submission.pending = false;
        submission.error = outcome.error || null;
        submission.unknown = Boolean(outcome.unknown);
        if (outcome.ok) submissions.delete(canonicalId);
        persistPending();
        notify(outcome.ok ? 'vote' : 'vote-error', canonicalId);
        return outcome;
      });
      notify('vote-start', canonicalId);
      return submission.promise;
    }

    function compare(first, second) {
      const scoreOrder = get(second?.id).score - get(first?.id).score;
      if (scoreOrder) return scoreOrder;
      const firstNumber = songNumber(first);
      const secondNumber = songNumber(second);
      if (firstNumber !== secondNumber) return firstNumber - secondNumber;
      const firstId = typeof first?.id === 'string' ? first.id.toLowerCase() : '';
      const secondId = typeof second?.id === 'string' ? second.id.toLowerCase() : '';
      return (featuredRank.get(firstId) ?? 3) - (featuredRank.get(secondId) ?? 3)
        || (Date.parse(second?.createdAt) || 0) - (Date.parse(first?.createdAt) || 0)
        || (firstId < secondId ? -1 : firstId > secondId ? 1 : 0);
    }

    function subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('A music vote listener must be a function.');
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function dispose() {
      disposed = true;
      clearPoll();
      eventTarget?.removeEventListener?.('focus', onFocus);
      pageDocument?.removeEventListener?.('visibilitychange', onVisibility);
      listeners.clear();
    }

    // No old personal-reaction storage is read or imported. Loading this helper
    // on an ordinary page does not start network requests or polling.
    return Object.freeze({ get, status, compare, subscribe, refresh, vote, dispose });
  }

  globalThis.MapKAIMusicPreferences = Object.freeze({ ...createStore(), createStore });
})();

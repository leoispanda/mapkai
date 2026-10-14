(() => {
  'use strict';

  const STORAGE_KEY = 'mapkaiMusicReactions.v1';
  const MAX_ENTRIES = 2000;
  const MAX_STORAGE_CHARS = 200000;
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const featuredRank = new Map([
    ['c2a4a749-933b-4b4b-95fb-0d2d3f12ac6f', -1],
    ['ccb37c55-bae6-4f72-a80a-d1bc94e40ae0', 0],
    ['e4363fdb-2354-4e5c-98f0-9549b689b5c3', 1],
    ['bb5957e7-9e91-45e1-a978-5643451d7820', 2],
  ]);

  function validId(id) {
    return typeof id === 'string' && UUID.test(id) ? id.toLowerCase() : null;
  }

  function plainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      && Object.getPrototypeOf(value) === Object.prototype;
  }

  function parseStored(raw) {
    if (raw === null) return new Map();
    if (typeof raw !== 'string' || raw.length > MAX_STORAGE_CHARS) return null;
    try {
      const data = JSON.parse(raw);
      if (!plainObject(data) || Object.keys(data).length !== 2 || data.version !== 1
        || !Object.hasOwn(data, 'reactions') || !plainObject(data.reactions)) return null;
      const entries = Object.entries(data.reactions);
      if (entries.length > MAX_ENTRIES) return null;
      const reactions = new Map();
      for (const [id, value] of entries) {
        const canonicalId = validId(id);
        if (!canonicalId || reactions.has(canonicalId) || !['like', 'dislike'].includes(value)) return null;
        reactions.set(canonicalId, value);
      }
      return reactions;
    } catch { return null; }
  }

  function songNumber(track) {
    const match = /^([0-9]{3,}) /.exec(typeof track?.title === 'string' ? track.title : '');
    const number = match ? Number(match[1]) : 0;
    return Number.isSafeInteger(number) && number > 0 ? number : Number.POSITIVE_INFINITY;
  }

  function sameReactions(first, second) {
    return first.size === second.size && [...first].every(([id, value]) => second.get(id) === value);
  }

  function createStore(options = {}) {
    let storage = null;
    try { storage = Object.hasOwn(options, 'storage') ? options.storage : globalThis.localStorage; } catch {}
    const eventTarget = Object.hasOwn(options, 'eventTarget') ? options.eventTarget : globalThis;
    const listeners = new Set();
    // Keep changes that could not be saved when storage is blocked or full.
    const pending = new Map();
    let reactions = new Map();
    let persistent = false;

    function readStorage() {
      try {
        if (!storage || typeof storage.getItem !== 'function') return null;
        return parseStored(storage.getItem(STORAGE_KEY));
      } catch { return null; }
    }

    function overlayPending(base) {
      for (const [id, value] of pending) {
        if (value === null) base.delete(id);
        else base.set(id, value);
      }
      return base;
    }

    function notify(detail) {
      for (const listener of [...listeners]) {
        try { listener(Object.freeze(detail)); } catch {}
      }
    }

    const initial = readStorage();
    if (initial !== null) { reactions = initial; persistent = true; }

    function get(id) {
      const canonicalId = validId(id);
      return canonicalId ? reactions.get(canonicalId) || null : null;
    }

    function toggle(id, reaction) {
      const canonicalId = validId(id);
      if (!canonicalId || !['like', 'dislike'].includes(reaction)) throw new TypeError('Invalid music reaction.');
      const previous = reactions;
      const previousPersistent = persistent;
      // A fresh synchronous read preserves other tabs' changes to unrelated songs.
      // localStorage does not provide an atomic compare-and-swap transaction.
      const stored = readStorage();
      const next = stored === null ? new Map(reactions) : overlayPending(stored);
      const value = next.get(canonicalId) === reaction ? null : reaction;
      if (value === null) next.delete(canonicalId);
      else next.set(canonicalId, value);
      pending.set(canonicalId, value);
      reactions = next;
      persistent = false;
      if (stored !== null && next.size <= MAX_ENTRIES) {
        const raw = JSON.stringify({ version: 1, reactions: Object.fromEntries(next) });
        if (raw.length <= MAX_STORAGE_CHARS) {
          try {
            storage.setItem(STORAGE_KEY, raw);
            pending.clear();
            persistent = true;
          } catch {}
        }
      }
      if (!sameReactions(previous, reactions) || previousPersistent !== persistent) {
        notify({ source: 'local', id: canonicalId, value, persisted: persistent });
      }
      return { value, persisted: persistent };
    }

    function compare(first, second) {
      const rank = value => value === 'like' ? 0 : value === 'dislike' ? 2 : 1;
      const reactionOrder = rank(get(first?.id)) - rank(get(second?.id));
      if (reactionOrder) return reactionOrder;
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
      if (typeof listener !== 'function') throw new TypeError('A music preference listener must be a function.');
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function onStorage(event) {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      if (event.storageArea && event.storageArea !== storage) return;
      const previous = reactions;
      const previousPersistent = persistent;
      const stored = readStorage();
      if (stored === null) persistent = false;
      else {
        if (event.key === null) pending.clear();
        reactions = overlayPending(stored);
        persistent = pending.size === 0;
      }
      if (!sameReactions(previous, reactions) || previousPersistent !== persistent) {
        notify({ source: 'storage', id: null, value: null, persisted: persistent });
      }
    }

    if (typeof eventTarget?.addEventListener === 'function') eventTarget.addEventListener('storage', onStorage);
    return Object.freeze({ get, toggle, compare, subscribe, isPersistent: () => persistent });
  }

  globalThis.MapKAIMusicPreferences = Object.freeze({ ...createStore(), createStore });
})();

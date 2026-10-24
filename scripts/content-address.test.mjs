import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../content-share.js', import.meta.url), 'utf8');
const first = '11111111-1111-4111-8111-111111111111', second = '22222222-2222-4222-8222-222222222222';
function harness({ module = '', initial = 'https://www.mapkai.com/music/' } = {}) {
  const listeners = { window: new Map(), document: new Map() }, observers = [], replacements = [], metadata = new Map();
  const location = {}, originalState = { preserve: 'scroll-and-navigation-state' };
  const move = href => { const url = new URL(href); Object.assign(location, { href: url.href, origin: url.origin, pathname: url.pathname, search: url.search }); };
  move(initial);
  let track = null;
  const document = { title: 'MapKAI Music', documentElement: { lang: 'zh-CN' },
    body: { dataset: { mapkaiModule: module }, classList: { contains: () => false } },
    querySelectorAll: () => [],
    querySelector: selector => ({ setAttribute: (key, value) => metadata.set(`${selector}:${key}`, value) }),
    addEventListener: (type, callback) => listeners.document.set(type, callback),
  };
  const window = { addEventListener: (type, callback) => listeners.window.set(type, callback),
    MapKAIMusicPage: { snapshot: () => ({ track, audio: { play() { throw Error('Address updates must not start audio'); }, pause() { throw Error('Address updates must not pause audio'); } } }) },
    history: { state: originalState, replaceState(state, title, href) { assert.equal(state, originalState); replacements.push(href); move(href); } },
  };
  const context = vm.createContext({ document, window, location, URL, navigator: {}, requestAnimationFrame: callback => callback(),
    MutationObserver: class { constructor(callback) { observers.push(callback); } observe() {} } });
  vm.runInContext(source, context);
  return { document, window, location, replacements, metadata,
    select(id, title = '001 A Song - MapKAI - Learning - Curiosity') { track = { id, title }; listeners.window.get('mapkai:music-update')(); },
    repeat() { listeners.window.get('mapkai:music-update')(); },
    language(lang) { document.documentElement.lang = lang; observers[1](); },
    toggle(target) { listeners.document.get('toggle')({ target }); },
    play(target) { listeners.document.get('play')({ target }); },
    change(target) { listeners.document.get('change')({ target }); },
  };
}

test('selecting a song puts the single-song permalink in the browser without touching playback', () => {
  const h = harness(); h.select(first, '064 Your Turn - MapKAI - Arts and Humanities - Dutch Cultural Figures');
  assert.equal(h.location.href, `https://www.mapkai.com/share/song/${first}?lang=zh`);
  assert.equal(h.document.title, 'Your Turn · MapKAI');
  assert.equal(h.metadata.get('link[rel="canonical"]:href'), h.location.href);
  h.repeat(); h.repeat(); assert.equal(h.replacements.length, 1);
  h.select(second, '002 Another Song - MapKAI - Learning - Curiosity');
  assert.equal(h.location.pathname, `/share/song/${second}`); assert.equal(h.replacements.length, 2);
});

test('language switches keep the selected work address and update the shared language', () => {
  const h = harness(); h.select(first); h.language('en');
  assert.equal(h.location.href, `https://www.mapkai.com/share/song/${first}?lang=en`);
  assert.equal(h.metadata.get('meta[property="og:url"]:content'), h.location.href);
});

test('opening another song details keeps that address until a new song is selected', () => {
  const h = harness(); h.select(first);
  const card = { id: `song-${second}`, querySelector: () => ({ textContent: 'Another Song' }) };
  h.toggle({ open: true, classList: { contains: name => name === 'track-details' }, closest: () => card });
  assert.equal(h.location.pathname, `/share/song/${second}`);
  h.repeat(); assert.equal(h.location.pathname, `/share/song/${second}`);
});

test('playing an MV or selecting its quality gives that recording its own browser address', () => {
  const h = harness({ module: 'music-videos', initial: 'https://www.mapkai.com/music/videos/' });
  delete h.window.MapKAIMusicPage;
  const card = { id: 'your-turn-original', querySelector: () => ({ textContent: 'Your Turn (Draft 1)' }) };
  h.play({ tagName: 'VIDEO', closest: () => card });
  assert.equal(h.location.href, 'https://www.mapkai.com/share/film/your-turn-original?lang=zh');
  card.id = 'your-turn-asml'; h.change({ tagName: 'SELECT', closest: () => card });
  assert.equal(h.location.pathname, '/share/film/your-turn-asml');
});

test('embedded learning videos keep the learning route usable while titles link to independent works', () => {
  const h = harness({ initial: 'https://www.mapkai.com/categories/02?lang=zh' });
  delete h.window.MapKAIMusicPage;
  h.play({ tagName: 'VIDEO', closest: () => ({ id: 'arts-and-humanities' }) });
  assert.equal(h.location.pathname, '/categories/02'); assert.equal(h.replacements.length, 0);
});

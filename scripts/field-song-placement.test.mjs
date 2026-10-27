import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../script.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const ledger = JSON.parse(await readFile(new URL('../music/song-catalog.json', import.meta.url), 'utf8'));
function literal(name, array = false) {
  const marker = `const ${name} = `, start = source.indexOf(marker);
  const end = source.indexOf(array ? '\n];' : '\n};', start);
  assert.ok(start >= 0 && end > start, `Missing application data ${name}`);
  return vm.runInNewContext(`(${source.slice(start + marker.length, end + 2)})`, { readiness: { classified: 'Classified' } });
}
function handler(name) {
  const match = source.match(new RegExp(`^(?:async )?function ${name}\\([^\\n]*\\) \\{[\\s\\S]*?^\\}`, 'm'));
  assert.ok(match, `Missing application handler ${name}`); return match[0];
}
const categories = literal('categories', true);
const fields = categories.flatMap(category => category.groups.flatMap(group => group.fields.map(([code, title]) => ({ code, id: code, title }))));
const tracks = Object.fromEntries(['categorySongTracks', 'categoryGroupSongTracks', 'categoryGroupSongEditions',
  'categorySongFieldCodes', 'categoryGroupSongFieldCodes', 'categorySongEditionFieldCodes', 'categorySongSubjectLabels',
  'categorySongTopicLabelsZh'].map(name => [name, literal(name)]));
function harness(language = 'en') {
  const context = vm.createContext({ ...tracks, categories, currentLanguage: language,
    getPublicCategoryTitle: code => `Category ${code}`, getFieldDisplayTitle: field => field.title,
    getCategoryGroupForField: field => {
      const category = categories.find(c => c.groups.some(g => g.fields.some(([code]) => code === field.code)));
      return { category, group: category?.groups.find(g => g.fields.some(([code]) => code === field.code)) };
    },
    escapeHtml: value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;'),
  });
  vm.runInContext(['getCategorySongDisplayTitle', 'getCategorySongSubject', 'renderCategorySongButton',
    'renderCategorySongModule', 'getFieldSongs', 'renderFieldSongs'].map(handler).join('\n'), context);
  return { songs: code => context.getFieldSongs(fields.find(field => field.code === code)),
    render: (code, route = `/fields/${code}`) => context.renderFieldSongs(fields.find(field => field.code === code), route), context };
}
const song = concept => {
  const row = ledger.songs.find(item => item.conceptName === concept && item.number >= 27);
  assert.ok(row, `Missing expected catalog concept ${concept}`); return row;
};

test('category landing pages no longer collect music above the subject navigation', () => {
  const categoryPage = html.slice(html.indexOf('id="categoryDetail"'), html.indexOf('id="lensStoryDetail"'));
  assert.ok(categoryPage.includes('id="categoryTree"'));
  assert.doesNotMatch(categoryPage, /category-music-links|id="categorySong"|id="categoryGroupSongs"|id="categoryCulturalSongs"/);
});

test('subject music follows the taught topic rather than every field in a broad group', () => {
  const h = harness(), rhythm = song('Rhythmic Variation'), visual = song('Visual Analysis');
  assert.ok(h.render('0215').includes(rhythm.id));
  assert.ok(!h.render('0213').includes(rhythm.id));
  assert.ok(!h.render('0212').includes(rhythm.id));
  assert.ok(h.render('0213').includes(visual.id));
  const proportional = song('Proportional Reasoning'), intentions = song('Implementation Intentions');
  assert.ok(h.render('0021').includes(proportional.id));
  assert.ok(!h.render('0031').includes(proportional.id));
  assert.ok(h.render('0031').includes(intentions.id));
  assert.ok(!h.render('0021').includes(intentions.id));
});

test('the original broad-category recordings now appear inside their matching formal subjects', () => {
  const h = harness();
  for (const [concept, code] of [['Literacy and Numeracy', '0021'], ['Scaffolding', '0111'],
    ['Break-even Point', '0411'], ['Thermal Insulation', '0533'], ['Binary Search', '0613'],
    ['Dimensional Tolerance', '0715'], ['Soil Infiltration', '0811'], ['Teach-back', '0913']]) {
    assert.ok(h.render(code).includes(song(concept).id), `${concept} missing from ${code}`);
  }
  assert.ok(!h.render('0611').includes(song('Binary Search').id));
  assert.ok(!h.render('0531').includes(song('Thermal Insulation').id));
});

test('subject and story music render accessible in-place controls for their own route in both languages', () => {
  for (const language of ['en', 'zh']) {
    const h = harness(language);
    for (const route of ['/fields/0021', '/concept-fables/0021-literacy-story']) {
      const markup = h.render('0021', route);
      assert.match(markup, /class="field-music/);
      assert.ok(markup.includes(`data-song-route="${route}"`));
      assert.match(markup, /type="button"[^>]*class="category-song-trigger"/);
      assert.doesNotMatch(markup, /aria-describedby="categoryCompanionTitle"|href="\/share\/song/);
    }
  }
});

test('every displayed subject song has a catalog recording and appears only once per subject', () => {
  const h = harness(), catalogIds = new Set(ledger.songs.map(row => row.id));
  for (const field of fields) {
    const songs = h.songs(field.code), ids = Array.from(songs, row => row.id);
    assert.equal(new Set(ids).size, ids.length, `Duplicate recording in ${field.code}`);
    for (const id of ids) assert.ok(catalogIds.has(id), `Uncatalogued recording ${id} in ${field.code}`);
  }
  assert.equal(h.context.renderFieldSongs(null, '/fields/missing'), '');
});

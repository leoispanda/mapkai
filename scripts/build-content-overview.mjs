import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const source = await readFile(new URL('script.js', root), 'utf8');
function literal(name, kind = 'object') {
  const prefix = `const ${name} = `;
  const start = source.indexOf(prefix);
  const end = source.indexOf(kind === 'array' ? '\n];' : '\n};', start);
  if (start < 0 || end < start) throw new Error(`Missing overview source: ${name}`);
  return vm.runInNewContext(`(${source.slice(start + prefix.length, end + 2)})`, { readiness: { classified: 'Classified' } }, { timeout: 3000 });
}
const categories = literal('categories', 'array');
const origins = literal('subjectIntroStoriesZh20260628', 'array');
const fieldLabels = literal('publicFieldLabels');
const categorySongs = literal('categorySongTracks');
const groupSongs = literal('categoryGroupSongTracks');
const topicLabels = literal('categorySongTopicLabelsZh');
const visibility = literal('publicContentVisibility');
const rebuilt = source.match(/const rebuiltSubjectIntroCategoryCodes = new Set\((\[[\s\S]*?\])\);/);
if (!rebuilt) throw new Error('Subject introduction visibility is missing');
const rebuiltCodes = new Set(JSON.parse(rebuilt[1]));
const context = vm.createContext({});
vm.runInContext(await readFile(new URL('content/field-fables.js', root), 'utf8'), context, { timeout: 5000 });
vm.runInContext(await readFile(new URL('content/management-column.js', root), 'utf8'), context, { timeout: 3000 });
const fables = context.MAPKAI_FIELD_CONCEPT_FABLES;
const course = context.MAPKAI_MANAGEMENT_COLUMN;
const songCatalog = JSON.parse(await readFile(new URL('music/song-catalog.json', root), 'utf8'));
const administrative = /not further defined|not elsewhere classified|inter-disciplinary programmes|field unknown/i;
const slug = title => title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const songs = songCatalog.songs.map(s => ({ id: s.id, number: s.numberLabel, title: s.songName, subject: s.subjectName, concept: { en: s.conceptName, zh: topicLabels[s.conceptName] || s.conceptName }, language: s.language }));
const songIds = new Set(songs.map(s => s.id));
const isFieldCoreFable = story => story?.collection === 'field-core-fables' && story?.status === 'approved';
const built = categories.map(category => {
  const origin = origins.find(item => item.code === category.code);
  const publicOrigin = Boolean(origin && (visibility.articles || rebuiltCodes.has(category.code)));
  const fields = category.groups.flatMap(group => group.fields.filter(([, title]) => !administrative.test(title)).map(([code, title, titleZh]) => {
    const stories = fables.filter(item => item.fieldCode === code).map(story => ({
      id: story.id, title: { zh: story.titleZh, en: story.title }, concept: { zh: story.conceptNameZh, en: story.conceptName },
      ready: story.status === 'approved', public: Boolean((visibility.articles || isFieldCoreFable(story)) && story.status === 'approved'), newer: Boolean(story.module),
    }));
    if (stories.length !== 3) throw new Error(`Expected three stories for ${code}`);
    const songId = groupSongs[group.code]?.id || null;
    if (songId && !songIds.has(songId)) throw new Error(`Missing shared song for ${code}`);
    return { code, title: { zh: fieldLabels.zh[code] || titleZh || title, en: title }, slug: `${code}-${slug(title)}`, group: group.code, songId, stories };
  }));
  const songId = categorySongs[category.code]?.id || null;
  if (songId && !songIds.has(songId)) throw new Error(`Missing subject song ${category.code}`);
  return { code: category.code, title: { zh: category.chineseTitle, en: category.title }, songId,
    introduction: origin ? { id: `${category.code}-subject-intro`, title: { zh: origin.titleZh, en: origin.title }, ready: true, public: publicOrigin } : null, fields };
});
const fields = built.flatMap(c => c.fields);
const stories = fields.flatMap(f => f.stories);
if (built.length !== 11 || fields.length !== 80 || stories.length !== 240 || new Set(stories.map(s => s.id)).size !== stories.length) throw new Error('Overview coverage is incomplete');
const catalog = { schema: 'mapkai-content-overview.v1', categories: built, songs, course: {
  title: { zh: course.title, en: course.titleEn }, videoCount: Number(Boolean(course.courseMedia?.videoUrl)) + course.learningModules.reduce((n, l) => n + (l.videos?.length || 0), 0),
  podcastCount: Number(Boolean(course.courseMedia?.podcastUrl)) + course.learningModules.reduce((n, l) => n + Number(Boolean(l.audioUrl)) + Number(Boolean(l.audioUrlEn)), 0),
  lessons: course.learningModules.map((l, i) => ({ day: i + 1, title: { zh: l.title, en: l.titleEn } })),
} };
const json = JSON.stringify(catalog);
const inputs = await Promise.all(['app.js', 'graph.js', 'layout.js', 'link-routing.js', 'styles.css', 'index.html', 'english.json'].map(name => readFile(new URL(`toolbox/overview/${name}`, root))));
const revisionHash = createHash('sha256').update(json);
for (const input of inputs) revisionHash.update(input);
const revision = revisionHash.digest('hex').slice(0, 12);
const assetVersion = JSON.parse(await readFile(new URL('version.json', root), 'utf8')).version;
const target = new URL('public/toolbox/overview/', root);
await mkdir(new URL('en/', target), { recursive: true });
await mkdir(new URL('zh/', target), { recursive: true });
await mkdir(new URL('vendor/', target), { recursive: true });
for (const name of ['d3.v7.9.0.min.js', 'D3-LICENSE.txt']) await cp(new URL(`toolbox/overview/vendor/${name}`, root), new URL(`vendor/${name}`, target));
await writeFile(new URL('catalog.json', target), json + '\n');
await writeFile(new URL('toolbox/overview/catalog.json', root), json + '\n');
for (const name of ['app.js', 'graph.js', 'layout.js', 'link-routing.js', 'styles.css']) await cp(new URL(`toolbox/overview/${name}`, root), new URL(name, target));
const template = await readFile(new URL('toolbox/overview/index.html', root), 'utf8');
const translations = JSON.parse(await readFile(new URL('toolbox/overview/english.json', root), 'utf8'));
const localized = (html, language) => {
  if (language === 'en') {
    for (const [zh, en] of Object.entries(translations).sort((a,b) => b[0].length - a[0].length)) html = html.replaceAll(zh, en);
    html = html.replace('lang="zh-CN"', 'lang="en"').replace('lang="en">EN', 'lang="en" aria-current="true">EN').replace('lang="zh" aria-current="true"', 'lang="zh"').replaceAll('href="/toolbox/"', 'href="/toolbox/en/"');
    if (/[\u3400-\u9fff]/u.test(html.replaceAll('中文', ''))) throw new Error('Missing overview English translation');
  }
  return html.replaceAll('__CATALOG_REVISION__', revision).replace(/(\/(?:site-shell\.(?:css|js)|toolbox\/styles\.css))\?v=[^"']*/g, `$1?v=${assetVersion}`);
};
await writeFile(new URL('index.html', target), localized(template, 'en'));
await writeFile(new URL('en/index.html', target), localized(template, 'en'));
await writeFile(new URL('zh/index.html', target), localized(template, 'zh'));
console.log(`Built content overview: ${built.length} subjects, ${fields.length} fields, ${stories.length} stories and ${songs.length} songs.`);

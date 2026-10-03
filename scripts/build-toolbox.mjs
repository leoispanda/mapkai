import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await import('./export-framework-stories.mjs');
const dictionary = JSON.parse(await readFile(new URL('toolbox/english.json', root), 'utf8'));
function english(source, translations = dictionary) {
  const pairs = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
  for (const [zh, en] of pairs) source = source.replaceAll(zh, en);
  return source.replaceAll("。", ".").replaceAll("：", ": ");
}
const target = new URL('public/toolbox/', root);
await mkdir(new URL('en/', target), { recursive: true });
for (const name of ['index.html', 'app.js', 'styles.css']) await cp(new URL(`toolbox/${name}`, root), new URL(name, target));
let html = english(await readFile(new URL('toolbox/index.html', root), 'utf8'))
  .replace('lang="zh-CN"', 'lang="en"')
  .replace('/toolbox/app.js', '/toolbox/en/app.js')
  .replace('href="/toolbox" aria-current="page"', 'href="/toolbox/en/" aria-current="page"')
  .replace('lang="en">EN', 'lang="en" aria-current="true">EN')
  .replace('lang="zh" aria-current="true"', 'lang="zh"');
const app = english(await readFile(new URL('toolbox/app.js', root), 'utf8'))
  .replace("url: '/speaking/'", "url: '/speaking/en/'")
  .replace("url: '/toolbox/dishkai/'", "url: '/toolbox/dishkai/en/'")
  .replace("url: '/toolbox/frameworks/'", "url: '/toolbox/frameworks/en/'")
  .replace("url: '/toolbox/metronome/'", "url: '/toolbox/metronome/en/'");
if (/[\u3400-\u9fff]/u.test(app) || /[\u3400-\u9fff]/u.test(html.replace('中文', ''))) throw new Error('Missing Toolbox English translation');
await writeFile(new URL('en/index.html', target), html);
await writeFile(new URL('en/app.js', target), app);

const frameworksTarget = new URL('frameworks/', target);
await mkdir(new URL('en/', frameworksTarget), { recursive: true });
for (const name of ['index.html', 'app.js', 'styles.css', 'data.js', 'diagrams.js', 'library.js', 'references.js', 'stories.js', 'framework-stories.js']) {
  await cp(new URL(`toolbox/frameworks/${name}`, root), new URL(name, frameworksTarget));
}
const frameworksDictionary = JSON.parse(await readFile(new URL('toolbox/frameworks/english.json', root), 'utf8'));
const frameworksHtml = english(await readFile(new URL('toolbox/frameworks/index.html', root), 'utf8'), frameworksDictionary)
  .replace('lang="zh-CN"', 'lang="en"')
  .replaceAll('href="/toolbox/"', 'href="/toolbox/en/"')
  .replace('lang="en">EN', 'lang="en" aria-current="true">EN')
  .replace('lang="zh" aria-current="true"', 'lang="zh"');
if (/[\u3400-\u9fff]/u.test(frameworksHtml.replaceAll('中文', ''))) throw new Error('Missing Frameworks English translation');
await writeFile(new URL('en/index.html', frameworksTarget), frameworksHtml);

const dishkaiTarget = new URL('dishkai/', target);
await mkdir(new URL('en/', dishkaiTarget), { recursive: true });
for (const name of ['index.html', 'app.js', 'styles.css']) {
  await cp(new URL(`toolbox/dishkai/${name}`, root), new URL(name, dishkaiTarget));
}
const dishkaiDictionary = JSON.parse(await readFile(new URL('toolbox/dishkai/english.json', root), 'utf8'));
const dishkaiHtml = english(await readFile(new URL('toolbox/dishkai/index.html', root), 'utf8'), dishkaiDictionary)
  .replace('lang="zh-CN"', 'lang="en"')
  .replaceAll('href="/toolbox/"', 'href="/toolbox/en/"')
  .replace('lang="en">EN', 'lang="en" aria-current="true">EN')
  .replace('lang="zh" aria-current="true"', 'lang="zh"');
if (/[\u3400-\u9fff]/u.test(dishkaiHtml.replaceAll('中文', ''))) throw new Error('Missing DishKAI English translation');
await writeFile(new URL('en/index.html', dishkaiTarget), dishkaiHtml);

const metronomeTarget = new URL('metronome/', target);
await mkdir(new URL('en/', metronomeTarget), { recursive: true });
for (const name of ['index.html', 'app.js', 'styles.css']) {
  await cp(new URL(`toolbox/metronome/${name}`, root), new URL(name, metronomeTarget));
}
await cp(new URL('toolbox/metronome/audio/', root), new URL('audio/', metronomeTarget), { recursive: true });
const metronomeDictionary = JSON.parse(await readFile(new URL('toolbox/metronome/english.json', root), 'utf8'));
const metronomeHtml = english(await readFile(new URL('toolbox/metronome/index.html', root), 'utf8'), metronomeDictionary)
  .replace('lang="zh-CN"', 'lang="en"')
  .replaceAll('href="/toolbox/"', 'href="/toolbox/en/"')
  .replace('lang="en">EN', 'lang="en" aria-current="true">EN')
  .replace('lang="zh" aria-current="true"', 'lang="zh"');
if (/[\u3400-\u9fff]/u.test(metronomeHtml.replaceAll('中文', ''))) throw new Error('Missing Metronome English translation');
await writeFile(new URL('en/index.html', metronomeTarget), metronomeHtml);
console.log('Built Chinese and English Toolbox, management frameworks, running metronome and DishKAI menu reader.');

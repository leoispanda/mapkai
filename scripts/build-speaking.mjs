import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { translations } from '../speaking/translations.js';

const root = new URL('../', import.meta.url);
const target = new URL('public/speaking/', root);
await mkdir(target, { recursive: true });
for (const name of ['index.html', 'app.js', 'gemini.js', 'studio.css', 'i18n.js', 'translations.js', 'agent-prompt.txt']) {
  await cp(new URL(`speaking/${name}`, root), new URL(name, target));
}
for (const name of ['styles.css', 'mic-worklet.js', 'story-context.js']) {
  await cp(new URL(`tools/speaking-local/${name}`, root), new URL(name, target));
}
const parser = await readFile(new URL('tools/speaking-local/story-import.js', root), 'utf8');
await writeFile(new URL('story-import.js', target), parser.replaceAll('/tools/speaking-local/', '/speaking/'));
await cp(new URL('tools/speaking-local/vendor/', root), new URL('vendor/', target), { recursive: true });
await cp(new URL('tools/speaking-local/vendor/google-genai.js', root), new URL('google-genai.js', target));
console.log('Built online Speaking Studio (public assets only).');
let english = (await readFile(new URL('speaking/index.html', root), 'utf8')).replace('lang="zh-CN"', 'lang="en"');
for (const [zh, en] of Object.entries(translations).sort((a,b) => b[0].length-a[0].length)) {
  if (zh.includes('{0}')) continue;
  english = english.replaceAll(zh.replaceAll('\n', '&#10;'), en.replaceAll('\n', '&#10;'));
}
english = english.replace('href="/toolbox/"', 'href="/toolbox/en/"');
english = english.replace('data-language="en" lang="en" aria-pressed="false"', 'data-language="en" lang="en" aria-pressed="true"').replace('data-language="zh" lang="zh" aria-pressed="true"', 'data-language="zh" lang="zh" aria-pressed="false"');
await mkdir(new URL('en/', target), { recursive: true });
await writeFile(new URL('en/index.html', target), english);

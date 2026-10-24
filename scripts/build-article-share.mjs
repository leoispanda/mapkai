// Export only the articles already admitted by the public website's own gate.
import { readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const source = await readFile(new URL('script.js', root), 'utf8');
const end = source.indexOf('const modulePassports =');
if (end < 0) throw new Error('Article data boundary is missing');
const context = vm.createContext({
  document: { querySelectorAll: () => [], querySelector: () => null, getElementById: () => null, body: { classList: { contains: () => false } } },
  window: { location: { pathname: '/', protocol: 'https:' } }, location: { search: '' }, URLSearchParams,
  localStorage: { getItem: () => null, setItem() {} },
});
vm.runInContext(await readFile(new URL('content/field-fables.js', root), 'utf8'), context);
vm.runInContext(source.slice(0, end), context, { timeout: 10000 });
const result = vm.runInContext(`(() => {
  const output = {};
  for (const language of ['zh', 'en']) {
    currentLanguage = language;
    for (const article of getAllRateableArticles()) {
      if (!/^\\/(lens-stories|concept-fables|stories)\\/[a-z0-9-]+$/.test(article.href)) continue;
      (output[article.href] ||= {})[language] = { title: article.title, description: article.summary || article.title };
    }
  }
  return output;
})()`, context);
if (Object.keys(result).length < 11) throw new Error('Public article share catalog is incomplete');
await writeFile(new URL('functions/_shared/article-share-data.json', root), JSON.stringify(result, null, 2) + '\n');
console.log(`Built share metadata for ${Object.keys(result).length} public articles.`);

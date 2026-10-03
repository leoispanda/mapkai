import { translations } from './translations.js?v=0.1.291';
export let language = (new URLSearchParams(location.search).get('lang') || (location.pathname.includes('/en') ? 'en' : 'zh')) === 'en' ? 'en' : 'zh';
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pairs = Object.entries(translations);
function convert(value, from, to) {
  if (from === to || typeof value !== 'string') return value;
  const text = value.trim();
  for (const [zh, en] of pairs) {
    const source = from === 'zh' ? zh : en, target = to === 'en' ? en : zh;
    if (source === text) return value.replace(text, () => target);
  }
  for (const [zh, en] of pairs) {
    const source = from === 'zh' ? zh : en, target = to === 'en' ? en : zh;
    if (!source.includes('{0}')) continue;
    const pattern = new RegExp('^' + source.split('{0}').map(escape).join('([\\s\\S]*?)') + '$');
    const match = text.match(pattern);
    if (match) return value.replace(text, () => target.replace('{0}', () => match[1]));
  }
  return value;
}
export function t(value) { return convert(value, 'zh', language); }
export function translatePage(from) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest('script,style,textarea,#transcript .turn,#summary-content,#history-content,.saved-story,#microphone-select')) continue;
    node.textContent = convert(node.textContent, from, language);
  }
  for (const element of document.querySelectorAll('[placeholder],[aria-label]')) {
    if (element.closest('.saved-story')) continue;
    for (const attr of ['placeholder','aria-label']) if (element.hasAttribute(attr)) element.setAttribute(attr, convert(element.getAttribute(attr), from, language));
  }
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  try { localStorage.setItem('mapkaiLanguageV2', language); } catch {}
  document.querySelectorAll('.toolbox-link').forEach(link => { link.href = language === 'en' ? '/toolbox/en/' : '/toolbox/'; });
  document.querySelectorAll('.brand').forEach(link => { link.href = language === 'en' ? '/?lang=en' : '/?lang=zh'; });
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
}
export function setLanguage(next) {
  const previous = language; language = next === 'en' ? 'en' : 'zh';
  translatePage(previous);
  history.replaceState(history.state, '', language === 'en' ? '/speaking/en/' : '/speaking/');
}

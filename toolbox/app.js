try { localStorage.setItem('mapkaiLanguageV2', document.documentElement.lang === 'en' ? 'en' : 'zh'); } catch {}
const $ = id => document.getElementById(id);
const key = 'mapkai-toolbox:v1';
const categories = { speak: '表达与对话', learn: '学习与探索', think: '思考与创作', other: '其他工具' };
const builtins = [
  { id: 'speaking', name: '英语对话', description: '用语音练英语，结束后回顾对话。', category: 'speak', url: '/speaking/', icon: 'voice' },
  { id: 'map', name: '知识地图', description: '探索知识领域之间的联系。', category: 'learn', url: '/map', icon: 'map' },
  { id: 'stories', name: '知识故事', description: '通过故事理解一个概念。', category: 'learn', url: '/categories', icon: 'book' },
  { id: 'pdc', name: 'PDC 决策室', description: '从不同角度梳理选择与下一步。', category: 'think', url: '/toolbox/pdc', icon: 'compass' },
  { id: 'frameworks', name: '思维框架', description: '查找适合问题的思维框架。', category: 'learn', url: '/toolbox/frameworks/', icon: 'framework' },
  { id: 'metronome', name: '跑步节拍器', description: '跟随节拍跑步，自由调整步频。', category: 'other', url: '/toolbox/metronome/', icon: 'pulse' },
  { id: 'dishkai', name: '菜单助手 · DishKAI', description: '拍菜单或贴文字，看懂陌生菜名。', category: 'other', url: '/toolbox/dishkai/', icon: 'dish' },
];
const icons = {
  framework: '<rect x="4" y="4" width="10" height="10" rx="2"/><rect x="18" y="4" width="10" height="10" rx="2"/><rect x="4" y="18" width="10" height="10" rx="2"/><path d="M18 20h10m-10 6h7"/>',
  dish: '<circle cx="16" cy="16" r="9"/><circle cx="16" cy="16" r="5"/><path d="M2 5v8m3-8v8m-3-3h3M3.5 13v14M29 5v22m0-22c-4 4-4 10 0 10"/>',
  voice: '<path d="M8 15v2m4-8v14m4-18v22m4-18v14m4-8v2"/>',
  map: '<path d="m4 8 8-4 8 4 8-4v20l-8 4-8-4-8 4V8Zm8-4v20m8-16v20"/>',
  book: '<path d="M16 8c-4-3-8-3-12-2v20c4-1 8-1 12 2 4-3 8-3 12-2V6c-4-1-8-1-12 2Zm0 0v20"/>',
  compass: '<circle cx="16" cy="16" r="12"/><path d="m20 12-2 6-6 2 2-6 6-2Z"/>',
  pulse: '<path d="M3 16h6l4-10 6 20 4-10h6"/>',
  link: '<path d="m13 19 6-6m-8 2-3 3a5 5 0 0 0 7 7l3-3m3-7 3-3a5 5 0 0 0-7-7l-3 3"/>',
};
function validUrl(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
let state = { tools: [], favorites: ['speaking'] };
let loadIssue = false;
try {
  const raw = JSON.parse(localStorage.getItem(key));
  if (raw) {
    if (!Array.isArray(raw.tools) || !Array.isArray(raw.favorites)) throw new Error();
    state.tools = raw.tools.filter(t => t && typeof t.id === 'string' && t.id.startsWith('custom-') && typeof t.name === 'string' && t.name.trim() && typeof t.description === 'string' && categories[t.category] && validUrl(t.url)).slice(0, 100);
    state.favorites = raw.favorites.filter(id => typeof id === 'string');
  }
} catch { loadIssue = true; }
let filter = 'all', editing = null, removed = null;
function showNotice(message, undo = false) { $('notice-text').textContent = message; $('notice').hidden = false; $('undo').hidden = !undo; }
function persist(next) {
  try { localStorage.setItem(key, JSON.stringify(next)); state = next; return true; }
  catch { showNotice('浏览器未能保存，请检查存储空间或隐私设置后再试。'); return false; }
}
function node(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text) el.textContent = text; return el; }
function favorite(tool) {
  const selected = state.favorites.includes(tool.id);
  const button = node('button', `favorite${selected ? ' selected' : ''}`, selected ? '★' : '☆');
  button.type = 'button'; button.setAttribute('aria-label', `${selected ? '取消常用' : '设为常用'}：${tool.name}`); button.setAttribute('aria-pressed', String(selected));
  button.onclick = () => {
    const next = selected ? state.favorites.filter(id => id !== tool.id) : [...state.favorites, tool.id];
    if (persist({ ...state, favorites: next })) { render(); showNotice(selected ? '已移出常用。' : '已添加到常用。'); }
  };
  return button;
}
function card(tool) {
  const article = node('article', `tool-card ${tool.category}`);
  const symbol = node('span', 'tool-icon');
  symbol.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icons[tool.icon] || icons.link}</svg>`;
  const link = node('a', 'tool-link'); link.href = tool.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  const copy = node('div', 'tool-copy');
  copy.append(node('h3', '', tool.name), node('p', 'tool-description', tool.description || '你保存的网站或工具。'));
  const arrow = node('span', 'open-label', '↗'); arrow.setAttribute('aria-hidden', 'true');
  link.append(symbol, copy, arrow);
  article.append(link, favorite(tool));
  if (tool.id.startsWith('custom-')) {
    const actions = node('div', 'card-actions'); const edit = node('button', '', '编辑'); const remove = node('button', '', '移出工具箱');
    edit.setAttribute('aria-label', `编辑：${tool.name}`); remove.setAttribute('aria-label', `移除：${tool.name}`);
    edit.onclick = () => openDialog(tool);
    remove.onclick = () => {
      const wasFavorite = state.favorites.includes(tool.id);
      if (persist({ tools: state.tools.filter(t => t.id !== tool.id), favorites: state.favorites.filter(id => id !== tool.id) })) {
        removed = { tool, wasFavorite }; render(); showNotice(`已移出「${tool.name}」。`, true);
      }
    };
    actions.append(edit, remove); article.append(actions);
  }
  return article;
}
function render() {
  const search = $('search').value.trim().toLowerCase();
  const all = [...builtins, ...state.tools];
  const shown = all.filter(tool => (filter === 'all' || filter === 'favorites' && state.favorites.includes(tool.id) || filter === tool.category) && `${tool.name} ${tool.description} ${categories[tool.category]}`.toLowerCase().includes(search));
  $('tools').replaceChildren(...shown.map(card));
  $('tool-count').textContent = shown.length === all.length ? `${all.length} 个工具` : `${shown.length} / ${all.length} 个工具`;
  $('empty').hidden = shown.length > 0;
  $('empty-copy').textContent = filter === 'favorites' && !search ? '点击工具卡片上的星星，把常用的留在这里。' : '换个关键词，或收进一个你喜欢的工具。';
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
}
function openDialog(tool) {
  editing = tool?.id || null;
  $('tool-form').reset(); $('form-error').textContent = '';
  $('dialog-title').textContent = tool ? '编辑工具' : '添加工具';
  $('save-tool').textContent = tool ? '保存修改' : '添加工具 ↗';
  if (tool) { $('tool-name').value = tool.name; $('tool-url').value = tool.url; $('tool-description').value = tool.description; $('tool-category').value = tool.category; }
  $('tool-dialog').showModal(); $('tool-name').focus();
}
$('add-tool').onclick = () => openDialog();
$('close-dialog').onclick = () => $('tool-dialog').close();
$('tool-form').onsubmit = event => {
  event.preventDefault();
  const name = $('tool-name').value.trim(), url = validUrl($('tool-url').value.trim());
  if (!name || !url) { $('form-error').textContent = '请填写名称和完整的 http:// 或 https:// 网址。网址不能包含登录用户名或密码。'; return; }
  if (!editing && state.tools.length >= 100) { $('form-error').textContent = '工具箱已收好 100 个工具，请先整理一下再添加。'; return; }
  const item = { id: editing || `custom-${crypto.randomUUID()}`, name, url, description: $('tool-description').value.trim(), category: $('tool-category').value };
  const tools = editing ? state.tools.map(t => t.id === editing ? item : t) : [...state.tools, item];
  if (!persist({ ...state, tools })) { $('form-error').textContent = '保存失败，填写的内容已保留。'; return; }
  $('tool-dialog').close(); filter = 'all'; $('search').value = ''; render(); showNotice(editing ? '修改已保存。' : '已添加工具。');
};
$('undo').onclick = () => {
  if (!removed) return;
  const { tool, wasFavorite } = removed;
  if (state.tools.some(item => item.id === tool.id)) return;
  if (persist({ tools: [...state.tools, tool], favorites: wasFavorite ? [...state.favorites, tool.id] : state.favorites })) { removed = null; render(); showNotice('工具已放回。'); }
};
$('search').oninput = render;
document.querySelectorAll('[data-filter]').forEach(button => { button.onclick = () => { filter = button.dataset.filter; render(); }; });
$('reset-filter').onclick = () => { filter = 'all'; $('search').value = ''; render(); };
render();
if (loadIssue) showNotice('没有读到有效的本地收藏，先显示 MapKAI 自带工具。');

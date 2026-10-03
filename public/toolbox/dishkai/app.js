const zh = document.documentElement.lang.startsWith('zh');
const $ = id => document.getElementById(id);
const copy = zh ? {
  analyze: '看懂这份菜单 ↗', loading: '正在解读菜单，可能需要约一分钟…', sample: '已填入示例菜单。点击「看懂这份菜单」开始。', empty: '请先输入菜单文字。', photo: '请先选择一张菜单照片。', invalidPhoto: '请选择 8 MB 以内的 JPG、PNG、WebP 或 GIF 图片。', failed: '暂时无法连接 DishKAI，请稍后重试。', timeout: '这次识别用时较长，请稍后重试，或缩短菜单。', limited: '使用人数较多，请稍等一分钟后重试。', imageUnavailable: '照片暂时无法识别，请换一张清晰的照片，或粘贴菜单文字。', cancelled: '已停止等待。', noItems: '没有找到菜名，请试试更清晰的照片或菜单文字。', ready: n => `已解读 ${n} 道菜。点击菜名查看详情。`, count: (n, language) => `${n} 道菜 · ${language}`, matched: 'DishKAI 菜品资料', ai: 'AI 估计 · 尚未核实', universal: '通用点餐提示', unknown: '暂未找到可靠的菜品资料', unverified: '参考信息 · 尚未核实', description: '这是什么', preparation: '常见做法', composition: '大致组成', compositionNote: '比例为估算，实际用料因餐厅而异。', taste: '口味', flavor: '主要风味', texture: '口感', watch: '可能的过敏原与注意事项', dietary: '饮食提示', variations: '常见变化', imageNote: 'AI 生成参考图，实际出品可能不同。', unspecified: '未提供完整信息，请向餐厅确认。', sourceNote: '资料用于了解常见做法，不能确认这家餐厅的实际配方。', aiNote: '这是 AI 生成的估计，尚未经过 DishKAI 核实。', unknownNote: '保留了菜单上的原名。可向餐厅询问主要食材、做法和过敏原。', photoHint: '拍清菜名与价格，尽量让菜单铺满画面。', safety: '过敏原和饮食要求请向餐厅确认。',
} : {
  analyze: 'Understand this menu ↗', loading: 'Reading your menu. This may take about a minute…', sample: 'Sample added. Select “Understand this menu” to begin.', empty: 'Paste some menu text first.', photo: 'Choose a menu photo first.', invalidPhoto: 'Choose a JPG, PNG, WebP or GIF image under 8 MB.', failed: 'DishKAI is unavailable right now. Please try again shortly.', timeout: 'This scan took too long. Try again or use a shorter menu.', limited: 'The service is busy. Please wait a minute and try again.', imageUnavailable: 'We could not read this photo. Try a clearer one or paste menu text.', cancelled: 'Stopped waiting.', noItems: 'No dishes found. Try clearer menu text or a sharper photo.', ready: n => `${n} dishes ready. Select a name to see the details.`, count: (n, language) => `${n} dishes · ${language}`, matched: 'DishKAI dish reference', ai: 'AI estimate · Unverified', universal: 'General ordering guidance', unknown: 'No reliable dish reference yet', unverified: 'Reference · Unverified', description: 'What it is', preparation: 'How it is usually prepared', composition: 'Estimated composition', compositionNote: 'Estimated proportions. Ingredients vary by restaurant.', taste: 'Taste', flavor: 'Distinctive flavors', texture: 'Texture', watch: 'Potential allergens & watch-outs', dietary: 'Dietary notes', variations: 'Common variations', imageNote: 'AI-generated reference image. The actual dish may look different.', unspecified: 'Full information is unavailable. Please ask the restaurant.', sourceNote: 'This describes a typical dish, not the actual recipe at this restaurant.', aiNote: 'This is an AI-generated estimate that DishKAI has not verified.', unknownNote: 'The original menu name is preserved. Ask the restaurant about ingredients, preparation and allergens.', photoHint: 'Keep dish names and prices sharp and fill the frame with the menu.', safety: 'Confirm allergens and dietary requirements with the restaurant.',
};
const tasteZh = { sweet: '甜', sour: '酸', umami: '鲜味', salty: '咸', savory: '咸香', rich: '浓郁', creamy: '奶香浓滑', spicy: '辣', 'mildly-spicy': '微辣', bitter: '苦', mild: '温和', oily: '油润', smoky: '烟熏', 'soft noodles': '柔软的面条', 'crunchy peanuts': '香脆的花生', 'fresh bean sprouts': '爽脆的豆芽', 'tender beef': '软嫩牛肉', 'deep sauce': '浓厚酱汁', 'soft vegetables': '软熟蔬菜', 'can-be-made-vegetarian': '可询问餐厅能否改为素食', 'contains-animal-seasoning-by-default': '通常含动物来源调味料' };
const string = value => typeof value === 'string' ? value : '';
const list = (value, language) => Array.isArray(value) ? value.filter(item => typeof item === 'string').map(item => language === 'zh' ? tasteZh[item] || item : item.replaceAll('-', ' ')).join(language === 'zh' ? '、' : ', ') : '';
const el = (tag, className, text) => { const element = document.createElement(tag); if (className) element.className = className; if (text) element.textContent = text; return element; };
let mode = 'text';
let active = null;
try { localStorage.setItem('mapkaiLanguageV2', zh ? 'zh' : 'en'); } catch {}
$('output-language').value = zh ? 'zh' : 'en';
function status(text, failure = false) { $('status').textContent = text; $('status').dataset.error = String(failure); }
function setMode(next) {
  mode = next;
  $('text-panel').hidden = mode !== 'text'; $('photo-panel').hidden = mode !== 'image';
  $('text-mode').setAttribute('aria-pressed', String(mode === 'text')); $('photo-mode').setAttribute('aria-pressed', String(mode === 'image'));
  status('');
}
$('text-mode').onclick = () => setMode('text');
$('photo-mode').onclick = () => setMode('image');
$('menu-text').oninput = () => { $('text-count').textContent = `${$('menu-text').value.length} / 12000`; };
$('sample').onclick = () => {
  setMode('text'); $('menu-text').value = 'Boeuf Bourguignon\nPad Thai\nCarbonara'; $('menu-text').oninput(); $('menu-text').focus(); status(copy.sample);
};
$('menu-image').onchange = () => {
  const file = $('menu-image').files[0];
  $('file-status').textContent = file ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB` : copy.photoHint;
  status(file && !validPhoto(file) ? copy.invalidPhoto : '', Boolean(file && !validPhoto(file)));
};
function validPhoto(file) { return file && file.size > 0 && file.size <= 8 * 1024 * 1024 && ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type); }
function busy(value) {
  $('menu-fields').disabled = value; $('cancel').hidden = !value; $('results').setAttribute('aria-busy', String(value));
  $('analyze').textContent = value ? (zh ? '正在解读…' : 'Reading…') : copy.analyze;
}
$('cancel').onclick = () => active?.abort();
$('menu-form').onsubmit = async event => {
  event.preventDefault();
  if (active) return;
  const text = $('menu-text').value.trim(); const file = $('menu-image').files[0];
  if (mode === 'text' && !text) { status(copy.empty, true); $('menu-text').focus(); return; }
  if (mode === 'image' && !validPhoto(file)) { status(file ? copy.invalidPhoto : copy.photo, true); return; }
  const targetLanguage = $('output-language').value;
  let body; const headers = {};
  if (mode === 'text') { body = JSON.stringify({ menuText: text, targetLanguage }); headers['Content-Type'] = 'application/json'; }
  else { body = new FormData(); body.set('image', file); body.set('targetLanguage', targetLanguage); }
  active = new AbortController(); const controller = active;
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 105000);
  busy(true); status(copy.loading);
  $('result-list').replaceChildren(); $('empty-state').hidden = false; $('result-note').hidden = true;
  $('result-count').textContent = zh ? '按原菜单顺序' : 'In original menu order';
  try {
    const response = await fetch(`/api/dishkai/analyze-menu-${mode}`, { method: 'POST', headers, body, signal: controller.signal });
    const result = await response.json();
    if (!response.ok || result.ok !== true || !Array.isArray(result.items)) {
      const messages = { RATE_LIMITED: copy.limited, UPSTREAM_TIMEOUT: copy.timeout, IMAGE_UNAVAILABLE: copy.imageUnavailable, INVALID_IMAGE: copy.invalidPhoto, BODY_TOO_LARGE: mode === 'image' ? copy.invalidPhoto : copy.empty };
      throw new Error(messages[result.error] || copy.failed);
    }
    if (!result.items.length) { status(copy.noItems, true); return; }
    render(result.items, targetLanguage); status(copy.ready(result.items.length));
    $('results-title').focus({ preventScroll: true });
    if (matchMedia('(max-width:700px)').matches) $('results').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  } catch (cause) { status(controller.signal.aborted ? (timedOut ? copy.timeout : copy.cancelled) : (cause instanceof TypeError || cause instanceof SyntaxError ? copy.failed : cause.message), true); }
  finally { clearTimeout(timer); active = null; busy(false); }
};

function image(path, className) {
  if (!/^\/assets\/dishes\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:webp|png|jpe?g)$/i.test(string(path))) return null;
  const node = el('img', className); node.src = `/api/dishkai/image?path=${encodeURIComponent(path)}`; node.alt = ''; node.loading = 'lazy';
  node.onerror = () => { node.hidden = true; };
  return node;
}
function provenance(item, card) {
  if (card.metadataSource === 'ai-fallback' || item.matchStatus === 'ai-generated') return copy.ai;
  if (card.metadataSource === 'universal-generic' || item.matchStatus === 'universal') return copy.universal;
  if (card.verified === true && card.metadataSource === 'dishkai-database' && item.matchStatus === 'matched') return copy.matched;
  return item.matchStatus === 'unmatched' ? copy.unknown : copy.unverified;
}
function render(items, language) {
  $('empty-state').hidden = true; $('result-note').hidden = false;
  $('result-count').textContent = copy.count(items.length, { zh: '中文', en: 'English', nl: 'Nederlands' }[language]);
  items.forEach((item, index) => {
    const card = item.card && typeof item.card === 'object' ? item.card : {};
    const row = el('article', 'dish-row'); const toggle = el('button', 'dish-toggle'); toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', `dish-detail-${index}`);
    toggle.append(el('span', 'dish-index', String(index + 1).padStart(2, '0')));
    const thumb = image(card.thumbPath || card.imagePath, 'dish-thumb'); if (thumb) toggle.append(thumb);
    const names = el('span', 'dish-copy'); names.append(el('strong', '', string(item.originalName) || string(item.cleanName)), el('small', '', string(card.familiarName)), el('small', 'match-label', provenance(item, card)));
    const arrow = el('span', 'dish-arrow', '+'); arrow.setAttribute('aria-hidden', 'true'); toggle.append(names, arrow);
    const detail = el('div', 'dish-detail'); detail.id = `dish-detail-${index}`; detail.hidden = true;
    let built = false;
    toggle.onclick = () => {
      if (!built) { buildDetail(detail, item, card, language); built = true; }
      detail.hidden = !detail.hidden; toggle.setAttribute('aria-expanded', String(!detail.hidden)); arrow.textContent = detail.hidden ? '+' : '−';
    };
    row.append(toggle, detail); $('result-list').append(row);
  });
}
function buildDetail(detail, item, card, language) {
  const localizedList = value => list(value, language);
  const picture = image(card.imagePath, 'dish-image');
  if (picture) detail.append(picture, el('p', 'image-note', copy.imageNote));
  if (card.metadataSource === 'ai-fallback' || item.matchStatus === 'ai-generated') detail.append(el('p', 'source-note', copy.aiNote));
  if (item.matchStatus === 'unmatched') { detail.append(el('p', 'dish-description', copy.unknownNote)); return; }
  if (card.orderVerdict) detail.append(el('p', 'verdict', string(card.orderVerdict)));
  if (card.shortDescription) detail.append(el('p', 'dish-description', string(card.shortDescription)));
  const definitions = el('dl');
  function field(label, value, className = '') {
    if (!value) return;
    const part = el('div', className); const dd = el('dd'); dd.append(typeof value === 'string' ? document.createTextNode(value) : value); part.append(el('dt', '', label), dd); definitions.append(part);
  }
  field(copy.preparation, string(card.cooking?.profile) || localizedList(card.cooking?.methods));
  if (Array.isArray(card.composition) && card.composition.length) {
    const composition = el('div'); const ul = el('ul', 'composition-list');
    for (const part of card.composition) {
      if (!part || !string(part.name)) continue;
      const percentage = Number(part.estimatedPercent); const li = el('li'); li.append(el('span', '', part.name), el('span', '', Number.isFinite(percentage) && percentage > 0 && percentage <= 100 ? `≈ ${percentage}%` : '—')); ul.append(li);
    }
    composition.append(ul, el('p', 'source-note', copy.compositionNote)); field(copy.composition, composition);
  }
  field(copy.taste, localizedList(card.basicTaste)); field(copy.flavor, localizedList(card.distinctiveFlavorSources)); field(copy.texture, localizedList(card.texture));
  field(copy.watch, `${localizedList(card.watchOuts) || copy.unspecified} ${copy.safety}`, 'watch-out'); field(copy.dietary, localizedList(card.dietaryNotes));
  if (Array.isArray(card.commonVariations)) field(copy.variations, card.commonVariations.map(v => [string(v?.label), string(v?.note)].filter(Boolean).join(': ')).filter(Boolean).join(' · '));
  detail.append(definitions, el('p', 'source-note', string(card.visualDisclaimer) || copy.sourceNote));
}

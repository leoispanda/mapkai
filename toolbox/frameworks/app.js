import { frameworks } from './data.js?v=0.1.291';
import { diagramNotes, drawDiagram } from './diagrams.js?v=0.1.291';
import { references, categories, evidence } from './references.js?v=0.1.291';
import { categoryStories } from './stories.js?v=0.1.291';
import { frameworkStoryFor } from './framework-stories.js?v=0.1.253';

const language = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
const zh = language === 'zh';
const $ = id => document.getElementById(id);
const copy = zh ? {
  use: '什么时候用', source: '出处与文献', expand: '放大读图', open: '放大并探索', count: n => `${n} 张框架图 · 5 类用途`, results: (n, total) => `找到 ${n} / ${total} 张框架图`, back: '相关图', original: '原始链接',
  groupCount: n => `${n} 个框架`, fiction: '生活寓言 · 虚构故事', readStory: '读框架故事', readCategoryStory: '读本类故事', closeStory: '收起故事', storyConcept: '读完，再看框架', mapping: '故事与框架', boundary: '这个比喻的边界', reflection: '留一个问题', toDiagram: '看对应框架图', storySource: '概念依据 · 对应底部参考文献', calculation: '把故事里的账算清楚',
} : {
  use: 'When to use it', source: 'Sources & references', expand: 'Explore diagram', open: 'Explore', count: n => `${n} diagrams · 5 categories`, results: (n, total) => `${n} of ${total} diagrams`, back: 'Related diagrams', original: 'Source link',
  groupCount: n => `${n} frameworks`, fiction: 'Everyday fable · Fictional story', readStory: 'Read framework story', readCategoryStory: 'Read category story', closeStory: 'Close the story', storyConcept: 'After the story: explore the idea', mapping: 'The story and the framework', boundary: 'Where the analogy ends', reflection: 'A question to take away', toDiagram: 'See the framework diagram', storySource: 'Concept sources · References below', calculation: 'Work through the numbers',
};
try { localStorage.setItem('mapkaiLanguageV2', language); } catch {}
const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};
const calculationLabels = zh ? {
  formula: '公式', note: '说明', lower: '较低结果', higher: '较高结果', discountRate: '折现率', benefitPresentValue: '收益现值', originalPaymentPresentValue: '原付款现值', originalNpv: '原方案 NPV', stagedPaymentPresentValue: '分期付款现值', stagedNpv: '分期方案 NPV',
} : {
  formula: 'Formula', note: 'Note', lower: 'Lower result', higher: 'Higher result', discountRate: 'Discount rate', benefitPresentValue: 'Benefit present value', originalPaymentPresentValue: 'Original payment present value', originalNpv: 'Original NPV', stagedPaymentPresentValue: 'Staged payment present value', stagedNpv: 'Staged NPV',
};
function calculationText(calculation) {
  if (typeof calculation === 'string') return calculation;
  return Object.entries(calculation).map(([key, value]) => `${calculationLabels[key] || key}: ${value}`).join('\n');
}
const normalized = value => value.normalize('NFKC').toLocaleLowerCase().trim();
let opener;
let storyOpener;
let activeCategory = 'all';
const openStories = new Set();
const refById = new Map(references.map((ref,i) => [ref.id, { ...ref, number:i+1 }]));
const categoryFor = item => evidence[item.id].category;
const orderedFrameworks = categories.flatMap(category => frameworks.filter(item => categoryFor(item) === category.id));
function jump(id) {
  if ($('diagram-dialog').open) { opener = undefined; $('diagram-dialog').close(); }
  if (frameworks.some(item => item.id === id)) {
    activeCategory = 'all'; $('framework-search').value = ''; updateCategories(); render();
  }
  history.pushState(null, '', `#${id}`);
  focusTarget(id);
}
function focusTarget(id) {
  requestAnimationFrame(() => {
    const target = $(id);
    if (!target) return;
    target.setAttribute('tabindex','-1'); target.focus({ preventScroll:true }); target.scrollIntoView({ block:'start' });
  });
}
function localLink(label,id,className='') {
  const link = node('a',className,label); link.href = `#${id}`;
  link.onclick = event => { event.preventDefault(); jump(id); };
  return link;
}
function citationLinks(ids, label = copy.source) {
  const wrap = node('div','framework-citations');
  wrap.append(node('span','citation-label',label));
  ids.forEach(id => {
    const ref = refById.get(id);
    const link = localLink(`[${ref.number}] ${ref.authors} · ${ref.year}`,`ref-${id}`);
    link.setAttribute('aria-label',`${copy.source} ${ref.number}: ${ref.title}`);
    wrap.append(link);
  });
  return wrap;
}
function citations(item) { return citationLinks(evidence[item.id].refs); }
function bibliography() {
  $('reference-list').replaceChildren(...references.map(ref => {
    const entry = node('li','reference-entry'); entry.id = `ref-${ref.id}`;
    entry.append(node('p','reference-author',`${ref.authors} (${ref.year}).`), node('h3','',ref.title), node('p','reference-publication',ref.publication),node('p','reference-note',ref.note[language]));
    if (ref.url) {
      const link = node('a','reference-external',`${copy.original} ↗`); link.href = ref.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label',`${copy.original}: ${ref.title}`); entry.append(link);
    }
    const backs = node('div','reference-backlinks'); backs.append(node('span','',`${copy.back} · `));
    frameworks.filter(item => evidence[item.id].refs.includes(ref.id)).forEach(item => backs.append(localLink(item.name[language],item.id)));
    entry.append(backs); return entry;
  }));
}
function updateCategories() {
  $('category-filters').replaceChildren(...categories.map(category => {
    const n = category.id === 'all' ? frameworks.length : frameworks.filter(item => categoryFor(item) === category.id).length;
    const button = node('button','category-filter',`${category.name[language]} ${n}`); button.type = 'button';
    button.dataset.category = category.id; button.setAttribute('aria-pressed',String(activeCategory === category.id));
    button.onclick = () => {
      activeCategory = category.id;
      $('category-filters').querySelectorAll('button').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.category === activeCategory)));
      render();
    };
    return button;
  }));
}
function openDiagram(item, button) {
  opener = button;
  const spec = diagramNotes[item.id];
  $('diagram-title').textContent = item.name[language];
  $('diagram-basis').textContent = spec.basis[language];
  $('diagram-reading').textContent = spec.reading[language];
  $('diagram-references').replaceChildren(citations(item));
  const explain = part => {
    $('diagram-part-title').textContent = part.label[language].replaceAll('|', zh ? '' : ' ');
    $('diagram-part-body').textContent = part.body[language];
  };
  const svg = drawDiagram(item.id, language, { interactive: true, onSelect: explain, instance: 'detail' });
  $('diagram-canvas').replaceChildren(svg);
  $('diagram-canvas').scrollLeft = 0;
  $('diagram-dialog').showModal();
  svg.querySelector('[data-part]')?.dispatchEvent(new Event('click'));
}
$('diagram-close').onclick = () => $('diagram-dialog').close();
$('diagram-dialog').addEventListener('close', () => { if (opener?.isConnected) opener.focus({ preventScroll: true }); });
$('diagram-dialog').addEventListener('click', event => { if (event.target === $('diagram-dialog')) $('diagram-dialog').close(); });
function localizedCategoryStory(story) {
  return {
    framework: story.framework,
    title: story.title[language],
    teaser: story.teaser[language],
    paragraphs: story.paragraphs.map(paragraph => paragraph[language]),
    concept: story.concept[language],
    explanation: story.explanation[language],
    mapping: story.mapping.map(line => line[language]),
    boundary: story.boundary[language],
    reflection: story.reflection[language],
    refs: story.refs,
    ...(story.calculation ? { calculation: story.calculation[language] } : {}),
  };
}
function storyFor(item) {
  const specific = frameworkStoryFor(item.id, language);
  if (specific) return { story: specific, item, fallback: false };
  const categoryStory = localizedCategoryStory(categoryStories[categoryFor(item)]);
  return { story: categoryStory, item: frameworks.find(candidate => candidate.id === categoryStory.framework) || item, fallback: true };
}
function openFrameworkStory(item, button) {
  storyOpener = button;
  const { story, item: storyItem, fallback } = storyFor(item);
  $('story-dialog').dataset.fallback = String(fallback);
  $('story-label').textContent = copy.fiction;
  $('story-framework-name').textContent = storyItem.name[language];
  $('story-title').textContent = story.title;
  $('story-narrative').replaceChildren(node('p', 'story-lead', story.teaser), ...story.paragraphs.map(paragraph => node('p', '', paragraph)));
  $('story-concept').textContent = story.concept;
  $('story-explanation').textContent = story.explanation;
  const calculation = $('story-calculation');
  calculation.hidden = !story.calculation;
  calculation.replaceChildren();
  if (story.calculation) calculation.append(node('h4', '', copy.calculation), node('p', 'story-calculation', calculationText(story.calculation)));
  $('story-mapping').replaceChildren(...story.mapping.map(line => node('li', '', line)));
  $('story-boundary').textContent = story.boundary;
  $('story-reflection').textContent = story.reflection;
  $('story-references').replaceChildren(citationLinks(story.refs, copy.storySource));
  const diagramLink = $('story-diagram-link');
  diagramLink.textContent = `${copy.toDiagram} · ${storyItem.name[language]} ↓`;
  diagramLink.href = `#${storyItem.id}`;
  diagramLink.onclick = event => { event.preventDefault(); $('story-dialog').close(); jump(storyItem.id); };
  $('story-insight').open = false;
  $('story-dialog').showModal();
}
$('story-close').onclick = () => $('story-dialog').close();
$('story-dialog').addEventListener('close', () => { if (storyOpener?.isConnected) storyOpener.focus({ preventScroll: true }); });
$('story-dialog').addEventListener('click', event => { if (event.target === $('story-dialog')) $('story-dialog').close(); });
function card(item) {
  const article = node('article', 'framework-card'); article.id = item.id;
  const headingId = `${item.id}-title`; article.setAttribute('aria-labelledby', headingId);
  const top = node('div', 'framework-card-top');
  top.append(node('span', 'framework-number', String(orderedFrameworks.indexOf(item) + 1).padStart(2, '0')), node('span','framework-category',categories.find(c => c.id === categoryFor(item)).name[language]), node('span', 'framework-credit', !zh && item.creditEn ? item.creditEn : item.credit));
  const title = node('h4', '', item.name[language]); title.id = headingId;
  const alias = zh ? item.alias : item.alias.replace(' · 三道防线', '');
  const diagram = node('button', 'diagram-preview'); diagram.type = 'button';
  diagram.setAttribute('aria-label', `${copy.open}: ${item.name[language]}`);
  diagram.setAttribute('aria-haspopup', 'dialog');
  diagram.append(drawDiagram(item.id, language), node('span', 'diagram-expand', `${copy.expand} ↗`));
  diagram.onclick = () => openDiagram(item, diagram);
  const use = node('div', 'framework-use'); use.append(node('span', '', copy.use), node('p', '', item.use[language]));
  const foot = node('div', 'framework-card-foot');
  foot.append(node('p', 'diagram-basis', diagramNotes[item.id].basis[language]));
  foot.append(citations(item));
  const resolvedStory = storyFor(item);
  const storyButton = node('button', 'framework-story-button', resolvedStory.fallback ? copy.readCategoryStory : copy.readStory);
  storyButton.type = 'button';
  storyButton.setAttribute('aria-haspopup', 'dialog');
  storyButton.setAttribute('aria-label', `${resolvedStory.fallback ? copy.readCategoryStory : copy.readStory}: ${resolvedStory.item.name[language]}`);
  storyButton.onclick = () => openFrameworkStory(item, storyButton);
  article.append(top, title, node('p', 'framework-alias', alias), diagram, node('p', 'framework-summary', item.summary[language]), use, storyButton, foot);
  return article;
}
function storyIntro(category) {
  const story = categoryStories[category.id];
  const details = node('details', 'framework-story'); details.id = `story-${category.id}`;
  details.open = openStories.has(category.id);
  const summary = node('summary', 'story-summary');
  const heading = node('span', 'story-heading');
  heading.append(node('span', 'story-label', copy.fiction), node('span', 'story-title', story.title[language]), node('span', 'story-teaser', story.teaser[language]));
  const action = node('span', 'story-action');
  action.append(node('span', 'story-read', `${copy.readStory} ＋`), node('span', 'story-close', `${copy.closeStory} −`));
  summary.append(heading, action);
  const body = node('div', 'story-body');
  const narrative = node('div', 'story-narrative');
  story.paragraphs.forEach(paragraph => narrative.append(node('p', '', paragraph[language])));
  const insight = node('details', 'story-insight');
  insight.append(node('summary', 'story-next', copy.storyConcept));
  const explanation = node('div', 'story-explanation');
  explanation.append(node('h4', '', story.concept[language]), node('p', '', story.explanation[language]));
  if (story.calculation) explanation.append(node('h5', '', copy.calculation), node('p', 'story-calculation', story.calculation[language]));
  explanation.append(node('h5', '', copy.mapping));
  const mapping = node('ul', 'story-mapping'); story.mapping.forEach(line => mapping.append(node('li', '', line[language])));
  explanation.append(mapping, node('h5', '', copy.boundary), node('p', '', story.boundary[language]), node('h5', '', copy.reflection), node('p', 'story-reflection', story.reflection[language]));
  const item = frameworks.find(item => item.id === story.framework);
  insight.append(explanation);
  body.append(narrative, insight, localLink(`${copy.toDiagram} · ${item.name[language]} ↓`, item.id, 'story-diagram-link'));
  const source = node('div', 'story-sources'); source.append(citationLinks(story.refs, copy.storySource));
  details.append(summary, body, source);
  details.addEventListener('toggle', () => {
    if (!details.isConnected) return;
    if (details.open) openStories.add(category.id); else openStories.delete(category.id);
  });
  return details;
}
function group(category, items, showStory) {
  const section = node('section', 'framework-group'); section.id = `category-${category.id}`; section.dataset.group = category.id;
  const headingId = `${section.id}-title`; section.setAttribute('aria-labelledby', headingId);
  const header = node('div', 'group-heading');
  const title = node('h3', '', category.name[language]); title.id = headingId;
  header.append(node('span', 'group-number', String(categories.indexOf(category)).padStart(2, '0')), title, node('span', 'group-count', copy.groupCount(items.length)));
  section.append(header, node('p', 'group-question', categoryStories[category.id].question[language]));
  if (showStory) section.append(storyIntro(category));
  const grid = node('div', 'framework-grid'); grid.append(...items.map(card)); section.append(grid);
  return section;
}
function render() {
  const query = normalized($('framework-search').value);
  const words = query.split(/\s+/).filter(Boolean);
  const shown = frameworks.filter(item => {
    if (activeCategory !== 'all' && categoryFor(item) !== activeCategory) return false;
    const parts = diagramNotes[item.id].parts.flatMap(p => [p.label.zh, p.label.en, p.body.zh, p.body.en]);
    const haystack = normalized([item.name.zh, item.name.en, item.alias, item.credit, item.creditEn || '', item.summary.zh, item.summary.en, item.use.zh, item.use.en, ...item.tags.zh, ...item.tags.en, ...parts].join(' '));
    return words.every(word => haystack.includes(word));
  });
  const groups = categories.filter(category => category.id !== 'all').flatMap(category => {
    const items = shown.filter(item => categoryFor(item) === category.id);
    return items.length ? [group(category, items, !query)] : [];
  });
  $('framework-list').replaceChildren(...groups);
  $('framework-count').textContent = query || activeCategory !== 'all' ? copy.results(shown.length, frameworks.length) : copy.count(frameworks.length);
  $('framework-empty').hidden = shown.length > 0;
}
$('framework-search').addEventListener('input', render);
$('clear-search').onclick = () => { $('framework-search').value = ''; activeCategory = 'all'; updateCategories(); render(); $('framework-search').focus(); };
bibliography(); updateCategories();
render();
function restoreHash() {
  const id = location.hash.slice(1);
  if (frameworks.some(item => item.id === id)) { activeCategory = 'all'; $('framework-search').value = ''; updateCategories(); render(); }
  if (id) focusTarget(id);
}
addEventListener('hashchange',restoreHash);
restoreHash();

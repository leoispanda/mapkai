export const MAX_STORY_CHARS = 30000;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function storyContext(draft, saved = []) {
  const seen = new Set();
  const items = [draft, ...saved].filter(item => {
    const text = item.story.trim();
    if (!text || seen.has(text)) return false;
    seen.add(text);
    return true;
  }).map(item => ({ title: item.title.trim() || '我的经历', story: item.story.trim() }));
  const size = items.reduce((total, item) => total + item.story.length, 0);
  if (size > MAX_STORY_CHARS) throw new Error('本期资料超过 30,000 字，请缩短内容或少选几份故事。');
  return { items, size };
}

export function appendImportedStories(current, documents) {
  const additions = documents.map(({ name, text }) => {
    const clean = text.replace(/\r\n?/g, '\n').replace(/\u0000/g, '').trim();
    if (!clean) throw new Error(`「${name}」没有可读取的文字。扫描图片请先转成文字，再导入。`);
    return `【${name}】\n${clean}`;
  });
  const combined = [current.trim(), ...additions].filter(Boolean).join('\n\n');
  if (combined.length > MAX_STORY_CHARS) throw new Error('导入后超过 30,000 字。请分成几份较短的经历导入；现有内容已保留。');
  return combined;
}

export function buildSessionContext(settings, materials) {
  // Supplied prose stays in one data object, separate from host instructions.
  return JSON.stringify({
    preferred_name: settings.name || 'my friend', english_level: settings.level,
    mode: settings.mode, scenario: settings.scenario, episode_focus: settings.focus,
    topics_to_avoid: settings.boundaries, duration_minutes: settings.minutes,
    stories: materials.items,
  }, null, 2).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

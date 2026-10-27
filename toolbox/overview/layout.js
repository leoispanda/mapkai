// Keep each subject and its fields together in a separate, visible territory.
const area = box => box.w * box.h;
const overlaps = (a, b) => a.x < b.x + b.w - .001 && a.x + a.w > b.x + .001 && a.y < b.y + b.h - .001 && a.y + a.h > b.y + .001;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const inside = (box, bounds) => box.x >= bounds.x - .001 && box.y >= bounds.y - .001 && box.x + box.w <= bounds.x + bounds.w + .001 && box.y + box.h <= bounds.y + bounds.h + .001;

function occupy(free, box) {
  const split = [];
  for (const rect of free) {
    if (!overlaps(rect, box)) { split.push(rect); continue; }
    if (box.x > rect.x) split.push({ x: rect.x, y: rect.y, w: box.x - rect.x, h: rect.h });
    if (box.x + box.w < rect.x + rect.w) split.push({ x: box.x + box.w, y: rect.y, w: rect.x + rect.w - box.x - box.w, h: rect.h });
    if (box.y > rect.y) split.push({ x: rect.x, y: rect.y, w: rect.w, h: box.y - rect.y });
    if (box.y + box.h < rect.y + rect.h) split.push({ x: rect.x, y: box.y + box.h, w: rect.w, h: rect.y + rect.h - box.y - box.h });
  }
  return split.filter((rect, index) => rect.w > .001 && rect.h > .001 && !split.some((other, j) => j !== index && inside(rect, other) && (area(other) > area(rect) + .001 || j < index)));
}

function validMetric(m) { return m && Number.isFinite(m.w) && Number.isFinite(m.h) && m.w > 0 && m.h > 0; }

function variants(category, bounds, gap, measureCategory) {
  const children = category.children || [], padding = Math.max(1, gap * .6), columnGap = gap * 1.2, rowGap = gap * .6;
  const widest = children.length ? Math.max(...children.map(child => child.m.w)) : category.m.w;
  const output = [];
  const maxColumns = Math.min(Math.max(1, children.length), 6);
  for (let columns = 1; columns <= maxColumns; columns++) {
    const contentWidth = widest * columns + columnGap * (columns - 1);
    const width = Math.max(contentWidth, Math.min(category.m.w, bounds.w - padding * 2));
    const m = measureCategory ? measureCategory(category, width) : category.m;
    if (!validMetric(m) || m.w > width + .001) continue;
    const columnHeights = Array(columns).fill(0), columnCounts = Array(columns).fill(0), fieldOffsets = [];
    children.map((child, index) => ({ child, index })).sort((a, b) => b.child.m.h - a.child.m.h || a.index - b.index).forEach(({ child, index }) => {
      const column = columnHeights.indexOf(Math.min(...columnHeights)), row = columnCounts[column]++;
      const top = columnHeights[column] + (row ? rowGap : 0);
      fieldOffsets[index] = { column, row, top }; columnHeights[column] = top + child.m.h;
    });
    const contentHeight = Math.max(0, ...columnHeights);
    const h = padding * 2 + m.h + (children.length ? gap + contentHeight : 0);
    const w = width + padding * 2;
    if (w <= bounds.w + .001 && h <= bounds.h + .001 && w / h >= .42 && w / h <= 10) output.push({ w, h, m, columns, padding, columnGap, rowGap, fieldOffsets, widest });
  }
  return output;
}

function candidates(free, choices, target, bounds, gap, step) {
  const output = [], totalArea = area(bounds), byGeometry = new Map();
  for (const variant of choices) {
    const w = variant.w + gap, h = variant.h + gap;
    const best = [];
    for (const rect of free) {
      if (rect.w + .001 < w || rect.h + .001 < h) continue;
      const nearX = clamp(target.x - w / 2, rect.x, rect.x + rect.w - w);
      const nearY = clamp(target.y - h / 2, rect.y, rect.y + rect.h - h);
      const xs = [rect.x, rect.x + rect.w - w, nearX, rect.x + (rect.w - w) / 2];
      const ys = [rect.y, rect.y + rect.h - h, nearY, rect.y + (rect.h - h) / 2];
      const points = [[nearX, nearY], [xs[3], ys[3]], [xs[0], ys[0]], [xs[1], ys[0]], [xs[0], ys[1]], [xs[1], ys[1]], [nearX, ys[0]], [nearX, ys[1]], [xs[0], nearY], [xs[1], nearY]];
      for (const [x, y] of points) {
        const cx = x + w / 2, cy = y + h / 2;
        const distance = ((cx - target.x) / bounds.w) ** 2 + ((cy - target.y) / bounds.h) ** 2;
        const unused = (area(rect) - w * h) / totalArea;
        const shortSide = Math.min(rect.w - w, rect.h - h) / Math.min(bounds.w, bounds.h);
        // Space efficiency leads; the angle target keeps the familiar subject order.
        const aspect = Math.abs(Math.log((w / h) / 1.6));
        const floating = Number(Math.abs(x - rect.x) > .001 && Math.abs(x + w - rect.x - rect.w) > .001) + Number(Math.abs(y - rect.y) > .001 && Math.abs(y + h - rect.y - rect.h) > .001);
        const score = unused * .34 + shortSide * .08 + distance * (.08 + .08 * step) + w * h / totalArea * .12 + aspect * .035 + floating * .012;
        best.push({ x, y, w, h, variant, score });
      }
    }
    best.sort((a, b) => a.score - b.score || a.y - b.y || a.x - b.x);
    for (const candidate of best.slice(0, 3)) {
      const key = [candidate.x, candidate.y, w, h].map(v => v.toFixed(3)).join('|');
      if (!byGeometry.has(key)) { byGeometry.set(key, true); output.push(candidate); }
    }
  }
  return output.sort((a, b) => a.score - b.score || a.y - b.y || a.x - b.x).slice(0, 14);
}

/**
 * Inputs contain measured node boxes; this function never reads the DOM.
 * Group boundaries are part of the visual ownership contract: render groups
 * before links/nodes so every field is visibly inside its own subject's tile.
 */
export function packAtlas({ root, categories, bounds, gap = 4, measureCategory, beamWidth = 32 }) {
  if (!validMetric(root?.m) || !validMetric(bounds) || !Number.isFinite(bounds.x) || !Number.isFinite(bounds.y) || !Number.isFinite(gap) || gap < 0) throw new TypeError('Invalid atlas dimensions');
  if (!Array.isArray(categories) || categories.some(category => !validMetric(category.m) || (category.children || []).some(child => !validMetric(child.m)))) throw new TypeError('Invalid atlas nodes');
  const rootX = bounds.x + bounds.w / 2, rootY = bounds.y + bounds.h / 2;
  const rootBox = { x: rootX - root.m.w / 2 - gap, y: rootY - root.m.h / 2 - gap, w: root.m.w + gap * 2, h: root.m.h + gap * 2 };
  if (!inside(rootBox, bounds)) return null;
  const ordered = categories.map((category, index) => {
    const choices = variants(category, bounds, gap, measureCategory);
    const angle = -Math.PI / 2 + (index + .5) / Math.max(1, categories.length) * Math.PI * 2;
    return { category, choices, target: { x: rootX + Math.cos(angle) * bounds.w * .34, y: rootY + Math.sin(angle) * bounds.h * .34 }, weight: Math.min(...choices.map(area)) };
  });
  if (ordered.some(item => !item.choices.length)) return null;
  // Reject an impossible font size before searching: every tile and the root
  // need at least this much non-overlapping area, regardless of placement.
  const minimumArea = area(rootBox) + ordered.reduce((sum, item) => sum + Math.min(...item.choices.map(choice => (choice.w + gap) * (choice.h + gap))), 0);
  if (minimumArea > area(bounds) + .001) return null;
  ordered.sort((a, b) => b.weight - a.weight || String(a.category.id).localeCompare(String(b.category.id)));
  let states = [{ free: occupy([bounds], rootBox), chosen: [], score: 0 }];
  for (let index = 0; index < ordered.length; index++) {
    const item = ordered[index], next = [];
    for (const state of states) {
      for (const candidate of candidates(state.free, item.choices, item.target, bounds, gap, index / Math.max(1, ordered.length - 1))) {
        const free = occupy(state.free, candidate);
        if (ordered.slice(index + 1).some(remaining => !remaining.choices.some(choice => free.some(rect => rect.w + .001 >= choice.w + gap && rect.h + .001 >= choice.h + gap)))) continue;
        next.push({ free, chosen: [...state.chosen, { ...candidate, category: item.category }], score: state.score + candidate.score });
      }
    }
    if (!next.length) return null;
    next.sort((a, b) => a.score - b.score);
    // Different internal column counts remain alternatives until a whole atlas fits.
    const seen = new Set();
    states = next.filter(state => {
      const key = state.chosen.map(choice => [choice.x, choice.y, choice.w, choice.h].map(v => v.toFixed(2)).join(',')).join(';');
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).slice(0, Math.max(1, beamWidth));
  }
  const winner = states[0], positions = new Map([[root.id, { x: rootX, y: rootY, m: root.m, parentId: null }]]), groups = [];
  for (const choice of winner.chosen) {
    const { category, variant: v } = choice, x = choice.x + gap / 2, y = choice.y + gap / 2;
    const headerBottom = y + v.padding + v.m.h, contentTop = headerBottom + gap;
    positions.set(category.id, { x: x + v.w / 2, y: y + v.padding + v.m.h / 2, m: v.m, parentId: root.id, groupId: category.id });
    const columnStarts = Array.from({ length: v.columns }, (_, i) => x + v.padding + i * (v.widest + v.columnGap));
    const rowStarts = [...new Set(v.fieldOffsets.map(offset => contentTop + offset.top))].sort((a, b) => a - b);
    (category.children || []).forEach((child, i) => {
      const { column, row, top } = v.fieldOffsets[i];
      positions.set(child.id, { x: columnStarts[column] + child.m.w / 2, y: contentTop + top + child.m.h / 2, m: child.m, parentId: category.id, groupId: category.id, column, row });
    });
    groups.push({ id: category.id, x, y, w: v.w, h: v.h, headerBottom, contentTop, columnStarts, rowStarts, columns: v.columns, padding: v.padding });
  }
  groups.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  return { positions, groups };
}

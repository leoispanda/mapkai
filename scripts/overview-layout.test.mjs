import assert from 'node:assert/strict';
import test from 'node:test';
import { packAtlas } from '../toolbox/overview/layout.js';

const overlaps = (a, b) => a.x < b.x + b.w - .001 && a.x + a.w > b.x + .001 && a.y < b.y + b.h - .001 && a.y + a.h > b.y + .001;
const box = node => ({ x: node.x - node.m.w / 2, y: node.y - node.m.h / 2, w: node.m.w, h: node.m.h });
function fixture(counts, { width = 1200, height = 410, scale = 1 } = {}) {
  return {
    root: { id: 'root', m: { w: 48 * scale, h: 48 * scale } }, bounds: { x: -width / 2, y: -height / 2, w: width, h: height }, gap: 4 * scale,
    categories: counts.map((count, i) => ({ id: `subject-${String(i).padStart(2, '0')}`, m: { w: 105 * scale, h: (20 + i % 3 * 8) * scale }, children: Array.from({ length: count }, (_, j) => ({ id: `field-${i}-${j}`, m: { w: 90 * scale, h: (24 + j % 3 * 7) * scale } })) })),
    measureCategory(category, width) { return { ...category.m, w: Math.min(width, category.m.w), h: width > 200 * scale ? 20 * scale : category.m.h }; },
  };
}

test('complete atlas keeps every field in a separate parent territory without overlaps', () => {
  const input = fixture([3, 4, 10, 6, 8, 9, 3, 12, 5, 10, 10]);
  const result = packAtlas(input); assert.ok(result, 'The complete 80-field atlas should fit');
  assert.equal(result.positions.size, 92); assert.equal(result.groups.length, 11);
  for (let i = 0; i < result.groups.length; i++) {
    const group = result.groups[i];
    assert.ok(!overlaps(group, box(result.positions.get('root'))));
    for (const other of result.groups.slice(i + 1)) assert.equal(overlaps(group, other), false);
    const children = input.categories.find(category => category.id === group.id).children;
    for (const child of children) {
      const position = result.positions.get(child.id), b = box(position);
      assert.equal(position.parentId, group.id);
      assert.ok(b.x >= group.x && b.y >= group.y && b.x + b.w <= group.x + group.w + .001 && b.y + b.h <= group.y + group.h + .001);
      assert.ok(b.y >= group.contentTop);
    }
    const nodes = [result.positions.get(group.id), ...children.map(child => result.positions.get(child.id))];
    for (let j = 0; j < nodes.length; j++) for (const other of nodes.slice(j + 1)) assert.equal(overlaps(box(nodes[j]), box(other)), false);
  }
});

test('variable label heights and highly imbalanced subjects remain deterministic and grouped', () => {
  const input = fixture([1, 1, 2, 17, 3, 4, 1, 25, 2, 2, 2], { width: 1440, height: 650 });
  const a = packAtlas(input), b = packAtlas(input); assert.ok(a); assert.ok(b);
  assert.deepEqual([...a.positions], [...b.positions]); assert.deepEqual(a.groups, b.groups);
  assert.equal(a.positions.size, 72);
  for (const category of input.categories) for (const child of category.children) assert.equal(a.positions.get(child.id).groupId, category.id);
});

test('notebook viewport retains all 80 fields with compact group headers', () => {
  const input = fixture([3, 4, 10, 6, 8, 9, 3, 12, 5, 10, 10], { width: 1230, height: 390 });
  const result = packAtlas(input); assert.ok(result);
  assert.equal(result.positions.size, 92);
  for (const group of result.groups) {
    assert.ok(group.x >= input.bounds.x && group.y >= input.bounds.y);
    assert.ok(group.x + group.w <= input.bounds.x + input.bounds.w && group.y + group.h <= input.bounds.y + input.bounds.h);
  }
});

test('impossible space fails explicitly instead of omitting nodes or returning overlap', () => {
  assert.equal(packAtlas(fixture([20, 20, 20], { width: 120, height: 100 })), null);
});

test('parent headers use the actual group width and preserve caller-owned metrics', () => {
  const input = fixture([8, 6, 4], { width: 1000, height: 600 }), before = structuredClone(input.categories), widths = [];
  input.measureCategory = (category, width) => { widths.push(width); return { w: width, h: 24 }; };
  const result = packAtlas(input); assert.ok(result); assert.ok(widths.some(width => width > 200));
  assert.deepEqual(input.categories, before);
});

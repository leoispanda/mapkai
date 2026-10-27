import test from 'node:test';
import assert from 'node:assert/strict';
import { routeLinks, nodeBounds, segmentIntersectsRect } from '../toolbox/overview/link-routing.js';

const node = (id, kind, x, y, w = 80, h = 30, parent) => ({ id, kind, x, y, m: { w, h }, ...(parent ? { parent: { id: parent } } : {}) });

function assertClear(nodes, routes) {
  const byId = new Map(nodes.map(item => [item.id, item]));
  for (const [id, route] of routes) {
    assert.equal(route.blocked, false, `Route ${id} must exist`);
    assert.ok(route.points.length > 1, `Route ${id} must have endpoints`);
    const target = byId.get(id), parent = byId.get(target.parent.id);
    for (let index = 1; index < route.points.length; index++) {
      const a = route.points[index - 1], b = route.points[index];
      assert.ok(a[0] === b[0] || a[1] === b[1], `Route ${id} must be orthogonal`);
      for (const obstacle of nodes) {
        // The root's start segment crosses only the blank margin around its circle.
        if (obstacle === parent && parent.kind === 'root' && index === 1) continue;
        assert.equal(segmentIntersectsRect(a, b, nodeBounds(obstacle)), false, `${id} enters ${obstacle.id}`);
      }
    }
  }
}

test('the trunk enters an upper category below its title, not at the top ring', () => {
  const nodes = [node('root', 'root', 0, 100, 56, 56), node('category', 'category', 0, 0, 100, 60, 'root')];
  const routes = routeLinks(nodes, { rootRadius: 24 });
  assert.deepEqual(routes.get('category').points[0], [0, 76]);
  assert.deepEqual(routes.get('category').points.at(-1), [0, 30]);
  assertClear(nodes, routes);
});

test('category branches leave the appropriate top, bottom or side edge', () => {
  for (const [x, y, expected] of [[0, 100, [0, 30]], [0, -100, [0, -30]], [150, 0, [50, 0]], [-150, 0, [-50, 0]]]) {
    const nodes = [node('category', 'category', 0, 0, 100, 60), node('field', 'field', x, y, 60, 20, 'category')];
    const routes = routeLinks(nodes);
    assert.deepEqual(routes.get('field').points[0], expected);
    assertClear(nodes, routes);
  }
});

test('a branch detours around an unrelated label instead of crossing it', () => {
  const nodes = [node('category', 'category', 0, 0, 80, 30), node('blocker', 'field', 0, 60, 100, 28), node('field', 'field', 0, 130, 80, 25, 'category')];
  const routes = routeLinks(nodes);
  const path = routes.get('field');
  assert.ok(path.points.length >= 4, 'The blocked direct route needs a detour');
  assert.ok(path.points.some(point => Math.abs(point[0]) > 50), 'The route must leave the blocker width');
  assertClear(nodes, routes);
});

test('root start segments move outward from the circle in every direction', () => {
  for (const [x, y] of [[0, -180], [0, 180], [-180, 0], [180, 0]]) {
    const nodes = [node('root', 'root', 0, 0, 64, 64), node('category', 'category', x, y, 90, 50, 'root')];
    const routes = routeLinks(nodes, { rootRadius: 28 });
    const [start, next] = routes.get('category').points;
    assert.equal(Math.hypot(...start), 28);
    assert.ok(start[0] * (next[0] - start[0]) + start[1] * (next[1] - start[1]) > 0);
    assertClear(nodes, routes);
  }
});

test('all ninety-one edges in an imbalanced eleven-subject atlas avoid every label box', () => {
  const counts = [3, 4, 10, 7, 8, 10, 3, 13, 5, 7, 10];
  const nodes = [node('root', 'root', -80, 0, 56, 56)];
  let fieldIndex = 0;
  counts.forEach((count, index) => {
    const x = index % 4 * 300 + 200 + index * .013, y = Math.floor(index / 4) * 300 + 50 + index * .017, id = `category-${index}`;
    nodes.push(node(id, 'category', x, y, 120 + index * .31, 36 + index * .17, 'root'));
    for (let field = 0; field < count; field++) {
      const serial = fieldIndex++;
      nodes.push(node(`field-${serial}`, 'field', x + (field % 2 ? 64 : -64) + Math.sin(serial) * 1.7, y + 52 + Math.floor(field / 2) * 28 + Math.cos(serial), 90 + serial % 7 * 2.03, 18 + serial % 5 * .91, id));
    }
  });
  assert.equal(nodes.length, 92);
  const routes = routeLinks(nodes, { rootRadius: 24 });
  assert.equal(routes.size, 91);
  assertClear(nodes, routes);
  const repeat = routeLinks(nodes, { rootRadius: 24 });
  assert.deepEqual(repeat, routes, 'The same geometry must produce the same paths');
});

test('unroutable overlapping input is reported instead of drawing through a label', () => {
  const nodes = [node('category', 'category', 0, 0, 30, 20), node('cover', 'field', 0, 0, 200, 200), node('field', 'field', 300, 0, 60, 20, 'category')];
  const route = routeLinks(nodes).get('field');
  assert.equal(route.blocked, true);
  assert.equal(route.path, '');
  assert.deepEqual(route.points, []);
});

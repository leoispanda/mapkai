// Route map edges around measured node boxes. Run once for each layout, never on zoom.
const EPSILON = 1e-7;

export function nodeBounds(node, padding = 0) {
  return {
    id: node.id,
    left: node.x - node.m.w / 2 - padding,
    right: node.x + node.m.w / 2 + padding,
    top: node.y - node.m.h / 2 - padding,
    bottom: node.y + node.m.h / 2 + padding,
  };
}

// Touching a box boundary is allowed; entering its interior is not.
export function segmentIntersectsRect(a, b, rect) {
  if (Math.abs(a[1] - b[1]) < EPSILON) {
    return a[1] > rect.top + EPSILON && a[1] < rect.bottom - EPSILON
      && Math.max(Math.min(a[0], b[0]), rect.left) < Math.min(Math.max(a[0], b[0]), rect.right) - EPSILON;
  }
  if (Math.abs(a[0] - b[0]) < EPSILON) {
    return a[0] > rect.left + EPSILON && a[0] < rect.right - EPSILON
      && Math.max(Math.min(a[1], b[1]), rect.top) < Math.min(Math.max(a[1], b[1]), rect.bottom) - EPSILON;
  }
  throw new Error('Map routing expects orthogonal segments');
}

function simplify(points) {
  const output = [];
  for (const point of points) {
    const previous = output.at(-1);
    if (previous && Math.abs(point[0] - previous[0]) < EPSILON && Math.abs(point[1] - previous[1]) < EPSILON) continue;
    while (output.length > 1) {
      const a = output.at(-2), b = output.at(-1);
      if ((Math.abs(a[0] - b[0]) < EPSILON && Math.abs(b[0] - point[0]) < EPSILON)
        || (Math.abs(a[1] - b[1]) < EPSILON && Math.abs(b[1] - point[1]) < EPSILON)) output.pop();
      else break;
    }
    output.push(point);
  }
  return output;
}

class MinHeap {
  constructor() { this.items = []; }
  push(state, priority) {
    const item = { state, priority }, items = this.items;
    let index = items.length; items.push(item);
    while (index) {
      const parent = (index - 1) >> 1;
      if (items[parent].priority <= priority) break;
      items[index] = items[parent]; index = parent;
    }
    items[index] = item;
  }
  pop() {
    const items = this.items, first = items[0], last = items.pop();
    if (items.length) {
      let index = 0;
      while (index * 2 + 1 < items.length) {
        let child = index * 2 + 1;
        if (child + 1 < items.length && items[child + 1].priority < items[child].priority) child++;
        if (last.priority <= items[child].priority) break;
        items[index] = items[child]; index = child;
      }
      items[index] = last;
    }
    return first;
  }
  get length() { return this.items.length; }
}

function gridFor(nodes, padding) {
  const boxes = nodes.map(node => nodeBounds(node, padding));
  const xs = new Set(), ys = new Set();
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index], box = boxes[index];
    xs.add(box.left); xs.add(node.x); xs.add(box.right);
    ys.add(box.top); ys.add(node.y); ys.add(box.bottom);
  }
  const extent = Math.max(2, padding * 2);
  xs.add(Math.min(...xs) - extent); xs.add(Math.max(...xs) + extent);
  ys.add(Math.min(...ys) - extent); ys.add(Math.max(...ys) + extent);
  const x = [...xs].sort((a, b) => a - b), y = [...ys].sort((a, b) => a - b);
  const nx = x.length, ny = y.length;
  const xIndex = new Map(x.map((value, index) => [value, index]));
  const yIndex = new Map(y.map((value, index) => [value, index]));
  const horizontal = new Uint8Array((nx - 1) * ny), vertical = new Uint8Array(nx * (ny - 1));
  for (const box of boxes) {
    const left = xIndex.get(box.left), right = xIndex.get(box.right), top = yIndex.get(box.top), bottom = yIndex.get(box.bottom);
    for (let row = top + 1; row < bottom; row++) horizontal.fill(1, row * (nx - 1) + left, row * (nx - 1) + right);
    for (let row = top; row < bottom; row++) vertical.fill(1, row * nx + left + 1, row * nx + right);
  }
  function neighbors(point, visit) {
    const column = point % nx, row = Math.floor(point / nx);
    if (column && !horizontal[row * (nx - 1) + column - 1]) visit(point - 1, 1, x[column] - x[column - 1]);
    if (column + 1 < nx && !horizontal[row * (nx - 1) + column]) visit(point + 1, 1, x[column + 1] - x[column]);
    if (row && !vertical[(row - 1) * nx + column]) visit(point - nx, 2, y[row] - y[row - 1]);
    if (row + 1 < ny && !vertical[row * nx + column]) visit(point + nx, 2, y[row + 1] - y[row]);
  }
  const components = new Int32Array(nx * ny).fill(-1), queue = new Int32Array(nx * ny);
  let component = 0;
  for (let seed = 0; seed < components.length; seed++) {
    if (components[seed] !== -1) continue;
    let head = 0, tail = 1; queue[0] = seed; components[seed] = component;
    while (head < tail) neighbors(queue[head++], next => {
      if (components[next] === -1) { components[next] = component; queue[tail++] = next; }
    });
    component++;
  }
  return { boxes, x, y, nx, ny, neighbors, components, pointIndex: point => yIndex.get(point[1]) * nx + xIndex.get(point[0]) };
}

function portsFor(node, other, box, rootRadius) {
  const left = node.x - node.m.w / 2, right = node.x + node.m.w / 2;
  const top = node.y - node.m.h / 2, bottom = node.y + node.m.h / 2;
  const root = node.kind === 'root', radius = rootRadius || Math.min(node.m.w, node.m.h) / 2;
  const ports = [
    { side: 'left', anchor: [root ? node.x - radius : left, node.y], escape: [box.left, node.y] },
    { side: 'right', anchor: [root ? node.x + radius : right, node.y], escape: [box.right, node.y] },
    { side: 'top', anchor: [node.x, root ? node.y - radius : top], escape: [node.x, box.top] },
    { side: 'bottom', anchor: [node.x, root ? node.y + radius : bottom], escape: [node.x, box.bottom] },
  ];
  const dx = other.x - node.x, dy = other.y - node.y;
  const horizontal = Math.abs(dx) / Math.max(1, node.m.w) >= Math.abs(dy) / Math.max(1, node.m.h);
  const preferred = horizontal ? dx < 0 ? 'left' : 'right' : dy < 0 ? 'top' : 'bottom';
  return ports.sort((a, b) => Number(b.side === preferred) - Number(a.side === preferred)
    || Math.abs(a.escape[0] - other.x) + Math.abs(a.escape[1] - other.y) - Math.abs(b.escape[0] - other.x) - Math.abs(b.escape[1] - other.y));
}

export function routeLinks(nodes, { rootRadius, gap = 4, padding = Math.max(.15, Math.min(.8, gap * .15)) } = {}) {
  const output = new Map();
  if (nodes.length < 2) return output;
  const grid = gridFor(nodes, padding), byId = new Map(nodes.map((node, index) => [node.id, { node, box: grid.boxes[index] }]));
  const length = grid.nx * grid.ny * 3;
  const distance = new Float64Array(length), previous = new Int32Array(length), seen = new Uint32Array(length), closed = new Uint32Array(length);
  let stamp = 0;
  function findPath(start, end) {
    const startPoint = grid.pointIndex(start), endPoint = grid.pointIndex(end);
    if (grid.components[startPoint] !== grid.components[endPoint]) return null;
    const heuristic = point => Math.abs(grid.x[point % grid.nx] - end[0]) + Math.abs(grid.y[Math.floor(point / grid.nx)] - end[1]);
    const heap = new MinHeap(), startState = startPoint * 3;
    stamp++; seen[startState] = stamp; distance[startState] = 0; previous[startState] = -1;
    heap.push(startState, heuristic(startPoint));
    let target = -1;
    while (heap.length) {
      const state = heap.pop().state;
      if (closed[state] === stamp) continue;
      closed[state] = stamp;
      const point = Math.floor(state / 3), axis = state % 3;
      if (point === endPoint) { target = state; break; }
      grid.neighbors(point, (nextPoint, nextAxis, step) => {
        const next = nextPoint * 3 + nextAxis;
        const cost = distance[state] + step + (axis && axis !== nextAxis ? Math.max(1, gap * .5) : 0);
        if (seen[next] !== stamp || cost < distance[next] - EPSILON) {
          seen[next] = stamp; distance[next] = cost; previous[next] = state;
          heap.push(next, cost + heuristic(nextPoint));
        }
      });
    }
    if (target === -1) return null;
    const points = [];
    for (let state = target; state !== -1; state = previous[state]) {
      const point = Math.floor(state / 3);
      points.push([grid.x[point % grid.nx], grid.y[Math.floor(point / grid.nx)]]);
    }
    return points.reverse();
  }
  for (const node of nodes) {
    if (!node.parent) continue;
    const parentId = typeof node.parent === 'string' ? node.parent : node.parent.id;
    const parentEntry = byId.get(parentId), targetEntry = byId.get(node.id);
    if (!parentEntry) throw new Error(`Missing map parent: ${parentId}`);
    const parent = parentEntry.node;
    const available = (entry, other) => portsFor(entry.node, other, entry.box, rootRadius).filter(port => !grid.boxes.some(box => box.id !== entry.node.id && segmentIntersectsRect(port.anchor, port.escape, box)));
    const starts = available(parentEntry, node), ends = available(targetEntry, parent);
    let routed;
    for (const start of starts) {
      for (const end of ends) {
        const middle = findPath(start.escape, end.escape);
        if (!middle) continue;
        const points = simplify([start.anchor, ...middle, end.anchor]);
        const path = points.map((point, index) => `${index ? 'L' : 'M'}${point[0]},${point[1]}`).join('');
        routed = { path, points, blocked: false }; break;
      }
      if (routed) break;
    }
    // Omitting an impossible edge is safer than drawing it through a title; callers must audit this count.
    output.set(node.id, routed || { path: '', points: [], blocked: true });
  }
  return output;
}

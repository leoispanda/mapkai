import * as THREE from './assets/vendor/three/three.module.js';

const TAU = Math.PI * 2;
const hash = (x, y, seed) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 41.7) * 43758.5453;
  return n - Math.floor(n);
};
function patchNoise(x, z, seed) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(hash(ix, iz, seed), hash(ix + 1, iz, seed), u),
    THREE.MathUtils.lerp(hash(ix, iz + 1, seed), hash(ix + 1, iz + 1, seed), u), v);
}

function curvedStem(mobile) {
  const geometry = new THREE.CylinderGeometry(.029, .065, 1.3, mobile ? 6 : 8, mobile ? 4 : 7);
  const positions = geometry.getAttribute('position'), colors = [];
  for (let i = 0; i < positions.count; i++) {
    const t = (positions.getY(i) + .65) / 1.3;
    positions.setXYZ(i, positions.getX(i) + .15 * t * t, t * 1.3,
      positions.getZ(i) + .045 * Math.sin(t * Math.PI));
    const shade = .77 + .16 * t + .055 * Math.cos(t * TAU * 7);
    colors.push(shade, shade, shade);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

// Each frond has a curved central rib and separate, folded pairs of leaflets.
function featheredCrown(mobile) {
  const points = [], colors = [];
  const fronds = mobile ? 6 : 7, pairs = mobile ? 6 : 9, ribSteps = mobile ? 6 : 8;
  function triangle(a, b, c, shade) {
    points.push(...a, ...b, ...c);
    for (let i = 0; i < 3; i++) colors.push(shade, shade, shade);
  }
  for (let frond = 0; frond < fronds; frond++) {
    const angle = frond / fronds * TAU + Math.sin(frond * 2.8) * .08;
    const length = 1.11 + hash(frond, 1, 7.3) * .23;
    const dx = Math.cos(angle), dz = Math.sin(angle), sx = -dz, sz = dx;
    const crownY = 1.3 + hash(frond, 2, 7.3) * .07;
    const point = (t, side = 0) => [
      .15 + dx * t * length + sx * side,
      crownY + Math.sin(t * Math.PI) * .30 - t * t * .40,
      dz * t * length + sz * side,
    ];
    for (let j = 0; j < ribSteps; j++) {
      const t = j / ribSteps, next = (j + 1) / ribSteps;
      const width = .012 * (1 - t * .7), endWidth = .012 * (1 - next * .7);
      triangle(point(t, -width), point(next, -endWidth), point(t, width), .91);
      triangle(point(t, width), point(next, -endWidth), point(next, endWidth), .91);
    }
    for (let j = 0; j < pairs; j++) {
      const t = .14 + j / (pairs - 1) * .77;
      const span = Math.pow(Math.sin(t * Math.PI), .8) * (.27 + hash(j, frond, 11.3) * .07);
      for (const side of [-1, 1]) {
        const base = point(t, side * .009), ahead = .10 + .035 * hash(j, frond, 3.1);
        const tip = [base[0] + sx * side * span + dx * ahead,
          base[1] - .08 - span * .26,
          base[2] + sz * side * span + dz * ahead];
        const mid = base.map((value, axis) => THREE.MathUtils.lerp(value, tip[axis], .48));
        const width = (mobile ? .090 : .075) * Math.sin(t * Math.PI);
        const left = [mid[0] - dx * width, mid[1] - .018, mid[2] - dz * width];
        const right = [mid[0] + dx * width, mid[1] - .018, mid[2] + dz * width];
        const ridge = [mid[0], mid[1] + .019, mid[2]];
        const shade = .82 + hash(j, frond + side, 5.8) * .18;
        triangle(base, left, ridge, shade);
        triangle(left, tip, ridge, shade);
        triangle(base, ridge, right, Math.min(1, shade + .06));
        triangle(ridge, tip, right, Math.min(1, shade + .06));
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function foliageLobe(mobile) {
  const geometry = new THREE.IcosahedronGeometry(.61, mobile ? 1 : 2);
  const positions = geometry.getAttribute('position'), normals = geometry.getAttribute('normal'), colors = [];
  const normal = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const variation = .91 + .12 * Math.sin(x * 8.1 + z * 4.2) * Math.cos(y * 6.7 - x * 3.2);
    positions.setXYZ(i, x * variation, y * variation * .84 + Math.sin(x * 9 + z * 5) * .025, z * variation);
    // Smooth radial normals preserve an organic silhouette without faceting each little lobe.
    normal.set(positions.getX(i), positions.getY(i) / (.84 * .84), positions.getZ(i)).normalize();
    normals.setXYZ(i, normal.x, normal.y, normal.z);
    const shade = .85 + (y / .61 + 1) * .06;
    colors.push(shade, shade, shade);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

function instances(name, geometry, material, records) {
  const mesh = new THREE.InstancedMesh(geometry, material, Math.max(1, records.length));
  const dummy = new THREE.Object3D();
  mesh.name = name;
  for (const [index, record] of records.entries()) {
    dummy.position.set(...record.position);
    dummy.rotation.set(...record.rotation);
    dummy.scale.set(...record.scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
    mesh.setColorAt(index, record.color);
  }
  mesh.count = records.length;
  mesh.visible = records.length > 0;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  if (records.length) { mesh.computeBoundingBox(); mesh.computeBoundingSphere(); }
  return mesh;
}

export function createVegetation(spec, mobile, terrainHeight) {
  const group = new THREE.Group(); group.name = 'island-vegetation';
  const targetCount = spec.code === '05' ? (mobile ? 54 : 78) : spec.radius > 1.8 ? (mobile ? 24 : 34) : (mobile ? 10 : 15);
  const plants = [], stems = [], palms = [], crowns = [];
  const greenDeep = new THREE.Color('#285c49'), greenLight = new THREE.Color('#658b55');
  const barkDark = new THREE.Color('#947452'), barkLight = new THREE.Color('#baa07a');
  for (let attempt = 0; attempt < targetCount * 65 && plants.length < targetCount; attempt++) {
    const x = (hash(attempt, 3, spec.seed) * 2 - 1) * spec.radius * spec.sx;
    const z = (hash(8, attempt, spec.seed) * 2 - 1) * spec.radius * spec.sz;
    const y = terrainHeight(x, z, spec);
    if (y < .22 || y > Math.max(.70, spec.height * .60) || patchNoise(x * .82, z * .82, spec.seed + 8) < .29) continue;
    const slope = Math.hypot(terrainHeight(x + .06, z, spec) - y, terrainHeight(x, z + .06, spec) - y) / .06;
    if (slope > 1.05) continue;
    const palm = y < .44 || (y < Math.max(.85, spec.height * .48) && hash(attempt, 4, spec.seed) > .58);
    const size = palm ? .32 + hash(attempt, 2, spec.seed) * .12 : .27 + hash(attempt, 2, spec.seed) * .12;
    // Keep roots inland; a palm's crown may naturally lean over the beach.
    const footprint = size * .30;
    let inland = true;
    for (let j = 0; j < 8; j++) {
      if (terrainHeight(x + Math.cos(j / 8 * TAU) * footprint, z + Math.sin(j / 8 * TAU) * footprint, spec) < .015) { inland = false; break; }
    }
    if (!inland || plants.some(p => Math.hypot(p.x - x, p.z - z) < (p.size + size) * .53)) continue;
    plants.push({ x, z, size });
    const yaw = hash(attempt, 5, spec.seed) * TAU;
    const pigment = greenDeep.clone().lerp(greenLight, hash(attempt, 6, spec.seed) * .70);
    stems.push({ position: [x, y - .025, z], rotation: [0, yaw, 0], scale: [size * (palm ? 1 : 1.12), size * (palm ? 1 : .88), size],
      color: barkDark.clone().lerp(barkLight, hash(attempt, 7, spec.seed)) });
    if (palm) {
      palms.push({ position: [x, y - .025, z], rotation: [0, yaw, 0], scale: [size, size, size], color: pigment.clone().lerp(greenLight, .18) });
    } else {
      const lobes = mobile ? 3 : 4;
      for (let lobe = 0; lobe < lobes; lobe++) {
        const angle = yaw + lobe / lobes * TAU + hash(attempt, lobe + 10, spec.seed) * .6;
        const reach = lobe === 0 ? .08 : .28 + hash(attempt, lobe + 15, spec.seed) * .12;
        const lobeSize = lobe === 0 ? 1.07 : .74 + hash(attempt, lobe + 20, spec.seed) * .23;
        const crownY = lobe === 0 ? 1.48 : 1.03 + hash(attempt, lobe + 25, spec.seed) * .28;
        crowns.push({ position: [x + Math.cos(angle) * reach * size, y + crownY * size, z + Math.sin(angle) * reach * size],
          rotation: [hash(attempt, lobe, 4.1) * .3, angle, hash(lobe, attempt, 4.1) * .22],
          scale: [size * lobeSize, size * lobeSize * (lobe === 0 ? 1.10 : .88), size * lobeSize * (.85 + hash(lobe, attempt, spec.seed) * .22)],
          color: pigment.clone().lerp(greenLight, lobe === 0 ? .16 : hash(attempt, lobe, spec.seed) * .10) });
      }
    }
  }
  group.add(instances('tree-stems', curvedStem(mobile), new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: .97 }), stems));
  group.add(instances('palm-feathers', featheredCrown(mobile), new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: .86, side: THREE.DoubleSide }), palms));
  group.add(instances('forest-crowns', foliageLobe(mobile), new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: .95 }), crowns));
  group.userData.plantCount = plants.length;
  group.userData.palmCount = palms.length;
  return group;
}

function shoreStone() {
  const geometry = new THREE.DodecahedronGeometry(1, 0);
  const positions = geometry.getAttribute('position'), colors = [];
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const deformation = .91 + Math.sin(x * 5.1 + y * 3.7) * Math.cos(z * 4.9) * .14;
    positions.setXYZ(i, x * deformation, Math.max(-.56, y * (.83 + x * .14)), z * deformation * .87);
    const shade = .77 + (y + 1) * .105;
    colors.push(shade, shade, shade);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function createShoreRocks(spec, mobile, terrainHeight, shoreRadius) {
  const records = [], clusters = spec.radius > 2.8 ? (mobile ? 3 : 4) : spec.radius > 1.8 ? (mobile ? 2 : 3) : 2;
  const dry = new THREE.Color('#d8cab0'), dryShade = new THREE.Color('#b4ac95');
  const wet = new THREE.Color('#82948c'), wetLight = new THREE.Color('#b1b4a2');
  for (let cluster = 0; cluster < clusters; cluster++) {
    const angle = (cluster / clusters + hash(cluster, 30, spec.seed) * .23) * TAU + spec.seed;
    const offshore = cluster === clusters - 1 && hash(cluster, 31, spec.seed) > .38;
    const radius = shoreRadius(angle, spec.seed) * spec.radius * (offshore ? 1.045 : .88 + hash(cluster, 32, spec.seed) * .085);
    const anchorX = Math.cos(angle) * radius * spec.sx, anchorZ = Math.sin(angle) * radius * spec.sz;
    const count = mobile ? 3 : 3 + Math.floor(hash(cluster, 33, spec.seed) * 3);
    for (let i = 0; i < count; i++) {
      const spread = i === 0 ? 0 : .11 + hash(i, cluster, spec.seed + 4) * .19;
      const scatterAngle = angle + hash(i, cluster, spec.seed + 5) * TAU;
      const x = anchorX + Math.cos(scatterAngle) * spread, z = anchorZ + Math.sin(scatterAngle) * spread;
      const ground = terrainHeight(x, z, spec), inWater = ground < -.01;
      const localRadius = Math.hypot(x / spec.sx, z / spec.sz) / spec.radius;
      if (localRadius > shoreRadius(Math.atan2(z / spec.sz, x / spec.sx), spec.seed) + .19) continue;
      const size = (i === 0 ? .18 + hash(i, cluster, spec.seed) * .075 : .065 + hash(i, cluster, spec.seed) * .085) * Math.min(1.12, Math.sqrt(spec.radius / 1.65));
      const height = size * (.72 + hash(i, cluster, spec.seed + 2) * .45);
      const color = inWater ? wet.clone().lerp(wetLight, hash(i, cluster, spec.seed + 6)) : dryShade.clone().lerp(dry, hash(i, cluster, spec.seed + 6));
      records.push({ position: [x, Math.max(-.065, ground - .028) + height * .23, z],
        rotation: [(hash(i, cluster, spec.seed + 7) - .5) * .25, scatterAngle, (hash(i, cluster, spec.seed + 8) - .5) * .23],
        scale: [size * (1 + hash(i, cluster, spec.seed + 9) * .4), height, size * (.72 + hash(i, cluster, spec.seed + 10) * .3)], color });
    }
  }
  return instances('shore-rock-clusters', shoreStone(), new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: .94, flatShading: true }), records);
}

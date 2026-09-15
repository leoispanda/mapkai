import * as THREE from 'three';

export const ISLANDS = [
  { code: '00', x: 8.0, z: -6.8, radius: 2.05, height: 1.9, seed: 1.1 },
  { code: '01', x: .1, z: -8.6, radius: 2.35, height: 2.7, seed: 2.8 },
  { code: '02', x: -7.2, z: -6.2, radius: 2.05, height: 2.7, seed: 3.9 },
  { code: '03', x: -9.6, z: -.2, radius: 2.1, height: 2.3, seed: 4.4 },
  { code: '04', x: 8.8, z: -.1, radius: 2.35, height: 1.8, seed: 5.7 },
  { code: '05', x: -.4, z: -.1, radius: 4.15, height: 3.8, seed: 6.8 },
  { code: '06', x: 8.4, z: 6.0, radius: 2.35, height: 2.9, seed: 7.9 },
  { code: '07', x: 2.4, z: 8.3, radius: 2.4, height: 3.0, seed: 8.5 },
  { code: '08', x: -8.0, z: 5.7, radius: 2.1, height: 1.2, seed: 9.2 },
  { code: '09', x: -3.7, z: 8.4, radius: 1.8, height: 1.8, seed: 10.8 },
  { code: '10', x: 9.7, z: 11.4, radius: 1.6, height: 1.0, seed: 11.3 },
];
const clamp = THREE.MathUtils.clamp;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function hash(x, y, seed) { const n = Math.sin(x * 127.1 + y * 311.7 + seed * 41.7) * 43758.5453; return n - Math.floor(n); }
function noise(x, y, seed) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix, iy, seed), hash(ix + 1, iy, seed), u), THREE.MathUtils.lerp(hash(ix, iy + 1, seed), hash(ix + 1, iy + 1, seed), u), v);
}
function fbm(x, y, seed) { return noise(x, y, seed) * .57 + noise(x * 2.03, y * 2.03, seed) * .28 + noise(x * 4.09, y * 4.09, seed) * .15; }
export function shoreRadius(angle, seed) { return .88 + .13 * Math.sin(angle * 3 + seed) + .09 * Math.sin(angle * 5 - seed * 2) + .045 * Math.cos(angle * 9 + seed); }
export function terrainHeight(x, z, spec) {
  const lx = x / spec.radius, lz = z / spec.radius;
  const rotation = spec.seed * .9;
  const nx = lx * Math.cos(rotation) - lz * Math.sin(rotation), nz = lx * Math.sin(rotation) + lz * Math.cos(rotation);
  const d = Math.hypot(lx, lz) / shoreRadius(Math.atan2(lz, lx), spec.seed);
  if (d > 1.025) return -.16;
  const edge = smooth(0, .27, 1 - d);
  const n = fbm(nx * 5.4 + spec.seed, nz * 5.4, spec.seed);
  const ridge = 1 - Math.abs(n * 2 - 1);
  const peaks = Math.max(
    Math.exp(-((nx + .18) ** 2 * 9 + (nz + .13) ** 2 * 11)),
    Math.exp(-((nx - .23) ** 2 * 14 + (nz - .13) ** 2 * 16)) * .78,
    Math.exp(-((nx + .32) ** 2 * 18 + (nz - .33) ** 2 * 17)) * .57,
  );
  const stratum = .09 + smooth(.91, .57, d) * .55 + n * .09;
  const ridgeDetail = 1 - Math.abs(noise(nx * 17.5, nz * 17.5, spec.seed) * 2 - 1);
  const mountain = peaks * spec.height * (.24 + .57 * ridge ** 2 + .19 * ridgeDetail);
  const detail = (noise(nx * 32, nz * 32, spec.seed) - .5) * .21 * peaks;
  const geological = stratum + mountain + detail;
  const band = .24;
  const fraction = geological / band - Math.floor(geological / band);
  const terraces = (Math.floor(geological / band) + smooth(.2, .8, fraction)) * band;
  return THREE.MathUtils.lerp(geological, terraces, .48) * edge - .035;
}

const sand = new THREE.Color('#f8e6be');
const grass = new THREE.Color('#359a62');
const grassLight = new THREE.Color('#8abe65');
const rock = new THREE.Color('#708c75');
const rockWarm = new THREE.Color('#a6aa83');
const dirt = new THREE.Color('#8b9462');

export function createIsland(spec, mobile) {
  const group = new THREE.Group(); group.position.set(spec.x, 0, spec.z); group.userData.code = spec.code;
  const segments = spec.code === '05' ? 118 : (mobile ? 70 : 88);
  const extent = spec.radius * 1.18;
  const points = [], indices = [];
  for (let j = 0; j <= segments; j++) {
    for (let i = 0; i <= segments; i++) {
      const jitterX = (hash(i, j, spec.seed) - .5) * extent / segments * .65;
      const jitterZ = (hash(j, i, spec.seed + 3) - .5) * extent / segments * .65;
      const x = -extent + i / segments * extent * 2 + jitterX;
      const z = -extent + j / segments * extent * 2 + jitterZ;
      points.push(x, terrainHeight(x, z, spec), z);
    }
  }
  const stride = segments + 1;
  for (let j = 0; j < segments; j++) for (let i = 0; i < segments; i++) {
    const a = j * stride + i, b = a + 1, c = a + stride, d = c + 1;
    if (Math.max(points[a * 3 + 1], points[b * 3 + 1], points[c * 3 + 1], points[d * 3 + 1]) < -.1) continue;
    indices.push(a, c, b, b, c, d);
  }
  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3)); geometry.setIndex(indices);
  geometry = geometry.toNonIndexed(); geometry.computeVertexNormals();
  const positions = geometry.getAttribute('position'), normals = geometry.getAttribute('normal'), colors = [];
  let peakHeight = 0;
  for (let i = 0; i < positions.count; i += 3) {
    const h = (positions.getY(i) + positions.getY(i + 1) + positions.getY(i + 2)) / 3;
    const x = positions.getX(i), z = positions.getZ(i), slope = normals.getY(i);
    const n = noise(x * 2, z * 2, spec.seed), color = new THREE.Color();
    peakHeight = Math.max(peakHeight, h);
    if (h < .23) color.copy(sand).multiplyScalar(.92 + n * .13);
    else {
      color.copy(grass).lerp(grassLight, n * .75);
      const stone = clamp((.55 - slope) * 1.6, 0, .64) * smooth(.45, 1.15, h);
      color.lerp(rock.clone().lerp(rockWarm, n * .6), Math.max(stone, smooth(spec.height * .95, spec.height * 1.22, h) * .48));
      color.lerp(dirt, smooth(.1, .3, h) * (1 - smooth(.3, .5, h)) * .15);
      color.multiplyScalar(.82 + n * .25 + noise(x * 22, z * 22, spec.seed) * .12);
    }
    for (let j = 0; j < 3; j++) colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .93, flatShading: true });
  const stageUniform = { value: 1 };
  // Fine surface variation keeps rock faces and sand readable when the camera approaches.
  material.onBeforeCompile = shader => {
    shader.uniforms.uTerrainStage = stageUniform;
    shader.vertexShader = 'varying vec3 vTerrainPoint;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvTerrainPoint = transformed;');
    shader.fragmentShader = `
      varying vec3 vTerrainPoint;
      uniform float uTerrainStage;
      float terrainGrain(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
      float terrainTexture(vec3 p) { vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(terrainGrain(i),terrainGrain(i+vec3(1,0,0)),f.x),mix(terrainGrain(i+vec3(0,1,0)),terrainGrain(i+vec3(1,1,0)),f.x),f.y),mix(mix(terrainGrain(i+vec3(0,0,1)),terrainGrain(i+vec3(1,0,1)),f.x),mix(terrainGrain(i+vec3(0,1,1)),terrainGrain(i+vec3(1,1,1)),f.x),f.y),f.z); }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      float surfaceGrain = terrainTexture(vTerrainPoint*35.)*.6 + terrainTexture(vTerrainPoint*82.)*.4;
      diffuseColor.rgb = mix(vec3(.56,.45,.28), diffuseColor.rgb, uTerrainStage);
      diffuseColor.rgb *= .78 + surfaceGrain*.42;
    `);
  };
  const terrain = new THREE.Mesh(geometry, material); terrain.castShadow = true; terrain.receiveShadow = true; terrain.userData.code = spec.code;
  group.add(terrain);
  const trees = createTrees(spec, mobile); group.add(trees);
  const stones = createRocks(spec); group.add(stones);
  const ringPoints = [];
  for (let i = 0; i <= 128; i++) { const a = i / 128 * Math.PI * 2, r = shoreRadius(a, spec.seed) * spec.radius + .27; ringPoints.push(new THREE.Vector3(Math.cos(a) * r, .04, Math.sin(a) * r)); }
  const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPoints), new THREE.LineBasicMaterial({ color: '#f38b78', transparent: true, opacity: .8, depthWrite: false }));
  ring.visible = false; group.add(ring);
  return { spec, group, terrain, trees, stones, ring, stageUniform, peakHeight, scaleTarget: 1, positionTarget: 0 };
}
// A shared frond mesh keeps the shoreline palms lightweight and visibly tropical.
function palmFronds() {
  const points = [];
  for (let leaf = 0; leaf < 7; leaf++) {
    const angle = leaf / 7 * Math.PI * 2;
    function point(t, side) {
      const distance = t * 1.18;
      const width = Math.sin(Math.PI * t) * .14 * side;
      const y = 1.28 + Math.sin(Math.PI * t) * .26 - t * t * .32 - Math.abs(width) * .35;
      return [Math.cos(angle) * distance - Math.sin(angle) * width, y, Math.sin(angle) * distance + Math.cos(angle) * width];
    }
    for (let j = 0; j < 8; j++) {
      const t = j / 8, next = (j + 1) / 8;
      for (const side of [-1, 1]) {
        points.push(...point(t, 0), ...point(next, 0), ...point(t, side));
        points.push(...point(t, side), ...point(next, 0), ...point(next, side));
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  geometry.computeVertexNormals();
  return geometry;
}
function createTrees(spec, mobile) {
  const trees = new THREE.Group();
  const count = spec.code === '05' ? (mobile ? 180 : 320) : (mobile ? 65 : 120);
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(.04, .065, 1.3, 5), new THREE.MeshStandardMaterial({ color: '#ae8d60', roughness: 1 }), count);
  const palms = new THREE.InstancedMesh(palmFronds(), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .8, side: THREE.DoubleSide }), count);
  const canopy = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.66, 1), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .9, flatShading: true }), count);
  const dummy = new THREE.Object3D(); let used = 0;
  for (let attempt = 0; attempt < count * 35 && used < count; attempt++) {
    const x = (hash(attempt, 3, spec.seed) * 2 - 1) * spec.radius, z = (hash(8, attempt, spec.seed) * 2 - 1) * spec.radius;
    const y = terrainHeight(x, z, spec);
    if (y < .22 || y > Math.max(1.25, spec.height * .73)) continue;
    const slope = Math.hypot(terrainHeight(x + .07, z, spec) - y, terrainHeight(x, z + .07, spec) - y) / .07;
    if (slope > 1.2) continue;
    const palm = y < .63 || hash(attempt, 4, spec.seed) > .78;
    const size = palm ? .24 + hash(attempt, 2, spec.seed) * .13 : .16 + hash(attempt, 2, spec.seed) * .16;
    dummy.rotation.set(0, hash(attempt, 5, spec.seed) * 6.28, 0);
    dummy.position.set(x, y + size * .65, z); dummy.scale.setScalar(size); dummy.updateMatrix(); trunk.setMatrixAt(used, dummy.matrix);
    dummy.position.y = y; dummy.scale.setScalar(palm ? size : 0); dummy.updateMatrix(); palms.setMatrixAt(used, dummy.matrix);
    dummy.position.y = y + size * 1.06; dummy.scale.set(size * (palm ? 0 : 1.15), size * (palm ? 0 : 1.0), size * (palm ? 0 : 1.15)); dummy.updateMatrix(); canopy.setMatrixAt(used, dummy.matrix);
    const color = new THREE.Color().setHSL(.32 + hash(attempt, 6, spec.seed) * .09, .48 + hash(attempt, 7, spec.seed) * .17, .27 + hash(attempt, 8, spec.seed) * .12);
    palms.setColorAt(used, color.clone().lerp(new THREE.Color('#83bd52'), .3)); canopy.setColorAt(used, color); used++;
  }
  for (const mesh of [trunk, palms, canopy]) { mesh.count = used; mesh.castShadow = true; mesh.receiveShadow = true; mesh.instanceMatrix.needsUpdate = true; trees.add(mesh); }
  return trees;
}
function createRocks(spec) {
  const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: '#c1b898', roughness: .85, flatShading: true }), 20);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 20; i++) {
    const angle = hash(i, 20, spec.seed) * Math.PI * 2, r = (shoreRadius(angle, spec.seed) + .03 + hash(i, 21, spec.seed) * .1) * spec.radius;
    const size = .05 + hash(i, 22, spec.seed) * .10;
    dummy.position.set(Math.cos(angle) * r, .015, Math.sin(angle) * r); dummy.rotation.set(hash(i, 24, spec.seed) * 3, angle, .3); dummy.scale.set(size, size * 1.5, size * .8); dummy.updateMatrix(); rocks.setMatrixAt(i, dummy.matrix);
  }
  rocks.castShadow = true; rocks.receiveShadow = true; return rocks;
}

export function createOcean() {
  const uniforms = {
    uAtlasTime: { value: 0 },
    uAtlasDeep: { value: new THREE.Color('#159cbd') },
    uAtlasMiddle: { value: new THREE.Color('#31c6cf') },
    uAtlasShallow: { value: new THREE.Color('#a1efdb') },
    uAtlasIslands: { value: ISLANDS.map(s => new THREE.Vector4(s.x, s.z, s.radius, s.seed)) },
    uAtlasLevels: { value: ISLANDS.map(() => 1) },
  };
  const material = new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: .06, roughness: .48 });
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = 'varying vec3 vAtlasWorld;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvAtlasWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = `
      varying vec3 vAtlasWorld;
      uniform float uAtlasTime;
      uniform vec3 uAtlasDeep;
      uniform vec3 uAtlasMiddle;
      uniform vec3 uAtlasShallow;
      uniform vec4 uAtlasIslands[11];
      uniform float uAtlasLevels[11];
      float atlasHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float atlasNoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(atlasHash(i),atlasHash(i+vec2(1.,0.)),f.x),mix(atlasHash(i+vec2(0.,1.)),atlasHash(i+vec2(1.,1.)),f.x),f.y); }
      float atlasFbm(vec2 p) { return atlasNoise(p)*.57+atlasNoise(p*2.03)*.28+atlasNoise(p*4.07)*.15; }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      vec2 seaP = vAtlasWorld.xz;
      float shelf = 0.; float lagoon = 0.; float shore = 100.;
      for (int i=0; i<11; i++) {
        vec4 island = uAtlasIslands[i]; vec2 delta = seaP - island.xy; float a = atan(delta.y, delta.x);
        float radius = (.88 + .13*sin(a*3.+island.w)+.09*sin(a*5.-island.w*2.)+.045*cos(a*9.+island.w))*island.z;
        float d = length(delta)-radius;
        shelf = max(shelf, exp(-max(d,0.)*1.9)*uAtlasLevels[i]);
        lagoon = max(lagoon, exp(-pow(max(d,0.)/(.9+island.z*.19),2.))*uAtlasLevels[i]);
        if(uAtlasLevels[i]>.5) shore=min(shore,abs(d));
      }
      float swell = atlasFbm(seaP*1.3 + vec2(uAtlasTime*.019, -uAtlasTime*.015));
      float caustic = atlasFbm(seaP*9. + vec2(uAtlasTime*.08,uAtlasTime*.06));
      vec3 deep = uAtlasDeep, middle = uAtlasMiddle, shallow = uAtlasShallow;
      diffuseColor.rgb = mix(deep,middle,.12+swell*.27+lagoon*.43);
      diffuseColor.rgb = mix(diffuseColor.rgb,shallow,shelf*.82);
      float foam = (1.-smoothstep(.025,.17 + sin(uAtlasTime*.8+swell*3.)*.035,shore)) * (.40+.60*caustic);
      diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.91,.98,.91),foam*.58);
      diffuseColor.rgb += vec3(.025,.075,.05)*smoothstep(.54,.76,caustic)*lagoon;
      vec2 sunspot = (seaP - vec2(-13.,-11.)) / vec2(9.,15.);
      float glint = pow(.5+.5*sin(seaP.x*43.+seaP.y*21.+atlasFbm(seaP*1.3)*5.+uAtlasTime*.5),12.)*smoothstep(.52,.75,atlasNoise(seaP*15.));
      diffuseColor.rgb += vec3(.4,.36,.24)*exp(-dot(sunspot,sunspot))*glint*.07;
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      float wx = sin(vAtlasWorld.x*10.+vAtlasWorld.z*7.+atlasFbm(vAtlasWorld.xz*2.)*6.+uAtlasTime*.6)*.008 + sin(vAtlasWorld.x*24.-uAtlasTime*.4)*.004;
      float wz = cos(vAtlasWorld.z*12.-vAtlasWorld.x*6.+atlasFbm(vAtlasWorld.xz*2.)*6.+uAtlasTime*.45)*.008;
      normal = normalize(normal + vec3(wx,wz,0.));
    `);
  };
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(280, 280), material); mesh.rotation.x = -Math.PI / 2; mesh.position.y = -.008; mesh.receiveShadow = true;
  return { mesh, uniforms };
}

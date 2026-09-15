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
  const edge = smooth(0, .20, 1 - d);
  const n = fbm(nx * 5.4 + spec.seed, nz * 5.4, spec.seed);
  const ridge = 1 - Math.abs(n * 2 - 1);
  const peaks = Math.max(
    Math.exp(-((nx + .18) ** 2 * 9 + (nz + .13) ** 2 * 11)),
    Math.exp(-((nx - .23) ** 2 * 14 + (nz - .13) ** 2 * 16)) * .78,
    Math.exp(-((nx + .32) ** 2 * 18 + (nz - .33) ** 2 * 17)) * .57,
  );
  const stratum = .16 + smooth(.98, .69, d) * .69 + n * .12;
  const ridgeDetail = 1 - Math.abs(noise(nx * 17.5, nz * 17.5, spec.seed) * 2 - 1);
  const mountain = peaks * spec.height * (.24 + .57 * ridge ** 2 + .19 * ridgeDetail);
  const detail = (noise(nx * 32, nz * 32, spec.seed) - .5) * .21 * peaks;
  const geological = stratum + mountain + detail;
  const band = .24;
  const fraction = geological / band - Math.floor(geological / band);
  const terraces = (Math.floor(geological / band) + smooth(.2, .8, fraction)) * band;
  return THREE.MathUtils.lerp(geological, terraces, .48) * edge - .035;
}

const sand = new THREE.Color('#d6c695');
const grass = new THREE.Color('#688843');
const grassLight = new THREE.Color('#9da858');
const rock = new THREE.Color('#869395');
const rockWarm = new THREE.Color('#a1a498');
const snow = new THREE.Color('#d6e5e5');
const dirt = new THREE.Color('#666648');

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
    if (h < .14) color.copy(sand).multiplyScalar(.92 + n * .13);
    else {
      color.copy(grass).lerp(grassLight, n * .75);
      const stone = clamp((.78 - slope) * 1.95, 0, 1) * smooth(.30, .70, h);
      color.lerp(rock.clone().lerp(rockWarm, n * .6), Math.max(stone, smooth(spec.height * .67, spec.height * .95, h)));
      color.lerp(dirt, smooth(.1, .3, h) * (1 - smooth(.3, .5, h)) * .15);
      if (spec.height > 2.65) color.lerp(snow, smooth(spec.height * .92, spec.height * 1.08, h));
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
  const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPoints), new THREE.LineBasicMaterial({ color: '#79d6ff', transparent: true, opacity: .8, depthWrite: false }));
  ring.visible = false; group.add(ring);
  return { spec, group, terrain, trees, stones, ring, stageUniform, peakHeight, scaleTarget: 1, positionTarget: 0 };
}
function createTrees(spec, mobile) {
  const trees = new THREE.Group();
  const count = spec.code === '05' ? (mobile ? 230 : 420) : (mobile ? 85 : 165);
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(.045, .07, .9, 5), new THREE.MeshStandardMaterial({ color: '#62523d', roughness: 1 }), count);
  const crowns = new THREE.InstancedMesh(new THREE.ConeGeometry(.5, 1.7, 6), new THREE.MeshStandardMaterial({ color: '#326442', roughness: 1, flatShading: true }), count);
  const round = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.6, 1), new THREE.MeshStandardMaterial({ color: '#628440', roughness: 1, flatShading: true }), count);
  const dummy = new THREE.Object3D(); let used = 0;
  for (let attempt = 0; attempt < count * 30 && used < count; attempt++) {
    const x = (hash(attempt, 3, spec.seed) * 2 - 1) * spec.radius, z = (hash(8, attempt, spec.seed) * 2 - 1) * spec.radius;
    const y = terrainHeight(x, z, spec);
    if (y < .28 || y > Math.max(1.12, spec.height * .62)) continue;
    const slope = Math.hypot(terrainHeight(x + .07, z, spec) - y, terrainHeight(x, z + .07, spec) - y) / .07;
    if (slope > .75) continue;
    const size = .10 + hash(attempt, 2, spec.seed) * .11;
    dummy.position.set(x, y + size * .34, z); dummy.scale.set(size, size, size); dummy.rotation.set(0, hash(attempt, 5, spec.seed) * 6.28, 0); dummy.updateMatrix(); trunk.setMatrixAt(used, dummy.matrix);
    const pine = hash(attempt, 4, spec.seed) > .45;
    dummy.position.y = y + size * 1.02; dummy.scale.setScalar(pine ? size : 0); dummy.updateMatrix(); crowns.setMatrixAt(used, dummy.matrix);
    dummy.position.y = y + size * .89; dummy.scale.set(size * (pine ? 0 : 1), size * (pine ? 0 : 1.18), size * (pine ? 0 : 1)); dummy.updateMatrix(); round.setMatrixAt(used, dummy.matrix);
    const color = new THREE.Color().setHSL(.22 + hash(attempt, 6, spec.seed) * .08, .29 + hash(attempt, 7, spec.seed) * .18, .20 + hash(attempt, 8, spec.seed) * .12);
    crowns.setColorAt(used, color); round.setColorAt(used, color.clone().multiplyScalar(1.23)); used++;
  }
  for (const mesh of [trunk, crowns, round]) { mesh.count = used; mesh.castShadow = true; mesh.receiveShadow = true; mesh.instanceMatrix.needsUpdate = true; trees.add(mesh); }
  return trees;
}
function createRocks(spec) {
  const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: '#819291', roughness: .85, flatShading: true }), 20);
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
    uAtlasIslands: { value: ISLANDS.map(s => new THREE.Vector4(s.x, s.z, s.radius, s.seed)) },
    uAtlasLevels: { value: ISLANDS.map(() => 1) },
  };
  const material = new THREE.MeshStandardMaterial({ color: '#0a3c55', metalness: .38, roughness: .24 });
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = 'varying vec3 vAtlasWorld;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvAtlasWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = `
      varying vec3 vAtlasWorld;
      uniform float uAtlasTime;
      uniform vec4 uAtlasIslands[11];
      uniform float uAtlasLevels[11];
      float atlasHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float atlasNoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(atlasHash(i),atlasHash(i+vec2(1.,0.)),f.x),mix(atlasHash(i+vec2(0.,1.)),atlasHash(i+vec2(1.,1.)),f.x),f.y); }
      float atlasFbm(vec2 p) { return atlasNoise(p)*.57+atlasNoise(p*2.03)*.28+atlasNoise(p*4.07)*.15; }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      vec2 seaP = vAtlasWorld.xz;
      float shelf = 0.; float shore = 100.;
      for (int i=0; i<11; i++) {
        vec4 island = uAtlasIslands[i]; vec2 delta = seaP - island.xy; float a = atan(delta.y, delta.x);
        float radius = (.88 + .13*sin(a*3.+island.w)+.09*sin(a*5.-island.w*2.)+.045*cos(a*9.+island.w))*island.z;
        float d = length(delta)-radius;
        shelf = max(shelf, exp(-max(d,0.)*3.0)*uAtlasLevels[i]);
        if(uAtlasLevels[i]>.5) shore=min(shore,abs(d));
      }
      float swell = atlasFbm(seaP*1.3 + vec2(uAtlasTime*.019, -uAtlasTime*.015));
      float caustic = atlasFbm(seaP*9. + vec2(uAtlasTime*.08,uAtlasTime*.06));
      vec3 deep = vec3(.006,.027,.052), middle=vec3(.008,.035,.062), shallow=vec3(.025,.30,.32);
      diffuseColor.rgb = mix(deep,middle,swell*.4);
      diffuseColor.rgb = mix(diffuseColor.rgb,shallow,shelf*.69);
      float foam = (1.-smoothstep(.025,.17 + sin(uAtlasTime*.8+swell*3.)*.035,shore)) * (.40+.60*caustic);
      diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.54,.80,.78),foam*.48);
      diffuseColor.rgb += vec3(.018,.04,.04)*smoothstep(.58,.82,caustic)*shelf;
      vec2 sunspot = (seaP - vec2(-13.,-11.)) / vec2(9.,15.);
      float glint = pow(.5+.5*sin(seaP.x*43.+seaP.y*21.+atlasFbm(seaP*1.3)*5.+uAtlasTime*.5),12.)*smoothstep(.52,.75,atlasNoise(seaP*15.));
      diffuseColor.rgb += vec3(.4,.36,.24)*exp(-dot(sunspot,sunspot))*glint*.24;
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

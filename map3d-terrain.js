import * as THREE from 'three';
import { createVegetation, createShoreRocks } from './map3d-flora.js?v=0.1.291';

// A loose, asymmetric archipelago: broad foreground shores and smaller distant islets.
export const ISLANDS = [
  { code: '00', x: -12.0, z: -.8, radius: 1.30, height: .42, sx: 1.15, sz: .85, seed: 1.1 },
  { code: '01', x: -8.6, z: -5.8, radius: 1.95, height: 1.80, sx: 1.15, sz: .84, seed: 2.8 },
  { code: '02', x: -2.3, z: -7.0, radius: 1.40, height: .62, sx: 1.22, sz: .83, seed: 3.9 },
  { code: '03', x: 4.5, z: -6.0, radius: 2.15, height: 1.35, sx: 1.40, sz: .78, seed: 4.4 },
  { code: '04', x: 11.0, z: -3.4, radius: 1.35, height: .48, sx: 1.12, sz: .83, seed: 5.7 },
  { code: '05', x: -.9, z: .1, radius: 3.30, height: 2.65, sx: 1.21, sz: .88, seed: 6.8 },
  { code: '06', x: -8.4, z: 4.5, radius: 2.10, height: 1.20, sx: 1.35, sz: .73, seed: 7.9 },
  { code: '07', x: 8.0, z: 2.4, radius: 1.90, height: 1.65, sx: 1.13, sz: .81, seed: 8.5 },
  { code: '08', x: -3.9, z: 7.5, radius: 1.46, height: .30, sx: 1.35, sz: .71, seed: 9.2 },
  { code: '09', x: 2.4, z: 7.0, radius: 1.55, height: .78, sx: 1.12, sz: .85, seed: 10.8 },
  { code: '10', x: 11.6, z: 7.0, radius: 1.10, height: .52, sx: 1.13, sz: .82, seed: 11.3 },
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
export function shoreRadius(angle, seed) { return .91 + .12 * Math.sin(angle * 3 + seed) + .065 * Math.sin(angle * 5 - seed * 2) + .025 * Math.cos(angle * 9 + seed); }
export function terrainHeight(x, z, spec) {
  const lx = x / (spec.radius * spec.sx), lz = z / (spec.radius * spec.sz);
  const rotation = spec.seed * .9;
  const nx = lx * Math.cos(rotation) - lz * Math.sin(rotation), nz = lx * Math.sin(rotation) + lz * Math.cos(rotation);
  const d = Math.hypot(lx, lz) / shoreRadius(Math.atan2(lz, lx), spec.seed);
  if (d > 1.025) return -.16;
  const edge = smooth(0, .24, 1 - d);
  const n = fbm(nx * 3.1 + spec.seed, nz * 3.1, spec.seed);
  const ridge = 1 - Math.abs(n * 2 - 1);
  const peaks = Math.max(
    Math.exp(-((nx + .18) ** 2 * 9 + (nz + .13) ** 2 * 11)),
    Math.exp(-((nx - .23) ** 2 * 14 + (nz - .13) ** 2 * 16)) * .78,
    Math.exp(-((nx + .32) ** 2 * 18 + (nz - .33) ** 2 * 17)) * .57,
  );
  const stratum = .10 + smooth(.88, .57, d) * .24 + n * .035;
  const ridgeDetail = 1 - Math.abs(noise(nx * 7.5, nz * 7.5, spec.seed) * 2 - 1);
  const mountain = peaks * spec.height * (.53 + .35 * ridge ** 2 + .12 * ridgeDetail);
  // Uneven erosion channels follow the ridges instead of adding random spikes.
  const channel = Math.pow(1 - Math.abs(noise(nx * 9 + n, nz * 9, spec.seed + 12) * 2 - 1), 5);
  const detail = (fbm(nx * 19, nz * 19, spec.seed + 4) - .5) * .085 * peaks;
  const geological = stratum + mountain * (1 - channel * .12) + detail;
  const band = .24;
  const fraction = geological / band - Math.floor(geological / band);
  const terraces = (Math.floor(geological / band) + smooth(.2, .8, fraction)) * band;
  return THREE.MathUtils.lerp(geological, terraces, .16) * edge - .035;
}

const sand = new THREE.Color('#f3e5c9');
const grass = new THREE.Color('#4d8f77');
const grassLight = new THREE.Color('#a0b28b');
const rock = new THREE.Color('#d7d1b8');
const rockWarm = new THREE.Color('#eddfc1');
const dirt = new THREE.Color('#b2b18b');

export function createIsland(spec, mobile) {
  const group = new THREE.Group(); group.position.set(spec.x, 0, spec.z); group.userData.code = spec.code;
  const segments = spec.code === '05' ? (mobile ? 88 : 120) : (mobile ? 54 : 78);
  const extent = spec.radius * 1.18;
  const points = [], indices = [];
  for (let j = 0; j <= segments; j++) {
    for (let i = 0; i <= segments; i++) {
      const jitterX = (hash(i, j, spec.seed) - .5) * extent / segments * .65;
      const jitterZ = (hash(j, i, spec.seed + 3) - .5) * extent / segments * .65;
      const x = (-extent + i / segments * extent * 2 + jitterX) * spec.sx;
      const z = (-extent + j / segments * extent * 2 + jitterZ) * spec.sz;
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
  geometry.computeVertexNormals();
  const positions = geometry.getAttribute('position'), normals = geometry.getAttribute('normal'), colors = [], rockWeights = [];
  let peakHeight = 0;
  for (let i = 0; i < positions.count; i++) {
    const h = positions.getY(i);
    const x = positions.getX(i), z = positions.getZ(i), slope = normals.getY(i);
    const n = noise(x * 2, z * 2, spec.seed), color = new THREE.Color();
    peakHeight = Math.max(peakHeight, h);
    let stone = 0;
    if (h < .22) color.copy(sand).multiplyScalar(.93 + n * .09);
    else {
      color.copy(grass).lerp(grassLight, n * .6);
      stone = Math.max(clamp((.82 - slope) * 2.1, 0, .94) * smooth(.28, .78, h), smooth(spec.height * .44 + .20, spec.height * .79 + .24, h) * .94);
      color.lerp(rock.clone().lerp(rockWarm, n * .6), stone);
      color.lerp(dirt, smooth(.1, .3, h) * (1 - smooth(.3, .5, h)) * .15);
      color.multiplyScalar(.94 + n * .09);
    }
    colors.push(color.r, color.g, color.b); rockWeights.push(stone);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('rockWeight', new THREE.Float32BufferAttribute(rockWeights, 1));
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .88 });
  const stageUniform = { value: 1 };
  // Fine surface variation keeps rock faces and sand readable when the camera approaches.
  material.onBeforeCompile = shader => {
    shader.uniforms.uTerrainStage = stageUniform;
    shader.vertexShader = 'attribute float rockWeight; varying float vTerrainRock; varying vec3 vTerrainPoint;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvTerrainPoint = transformed; vTerrainRock = rockWeight;');
    shader.fragmentShader = `
      varying vec3 vTerrainPoint;
      varying float vTerrainRock;
      uniform float uTerrainStage;
      float terrainGrain(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
      float terrainTexture(vec3 p) { vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(terrainGrain(i),terrainGrain(i+vec3(1,0,0)),f.x),mix(terrainGrain(i+vec3(0,1,0)),terrainGrain(i+vec3(1,1,0)),f.x),f.y),mix(mix(terrainGrain(i+vec3(0,0,1)),terrainGrain(i+vec3(1,0,1)),f.x),mix(terrainGrain(i+vec3(0,1,1)),terrainGrain(i+vec3(1,1,1)),f.x),f.y),f.z); }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      float surfaceGrain = terrainTexture(vTerrainPoint*26.)*.65 + terrainTexture(vTerrainPoint*67.)*.35;
      float seams = smoothstep(.72,.95,terrainTexture(vTerrainPoint*vec3(8.,38.,8.)));
      float wetSand = (1.-smoothstep(.015,.15,vTerrainPoint.y))*.15;
      diffuseColor.rgb = mix(vec3(.56,.45,.28), diffuseColor.rgb, uTerrainStage);
      diffuseColor.rgb *= .92 + surfaceGrain*.14 - seams*vTerrainRock*.12 - wetSand;
    `);
    // Tiny surface relief reacts to the same lighting as the actual mountain geometry.
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      float relief = (terrainTexture(vTerrainPoint*18.)*.7 + terrainTexture(vTerrainPoint*43.)*.3) * mix(.003,.018,vTerrainRock);
      vec3 terrainDx = dFdx(-vViewPosition), terrainDy = dFdy(-vViewPosition);
      vec3 terrainR1 = cross(terrainDy,normal), terrainR2 = cross(normal,terrainDx);
      float terrainDet = dot(terrainDx,terrainR1);
      vec3 terrainGrad = sign(terrainDet)*(dFdx(relief)*terrainR1+dFdy(relief)*terrainR2);
      normal = normalize(abs(terrainDet)*normal-terrainGrad);
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `
      #include <roughnessmap_fragment>
      roughnessFactor = mix(.56,.93,smoothstep(.005,.16,vTerrainPoint.y));
    `);
  };
  const terrain = new THREE.Mesh(geometry, material); terrain.castShadow = true; terrain.receiveShadow = true; terrain.userData.code = spec.code;
  group.add(terrain);
  const trees = createVegetation(spec, mobile, terrainHeight); group.add(trees);
  const stones = createShoreRocks(spec, mobile, terrainHeight, shoreRadius); group.add(stones);
  const ringPoints = [];
  for (let i = 0; i <= 128; i++) { const a = i / 128 * Math.PI * 2, r = shoreRadius(a, spec.seed) * spec.radius + .27; ringPoints.push(new THREE.Vector3(Math.cos(a) * r * spec.sx, .04, Math.sin(a) * r * spec.sz)); }
  const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPoints), new THREE.LineBasicMaterial({ color: '#478879', transparent: true, opacity: .8, depthWrite: false }));
  ring.visible = false; group.add(ring);
  return { spec, group, terrain, trees, stones, ring, stageUniform, peakHeight, scaleTarget: 1, positionTarget: 0 };
}
export function createOcean() {
  // Match the wet shoreline to the generated terrain, whose beach ends inside the outer mesh.
  const coastScales = ISLANDS.map(spec => {
    let sum = 0;
    for (let i = 0; i < 24; i++) {
      const angle = i / 24 * Math.PI * 2, radius = shoreRadius(angle, spec.seed) * spec.radius;
      let inside = .7, outside = 1.025;
      for (let step = 0; step < 10; step++) {
        const mid = (inside + outside) / 2;
        if (terrainHeight(Math.cos(angle)*radius*spec.sx*mid, Math.sin(angle)*radius*spec.sz*mid, spec) > -.008) inside = mid;
        else outside = mid;
      }
      sum += (inside + outside) / 2;
    }
    return sum / 24;
  });
  const uniforms = {
    uAtlasTime: { value: 0 },
    uAtlasDeep: { value: new THREE.Color('#91c9df') },
    uAtlasMiddle: { value: new THREE.Color('#b5deea') },
    uAtlasShallow: { value: new THREE.Color('#d6eee8') },
    uAtlasSunlight: { value: 1 },
    uAtlasCoastScales: { value: coastScales },
    uAtlasIslands: { value: ISLANDS.map(s => new THREE.Vector4(s.x, s.z, s.radius, s.seed)) },
    uAtlasLevels: { value: ISLANDS.map(() => 1) },
    uAtlasShapes: { value: ISLANDS.map(s => new THREE.Vector2(s.sx, s.sz)) },
  };
  // Unlit water preserves the art-directed blue instead of mixing it with green ground light.
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
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
      uniform float uAtlasSunlight;
      uniform float uAtlasCoastScales[11];
      uniform vec4 uAtlasIslands[11];
      uniform float uAtlasLevels[11];
      uniform vec2 uAtlasShapes[11];
      float atlasHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float atlasNoise(vec2 p) { vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(atlasHash(i),atlasHash(i+vec2(1.,0.)),f.x),mix(atlasHash(i+vec2(0.,1.)),atlasHash(i+vec2(1.,1.)),f.x),f.y); }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      vec2 p = vAtlasWorld.xz;
      float shelf=0., lagoon=0., shore=100.;
      for (int i=0; i<11; i++) {
        vec4 island=uAtlasIslands[i]; vec2 delta=(p-island.xy)/uAtlasShapes[i]; float a=atan(delta.y,delta.x);
        float radius=(.91+.12*sin(a*3.+island.w)+.065*sin(a*5.-island.w*2.)+.025*cos(a*9.+island.w))*island.z*uAtlasCoastScales[i];
        float d=length(delta)-radius;
        shelf=max(shelf,exp(-max(d,0.)*1.7)*uAtlasLevels[i]);
        lagoon=max(lagoon,exp(-pow(max(d,0.)/(.75+island.z*.12),2.))*uAtlasLevels[i]);
        if(uAtlasLevels[i]>.5) shore=min(shore,max(d,0.));
      }
      float light=.22+.26*atlasNoise(p*.055+vec2(8.,3.));
      diffuseColor.rgb=mix(uAtlasDeep,uAtlasMiddle,light+lagoon*.18);
      diffuseColor.rgb=mix(diffuseColor.rgb,uAtlasShallow,shelf*.62);
      // A visible sandy seabed fades into blue; its caustics are strongest in the shallows.
      float seabed = atlasNoise(p*2.1+atlasNoise(p*.8)*2.);
      float shallows = shelf*smoothstep(.03,.24,shore);
      diffuseColor.rgb *= 1.-smoothstep(.58,.87,seabed)*shallows*.075;
      vec2 flow=p*3.8+vec2(uAtlasTime*.10,-uAtlasTime*.08);
      flow+=vec2(sin(flow.y*.8+uAtlasTime*.13),cos(flow.x*.7-uAtlasTime*.11))*.48;
      float caustic=pow(1.-abs(sin(flow.x+sin(flow.y)*.8)*sin(flow.y)),16.);
      diffuseColor.rgb=mix(diffuseColor.rgb,uAtlasShallow*1.08,caustic*shallows*.22*uAtlasSunlight);
      // Small, irregular breakers travel toward the shore rather than forming a fixed outline.
      float wave=sin(shore*17.+atlasNoise(p*4.)*1.8-uAtlasTime*.85);
      float foam=pow(max(0.,wave),20.)*exp(-shore*3.4)*.24;
      float coast=(1.-smoothstep(.01,.065,shore))*.16;
      diffuseColor.rgb=mix(diffuseColor.rgb,mix(uAtlasShallow,vec3(.97,.99,1.),uAtlasSunlight),foam+coast);
      // Analytic wave normals add moving sky reflections and a restrained sun glint.
      float w1=p.x*3.2+p.y*1.6-uAtlasTime*.42;
      float w2=p.x*-2.7+p.y*4.8+uAtlasTime*.32;
      float w3=p.x*10.1+p.y*7.3-uAtlasTime*.55;
      vec3 waterNormal=normalize(vec3(cos(w1)*.095+cos(w2)*-.055+cos(w3)*.025,1.,cos(w1)*.048+cos(w2)*.10+cos(w3)*.018));
      vec3 waterView=normalize(cameraPosition-vAtlasWorld);
      vec3 waterHalf=normalize(normalize(vec3(-.38,.86,.34))+waterView);
      float specular=pow(max(dot(waterNormal,waterHalf),0.),65.);
      float fresnel=pow(1.-max(dot(waterNormal,waterView),0.),4.);
      float glimmer=pow(max(0.,sin(w3+sin(w2))),24.)*.024;
      diffuseColor.rgb=mix(diffuseColor.rgb,uAtlasMiddle,fresnel*.22);
      diffuseColor.rgb+=vec3(.9,.94,.92)*(specular*.14+glimmer)*(1.-shelf*.50)*uAtlasSunlight;
    `);
  };
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(280, 280), material);
  mesh.rotation.x = -Math.PI / 2; mesh.position.y = -.008;
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(80,80), new THREE.ShadowMaterial({ color: '#254c54', opacity: .20, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.006; shadow.receiveShadow = true;
  return { mesh, shadow, uniforms };
}

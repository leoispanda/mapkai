import * as THREE from 'three';
import { OrbitControls } from './assets/vendor/three/OrbitControls.js';
import { ISLANDS, createIsland, createOcean } from './map3d-terrain.js?v=0.1.291';

const COPY = {
  en: { title: 'Knowledge map', sideCopy: 'A new perspective starts here.', full: 'Full atlas', journey: 'My journey', start: 'Start exploring', headline: 'A world of knowledge.', subhead: 'Follow your curiosity. Find your next island.', reset: 'Reset view', loading: 'Preparing your world…', preview: 'Full atlas preview', help: 'Drag to orbit · Scroll to zoom · Select an island', open: 'Explore this field', close: 'Close field details', rotation: 'Auto-rotate', personal: 'Your progress', in: 'Zoom in', out: 'Zoom out', canvas: 'Interactive 3D knowledge islands. Arrow keys select fields, Enter opens a field, plus and minus zoom, Escape resets the view.' },
  zh: { title: '知识地图', sideCopy: '从一个新的视角，重新认识世界。', full: '完整地图', journey: '我的探索', start: '开始探索', headline: '世界很大，知识也是。', subhead: '循着好奇心，发现下一座知识岛屿。', reset: '回到全景', loading: '正在展开你的知识世界…', preview: '完整地图预览', help: '拖动旋转 · 滚轮缩放 · 点击岛屿探索', open: '走进这个领域', close: '关闭领域详情', rotation: '自动旋转', personal: '我的进度', in: '放大', out: '缩小', canvas: '交互式三维知识群岛。方向键选择领域，回车进入，加减号缩放，Escape 回到全景。' },
};
const NAMES = {
  en: ['General knowledge', 'Education', 'Arts & humanities', 'Society', 'Business & law', 'Natural sciences', 'Technology', 'Engineering', 'Agriculture', 'Health', 'Services'],
  zh: ['通识', '教育', '艺术与人文', '社会科学', '商业与法律', '自然科学', '信息技术', '工程与制造', '农林渔牧', '健康与福利', '服务'],
};
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function createSpatialAtlas(root, { state: initialState, onOpen }) {
  let state = initialState, lang = state.language === 'zh' ? 'zh' : 'en';
  let preview = initialState.fields.every(f => f.level === 'ocean'), selected = null, hovering = null, frame = 0, lastTime = 0, disposed = false, contextLost = false;
  let cameraFlight = null, running = false, terrainSignature = '', narrowLayout = null, oceanTime = 0;
  let orbitStrength = 0, orbitPhase = 0, orbitCenter = null, interactionView = null;
  const orbitAmplitude = Math.PI / 10, orbitPeriod = 100; // A quiet ±18° sweep keeps the composition intact.
  const labelOffsets = new Map();
  const page = root.closest('#map'), world = root.querySelector('#spatialWorld'), sceneHost = root.querySelector('#spatialScene');
  const labelsHost = root.querySelector('#spatialLabels'), detail = root.querySelector('#spatialDetail');
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let rotationEnabled = !reducedQuery.matches, interacting = false, resumeRotationAt = 0;
  const rotationButton = root.querySelector('#spatialRotation');
  const mobile = matchMedia('(max-width: 760px)').matches;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#b9deea'); scene.fog = new THREE.FogExp2('#b9deea', .004);
  const camera = new THREE.OrthographicCamera(-18, 18, 13, -13, .1, 180);
  const homePosition = new THREE.Vector3(0, 32, 32), homeTarget = new THREE.Vector3(0, 0, 1.0);
  camera.position.copy(homePosition);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // Island lighting is static during camera motion; redraw shadows only when the land changes.
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('role', 'application');
  renderer.domElement.id = 'spatialCanvas';
  sceneHost.append(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(homeTarget);
  controls.enableDamping = true; controls.dampingFactor = .085;
  controls.minPolarAngle = .28; controls.maxPolarAngle = Math.PI * .42;
  controls.minZoom = .72; controls.maxZoom = 3.8; controls.zoomSpeed = .65; controls.rotateSpeed = .42;
  controls.autoRotateSpeed = 0;
  controls.enablePan = true; controls.screenSpacePanning = true;
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  controls.update();
  scene.add(new THREE.HemisphereLight('#f4fbff', '#b3c8bd', .95));
  const sun = new THREE.DirectionalLight('#fff8e9', 2.9);
  sun.position.set(-16, 26, 14); sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -19, right: 19, top: 19, bottom: -19, near: .5, far: 65 });
  sun.shadow.intensity = .52; sun.shadow.bias = -.00012; sun.shadow.normalBias = .024; sun.shadow.radius = 2.5;
  scene.add(sun);
  const fill = new THREE.DirectionalLight('#c8e8fa', .38); fill.position.set(10, 8, 12); scene.add(fill);
  const ocean = createOcean(); scene.add(ocean.mesh, ocean.shadow);
  const islands = ISLANDS.map(spec => createIsland(spec, mobile)); islands.forEach(island => scene.add(island.group));
  const pickables = islands.map(island => island.terrain);
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(), projection = new THREE.Vector3();
  const labels = new Map();
  for (const [i, island] of islands.entries()) {
    const code = island.spec.code;
    const label = document.createElement('button'); label.type = 'button'; label.className = 'spatial-island-label'; label.dataset.spatialIsland = code; label.setAttribute('aria-pressed', 'false'); labelsHost.append(label); labels.set(code, label);
    label.addEventListener('click', () => select(code, true));
    for (const el of [label]) {
      el.addEventListener('mouseenter', () => { hovering = code; invalidate(); });
      el.addEventListener('mouseleave', () => { hovering = null; invalidate(); });
    }
  }

  function resize() {
    if (disposed || !world.clientWidth || !world.clientHeight) return;
    const header = document.querySelector('.topbar');
    if (header) page.style.setProperty('--spatial-header', `${header.offsetHeight}px`);
    const width = world.clientWidth, height = world.clientHeight;
    renderer.setSize(width, height);
    const aspect = width / height;
    // Keep the complete archipelago in view on a phone, without stretching it.
    const narrow = width < 600;
    const layoutChanged = narrowLayout !== null && narrowLayout !== narrow;
    narrowLayout = narrow;
    let halfHeight = narrow ? Math.max(13.0, 7.0 / aspect) : Math.max(8.2, 15.5 / aspect);
    const phonePositions = [[-3.5,-11.5],[3.5,-11.5],[-3.5,-6.2],[3.5,-6.0],[3.9,-.5],[-1.2,.3],[-3.5,5.7],[3.5,5.1],[-3.5,9.9],[3.5,9.7],[.4,13.5]];
    for (const [index, island] of islands.entries()) {
      const scale = narrow ? .60 : 1;
      island.group.position.x = narrow ? phonePositions[index][0] : island.spec.x;
      island.group.position.z = narrow ? phonePositions[index][1] : island.spec.z;
      island.group.scale.x = island.group.scale.z = scale;
      ocean.uniforms.uAtlasIslands.value[index].set(island.group.position.x, island.group.position.z, island.spec.radius * scale, island.spec.seed);
    }
    // The bounded automatic sweep keeps the wider composition readable; manual orbit remains free.
    camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect; camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.shadowMap.needsUpdate = true;
    labelOffsets.clear();
    if (layoutChanged && selected) select(selected, true);
    else if (layoutChanged) { cameraFlight = null; camera.position.copy(homePosition); controls.target.copy(homeTarget); camera.zoom = 1; camera.updateProjectionMatrix(); controls.update(); orbitStrength = 0; orbitCenter = null; }
    page.dataset.spatialSize = `${width}x${height}`;
    invalidate();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(world);
  const headerObserver = new ResizeObserver(resize); if (document.querySelector('.topbar')) headerObserver.observe(document.querySelector('.topbar'));

  function fitLabels() {
    const w = world.clientWidth, h = world.clientHeight, placed = [];
    const front = camera.position.clone().sub(controls.target); front.y = 0; front.normalize();
    // Keep label priority stable as the camera turns; only the selected field takes precedence.
    const ordered = selected ? [...islands.filter(i => i.spec.code === selected), ...islands.filter(i => i.spec.code !== selected)] : islands;
    for (const island of ordered) {
      const code = island.spec.code, label = labels.get(code);
      const scale = island.group.scale.x;
      const raised = preview || field(code)?.level !== 'ocean';
      // Anchor each name at the camera-facing beach, keeping the terrain visible.
      projection.set(island.group.position.x + front.x * island.spec.radius * island.spec.sx * scale * .76,
        raised ? .06 : .02,
        island.group.position.z + front.z * island.spec.radius * island.spec.sz * scale * .76).project(camera);
      let x = (projection.x * .5 + .5) * w, y = (-projection.y * .5 + .5) * h + 14;
      const width = label.offsetWidth, height = label.offsetHeight;
      if (projection.z < -1 || projection.z > 1 || x < -width || x > w + width || y < -height || y > h + height) { label.style.visibility = 'hidden'; continue; }
      x = THREE.MathUtils.clamp(x, width / 2 + 12, w - width / 2 - 12);
      y = THREE.MathUtils.clamp(y, height / 2 + 16, h - 78);
      const base = y, step = height + 8;
      const fits = (candidate, gap = 6) => !placed.some(r => Math.abs(r.x - x) < (r.width + width) / 2 + 7 && Math.abs(r.y - candidate) < (r.height + height) / 2 + gap);
      const remembered = labelOffsets.get(code) || 0;
      const previousY = THREE.MathUtils.clamp(base + remembered * step, height / 2 + 16, h - 78);
      // A little hysteresis prevents adjacent labels from swapping rows at a shared edge.
      let offset = remembered && !fits(base, 14) && fits(previousY) ? remembered : 0;
      y = THREE.MathUtils.clamp(base + offset * step, height / 2 + 16, h - 78);
      for (let attempt = 0; attempt < 10 && !fits(y); attempt++) {
        offset = Math.ceil((attempt + 1) / 2) * (attempt % 2 ? -1 : 1);
        y = THREE.MathUtils.clamp(base + offset * step, height / 2 + 16, h - 78);
      }
      labelOffsets.set(code, offset);
      placed.push({ x, y, width, height });
      label.style.visibility = 'visible';
      label.style.transform = `translate3d(${(x - width / 2).toFixed(1)}px,${(y - height / 2).toFixed(1)}px,0)`;
      label.style.zIndex = code === selected ? '20' : String(12 - placed.length);
    }
  }
  function field(code) { return state.fields.find(f => f.code === code); }
  function paintDetails() {
    if (!selected) { detail.hidden = true; return; }
    const f = field(selected), c = COPY[lang];
    detail.innerHTML = `<button class="spatial-detail-close" type="button" aria-label="${c.close}" data-spatial-close>×</button><h3>${escape(f.name)}</h3><p>${escape(f.thinking)}</p><p class="spatial-personal-state">${c.personal} · ${escape(f.stateLabel)}</p><button type="button" data-spatial-open>${c.open} <span aria-hidden="true">↗</span></button>`;
    detail.hidden = false;
  }
  function flyTo(target, position, zoom) {
    const fromOrbit = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    const toOrbit = new THREE.Spherical().setFromVector3(position.clone().sub(target));
    // Reset follows the shortest arc around the islands instead of cutting through them.
    toOrbit.theta = fromOrbit.theta + Math.atan2(Math.sin(toOrbit.theta - fromOrbit.theta), Math.cos(toOrbit.theta - fromOrbit.theta));
    cameraFlight = { target, fromTarget: controls.target.clone(), fromOrbit, toOrbit, fromZoom: camera.zoom, zoom, elapsed: 0, duration: 1.3 };
    orbitStrength = 0; orbitCenter = null;
    controls.autoRotate = false;
  }
  function select(code, fly = true) {
    selected = code;
    if (!fly) cameraFlight = null;
    if (code) { orbitStrength = 0; controls.autoRotate = false; }
    for (const [id, el] of labels) el.setAttribute('aria-pressed', String(code === id));
    root.dataset.selectedField = code || '';
    paintDetails();
    if (code && fly) {
      const island = islands.find(i => i.spec.code === code);
      const target = new THREE.Vector3(island.group.position.x, .5, island.group.position.z);
      const delta = camera.position.clone().sub(controls.target);
      flyTo(target, target.clone().add(delta), world.clientWidth < 600 ? 2.1 : 1.65);
    }
    invalidate();
  }
  function reset() { select(null, false); flyTo(homeTarget.clone(), homePosition.clone(), 1); invalidate(); }
  function zoom(factor) {
    const targetZoom = THREE.MathUtils.clamp((cameraFlight?.zoom ?? camera.zoom) * factor, controls.minZoom, controls.maxZoom);
    flyTo(controls.target.clone(), camera.position.clone(), targetZoom);
    cameraFlight.duration = .45;
    invalidate();
  }
  root.querySelector('#spatialReset').addEventListener('click', reset);
  root.querySelector('#spatialZoomIn').addEventListener('click', () => zoom(1.25));
  root.querySelector('#spatialZoomOut').addEventListener('click', () => zoom(.8));
  detail.addEventListener('click', e => { if (e.target.closest('[data-spatial-close]')) { select(null, false); renderer.domElement.focus(); } if (e.target.closest('[data-spatial-open]') && selected) onOpen(selected); });
  for (const button of root.querySelectorAll('[data-spatial-mode]')) button.addEventListener('click', () => { preview = button.dataset.spatialMode === 'atlas'; update(state); });
  let pointerDown = null;
  renderer.domElement.addEventListener('pointerdown', e => { pointerDown = { x: e.clientX, y: e.clientY }; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!pointerDown || Math.hypot(e.clientX - pointerDown.x, e.clientY - pointerDown.y) > 6) return;
    const code = hit(e); if (code) select(code, true); else select(null, false);
  });
  renderer.domElement.addEventListener('pointermove', e => { hovering = hit(e); renderer.domElement.style.cursor = hovering ? 'pointer' : 'grab'; invalidate(); });
  renderer.domElement.addEventListener('pointerleave', () => { hovering = null; invalidate(); });
  function hit(e) {
    const rect = renderer.domElement.getBoundingClientRect(); pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(pickables, false).find(hit => hit.object.parent.scale.y > .05)?.object.userData.code || null;
  }
  renderer.domElement.addEventListener('keydown', e => {
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault(); const step = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
      const index = islands.findIndex(i => i.spec.code === selected); select(islands[(index + step + islands.length) % islands.length].spec.code, false);
    } else if (e.key === 'Enter' && selected) { e.preventDefault(); onOpen(selected); }
    else if (e.key === 'Escape') { e.preventDefault(); reset(); }
    else if (e.key === '+' || e.key === '=') { e.preventDefault(); zoom(1.2); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); zoom(1 / 1.2); }
  });
  function deferRotation() {
    resumeRotationAt = performance.now() + 5000;
    orbitStrength = 0; // Pause the existing sweep; ordinary UI actions must not move its center.
    controls.autoRotate = false;
    invalidate();
  }
  function paintRotation() {
    rotationButton.querySelector('span').textContent = COPY[lang].rotation;
    rotationButton.setAttribute('aria-pressed', String(rotationEnabled));
  }
  rotationButton.addEventListener('click', () => {
    rotationEnabled = !rotationEnabled;
    orbitStrength = 0;
    resumeRotationAt = 0;
    paintRotation(); invalidate();
  });
  root.addEventListener('pointerdown', deferRotation, true);
  root.addEventListener('keydown', deferRotation, true);
  controls.addEventListener('start', () => {
    interactionView = { position: camera.position.clone(), target: controls.target.clone(), zoom: camera.zoom };
    cameraFlight = null; interacting = true; deferRotation();
  });
  controls.addEventListener('end', () => {
    // OrbitControls also emits start/end for a click; only a changed view establishes a new sweep.
    if (interactionView && (camera.position.distanceToSquared(interactionView.position) > 1e-8
      || controls.target.distanceToSquared(interactionView.target) > 1e-8
      || Math.abs(camera.zoom - interactionView.zoom) > 1e-6)) {
      orbitCenter = null; orbitPhase = 0;
    }
    interactionView = null; interacting = false; deferRotation();
  });
  controls.addEventListener('change', invalidate);
  renderer.domElement.addEventListener('webglcontextlost', e => {
    e.preventDefault(); contextLost = true; stop(); const loading = root.querySelector('#spatialLoading'); loading.hidden = false;
    loading.querySelector('p').textContent = lang === 'zh' ? '3D 画面已暂停，仍可点击领域名称。刷新页面可重试。' : '3D view paused. Select a field label, or reload to retry.';
    loading.style.pointerEvents = 'none'; loading.style.zIndex = '1';
  });

  renderer.domElement.addEventListener('webglcontextrestored', () => {
    contextLost = false;
    renderer.shadowMap.needsUpdate = true;
    root.querySelector('#spatialLoading').hidden = true;
    invalidate();
  });

  function update(nextState) {
    state = nextState; lang = state.language === 'zh' ? 'zh' : 'en'; const c = COPY[lang];
    for (const element of root.querySelectorAll('[data-spatial-text]')) element.textContent = c[element.dataset.spatialText] || '';
    if (world.clientWidth < 600) root.querySelector('[data-spatial-text="help"]').textContent = lang === 'zh' ? '拖动旋转 · 双指缩放 · 点击岛屿探索' : 'Drag to orbit · Pinch to zoom · Select an island';
    root.querySelector('#spatialProgress').hidden = preview;
    root.querySelector('#spatialReset').setAttribute('aria-label', c.reset);
    root.querySelector('#spatialReset').title = c.reset;
    const explored = state.fields.filter(f => f.level !== 'ocean').length;
    root.querySelector('#spatialProgress').textContent = lang === 'zh' ? `已探索 ${explored} / 11 个领域` : `${explored} of 11 fields explored`;
    renderer.domElement.setAttribute('aria-label', c.canvas);
    root.querySelector('#spatialZoomIn').setAttribute('aria-label', c.in); root.querySelector('#spatialZoomOut').setAttribute('aria-label', c.out);
    for (const [index, island] of islands.entries()) {
      const code = island.spec.code, name = NAMES[lang][index], label = labels.get(code);
      label.textContent = name; label.dataset.level = preview ? 'green' : field(code)?.level || 'ocean';
      label.setAttribute('aria-label', name);
    }
    for (const button of root.querySelectorAll('[data-spatial-mode]')) button.setAttribute('aria-pressed', String((button.dataset.spatialMode === 'atlas') === preview));
    const signature = `${preview}|${state.fields.map(f => f.level).join(',')}`;
    if (signature !== terrainSignature) {
      for (const [index, island] of islands.entries()) {
        const level = preview ? 'green' : field(island.spec.code)?.level || 'ocean';
        island.scaleTarget = { ocean: .012, snow: .34, land: .74, green: 1 }[level];
        island.positionTarget = level === 'ocean' ? -.30 : 0;
        island.trees.visible = level === 'land' || level === 'green';
        island.stones.visible = level !== 'ocean';
        island.stageUniform.value = level === 'snow' ? 0 : 1;
        ocean.uniforms.uAtlasLevels.value[index] = level === 'ocean' ? .10 : 1;
      }
      terrainSignature = signature;
      renderer.shadowMap.needsUpdate = true;
    }
    const dark = state.theme === 'dark';
    scene.background.set(dark ? '#142d3d' : '#b9deea');
    scene.fog.color.copy(scene.background);
    ocean.uniforms.uAtlasDeep.value.set(dark ? '#22475d' : '#91c9df');
    ocean.uniforms.uAtlasMiddle.value.set(dark ? '#305e74' : '#b5deea');
    ocean.uniforms.uAtlasShallow.value.set(dark ? '#438c9a' : '#d6eee8');
    ocean.uniforms.uAtlasSunlight.value = dark ? .18 : 1;
    renderer.toneMappingExposure = dark ? 1.0 : 1.08;
    paintDetails(); paintRotation(); root.dataset.mode = preview ? 'atlas' : 'journey';
    invalidate();
  }
  function active() { return !disposed && !contextLost && page.classList.contains('is-active') && !document.hidden; }
  function stop() { root.dataset.rendering = 'paused'; root.dataset.autoRotating = 'false'; cancelAnimationFrame(frame); running = false; frame = 0; lastTime = 0; orbitStrength = 0; }
  function invalidate() { if (active() && !running) { root.dataset.rendering = 'active'; running = true; frame = requestAnimationFrame(render); } }
  function render(time) {
    if (!active()) { stop(); return; }
    const dt = lastTime ? Math.min((time - lastTime) / 1000, .05) : 1 / 60; lastTime = time;
    const reduced = reducedQuery.matches, ease = reduced ? 1 : 1 - Math.exp(-dt * 5.5);
    let animating = false;
    if (cameraFlight) {
      const flight = cameraFlight;
      flight.elapsed += dt;
      const t = reduced ? 1 : Math.min(flight.elapsed / flight.duration, 1);
      const progress = t * t * t * (t * (t * 6 - 15) + 10); // Ease both ends without overshoot.
      controls.target.lerpVectors(flight.fromTarget, flight.target, progress);
      const orbit = new THREE.Spherical(
        THREE.MathUtils.lerp(flight.fromOrbit.radius, flight.toOrbit.radius, progress),
        THREE.MathUtils.lerp(flight.fromOrbit.phi, flight.toOrbit.phi, progress),
        THREE.MathUtils.lerp(flight.fromOrbit.theta, flight.toOrbit.theta, progress));
      camera.position.setFromSpherical(orbit).add(controls.target);
      camera.zoom = THREE.MathUtils.lerp(flight.fromZoom, flight.zoom, progress);
      camera.updateProjectionMatrix();
      animating = t < 1;
      if (t === 1) { cameraFlight = null; resumeRotationAt = time + 3500; }
    }
    for (const island of islands) {
      const terrainMoving = Math.abs(island.group.scale.y - island.scaleTarget) > .001 || Math.abs(island.group.position.y - island.positionTarget) > .001;
      island.group.scale.y = THREE.MathUtils.lerp(island.group.scale.y, island.scaleTarget, ease);
      island.group.position.y = THREE.MathUtils.lerp(island.group.position.y, island.positionTarget, ease);
      if (terrainMoving) renderer.shadowMap.needsUpdate = true;
      if (Math.abs(island.group.scale.y - island.scaleTarget) > .001 || Math.abs(island.group.position.y - island.positionTarget) > .001) animating = true;
      island.ring.visible = (selected === island.spec.code || hovering === island.spec.code) && island.scaleTarget > .05;
    }
    // Preserve the same center and phase through pauses, controls, and hidden-page intervals.
    const orbitAllowed = rotationEnabled && !interacting && !cameraFlight && !selected && time >= resumeRotationAt;
    if (orbitAllowed && orbitCenter === null) { orbitCenter = controls.getAzimuthalAngle(); orbitPhase = 0; }
    orbitStrength = orbitAllowed ? THREE.MathUtils.lerp(orbitStrength, 1, reduced ? 1 : 1 - Math.exp(-dt * 1.4)) : 0;
    const sweeping = orbitAllowed && orbitCenter !== null && orbitStrength > .001;
    if (sweeping) {
      orbitPhase = (orbitPhase + dt * orbitStrength * Math.PI * 2 / orbitPeriod) % (Math.PI * 2);
      const orbit = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      orbit.theta = orbitCenter - Math.sin(orbitPhase) * (narrowLayout ? .10 : orbitAmplitude);
      camera.position.setFromSpherical(orbit).add(controls.target);
    }
    controls.autoRotate = false;
    controls.enableDamping = !reduced;
    controls.dampingFactor = 1 - Math.exp(-dt * 6.4);
    root.dataset.autoRotating = String(sweeping);
    const controlsChanged = controls.update(dt);
    if (!reduced) { oceanTime += dt; ocean.uniforms.uAtlasTime.value = oceanTime; }
    renderer.render(scene, camera); fitLabels();
    root.querySelector('#spatialCompass').style.transform = `rotate(${controls.getAzimuthalAngle() * 180 / Math.PI}deg)`;
    root.dataset.zoom = camera.zoom.toFixed(2); root.dataset.azimuth = controls.getAzimuthalAngle().toFixed(3);
    if (!root.dataset.ready) { root.dataset.ready = 'true'; root.querySelector('#spatialLoading').hidden = true; }
    if (!reduced || animating || controlsChanged || (rotationEnabled && !selected && !interacting)) frame = requestAnimationFrame(render);
    else { running = false; frame = 0; }
  }
  const visibilityChanged = () => { if (active()) { resize(); invalidate(); } else stop(); };
  const routeObserver = new MutationObserver(visibilityChanged); routeObserver.observe(page, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', visibilityChanged);
  const motionPreferenceChanged = () => {
    rotationEnabled = !reducedQuery.matches;
    paintRotation(); invalidate();
  };
  reducedQuery.addEventListener('change', motionPreferenceChanged);
  resize(); update(state); invalidate();
  return { update, dispose() {
    disposed = true; stop(); controls.dispose(); resizeObserver.disconnect(); headerObserver.disconnect(); routeObserver.disconnect();
    document.removeEventListener('visibilitychange', visibilityChanged); reducedQuery.removeEventListener('change', motionPreferenceChanged);
    root.removeEventListener('pointerdown', deferRotation, true); root.removeEventListener('keydown', deferRotation, true);
    scene.traverse(object => { object.geometry?.dispose(); if (object.material) { for (const m of Array.isArray(object.material) ? object.material : [object.material]) m.dispose(); } });
    renderer.dispose(); renderer.domElement.remove();
  } };
}

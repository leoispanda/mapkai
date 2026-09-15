import * as THREE from 'three';
import { OrbitControls } from './assets/vendor/three/OrbitControls.js';
import { ISLANDS, createIsland, createOcean } from './map3d-terrain.js?v=0.1.222';

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
  let cameraFlight = null, running = false, terrainSignature = '', narrowLayout = null;
  const page = root.closest('#map'), world = root.querySelector('#spatialWorld'), sceneHost = root.querySelector('#spatialScene');
  const labelsHost = root.querySelector('#spatialLabels'), directory = root.querySelector('#spatialFields'), detail = root.querySelector('#spatialDetail');
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let rotationEnabled = !reducedQuery.matches, interacting = false, resumeRotationAt = 0;
  const rotationButton = root.querySelector('#spatialRotation');
  const mobile = matchMedia('(max-width: 760px)').matches;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#8edfdc'); scene.fog = new THREE.FogExp2('#8edfdc', .004);
  const camera = new THREE.OrthographicCamera(-18, 18, 13, -13, .1, 180);
  const homePosition = new THREE.Vector3(0, 23, 29), homeTarget = new THREE.Vector3(0, 0, 1.0);
  camera.position.copy(homePosition);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.23;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('role', 'application');
  renderer.domElement.id = 'spatialCanvas';
  sceneHost.append(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(homeTarget);
  controls.enableDamping = true; controls.dampingFactor = .085;
  controls.minPolarAngle = .28; controls.maxPolarAngle = Math.PI * .42;
  controls.minZoom = .72; controls.maxZoom = 3.8; controls.zoomSpeed = .65; controls.rotateSpeed = .42;
  controls.autoRotateSpeed = .55; // One calm orbit in about 109 seconds, independent of frame rate.
  controls.enablePan = true; controls.screenSpacePanning = true;
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  controls.update();
  scene.add(new THREE.HemisphereLight('#e6fbff', '#5d7650', 1.9));
  const sun = new THREE.DirectionalLight('#fff2d5', 2.9);
  sun.position.set(-18, 28, -35); sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -19, right: 19, top: 19, bottom: -19, near: .5, far: 65 });
  sun.shadow.intensity = .32; sun.shadow.bias = -.00018; sun.shadow.normalBias = .035; sun.shadow.radius = 2;
  scene.add(sun);
  const fill = new THREE.DirectionalLight('#72b9f4', .8); fill.position.set(10, 8, 12); scene.add(fill);
  const ocean = createOcean(); scene.add(ocean.mesh);
  const islands = ISLANDS.map(spec => createIsland(spec, mobile)); islands.forEach(island => scene.add(island.group));
  const pickables = islands.map(island => island.terrain);
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(), projection = new THREE.Vector3();
  const buttons = new Map(), labels = new Map();
  for (const [i, island] of islands.entries()) {
    const code = island.spec.code;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'spatial-field'; button.dataset.spatialField = code; button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<span class="spatial-field-number">${i + 1}</span><span class="spatial-field-name"></span>`; directory.append(button); buttons.set(code, button);
    const label = document.createElement('button'); label.type = 'button'; label.className = 'spatial-island-label'; label.dataset.spatialIsland = code; label.setAttribute('aria-pressed', 'false'); labelsHost.append(label); labels.set(code, label);
    button.addEventListener('click', () => select(code, true));
    label.addEventListener('click', () => select(code, true));
    for (const el of [button, label]) {
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
    let halfHeight = narrow ? Math.max(17.4, 9.7 / aspect) : Math.max(10.8, 12.8 / aspect);
    for (const [index, island] of islands.entries()) {
      const scale = narrow ? .74 : 1;
      island.group.position.x = island.spec.x * (narrow ? .57 : 1);
      island.group.position.z = island.spec.z * (narrow ? 1.22 : 1);
      island.group.scale.x = island.group.scale.z = scale;
      ocean.uniforms.uAtlasIslands.value[index].set(island.group.position.x, island.group.position.z, island.spec.radius * scale, island.spec.seed);
    }
    // Reserve enough room for the outermost island throughout a full orbit.
    const orbitRadius = Math.max(...islands.map(island =>
      Math.hypot(island.group.position.x - homeTarget.x, island.group.position.z - homeTarget.z)
      + island.spec.radius * island.group.scale.x * 1.15));
    halfHeight = Math.max(halfHeight, (orbitRadius + 1) / aspect);
    camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect; camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    if (layoutChanged && selected) select(selected, true);
    page.dataset.spatialSize = `${width}x${height}`;
    invalidate();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(world);
  const headerObserver = new ResizeObserver(resize); if (document.querySelector('.topbar')) headerObserver.observe(document.querySelector('.topbar'));

  function fitLabels() {
    const w = world.clientWidth, h = world.clientHeight;
    const placed = [];
    const ordered = islands.slice().sort((a, b) => a.spec.code === selected ? -1 : b.spec.code === selected ? 1 : a.spec.z - b.spec.z);
    for (const island of ordered) {
      const code = island.spec.code, label = labels.get(code);
      const y = preview || field(code)?.level !== 'ocean' ? island.peakHeight * island.group.scale.y + island.group.position.y + .34 : .35;
      projection.set(island.group.position.x, y, island.group.position.z).project(camera);
      let x = (projection.x * .5 + .5) * w, sy = (-projection.y * .5 + .5) * h;
      const width = label.offsetWidth, height = label.offsetHeight;
      const visible = projection.z > -1 && projection.z < 1 && x > -width && x < w + width && sy > 65 && sy < h - 60;
      if (!visible) { label.style.visibility = 'hidden'; continue; }
      label.style.visibility = 'visible';
      x = THREE.MathUtils.clamp(x, width / 2 + 8, w - width / 2 - 8);
      for (let attempt = 0; attempt < 4; attempt++) {
        if (!placed.some(r => Math.abs(r.x - x) < (r.width + width) / 2 + 5 && Math.abs(r.y - sy) < height + 4)) break;
        sy += height + 7;
      }
      placed.push({ x, y: sy, width });
      label.style.transform = `translate3d(${(x - width / 2).toFixed(1)}px,${(sy - height / 2).toFixed(1)}px,0)`;
      label.style.zIndex = code === selected ? '5' : String(Math.round(100 - projection.z * 100));
    }
  }
  function field(code) { return state.fields.find(f => f.code === code); }
  function paintDetails() {
    if (!selected) { detail.hidden = true; return; }
    const f = field(selected), c = COPY[lang];
    detail.innerHTML = `<button class="spatial-detail-close" type="button" aria-label="${c.close}" data-spatial-close>×</button><h3>${escape(f.name)}</h3><p>${escape(f.thinking)}</p><p class="spatial-personal-state">${c.personal} · ${escape(f.stateLabel)}</p><button type="button" data-spatial-open>${c.open} <span aria-hidden="true">↗</span></button>`;
    detail.hidden = false;
  }
  function select(code, fly = true) {
    selected = code;
    for (const [id, el] of buttons) el.setAttribute('aria-pressed', String(code === id));
    for (const [id, el] of labels) el.setAttribute('aria-pressed', String(code === id));
    root.dataset.selectedField = code || '';
    paintDetails();
    if (code && fly) {
      const island = islands.find(i => i.spec.code === code);
      const target = new THREE.Vector3(island.group.position.x, .5, island.group.position.z);
      const delta = camera.position.clone().sub(controls.target);
      cameraFlight = { target, position: target.clone().add(delta), zoom: world.clientWidth < 600 ? 2.1 : 1.65 };
    }
    invalidate();
  }
  function reset() { select(null, false); cameraFlight = { target: homeTarget.clone(), position: homePosition.clone(), zoom: 1 }; invalidate(); }
  function zoom(factor) { cameraFlight = null; camera.zoom = THREE.MathUtils.clamp(camera.zoom * factor, controls.minZoom, controls.maxZoom); camera.updateProjectionMatrix(); invalidate(); }
  root.querySelector('#spatialReset').addEventListener('click', reset);
  root.querySelector('#spatialZoomIn').addEventListener('click', () => zoom(1.25));
  root.querySelector('#spatialZoomOut').addEventListener('click', () => zoom(.8));
  detail.addEventListener('click', e => { if (e.target.closest('[data-spatial-close]')) { const previous = selected; select(null, false); buttons.get(previous)?.focus(); } if (e.target.closest('[data-spatial-open]') && selected) onOpen(selected); });
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
    resumeRotationAt = performance.now() + 4000;
    controls.autoRotate = false;
    invalidate();
  }
  function paintRotation() {
    rotationButton.querySelector('span').textContent = COPY[lang].rotation;
    rotationButton.setAttribute('aria-pressed', String(rotationEnabled));
  }
  rotationButton.addEventListener('click', () => {
    rotationEnabled = !rotationEnabled;
    resumeRotationAt = 0;
    paintRotation(); invalidate();
  });
  root.addEventListener('pointerdown', deferRotation, true);
  root.addEventListener('keydown', deferRotation, true);
  controls.addEventListener('start', () => { cameraFlight = null; interacting = true; deferRotation(); });
  controls.addEventListener('end', () => { interacting = false; deferRotation(); });
  controls.addEventListener('change', invalidate);
  renderer.domElement.addEventListener('webglcontextlost', e => {
    e.preventDefault(); contextLost = true; stop(); const loading = root.querySelector('#spatialLoading'); loading.hidden = false;
    loading.querySelector('p').textContent = lang === 'zh' ? '3D 画面已暂停，仍可从左侧选择领域。刷新页面可重试。' : '3D view paused. Use the field list, or reload to retry.';
    loading.style.pointerEvents = 'none'; loading.style.zIndex = '1';
  });

  renderer.domElement.addEventListener('webglcontextrestored', () => {
    contextLost = false;
    root.querySelector('#spatialLoading').hidden = true;
    invalidate();
  });

  function update(nextState) {
    state = nextState; lang = state.language === 'zh' ? 'zh' : 'en'; const c = COPY[lang];
    for (const element of root.querySelectorAll('[data-spatial-text]')) element.textContent = c[element.dataset.spatialText] || '';
    if (world.clientWidth < 600) root.querySelector('[data-spatial-text="help"]').textContent = lang === 'zh' ? '拖动旋转 · 双指缩放 · 点击岛屿探索' : 'Drag to orbit · Pinch to zoom · Select an island';
    root.querySelector('#spatialModeNote').textContent = preview ? c.preview : c.journey;
    const explored = state.fields.filter(f => f.level !== 'ocean').length;
    root.querySelector('#spatialProgress').textContent = lang === 'zh' ? `已探索 ${explored} / 11 个领域` : `${explored} of 11 fields explored`;
    renderer.domElement.setAttribute('aria-label', c.canvas);
    root.querySelector('#spatialZoomIn').setAttribute('aria-label', c.in); root.querySelector('#spatialZoomOut').setAttribute('aria-label', c.out);
    for (const [index, island] of islands.entries()) {
      const code = island.spec.code, name = NAMES[lang][index], label = labels.get(code);
      buttons.get(code).querySelector('.spatial-field-name').textContent = name;
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
    }
    const dark = state.theme === 'dark';
    scene.background.set(dark ? '#142d3d' : '#8edfdc');
    scene.fog.color.copy(scene.background);
    ocean.uniforms.uAtlasDeep.value.set(dark ? '#22475d' : '#159cbd');
    ocean.uniforms.uAtlasMiddle.value.set(dark ? '#305e74' : '#31c6cf');
    ocean.uniforms.uAtlasShallow.value.set(dark ? '#438c9a' : '#a1efdb');
    renderer.toneMappingExposure = dark ? 1.02 : 1.23;
    paintDetails(); paintRotation(); root.dataset.mode = preview ? 'atlas' : 'journey';
    invalidate();
  }
  function active() { return !disposed && !contextLost && page.classList.contains('is-active') && !document.hidden; }
  function stop() { root.dataset.rendering = 'paused'; root.dataset.autoRotating = 'false'; cancelAnimationFrame(frame); running = false; frame = 0; lastTime = 0; }
  function invalidate() { if (active() && !running) { root.dataset.rendering = 'active'; running = true; frame = requestAnimationFrame(render); } }
  function render(time) {
    if (!active()) { stop(); return; }
    const dt = lastTime ? Math.min((time - lastTime) / 1000, .05) : 1 / 60; lastTime = time;
    const reduced = reducedQuery.matches, ease = reduced ? 1 : 1 - Math.exp(-dt * 5.5);
    let animating = false;
    if (cameraFlight) {
      controls.target.lerp(cameraFlight.target, ease); camera.position.lerp(cameraFlight.position, ease); camera.zoom = THREE.MathUtils.lerp(camera.zoom, cameraFlight.zoom, ease); camera.updateProjectionMatrix();
      animating = true;
      if (camera.position.distanceTo(cameraFlight.position) < .006 && Math.abs(camera.zoom - cameraFlight.zoom) < .001) cameraFlight = null;
    }
    for (const island of islands) {
      island.group.scale.y = THREE.MathUtils.lerp(island.group.scale.y, island.scaleTarget, ease);
      island.group.position.y = THREE.MathUtils.lerp(island.group.position.y, island.positionTarget, ease);
      if (Math.abs(island.group.scale.y - island.scaleTarget) > .001 || Math.abs(island.group.position.y - island.positionTarget) > .001) animating = true;
      island.ring.visible = (selected === island.spec.code || hovering === island.spec.code) && island.scaleTarget > .05;
    }
    // Hold the camera while dragging, flying to an island, or reading its details.
    controls.autoRotate = rotationEnabled && !interacting && !cameraFlight && !selected && time >= resumeRotationAt;
    root.dataset.autoRotating = String(controls.autoRotate);
    const controlsChanged = controls.update(dt);
    if (!reduced) ocean.uniforms.uAtlasTime.value = time / 1000;
    renderer.render(scene, camera); fitLabels();
    root.querySelector('#spatialCompass').style.transform = `rotate(${controls.getAzimuthalAngle() * 180 / Math.PI}deg)`;
    root.dataset.zoom = camera.zoom.toFixed(2); root.dataset.azimuth = controls.getAzimuthalAngle().toFixed(3);
    if (!root.dataset.ready) { root.dataset.ready = 'true'; root.querySelector('#spatialLoading').hidden = true; }
    if (!reduced || animating || controlsChanged) frame = requestAnimationFrame(render);
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

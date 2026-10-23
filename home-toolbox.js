(() => {
  const section = document.querySelector('.home-toolbox');
  if (!section) return;
  const viewport = section.querySelector('.home-toolbox-viewport');
  const group = section.querySelector('.home-toolbox-group');
  const toggle = section.querySelector('.home-toolbox-toggle');
  const duplicate = group.cloneNode(true);
  duplicate.classList.add('home-toolbox-duplicate');
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
  group.after(duplicate);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false, hovering = false, focused = false, interacting = false, visible = false;
  let frame = 0, previousTime = 0, position = 0, groupWidth = 0, resumeTimer;

  function translate() {
    const zh = document.documentElement.lang.startsWith('zh');
    section.querySelectorAll('[data-home-en]').forEach(element => {
      element.textContent = zh ? element.dataset.homeZh : element.dataset.homeEn;
    });
    section.querySelectorAll('[data-home-href-en]').forEach(link => {
      link.href = zh ? link.dataset.homeHrefZh : link.dataset.homeHrefEn;
    });
    toggle.setAttribute('aria-label', paused ? (zh ? '继续滚动工具' : 'Resume tool scrolling') : (zh ? '暂停滚动工具' : 'Pause tool scrolling'));
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.hidden = reducedMotion.matches;
  }
  function animate(time) {
    if (previousTime) {
      // Keep the same slow speed on high refresh rate displays and after tab changes.
      position = (position + Math.min(time - previousTime, 64) * 0.035) % groupWidth;
      viewport.scrollLeft = position;
    }
    previousTime = time;
    frame = requestAnimationFrame(animate);
  }
  function syncMotion() {
    cancelAnimationFrame(frame);
    previousTime = 0;
    position = viewport.scrollLeft;
    if (groupWidth > 0 && visible && !document.hidden && !reducedMotion.matches && !paused && !hovering && !focused && !interacting) {
      frame = requestAnimationFrame(animate);
    }
  }
  function resumeAfterInteraction() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { interacting = false; syncMotion(); }, 2500);
  }
  toggle.addEventListener('click', () => { paused = !paused; translate(); syncMotion(); });
  section.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovering = true; syncMotion(); } });
  section.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovering = false; syncMotion(); } });
  section.addEventListener('focusin', () => { focused = true; syncMotion(); });
  section.addEventListener('focusout', event => { focused = section.contains(event.relatedTarget); syncMotion(); });
  viewport.addEventListener('pointerdown', () => { clearTimeout(resumeTimer); interacting = true; syncMotion(); }, { passive: true });
  window.addEventListener('pointerup', () => { if (interacting) resumeAfterInteraction(); }, { passive: true });
  window.addEventListener('pointercancel', () => { if (interacting) resumeAfterInteraction(); }, { passive: true });
  viewport.addEventListener('wheel', () => { interacting = true; syncMotion(); resumeAfterInteraction(); }, { passive: true });
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', () => { translate(); syncMotion(); });
  new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  new ResizeObserver(() => { groupWidth = group.getBoundingClientRect().width; syncMotion(); }).observe(group);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncMotion(); }).observe(viewport);
  translate();
})();

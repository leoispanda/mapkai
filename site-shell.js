/* Shared public-page chrome. Product modules retain their own language and app state. */
(() => {
  const body = document.body;
  const standalone = ['speaking', 'toolbox', 'music'].includes(body.dataset.mapkaiPage);
  const language = () => document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const readTheme = () => { try { return localStorage.getItem('mapkaiTheme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; } };
  const persistTheme = theme => { try { localStorage.setItem('mapkaiTheme', theme); } catch {} };
  body.dataset.theme = readTheme();
  let panel, toggle, nav, themeGroup;
  const closeMenu = () => { if (!panel) return; panel.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); refreshLabels(); };
  function refreshLabels() {
    const zh = language() === 'zh';
    if (nav) {
      const labels = zh ? ['首页', '探索', '知识地图', '学习路径', 'MapKAI Toolbox', '关于'] : ['Home', 'Explore', 'Knowledge Map', 'Learning', 'MapKAI Toolbox', 'About'];
      nav.querySelectorAll('a').forEach((link, index) => { link.textContent = labels[index]; if (index === 4) link.href = zh ? '/toolbox/' : '/toolbox/en/'; });
      nav.setAttribute('aria-label', zh ? '主导航' : 'Site');
      toggle.setAttribute('aria-label', toggle.getAttribute('aria-expanded') === 'true' ? (zh ? '关闭菜单' : 'Close menu') : (zh ? '打开菜单' : 'Open menu'));
    }
    themeGroup?.querySelectorAll('[data-site-theme]').forEach(button => {
      button.textContent = button.dataset.siteTheme === 'light' ? (zh ? '浅色' : 'Light') : (zh ? '深色' : 'Dark');
      button.setAttribute('aria-pressed', String(button.dataset.siteTheme === body.dataset.theme));
    });
  }
  if (standalone) {
    const header = document.querySelector('.topbar');
    const brand = header?.querySelector('.brand');
    const languages = header?.querySelector('.language-switch');
    if (header && brand && languages) {
      header.classList.add('site-shell-header');
      toggle = document.createElement('button'); toggle.className = 'nav-toggle'; toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'site-shell-nav');
      for (let i = 0; i < 3; i++) toggle.append(document.createElement('span'));
      panel = document.createElement('div'); panel.id = 'site-shell-nav'; panel.className = 'nav-panel';
      nav = document.createElement('nav'); nav.className = 'nav-links';
      ['/', '/explore', '/map', '/learning', '/toolbox/', '/about'].forEach((href, index) => {
        const link = document.createElement('a'); link.href = href;
        if (index === 4) { link.className = 'nav-toolbox toolbox-link is-current'; if (body.dataset.mapkaiPage === 'toolbox') link.setAttribute('aria-current', 'page'); }
        nav.append(link);
      });
      const preferences = document.createElement('div'); preferences.className = 'nav-preferences';
      themeGroup = document.createElement('div'); themeGroup.className = 'theme-switch'; themeGroup.setAttribute('aria-label', 'Theme');
      for (const theme of ['light', 'dark']) {
        const button = document.createElement('button'); button.type = 'button'; button.dataset.siteTheme = theme;
        button.onclick = () => { body.dataset.theme = theme; persistTheme(theme); refreshLabels(); };
        themeGroup.append(button);
      }
      preferences.append(languages, themeGroup); panel.append(nav, preferences); header.replaceChildren(brand, toggle, panel);
      toggle.onclick = () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; panel.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); refreshLabels(); };
      panel.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
      document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
      document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
    }
  }
  refreshLabels();
  new MutationObserver(refreshLabels).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  new MutationObserver(refreshLabels).observe(body, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('storage', event => {
    // The main app and course own their theme state; standalone tools can follow other tabs.
    if (standalone && event.key === 'mapkaiTheme') { body.dataset.theme = readTheme(); refreshLabels(); }
  });
  // Keep one body-mounted player alive while the main app changes learning routes.
  const musicStyle = document.createElement('link');
  musicStyle.rel = 'stylesheet'; musicStyle.href = '/music/dock.css?v=car-lyrics-20261024';
  document.head.append(musicStyle);
  const startMusicDock = () => {
    const launchDock = () => {
      if (!globalThis.MapKAIMusicListening && !document.querySelector('script[src^="/music/listening.js"]')) {
        const helper = document.createElement('script');
        helper.src = '/music/listening.js?v=listening-20261021';
        helper.onload = launchDock; helper.onerror = mountDock; document.head.append(helper); return;
      }
      if (!globalThis.MapKAIMusicListening) {
        const helper = document.querySelector('script[src^="/music/listening.js"]');
        helper.addEventListener('load', mountDock, { once: true });
        helper.addEventListener('error', mountDock, { once: true }); return;
      }
      mountDock();
    };
    const mountDock = () => {
      const script = document.createElement('script');
      script.src = '/music/dock.js?v=song-names-20261024'; document.head.append(script);
    };
    const launch = () => {
      const ready = () => {
        window.dispatchEvent(new Event('mapkai:music-tempo-ready'));
        launchDock();
      };
      if (globalThis.MapKAIMusicTempo) { ready(); return; }
      const existing = document.querySelector('script[src^="/music/tempo.js"]');
      const helper = existing || document.createElement('script');
      helper.addEventListener('load', ready, { once: true });
      helper.addEventListener('error', launchDock, { once: true });
      if (!existing) {
        helper.src = '/music/tempo.js?v=bpm-estimates-20261018';
        document.head.append(helper);
      }
    };
    if (globalThis.MapKAIMusicPreferences) { launch(); return; }
    // Music includes the same helper before its app; other pages load it here.
    const existing = document.querySelector('script[src^="/music/preferences.js"]');
    const helper = existing || document.createElement('script');
    helper.addEventListener('load', launch, { once: true });
    helper.addEventListener('error', launch, { once: true });
    if (!existing) {
      helper.src = '/music/preferences.js?v=shared-votes-20261014';
      document.head.append(helper);
    }
  };
  if (globalThis.MapKAILyricsSync) startMusicDock();
  else {
    const helper = document.createElement('script');
    helper.src = '/music/lyrics-sync.js?v=car-lyrics-20261024';
    helper.onload = startMusicDock; document.head.append(helper);
  }
})();

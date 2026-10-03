/* Shared public-page chrome. Product modules retain their own language and app state. */
(() => {
  const body = document.body;
  const standalone = ['speaking', 'toolbox'].includes(body.dataset.mapkaiPage);
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
})();

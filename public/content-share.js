/* Individual works have stable links, independent of collection filters. */
(() => {
  'use strict';
  const labels = {
    zh: { song: '分享这首歌', film: '分享这个视频', video: '分享这个视频', article: '分享这篇文章', copied: '链接已复制', fallback: '复制下面的链接即可分享', close: '关闭', copy: '复制链接', open: '打开作品 ↗' },
    en: { song: 'Share this song', film: 'Share this video', video: 'Share this video', article: 'Share this article', copied: 'Link copied', fallback: 'Copy this link to share', close: 'Close', copy: 'Copy link', open: 'Open work ↗' },
  };
  const language = () => document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  let dialog;
  let currentAddress = null;
  let lastMusicTrackId = null;

  function urlFor(path) {
    const url = new URL(path, location.origin);
    if (url.origin !== location.origin) return null;
    url.search = ''; url.hash = ''; url.searchParams.set('lang', language());
    return url.href;
  }

  function reflectAddress() {
    if (!currentAddress) return;
    const href = urlFor(currentAddress.path);
    if (!href) return;
    // Replace the current collection entry so automatic queue advancement does
    // not fill browser history. A refresh opens the existing single-work page.
    if (location.href !== href) window.history.replaceState(window.history.state, '', href);
    const title = `${currentAddress.title} · MapKAI`;
    if (document.title !== title) document.title = title;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', href);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', href);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
  }

  function showAddress(path, title) {
    currentAddress = { path, title };
    try { reflectAddress(); } catch { /* The visible Open work link remains usable if history is unavailable. */ }
  }

  function syncMusicAddress() {
    const track = window.MapKAIMusicPage?.snapshot()?.track;
    if (!track || !uuid.test(track.id || '') || track.id === lastMusicTrackId) return;
    lastMusicTrackId = track.id;
    const title = String(track.title || '').replace(/^\d{3,}\s+/, '').split(' - MapKAI - ')[0];
    showAddress(`/share/song/${track.id}`, title);
  }

  function linkTitle(heading, path) {
    if (!heading || heading.closest('button, a')) return;
    let link = heading.querySelector(':scope > .content-permalink');
    if (!link) {
      link = document.createElement('a'); link.className = 'content-permalink';
      link.textContent = heading.textContent; heading.replaceChildren(link);
    }
    const href = urlFor(path);
    if (href && link.getAttribute('href') !== href) link.setAttribute('href', href);
  }

  function manualCopy(url) {
    if (!dialog) {
      dialog = document.createElement('dialog'); dialog.className = 'content-share-dialog';
      const message = document.createElement('p'), input = document.createElement('input'), close = document.createElement('button');
      input.type = 'url'; input.readOnly = true; close.type = 'button';
      close.addEventListener('click', () => dialog.close()); dialog.append(message, input, close); document.body.append(dialog);
    }
    const words = labels[language()];
    dialog.children[0].textContent = words.fallback;
    const input = dialog.children[1]; input.value = url; input.setAttribute('aria-label', words.copy);
    dialog.children[2].textContent = words.close;
    if (!dialog.open) dialog.showModal(); input.focus(); input.select();
  }

  async function share(button, copyOnly = false) {
    const url = urlFor(button.dataset.sharePath);
    if (!url || button.disabled) return;
    const title = button.dataset.shareTitle || document.title;
    button.disabled = true;
    try {
      if (!copyOnly && typeof navigator.share === 'function') {
        try { await navigator.share({ title, url }); return; }
        catch (error) { if (error?.name === 'AbortError') return; }
      }
      try {
        await navigator.clipboard.writeText(url);
        button.textContent = labels[language()].copied;
        setTimeout(() => { if (button.isConnected) button.textContent = labels[language()][copyOnly ? 'copy' : button.dataset.shareKind]; }, 2500);
      } catch { manualCopy(url); }
    } finally { button.disabled = false; }
  }

  function attach(target, path, title, kind) {
    let actions = target.querySelector(':scope > .content-share-actions');
    if (!actions) {
      actions = document.createElement('div'); actions.className = 'content-share-actions';
      for (const copyOnly of [false, true]) {
        const button = document.createElement('button'); button.type = 'button';
        button.className = copyOnly ? 'content-copy-button' : 'content-share-button';
        button.addEventListener('click', () => share(button, copyOnly)); actions.append(button);
      }
      target.append(actions);
    }
    for (const [index, button] of [...actions.children].filter(node => node.tagName === 'BUTTON').entries()) {
      button.dataset.sharePath = path; button.dataset.shareTitle = title; button.dataset.shareKind = kind;
      const text = labels[language()][index ? 'copy' : kind];
      if (button.textContent !== text && button.textContent !== labels[language()].copied) button.textContent = text;
      button.setAttribute('aria-label', `${text} · ${title}`);
    }
    if (!document.body.classList.contains('shared-work-page')) {
      let link = actions.querySelector('.content-open-link');
      if (!link) { link = document.createElement('a'); link.className = 'content-open-link'; actions.append(link); }
      link.href = urlFor(path); link.textContent = labels[language()].open;
      link.setAttribute('aria-label', `${labels[language()].open} · ${title}`);
    }
  }

  function scan() {
    document.querySelectorAll('.track-card[id^="song-"]').forEach(card => {
      const id = card.id.slice(5);
      if (uuid.test(id)) attach(card, `/share/song/${id}`, card.querySelector('.track-title')?.textContent || '', 'song');
    });
    document.querySelectorAll('.film-card[id]').forEach(card => {
      if (!slug.test(card.id)) return;
      const path = `/share/film/${card.id}`;
      linkTitle(card.querySelector('h2, h3'), path);
      attach(card.querySelector('.film-copy') || card, path, card.querySelector('h2, h3')?.textContent || '', 'film');
    });
    document.querySelectorAll('.category-song:not([hidden])').forEach(card => {
      const id = card.querySelector('[data-song-tempo-id]')?.dataset.songTempoId;
      if (uuid.test(id || '')) {
        linkTitle(card.querySelector('h2'), `/share/song/${id}`);
        attach(card.querySelector('.category-song-action') || card, `/share/song/${id}`, card.querySelector('h2')?.textContent || '', 'song');
      }
    });
    document.querySelectorAll('[data-owner-cultural-song]').forEach(play => {
      const id = play.dataset.ownerCulturalSong;
      if (uuid.test(id || '')) attach(play.parentElement, `/share/song/${id}`, play.textContent, 'song');
    });
    document.querySelectorAll('.mapkai-video-preview:not([hidden])').forEach(preview => {
      const player = preview.querySelector('video');
      if (!player?.getAttribute('src')) return;
      const url = new URL(player.getAttribute('src'), location.href), id = url.searchParams.get('field');
      if (url.origin === location.origin && url.pathname === '/api/factory/public-video' && slug.test(id || '')) {
        linkTitle(preview.querySelector('h2'), `/share/video/${id}`);
        attach(preview, `/share/video/${id}`, player.getAttribute('aria-label') || '', 'video');
      }
    });
    document.querySelectorAll('.story-detail-header[data-share-path]').forEach(header => {
      linkTitle(header.querySelector('h1'), header.dataset.sharePath);
      attach(header, header.dataset.sharePath, header.querySelector('h1')?.textContent || '', 'article');
    });
    document.querySelectorAll('[data-work-share]').forEach(work => {
      attach(work, location.pathname, document.querySelector('h1')?.textContent || '', work.dataset.workShare);
    });
    try { reflectAddress(); } catch {}
  }

  window.addEventListener('mapkai:music-update', syncMusicAddress);
  // Opening a song's details also gives the browser an address for that song.
  document.addEventListener('toggle', event => {
    if (!window.MapKAIMusicPage || !event.target.open || !event.target.classList?.contains('track-details')) return;
    const card = event.target.closest('.track-card'), id = card?.id.slice(5);
    if (uuid.test(id || '')) showAddress(`/share/song/${id}`, card.querySelector('.track-title')?.textContent || '');
  }, true);
  const filmAddress = event => {
    if (document.body.dataset?.mapkaiModule !== 'music-videos') return;
    const card = event.target.closest?.('.film-card');
    if (card && slug.test(card.id)) showAddress(`/share/film/${card.id}`, card.querySelector('h2, h3')?.textContent || '');
  };
  document.addEventListener('play', filmAddress, true);
  document.addEventListener('change', event => { if (event.target.tagName === 'SELECT') filmAddress(event); }, true);
  // Coalesce renders and ignore text churn in playback clocks and lyric lines.
  let scheduled = false;
  const observer = new MutationObserver(records => {
    if (records.every(record => record.target.closest?.('.content-share-actions, .content-share-dialog, .playback-times, .lyrics-text, .music-dock, .category-song-status'))) return;
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; scan(); });
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'data-share-path', 'data-song-tempo-id', 'hidden'] });
  new MutationObserver(scan).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  scan();
  syncMusicAddress();
})();

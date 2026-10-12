/* XIN / Nuove sezioni homepage — vanilla JS, nessun cookie e nessuna API remota. */
(() => {
  'use strict';
  const config = window.XIN_HOME_DATA || {};
  const create = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = String(text);
    return el;
  };
  const isLocalHref = value => /^#[a-z0-9_-]+$/i.test(value) || /^\.\/[a-z0-9_./-]+(?:#[a-z0-9_-]+)?$/i.test(value);
  const validSocial = value => {
    if (typeof value !== 'string') return false;
    if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value)) return true;
    try { const u = new URL(value); return u.protocol === 'https:'; } catch { return false; }
  };
  // Data: tutte le novità in un unico file modificabile, senza HTML manuale.
  const news = document.getElementById('xinUpdatesGrid');
  if (news) {
    const entries = Array.isArray(config.updates) ? config.updates.slice(0, 6) : [];
    if (entries.length) news.replaceChildren();
    entries.forEach((item, index) => {
      const article = create('article', 'xin-update-card');
      const meta = create('div', 'xin-update-meta');
      const time = create('time', '', '');
      if (typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
        const [y,m,d] = item.date.split('-').map(Number);
        time.dateTime = item.date;
        time.textContent = new Intl.DateTimeFormat('it-IT',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(y,m-1,d)));
      } else time.textContent = 'DALLO STUDIO';
      meta.append(time, create('span','', item.type || 'AGGIORNAMENTO'));
      article.append(meta, create('div', 'xin-update-index', String(index+1).padStart(2,'0')),
        create('h3', '', item.title || 'Una novità'), create('p', '', item.description || ''));
      const href = item.href;
      if (typeof href === 'string' && isLocalHref(href)) {
        const link = create('a', 'xin-update-link', item.cta || 'Scopri');
        link.setAttribute('href', href);
        link.append(create('span','',' ↗'));
        article.append(link);
      }
      news.append(article);
    });
  }
  // Competenze: ogni voce ha la stessa gerarchia visiva, senza percentuali inventate.
  const skills = document.getElementById('xinSkillsGrid');
  if (skills && Array.isArray(config.skills)) {
    config.skills.forEach(skill => {
      const item = create('div', 'xin-skill');
      const mark = create('span', 'xin-skill-mark', skill.initials || '✳');
      const tones = new Set(['peach','lavender','blue','sand','mint','cream']);
      mark.dataset.tone = tones.has(skill.tone) ? skill.tone : 'cream';
      const body = create('span', 'xin-skill-copy');
      body.append(create('strong','',skill.title || ''), create('small','',skill.area || ''));
      item.append(mark,body);
      skills.append(item);
    });
  }
  // Social: profili non impostati restano visibili, ma non cliccabili.
  const socials = document.getElementById('xinSocialLinks');
  if (socials && Array.isArray(config.social)) {
    config.social.forEach(profile => {
      const ok = validSocial(profile.url);
      const node = create(ok ? 'a' : 'div', 'xin-social-link' + (ok ? '' : ' is-unlinked'));
      if (ok) {
        node.setAttribute('href', profile.url);
        if (profile.url.startsWith('https:')) { node.target = '_blank'; node.rel = 'noopener noreferrer'; }
        node.setAttribute('aria-label', `Apri ${profile.name}`);
      }
      const desc = create('span', 'xin-social-text');
      desc.append(create('strong','',profile.name || 'Social'), create('small','',ok ? (profile.detail || '') : 'COLLEGAMENTO DA INSERIRE'));
      node.append(create('span','xin-social-icon',profile.short || '↗'), desc, create('span','xin-social-arrow',ok ? '↗' : '—'));
      socials.append(node);
    });
  }
  // Comparatore: input range nativo (tastiera) + drag sul pannello (mouse e touch).
  const stage = document.getElementById('xinCompareStage');
  const slider = document.getElementById('xinCompareRange');
  if (stage && slider) {
    const update = raw => {
      const value = Math.min(100, Math.max(0, Math.round(Number(raw) || 0)));
      slider.value = String(value);
      stage.style.setProperty('--split', value + '%');
      slider.setAttribute('aria-valuetext', `${value} per cento di illustrazione visibile`);
    };
    update(slider.value);
    slider.addEventListener('input', () => update(slider.value));
    const pointerPosition = event => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width) return;
      update(((event.clientX - rect.left) / rect.width) * 100);
    };
    stage.addEventListener('pointerdown', event => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      stage.setPointerCapture?.(event.pointerId);
      pointerPosition(event);
    });
    stage.addEventListener('pointermove', event => {
      if (stage.hasPointerCapture?.(event.pointerId)) pointerPosition(event);
    });
    stage.addEventListener('pointerup', event => {
      if (stage.hasPointerCapture?.(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    });
    stage.addEventListener('pointercancel', event => {
      if (stage.hasPointerCapture?.(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    });
  }
})();

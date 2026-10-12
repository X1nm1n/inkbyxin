/* XIN / Strumenti comuni dell'archivio: preferiti e condivisione. */
(() => {
  'use strict';
  const KEY = 'xin-study-favorites';
  const ids = () => new Set((Array.isArray(window.XIN_MATERIE) ? window.XIN_MATERIE : []).map(x => x.id));
  function favorites() {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(stored) ? stored.filter(x => typeof x === 'string' && ids().has(x)) : [];
    } catch (_) { return []; }
  }
  function isFavorite(id) { return favorites().includes(id); }
  function toggleFavorite(id) {
    const values = new Set(favorites());
    if (values.has(id)) values.delete(id); else values.add(id);
    try { localStorage.setItem(KEY, JSON.stringify([...values])); }
    catch (_) { /* Browser senza storage: restano accessibili le materie. */ return false; }
    window.dispatchEvent(new CustomEvent('xin:favorites-changed'));
    return true;
  }
  function subjectUrl(item) {
    return new URL('./materia.html?id=' + encodeURIComponent(item.id), location.href).href;
  }
  function shareLinks(item) {
    const url = subjectUrl(item);
    const message = 'Materiale di studio: ' + item.titolo + ' — XIN';
    return {
      url,
      whatsapp: 'https://wa.me/?text=' + encodeURIComponent(message + '\n' + url),
      telegram: 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(message)
    };
  }
  async function share(item) {
    const url = subjectUrl(item);
    if (navigator.share) {
      try {
        await navigator.share({title: item.titolo + ' | XIN', text: 'Appunti e materiali universitari', url});
        return 'Condivisione avviata.';
      } catch (error) { if (error?.name === 'AbortError') return ''; }
    }
    try {
      await navigator.clipboard.writeText(url);
      return 'Link copiato negli appunti.';
    } catch (_) {
      // Fallback in contesti HTTP/non sicuri: campo selezionabile dall'utente.
      window.prompt('Copia il link della materia:', url);
      return 'Link pronto per essere copiato.';
    }
  }
  window.XIN_STUDY = { favorites, isFavorite, toggleFavorite, subjectUrl, shareLinks, share };
})();

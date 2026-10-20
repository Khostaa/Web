// Apply the saved appearance before the stylesheet paints, avoiding a theme flash.
(() => {
  const key = 'khosta-theme';
  window.setPortfolioTheme = (theme, persist = false) => {
    const selected = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = selected;
    document.documentElement.style.colorScheme = selected;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = selected === 'light' ? '#f8f5ef' : '#1d1d35';
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-checked', String(selected === 'light'));
      toggle.title = selected === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    }
    if (persist) { try { localStorage.setItem(key, selected); } catch { /* Theme still works when storage is unavailable. */ } }
  };
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Keep the original dark appearance. */ }
  window.setPortfolioTheme(saved);
  window.addEventListener('storage', event => { if (event.key === key) window.setPortfolioTheme(event.newValue); });
})();

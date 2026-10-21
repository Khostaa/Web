import { parseVideo, platforms, videoRatio, safeUrl } from '../lib/media.js';
import { giftDestination, giftMarkets, suggestedGiftCountry } from '../lib/gifts.js';
const config = window.PORTFOLIO;
const ids = ['home', 'work', 'wishlist', 'about'];
const screens = ids.map(id => document.getElementById(id));
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 700px)');
const stage = document.querySelector('#stage');
let active = null;
let workPage = 0;
let workFilter = 'all';
const cards = [...document.querySelectorAll('.work-card')];
const board = document.querySelector('#projects');
const normalize = value => ({ contact: 'about', gifts: 'wishlist', start: 'home' }[value] || (ids.includes(value) ? value : 'home'));
const currentRoute = () => normalize(location.hash.slice(1));
const number = n => String(n).padStart(2, '0');

// Each screen owns its content. Inactive screens cannot receive keyboard focus.
screens.forEach(screen => {
  screen.querySelectorAll('.reveal').forEach((item, index) => item.style.setProperty('--reveal-delay', Math.min(index * 45, 315) + 'ms'));
});
function stopAnimations(node) { node.getAnimations({ subtree: true }).forEach(animation => { if (animation.effect?.target?.classList?.contains('brand-logo')) return; if (animation instanceof CSSAnimation) return; animation.cancel(); }); }
function showScreen(id, { focus = true, animate = true } = {}) {
  id = normalize(id);
  const next = document.getElementById(id);
  if (next === active) return;
  const previous = active;
  active = next;
  screens.forEach(screen => {
    stopAnimations(screen);
    screen.classList.remove('is-active', 'is-leaving');
    screen.hidden = screen !== next && screen !== previous;
    screen.inert = screen !== next;
    screen.setAttribute('aria-hidden', String(screen !== next));
  });
  if (previous) {
    if (animate && !motionPreference.matches) {
      previous.classList.add('is-leaving');
      previous.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-18px)' }], { duration: 240, easing: 'ease-out' }).finished.catch(() => {}).then(() => {
        if (previous !== active) { previous.hidden = true; previous.classList.remove('is-leaving'); }
      });
    } else previous.hidden = true;
  }
  next.hidden = false;
  next.classList.add('is-active');
  if (animate && !motionPreference.matches) next.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' });
  document.querySelectorAll('.header nav a, .screen-dots a').forEach(link => {
    if (normalize(link.hash.slice(1)) === id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const index = ids.indexOf(id);
  document.querySelector('#screen-position').textContent = number(index + 1) + ' / 04';
  document.querySelector('#screen-prev').disabled = index === 0;
  document.querySelector('#screen-next').disabled = index === ids.length - 1;
  document.title = id === 'home' ? 'Khosta — Sunil Paudel · Video Editor' : ({ work: 'Work', wishlist: 'Gifts', about: 'Reach out' }[id]) + ' — Khosta';
  if (focus) next.querySelector('h1, h2').focus({ preventScroll: true });
  if (id === 'work') requestAnimationFrame(() => layoutWork(animate));
}
function navigate(id) {
  id = normalize(id);
  if (currentRoute() !== id || !location.hash) history.pushState(null, '', '#' + id);
  showScreen(id);
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button) return;
  const route = link.hash.slice(1);
  if (ids.includes(route) || ['contact', 'gifts', 'start'].includes(route)) { event.preventDefault(); navigate(route); }
});
addEventListener('popstate', () => showScreen(currentRoute()));
addEventListener('hashchange', () => showScreen(currentRoute()));
document.querySelector('#screen-prev').addEventListener('click', () => navigate(ids[Math.max(0, ids.indexOf(active.id) - 1)]));
document.querySelector('#screen-next').addEventListener('click', () => navigate(ids[Math.min(ids.length - 1, ids.indexOf(active.id) + 1)]));

const home = document.querySelector('#home');
const choices = [...document.querySelectorAll('[data-preview-choice]')];
function previewChoice(choice) {
  home.dataset.preview = choice.dataset.previewChoice;
  choices.forEach(item => item.classList.toggle('is-selected', item === choice));
}
choices.forEach(choice => {
  choice.addEventListener('pointerenter', () => previewChoice(choice));
  choice.addEventListener('focus', () => previewChoice(choice));
  choice.addEventListener('keydown', event => {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    choices[(choices.indexOf(choice) + (event.key === 'ArrowDown' ? 1 : 2)) % 3].focus();
  });
});

// Six desktop or four mobile cards fit their native ratios into the available screen.
function layoutWork(animate = true) {
  const filtered = cards.filter(card => workFilter === 'all' || card.dataset.platform === workFilter);
  const capacity = compact.matches ? 4 : 6;
  const pages = Math.max(1, Math.ceil(filtered.length / capacity));
  workPage = Math.min(workPage, pages - 1);
  const visible = filtered.slice(workPage * capacity, (workPage + 1) * capacity);
  cards.forEach(card => { card.getAnimations().forEach(animation => animation.cancel()); card.hidden = !visible.includes(card); });
  document.querySelector('#work-page').textContent = number(workPage + 1) + ' / ' + number(pages);
  document.querySelector('#work-prev').disabled = workPage === 0;
  document.querySelector('#work-next').disabled = workPage === pages - 1;
  if (active?.id !== 'work') return;
  const tallCards = visible.filter(card => { const [w,h] = card.dataset.ratio.split(':').map(Number); return w / h < 1; }).slice(-2);
  const stacked = !compact.matches && visible.length >= 5 && tallCards.length === 2;
  const columns = stacked ? 4 : Math.max(1, Math.min(compact.matches ? 2 : 3, visible.length));
  const rows = stacked ? 2 : Math.max(1, Math.ceil(visible.length / columns));
  board.style.gridTemplateColumns = stacked ? '1.15fr 1.15fr 1fr .8fr' : 'repeat(' + columns + ', minmax(0, 1fr))';
  board.style.gridTemplateRows = 'repeat(' + rows + ', minmax(0, 1fr))';
  let shortIndex = 0;
  visible.forEach(card => {
    if (stacked && tallCards.includes(card)) {
      card.style.gridColumn = String(3 + tallCards.indexOf(card)); card.style.gridRow = '1 / 3';
    } else if (stacked) {
      card.style.gridColumn = String(1 + Math.floor(shortIndex / 2)); card.style.gridRow = String(1 + shortIndex % 2); shortIndex++;
    } else { card.style.gridColumn = ''; card.style.gridRow = ''; }
  });
  const bounds = board.getBoundingClientRect();
  visible.forEach(card => {
    const [w,h] = card.dataset.ratio.split(':').map(Number);
    const box = card.getBoundingClientRect();
    const height = Math.max(30, Math.floor(Math.min(box.height - 48, box.width * h / w)));
    card.style.setProperty('--media-h', height + 'px');
    card.style.setProperty('--media-w', Math.floor(height * w / h) + 'px');
  });
  if (animate && !motionPreference.matches) {
    const originX = bounds.left + bounds.width * .5;
    const originY = bounds.top + bounds.height * .5;
    visible.forEach((card, index) => {
      const box = card.getBoundingClientRect();
      const dx = originX - box.left - box.width / 2;
      const dy = originY - box.top - box.height / 2;
      card.animate([
        { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (index % 2 ? 18 : -18) + 'deg) scale(.08)', opacity: 0 },
        { transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1 }
      ], { duration: 950, delay: index * 55, easing: 'cubic-bezier(.16,.85,.2,1)', fill: 'backwards' });
    });
  }
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  workFilter = button.dataset.filter; workPage = 0;
  document.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  layoutWork();
}));
document.querySelector('#work-prev').addEventListener('click', () => { workPage--; layoutWork(); });
document.querySelector('#work-next').addEventListener('click', () => { workPage++; layoutWork(); });
let resizeFrame;
new ResizeObserver(() => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(() => layoutWork(false)); }).observe(stage);

// The social collection stays within the slide, including small phone screens.
const socialLinks = [...document.querySelectorAll('.social-links a')];
let socialPage = 0;
function renderSocials() {
  const pages = Math.max(1, Math.ceil(socialLinks.length / 4));
  socialLinks.forEach((link, index) => link.hidden = Math.floor(index / 4) !== socialPage);
  document.querySelector('#social-page').textContent = number(socialPage + 1) + ' / ' + number(pages);
  document.querySelector('#social-prev').disabled = socialPage === 0;
  document.querySelector('#social-next').disabled = socialPage === pages - 1;
  document.querySelector('.social-pager').hidden = socialLinks.length <= 4;
}
document.querySelector('#social-prev').addEventListener('click', () => { socialPage--; renderSocials(); });
document.querySelector('#social-next').addEventListener('click', () => { socialPage++; renderSocials(); });
renderSocials();

const giftItems = [...document.querySelectorAll('.gift-item')];
const countryPicker = document.querySelector('#gift-country');
let giftPage = 0;
function renderGifts() {
  if (!giftItems.length) return;
  const capacity = compact.matches ? 1 : 3;
  const pages = Math.ceil(giftItems.length / capacity);
  giftPage = Math.max(0, Math.min(giftPage, pages - 1));
  giftItems.forEach((item,index) => { item.hidden = Math.floor(index / capacity) !== giftPage; });
  document.querySelector('#gift-page').textContent = number(giftPage + 1) + ' / ' + number(pages);
  document.querySelector('#gift-prev').disabled = giftPage === 0;
  document.querySelector('#gift-next').disabled = giftPage === pages - 1;
  document.querySelector('#gift-pager').hidden = pages <= 1;
}
if (countryPicker) {
  let country;
  try { country = localStorage.getItem('khosta-gift-country'); } catch {}
  if (!giftMarkets[country]) country = suggestedGiftCountry(navigator.languages || [navigator.language], Intl.DateTimeFormat().resolvedOptions().timeZone);
  countryPicker.value = country;
  const updateStores = () => {
    const region = countryPicker.value;
    giftItems.forEach(item => {
      const gift = config.gifts.filter(gift => safeUrl(gift.url))[Number(item.dataset.giftIndex)];
      const destination = giftDestination(gift, region);
      const link = item.querySelector('a');
      link.href = destination.url;
      link.setAttribute('aria-label', gift.title + (gift.variant ? ', ' + gift.variant : '') + ': ' + destination.label.replace(' ↗', '') + ' (opens in new tab)');
      item.querySelector('.gift-store').textContent = destination.label;
    });
    document.querySelector('#gift-store-note').textContent = region === 'GLOBAL' ? 'Choose a country for local store results. Other regions: choose your location on the brand website.' : 'Stores for ' + giftMarkets[region][0] + '. Check the model, configuration and availability at the store.';
  };
  updateStores();
  countryPicker.addEventListener('change', () => { updateStores(); try { localStorage.setItem('khosta-gift-country', countryPicker.value); } catch {} });
  document.querySelector('#gift-prev').addEventListener('click', () => { giftPage--; renderGifts(); });
  document.querySelector('#gift-next').addEventListener('click', () => { giftPage++; renderGifts(); });
  compact.addEventListener('change', () => { giftPage = 0; renderGifts(); });
  renderGifts();
}

// Load a video only on demand, and remove it on close to stop playback.
const dialog = document.querySelector('#video-dialog');
const player = document.querySelector('#video-player');
function playVideo(url, title, aspectRatio) {
  const parsed = parseVideo(url); if (!parsed) return;
  document.querySelector('#video-title').textContent = title;
  document.querySelector('#video-platform').textContent = (platforms[parsed.platform] || 'SHOWREEL').toUpperCase();
  document.querySelector('#video-description').textContent = 'If the player is unavailable, open the video on its original platform.';
  const original = document.querySelector('#original-link'); original.href = parsed.original; original.textContent = 'Watch on ' + (platforms[parsed.platform] || 'original platform') + ' ↗';
  const [w,h] = videoRatio(aspectRatio, parsed.platform, url).split(':').map(Number);
  player.style.setProperty('--video-aspect', w + ' / ' + h); player.style.setProperty('--video-ratio', String(w / h));
  const media = document.createElement(parsed.platform === 'file' ? 'video' : 'iframe');
  if (parsed.platform === 'file') { media.controls = true; media.autoplay = true; media.playsInline = true; media.preload = 'none'; }
  else { media.title = title; media.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture'; media.allowFullscreen = true; media.referrerPolicy = 'strict-origin-when-cross-origin'; }
  media.src = parsed.src; player.replaceChildren(media); dialog.showModal();
}
document.querySelectorAll('[data-video-url]').forEach(button => button.addEventListener('click', () => playVideo(button.dataset.videoUrl, button.dataset.videoTitle, button.dataset.videoRatio)));
dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { player.querySelector('video')?.pause(); player.replaceChildren(); });
document.addEventListener('keydown', event => {
  if (dialog.open || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable]')) return;
  if (event.key === 'Escape' && active.id !== 'home') { event.preventDefault(); navigate('home'); }
  if (['ArrowLeft', 'ArrowRight'].includes(event.key) && !event.target.closest('a, button')) { event.preventDefault(); const index = ids.indexOf(active.id) + (event.key === 'ArrowRight' ? 1 : -1); if (ids[index]) navigate(ids[index]); }
});
document.querySelector('#copy-email').addEventListener('click', async () => { const status = document.querySelector('#copy-status'); try { await navigator.clipboard.writeText(config.email); status.textContent = 'Email copied.'; } catch { status.textContent = config.email; } });
window.setPortfolioTheme(document.documentElement.dataset.theme);
document.querySelector('#theme-toggle').addEventListener('click', () => window.setPortfolioTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true));
const logoObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.dataset.logoVisible = String(entry.isIntersecting)), { rootMargin: '40px' });
document.querySelectorAll('.brand-logo:not(.logo-static)').forEach(mark => logoObserver.observe(mark));
document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('motion-paused', document.hidden));
showScreen(currentRoute(), { focus: false, animate: false });
motionPreference.addEventListener('change', () => { if (motionPreference.matches) screens.forEach(stopAnimations); });

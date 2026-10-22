import { parseVideo, platforms, videoRatio, safeUrl } from '../lib/media.js';
import { createWorkWall } from './work-wall.js';
import { giftDestination, giftMarkets, suggestedGiftCountry } from '../lib/gifts.js';
const config = window.PORTFOLIO;
const ids = ['home', 'work', 'wishlist', 'about'];
const screens = ids.map(id => document.getElementById(id));
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 700px)');
const stage = document.querySelector('#stage');
let active = null;
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
  document.querySelector('#screen-prev').disabled = index === 0;
  document.querySelector('#screen-next').disabled = index === ids.length - 1;
  document.title = 'Sunil Paudel - Visuals & Editing';
  if (focus) next.querySelector('h1, h2').focus({ preventScroll: true });
  wall.setActive(id === 'work', animate);
  if (id === 'wishlist') requestAnimationFrame(() => renderGifts(animate));
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
document.querySelector('#screen-prev').addEventListener('click', () => { const previous = ids[ids.indexOf(active.id) - 1]; if (previous) navigate(previous); });
document.querySelector('#screen-next').addEventListener('click', () => { const next = ids[ids.indexOf(active.id) + 1]; if (next) navigate(next); });

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

const wall = createWorkWall({ board, cards, motionPreference, onPlay: button => playVideo(button.dataset.videoUrl,button.dataset.videoTitle,button.dataset.videoRatio,button.dataset.videoSource) });

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
function renderGifts(animate = true) {
  if (!giftItems.length) return;
  const capacity = 6;
  const pages = Math.ceil(giftItems.length / capacity);
  giftPage = Math.max(0, Math.min(giftPage, pages - 1));
  giftItems.forEach((item,index) => { item.hidden = Math.floor(index / capacity) !== giftPage; });
  document.querySelector('#gift-page').textContent = number(giftPage + 1) + ' / ' + number(pages);
  document.querySelector('#gift-prev').disabled = giftPage === 0;
  document.querySelector('#gift-next').disabled = giftPage === pages - 1;
  document.querySelector('#gift-pager').hidden = pages <= 1;
  if (animate && active?.id === 'wishlist') rollout(giftItems.filter(item => !item.hidden), document.querySelector('#gifts'));
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

// Native transform/opacity animation; no animation library or persistent frame loop.
function rollout(items, container) {
  items.forEach(item => item.getAnimations().forEach(animation => animation.cancel()));
  if (motionPreference.matches) return;
  const bounds = container.getBoundingClientRect();
  items.forEach((item,index) => {
    const box = item.getBoundingClientRect();
    item.animate([
      {opacity:0,transform:'translate('+(bounds.left+bounds.width/2-box.left-box.width/2)+'px,'+(bounds.top+bounds.height/2-box.top-box.height/2)+'px) rotate('+(index%2?16:-16)+'deg) scale(.08)'},
      {opacity:1,transform:'none'}
    ],{duration:950,delay:index*55,easing:'cubic-bezier(.16,.85,.2,1)',fill:'backwards'});
  });
}

// A swipe pages the active collection first, then moves to the adjacent screen.
function advanceCollection(direction) {
  if (active.id === 'work') { wall.step(direction); return; }
  if (active.id === 'wishlist') {
    const pages = Math.ceil(giftItems.length / 6);
    if (giftPage + direction >= 0 && giftPage + direction < pages) { giftPage += direction; renderGifts(); return; }
  }
  if (active.id === 'about') {
    const pages = Math.ceil(socialLinks.length / 4);
    if (socialPage + direction >= 0 && socialPage + direction < pages) { socialPage += direction; renderSocials(); return; }
  }
  const next = ids[ids.indexOf(active.id) + direction];
  if (next) navigate(next);
}
let gesture = null;
let suppressClickUntil = 0;
stage.addEventListener('dragstart', event => event.preventDefault());
stage.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || event.target.closest('input,textarea,select,button:not(.work-media),.choices,[contenteditable]')) return;
  gesture = { id:event.pointerId, x:event.clientX, y:event.clientY, horizontal:false };
});
stage.addEventListener('pointermove', event => {
  if (!gesture || event.pointerId !== gesture.id) return;
  const dx=event.clientX-gesture.x, dy=event.clientY-gesture.y;
  if (!gesture.horizontal && Math.abs(dx)>12 && Math.abs(dx)>Math.abs(dy)*1.4) {
    gesture.horizontal=true; stage.setPointerCapture(event.pointerId); stage.classList.add('is-dragging');
  }
});
function finishGesture(event) {
  if (!gesture || event.pointerId !== gesture.id) return;
  const dx=event.clientX-gesture.x, dy=event.clientY-gesture.y;
  const dragged=gesture.horizontal;
  stage.classList.remove('is-dragging');
  if(stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  gesture=null;
  if (dragged) {
    suppressClickUntil=performance.now()+350;
    if(event.type==='pointerup' && Math.abs(dx)>=60 && Math.abs(dx)>Math.abs(dy)*1.4) advanceCollection(dx<0?1:-1);
  }
}
window.addEventListener('pointerup',finishGesture);
window.addEventListener('pointercancel',finishGesture);
stage.addEventListener('lostpointercapture',event => {if(event.target===stage){gesture=null;stage.classList.remove('is-dragging');}});
stage.addEventListener('click',event => {
  if(performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();return;}
  const gift=event.target.closest('.gift-item');
  if(gift && matchMedia('(hover: none)').matches && !gift.classList.contains('is-inspected')){
    event.preventDefault(); giftItems.forEach(item=>item.classList.toggle('is-inspected',item===gift));
  }
},true);

document.querySelector('#home-showreel').addEventListener('click',()=>playVideo(config.showreelUrl,'Make it Exist','16:9'));

// Load a video only on demand, and remove it on close to stop playback.
const dialog = document.querySelector('#video-dialog');
const player = document.querySelector('#video-player');
function playVideo(url, title, aspectRatio, mediaUrl) {
  const originalVideo = parseVideo(url); if (!originalVideo) return;
  const directVideo = parseVideo(mediaUrl);
  const parsed = directVideo?.platform === 'file' ? directVideo : originalVideo;
  wall.setPlaying(true);
  document.querySelector('#video-title').textContent = title;
  document.querySelector('#video-platform').textContent = (platforms[originalVideo.platform] || 'SHOWREEL').toUpperCase();
  document.querySelector('#video-description').textContent = directVideo?.platform === 'file' ? 'Watch here, or open the original project below.' : 'If the player is unavailable, open the video on its original platform.';
  const original = document.querySelector('#original-link'); original.href = originalVideo.original; original.textContent = 'Watch on ' + (platforms[originalVideo.platform] || 'original platform') + ' ↗';
  const [w,h] = videoRatio(aspectRatio, originalVideo.platform, url).split(':').map(Number);
  player.style.setProperty('--video-aspect', w + ' / ' + h); player.style.setProperty('--video-ratio', String(w / h));
  const media = document.createElement(parsed.platform === 'file' ? 'video' : 'iframe');
  if (parsed.platform === 'file') { media.controls = true; media.autoplay = true; media.playsInline = true; media.preload = 'none'; }
  else { media.title = title; media.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture'; media.allowFullscreen = true; media.referrerPolicy = 'strict-origin-when-cross-origin'; }
  media.src = parsed.src; player.replaceChildren(media); dialog.showModal();
}
dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { const video = player.querySelector('video'); if (video) { video.pause(); video.removeAttribute('src'); video.load(); } player.replaceChildren(); wall.setPlaying(false); });
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

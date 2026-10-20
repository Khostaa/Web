import { platforms, defaults, placeholderRatios, videoRatio, safeUrl, parseVideo } from '../lib/media.js';
const config = window.PORTFOLIO;
function element(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
const dialog = document.querySelector('#video-dialog');
const player = document.querySelector('#video-player');
function playVideo(url, title, demo = false, aspectRatio) {
  const parsed = parseVideo(url); if (!parsed) return;
  document.querySelector('#video-title').textContent = title;
  document.querySelector('#video-platform').textContent = demo ? 'SAMPLE REEL / DEMO FOOTAGE' : (platforms[parsed.platform] || 'SHOWREEL').toUpperCase();
  document.querySelector('#video-description').textContent = demo ? 'Sample footage for the portfolio preview. This is not Khosta’s original work.' : 'If the player is unavailable or requires sign-in, open the video on its original platform.';
  const original = document.querySelector('#original-link'); original.href = parsed.original; original.textContent = parsed.platform === 'file' ? 'Open video ↗' : `Watch on ${platforms[parsed.platform]} ↗`;
  const ratio = videoRatio(aspectRatio, parsed.platform, url);
  const [width, height] = ratio.split(':').map(Number);
  player.replaceChildren(); player.classList.remove('vertical');
  player.style.setProperty('--video-aspect', `${width} / ${height}`);
  player.style.setProperty('--video-ratio', String(width / height));
  let media;
  if (parsed.platform === 'file') { media = document.createElement('video'); media.controls = true; media.autoplay = true; media.playsInline = true; media.preload = 'none'; }
  else { media = document.createElement('iframe'); media.title = title; media.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture'; media.allowFullscreen = true; media.referrerPolicy = 'strict-origin-when-cross-origin'; }
  media.src = parsed.src; player.append(media); dialog.showModal(); document.body.style.overflow = 'hidden';
}
function closeVideo() { dialog.close(); }
dialog.querySelector('.close-dialog').addEventListener('click', closeVideo);
dialog.addEventListener('click', event => { if (event.target === dialog) { const b = dialog.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) closeVideo(); } });
dialog.addEventListener('close', () => { const video = player.querySelector('video'); if (video) video.pause(); player.replaceChildren(); document.body.style.overflow = ''; });
const reel = document.querySelector('#reel-button');
const hasReel = Boolean(parseVideo(config.showreelUrl));
if (hasReel) { document.querySelector('#reel-label').textContent = 'PLAY SHOWREEL ↗'; document.querySelector('#reel-caption').textContent = 'SUNIL PAUDEL / KHOSTA'; reel.setAttribute('aria-label', 'Play Khosta’s showreel'); }
reel.addEventListener('click', () => playVideo(hasReel ? config.showreelUrl : 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', hasReel ? 'Khosta / Showreel' : 'A little taste of the feeling', !hasReel));
const validVideos = config.videos.filter(v => parseVideo(v.url));
document.querySelector('#work-count').textContent = String(validVideos.length).padStart(2, '0');
function createProject(platform, video, placeholderRatio) {
  const preset = defaults[platform] || defaults.youtube;
  const article = element('article', 'project');
  const cover = element(video ? 'button' : 'div', 'project-cover');
  const ratio = videoRatio(video?.aspectRatio || video?.ratio || placeholderRatio, platform, video?.url);
  cover.style.aspectRatio = ratio.replace(':', ' / ');
  article.dataset.ratio = ratio;
  if (video) cover.classList.add('has-video');
  const image = element('img'); const imagePath = video?.thumbnail || preset.image; const optimized = window.PORTFOLIO_IMAGES?.[imagePath]; image.src = optimized?.src || imagePath; if (optimized) { image.srcset = optimized.srcset; image.sizes = '(max-width: 700px) calc(100vw - 38px), 380px'; image.width = optimized.width; image.height = optimized.height; } image.decoding = 'async'; image.alt = ''; image.loading = 'lazy'; cover.append(image, element('span', 'cover-shade'), element('span', 'platform-tag', platforms[platform] || 'Film'));
  cover.append(element('span', 'ratio-tag', ratio));
  if (video) { cover.setAttribute('aria-label', `Play ${video.title}, ${ratio}`); const play = element('span', 'play-circle'); play.setAttribute('aria-hidden', 'true'); play.textContent = '▶'; cover.append(play); cover.addEventListener('click', () => playVideo(video.url, video.title, false, ratio)); }
  else { const type = element('span', 'cover-type', preset.line); type.append(element('em', '', preset.italic)); cover.append(type, element('span', 'coming-badge', 'COMING SOON')); }
  const info = element('div', 'project-info'); const labels = element('div'); labels.append(element('h3', '', video?.title || preset.title), element('p', '', video ? [video.category, video.year].filter(Boolean).join(' / ') : `${preset.category} / Coming soon`)); info.append(labels, element('span', '', video ? '↗' : '—')); article.append(cover, info); return article;
}
function renderProjects(filter) {
  const grid = document.querySelector('#projects'); grid.replaceChildren();
  const selectedPlatforms = filter === 'all' ? Object.keys(platforms) : [filter];
  selectedPlatforms.forEach(platform => {
    const lane = element('div', 'project-lane');
    const videos = validVideos.filter(v => (v.platform || parseVideo(v.url)?.platform) === platform);
    if (videos.length) videos.forEach(v => lane.append(createProject(platform, v)));
    else placeholderRatios[platform].forEach(ratio => lane.append(createProject(platform, undefined, ratio)));
    grid.append(lane);
  });
  document.querySelector('#work-footnote').textContent = validVideos.length ? 'Pick a film. Stay for the feeling.' : 'The next chapter is on its way. Original work coming soon.';
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); }); renderProjects(button.dataset.filter); }));
document.querySelectorAll('#projects [data-video-url]').forEach(button => button.addEventListener('click', () => playVideo(button.dataset.videoUrl, button.dataset.videoTitle, false, button.dataset.videoRatio)));
if (!document.querySelector('#projects')?.hasAttribute('data-prerendered')) renderProjects('all');
const gifts = config.gifts.filter(g => safeUrl(g.url));
const giftArea = document.querySelector('#gifts');
if (!gifts.length) { giftArea.className = 'wishlist-empty'; const icon = element('span', 'gift-icon'); icon.setAttribute('aria-hidden', 'true'); icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 10h16v11H4zM2 6h20v4H2zM12 6v15M12 6C5 6 5 1 8 2c2 0 4 4 4 4Zm0 0c7 0 7-5 4-4-2 0-4 4-4 4Z"/></svg>'; const text = element('div'); text.append(element('h3', '', 'Nothing on the list. Just good energy.'), element('p', '', 'A few wishes might find their way here soon. Until then, thanks for being here.')); giftArea.append(icon, text); }
else { giftArea.className = 'gift-list'; gifts.forEach(g => { const item = element('article', 'gift-item'); const link = element('a', '', 'View gift ↗'); link.href = g.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; item.append(element('h3', '', g.title), element('p', '', g.note), link); giftArea.append(item); }); }
document.querySelector('#email-link').href = `mailto:${config.email}`;
document.querySelector('#email-link').replaceChildren(document.createTextNode(config.email + ' '), element('span', '', '↗'));
document.querySelector('#phone-link').href = `tel:${config.phone}`; document.querySelector('#phone-link').textContent = config.phoneDisplay;
document.querySelector('#copy-email').addEventListener('click', async () => { const status = document.querySelector('#copy-status'); try { await navigator.clipboard.writeText(config.email); status.textContent = 'Email copied. Let’s make something great.'; } catch { status.textContent = config.email; } });
document.querySelector('#year').textContent = new Date().getFullYear();
window.setPortfolioTheme(document.documentElement.dataset.theme);
document.querySelector('#theme-toggle').addEventListener('click', () => {
  window.setPortfolioTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true);
});

// Observe visibility only; CSS handles every animation frame on the compositor.
const logoMarks = document.querySelectorAll('.brand-logo:not(.logo-static)');
if ('IntersectionObserver' in window) {
  const logoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { entry.target.dataset.logoVisible = String(entry.isIntersecting); });
  }, { rootMargin: '40px' });
  logoMarks.forEach(mark => logoObserver.observe(mark));
} else {
  logoMarks.forEach(mark => { mark.dataset.logoVisible = 'true'; });
}
document.addEventListener('visibilitychange', () => {
  document.documentElement.classList.toggle('motion-paused', document.hidden);
});

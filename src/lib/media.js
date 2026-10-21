const platforms = { youtube: 'YouTube', instagram: 'Instagram', tiktok: 'TikTok' };
const defaults = {
  youtube: { image: 'assets/story.jpg', line: 'A little longer.', italic: 'A little deeper.', title: 'Stories that deserve the time', category: 'YouTube films' },
  instagram: { image: 'assets/social.jpg', line: 'Small moments.', italic: 'Big feelings.', title: 'A story in every scroll', category: 'Instagram reels' },
  tiktok: { image: 'assets/motion.jpg', line: 'Find the rhythm.', italic: 'Make it yours.', title: 'Made to move you', category: 'TikTok edits' }
};
const supportedRatios = ['9:16', '16:9', '4:3', '1:1', '3:4'];
const placeholderRatios = { youtube: ['16:9', '4:3'], instagram: ['1:1', '3:4'], tiktok: ['9:16'] };
function videoRatio(value, platform = 'youtube', url = '') {
  const requested = String(value || '').replace(/\s/g, '').replace('/', ':');
  if (supportedRatios.includes(requested)) return requested;
  if (platform === 'tiktok' || /\/(shorts|reel|reels)\//.test(url)) return '9:16';
  return platform === 'instagram' ? '1:1' : '16:9';
}
function safeUrl(value) { try { const u = new URL(value); return u.protocol === 'https:' || u.protocol === 'http:' ? u : null; } catch { return null; } }
function parseVideo(value) {
  if (typeof value === 'string' && /^\/media\/[\w.-]+\.mp4$/i.test(value)) return { platform: 'file', src: value, original: value };
  const u = safeUrl(value); if (!u) return null;
  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'youtu.be'].includes(host)) {
    const id = host === 'youtu.be' ? u.pathname.split('/')[1] : u.searchParams.get('v') || u.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1];
    if (id && /^[\w-]{11}$/.test(id)) return { platform: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, original: u.href };
  }
  if (host === 'instagram.com') {
    const match = u.pathname.match(/^\/(p|reel|reels|tv)\/([\w-]+)/);
    if (match) return { platform: 'instagram', src: `https://www.instagram.com/${match[1] === 'reels' ? 'reel' : match[1]}/${match[2]}/embed/`, original: u.href };
  }
  if (host === 'tiktok.com' || host === 'm.tiktok.com') {
    const id = u.pathname.match(/\/video\/(\d+)/)?.[1];
    if (id) return { platform: 'tiktok', src: `https://www.tiktok.com/player/v1/${id}?autoplay=1`, original: u.href };
  }
  if (/\.mp4$/i.test(u.pathname)) return { platform: 'file', src: u.href, original: u.href };
  return null;
}

export { platforms, defaults, supportedRatios, placeholderRatios, videoRatio, safeUrl, parseVideo };

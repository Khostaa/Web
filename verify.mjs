import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parseVideo, videoRatio } from './src/lib/media.js';
import { giftDestination, suggestedGiftCountry, giftMarkets } from './src/lib/gifts.js';
const examples = [
 ['https://www.youtube.com/watch?v=dQw4w9WgXcQ','youtube'],
 ['https://youtu.be/dQw4w9WgXcQ?t=3','youtube'],
 ['https://www.youtube.com/shorts/dQw4w9WgXcQ','youtube'],
 ['https://www.instagram.com/reel/ABC_test-123/?igsh=abc','instagram'],
 ['https://www.instagram.com/p/ABC_test-123/','instagram'],
 ['https://www.tiktok.com/@editor/video/7123456789012345678','tiktok'],
 ['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4','file'],
 ['javascript:alert(1)',null], ['https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ',null],
 ['https://www.youtube.com/watch?v=invalid',null], ['https://example.com',null]
];
for(const [url,expected] of examples) assert.equal(parseVideo(url)?.platform??null,expected,url);
for(const ratio of ['9:16','16:9','4:3','1:1','3:4']) assert.equal(videoRatio(ratio,'youtube'),ratio);
assert.equal(videoRatio('4 / 3','instagram'),'4:3');
assert.equal(videoRatio(undefined,'youtube','https://youtube.com/shorts/dQw4w9WgXcQ'),'9:16');
assert.equal(videoRatio(undefined,'instagram','https://instagram.com/reel/ABC/'),'9:16');
assert.equal(videoRatio(undefined,'instagram','https://instagram.com/p/ABC/'),'1:1');
assert.equal(videoRatio(undefined,'tiktok'),'9:16');
assert.equal(videoRatio('invalid','youtube'),'16:9');
const html=fs.readFileSync('dist/index.html','utf8');
assert.ok(html.includes('Astro v7.4.1'),'Astro static build');
assert.ok(!html.includes('<iframe'),'Players only load on demand');
assert.ok(!html.includes('astro-island'),'No hydrated framework runtime');
assert.ok(html.includes('data-prerendered'),'Gallery is present in initial HTML');
// Actual project ratios are checked below; all five supported ratios are covered by parser tests above.
assert.ok(html.includes('srcset=')&&html.includes('.webp'),'Responsive optimized images');
assert.ok(html.includes('logo-static'),'Tan mark stays static');
assert.ok(fs.readdirSync('dist/_astro').filter(file=>file.endsWith('.webp')).length>=10);
for(const file of ['logo.svg','logo-center.svg','logo-outer.svg']) {
  const svg=fs.readFileSync('dist/assets/'+file,'utf8');
  assert.ok(svg.includes('viewBox="750 750 3000 3000"'));
  assert.ok(!svg.includes('data:image'),'Native vector source');
}
const content=JSON.parse(fs.readFileSync('src/data/portfolio.json','utf8'));
if (parseVideo(content.showreelUrl)) {
  assert.ok(html.includes('Play Khosta’s showreel'),'Real showreel is prerendered');
  assert.ok(!html.includes('DEMO FOOTAGE · NOT MY WORK'),'Real showreel has no demo disclaimer');
}
assert.ok(html.includes('alt="Sunil Paudel, also known as Khosta, video editor"'),'Portrait has accessible description');
assert.ok(fs.readdirSync('dist/_astro').some(file=>file.startsWith('sunil-portrait.')&&file.endsWith('.webp')),'Portrait is optimized');
for (const gift of content.gifts) { assert.ok(html.includes(gift.title), 'Gift prerendered: '+gift.title); assert.ok(gift.url.startsWith('https://')); }
if(content.gifts.length) assert.ok(html.includes('id="gift-country"'), 'Country selector is prerendered');
for(const gift of content.gifts.filter(gift=>gift.image)) assert.ok(fs.readdirSync('dist/_astro').some(file=>file.startsWith(gift.image+'.')&&file.endsWith('.webp')), 'Gift photography is optimized: '+gift.image);
assert.equal(content.email,'mailkhosta@gmail.com');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(new Set(ids).size,ids.length,'Unique section and control IDs');
for(const screen of ['home','work','wishlist','about']) assert.ok(html.includes('id="'+screen+'"'), 'Screen exists: '+screen);
assert.ok(html.includes('data-preview-choice="work"'),'Intent selector exists');
console.log('Passed: URL parsing, all five ratios, prerendered gallery, responsive WebP assets, no hydrated framework, contact details, and SVG logo assets.');

for (const [country,market] of Object.entries(giftMarkets)) for(const gift of content.gifts) {
 const result=giftDestination(gift,country);const url=new URL(result.url);assert.equal(url.protocol,'https:');
 if(market[2]&&!gift.regionalUrls?.[country]){assert.equal(url.hostname,new URL(market[2]).hostname);assert.equal(url.searchParams.get(market[3]),gift.query||gift.title);}
}
assert.equal(suggestedGiftCountry(['en-US'],'Asia/Katmandu'),'NP');
assert.equal(suggestedGiftCountry(['en-GB'],'Europe/London'),'GB');
assert.equal(suggestedGiftCountry(['not_a_locale']),'GLOBAL');
assert.equal(giftDestination({title:'Example',url:'javascript:alert(1)'},'GLOBAL').url,null);
console.log('Passed: regional gift destinations, locale fallback, safe URLs and optimized gift assets.');

assert.ok(html.includes('Freelance Video Editor / Filmmaker'),'Footer profession updated');
assert.ok(html.includes('class="platform-icon"'),'Platform filters have vector icons');
assert.ok(html.includes('class="work-body"'),'Work rail and gallery are grouped');

const workUrls=new Set();
for(const video of content.videos){
 const parsed=parseVideo(video.url);assert.ok(parsed, 'Valid work URL: '+video.url);assert.equal(parsed.platform,video.platform);
 assert.ok(!workUrls.has(video.url),'No duplicate work URL');workUrls.add(video.url);
 assert.ok(html.includes('data-video-url="'+video.url+'"'),'Work is playable: '+video.title);
 assert.ok(html.includes('data-ratio="'+videoRatio(video.aspectRatio,video.platform,video.url)+'"'),'Correct project ratio');
 const file=video.thumbnail.startsWith('/assets/') ? 'public'+video.thumbnail : 'src/'+video.thumbnail;
 assert.ok(fs.existsSync(file),'Local cover exists: '+video.title);
}
if(['youtube','instagram','tiktok'].every(platform=>content.videos.some(video=>video.platform===platform)))assert.ok(!html.includes('COMING SOON'),'No placeholder cards when all platforms have real work');
console.log('Passed: configured work URLs, platform matches, local cover assets and native project ratios.');

assert.equal([...html.matchAll(/data-video-url=/g)].length,content.videos.filter(video=>parseVideo(video.url)).length+(parseVideo(content.showreelUrl)?1:0),'One playable card per project, plus showreel');
assert.ok(!html.includes('tiktok.com/embed.js'),'No eager TikTok embed script');

for(const video of content.videos){assert.ok(['short','long'].includes(video.format));if(video.mediaUrl){assert.equal(parseVideo(video.mediaUrl)?.platform,'file');assert.ok(fs.statSync('public'+video.mediaUrl).size<24*1024*1024);assert.ok(html.includes('data-video-source="'+video.mediaUrl+'"'));}}
assert.equal(content.videos.filter(v=>v.format==='long').length,2);
assert.ok(!html.includes('<video'),'Native players also load on demand');
for(const name of ['DaVinci Resolve','Fusion','Canva','Affinity','Illustrator','Photoshop'])assert.ok(html.includes('aria-label="'+name+'"'));
assert.equal(parseVideo('/media/../secret.mp4'),null);

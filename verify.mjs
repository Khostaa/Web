import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parseVideo, videoRatio } from './src/lib/media.js';
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
for(const ratio of ['9:16','16:9','4:3','1:1','3:4']) assert.ok(html.includes(`data-ratio="${ratio}"`),ratio);
assert.ok(html.includes('srcset=')&&html.includes('.webp'),'Responsive optimized images');
assert.ok(html.includes('logo-static'),'Tan mark stays static');
assert.ok(fs.readdirSync('dist/_astro').filter(file=>file.endsWith('.webp')).length>=10);
for(const file of ['logo.svg','logo-center.svg','logo-outer.svg']) {
  const svg=fs.readFileSync('dist/assets/'+file,'utf8');
  assert.ok(svg.includes('viewBox="750 750 3000 3000"'));
  assert.ok(!svg.includes('data:image'),'Native vector source');
}
const content=JSON.parse(fs.readFileSync('src/data/portfolio.json','utf8'));
assert.equal(content.gifts.length,0);assert.equal(content.email,'mailkhosta@gmail.com');
console.log('Passed: URL parsing, all five ratios, prerendered gallery, responsive WebP assets, no hydrated framework, contact details, and SVG logo assets.');

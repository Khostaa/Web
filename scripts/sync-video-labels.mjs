import fs from 'node:fs';
const file='src/data/portfolio.json';
const content=JSON.parse(fs.readFileSync(file,'utf8'));
const worksheet=fs.readFileSync('VIDEO-LABELS.md','utf8');
let changed=0,labeled=0;
for(const block of worksheet.split(/^### /m).slice(1)) {
  const url=block.match(/\[Open video\]\((https:\/\/[^)]+)\)/)?.[1];
  const video=content.videos.find(item=>item.url===url);if(!video)continue;
  const title=block.match(/^- Preferred title:[ \t]*(.*)$/m)?.[1]?.trim();
  const tagLine=block.match(/^- Contribution tags:[ \t]*([^\r\n]*)/m)?.[1];
  const tags=tagLine===undefined?video.tags:tagLine.split(',').map(tag=>tag.trim()).filter(Boolean);
  if((title&&title!==video.title)||JSON.stringify(tags)!==JSON.stringify(video.tags)){if(title)video.title=title;video.tags=tags;changed++;}
  if(tags?.length)labeled++;
}
fs.writeFileSync(file,JSON.stringify(content,null,2)+'\n');
console.log(`Applied ${changed} changed entries. ${labeled} worksheet entries have contribution tags. Omitted worksheet entries remain in the portfolio.`);

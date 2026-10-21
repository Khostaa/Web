import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4'};
const server = http.createServer((req,res) => {
  let file; try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname)); } catch { res.writeHead(400).end(); return; }
  if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403).end(); return;}
  if (file === root) file = path.join(root, 'index.html');
  fs.readFile(file,(error,data) => {if(error){res.writeHead(404).end('Not found');return;}const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){const start=Number(range[1]),end=Math.min(Number(range[2]||data.length-1),data.length-1);if(start>=data.length||end<start){res.writeHead(416,{'Content-Range':'bytes */'+data.length}).end();return;}res.writeHead(206,{...headers,'Content-Range':'bytes '+start+'-'+end+'/'+data.length,'Content-Length':end-start+1});res.end(data.subarray(start,end+1));return;}
  res.writeHead(200,{...headers,'Content-Length':data.length});res.end(data);});
});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));

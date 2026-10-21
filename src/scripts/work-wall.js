// Native layouts and CSS-only loops; no persistent JavaScript animation loop.
export function createWorkWall({board,cards,motionPreference,onPlay}) {
  let active=false,filter='short',category='all',paused=false,playing=false,keyboard=false;
  const toggle=document.querySelector('#work-motion'),count=document.querySelector('#work-page');
  const categoryBar=document.querySelector('.work-subfilters');
  const selected=()=>cards.filter(card=>card.dataset.format===filter&&(filter==='long'||category==='all'||card.dataset.collection===category));
  function sync(){
    board.dataset.motion=active&&filter==='short'&&!paused&&!playing&&!document.hidden&&!motionPreference.matches?'running':'paused';
    board.classList.toggle('keyboard-browsing',keyboard);
    categoryBar.hidden=filter==='long';toggle.hidden=filter==='long';
    for(const id of ['work-prev','work-next'])document.getElementById(id).hidden=filter==='long';
    toggle.disabled=motionPreference.matches;toggle.textContent=motionPreference.matches?'Motion off':paused?'Resume motion':'Pause motion';
    toggle.setAttribute('aria-pressed',String(paused||motionPreference.matches));
  }
  function copy(card){const clone=card.cloneNode(true);clone.dataset.clone='true';clone.setAttribute('aria-hidden','true');clone.querySelectorAll('button,a').forEach(el=>el.tabIndex=-1);return clone;}
  function layout(animate=false){
    if(!active)return;
    const width=board.clientWidth,height=board.clientHeight;if(!width||!height)return;
    const horizontal=filter==='short'&&category!=='all';
    board.dataset.layout=filter==='long'?'static':'moving';board.dataset.axis=horizontal?'horizontal':'vertical';
    const items=selected();const focused=board.contains(document.activeElement)?document.activeElement:null;
    board.replaceChildren();
    if(filter==='long'){
      board.style.gridTemplateColumns=width<500?'1fr':'repeat(2,minmax(0,1fr))';
      items.forEach(card=>{card.hidden=false;card.style.removeProperty('--tile-height');card.style.removeProperty('--tile-width');board.append(card);});
      count.textContent=items.length+' films';sync();return;
    }
    // Interleave platforms while keeping an even visual distribution.
    const totals=new Map(),positions=new Map();items.forEach(card=>totals.set(card.dataset.platform,(totals.get(card.dataset.platform)||0)+1));
    const ordered=items.map(card=>{const p=card.dataset.platform,n=positions.get(p)||0;positions.set(p,n+1);return {card,order:(n+.5)/totals.get(p)};}).sort((a,b)=>a.order-b.order).map(v=>v.card);
    const columns=horizontal?1:Math.max(1,Math.min(5,Math.floor(width/(width<500?120:180)),items.length));
    const gap=10,tileWidth=(width-gap*(columns-1))/columns,heights=Array(columns).fill(0),groups=[];
    board.style.gridTemplateColumns='repeat('+columns+',minmax(0,1fr))';
    for(let i=0;i<columns;i++){
      const column=document.createElement('div');column.className='masonry-column';
      const track=document.createElement('div');track.className='masonry-track';track.dataset.direction=horizontal?'left':i%2?'up':'down';
      const group=document.createElement('div');group.className='masonry-group';track.append(group);column.append(track);board.append(column);groups.push(group);
    }
    ordered.forEach(card=>{
      card.hidden=false;const [w,h]=card.dataset.ratio.split(':').map(Number);
      let th=horizontal?Math.min(height-16,460):Math.min(tileWidth*h/w,Math.max(120,height*.88));
      let tw=horizontal?Math.min(th*w/h,Math.max(160,width*.72)):tileWidth;if(horizontal)th=tw*h/w;
      card.style.setProperty('--tile-height',th+'px');card.style.setProperty('--tile-width',tw+'px');
      const index=horizontal?0:heights.indexOf(Math.min(...heights));groups[index].append(card);heights[index]+=th+gap;
    });
    groups.forEach((group,index)=>{
      const originals=[...group.children];if(!originals.length)return;let n=0;
      const measure=()=>horizontal?group.offsetWidth:group.offsetHeight;
      while(measure()<(horizontal?width:height)+80&&n<24)group.append(copy(originals[n++%originals.length]));
      const distance=measure(),track=group.parentElement,speed=horizontal?24:14+index*2;
      track.style.setProperty('--loop-distance',distance+'px');track.style.setProperty('--loop-duration',distance/speed+'s');track.dataset.speed=String(speed);
      const duplicate=group.cloneNode(true);duplicate.setAttribute('aria-hidden','true');duplicate.querySelectorAll('button,a').forEach(el=>el.tabIndex=-1);track.append(duplicate);
      if(animate&&!motionPreference.matches)track.parentElement.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{duration:600,delay:index*45,easing:'cubic-bezier(.2,.75,.2,1)',fill:'backwards'});
    });
    count.textContent=items.length+' edits';sync();
    if(focused?.isConnected){focused.focus({preventScroll:true});focused.scrollIntoView({block:'nearest',inline:'nearest'});}
  }
  function step(direction){
    board.querySelectorAll('.masonry-track').forEach(track=>{
      const horizontal=board.dataset.axis==='horizontal',animation=track.getAnimations().find(a=>a instanceof CSSAnimation);
      if(animation&&!keyboard&&!motionPreference.matches){const duration=Number(animation.effect.getTiming().duration),delta=(horizontal?board.clientWidth:board.clientHeight)*.65/Number(track.dataset.speed)*1000;animation.currentTime=((Number(animation.currentTime||0)+(horizontal?1:-1)*direction*delta)%duration+duration)%duration;}
      else {const col=track.parentElement,property=horizontal?'scrollLeft':'scrollTop',size=horizontal?col.clientWidth:col.clientHeight;col[property]=Math.max(0,col[property]+direction*size*.65);}
    });
  }
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;category='all';keyboard=false;document.querySelectorAll('[data-filter]').forEach(el=>{el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button));});document.querySelectorAll('[data-category]').forEach(el=>{el.classList.toggle('active',el.dataset.category==='all');el.setAttribute('aria-pressed',String(el.dataset.category==='all'));});layout(true);}));
  document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;keyboard=false;document.querySelectorAll('[data-category]').forEach(el=>{el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button));});layout(true);}));
  document.querySelector('#work-prev').addEventListener('click',()=>step(-1));document.querySelector('#work-next').addEventListener('click',()=>step(1));toggle.addEventListener('click',()=>{paused=!paused;sync();});
  board.addEventListener('click',event=>{const button=event.target.closest('[data-video-url]');if(button)onPlay(button);});
  board.addEventListener('focusin',event=>{if(event.target.matches(':focus-visible')){keyboard=true;sync();requestAnimationFrame(()=>event.target.scrollIntoView({block:'nearest',inline:'nearest'}));}});
  board.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(!board.contains(document.activeElement)){keyboard=false;board.querySelectorAll('.masonry-column').forEach(col=>{col.scrollTop=0;col.scrollLeft=0;});sync();}}));
  motionPreference.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);let resize;
  new ResizeObserver(()=>{cancelAnimationFrame(resize);resize=requestAnimationFrame(()=>layout());}).observe(board);
  return {setActive(value,animate=true){active=value;if(value)layout(animate);sync();},setPlaying(value){playing=value;sync();},step};
}

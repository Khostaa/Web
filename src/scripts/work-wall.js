// A small native masonry wall. Motion is CSS-only; JS runs on layout or input.
export function createWorkWall({ board, cards, motionPreference, onPlay }) {
  let active = false, filter = 'short', paused = false, playing = false, keyboard = false;
  const toggle = document.querySelector('#work-motion');
  const count = document.querySelector('#work-page');
  const filtered = () => cards.filter(card => card.dataset.format === filter);
  function sync() {
    board.dataset.motion = active && filter === 'short' && !paused && !playing && !document.hidden && !motionPreference.matches ? 'running' : 'paused';
    board.classList.toggle('keyboard-browsing', keyboard);
    toggle.hidden = filter === 'long';
    document.querySelector('#work-prev').hidden = filter === 'long';
    document.querySelector('#work-next').hidden = filter === 'long';
    toggle.disabled = motionPreference.matches;
    toggle.textContent = motionPreference.matches ? 'Motion off' : paused ? 'Resume motion' : 'Pause motion';
    toggle.setAttribute('aria-pressed', String(paused || motionPreference.matches));
  }
  function copy(card) {
    const clone = card.cloneNode(true);
    clone.dataset.clone = 'true';
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('button, a').forEach(button => button.tabIndex = -1);
    return clone;
  }
  function layout(animate = false) {
    if (!active) return;
    const width = board.clientWidth, height = board.clientHeight;
    if (!width || !height) return;
    const sourceItems = filtered();
    const totals = new Map();
    sourceItems.forEach(card=>totals.set(card.dataset.platform,(totals.get(card.dataset.platform)||0)+1));
    const positions = new Map();
    const items = sourceItems.map(card=>{const platform=card.dataset.platform;const position=positions.get(platform)||0;positions.set(platform,position+1);return {card,order:(position+.5)/totals.get(platform)};}).sort((a,b)=>a.order-b.order).map(item=>item.card);
    board.dataset.layout = filter === 'long' ? 'static' : 'moving';
    if (filter === 'long') {
      board.replaceChildren(...items);
      board.style.gridTemplateColumns = width < 500 ? '1fr' : 'repeat(2, minmax(0, 1fr))';
      items.forEach(card => {card.hidden=false;card.style.removeProperty('--tile-height');});
      count.textContent = items.length + ' films';
      sync();return;
    }
    const columns = Math.max(1, Math.min(5, Math.floor(width / (width < 500 ? 125 : 180)), items.length));
    const gap = 10, tileWidth = (width - gap * (columns - 1)) / columns;
    const heights = Array(columns).fill(0), groups = [];
    const focused = board.contains(document.activeElement) ? document.activeElement : null;
    board.replaceChildren();
    board.style.gridTemplateColumns = 'repeat(' + columns + ', minmax(0, 1fr))';
    for (let i = 0; i < columns; i++) {
      const column = document.createElement('div'); column.className = 'masonry-column';
      const track = document.createElement('div'); track.className = 'masonry-track';
      const group = document.createElement('div'); group.className = 'masonry-group';
      track.append(group); column.append(track); board.append(column); groups.push(group);
    }
    items.forEach(card => {
      card.hidden = false;
      const [w,h] = card.dataset.ratio.split(':').map(Number);
      const tileHeight = Math.min(tileWidth * h / w, Math.max(120, height * .88));
      card.style.setProperty('--tile-height', tileHeight + 'px');
      const index = heights.indexOf(Math.min(...heights));
      groups[index].append(card); heights[index] += tileHeight + gap;
    });
    groups.forEach((group,index) => {
      const originals = [...group.children];
      if (!originals.length) return;
      // Fill a short filtered column before duplicating its seamless loop.
      let n = 0;
      while (group.offsetHeight < height + 80 && n < 24) group.append(copy(originals[n++ % originals.length]));
      const distance = group.offsetHeight;
      const track = group.parentElement;
      track.style.setProperty('--loop-distance', distance + 'px');
      track.style.setProperty('--loop-duration', distance / (14 + index * 2) + 's');
      track.dataset.speed = String(14 + index * 2);
      const duplicate = group.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.querySelectorAll('button,a').forEach(button => button.tabIndex = -1);
      track.append(duplicate);
      if (animate && !motionPreference.matches) track.parentElement.animate([
        {opacity:0, transform:'translateY(40px)'}, {opacity:1, transform:'none'}
      ], {duration:650, delay:index*60, easing:'cubic-bezier(.2,.75,.2,1)', fill:'backwards'});
    });
    count.textContent = items.length + ' edits';
    sync();
    if (focused?.isConnected) { focused.focus({preventScroll:true}); focused.scrollIntoView({block:'nearest',inline:'nearest'}); }
  }
  function step(direction) {
    board.querySelectorAll('.masonry-track').forEach(track => {
      const animation = track.getAnimations().find(item => item instanceof CSSAnimation);
      if (animation && !keyboard && !motionPreference.matches) {
        const duration = Number(animation.effect.getTiming().duration);
        const delta = board.clientHeight * .65 / Number(track.dataset.speed) * 1000;
        animation.currentTime = ((Number(animation.currentTime || 0) - direction * delta) % duration + duration) % duration;
      } else {
        const column = track.parentElement;
        const limit = Math.max(0, track.scrollHeight - column.clientHeight);
        column.scrollTop = Math.min(limit, Math.max(0, column.scrollTop + direction * column.clientHeight * .65));
      }
    });
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter; keyboard = false;
    document.querySelectorAll('[data-filter]').forEach(item => {item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
    layout(true);
  }));
  document.querySelector('#work-prev').addEventListener('click',()=>step(-1));
  document.querySelector('#work-next').addEventListener('click',()=>step(1));
  toggle.addEventListener('click',()=>{paused=!paused;sync();});
  board.addEventListener('click',event=>{const button=event.target.closest('[data-video-url]');if(button)onPlay(button);});
  board.addEventListener('focusin',event=>{
    if(event.target.matches(':focus-visible')) {
      keyboard=true;sync();
      requestAnimationFrame(()=>event.target.scrollIntoView({block:'nearest',inline:'nearest'}));
    }
  });
  board.addEventListener('focusout',()=>requestAnimationFrame(()=>{
    if(!board.contains(document.activeElement)){keyboard=false;board.querySelectorAll('.masonry-column').forEach(column=>column.scrollTop=0);sync();}
  }));
  motionPreference.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  let resizeFrame;
  new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>layout());}).observe(board);
  return {
    setActive(value,animate=true){active=value;if(value)layout(animate);sync();},
    setPlaying(value){playing=value;sync();}, step
  };
}

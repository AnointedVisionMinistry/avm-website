/* AVM content rendering; all user-entered text is inserted as text, not HTML. */
(function () {
  const $ = (s) => document.querySelector(s);
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  async function load(name) {
    const response = await fetch(`content/${name}.json`, {cache:'no-store'});
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    return response.json();
  }
  function safeImage(url) {
    if (typeof url !== 'string') return null;
    const u=url.trim();
    if (!u || /^(javascript|data|blob):/i.test(u) || u.startsWith('//')) return null;
    try { const parsed=new URL(u,location.href); if (!['https:','http:'].includes(parsed.protocol)) return null; return parsed.href; }
    catch {return null;}
  }
  function youtubeId(url) {
    try {
      const u = new URL(url);
      let id='';
      if (['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname)) {
        id = u.pathname==='/watch' ? u.searchParams.get('v') : u.pathname.startsWith('/shorts/') ? u.pathname.split('/')[2] : u.pathname.startsWith('/live/') ? u.pathname.split('/')[2] : '';
      } else if (u.hostname==='youtu.be' || u.hostname==='www.youtu.be') {id=u.pathname.split('/')[1];}
      return /^[A-Za-z0-9_-]{11}$/.test(id||'') ? id : null;
    } catch {return null;}
  }
  function empty(host,txt){host.append(el('p','content-empty',txt));}
  function cardBase(){return el('article','media-card');}
  function displayedDate(s){const d=/^\d{4}-\d{2}-\d{2}$/.test(s||'')?new Date(s+'T12:00:00'):null;return d && !isNaN(d)?d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}):(s||'');}
  async function renderGallery(){
    const host=$('#gallery-list'); if(!host)return;
    try {const items=(await load('gallery')).filter(x=>x.published===true);
      if(!items.length)return empty(host,'Photos from AVM worship and ministry events will appear here soon.');
      items.slice().reverse().forEach(item=>{const src=safeImage(item.image);if(!src)return;
        const card=cardBase();const pic=el('img');pic.loading='lazy';pic.src=src;pic.alt=item.caption||item.title||'AVM church photo';card.append(pic);
        const body=el('div','media-card-body');body.append(el('h3',null,item.title||'Church photo'));
        if(item.caption)body.append(el('p',null,item.caption));card.append(body);host.append(card);
      });
    } catch(e){console.error(e);empty(host,'The photo gallery is temporarily unavailable.');}
  }
  async function renderSermons(){
    const host=$('#sermons-list'); if(!host)return;
    try {const items=(await load('sermons')).filter(x=>x.published===true).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
      if(!items.length)return empty(host,'Recorded worship services will be shared here soon. Join us Sunday at 11:00 AM!');
      items.forEach(item=>{const id=youtubeId(item.video_url);if(!id)return;
        const card=cardBase(),link=el('a','sermon-thumb');link.href='https://www.youtube.com/watch?v='+id;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Watch '+(item.title||'worship service')+' on YouTube');
        const pic=el('img');pic.src='https://img.youtube.com/vi/'+id+'/hqdefault.jpg';pic.loading='lazy';pic.alt='Video thumbnail';link.append(pic,el('span','play-icon','▶'));card.append(link);
        const body=el('div','media-card-body');body.append(el('div','media-date',displayedDate(item.date)),el('h3',null,item.title||'Worship service'));
        if(item.speaker)body.append(el('p','speaker',item.speaker));if(item.description)body.append(el('p',null,item.description));card.append(body);host.append(card);
      });
    } catch(e){console.error(e);empty(host,'Worship videos are temporarily unavailable.');}
  }
  async function renderEvents(){
    const host=$('#events-list'), preview=$('#home-events-list');if(!host&&!preview)return;
    try {const now=new Date();now.setHours(0,0,0,0);
      const items=(await load('events')).filter(x=>x.published===true && /^\d{4}-\d{2}-\d{2}$/.test(x.date||'') && new Date(x.date+'T12:00:00')>=now).sort((a,b)=>a.date.localeCompare(b.date));
      for(const target of [host,preview]){if(!target)continue;
        if(!items.length){empty(target,'No upcoming special events are posted right now. Sunday worship is every week at 11:00 AM.');continue;}
        (target===preview?items.slice(0,3):items).forEach(item=>{const card=cardBase(),src=safeImage(item.flyer);
          if(src){const pic=el('img');pic.loading='lazy';pic.src=src;pic.alt='Flyer for '+item.title;card.append(pic);}
          const body=el('div','media-card-body');body.append(el('div','media-date',displayedDate(item.date)+(item.time?' · '+item.time:'')),el('h3',null,item.title));
          if(item.description)body.append(el('p',null,item.description));card.append(body);target.append(card);
        });
      }
    }catch(e){console.error(e);if(host)empty(host,'Events are temporarily unavailable.');}
  }
  async function renderHomepage(){
    const photo=$('[data-managed-featured-image]');if(!photo)return;
    try{const data=await load('homepage'),src=safeImage(data.featured_image);
      if(src)photo.src=src;if(data.featured_image_alt)photo.alt=data.featured_image_alt;
      const h=$('[data-managed-featured-message]');if(h&&data.featured_message)h.textContent=data.featured_message;
    }catch(e){console.error('Featured content load failed; keeping defaults',e);}
  }
  document.addEventListener('DOMContentLoaded',()=>{renderHomepage();renderGallery();renderSermons();renderEvents();});
})();

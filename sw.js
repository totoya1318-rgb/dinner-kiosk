const CACHE="dinner-kiosk-v3";
const FILES=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "img/beer.jpg", "img/boricha.jpg", "img/bulgogi.jpg", "img/chicken.jpg", "img/cider.jpg", "img/cola.jpg", "img/doenjang-jjigae.jpg", "img/donkatsu.jpg", "img/gimbap.jpg", "img/jeyuk.jpg", "img/jjajangmyeon.jpg", "img/jjamppong.jpg", "img/jokbal.jpg", "img/kimchi-jjigae.jpg", "img/pizza.jpg", "img/ramyeon.jpg", "img/samgyeopsal.jpg", "img/shabu.jpg", "img/soju.jpg", "img/sushi.jpg", "img/tangsuyuk.jpg", "img/tteokbokki.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:"reload"})))));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  const fresh=r.mode==="navigate"||/\.(html|js|webmanifest)$/.test(new URL(r.url).pathname);
  if(fresh){ e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html")))); return; }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res;})));
});

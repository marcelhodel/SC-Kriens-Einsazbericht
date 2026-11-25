/* Einsatzbericht SC Kriens – Service Worker. App-Dateien offline verfügbar; Berichtsdaten bleiben in IndexedDB auf dem Gerät. */
const CACHE="sck-einsatz-1.0.0-75fa68d9";
const ASSETS=["./", "index.html", "manifest.webmanifest", "vendor/docx.umd.js", "vendor/jspdf.plugin.autotable.min.js", "vendor/jspdf.umd.min.js", "vendor/pdf-lib.min.js", "fonts/ibm-plex-mono-latin-500-normal.woff2", "fonts/ibm-plex-sans-latin-400-normal.woff2", "fonts/ibm-plex-sans-latin-500-normal.woff2", "fonts/ibm-plex-sans-latin-600-normal.woff2", "fonts/ibm-plex-sans-latin-700-normal.woff2", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("sck-einsatz-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data==="skip")self.skipWaiting()});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);if(u.origin!==self.location.origin)return;
  if(r.mode==="navigate"){e.respondWith(caches.match("index.html").then(m=>m||fetch(r)));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(cc=>cc.put(r,c))}return res})));
});

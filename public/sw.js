// Service worker do NeuroBaby: funciona offline guardando o app em cache.
const CACHE = 'neurobaby-v1.3.0'
const SHELL = ['./', './index.html', './manifest.webmanifest', './logo-ilustracao.png', './icons/icon-192.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return

  // Páginas: rede primeiro (pega versão nova), cache se offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        caches.open(CACHE).then((c) => c.put('./index.html', res.clone()))
        return res
      }).catch(() => caches.match('./index.html'))
    )
    return
  }

  // Demais arquivos: cache primeiro, atualizando em segundo plano
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()))
        return res
      }).catch(() => hit)
      return hit || net
    })
  )
})

// عامل الخلفية: يستقبل التنبيه (بلا محتوى) ثم يجلب آخر إشارة من الخادم ويعرضها.
const RELAY = 'https://trading-relay.ala019626.workers.dev';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let d = { title: 'برنامج التداول', body: 'إشارة جديدة، افتح البرنامج.' };
    try {
      if (e.data) { try { d = Object.assign(d, e.data.json()); } catch (_) { } }
      else { const r = await fetch(RELAY + '/latest', { cache: 'no-store' }); if (r.ok) d = Object.assign(d, await r.json()); }
    } catch (_) { }
    await self.registration.showNotification(d.title, {
      body: d.body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'sig-' + (d.t || Date.now()),
      dir: 'rtl', lang: 'ar', renotify: true, requireInteraction: true, data: { url: self.registration.scope }
    });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) if (c.url.startsWith(url) && 'focus' in c) return c.focus();
    return self.clients.openWindow(url);
  }));
});

const CACHE = "tagarshan-li-v3";
const DATA_CACHE = "tagarshan-li-data";
const REMINDERS_CACHE = "/_tagarshan-reminders.json";
const ASSETS = ["/", "/manifest.json", "/welcome"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE && key !== DATA_CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim())
      .then(() => checkRemindersFromCache()),
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "check-reminders") {
    event.waitUntil(checkRemindersFromCache());
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "CHECK_REMINDERS" && Array.isArray(event.data.reminders)) {
    event.waitUntil(
      caches.open(DATA_CACHE).then((cache) =>
        cache.put(
          REMINDERS_CACHE,
          new Response(
            JSON.stringify({
              reminders: event.data.reminders,
              syncedAt: new Date().toISOString(),
            }),
            { headers: { "Content-Type": "application/json" } },
          ),
        ),
      ).then(() => checkRemindersFromCache()),
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow("/reminders");
    }),
  );
});

function daysUntil(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date + "T12:00:00");
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

async function checkRemindersFromCache() {
  try {
    const cache = await caches.open(DATA_CACHE);
    const response = await cache.match(REMINDERS_CACHE);
    if (!response) return;

    const payload = await response.json();
    const reminders = payload.reminders || [];
    const today = new Date().toISOString().slice(0, 10);

    for (const reminder of reminders) {
      if (reminder.done) continue;
      const diff = daysUntil(reminder.date);
      if (diff !== 0 && diff !== 1) continue;

      const when = diff === 0 ? "היום" : "מחר";
      await self.registration.showNotification("תגרשן לי — תזכורת", {
        body: `${reminder.title} (${when})`,
        icon: "/icons/icon.svg",
        tag: `sw-${reminder.id}-${today}`,
        data: { url: "/reminders" },
      });
    }
  } catch {
    // ignore SW reminder errors
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response.ok && event.request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    }),
  );
});

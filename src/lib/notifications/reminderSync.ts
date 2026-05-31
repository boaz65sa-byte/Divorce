import type { Reminder } from "@/lib/types";

const REMINDERS_CACHE = "/_tagarshan-reminders.json";

export async function syncRemindersToServiceWorker(
  reminders: Reminder[],
): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  const payload = {
    reminders,
    syncedAt: new Date().toISOString(),
  };

  await caches.open("tagarshan-li-data").then((cache) =>
    cache.put(
      REMINDERS_CACHE,
      new Response(JSON.stringify(payload), {
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );

  if ("sync" in registration) {
    try {
      await (
        registration as ServiceWorkerRegistration & {
          sync: { register: (tag: string) => Promise<void> };
        }
      ).sync.register("check-reminders");
    } catch {
      // Background Sync not supported
    }
  }

  registration.active?.postMessage({
    type: "CHECK_REMINDERS",
    reminders,
  });
}

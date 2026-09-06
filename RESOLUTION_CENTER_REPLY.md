# Resolution Center — short reply draft

Copy into App Store Connect Resolution Center:

---

Hello App Review team,

Thank you for the Guideline 5.6 feedback.

Root cause: The previous build included an unlinked /admin analytics page (password field only, no nav entry). That looked like a hidden feature.

Fix in this build:
- /admin and /api are excluded from the Capacitor/mobile static export; the build fails if out/admin is present.
- Analytics and service-worker registration are disabled in the mobile/Capacitor build.
- The Professionals screen no longer shows fake lawyer cards or phone numbers — only official public resource links, with a clear banner that we do not list or refer real lawyers.
- Share is available from the home tools chip (not password-gated).

How to review: Open the app and use Home tool chips / bottom nav. There is no login and no IAP. Reminders may request notification permission (local notifications only). User data stays on device.

Please let us know if you need anything else.

---

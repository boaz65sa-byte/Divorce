# App Store Review Notes — Tagarshan Li

English notes for App Store Connect Resolution Center and Notes for Review.

## Root cause of Guideline 5.6 rejection

The previous Capacitor iOS binary included a statically exported /admin (analytics stats) route. That page:

- Was not linked from any navigation or home tools
- Was only gated by a client-side password field
- Appeared to App Review as a hidden feature under Guideline 5.6

### What we changed

- Mobile builds (scripts/build-mobile.sh) temporarily exclude src/app/admin and src/app/api before next build, then restore them afterward (website builds unchanged).
- After next build, the script fails if out/admin (or out/api) exists.
- Analytics no-ops when NEXT_PUBLIC_CAP_BUILD=1 or Capacitor is detected; service worker registration is skipped on Capacitor.
- The Professionals screen is official resource links only — fake lawyer cards / placeholder phone numbers were removed.

## How to review the app (screen by screen)

1. Home — brand, primary journeys (assistant, roadmap, knowledge, calculators), and tool chips including calendar, reminders, journal, professionals, courts, agreement, resources, settings, feedback, and share.
2. Welcome / onboarding (if shown) — short intro; no account creation.
3. Assistant — local Q&A style help; educational, not legal advice.
4. Roadmap / checklist — guided steps stored on device.
5. Knowledge / FAQ — educational content.
6. Calculators — illustrative tools (e.g. support estimates); not filings.
7. Calendar / custody — local scheduling helpers.
8. Reminders — create reminders; on device, Capacitor local notifications may fire (permission prompt is expected).
9. Journal — private notes on device.
10. Professionals — banner states the app does not list or refer real lawyers; only links to public sites (Kol Zchut, Israel Bar search, mediation info, courts info). Optional link to Feedback.
11. Courts / agreement / resources — informational tools and links.
12. Settings / feedback / share-app — preferences, feedback form, and share UI (share is reachable from home tools — not hidden).

There is no /admin route in the iOS binary.

## Account / payments

- No login / no user accounts
- No In-App Purchases
- No subscriptions

## Data and privacy

- User checklist, journal, calendar, and reminder data stay on device (local storage).
- Mobile builds do not call the website analytics API.
- Notifications (if allowed) are local reminders via Capacitor — not remote push marketing.

## Professionals clarification

The Professionals page is not a professional directory and does not provide referrals. Example/fake contacts were removed. Only official public resource links remain.

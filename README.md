# BharathBuild Mobile (Expo / React Native)

Native iOS + Android rebuild of the BharathBuild web app. Shares the web app's Supabase backend and
brand palette (navy `#0D2B45`, orange `#F97316`).

## Run
```bash
npm install
npx expo install --fix     # aligns native package versions to the Expo SDK
npx expo start             # press i / a, or scan the QR in Expo Go
```
`.env` already holds the web app's public Supabase URL + anon key. Never put the service-role key here.
Add `assets/icon.png` and `assets/splash.png` (+ reference them in `app.json`) before store builds.

## Status
| Area | Screen | State |
|---|---|---|
| Public | Home, Search (category + keyword), Listing detail (call/email, similar) | Done |
| Auth | Login, Sign up, Reset password, Account, Account settings | Done |
| Vendor | Dashboard, Listings (pause/activate/delete), Leads (call, mark contacted/closed), Messages + thread reply, Reviews, Subscription (read-only) | Done |
| Vendor | Portfolio (PDF upload), Business profile, Analytics, Create/edit listing | Stub |
| Admin | Dashboard, Listings (approve/delete), Vendors (approve/suspend), Users (block), Leads, Reviews | Done |
| Admin | Categories, Ads (+new/edit), Payments, Reports, Settings, System, Activity, Admin activity | Stub |
| Admin | Roles, Admins, Accounts | Stub, needs server proxy |
| Public | Contact, About, customer "send message" to vendor, lead submission form | Not started |

Stubs show the web file to port next (`ComingSoon`).

## Architecture notes
- Reads/writes go straight to Supabase with the signed-in user's token. This works because the web app's
  RLS policies (`has_role(...)`, `auth.uid() = vendor_id`, public active+approved listings) already enforce access.
- `RoleGuard` on the vendor/admin stacks is only UX; RLS is the real enforcement.
- **Needs a server proxy (service-role key, never in the app):** listing user emails, creating users,
  password-reset links, role assignment, and anything using `supabaseAdmin.auth.admin.*`.
- Admin actions from mobile are **not written to `activity_logs`** (that table is only writable server-side).
  Decide whether to add a small edge function that logs them.
- Messaging polls every 10s (same as the web plan); no realtime channel yet.

## Verified / not verified
- `tsc --noEmit` clean; Metro bundles for Android and iOS.
- Not run on a device or simulator, and not tested against live data or real accounts.
- Screens use the web's brand palette and information layout but are native layouts, not pixel clones of the web UI.

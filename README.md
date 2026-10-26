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

## Build an installable APK (Android)
Needs a free Expo account. Run from this folder on your computer:
```bash
npm install
npx expo install --fix
npm install -g eas-cli
eas login
eas init                 # links the project to your Expo account (one time)
npm run build:apk        # = eas build --platform android --profile preview
```
EAS builds in the cloud (~10–15 min) and prints a download link for the `.apk`. Open it on the phone and
allow "install unknown apps". `eas.json` already carries the public Supabase URL and anon key.
iOS needs an Apple Developer account ($99/yr): `eas build --platform ios --profile preview`.

## Build the APK on GitHub (no Expo account)
Push this folder to a GitHub repo (branch `main`) → **Actions → Build Android APK → Run workflow**.
When it finishes (~15 min), download the `BharathBuild-apk` artifact from the run page and unzip it.
The APK is signed with Expo's default debug key: fine for installing/testing, not for Play Store upload.

## If the app closes on launch (get the real error)
Connect the phone with USB debugging on, then:
```bash
adb logcat -c
adb shell monkey -p com.bharathbuild.mobile -c android.intent.category.LAUNCHER 1
adb logcat -d AndroidRuntime:E ReactNativeJS:V *:S
```
Send the lines after `FATAL EXCEPTION`. Installing the APK again over an old one is fine; if it still crashes, uninstall first.

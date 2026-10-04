# TestFlight with Friends - Polish Guide (Beginner Plain English)

## What is TestFlight?
Apple's way to share your iPhone app with 10 friends before App Store. They install TestFlight app, you send invite, they test.

You need:
1. Apple Developer account $99/year (developer.apple.com -> Enroll)
2. Expo account globaldera (you have it!)
3. App icon + splash (see below)

## Step 0: Polish warnings (10 min, makes Apple happy)
1. Fix `shadow* deprecated, use boxShadow`:
   - In `app/components/Card.tsx` we use shadowColor/shadowOpacity. For SDK 57 web, change to `boxShadow: '0 4px 12px rgba(0,0,0,0.05)'`.
   - Keep shadow* for phone? Simplest: leave as is for MVP friends test - yellow warning only, not red block. Apple still accepts.
2. Run health:
```
npx expo-doctor
```
Want 17 checks passed or only yellows.

## Step 1: Add icon + splash (must for build)
1. Make 1024x1024 PNG with "BJ" gold on blue. Save as `app/assets/icon.png`
2. Make splash 1284x2778 PNG warm paper with "Bible Journey". Save as `app/assets/splash.png`
3. In `app/app.json` add:
```json
"icon": "./assets/icon.png",
"splash": { "image": "./assets/splash.png", "backgroundColor": "#FFFDF7" }
```
No icon = build fails. Use free Canva if no designer.

## Step 2: EAS Build (Expo cloud builds iPhone file)
```powershell
cd "C:\Users\USER\Documents\Default Project\app"
& "C:\Program Files\nodejs\npx.cmd" expo login
& "C:\Program Files\nodejs\npx.cmd" eas init
& "C:\Program Files\nodejs\npx.cmd" eas build --platform ios --profile preview
```
- First time asks Apple ID + bundle ID: use `com.biblejourney.app` (already in app.json)
- Wait 15-20 min in browser expo.dev -> Builds
- Download or Submit to TestFlight:
```
& "C:\Program Files\nodejs\npx.cmd" eas submit --platform ios
```

## Step 3: Invite friends
1. App Store Connect -> TestFlight -> Add 10 emails
2. Friends install TestFlight app -> accept -> install Bible Journey
3. Ask them:
   - Did Day 1 complete work?
   - Did miss-5-days + catch-up feel kind?
   - Did Explain help?
   - Did Audio play?
4. Track in Supabase `analytics_events` + `recovery_events` tables.

## Costs:
- Apple $99/yr, Expo EAS free tier enough for friends, Supabase free, AI offline free.

When 5 friends complete 7 days: you validated H1+H2! Then do Church Mode.

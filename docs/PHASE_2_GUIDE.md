# Phase 2 Guide - Catch Me Up (Beginner Plain English)

## What is Phase 2?
Your superpower. When someone misses days, you do NOT say "You failed."
You say: "Welcome back. You haven't lost your progress."

## What I built:
- `app/lib/recovery.ts` = math for 4 options: continue, spread over 7 days, quick summary, restart fresh
- `app/app/catchup.tsx` = kind screen with 4 buttons
- Home now shows gold Welcome Back card when you miss 2+ days
- `app/lib/notifications.ts` = gentle words: "Your next reading is ready" (real push comes in Phase 6)
- `supabase/migration_phase2.sql` = remembers last read + which recovery option people pick (for your H2 metric)

## How to test (no need to wait 5 real days!):
1. Run DB: Supabase -> SQL Editor -> New Query -> paste `supabase/migration_phase2.sql` -> Run
2. Restart app:
```
cd "C:\Users\USER\Documents\Default Project\app"
npx expo start -c --host=lan
```
3. On Home, tap: "👉 Tap here to simulate 5 missed days"
4. A new card appears: "Welcome back..." Tap "See Catch-Up Options"
5. Try each:
   - Continue normally = nothing changes, just continue
   - Catch up slowly = next 7 days get "+ catch-up" extra
   - Quick catch-up = today becomes 1 short summary
   - Restart from today = keep history, fresh start
6. Tap Apply -> Back Home -> banner disappears (you're caught up!)

## Checklist:
- [ ] Simulate 5 missed -> banner appears
- [ ] Open Catch Up -> see 4 options with descriptions
- [ ] Apply Spread7 -> Journey days show extra chapters
- [ ] Complete a day -> missed resets to 0
- [ ] Supabase `recovery_events` table exists

## What we did NOT build:
- No real push notifications yet (needs Expo Notifications native setup - Phase 6)
- No auto-detect with exact calendar dates yet (we use lastCompletedAt + demo button - good enough for MVP)

Next: Phase 3 = Study Layer (People, Places, Themes for John 1, Genesis 1).
Say "Start Phase 3" when ready.

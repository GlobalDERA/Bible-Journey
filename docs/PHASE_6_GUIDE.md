# Phase 6 Guide - Audio + Premium + Launch Ready (Beginner)

## What is Phase 6?
Make app lovable + ready for real users. Listen, paywall demo, measure what matters.

## What I built:
- `app/lib/audioService.ts` = Text-To-Speech player (no big files!). Play, speed 1x/1.25x/1.5x, follow-along, bookmark moment.
- `app/app/audio.tsx` = Audio screen with speed buttons, verse tap to track, bookmark.
- Reader now has [Listen 🎧 Genesis 1] button.
- `app/lib/premium.ts` = Free list vs Premium $5-10 list + demo flag + `trackEvent()` analytics.
- `app/app/premium.tsx` = Paywall with Unlock Demo button.
- `supabase/migration_phase6.sql` = analytics_events + subscriptions tables.

## How to see:
1. Supabase: paste `migration_phase6.sql` -> Run
2. Install audio voice (1 line):
```
cd "C:\Users\USER\Documents\Default Project\app"
npx expo install expo-speech -- --legacy-peer-deps
```
3. Restart:
```
npx expo start -c --host=lan
```
4. Test:
   - Reader -> Listen -> Play (hear Genesis 1!), change speed, tap verse 5, Bookmark moment
   - Profile? Go to `/premium` (type manually or add link): Unlock Demo -> Try Audio
   - Web + phone same

## Real audio + real money later (not needed for MVP):
- Human audio: Faith Comes By Hearing Digital Bible Platform gives mp3 + timestamps. Swap `speakPassage()` to play mp3 with expo-av. Keep same speed/bookmark UI.
- Real pay: Install RevenueCat `react-native-purchases`, create products in App Store Connect ($5/mo), call `Purchases.purchase()`. Keep demo flag for testing.
- Real analytics: Query Supabase: North Star = count journeys where all days complete per month. Day7 = users active 7 days after signup. Recovery = % return after 3+ missed.

## Launch checklist (all phases):
- [ ] Phase 0 empty tabs + login
- [ ] Phase 1 read + 90/180/365 + complete
- [ ] Phase 2 simulate 5 missed -> 4 options
- [ ] Phase 3 explore study + connections clickable
- [ ] Phase 4 highlight/note/memory/search anxiety
- [ ] Phase 5 explain covenant with labels
- [ ] Phase 6 audio plays + premium demo unlocks

You built MVP! Next: TestFlight friends, then Church Mode (Phase 7 future).

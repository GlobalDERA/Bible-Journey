# Phase 0 Checklist

## Files created in Phase 0:
- [x] package.json (root - manages both app + web)
- [x] app/package.json + app.json + babel + tailwind (phone app config)
- [x] app/constants/theme.ts (design colors: paper, primary blue, gold)
- [x] app/lib/supabase.ts (database telephone line)
- [x] app/store/authStore.ts (remembers login)
- [x] app/components/PrimaryButton.tsx + Card.tsx (reuse everywhere)
- [x] app/app/_layout.tsx + (tabs)/_layout.tsx (navigation)
- [x] 5 tabs: index (Home), bible, journey, explore, profile (with auth)
- [x] supabase/schema.sql (5 tables + security rules)
- [x] web/app/page.tsx (simple website)
- [x] docs/PHASE_0_GUIDE.md (this guide in plain English)

## What each tech does (one line each):
- Expo Router: Makes screen navigation like website links but for phone
- NativeWind: Lets you style with short words instead of long CSS
- Supabase Auth: Handles Sign Up / Login safely so you don't store passwords
- Supabase Postgres: Excel-like database for journeys and notes
- Zustand: Tiny memory for "who is logged in?"
- TanStack Query: Will cache Bible chapters in Phase 1 for offline reading

## Ready for Phase 1 when:
You can answer YES to all in docs/PHASE_0_GUIDE.md checklist.

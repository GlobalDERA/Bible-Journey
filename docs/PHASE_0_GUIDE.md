# Phase 0 Guide - Plain English

## You just built an empty house. Good!

### What did we make?

1. **app/** - Phone app with 5 tabs. Like 5 empty rooms labeled Home, Bible, Journey, Explore, Profile.
2. **Design system** - `app/constants/theme.ts` = your paint colors. Paper white, calm blue, warm gold. Always use these.
3. **Login** - Profile tab can Sign Up / Log In using Supabase. Like a front door key.
4. **Database** - `supabase/schema.sql` = 5 Excel sheets: profiles, translations, journeys, journey_days, user_notes.

### Tech choices reminder (why?)

- **Expo React Native**: Write once, run on iPhone + Android + Web. Best for beginner solo builder.
- **NativeWind + handmade Card/Button**: Looks warm and simple, not like a bank app.
- **Supabase**: Login + database in one. Free to start. No servers to manage.
- **Zustand + TanStack Query**: Tiny backpacks to remember data. Don't worry about details yet.

### Other options we did NOT pick (and why)

- Flutter: Great, but you need to learn Dart language. Harder with AI help if you know JavaScript.
- Firebase: Good, but harder for Bible plan math queries like "Day 42 of 365".
- Custom servers: Powerful but you would spend weeks on servers, not Bible features.

### How to test Phase 0 is done?

Checklist (all must be YES):
- [ ] `app` folder opens with `npx expo start` without red errors
- [ ] You see 5 tabs on phone
- [ ] You can type email/password in Profile and Sign Up
- [ ] Supabase shows 1 row in `profiles` table
- [ ] Home shows "Day 1 / 365 Genesis 1-3"

### If something breaks?

1. Red error about Supabase URL? You forgot `.env` file. Copy from README.
2. Tabs not showing? Check file names in `app/app/(tabs)/` - must be exactly index.tsx, bible.tsx, etc.
3. Still stuck? Send me the exact error text, I will explain like beginner.

### Next: Phase 1

We will add:
- Real Bible text (KJV offline sample)
- Onboarding: What do you want? How fast? When?
- Plan generator math
- [Start Reading] actually opens text and check-off works

Say "Start Phase 1" when ready.

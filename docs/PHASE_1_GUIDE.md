# Phase 1 Guide - Real Reading + Plans (Beginner Plain English)

## What is Phase 1?
Phase 0 = empty rooms. Phase 1 = you can actually read + track.

You now have:
1. **Bible tab** reads Genesis 1 real text (KJV), Prev/Next chapters work
2. **Home tab** shows real Day X, % bar, Start Reading opens Reader
3. **Journey tab** lets you pick 90 / 180 / 365 days and see Day list
4. **Onboarding** at `/(auth)/onboarding` asks: What? How fast? When?
5. **Reader screen** at `/reader?day=1` shows chapters + Mark Complete button

## Files added:
- `app/data/bible.ts` = list of 66 books + chapter counts + sample Genesis 1, Genesis 2, John 1 text
- `app/lib/planGenerator.ts` = math cutter: 1189 chapters / 365 = ~3 per day
- `app/lib/bibleService.ts` = librarian that gives verses
- `app/store/journeyStore.ts` = backpack remembering Day 1..365 and done ticks
- `app/app/reader.tsx` = reading page
- `app/app/(auth)/onboarding.tsx` = 3-step wizard
- `supabase/migration_phase1.sql` = auto-create profile on signup

## How to test (do in order):

### A. Run database extra (1 min)
1. Supabase -> SQL Editor -> New Query
2. Open file `supabase/migration_phase1.sql`, copy all, paste, Run
3. Should say Success. This fixes "profile not found" after signup.

### B. Run app (2 min)
```
cd app
npm install
npx expo start -c
```
-c = clear cache, important after adding new files.

### C. Click-through checklist:
- [ ] Open app, go to Journey tab, tap 365 days. See Day 1 Genesis 1-3, Day 2 Genesis 4-6...
- [ ] Tap Day 1, Reader opens, see Genesis 1 verses 1-10 + 27 + 31 real text
- [ ] Tap Mark Complete, see "Well done!", Home % goes from 0% to 1%
- [ ] Go to Bible tab, tap Next, chapter changes from Genesis 1 to Genesis 2
- [ ] If logged in, Supabase Table Editor -> journeys has 1 row, journey_days has 365 rows

## Common beginner errors:

1. **"Unable to resolve @tanstack/react-query"**
   Fix: `cd app` then `npm install` again. It is already in package.json.

2. **Reader says "No reading found"**
   Fix: Go to Journey tab first and tap a plan (90/180/365). That creates days.

3. **Supabase save fails but app still works**
   Normal offline mode. App saves locally first, syncs when logged in. Check `.env` file has real URL + key.

## What we did NOT build yet (on purpose):
- No Catch Me Up recovery (Phase 2)
- No People/Places/Themes (Phase 3)
- No highlights/notes (Phase 4)
- No AI (Phase 5)
- Only Genesis 1,2 + John 1 full text. Others show placeholder until you add API.Bible key. This avoids copyright trouble.

## Next: Phase 2 = Catch Me Up system
Say "Start Phase 2" when Phase 1 checklist is all green.

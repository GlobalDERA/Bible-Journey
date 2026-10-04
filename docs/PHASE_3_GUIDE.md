# Phase 3 Guide - Understand (Beginner)

## What is Phase 3?
Read -> Understand. Every passage now has a study card.

## What I built:
- `app/data/study.ts` = full cards for Genesis 1, Genesis 2, John 1 + people/themes index
- `app/lib/studyService.ts` = gives card, or simple generic card so app never crashes
- `app/app/study.tsx` = Understand screen: What happened? Context, People, Places, Themes, Connections (tap to jump), Questions
- Reader now has 2 buttons: [Explore Genesis 1 📖] + [Mark Complete]
- Explore tab now real: People / Themes tabs, tap to study
- `supabase/migration_phase3.sql` = people, places, themes, passage_links tables (graph start)

## How to see:
1. Supabase SQL Editor -> paste `migration_phase3.sql` -> Run
2. Restart:
```
cd "C:\Users\USER\Documents\Default Project\app"
npx expo start -c --host=lan
```
3. Test:
   - Home -> Start Reading Day 1 -> tap Explore Genesis 1 -> see Author, People God, Themes Creation, Connections John 1
   - Tap 🔗 John 1 -> jumps to John 1 study!
   - Go Explore tab -> People -> tap David -> see passages
   - Web `http://localhost:8081` works same, phone scan same

## Checklist:
- [ ] Reader shows Explore button
- [ ] Study shows Context 4 lines + People + Themes + Connections clickable
- [ ] Explore tab switches People/Themes
- [ ] DB has 5 people, 4 themes

Next: Phase 4 = Your notes/highlights memory. Say "Start Phase 4".

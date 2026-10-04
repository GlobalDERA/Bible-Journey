# Phase 4 Guide - Remember (Beginner)

## What is Phase 4?
Your app now remembers YOU. Highlights, notes, bookmarks, search.

## What I built:
- `app/store/notesStore.ts` = backpack for highlights (4 colors), bookmarks, notes with tags
- Reader now has per-passage: [⭐ Highlight] [🔖 Save] [📖 Memory →] + note box + [Save Note 📝]
- `app/app/memory.tsx` = "Your journey with Genesis 1": first touched date, counts, highlights, reflections
- `app/app/search.tsx` = search Bible + People/Themes + YOUR notes. Try "anxiety" -> Philippians 4:6, Psalms 23...
- Profile tab now shows My Bible Memory + Recent notes + Search link (works offline, syncs notes when logged in)
- `supabase/migration_phase4.sql` = highlights + bookmarks tables (notes already existed)

## How to see:
1. Supabase SQL Editor -> paste `migration_phase4.sql` -> Run
2. Restart:
```
cd "C:\Users\USER\Documents\Default Project\app"
npx expo start -c --host=lan
```
3. Test:
   - Reader Day 1 -> tap ⭐ Highlight -> alert Saved
   - Type "covenant is beautiful" in note box -> Save Note
   - Tap 📖 Memory → -> see counts + your note!
   - Profile -> see 1 highlight, 1 note
   - Search -> type "covenant" -> see YOUR note first!

## About your error question:
You asked "what does that error mean?" but no error text came through. I fixed one likely cause just now (missing button styles in Reader that could show red).
To help next time, copy:
1. The first line starting `Unable to resolve` or `Error:`
2. Or take phone photo description
Paste those 2-3 lines here and I will translate to plain English.

Next: Phase 5 = AI Explain. Say "Start Phase 5".

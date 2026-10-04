# Phase 5 Guide - Explain This AI (Beginner, Safe)

## What is Phase 5?
Highlight "covenant" -> Explain -> get Simple + Bible + History + Related + Deeper, always labeled.

## What I built (works WITHOUT API key):
- `app/lib/aiService.ts` = offline grounded answers using YOUR study data. Knows covenant, faith, justification by faith. Others use generic template grounded in passage.
- `app/app/explain.tsx` = Explain screen with input + 5 labeled cards + trust warning
- Study screen now has [Explain "Theme" ✨] button that opens Explain with that theme
- `supabase/migration_phase5.sql` = ai_queries log table (for H6: do explanations reduce confusion?)

## How to see:
1. Supabase: paste `migration_phase5.sql` -> Run
2. Restart:
```
cd "C:\Users\USER\Documents\Default Project\app"
npx expo start -c --host=lan
```
3. Reader -> Explore Genesis 1 -> Explain "Creation" -> see Simple, [BIBLE] verse, [HISTORY] author, Related links
4. Try typing "justification by faith" in Explain box -> see Romans/Galatians links
5. Same on web + phone

## How to add REAL AI later (optional, costs money):
1. Get key from OpenAI (platform.openai.com) or Anthropic (console.anthropic.com)
2. In Supabase: create Edge Function `ai-explain` that:
   - receives {phrase, ref}
   - searches people/places/themes tables for context (RAG)
   - calls AI with prompt: "Only use given context. Label [BIBLE]/[HISTORY]/[AI IDEA]. If unsure, say unsure."
3. In `app/.env` add `EXPO_PUBLIC_AI_URL=https://your-project.supabase.co/functions/v1/ai-explain`
4. Replace `explainPhrase` fetch with that URL. Keep labels!
This keeps Risk #2 low: grounded + labeled, never guessing verses.

## Checklist:
- [ ] Explain opens from Study
- [ ] Labels show [BIBLE]/[HISTORY]/[AI IDEA]
- [ ] Related passages clickable in Study
- [ ] ai_queries table exists

Next: Phase 6 = Audio + Premium + Polish. Say "Start Phase 6".

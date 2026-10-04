// AI SERVICE - Phase 5 Explain This (Grounded, Beginner-Safe)
// Rule from PRD: AI must AUGMENT Bible, not replace it.
// Every answer shows labels: [BIBLE] vs [HISTORY] vs [AI IDEA]
// Phase 5 MVP works OFFLINE using your study data. No API key needed.
// Later: plug real OpenAI/Muse key via EXPO_PUBLIC_AI_KEY (see guide).

import { getStudy } from './studyService';
import { getChapterText } from './bibleService';

export type ExplainResult = {
  phrase: string;
  ref: string;
  simple: string; // plain language
  bibleContext: string; // [BIBLE] grounded
  history: string; // [HISTORY] vetted
  related: string[]; // related passages
  deeper: string; // go deeper
  warning: string; // trust label
};

const PHRASE_BOOK: Record<string, { simple: string; related: string[] }> = {
  'justification by faith': {
    simple: 'Plain words: God counts you right with Him because you trust Jesus, not because you are perfect.',
    related: ['Romans 3', 'Romans 4', 'Galatians 2', 'Galatians 3'],
  },
  covenant: {
    simple: 'Plain words: A covenant is a strong promise from God: "I will be your God, you will be my people."',
    related: ['Genesis 12', 'Exodus 20', 'Jeremiah 31'],
  },
  faith: {
    simple: 'Plain words: Faith is trusting God even when you cannot see the full picture.',
    related: ['Genesis 15:6', 'Hebrews 11', 'Romans 4'],
  },
};

export function explainPhrase(phrase: string, ref: string): ExplainResult {
  const clean = phrase.toLowerCase().trim();
  const study = getStudy(ref);
  const verses = getChapterText(ref);
  const firstVerse = verses[0] ? `${ref}:${verses[0].verse} "${verses[0].text.slice(0, 100)}..."` : ref;

  // Find book match or generic
  const key = Object.keys(PHRASE_BOOK).find((k) => clean.includes(k));
  const book = key ? PHRASE_BOOK[key] : null;

  return {
    phrase,
    ref,
    simple: book?.simple ?? `Plain words: "${phrase}" in ${ref} means: read it slowly in context. ${study.context.summary}`,
    bibleContext: `[BIBLE] In ${ref}: ${firstVerse} Themes here: ${study.themes.map((t) => t.name).join(', ') || 'Journey'}.`,
    history: `[HISTORY] ${study.context.author}, to ${study.context.audience}. Setting: ${study.context.setting}.`,
    related: book?.related ?? study.connections,
    deeper: `Go deeper: Compare ${study.connections.slice(0, 3).join(', ')}. Ask: Where else does this idea appear? (Full AI with commentary comes when you add API key - see guide.)`,
    warning: 'Labels: [BIBLE]=verse text, [HISTORY]=vetted context, [AI IDEA]=simple explanation. Always check verses yourself.',
  };
}

export function answerQuestion(question: string, ref: string): ExplainResult {
  // Reuse explain for questions like "Why is Abraham important here?"
  return explainPhrase(question, ref);
}

// OPTIONAL real AI later (not used in MVP offline mode):
// 1. Get key from OpenAI or Anthropic
// 2. In app/.env add EXPO_PUBLIC_AI_KEY=...
// 3. Replace explainPhrase body with fetch to your Supabase Edge Function
//    that does RAG over people/places/themes tables (migration_phase3).
// Edge Function outline in docs/PHASE_5_GUIDE.md

// SEARCH - Phase 4
// Beginner idea: Search finds 4 things at once:
// 1. Bible passages (titles + sample verses)
// 2. Themes + People (study)
// 3. Your notes + highlights

import { SAMPLE_TEXT } from '../data/bible';
import { STUDY_DATA, PEOPLE_INDEX, THEMES_INDEX } from '../data/study';
import { Highlight, Note } from '../store/notesStore';

export type SearchResult = {
  type: 'passage' | 'theme' | 'person' | 'note' | 'highlight';
  title: string;
  subtitle: string;
  ref?: string;
};

const ANXIETY_MAP: Record<string, string[]> = {
  anxiety: ['Philippians 4:6', 'Psalms 23', 'Matthew 6', '1 Peter 5:7', 'John 14'],
  fear: ['Psalms 23', 'Isaiah 41:10', 'John 14', 'Romans 8'],
  love: ['John 3:16', '1 Corinthians 13', '1 John 4'],
  faith: ['Genesis 15:6', 'Hebrews 11', 'Romans 4'],
  prayer: ['Matthew 6', 'Philippians 4:6', 'Psalms 23'],
};

export function searchAll(query: string, notes: Note[], highlights: Highlight[]): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  const results: SearchResult[] = [];

  // 1. Special helper: "verses about anxiety" -> map to passages
  for (const key of Object.keys(ANXIETY_MAP)) {
    if (q.includes(key)) {
      for (const ref of ANXIETY_MAP[key]) {
        results.push({ type: 'passage', title: ref, subtitle: `Bible passage about ${key}` });
      }
    }
  }

  // 2. Bible titles + sample verses
  for (const ref of Object.keys(SAMPLE_TEXT)) {
    if (ref.toLowerCase().includes(q)) {
      results.push({ type: 'passage', title: ref, subtitle: 'Bible chapter', ref });
    }
  }
  for (const [ref, verses] of Object.entries(SAMPLE_TEXT)) {
    for (const v of verses) {
      if (v.text.toLowerCase().includes(q)) {
        results.push({ type: 'passage', title: `${ref}:${v.verse}`, subtitle: v.text.slice(0, 80) + '...', ref });
        break;
      }
    }
    if (results.length > 12) break;
  }

  // 3. People + Themes
  for (const p of PEOPLE_INDEX) {
    if (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) {
      results.push({ type: 'person', title: p.name, subtitle: p.desc, ref: p.passages[0] });
    }
  }
  for (const t of THEMES_INDEX) {
    if (t.name.toLowerCase().includes(q)) {
      results.push({ type: 'theme', title: t.name, subtitle: t.desc, ref: t.passages[0] });
    }
  }
  for (const [ref, s] of Object.entries(STUDY_DATA)) {
    for (const th of s.themes) {
      if (th.name.toLowerCase().includes(q)) {
        results.push({ type: 'theme', title: `${th.name} in ${ref}`, subtitle: th.desc, ref });
      }
    }
  }

  // 4. Your notes + highlights (most important - show first if match)
  const myResults: SearchResult[] = [];
  for (const n of notes) {
    if (n.content.toLowerCase().includes(q) || n.passage_ref.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))) {
      myResults.push({ type: 'note', title: `📝 ${n.passage_ref}`, subtitle: n.content.slice(0, 80), ref: n.passage_ref });
    }
  }
  for (const h of highlights) {
    if (h.text.toLowerCase().includes(q) || h.passage_ref.toLowerCase().includes(q)) {
      myResults.push({ type: 'highlight', title: `⭐ ${h.passage_ref}:${h.verse}`, subtitle: h.text.slice(0, 80), ref: h.passage_ref });
    }
  }

  return [...myResults, ...results].slice(0, 20);
}

// STUDY SERVICE - Phase 3
// Librarian for understanding. Give me "Genesis 1", I give study card.
// If no special card, make a simple generic one so app never breaks.

import { STUDY_DATA, StudyEntry } from '../data/study';
import { BOOK_INTROS } from '../data/books';

export function getStudy(ref: string): StudyEntry {
  if (STUDY_DATA[ref]) return STUDY_DATA[ref];

  // Step 3 public: real book intro for every chapter (e.g. Genesis 37 uses Genesis intro)
  const book = ref.split(' ').slice(0, -1).join(' ');
  const intro = BOOK_INTROS[book];
  return {
    ref,
    context: {
      author: intro?.author ?? `See ${book} intro`,
      audience: intro?.audience ?? 'Original readers + us today',
      setting: intro ? `${ref} — ${intro.setting}` : `${ref} in storyline`,
      purpose: intro?.purpose ?? 'Part of whole Bible journey',
      summary: intro ? `${book}: ${intro.purpose}. Read ${ref} slowly in that light.` : `Read ${ref} slowly. Ask: What happened? What does it show about God and people?`,
    },
    people: [],
    places: [],
    themes: [{ name: 'Journey', desc: 'Every chapter moves the big story forward.' }],
    connections: ['Genesis 1', 'John 1', 'Romans 8'],
    questions: ['What does this say?', 'What does it reveal about God?', 'What will you remember tomorrow?'],
  };
}

// BIBLE SERVICE - Step 1 Public Ready (API + Offline Cache)
// How it works, simple:
// 1. Try phone memory (cache) - fastest, works in subway
// 2. Try local KJV samples (Genesis 1,2 + John 1)
// 3. Try API.Bible cloud (needs YOUR key in app/.env) - full text
// 4. Fallback placeholder (never crashes)

import { SAMPLE_TEXT } from '../data/bible';

export type Verse = { verse: number; text: string };

const cache = new Map<string, Verse[]>();

const API_KEY = process.env.EXPO_PUBLIC_BIBLE_API_KEY || '';
// Free public-domain fallback Bible ID on API.Bible (WEB). You can change to ESV/NIV ID after permission.
const BIBLE_ID = process.env.EXPO_PUBLIC_BIBLE_ID || '9879dbb7cfe39e4d-01';

// API.Bible wants short book codes: "Genesis 3" -> "GEN.3", "1 Samuel 1" -> "1SA.1", "Song of Solomon 2" -> "SNG.2"
const BOOK_CODES: Record<string, string> = {
  Genesis: 'GEN', Exodus: 'EXO', Leviticus: 'LEV', Numbers: 'NUM', Deuteronomy: 'DEU',
  Joshua: 'JOS', Judges: 'JDG', Ruth: 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
  '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
  Ezra: 'EZR', Nehemiah: 'NEH', Esther: 'EST', Job: 'JOB', Psalms: 'PSA', Proverbs: 'PRO',
  Ecclesiastes: 'ECC', 'Song of Solomon': 'SNG', Isaiah: 'ISA', Jeremiah: 'JER',
  Lamentations: 'LAM', Ezekiel: 'EZK', Daniel: 'DAN', Hosea: 'HOS', Joel: 'JOL',
  Amos: 'AMO', Obadiah: 'OBA', Jonah: 'JON', Micah: 'MIC', Nahum: 'NAM',
  Habakkuk: 'HAB', Zephaniah: 'ZEP', Haggai: 'HAG', Zechariah: 'ZEC', Malachi: 'MAL',
  Matthew: 'MAT', Mark: 'MRK', Luke: 'LUK', John: 'JHN', Acts: 'ACT', Romans: 'ROM',
  '1 Corinthians': '1CO', '2 Corinthians': '2CO', Galatians: 'GAL', Ephesians: 'EPH',
  Philippians: 'PHP', Colossians: 'COL', '1 Thessalonians': '1TH', '2 Thessalonians': '2TH',
  '1 Timothy': '1TI', '2 Timothy': '2TI', Titus: 'TIT', Philemon: 'PHM', Hebrews: 'HEB',
  James: 'JAS', '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN',
  '3 John': '3JN', Jude: 'JUD', Revelation: 'REV',
};

export function toPassageId(chapterRef: string): string {
  // "Genesis 3" -> split last space: book="Genesis", ch="3" -> "GEN.3"
  const lastSpace = chapterRef.lastIndexOf(' ');
  if (lastSpace === -1) return chapterRef;
  const book = chapterRef.slice(0, lastSpace);
  const ch = chapterRef.slice(lastSpace + 1);
  const code = BOOK_CODES[book] || book;
  return `${code}.${ch}`;
}

export function getChapterText(chapterRef: string): Verse[] {
  if (cache.has(chapterRef)) return cache.get(chapterRef)!;
  if (SAMPLE_TEXT[chapterRef]) {
    cache.set(chapterRef, SAMPLE_TEXT[chapterRef]);
    return SAMPLE_TEXT[chapterRef];
  }
  return [
    {
      verse: 1,
      text: `[${chapterRef} - Full text needs API key. Add EXPO_PUBLIC_BIBLE_API_KEY in app/.env (see STEP1 guide), restart. For now read in physical Bible, then Complete.]`,
    },
    {
      verse: 2,
      text: `Tip: Your plan titles are correct. Only verse text waits for key. Genesis 1,2 + John 1 already work offline.`,
    },
  ];
}

// Async version for public: tries cloud, saves to cache for offline next time
export async function getChapterTextAsync(chapterRef: string): Promise<Verse[]> {
  if (cache.has(chapterRef)) return cache.get(chapterRef)!;
  if (SAMPLE_TEXT[chapterRef]) {
    cache.set(chapterRef, SAMPLE_TEXT[chapterRef]);
    return SAMPLE_TEXT[chapterRef];
  }
  const liveKey = process.env.EXPO_PUBLIC_BIBLE_API_KEY || API_KEY;
  const liveBibleId = process.env.EXPO_PUBLIC_BIBLE_ID || BIBLE_ID;
  console.log(`[Bible] key length: ${liveKey.length}, bible: ${liveBibleId}, ref: ${chapterRef}`);
  if (!liveKey || liveKey.includes('paste-')) {
    console.log('[Bible] no key in bundle - restart with -c after saving .env');
    return getChapterText(chapterRef);
  }
  try {
    // API.Bible wants GEN.3 not Genesis.3
    const bookQuery = toPassageId(chapterRef);
    console.log(`[Bible] fetching ${bookQuery}`);
    const res = await fetch(`https://api.scripture.api.bible/v1/bibles/${liveBibleId}/passages/${bookQuery}?content-type=text`, {
      headers: { 'api-key': liveKey },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.log(`[Bible] API ${res.status}: ${body.slice(0, 200)}`);
      // Show real reason in app so beginner can fix (instead of generic needs-key)
      return [{ verse: 1, text: `[${chapterRef} - Bible API error ${res.status}. ${res.status === 401 ? 'Key wrong or incomplete - recopy full key from Apps page, no spaces.' : res.status === 403 ? 'Key has no access to this translation - try WEB Bible ID.' : 'Check internet, then restart.'} Details: ${body.slice(0, 120)}]` }];
    }
    const json = await res.json();
    const content: string = json?.data?.content || '';
    // Simple split into verses: "1 text 2 text..." fallback to 1 block
    const verses: Verse[] = content
      ? [{ verse: 1, text: content.replace(/<[^>]+>/g, '').slice(0, 4000) }]
      : getChapterText(chapterRef);
    cache.set(chapterRef, verses);
    return verses;
  } catch (e) {
    console.log('[Bible] fetch failed', String(e).slice(0, 200));
    return [{ verse: 1, text: `[${chapterRef} - Network error. Check internet + restart with -c. (${String(e).slice(0, 100)})]` }];
  }
}

// For a Journey Day with multiple chapters (e.g. Genesis 1-3), combine them
export function getReadingText(chapters: string[]): { ref: string; verses: Verse[] }[] {
  return chapters.map((ref) => ({
    ref,
    verses: getChapterText(ref),
  }));
}

export function estimateMinutes(chapters: string[]): number {
  return Math.max(5, chapters.length * 4);
}

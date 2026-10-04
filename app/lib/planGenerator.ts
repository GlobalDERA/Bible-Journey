// PLAN GENERATOR - Phase 1
// Beginner idea: Take 1189 chapters, cut into equal slices.
// Example: 1189 / 365 days = about 3 chapters per day.
// Day 1 = Genesis 1-3, Day 2 = Genesis 4-7, etc.

import { getAllChapters } from '../data/bible';

export type JourneyDay = {
  day_number: number;
  title: string; // e.g. "Genesis 1-3"
  chapters: string[]; // e.g. ["Genesis 1","Genesis 2","Genesis 3"]
  estimated_minutes: number;
};

export function generatePlan(totalDays: number, mode: string = 'whole'): JourneyDay[] {
  const allChapters = getAllChapters(mode);
  const perDay = Math.ceil(allChapters.length / totalDays);

  const days: JourneyDay[] = [];
  for (let i = 0; i < totalDays; i++) {
    const slice = allChapters.slice(i * perDay, (i + 1) * perDay);
    if (slice.length === 0) break;

    // Make pretty title: "Genesis 1-3" or "Matthew 5" or "Genesis 50 - Exodus 2"
    const first = slice[0];
    const last = slice[slice.length - 1];
    let title = first;
    if (slice.length > 1) {
      // If same book, shorten: Genesis 1 + Genesis 3 => Genesis 1-3
      const firstParts = first.split(' ');
      const lastParts = last.split(' ');
      const firstBook = firstParts.slice(0, -1).join(' ');
      const lastBook = lastParts.slice(0, -1).join(' ');
      const firstCh = firstParts[firstParts.length - 1];
      const lastCh = lastParts[lastParts.length - 1];
      if (firstBook === lastBook) {
        title = `${firstBook} ${firstCh}-${lastCh}`;
      } else {
        title = `${first} - ${last}`;
      }
    }

    // Reading speed: ~200 words per minute, ~150 words per chapter average
    // So 3 chapters ~ 450 words ~ 2-3 min? We use 4 min per chapter to feel safe + reflect time.
    const estimated_minutes = Math.max(5, slice.length * 4);

    days.push({
      day_number: i + 1,
      title,
      chapters: slice,
      estimated_minutes,
    });
  }
  return days;
}

// Quick examples for onboarding buttons
export const PLAN_OPTIONS = [
  { label: '90 days', days: 90, desc: 'Fast ~13 chapters/day' },
  { label: '180 days', days: 180, desc: 'Steady ~7 chapters/day' },
  { label: '365 days', days: 365, desc: 'Relaxed ~3 chapters/day (Recommended)' },
];

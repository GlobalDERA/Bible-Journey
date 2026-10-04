// RECOVERY LOGIC - Phase 2 Catch Me Up
// Beginner idea: If you miss days, you have NOT failed.
// We count how many days you missed, then offer 4 kind choices.

import { JourneyDay } from './planGenerator';

export type RecoveryOption = 'continue' | 'spread7' | 'quick' | 'restart';

// How many days did you miss?
// Simple rule: days since last completion minus 1.
// Example: last read 5 days ago, you missed 4 days.
export function getMissedCount(lastCompletedAt: string | null): number {
  if (!lastCompletedAt) return 0;
  const last = new Date(lastCompletedAt).getTime();
  const now = Date.now();
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays - 1);
}

// For demo/testing: force missed days without waiting real days
export function getMissedDaysList(days: JourneyDay[], currentDay: number, missedCount: number): JourneyDay[] {
  // Missed = the days before current that are not completed
  // Simplified: take previous N days before current
  const start = Math.max(1, currentDay - missedCount);
  return days.filter((d) => d.day_number >= start && d.day_number < currentDay);
}

export function buildRecoveryPlan(
  days: JourneyDay[],
  currentDay: number,
  missedDays: JourneyDay[],
  option: RecoveryOption
): { newDays: JourneyDay[]; newCurrentDay: number; message: string } {
  if (missedDays.length === 0) {
    return { newDays: days, newCurrentDay: currentDay, message: 'Nothing missed. Keep going!' };
  }

  if (option === 'continue') {
    // Ignore missed, just continue. Missed stay incomplete but we don't punish.
    return { newDays: days, newCurrentDay: currentDay, message: 'Continuing normally. Missed days stay in history.' };
  }

  if (option === 'spread7') {
    // Spread missed chapters across next 7 days
    // Beginner: take all missed chapters, divide into 7 small extra pieces
    const missedChapters = missedDays.flatMap((d) => d.chapters);
    const perDay = Math.ceil(missedChapters.length / 7);
    const newDays = [...days];
    for (let i = 0; i < 7; i++) {
      const idx = newDays.findIndex((d) => d.day_number === currentDay + i);
      if (idx === -1) continue;
      const extra = missedChapters.slice(i * perDay, (i + 1) * perDay);
      if (extra.length === 0) continue;
      const old = newDays[idx];
      newDays[idx] = {
        ...old,
        title: `${old.title} + catch-up (${extra.length} ch)`,
        chapters: [...old.chapters, ...extra],
        estimated_minutes: old.estimated_minutes + extra.length * 4,
      };
    }
    return { newDays, newCurrentDay: currentDay, message: `Spread ${missedDays.length} missed days over next 7 days.` };
  }

  if (option === 'quick') {
    // Condense missed into 1 summary day before current
    const missedChapters = missedDays.flatMap((d) => d.chapters);
    const summaryDay: JourneyDay = {
      day_number: currentDay,
      title: `Quick catch-up: ${missedDays.length} days in 1`,
      chapters: missedChapters.slice(0, 5), // only key readings, max 5 chapters
      estimated_minutes: 15,
    };
    const newDays = days.map((d) => (d.day_number === currentDay ? summaryDay : d));
    return { newDays, newCurrentDay: currentDay, message: 'Quick summary created. Read key passages only.' };
  }

  // restart: keep history, start fresh from today
  // We keep old days but jump current to after missed
  return { newDays: days, newCurrentDay: currentDay, message: 'Fresh start from today. Old progress saved.' };
}

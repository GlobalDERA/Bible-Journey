// JOURNEY STORE - Phase 1
// Beginner idea: Backpack that remembers your plan.
// Which day are you on? Which days are done? Saved to Supabase when logged in.

import { create } from 'zustand';
import { JourneyDay, generatePlan } from '../lib/planGenerator';
import { supabase } from '../lib/supabase';

type JourneyState = {
  journeyId: string | null;
  journeyTitle: string;
  totalDays: number;
  days: JourneyDay[];
  completedDays: number[]; // e.g. [1,2,3] = Day 1,2,3 done
  currentDay: number;
  isLoading: boolean;
  lastCompletedAt: string | null; // Phase 2: when did you last tap Complete?
  demoMissedDays: number; // Phase 2: for testing without waiting real days (0 = use real date)

  createLocalPlan: (totalDays: number, mode?: string) => void;
  completeDay: (dayNumber: number) => Promise<void>;
  setCurrentDay: (day: number) => void;
  saveToSupabase: (userId: string) => Promise<void>;
  loadFromSupabase: (userId: string) => Promise<void>;
  setDemoMissedDays: (n: number) => void; // Phase 2 test helper
  applyRecovery: (newDays: JourneyDay[], newCurrentDay: number) => void; // Phase 2
};

export const useJourneyStore = create<JourneyState>((set, get) => ({
  journeyId: null,
  journeyTitle: 'My Bible Journey',
  totalDays: 365,
  days: [],
  completedDays: [],
  currentDay: 1,
  isLoading: false,
  lastCompletedAt: null,
  demoMissedDays: 0,

  createLocalPlan: (totalDays, mode = 'whole') => {
    const days = generatePlan(totalDays, mode);
    set({
      days,
      totalDays,
      currentDay: 1,
      completedDays: [],
      lastCompletedAt: new Date().toISOString(),
      demoMissedDays: 0,
      journeyTitle: totalDays === 90 ? '90-Day Whole Bible' : totalDays === 180 ? '180-Day Whole Bible' : `${totalDays}-Day Bible Journey`,
    });
  },

  completeDay: async (dayNumber) => {
    const { completedDays, currentDay, days } = get();
    if (completedDays.includes(dayNumber)) return;

    const newCompleted = [...completedDays, dayNumber];
    const nextDay = Math.min(currentDay + 1, days.length || dayNumber + 1);
    // Phase 2: remember when you last read, reset demo missed
    set({ completedDays: newCompleted, currentDay: dayNumber >= currentDay ? nextDay : currentDay, lastCompletedAt: new Date().toISOString(), demoMissedDays: 0 });

    // Try to save to Supabase if user is logged in (silent fail if offline)
    try {
      const { journeyId } = get();
      if (journeyId) {
        await supabase.from('journey_days').update({ is_completed: true, completed_at: new Date().toISOString() }).eq('journey_id', journeyId).eq('day_number', dayNumber);
      }
    } catch (e) {
      console.log('Offline - will sync later', e);
    }
  },

  setCurrentDay: (day) => set({ currentDay: day }),

  saveToSupabase: async (userId) => {
    const { days, totalDays, journeyTitle } = get();
    if (days.length === 0) return;
    set({ isLoading: true });
    try {
      const { data: journey, error } = await supabase.from('journeys').insert({ user_id: userId, title: journeyTitle, total_days: totalDays, mode: 'whole' }).select().single();
      if (error) throw error;

      const rows = days.map((d) => ({
        journey_id: journey.id,
        day_number: d.day_number,
        title: d.title,
        estimated_minutes: d.estimated_minutes,
      }));
      const { error: daysError } = await supabase.from('journey_days').insert(rows);
      if (daysError) throw daysError;

      set({ journeyId: journey.id, isLoading: false });
    } catch (e) {
      console.log('Save failed', e);
      set({ isLoading: false });
    }
  },

  loadFromSupabase: async (userId) => {
    set({ isLoading: true });
    try {
      const { data: journeys } = await supabase.from('journeys').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1);
      if (!journeys || journeys.length === 0) {
        // No saved plan - create default 365 local
        const days = generatePlan(365, 'whole');
        set({ days, totalDays: 365, isLoading: false });
        return;
      }
      const j = journeys[0];
      const { data: dayRows } = await supabase.from('journey_days').select('*').eq('journey_id', j.id).order('day_number');
      if (dayRows) {
        const days: JourneyDay[] = dayRows.map((r: any) => ({
          day_number: r.day_number,
          title: r.title,
          chapters: [], // titles only from DB for Phase 1, regenerate chapters locally
          estimated_minutes: r.estimated_minutes,
        }));
        // Regenerate chapters for offline reading
        const full = generatePlan(j.total_days, 'whole');
        const merged = days.map((d, i) => ({ ...d, chapters: full[i]?.chapters ?? [] }));
        const completed = dayRows.filter((r: any) => r.is_completed).map((r: any) => r.day_number);
        const current = completed.length > 0 ? Math.min(Math.max(...completed) + 1, days.length) : 1;
        set({ journeyId: j.id, journeyTitle: j.title, totalDays: j.total_days, days: merged, completedDays: completed, currentDay: current, isLoading: false });
      }
    } catch (e) {
      console.log('Load failed, using local', e);
      const days = generatePlan(365, 'whole');
      set({ days, totalDays: 365, isLoading: false });
    }
  },

  setDemoMissedDays: (n) => set({ demoMissedDays: n }),

  applyRecovery: (newDays, newCurrentDay) => set({ days: newDays, currentDay: newCurrentDay, demoMissedDays: 0, lastCompletedAt: new Date().toISOString() }),
}));

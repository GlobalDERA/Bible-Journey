// PREMIUM + ANALYTICS - Phase 6
// Beginner: Free = read + plans + notes. Premium = audio + AI + deep study.
// MVP: local demo flag (no App Store setup needed). RevenueCat later for real money.

import { create } from 'zustand';
import { supabase } from './supabase';

export const FREE_FEATURES = ['Bible reading', 'Basic plans 90/180/365', 'Progress', 'Highlights + Notes', 'Basic search'];
export const PREMIUM_FEATURES = ['Audio Bible', 'AI Explain unlimited', 'Deep study + Connections', 'Advanced search', 'Study collections'];

type PremiumState = {
  isPremium: boolean;
  unlockDemo: () => void;
  lockDemo: () => void;
};

export const usePremiumStore = create<PremiumState>((set) => ({
  isPremium: false, // demo starts free
  unlockDemo: () => set({ isPremium: true }),
  lockDemo: () => set({ isPremium: false }),
}));

// Analytics: North Star = Completed journeys per month.
// Supporting: activation, Day7/30, completion, recovery, study depth.
export async function trackEvent(userId: string | null, event: string, data: Record<string, any> = {}): Promise<void> {
  console.log(`[Analytics] ${event}`, data);
  if (!userId) return; // offline demo - just log
  try {
    await supabase.from('analytics_events').insert({ user_id: userId, event, data });
  } catch {
    // ignore offline
  }
}

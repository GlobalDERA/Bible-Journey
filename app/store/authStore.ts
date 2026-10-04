import { create } from 'zustand';

// Simple explanation:
// Store = small backpack that remembers who is logged in,
// even when you switch tabs from Home to Profile.

type AuthState = {
  userId: string | null;
  email: string | null;
  isLoading: boolean;
  setUser: (userId: string | null, email: string | null) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  isLoading: false,
  setUser: (userId, email) => set({ userId, email }),
  signOut: () => set({ userId: null, email: null }),
}));

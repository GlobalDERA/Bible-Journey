// NOTES STORE - Phase 4 Personal Bible Memory
// Beginner idea: Backpack for YOUR stuff.
// Highlights = pretty colors, Bookmarks = save for later, Notes = your thoughts with tags.

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Highlight = {
  id: string;
  passage_ref: string; // e.g. "Genesis 1"
  verse: number;
  text: string;
  color: string; // yellow, green, blue, pink
  created_at: string;
};

export type Bookmark = {
  id: string;
  passage_ref: string;
  created_at: string;
};

export type Note = {
  id: string;
  passage_ref: string;
  content: string;
  tags: string[]; // e.g. ["Faith","Prayer"]
  created_at: string;
};

type NotesState = {
  highlights: Highlight[];
  bookmarks: Bookmark[];
  notes: Note[];
  addHighlight: (passage_ref: string, verse: number, text: string, color?: string) => void;
  addBookmark: (passage_ref: string) => void;
  removeBookmark: (passage_ref: string) => void;
  addNote: (passage_ref: string, content: string, tags?: string[]) => void;
  getForPassage: (ref: string) => { highlights: Highlight[]; bookmarks: Bookmark[]; notes: Note[] };
  syncToSupabase: (userId: string) => Promise<void>;
};

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const HIGHLIGHT_COLORS = ['#FFF176', '#A5D6A7', '#90CAF9', '#F8BBD0'];

export const useNotesStore = create<NotesState>((set, get) => ({
  highlights: [],
  bookmarks: [],
  notes: [],

  addHighlight: (passage_ref, verse, text, color = '#FFF176') => {
    const h: Highlight = { id: uid(), passage_ref, verse, text, color, created_at: new Date().toISOString() };
    set({ highlights: [...get().highlights, h] });
  },

  addBookmark: (passage_ref) => {
    if (get().bookmarks.some((b) => b.passage_ref === passage_ref)) return;
    set({ bookmarks: [...get().bookmarks, { id: uid(), passage_ref, created_at: new Date().toISOString() }] });
  },

  removeBookmark: (passage_ref) => {
    set({ bookmarks: get().bookmarks.filter((b) => b.passage_ref !== passage_ref) });
  },

  addNote: (passage_ref, content, tags = []) => {
    if (!content.trim()) return;
    const n: Note = { id: uid(), passage_ref, content: content.trim(), tags, created_at: new Date().toISOString() };
    set({ notes: [...get().notes, n] });
    // Try save to Supabase (silent if offline or not logged in)
    supabase
      .from('user_notes')
      .insert({ passage_ref, content: n.content, tags })
      .then(() => {})
      .catch(() => {});
  },

  getForPassage: (ref) => {
    const { highlights, bookmarks, notes } = get();
    return {
      highlights: highlights.filter((h) => h.passage_ref === ref),
      bookmarks: bookmarks.filter((b) => b.passage_ref === ref),
      notes: notes.filter((n) => n.passage_ref === ref),
    };
  },

  syncToSupabase: async (userId) => {
    // Phase 4 simple: push local notes to cloud (highlights/bookmarks stay local for MVP)
    const { notes } = get();
    if (notes.length === 0) return;
    try {
      const rows = notes.slice(-20).map((n) => ({ user_id: userId, passage_ref: n.passage_ref, content: n.content, tags: n.tags }));
      await supabase.from('user_notes').insert(rows);
    } catch (e) {
      console.log('Notes sync failed, keeping local', e);
    }
  },
}));

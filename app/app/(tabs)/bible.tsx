// BIBLE TAB - Full 66-book picker (no more first-10 limit)
// Pick testament -> book -> chapter. Search by name. Prev/Next still works.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { BIBLE_BOOKS } from '../../data/bible';
import { getChapterText, getChapterTextAsync } from '../../lib/bibleService';
import { Colors } from '../../constants/theme';

export default function BibleScreen() {
  const router = useRouter();
  const [bookIndex, setBookIndex] = useState(0);
  const [chapter, setChapter] = useState(1);
  const [filter, setFilter] = useState<'all' | 'OT' | 'NT'>('all');
  const [query, setQuery] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [cloudVerses, setCloudVerses] = useState<{ verse: number; text: string }[] | null>(null);
  const [loadingCloud, setLoadingCloud] = useState(false);

  const book = BIBLE_BOOKS[bookIndex];
  const ref = `${book.name} ${chapter}`;
  const verses = cloudVerses ?? getChapterText(ref);

  // Same cloud fetch as Reader: uses .env Bible key, caches for offline
  useEffect(() => {
    let live = true;
    setCloudVerses(null);
    const needsCloud = !['Genesis 1', 'Genesis 2', 'John 1'].includes(ref);
    if (!needsCloud) return;
    setLoadingCloud(true);
    getChapterTextAsync(ref)
      .then((v) => {
        if (!live) return;
        const isPlaceholder = v[0]?.text?.includes('needs API key') || v[0]?.text?.includes('Bible API error') || v[0]?.text?.includes('Network error');
        if (!isPlaceholder) setCloudVerses(v);
        // If placeholder/error, keep offline text (already shows why)
      })
      .finally(() => live && setLoadingCloud(false));
    return () => {
      live = false;
    };
  }, [ref]);

  const nextChapter = () => {
    if (chapter < book.chapters) setChapter(chapter + 1);
    else if (bookIndex < BIBLE_BOOKS.length - 1) {
      setBookIndex(bookIndex + 1);
      setChapter(1);
    }
  };

  const prevChapter = () => {
    if (chapter > 1) setChapter(chapter - 1);
    else if (bookIndex > 0) {
      const prevBook = BIBLE_BOOKS[bookIndex - 1];
      setBookIndex(bookIndex - 1);
      setChapter(prevBook.chapters);
    }
  };

  const filtered = BIBLE_BOOKS.map((b, i) => ({ ...b, idx: i })).filter(
    (b) => (filter === 'all' || b.testament === filter) && b.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowPicker(!showPicker)}>
        <Text style={styles.bookTitle}>{ref} {showPicker ? '▴' : '▾'}</Text>
      </TouchableOpacity>
      <Text style={styles.trans}>Tap title to pick any of 66 books • {loadingCloud ? 'Loading cloud...' : cloudVerses ? 'Cloud text ✓ offline next time' : 'KJV offline + API cloud'}</Text>

      {showPicker && (
        <View style={styles.picker}>
          <TextInput placeholder="Search book... e.g. John" value={query} onChangeText={setQuery} style={styles.search} />
          <View style={styles.tabs}>
            {(['all', 'OT', 'NT'] as const).map((t) => (
              <TouchableOpacity key={t} onPress={() => setFilter(t)} style={[styles.tab, filter === t && styles.tabActive]}>
                <Text style={filter === t ? styles.tabTextActive : styles.tabText}>{t === 'all' ? 'All 66' : t === 'OT' ? 'OT 39' : 'NT 27'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView style={styles.bookGrid} nestedScrollEnabled>
            <View style={styles.gridWrap}>
              {filtered.map((b) => (
                <TouchableOpacity
                  key={b.name}
                  onPress={() => {
                    setBookIndex(b.idx);
                    setChapter(1);
                    setShowPicker(false);
                  }}
                  style={[styles.bookChip, b.idx === bookIndex && styles.bookChipActive]}
                >
                  <Text style={b.idx === bookIndex ? styles.chipTextActive : styles.chipText}>{b.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <Text style={styles.hint}>Chapters in {book.name}:</Text>
          <ScrollView horizontal style={styles.chRow}>
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => (
              <TouchableOpacity key={c} onPress={() => { setChapter(c); setShowPicker(false); }} style={[styles.chChip, c === chapter && styles.bookChipActive]}>
                <Text style={c === chapter ? styles.chipTextActive : styles.chipText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.nav}>
        <TouchableOpacity onPress={prevChapter} style={styles.navBtn}>
          <Text style={styles.navText}>‹ Prev</Text>
        </TouchableOpacity>
        <Text style={styles.navInfo}>
          {book.name} {chapter}/{book.chapters}
        </Text>
        <TouchableOpacity onPress={nextChapter} style={styles.navBtn}>
          <Text style={styles.navText}>Next ›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {verses.map((v) => (
          <Text key={v.verse} style={styles.verse}>
            <Text style={styles.verseNum}>{v.verse} </Text>
            {v.text}
          </Text>
        ))}
        <TouchableOpacity onPress={() => router.push(`/study?ref=${encodeURIComponent(ref)}` as any)}>
          <Text style={styles.studyLink}>Study {ref} → Context, People, Themes</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 50 },
  bookTitle: { fontSize: 26, fontWeight: '800', color: Colors.ink },
  trans: { color: Colors.muted, fontSize: 13, marginTop: 4 },
  picker: { backgroundColor: '#fff', borderRadius: 12, padding: 10, marginTop: 8, maxHeight: 320, borderWidth: 1, borderColor: '#E5E7EB' },
  search: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 10, marginBottom: 8 },
  tabs: { flexDirection: 'row', marginBottom: 8 },
  tab: { flex: 1, padding: 8, backgroundColor: '#F3F4F6', borderRadius: 8, marginRight: 6, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { color: Colors.ink, fontWeight: '600' },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  bookGrid: { maxHeight: 150 },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  bookChip: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 6, marginBottom: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  bookChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.ink, fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '600', fontSize: 13 },
  chRow: { maxHeight: 44, marginTop: 4 },
  chChip: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 6 },
  hint: { fontSize: 12, color: Colors.muted, marginTop: 8 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12, backgroundColor: '#fff', borderRadius: 12, padding: 10 },
  navBtn: { padding: 8 },
  navText: { color: Colors.primary, fontSize: 17, fontWeight: '600' },
  navInfo: { fontSize: 14, color: Colors.muted },
  scroll: { flex: 1 },
  verse: { fontFamily: 'Georgia', fontSize: 17, lineHeight: 27, color: Colors.ink, marginBottom: 10 },
  verseNum: { color: Colors.gold, fontWeight: '700', fontSize: 13 },
  studyLink: { color: Colors.primary, fontWeight: '700', marginTop: 8, fontSize: 15 },
});

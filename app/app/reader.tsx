// READER SCREEN - Phase 1
// Opened from Home [Start Reading] or Journey list.
// Shows all chapters for that Day, with Complete button.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { VerseItem } from '../components/VerseItem';
import { Colors } from '../constants/theme';
import { useJourneyStore } from '../store/journeyStore';
import { useNotesStore } from '../store/notesStore';
import { getReadingText, getChapterTextAsync } from '../lib/bibleService';

export default function ReaderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dayNum = Number(params.day || 1);

  const { days, completeDay, completedDays, setCurrentDay } = useJourneyStore();
  const { addBookmark, addNote } = useNotesStore();
  const [noteText, setNoteText] = useState('');
  const [cloudSections, setCloudSections] = useState<{ ref: string; verses: { verse: number; text: string }[] }[] | null>(null);
  const day = days.find((d) => d.day_number === dayNum);

  if (!day) {
    return (
      <View style={styles.center}>
        <Text>No reading found for Day {dayNum}. Go back and create a plan first.</Text>
      </View>
    );
  }

  const sections = cloudSections ?? getReadingText(day.chapters.length > 0 ? day.chapters : [day.title]);
  const alreadyDone = completedDays.includes(day.day_number);

  // Step 1 public: try cloud API once (uses .env key), then cache for subway offline
  useEffect(() => {
    let live = true;
    (async () => {
      const refs = day.chapters.length > 0 ? day.chapters : [day.title];
      // Only fetch if we show placeholder (skip Genesis 1,2 + John 1 which are offline)
      const needsCloud = refs.some((r) => !['Genesis 1', 'Genesis 2', 'John 1'].includes(r));
      if (!needsCloud) {
        setCloudSections(null);
        return;
      }
      try {
        const out = [];
        for (const r of refs) {
          const verses = await getChapterTextAsync(r);
          out.push({ ref: r, verses });
        }
        if (live) {
          // Only replace if cloud gave real text (not placeholder)
          const hasReal = out.some((s) => !s.verses[0]?.text?.includes('needs API key'));
          if (hasReal) setCloudSections(out);
        }
      } catch {}
    })();
    return () => {
      live = false;
    };
  }, [dayNum]);

  const handleComplete = async () => {
    await completeDay(day.day_number);
    Alert.alert('Well done!', `Day ${day.day_number} complete. See you tomorrow.`, [
      { text: 'Back Home', onPress: () => router.push('/(tabs)' as any) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.day}>Day {day.day_number}</Text>
      <Text style={styles.title}>{day.title}</Text>
      <Text style={styles.time}>~{day.estimated_minutes} min • KJV sample</Text>

      <PrimaryButton title={`Listen 🎧 Full Day (${day.chapters.length || 1} chapters)`} onPress={() => router.push(`/audio?refs=${encodeURIComponent((day.chapters.length > 0 ? day.chapters : [day.title]).join(','))}` as any)} />

      {sections.map((sec) => (
        <View key={sec.ref} style={styles.section}>
          <Text style={styles.ref}>{sec.ref}</Text>
          <Text style={styles.tapHint}>Tap any verse for colors, note, copy, share 👇</Text>
          {sec.verses.map((v) => (
            <VerseItem
              key={`${sec.ref}-${v.verse}`}
              passageRef={sec.ref}
              verse={v.verse}
              text={v.text}
              onNote={(ref, vs, txt) => setNoteText(`${ref}:${vs} – `)}
            />
          ))}
          <View style={styles.saveRow}>
            <TouchableOpacity style={styles.saveBtn} onPress={() => router.push(`/study?ref=${encodeURIComponent(sec.ref)}` as any)}>
              <Text>📖 Explore {sec.ref}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                addBookmark(sec.ref);
                Alert.alert('Bookmarked ❤️', `${sec.ref} saved. See Profile -> Memory.`);
              }}
            >
              <Text>🔖 Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => router.push(`/memory?ref=${encodeURIComponent(sec.ref)}` as any)}>
              <Text>📖 Memory →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {alreadyDone ? (
        <Text style={styles.done}>✓ Already completed. Tap below to re-read or go Home.</Text>
      ) : (
        <Text style={styles.reflect}>Reflect: What stood out to you? Write below - it becomes memory!</Text>
      )}

      <TextInput placeholder="What stood out? (tap 📝 Note on any verse to start here...)" value={noteText} onChangeText={setNoteText} style={styles.noteInput} multiline />
      <PrimaryButton
        title="Save Note 📝"
        onPress={() => {
          if (!noteText.trim()) {
            Alert.alert('Write something first (or tap 📝 Note on a verse)');
            return;
          }
          // If note starts with "Ref:V – ", save to that chapter; else first chapter
          const m = noteText.match(/^(.+?):(\d+)\s*[–-]/);
          const ref = m ? m[1] : day.chapters[0] || day.title;
          addNote(ref, noteText, ['Reflection']);
          setNoteText('');
          Alert.alert('Saved!', `${ref} note added to your memory.`);
        }}
      />

      <PrimaryButton title={alreadyDone ? 'Back to Home' : 'Mark Complete ✓'} onPress={() => (alreadyDone ? router.push('/(tabs)' as any) : handleComplete())} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  day: { fontSize: 14, color: Colors.muted, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: Colors.ink, marginTop: 4 },
  time: { color: Colors.muted, marginTop: 4, marginBottom: 12 },
  section: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginVertical: 8 },
  ref: { fontSize: 18, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  tapHint: { fontSize: 12, color: Colors.muted, marginBottom: 10 },
  verse: { fontFamily: 'Georgia', fontSize: 17, lineHeight: 27, color: Colors.ink, marginBottom: 8 },
  num: { color: Colors.gold, fontWeight: '700', fontSize: 13 },
  reflect: { fontStyle: 'italic', color: Colors.muted, marginVertical: 12, textAlign: 'center' },
  done: { color: Colors.success, textAlign: 'center', marginVertical: 12, fontWeight: '600' },
  saveRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  saveBtn: { backgroundColor: '#fff', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#E5E7EB', flex: 1, marginRight: 6, alignItems: 'center' },
  noteInput: { backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E5E7EB', marginVertical: 8, minHeight: 60, textAlignVertical: 'top' },
});

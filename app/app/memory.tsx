// MEMORY SCREEN - Phase 4 "Your journey with Romans 8"
// Shows first read, highlights, reflections, bookmarks for one passage.

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { Colors } from '../constants/theme';
import { useNotesStore } from '../store/notesStore';
import { useJourneyStore } from '../store/journeyStore';

export default function MemoryScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const ref = String(params.ref || 'Genesis 1');
  const { highlights, bookmarks, notes } = useNotesStore();
  const { completedDays } = useJourneyStore();

  const myH = highlights.filter((h) => h.passage_ref === ref);
  const myN = notes.filter((n) => n.passage_ref === ref);
  const isFav = bookmarks.some((b) => b.passage_ref === ref);
  const first = [...myH, ...myN].sort((a, b) => a.created_at.localeCompare(b.created_at))[0];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.small}>Your journey with</Text>
      <Text style={styles.ref}>{ref}</Text>

      <Card title={isFav ? '❤️ Favorite chapter' : 'Passage memory'}>
        <Text style={styles.line}>📖 First touched: {first ? new Date(first.created_at).toLocaleDateString() : 'Not yet - read it!'}</Text>
        <Text style={styles.line}>⭐ Highlighted {myH.length} verse{myH.length === 1 ? '' : 's'}</Text>
        <Text style={styles.line}>📝 {myN.length} reflection{myN.length === 1 ? '' : 's'}</Text>
        <Text style={styles.line}>📚 {completedDays.length} total reading days in journey</Text>
      </Card>

      {myH.map((h) => (
        <View key={h.id} style={[styles.hl, { backgroundColor: h.color }]}>
          <Text style={styles.hlText}>
            {ref}:{h.verse} — {h.text}
          </Text>
        </View>
      ))}

      {myN.map((n) => (
        <Card key={n.id} title={`📝 ${new Date(n.created_at).toLocaleDateString()}`} subtitle={n.tags.length > 0 ? `Tags: ${n.tags.join(', ')}` : undefined}>
          <Text style={styles.line}>{n.content}</Text>
        </Card>
      ))}

      {myH.length === 0 && myN.length === 0 && (
        <Text style={styles.empty}>No memory yet. Highlight a verse or write what stood out, then come back — this page will remember.</Text>
      )}

      <PrimaryButton title={`Study ${ref}`} onPress={() => router.push(`/study?ref=${encodeURIComponent(ref)}` as any)} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 60 },
  small: { color: Colors.muted, fontSize: 14 },
  ref: { fontSize: 28, fontWeight: '800', color: Colors.ink, marginBottom: 12 },
  line: { fontSize: 15, color: Colors.ink, marginVertical: 3 },
  hl: { borderRadius: 10, padding: 12, marginVertical: 6 },
  hlText: { fontSize: 15, color: Colors.ink },
  empty: { color: Colors.muted, fontStyle: 'italic', textAlign: 'center', marginVertical: 16 },
});

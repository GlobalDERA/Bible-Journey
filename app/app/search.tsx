// SEARCH SCREEN - Phase 4
// Search finds Bible + Themes + People + YOUR notes. Personal knowledge system.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { searchAll } from '../lib/search';
import { useNotesStore } from '../store/notesStore';

export default function SearchScreen() {
  const router = useRouter();
  const [q, setQ] = useState('anxiety');
  const { notes, highlights } = useNotesStore();
  const results = searchAll(q, notes, highlights);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <Text style={styles.sub}>Try "anxiety", "faith", "Genesis", or a word from your notes.</Text>
      <TextInput placeholder="verses about anxiety..." value={q} onChangeText={setQ} style={styles.input} />

      {results.map((r, i) => (
        <TouchableOpacity
          key={`${r.type}-${r.title}-${i}`}
          onPress={() => {
            if (r.ref) router.push(`/study?ref=${encodeURIComponent(r.ref)}` as any);
          }}
          style={styles.row}
        >
          <Text style={styles.rowTitle}>{r.title}</Text>
          <Text style={styles.rowSub}>
            [{r.type}] {r.subtitle}
          </Text>
        </TouchableOpacity>
      ))}

      {results.length === 0 && <Text style={styles.sub}>Type 2+ letters to search.</Text>}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.ink },
  sub: { color: Colors.muted, marginVertical: 8 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E5E7EB', marginVertical: 8 },
  row: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginVertical: 4 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: Colors.ink },
  rowSub: { fontSize: 13, color: Colors.muted, marginTop: 2 },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme';
import { PEOPLE_INDEX, THEMES_INDEX } from '../../data/study';
import { Card } from '../../components/Card';

// EXPLORE TAB - Phase 3 Real
// Browse People and Themes. Tap to see passages (graph start).
export default function ExploreScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'people' | 'themes'>('people');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.sub}>Tap any person or theme to see connections.</Text>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('people')} style={[styles.tab, tab === 'people' && styles.active]}>
          <Text style={tab === 'people' ? styles.tabTextActive : styles.tabText}>People</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('themes')} style={[styles.tab, tab === 'themes' && styles.active]}>
          <Text style={tab === 'themes' ? styles.tabTextActive : styles.tabText}>Themes</Text>
        </TouchableOpacity>
      </View>

      {tab === 'people'
        ? PEOPLE_INDEX.map((p) => (
            <Card key={p.name} title={p.name} subtitle={p.desc}>
              <Text style={styles.pass}>Passages: {p.passages.join(' • ')}</Text>
              <Text style={styles.link} onPress={() => router.push(`/study?ref=${encodeURIComponent(p.passages[0])}` as any)}>
                Study {p.passages[0]} →
              </Text>
            </Card>
          ))
        : THEMES_INDEX.map((t) => (
            <Card key={t.name} title={t.name} subtitle={t.desc}>
              <Text style={styles.pass}>Passages: {t.passages.join(' • ')}</Text>
              <Text style={styles.link} onPress={() => router.push(`/study?ref=${encodeURIComponent(t.passages[0])}` as any)}>
                Study {t.passages[0]} →
              </Text>
            </Card>
          ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 50 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.ink },
  sub: { color: Colors.muted, marginBottom: 12 },
  tabs: { flexDirection: 'row', marginBottom: 12 },
  tab: { flex: 1, padding: 12, backgroundColor: '#fff', borderRadius: 10, marginRight: 8, alignItems: 'center' },
  active: { backgroundColor: Colors.primary },
  tabText: { color: Colors.ink, fontWeight: '600' },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  pass: { fontSize: 13, color: Colors.muted, marginTop: 8 },
  link: { color: Colors.primary, fontWeight: '600', marginTop: 6 },
});

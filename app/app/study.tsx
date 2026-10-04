// STUDY SCREEN - Phase 3
// Opened from Reader [Explore This Passage] or Explore tab.
// Shows Context, People, Places, Themes, Connections, Questions.

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { Colors } from '../constants/theme';
import { getStudy } from '../lib/studyService';

export default function StudyScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const ref = String(params.ref || 'Genesis 1');
  const study = getStudy(ref);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.ref}>{study.ref}</Text>
      <Text style={styles.title}>Understand</Text>

      <Card title="What happened?" subtitle={study.context.summary} />

      <Card title="Context">
        <Text style={styles.line}>✍️ Author: {study.context.author}</Text>
        <Text style={styles.line}>👥 Audience: {study.context.audience}</Text>
        <Text style={styles.line}>📍 Setting: {study.context.setting}</Text>
        <Text style={styles.line}>🎯 Purpose: {study.context.purpose}</Text>
      </Card>

      {study.people.length > 0 && (
        <Card title={`People (${study.people.length})`}>
          {study.people.map((p) => (
            <Text key={p.name} style={styles.line}>• {p.name} — {p.desc}</Text>
          ))}
        </Card>
      )}

      {study.places.length > 0 && (
        <Card title={`Places (${study.places.length})`}>
          {study.places.map((p) => (
            <Text key={p.name} style={styles.line}>• {p.name} — {p.desc}</Text>
          ))}
        </Card>
      )}

      <Card title={`Themes (${study.themes.length})`}>
        {study.themes.map((t) => (
          <Text key={t.name} style={styles.line}>• {t.name} — {t.desc}</Text>
        ))}
      </Card>

      <Card title="Connections" subtitle="Tap to see how Bible links together">
        {study.connections.map((c) => (
          <Text key={c} style={styles.link} onPress={() => router.push(`/study?ref=${encodeURIComponent(c)}` as any)}>
            🔗 {c} →
          </Text>
        ))}
      </Card>

      <Card title="Reflect questions">
        {study.questions.map((q, i) => (
          <Text key={i} style={styles.line}>{i + 1}. {q}</Text>
        ))}
      </Card>

      <PrimaryButton title={`Explain "${study.themes[0]?.name ?? study.ref}" ✨`} onPress={() => router.push(`/explain?ref=${encodeURIComponent(study.ref)}&phrase=${encodeURIComponent(study.themes[0]?.name ?? study.ref)}` as any)} />

      <PrimaryButton title="Back to Reading" onPress={() => router.back()} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 60 },
  ref: { fontSize: 14, color: Colors.muted, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: Colors.ink, marginBottom: 8 },
  line: { fontSize: 15, color: Colors.ink, marginVertical: 4, lineHeight: 22 },
  link: { fontSize: 15, color: Colors.primary, marginVertical: 4, fontWeight: '600' },
});

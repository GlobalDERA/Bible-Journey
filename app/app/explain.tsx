// EXPLAIN SCREEN - Phase 5
// Highlight phrase -> Explain. Shows Simple / Bible / History / Related / Deeper with labels.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { Colors } from '../constants/theme';
import { explainPhrase } from '../lib/aiService';

export default function ExplainScreen() {
  const params = useLocalSearchParams();
  const initialRef = String(params.ref || 'Genesis 1');
  const initialPhrase = String(params.phrase || 'covenant');

  const [phrase, setPhrase] = useState(initialPhrase);
  const [ref] = useState(initialRef);
  const [result, setResult] = useState(() => explainPhrase(initialPhrase, initialRef));

  const handleExplain = () => {
    setResult(explainPhrase(phrase, ref));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.small}>Explain in {ref}</Text>
      <Text style={styles.title}>Explain This</Text>

      <TextInput placeholder="Highlight phrase, e.g. justification by faith" value={phrase} onChangeText={setPhrase} style={styles.input} />
      <PrimaryButton title="Explain ✨" onPress={handleExplain} />

      <Card title="Simple explanation" subtitle="[AI IDEA] plain language">
        <Text style={styles.line}>{result.simple}</Text>
      </Card>

      <Card title="Biblical context" subtitle="[BIBLE] verses first">
        <Text style={styles.line}>{result.bibleContext}</Text>
      </Card>

      <Card title="History" subtitle="[HISTORY] vetted info">
        <Text style={styles.line}>{result.history}</Text>
      </Card>

      <Card title="Related passages" subtitle="Tap in Study to explore">
        {result.related.map((r) => (
          <Text key={r} style={styles.link}>
            🔗 {r}
          </Text>
        ))}
      </Card>

      <Card title="Go deeper">
        <Text style={styles.line}>{result.deeper}</Text>
      </Card>

      <Text style={styles.warn}>{result.warning}</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 60 },
  small: { color: Colors.muted, fontSize: 14 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.ink, marginBottom: 12 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },
  line: { fontSize: 15, color: Colors.ink, lineHeight: 22 },
  link: { fontSize: 15, color: Colors.primary, fontWeight: '600', marginVertical: 2 },
  warn: { fontSize: 12, color: Colors.muted, fontStyle: 'italic', textAlign: 'center', marginTop: 12 },
});

// PAYWALL SCREEN - Phase 6
// Free vs Premium $5-10/mo. Demo unlock, RevenueCat later for real App Store money.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { Colors } from '../constants/theme';
import { FREE_FEATURES, PREMIUM_FEATURES, usePremiumStore } from '../lib/premium';

export default function PremiumScreen() {
  const router = useRouter();
  const { isPremium, unlockDemo, lockDemo } = usePremiumStore();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bible Journey Premium</Text>
      <Text style={styles.sub}>Read free forever. Go deeper with Premium.</Text>

      <Card title="Free (forever)">
        {FREE_FEATURES.map((f) => (
          <Text key={f} style={styles.line}>✓ {f}</Text>
        ))}
      </Card>

      <Card title="Premium $5-10/mo" subtitle={isPremium ? '✅ Active (demo)' : 'Advanced study + Audio + AI'}>
        {PREMIUM_FEATURES.map((f) => (
          <Text key={f} style={styles.line}>⭐ {f}</Text>
        ))}
      </Card>

      {isPremium ? (
        <PrimaryButton title="Lock Demo (back to Free)" onPress={() => { lockDemo(); Alert.alert('Back to Free'); }} />
      ) : (
        <PrimaryButton
          title="Unlock Demo Premium"
          onPress={() => {
            unlockDemo();
            Alert.alert('Premium demo on!', 'Audio + AI unlimited unlocked for testing.', [{ text: 'Try Audio', onPress: () => router.push('/audio?ref=Genesis 1' as any) }]);
          }}
        />
      )}

      <Text style={styles.note}>
        Real money later with RevenueCat (handles Apple/Google pay). Steps in docs/PHASE_6_GUIDE.md. For MVP demo flag is enough to test paywall flow.
      </Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.ink },
  sub: { color: Colors.muted, marginVertical: 8 },
  line: { fontSize: 15, color: Colors.ink, marginVertical: 3 },
  note: { fontSize: 12, color: Colors.muted, fontStyle: 'italic', textAlign: 'center', marginTop: 12 },
});

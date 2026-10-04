// CATCH UP SCREEN - Phase 2
// Shows when you missed days. Kind, not shaming.
// 4 options from PRD Section 7.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { Colors } from '../constants/theme';
import { useJourneyStore } from '../store/journeyStore';
import { getMissedCount, getMissedDaysList, buildRecoveryPlan, RecoveryOption } from '../lib/recovery';

export default function CatchUpScreen() {
  const router = useRouter();
  const { days, currentDay, lastCompletedAt, demoMissedDays, applyRecovery } = useJourneyStore();
  const [selected, setSelected] = useState<RecoveryOption>('continue');

  // Real missed from date, or demo number for testing
  const realMissed = getMissedCount(lastCompletedAt);
  const missedCount = demoMissedDays > 0 ? demoMissedDays : realMissed;
  const missedDays = getMissedDaysList(days, currentDay, missedCount);

  const options: { id: RecoveryOption; title: string; desc: string }[] = [
    { id: 'continue', title: 'Continue normally', desc: 'Ignore missed, keep going. No guilt.' },
    { id: 'spread7', title: 'Catch up slowly', desc: `Spread ${missedCount} missed days over next 7 days.` },
    { id: 'quick', title: 'Quick catch-up', desc: 'Condense missed into 1 short summary + key readings.' },
    { id: 'restart', title: 'Restart from today', desc: 'Keep history, start fresh schedule today.' },
  ];

  const handleApply = () => {
    const result = buildRecoveryPlan(days, currentDay, missedDays, selected);
    applyRecovery(result.newDays, result.newCurrentDay);
    Alert.alert('Done!', result.message, [{ text: 'Back Home', onPress: () => router.push('/(tabs)' as any) }]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Welcome back. You haven't lost your progress.</Text>
      <Text style={styles.sub}>
        {missedCount > 0 ? `You missed ${missedCount} day${missedCount > 1 ? 's' : ''}. Pick what feels kind:` : 'You are all caught up! This screen is for when you miss days.'}
      </Text>

      {missedDays.slice(0, 5).map((d) => (
        <Text key={d.day_number} style={styles.missed}>
          • Day {d.day_number}: {d.title}
        </Text>
      ))}

      {options.map((o) => (
        <TouchableOpacity key={o.id} onPress={() => setSelected(o.id)} style={[styles.opt, selected === o.id && styles.active]}>
          <Text style={styles.optTitle}>{o.title} {selected === o.id ? '✓' : ''}</Text>
          <Text style={styles.optDesc}>{o.desc}</Text>
        </TouchableOpacity>
      ))}

      <PrimaryButton title="Apply My Choice" onPress={handleApply} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 60 },
  welcome: { fontSize: 24, fontWeight: '800', color: Colors.ink },
  sub: { fontSize: 15, color: Colors.muted, marginVertical: 12 },
  missed: { fontSize: 14, color: Colors.ink, marginVertical: 2 },
  opt: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginVertical: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  active: { borderColor: Colors.primary, borderWidth: 2 },
  optTitle: { fontSize: 16, fontWeight: '700', color: Colors.ink },
  optDesc: { fontSize: 13, color: Colors.muted, marginTop: 4 },
});

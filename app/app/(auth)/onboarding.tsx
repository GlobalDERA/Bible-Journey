// ONBOARDING - Phase 1
// Step 1: What do you want? Step 2: How fast? Step 3: When? Then Generate.
// Beginner flow from PRD Section 25.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';
import { useJourneyStore } from '../../store/journeyStore';
import { useAuthStore } from '../../store/authStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('whole');
  const [days, setDays] = useState(365);
  const [time, setTime] = useState('morning');

  const { createLocalPlan, saveToSupabase } = useJourneyStore();
  const { userId } = useAuthStore();

  const handleFinish = async () => {
    createLocalPlan(days, goal);
    if (userId) {
      await saveToSupabase(userId);
    }
    router.push('/(tabs)' as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step {step} of 3</Text>

      {step === 1 && (
        <>
          <Text style={styles.q}>What do you want to accomplish?</Text>
          {[
            { id: 'whole', label: 'Read the entire Bible' },
            { id: 'nt', label: 'Read the New Testament' },
            { id: 'ot', label: 'Read the Old Testament' },
          ].map((o) => (
            <TouchableOpacity key={o.id} onPress={() => setGoal(o.id)} style={[styles.opt, goal === o.id && styles.active]}>
              <Text style={styles.optText}>{o.label} {goal === o.id ? '✓' : ''}</Text>
            </TouchableOpacity>
          ))}
          <PrimaryButton title="Next" onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.q}>How quickly?</Text>
          {[
            { d: 90, label: '90 days - Fast' },
            { d: 180, label: '180 days - Steady' },
            { d: 365, label: '365 days - Relaxed (Recommended)' },
          ].map((o) => (
            <TouchableOpacity key={o.d} onPress={() => setDays(o.d)} style={[styles.opt, days === o.d && styles.active]}>
              <Text style={styles.optText}>{o.label} {days === o.d ? '✓' : ''}</Text>
            </TouchableOpacity>
          ))}
          <PrimaryButton title="Next" onPress={() => setStep(3)} />
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.q}>When do you want to read?</Text>
          {['morning', 'afternoon', 'evening'].map((t) => (
            <TouchableOpacity key={t} onPress={() => setTime(t)} style={[styles.opt, time === t && styles.active]}>
              <Text style={styles.optText}>{t} {time === t ? '✓' : ''}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.summary}>Plan: {goal} in {days} days, in the {time}. Example Day 1: Genesis 1-3.</Text>
          <PrimaryButton title="Generate My Journey" onPress={handleFinish} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 20, paddingTop: 80 },
  step: { color: Colors.muted, fontSize: 13 },
  q: { fontSize: 24, fontWeight: '800', color: Colors.ink, marginVertical: 16 },
  opt: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginVertical: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  active: { borderColor: Colors.primary, borderWidth: 2 },
  optText: { fontSize: 16, color: Colors.ink },
  summary: { color: Colors.muted, marginVertical: 12, textAlign: 'center' },
});

// JOURNEY TAB - Phase 1
// Beginner: Create 90 / 180 / 365 plan, see list, tap to read.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Card } from '../../components/Card';
import { Colors } from '../../constants/theme';
import { useJourneyStore } from '../../store/journeyStore';
import { useAuthStore } from '../../store/authStore';
import { PLAN_OPTIONS } from '../../lib/planGenerator';

export default function JourneyScreen() {
  const router = useRouter();
  const { days, totalDays, completedDays, currentDay, createLocalPlan, saveToSupabase, setCurrentDay } = useJourneyStore();
  const { userId } = useAuthStore();

  const handleCreate = async (d: number) => {
    createLocalPlan(d, 'whole');
    if (userId) {
      await saveToSupabase(userId);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Journey</Text>
      <Text style={styles.sub}>Choose your pace. You can change later.</Text>

      {PLAN_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.days}
          onPress={() => handleCreate(opt.days)}
          style={[styles.opt, totalDays === opt.days && styles.optActive]}
        >
          <Text style={styles.optLabel}>{opt.label} {totalDays === opt.days ? '✓' : ''}</Text>
          <Text style={styles.optDesc}>{opt.desc}</Text>
        </TouchableOpacity>
      ))}

      <Card title={`${completedDays.length} / ${days.length || totalDays} days done`} subtitle={`You are on Day ${currentDay}`}>
        <Text style={styles.hint}>Tap a day to jump there. Green = done.</Text>
      </Card>

      {days.slice(0, 30).map((d) => {
        const done = completedDays.includes(d.day_number);
        const isCurrent = d.day_number === currentDay;
        return (
          <TouchableOpacity
            key={d.day_number}
            onPress={() => {
              setCurrentDay(d.day_number);
              router.push(`/reader?day=${d.day_number}` as any);
            }}
            style={[styles.dayRow, done && styles.dayDone, isCurrent && styles.dayCurrent]}
          >
            <Text style={styles.dayNum}>Day {d.day_number}</Text>
            <Text style={styles.dayTitle}>
              {done ? '✓ ' : ''}{d.title} • {d.estimated_minutes} min
            </Text>
          </TouchableOpacity>
        );
      })}
      <Text style={styles.hintCenter}>Showing first 30 days. Full list scrolls in DB in Phase 2.</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 50 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.ink },
  sub: { color: Colors.muted, marginBottom: 12 },
  opt: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginVertical: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  optActive: { borderColor: Colors.primary, borderWidth: 2 },
  optLabel: { fontSize: 17, fontWeight: '700', color: Colors.ink },
  optDesc: { fontSize: 13, color: Colors.muted, marginTop: 2 },
  dayRow: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginVertical: 4 },
  dayDone: { backgroundColor: '#E8F5E9' },
  dayCurrent: { borderWidth: 2, borderColor: Colors.gold },
  dayNum: { fontSize: 12, color: Colors.muted, fontWeight: '600' },
  dayTitle: { fontSize: 15, color: Colors.ink, marginTop: 2 },
  hint: { fontSize: 12, color: Colors.muted, marginTop: 6 },
  hintCenter: { textAlign: 'center', color: Colors.muted, fontSize: 12, marginVertical: 12 },
});

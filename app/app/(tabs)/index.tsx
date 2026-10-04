// HOME SCREEN - Phase 1 Real
// Answers: What should I do right now? Shows real Day X from your plan.

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';
import { useJourneyStore } from '../../store/journeyStore';
import { useAuthStore } from '../../store/authStore';
import { getMissedCount } from '../../lib/recovery';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const { days, currentDay, completedDays, totalDays, createLocalPlan, loadFromSupabase, lastCompletedAt, demoMissedDays, setDemoMissedDays } = useJourneyStore();
  const { userId } = useAuthStore();

  useEffect(() => {
    if (days.length === 0) {
      if (userId) {
        loadFromSupabase(userId);
      } else {
        createLocalPlan(365, 'whole');
      }
    }
  }, [userId]);

  const today = days.find((d) => d.day_number === currentDay) || days[0];
  const percent = totalDays > 0 ? Math.round((completedDays.length / totalDays) * 100) : 0;

  // Phase 2: missed days detection (real date OR demo for testing)
  const realMissed = getMissedCount(lastCompletedAt);
  const missedCount = demoMissedDays > 0 ? demoMissedDays : realMissed;
  const showWelcomeBack = missedCount >= 2;

  // Simple progress bar with blocks
  const barFilled = Math.round((percent / 100) * 10);
  const bar = '█'.repeat(barFilled) + '░'.repeat(10 - barFilled);

  if (!today) {
    return (
      <View style={styles.center}>
        <Text>Loading your journey...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>{getGreeting()}</Text>

      {showWelcomeBack && (
        <Card title="Welcome back. You haven't lost your progress." subtitle={`You missed ${missedCount} days. No guilt — pick a kind way back.`}>
          <PrimaryButton title="See Catch-Up Options" onPress={() => router.push('/catchup' as any)} />
        </Card>
      )}

      <Card title="Your Bible Journey" subtitle={`Day ${currentDay} / ${totalDays}  •  ${percent}% complete`}>
        <Text style={styles.bar}>{bar} {percent}%</Text>
        <Text style={styles.reading}>📖 {today.title}</Text>
        <Text style={styles.time}>Estimated time: {today.estimated_minutes} min</Text>
      </Card>

      <PrimaryButton title="Start Reading" onPress={() => router.push(`/reader?day=${today.day_number}` as any)} />

      <PrimaryButton title="Give 💛" onPress={() => router.push('/giving' as any)} />

      <Card title="Daily reminder (free)" subtitle="Gentle nudge, never shame">
        <Text style={styles.demoLink} onPress={async () => {
          const { scheduleLocalReminder } = await import('../../lib/notifications');
          const msg = await scheduleLocalReminder(8, today.title, today.estimated_minutes);
          alert(msg);
        }}>
          🔔 Tap to enable 8am reminder
        </Text>
      </Card>

      <Card title="Your progress" subtitle={`${completedDays.length} reading days  •  ${completedDays.length} days completed`}>
        <Text style={styles.hint}>Phase 2 ready! Test: tap below to simulate missing 5 days.</Text>
        <Text style={styles.demoLink} onPress={() => setDemoMissedDays(5)}>
          👉 Tap here to simulate 5 missed days (for testing)
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.paper },
  greeting: { fontSize: 26, fontWeight: '800', color: Colors.ink, marginVertical: 12 },
  bar: { fontSize: 16, marginTop: 8, color: Colors.primary },
  reading: { fontSize: 18, fontWeight: '700', marginTop: 8, color: Colors.ink },
  time: { fontSize: 14, color: Colors.muted, marginTop: 4 },
  hint: { fontSize: 13, color: Colors.muted, marginTop: 8 },
  demoLink: { fontSize: 14, color: Colors.primary, marginTop: 8, fontWeight: '600' },
});

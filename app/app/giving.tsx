// GIVING SCREEN - Support the ministry
// Preset amounts, one-time/monthly note, opens external page (Apple-safe).

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { Colors } from '../constants/theme';
import { GIVE_AMOUNTS, GIVE_CURRENCY, openGiving, getGivingUrl } from '../lib/giving';

export default function GivingScreen() {
  const [amount, setAmount] = useState(1000);
  const configured = !!getGivingUrl();

  const handleGive = async () => {
    const msg = await openGiving(amount);
    if (msg.startsWith('Giving link not set')) Alert.alert('Setup needed', msg);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Give 💛</Text>
      <Text style={styles.sub}>Your giving keeps Bible Journey free for others. Thank you!</Text>

      <Card title="Choose amount" subtitle="One-time gift via secure browser">
        <View style={styles.grid}>
          {GIVE_AMOUNTS.map((a) => (
            <TouchableOpacity key={a} onPress={() => setAmount(a)} style={[styles.chip, amount === a && styles.chipActive]}>
              <Text style={amount === a ? styles.chipTextActive : styles.chipText}>
                {GIVE_CURRENCY}
                {a.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <PrimaryButton title={`Give ${GIVE_CURRENCY}${amount.toLocaleString()} →`} onPress={handleGive} />

      {!configured && (
        <Text style={styles.warn}>
          Demo mode: add EXPO_PUBLIC_GIVING_URL in app/.env with your Paystack/Flutterwave/Stripe payment link, restart with -c. See guide.
        </Text>
      )}
      <Text style={styles.note}>Giving opens in secure browser. Apple-safe for donations (not App Store purchase).</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.ink },
  sub: { color: Colors.muted, marginVertical: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  chip: { padding: 12, backgroundColor: '#F3F4F6', borderRadius: 10, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { color: Colors.ink, fontWeight: '600' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  warn: { color: Colors.muted, fontStyle: 'italic', textAlign: 'center', marginTop: 12 },
  note: { fontSize: 12, color: Colors.muted, textAlign: 'center', marginTop: 8 },
});

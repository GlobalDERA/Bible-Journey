// AUDIO SCREEN - Phase 6
// Play passage, follow text, speed, bookmark moment.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { Colors } from '../constants/theme';
import { speakPassage, stopAudio, isAudioReady, AUDIO_SPEEDS } from '../lib/audioService';
import { getChapterText } from '../lib/bibleService';
import { useNotesStore } from '../store/notesStore';

export default function AudioScreen() {
  const params = useLocalSearchParams();
  const ref = String(params.ref || 'Genesis 1');
  const [speed, setSpeed] = useState(1);
  const [status, setStatus] = useState('Ready. Tap Play.');
  const [currentVerse, setCurrentVerse] = useState(1);
  const { addBookmark } = useNotesStore();
  const verses = getChapterText(ref);

  const handlePlay = async () => {
    setStatus('Loading...');
    const msg = await speakPassage(ref, speed);
    setStatus(msg);
    if (!isAudioReady()) {
      Alert.alert('Audio setup needed', 'Run: npx expo install expo-speech, then restart. Text shown below still works.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.small}>Listen + Read</Text>
      <Text style={styles.title}>{ref} Audio</Text>
      <Text style={styles.status}>{status}</Text>

      <View style={styles.speedRow}>
        {AUDIO_SPEEDS.map((s) => (
          <TouchableOpacity key={s} onPress={() => setSpeed(s)} style={[styles.speed, speed === s && styles.speedActive]}>
            <Text style={speed === s ? styles.speedTextActive : styles.speedText}>{s}x</Text>
          </TouchableOpacity>
        ))}
      </View>

      <PrimaryButton title="▶ Play" onPress={handlePlay} />
      <PrimaryButton title="⏸ Stop" onPress={() => { stopAudio(); setStatus('Stopped.'); }} />

      <Card title="Follow along" subtitle="Tap a verse to mark where you are">
        {verses.map((v) => (
          <TouchableOpacity key={v.verse} onPress={() => setCurrentVerse(v.verse)}>
            <Text style={[styles.verse, currentVerse === v.verse && styles.current]}>
              {v.verse}. {v.text}
            </Text>
          </TouchableOpacity>
        ))}
      </Card>

      <PrimaryButton
        title="🔖 Bookmark this moment"
        onPress={() => {
          addBookmark(`${ref}:${currentVerse}`);
          Alert.alert('Bookmarked!', `${ref}:${currentVerse} saved.`);
        }}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 60 },
  small: { color: Colors.muted, fontSize: 14 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.ink },
  status: { color: Colors.primary, marginVertical: 8 },
  speedRow: { flexDirection: 'row', marginVertical: 8 },
  speed: { flex: 1, padding: 12, backgroundColor: '#fff', borderRadius: 10, marginRight: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  speedActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  speedText: { color: Colors.ink, fontWeight: '600' },
  speedTextActive: { color: '#fff', fontWeight: '700' },
  verse: { fontFamily: 'Georgia', fontSize: 16, lineHeight: 26, color: Colors.ink, marginVertical: 4 },
  current: { backgroundColor: '#FFF9C4', borderRadius: 6 },
});

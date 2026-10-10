// AUDIO SCREEN - Phase 6
// Play passage, follow text, speed, bookmark moment.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { Colors } from '../constants/theme';
import { speakPassage, speakDay, stopAudio, isAudioReady, AUDIO_SPEEDS } from '../lib/audioService';
import { getChapterText } from '../lib/bibleService';
import { useNotesStore } from '../store/notesStore';

export default function AudioScreen() {
  const params = useLocalSearchParams();
  // Whole day: ?refs=Genesis 1,Genesis 2  |  Single: ?ref=Genesis 1 (old links still work)
  const refsParam = String(params.refs || '');
  const singleRef = String(params.ref || 'Genesis 1');
  const refs = refsParam ? refsParam.split(',').map((s) => s.trim()).filter(Boolean) : [singleRef];
  const isDay = refs.length > 1;
  const title = isDay ? `Day: ${refs[0]} +${refs.length - 1} more` : `${refs[0]} Audio`;
  const [speed, setSpeed] = useState(1);
  const [status, setStatus] = useState('Ready. Tap Play.');
  const [currentVerse, setCurrentVerse] = useState(1);
  const { addBookmark } = useNotesStore();
  const verses = refs.flatMap((r) => getChapterText(r).map((v) => ({ ...v, chapter: r })));

  const handlePlay = async () => {
    setStatus('Loading...');
    const msg = isDay ? await speakDay(refs, speed) : await speakPassage(refs[0], speed);
    setStatus(msg);
    if (!isAudioReady()) {
      Alert.alert('Audio setup needed', 'Run: npx expo install expo-speech, then restart. Text shown below still works.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.small}>{isDay ? `Listen to full day (${refs.length} chapters)` : 'Listen + Read'}</Text>
      <Text style={styles.title}>{title}</Text>
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

      <Card title={isDay ? `Follow along (${refs.length} chapters)` : 'Follow along'} subtitle="Tap a verse to mark where you are">
        {verses.map((v: any) => (
          <TouchableOpacity key={`${v.chapter}-${v.verse}`} onPress={() => setCurrentVerse(v.verse)}>
            <Text style={[styles.verse, currentVerse === v.verse && styles.current]}>
              {isDay ? `${v.chapter}:${v.verse} ` : `${v.verse}. `}{v.text}
            </Text>
          </TouchableOpacity>
        ))}
      </Card>

      <PrimaryButton
        title="🔖 Bookmark this moment"
        onPress={() => {
          addBookmark(`${refs[0]}:${currentVerse}`);
          Alert.alert('Bookmarked!', `${refs[0]}:${currentVerse} saved.`);
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

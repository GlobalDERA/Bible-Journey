// VERSE ITEM - tap any verse: 4 colors, save, note, copy, share.
// Beginner: tap verse -> menu opens under it. Tap color = highlight + save instantly.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert, Platform } from 'react-native';
import { Colors } from '../constants/theme';
import { HIGHLIGHT_COLORS, useNotesStore } from '../store/notesStore';

function copyText(text: string): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Clip = require('expo-clipboard');
    if (Clip?.setStringAsync) {
      Clip.setStringAsync(text);
      return true;
    }
  } catch {}
  try {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && (navigator as any).clipboard) {
      (navigator as any).clipboard.writeText(text);
      return true;
    }
  } catch {}
  return false;
}

export function VerseItem({
  passageRef,
  verse,
  text,
  onNote,
}: {
  passageRef: string;
  verse: number;
  text: string;
  onNote: (ref: string, verse: number, text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { highlights, addHighlight } = useNotesStore();
  const mine = highlights.find((h) => h.passage_ref === passageRef && h.verse === verse);

  const full = `${passageRef}:${verse} - ${text}`;

  const handleShare = async () => {
    try {
      await Share.share({ message: `${full}\n\n— via Bible Journey` });
    } catch {}
  };

  const handleCopy = () => {
    if (copyText(full)) {
      Alert.alert('Copied! 📋', full.slice(0, 100));
    } else {
      Alert.alert('Copy manually', full);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(!open)} activeOpacity={0.7}>
        <Text style={[styles.verse, mine && { backgroundColor: mine.color }]}>
          <Text style={styles.num}>{verse} </Text>
          {text}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.menu}>
          <View style={styles.colors}>
            {HIGHLIGHT_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  addHighlight(passageRef, verse, text, c);
                  setOpen(false);
                }}
                style={[styles.dot, { backgroundColor: c }]}
              />
            ))}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                addHighlight(passageRef, verse, text);
                setOpen(false);
                Alert.alert('Saved ⭐', `${passageRef}:${verse} highlighted.`);
              }}
            >
              <Text>⭐ Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setOpen(false);
                onNote(passageRef, verse, text);
              }}
            >
              <Text>📝 Note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleCopy}>
              <Text>📋 Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleShare}>
              <Text>↗ Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  verse: { fontFamily: 'Georgia', fontSize: 17, lineHeight: 27, color: Colors.ink, marginBottom: 8, borderRadius: 6, padding: 2 },
  num: { color: Colors.gold, fontWeight: '700', fontSize: 13 },
  menu: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 10, marginBottom: 10 },
  colors: { flexDirection: 'row', marginBottom: 8 },
  dot: { width: 32, height: 32, borderRadius: 16, marginRight: 10, borderWidth: 1, borderColor: '#D1D5DB' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#E5E7EB' },
});

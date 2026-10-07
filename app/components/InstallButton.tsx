// INSTALL BUTTON - PWA one-tap install, top-right (web only)
// Always clickable: tries auto-install, else shows steps. Fixed hooks order.

import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, Text, Alert } from 'react-native';
import { Colors } from '../constants/theme';

export function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) setIsIOS(true);
    const handler = (e: any) => {
      e.preventDefault();
      (window as any).deferredPWA = e;
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (Platform.OS !== 'web') return null;

  const handlePress = async () => {
    const prompt = typeof window !== 'undefined' ? (window as any).deferredPWA : null;
    if (prompt) {
      prompt.prompt();
      try {
        await prompt.userChoice;
      } catch {}
      (window as any).deferredPWA = null;
      setCanInstall(false);
      return;
    }
    if (isIOS) {
      Alert.alert('Install on iPhone', 'Tap Share ⎙ → Add to Home Screen → Add. Then open Bible Journey from your home screen!');
    } else {
      Alert.alert(
        'Install Bible Journey',
        canInstall ? 'Tap Install below.' : 'Browser menu ⋮ → Install app / Add to Home screen. Tip: visit twice + add 512 icon for auto-button.'
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 }}
      activeOpacity={0.8}
    >
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>📲 Install</Text>
    </TouchableOpacity>
  );
}

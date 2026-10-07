// INSTALL BUTTON - PWA one-tap install, top-right (web only)
// Always responds: uses window.alert on web (Alert.alert fails silently on web).
// Auto-install appears only when manifest + 192/512 icons exist (see guide).

import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../constants/theme';

function webAlert(title: string, msg: string) {
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(`${title}\n\n${msg}`);
  }
}

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
      webAlert('Install on iPhone', 'Tap Share (box with arrow) → Add to Home Screen → Add.\nThen open Bible Journey from your home screen - works like a real app!');
    } else if (canInstall) {
      webAlert('Install', 'Tap Install in the popup.');
    } else {
      webAlert(
        'Install Bible Journey',
        'Chrome menu ⋮ → Install app / Add to Home screen.\n\nIf no Install option: need logo192.png + logo512.png in app/public/ (see guide - 5 min in Canva), then redeploy. Until then manual Add to Home screen still works and app functions normally online.'
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

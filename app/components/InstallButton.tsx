// INSTALL BUTTON - PWA one-tap install (web only, hidden on phone)
// Beginner: Chrome/Edge fire 'beforeinstallprompt'. We catch it, show button.
// iPhone Safari has no prompt - we show "Share -> Add to Home Screen" steps.

import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { Card } from './Card';
import { Text } from 'react-native';

export function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  if (Platform.OS !== 'web') return null;

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

  const handleInstall = async () => {
    const prompt = (window as any).deferredPWA;
    if (prompt) {
      prompt.prompt();
      await prompt.userChoice.catch(() => {});
      (window as any).deferredPWA = null;
      setCanInstall(false);
    }
  };

  return (
    <Card title="📲 Install Bible Journey" subtitle="One tap, works offline, no App Store needed">
      {canInstall ? (
        <PrimaryButton title="Install App ⬇️" onPress={handleInstall} />
      ) : isIOS ? (
        <Text style={{ color: '#6B7280', marginTop: 8 }}>iPhone: tap Share ⎙ → Add to Home Screen → Add. Then open from home like real app!</Text>
      ) : (
        <Text style={{ color: '#6B7280', marginTop: 8 }}>
          Android/Chrome: tap browser menu ⋮ → Install app / Add to Home screen. (Button appears here automatically when browser is ready — visit twice if needed.)
        </Text>
      )}
    </Card>
  );
}

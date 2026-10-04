// NOTIFICATIONS - Step 6 Public Free (real local reminders, $0)
// Gentle only: "Your next reading is ready" never "You missed!"
// Works with expo-notifications (free). No OneSignal/server needed for MVP.
// Web falls back to banner (browsers block push without server).

import { Platform } from 'react-native';

let Notifications: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require('expo-notifications');
} catch {
  Notifications = null; // run: npx expo install expo-notifications
}

export function getDailyMessage(dayTitle: string, minutes: number): string {
  return `📖 Your next reading is ready\n${dayTitle} · ~${minutes} minutes`;
}

export function getWelcomeBackMessage(): string {
  return 'Welcome back. Your journey is still here.';
}

export async function scheduleLocalReminder(hour: number = 8, dayTitle: string = 'Genesis 1-3', minutes: number = 15): Promise<string> {
  if (Platform.OS === 'web') {
    return 'Web: Home banner covers reminders. Phone gets real notification.';
  }
  if (!Notifications) {
    return 'Notifications not installed yet. Run: npx expo install expo-notifications, restart with -c.';
  }
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return 'Permission blocked. Allow in phone Settings -> Expo Go -> Notifications, then try again.';
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: '📖 Your next reading is ready', body: `${dayTitle} · ~${minutes} minutes` },
      trigger: { type: 'daily', hour, minute: 0 } as any,
    });
    console.log(`[Reminder] daily at ${hour}:00 set`);
    return `✅ Daily reminder set for ${hour}:00 — gentle, no shame.`;
  } catch (e) {
    return `Reminder error: ${String(e).slice(0, 120)}`;
  }
}

export async function sendWelcomeBackNow(): Promise<void> {
  if (!Notifications || Platform.OS === 'web') return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Welcome back', body: getWelcomeBackMessage() },
      trigger: null, // now
    });
  } catch {}
}

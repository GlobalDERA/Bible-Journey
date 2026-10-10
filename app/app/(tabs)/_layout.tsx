import { Tabs } from 'expo-router';
import { Text } from 'react-native';

// Bottom navigation from your PRD Section 23 with icons:
// 🏠 Home | 📖 Bible | 🗺️ Journey | 🔍 Explore | 👤 Profile

const ICONS: Record<string, string> = {
  index: '🏠',
  bible: '📖',
  journey: '🗺️',
  explore: '🔍',
  profile: '👤',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#2B4C7E',
        tabBarInactiveTintColor: '#6B7280',
        headerStyle: { backgroundColor: '#FFFDF7' },
        tabBarStyle: { backgroundColor: '#FFFFFF' },
        tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>{ICONS[route.name] ?? '•'}</Text>,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bible" options={{ title: 'Bible' }} />
      <Tabs.Screen name="journey" options={{ title: 'Journey' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

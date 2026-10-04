import { Tabs } from 'expo-router';

// Bottom navigation from your PRD Section 23:
// Home | Bible | Journey | Explore | Profile

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2B4C7E',
        tabBarInactiveTintColor: '#6B7280',
        headerStyle: { backgroundColor: '#FFFDF7' },
        tabBarStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bible" options={{ title: 'Bible' }} />
      <Tabs.Screen name="journey" options={{ title: 'Journey' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

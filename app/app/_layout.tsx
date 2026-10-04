import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Root layout - front door. Added React Query for caching Bible text offline in Phase 1.

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFDF7' },
          headerTintColor: '#1A1A1A',
          contentStyle: { backgroundColor: '#FFFDF7' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="reader" options={{ title: 'Reading', presentation: 'card' }} />
        <Stack.Screen name="catchup" options={{ title: 'Catch Me Up', presentation: 'modal' }} />
        <Stack.Screen name="study" options={{ title: 'Study', presentation: 'card' }} />
        <Stack.Screen name="memory" options={{ title: 'Memory', presentation: 'card' }} />
        <Stack.Screen name="search" options={{ title: 'Search', presentation: 'card' }} />
        <Stack.Screen name="explain" options={{ title: 'Explain', presentation: 'modal' }} />
        <Stack.Screen name="audio" options={{ title: 'Audio', presentation: 'card' }} />
        <Stack.Screen name="premium" options={{ title: 'Premium', presentation: 'modal' }} />
        <Stack.Screen name="giving" options={{ title: 'Give', presentation: 'card' }} />
      </Stack>
    </QueryClientProvider>
  );
}

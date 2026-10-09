import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Root layout - front door. Added React Query for caching Bible text offline in Phase 1.

const queryClient = new QueryClient();

// Crash catcher: if JS breaks in production (MIUI "keeps stopping"),
// show the error ON SCREEN instead of silent OS kill. Copy the red text to us!
class CrashCatcher extends React.Component<{ children: React.ReactNode }, { error: Error | null; stack: string }> {
  state = { error: null as Error | null, stack: '' };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log('[Crash]', error.message, (info.componentStack || '').slice(0, 800));
    this.setState({ stack: info.componentStack || '' });
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: '#FFFDF7', padding: 24, paddingTop: 80 }}>
          <Text style={{ fontSize: 22, fontWeight: '800' }}>Something broke — but we caught it!</Text>
          <Text style={{ color: '#6B7280', marginTop: 8 }}>Copy this red text and send it to us:</Text>
          <Text selectable style={{ color: '#D32F2F', marginTop: 12, fontSize: 13 }}>
            {this.state.error.message}
            {'\n\n'}
            {(this.state.stack || this.state.error.stack || '').slice(0, 1200)}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

export default function RootLayout() {
  return (
    <CrashCatcher>
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
    </CrashCatcher>
  );
}

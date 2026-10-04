import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useNotesStore } from '../../store/notesStore';
import { Colors } from '../../constants/theme';

// PROFILE TAB - Phase 4 My Stuff
// Auth on top, then your highlights, notes, bookmarks, search.

export default function ProfileScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userId, email: savedEmail, setUser, signOut } = useAuthStore();
  const { highlights, bookmarks, notes, syncToSupabase } = useNotesStore();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Please enter email and password');
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert('Sign up failed', error.message);
      return;
    }
    setUser(data.user?.id ?? null, email);
    Alert.alert('Welcome to Bible Journey!');
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Login failed', error.message);
      return;
    }
    setUser(data.user?.id ?? null, email);
    if (data.user) syncToSupabase(data.user.id);
  };

  // Step 2 public: password reset (free, required by Apple/Google review)
  const handleReset = async () => {
    if (!email) {
      Alert.alert('Type your email above first, then tap Reset');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      Alert.alert('Reset failed', error.message);
      return;
    }
    Alert.alert('Check email!', 'Password reset link sent. Check spam too.');
  };

  // Step 2 public: delete account (Apple REQUIRES this button if you have login)
  const handleDelete = async () => {
    Alert.alert('Delete account?', 'This erases profile + journeys. Cannot undo.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          // Delete user data rows first (Supabase auth user deleted via dashboard or function)
          if (userId) {
            await supabase.from('profiles').delete().eq('id', userId);
          }
          await supabase.auth.signOut();
          signOut();
          Alert.alert('Deleted', 'Your data rows removed. To fully remove login, tell us in support email.');
        },
      },
    ]);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    signOut();
  };

  if (!userId) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Welcome to Bible Journey</Text>
        <Text style={styles.sub}>Sign up to sync notes. Or keep reading offline.</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <PrimaryButton title="Sign Up" onPress={handleSignUp} />
        <PrimaryButton title="Log In" onPress={handleSignIn} />
        <Text style={styles.link} onPress={handleReset}>Forgot password? Reset →</Text>
        <Card title={`Your device memory`} subtitle={`${highlights.length} highlights • ${notes.length} notes • ${bookmarks.length} bookmarks`}>
          <Text style={styles.link} onPress={() => router.push('/search' as any)}>Search your Bible →</Text>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.sub}>Logged in as {savedEmail}</Text>

      <Card title="My Bible Memory" subtitle={`${highlights.length} highlights • ${notes.length} notes • ${bookmarks.length} bookmarks`}>
        <Text style={styles.link} onPress={() => router.push('/search' as any)}>🔍 Search all →</Text>
        {bookmarks.slice(0, 3).map((b) => (
          <Text key={b.id} style={styles.item} onPress={() => router.push(`/memory?ref=${encodeURIComponent(b.passage_ref)}` as any)}>
            ❤️ {b.passage_ref} → memory
          </Text>
        ))}
      </Card>

      <Card title="Recent notes">
        {notes.slice(-3).reverse().map((n) => (
          <Text key={n.id} style={styles.item}>
            📝 {n.passage_ref}: {n.content.slice(0, 60)}
          </Text>
        ))}
        {notes.length === 0 && <Text style={styles.sub}>No notes yet. Read Genesis 1 and add one!</Text>}
      </Card>

      <PrimaryButton title="Sign Out" onPress={handleSignOut} />
      <Text style={[styles.link, { color: '#D32F2F', textAlign: 'center', marginTop: 16 }]} onPress={handleDelete}>
        Delete my account
      </Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: Colors.paper, padding: 20, justifyContent: 'center' },
  scroll: { flex: 1, backgroundColor: Colors.paper, padding: 16, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.ink },
  sub: { color: Colors.muted, marginTop: 8, marginBottom: 12 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginVertical: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  link: { color: Colors.primary, fontWeight: '600', marginTop: 8 },
  item: { fontSize: 14, color: Colors.ink, marginVertical: 4 },
});

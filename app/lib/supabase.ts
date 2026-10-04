import { createClient } from '@supabase/supabase-js';

// Simple explanation:
// This file is the telephone line between your app and your database.
// App talks -> Supabase listens.

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'paste-your-anon-key-here';

if (supabaseUrl.includes('your-project')) {
  console.log('Reminder: Add your real Supabase URL in app/.env file. See README.md');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

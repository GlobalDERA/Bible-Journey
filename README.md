# Bible Journey - Phase 0 Foundation

Hello! Welcome, beginner friend.

This is your empty house frame. It is ready for Phase 1.

## What is in this folder? (super simple)

```
Default Project/
  app/        = Your phone app (Expo React Native)
  web/        = Your website landing page (Next.js)
  supabase/   = Your database rules (login, save progress)
  docs/       = Guides in plain English
```

## How to start? (do this in order)

### 1. Install tools (one time only)
1. Install Node.js LTS from https://nodejs.org
2. Install Expo Go app on your phone (iPhone App Store / Android Play Store)

### 2. Run the phone app
```
cd app
npm install
npx expo start
```
Then scan the QR code with Expo Go.

You should see 5 tabs: Home, Bible, Journey, Explore, Profile.
They are empty on purpose for Phase 0.

### 3. Run the database
1. Create free account at https://supabase.com
2. Create new project called `bible-journey`
3. Go to SQL Editor -> paste file `supabase/schema.sql` -> Run
4. Go to Authentication -> turn ON Email + Apple + Google

### 4. Connect app to database
1. In Supabase, copy your Project URL + anon key
2. In `app/` create file `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=paste_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=paste_here
```

That's it! Phase 0 is done when you can Sign Up and see empty tabs.

Next: Phase 1 will add real Bible reading.

See `docs/PHASE_0_GUIDE.md` for pictures in words.

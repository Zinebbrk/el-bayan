# El-Bayan Supabase Setup Guide

This guide will help you set up Supabase for the El-Bayan Arabic Grammar Learning Platform.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in the project details:
   - **Project Name**: El-Bayan
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the ⚙️ **Settings** icon in the sidebar
2. Go to **API** section
3. You'll need two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (a long JWT token)

## Step 3: Create Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following variables:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase credentials.

## Step 4: Run Database Migrations

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `/supabase/migrations/001_initial_schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the migration
5. You should see a success message

This will create all the necessary tables:
- `user_profiles`
- `lessons`
- `user_lesson_progress`
- `assessments`
- `assessment_sessions`
- `chatbot_conversations`
- `game_sessions`
- `user_mistakes`
- `badges`
- `user_badges`

## Step 5: Seed Initial Data

1. In the SQL Editor, copy the contents of `/supabase/seeds/001_seed_data.sql`
2. Paste and run it
3. This will populate your database with:
   - Sample lessons (beginner, intermediate, advanced)
   - Assessment templates
   - Badge definitions

## Step 6: Verify Row Level Security (RLS)

The migration automatically enables Row Level Security policies. You can verify this:

1. Go to **Authentication** > **Policies** in your Supabase dashboard
2. You should see policies for each table
3. These policies ensure users can only access their own data

## Step 7: Enable Email Authentication

1. Go to **Authentication** > **Providers** in Supabase
2. Ensure **Email** is enabled (it should be by default)
3. For development, you can disable email confirmation:
   - Go to **Authentication** > **Settings**
   - Disable "Enable email confirmations"
   - This allows instant registration without email verification

## Step 8: Install Dependencies

In your project, install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Step 9: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to register a new user
3. If successful, you should see the user in **Authentication** > **Users** in Supabase

## Database Schema Overview

### Core Tables

**user_profiles**
- Extends Supabase's built-in auth.users
- Stores learning progress, XP, level, streak

**lessons**
- Contains all grammar lessons
- Organized by level (beginner, intermediate, advanced)
- Content stored as JSONB for flexibility

**user_lesson_progress**
- Tracks which lessons users have started/completed
- Progress percentage for each lesson

**assessments**
- Templates for quizzes and tests
- Different difficulty levels

**assessment_sessions**
- Individual assessment attempts by users
- Stores questions, answers, and scores

**chatbot_conversations**
- Stores all AI tutor conversations
- Messages stored as JSONB array

**game_sessions**
- Records of game plays
- Tracks scores and XP earned

**user_mistakes**
- Tracks common errors for adaptive learning
- Used to generate personalized recommendations

**badges & user_badges**
- Achievement system
- Badges are awarded based on criteria (XP, streaks, completions)

## Security Notes

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only read/write their own data
- Public content (lessons, assessments, badges) is readable by all authenticated users
- No user can modify another user's progress or data

### API Keys

- **NEVER** commit your `.env.local` file to version control
- The `anon/public` key is safe to use in frontend code
- **Never** use the `service_role` key in frontend code

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file has the correct values
- Restart your development server after changing env variables

### "Row Level Security policy violation"
- Make sure you're logged in (authenticated)
- Check that the RLS policies were created correctly in the migration

### "relation does not exist" error
- Run the migration SQL again
- Check the SQL Editor for any error messages

### Users can't register
- Check Authentication > Settings to ensure email provider is enabled
- For testing, disable email confirmation requirement

## Next Steps

After setup:
1. ✅ Register a test user
2. ✅ Check that the user profile is created in `user_profiles` table
3. ✅ Try viewing lessons
4. ✅ Test the chatbot
5. ✅ Complete a lesson and verify progress is saved
6. ✅ Take an assessment
7. ✅ Play a game and earn XP

## Useful Supabase Features

### Real-time Subscriptions (Optional)
You can add real-time features later:
```typescript
supabase
  .channel('user-progress')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'user_lesson_progress' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

### Storage (For Future Use)
If you want to add user avatars or media:
1. Go to **Storage** in Supabase
2. Create a bucket (e.g., "avatars")
3. Set up policies for access control

## Support

For issues:
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

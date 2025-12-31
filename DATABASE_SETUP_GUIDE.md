# Step-by-Step Database Setup Guide

## Prerequisites
- A web browser
- An email address (for Supabase account)

---

## Step 1: Create Supabase Account & Project

### 1.1 Sign Up for Supabase
1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with:
   - GitHub account (recommended), OR
   - Email address
4. Verify your email if required

### 1.2 Create a New Project
1. Once logged in, click **"New Project"** button
2. Fill in the project details:
   - **Name**: `el-bayan` (or any name you prefer)
   - **Database Password**: 
     - Create a STRONG password (save this somewhere safe!)
     - Must be at least 8 characters
     - Example: `MySecurePass123!@#`
   - **Region**: Choose the closest region to you
     - Examples: `US East`, `Europe West`, `Asia Pacific`
3. Click **"Create new project"**
4. ⏳ **Wait 2-3 minutes** for the project to initialize
   - You'll see a loading screen
   - Don't close the browser!

---

## Step 2: Get Your API Credentials

### 2.1 Navigate to API Settings
1. In your Supabase dashboard, look at the left sidebar
2. Click on **⚙️ Settings** (gear icon at the bottom)
3. Click on **"API"** in the settings menu

### 2.2 Copy Your Credentials
You'll see two important values:

1. **Project URL**
   - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - Click the copy icon next to it
   - Save it somewhere (we'll use it in Step 4)

2. **anon public key**
   - A long JWT token starting with `eyJhbGci...`
   - Click the copy icon next to it
   - Save it somewhere (we'll use it in Step 4)

**📝 Note:** Keep these credentials safe! You'll need them to connect your app.

---

## Step 3: Run Database Migrations

### 3.1 Open SQL Editor
1. In Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button
### 3.2 Run the Initial Schema Migration
1. Open the file: `src/supabase/migrations/001_initial_schema.sql`
2. **Copy ALL the contents** of this file (Ctrl+A, Ctrl+C / Cmd+A, Cmd+C)
3. Paste it into the SQL Editor in Supabase
4. Click **"Run"** button (or press Ctrl+Enter)
5. ✅ You should see: **"Success. No rows returned"**

**What this does:**
- Creates all database tables
- Sets up Row Level Security (RLS)
- Creates indexes for performance
- Sets up triggers for automatic timestamps

### 3.3 Run the Seed Data Migration
1. Open the file: `src/supabase/migrations/002_seed_data.sql`
2. **Copy ALL the contents** of this file
3. Paste into SQL Editor (you can clear the previous query or create a new one)
4. Click **"Run"**
5. ✅ You should see: **"Success. No rows returned"**

**What this does:**
- Inserts sample lessons (beginner, intermediate, advanced)
- Creates badge definitions
- Adds assessment templates

---

## Step 4: Configure Your App

### 4.1 Create Environment File
1. In your project root, create a file named `.env.local`
2. Add the following content:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace the placeholders:
   - `your_project_url_here` → Your Project URL from Step 2.2
   - `your_anon_key_here` → Your anon key from Step 2.2

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.2 Verify File Location
Make sure `.env.local` is in the root directory:
```
Arabic Grammar Learning Platform-2/
├── .env.local          ← Should be here
├── package.json
├── src/
└── ...
```

---

## Step 5: Enable Email Authentication

### 5.1 Configure Authentication
1. In Supabase dashboard, click **"Authentication"** in left sidebar
2. Click **"Providers"** tab
3. Make sure **"Email"** is enabled (should be by default)
   - If not, toggle it ON

### 5.2 Disable Email Confirmation (For Testing)
1. Still in Authentication, click **"Settings"** tab
2. Scroll to **"Email Auth"** section
3. **Disable** "Enable email confirmations" (toggle OFF)
   - This allows instant registration without email verification
   - ⚠️ Only for development/testing!

---

## Step 6: Test Database Connection

### 6.1 Restart Development Server
1. Stop your current dev server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### 6.2 Test in Browser
1. Open `http://localhost:3000`
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. You should **NOT** see Supabase connection warnings anymore

### 6.3 Test Registration
1. Click **"Sign In"** button on landing page
2. Click **"Register"** tab
3. Fill in:
   - **Name**: Test User
   - **Email**: test@example.com (use a real email format)
   - **Password**: test123456 (at least 6 characters)
4. Click **"Create Account"**
5. ✅ You should be redirected to Dashboard!

### 6.4 Verify in Supabase
1. Go back to Supabase dashboard
2. Click **"Authentication"** > **"Users"**
3. You should see your test user listed!
4. Click **"Table Editor"** in left sidebar
5. Click **"user_profiles"** table
6. You should see a profile record for your user!

---

## Step 7: Test Database Tables

### 7.1 Check Tables in Supabase
1. In Supabase dashboard, click **"Table Editor"**
2. You should see these tables:
   - ✅ `user_profiles`
   - ✅ `lessons`
   - ✅ `user_lesson_progress`
   - ✅ `assessments`
   - ✅ `assessment_sessions`
   - ✅ `chatbot_conversations`
   - ✅ `game_sessions`
   - ✅ `user_mistakes`
   - ✅ `badges`
   - ✅ `user_badges`

### 7.2 View Sample Data
1. Click on **"lessons"** table
2. You should see sample lessons (beginner, intermediate, advanced)
3. Click on **"badges"** table
4. You should see badge definitions

### 7.3 Test Data Insertion
1. In your app, try to:
   - Complete a lesson (should create record in `user_lesson_progress`)
   - Send a chat message (should create record in `chatbot_conversations`)
   - Play a game (should create record in `game_sessions`)

2. Check in Supabase Table Editor:
   - Go to respective tables
   - Refresh the view
   - You should see new records!

---

## Step 8: Verify Row Level Security (RLS)

### 8.1 Check RLS Policies
1. In Supabase dashboard, click **"Authentication"** > **"Policies"**
2. You should see policies for each table
3. Each table should have:
   - SELECT policy (users can view their own data)
   - INSERT policy (users can create their own data)
   - UPDATE policy (users can update their own data)

### 8.2 Test RLS
1. Create a second test user in your app
2. Try to access data from the first user
3. You should **NOT** be able to see other users' data
4. This confirms RLS is working correctly!

---

## Troubleshooting

### Issue: "Invalid API key" error
**Solution:**
- Double-check `.env.local` file has correct values
- Make sure there are no extra spaces or quotes
- Restart dev server after changing `.env.local`

### Issue: "relation does not exist" error
**Solution:**
- Make sure you ran both migration files
- Check SQL Editor for any error messages
- Try running migrations again

### Issue: Can't register user
**Solution:**
- Check Authentication > Settings > Email provider is enabled
- Verify email confirmation is disabled (for testing)
- Check browser console for specific errors

### Issue: User created but no profile
**Solution:**
- Check `user_profiles` table in Table Editor
- Look for any error messages in browser console
- The profile should be created automatically on signup

### Issue: Can't see data in tables
**Solution:**
- Make sure you're logged in to the app
- Check RLS policies are set correctly
- Verify you're looking at the right table

---

## Success Checklist

After completing all steps, you should have:

- [x] Supabase project created
- [x] API credentials saved
- [x] Database migrations run successfully
- [x] `.env.local` file configured
- [x] Email authentication enabled
- [x] Can register new users
- [x] User appears in Supabase dashboard
- [x] User profile created automatically
- [x] Can see sample lessons and badges
- [x] Can create data (lessons, chats, games)
- [x] RLS policies working correctly

---

## Next Steps

Once database is working:

1. ✅ Test all features:
   - Lessons (progress tracking)
   - Chatbot (conversation saving)
   - Assessments (score tracking)
   - Games (XP and badges)
   - Profile (stats and achievements)

2. 📊 Monitor in Supabase:
   - Check Table Editor regularly
   - View user activity
   - Monitor database size

3. 🔒 Security:
   - Re-enable email confirmation for production
   - Review RLS policies
   - Set up database backups

---

## Quick Reference

**Supabase Dashboard:** https://supabase.com/dashboard

**Your Project URL:** Found in Settings > API

**SQL Editor:** Left sidebar > SQL Editor

**Table Editor:** Left sidebar > Table Editor

**Authentication:** Left sidebar > Authentication

---

Need help? Check:
- `src/SUPABASE_SETUP.md` - Detailed Supabase setup
- `TROUBLESHOOTING.md` - Common issues and solutions
- Supabase Docs: https://supabase.com/docs


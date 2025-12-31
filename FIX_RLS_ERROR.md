# Fix: RLS Policy Violation Error

## Problem
You're getting this error:
```
new row violates row-level security policy for table "user_profiles"
```

This happens because when a user signs up, the profile creation happens before the session is fully established, so the RLS policy blocks it.

## Solution: Use Database Trigger

We'll create a database trigger that automatically creates the profile when a user signs up. This is more secure and reliable.

---

## Step 1: Run the Fix Migration

1. Go to your **Supabase Dashboard**
2. Click **"SQL Editor"** (left sidebar)
3. Click **"New query"**
4. Open the file: `src/supabase/migrations/003_fix_profile_creation.sql`
5. **Copy ALL the contents** of this file
6. **Paste** it into the SQL Editor
7. Click **"Run"** (or press Ctrl+Enter)
8. ✅ You should see: **"Success. No rows returned"**

---

## Step 2: Update AuthContext (Optional but Recommended)

The trigger will automatically create profiles, so we can remove the manual profile creation from the code. However, the current code will still work - it will just try to create a profile that might already exist (which is fine).

If you want to clean it up:

1. Open: `src/contexts/AuthContext.tsx`
2. In the `signUp` function, you can remove or comment out the profile creation code (lines 55-72)
3. The trigger will handle it automatically

**OR** keep it as is - it won't hurt, the trigger will create it first.

---

## Step 3: Test Again

1. Go to your app: `http://localhost:3000`
2. Click **"Sign In"**
3. Click **"Register"** tab
4. Create a new test account
5. ✅ Should work without errors now!

---

## What the Fix Does

The trigger:
- Automatically creates a user profile when a new user signs up
- Runs at the database level (more secure)
- Happens immediately after user creation
- Uses `SECURITY DEFINER` to bypass RLS for this specific operation

---

## Alternative: Fix RLS Policy (If trigger doesn't work)

If the trigger approach doesn't work, we can modify the RLS policy. But try the trigger first - it's the better solution.

---

## Verify It Works

After running the migration:

1. **Check the trigger exists:**
   - In Supabase, go to **Database** > **Triggers**
   - You should see `on_auth_user_created` trigger

2. **Test registration:**
   - Register a new user
   - Check **Table Editor** > **user_profiles**
   - You should see the new profile automatically created

---

## Still Getting Errors?

1. Make sure you ran the migration (Step 1)
2. Check browser console for other errors
3. Verify your `.env.local` has correct Supabase credentials
4. Try clearing browser cache and cookies
5. Check Supabase logs: **Logs** > **Postgres Logs**


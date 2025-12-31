# ⚠️ IMPORTANT: Fix RLS Error - Run This First!

## The Problem
You're getting an error when registering users because the profile creation is blocked by Row Level Security (RLS).

## The Solution
Run the database trigger migration. This will automatically create profiles when users sign up.

---

## ✅ STEP 1: Run the Trigger Migration (REQUIRED)

**You MUST do this in Supabase:**

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"**

3. **Copy and Run the Migration**
   - Open file: `src/supabase/migrations/003_fix_profile_creation.sql`
   - **Copy ALL contents** (Ctrl+A, Ctrl+C)
   - **Paste** into SQL Editor
   - Click **"Run"** button (or Ctrl+Enter)
   - ✅ Should see: **"Success. No rows returned"**

4. **Verify Trigger Was Created**
   - In Supabase, go to **Database** → **Triggers**
   - You should see: `on_auth_user_created` trigger

---

## ✅ STEP 2: Restart Your Dev Server

After running the migration:

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## ✅ STEP 3: Test Registration

1. Go to `http://localhost:3000`
2. Click **"Sign In"** → **"Register"**
3. Create a test account
4. ✅ Should work without errors!

---

## What Changed in the Code

I've updated `AuthContext.tsx` to:
- **Remove manual profile creation** (it was causing RLS errors)
- **Rely entirely on the database trigger** (more secure)

The trigger automatically creates the profile when a user signs up, so we don't need to do it manually in the code.

---

## If You Still Get Errors

### Error: "function does not exist"
- Make sure you ran the migration (Step 1)
- Check SQL Editor for any error messages

### Error: "permission denied"
- The trigger should have SECURITY DEFINER which bypasses RLS
- Try running the migration again

### Error: "trigger already exists"
- That's fine! The migration uses `DROP TRIGGER IF EXISTS`
- It will replace the old trigger

### Profile not created
- Check if trigger exists: Database → Triggers
- Check Table Editor → user_profiles to see if profile was created
- Wait a few seconds - trigger might take a moment

---

## How to Verify It's Working

1. **Check Trigger Exists:**
   - Supabase → Database → Triggers
   - Should see `on_auth_user_created`

2. **Test Registration:**
   - Register a new user
   - Check Table Editor → `user_profiles`
   - Profile should appear automatically

3. **Check Browser Console:**
   - Should NOT see "Error creating profile" anymore
   - Registration should complete successfully

---

## Summary

**Before:** Code tried to create profile → RLS blocked it → Error ❌

**After:** Database trigger creates profile automatically → No RLS issue → Works! ✅

**Action Required:** Run the migration in Supabase SQL Editor!


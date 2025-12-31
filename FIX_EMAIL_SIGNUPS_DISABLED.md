# Fix: "Email signups are disabled" Error

## The Problem
```
AuthApiError: Email signups are disabled
```

This means the Email authentication provider is turned OFF in your Supabase project.

---

## ✅ Quick Fix: Enable Email Authentication

### Step 1: Go to Supabase Dashboard
1. Go to **https://supabase.com/dashboard**
2. Select your project

### Step 2: Enable Email Provider
1. Click **"Authentication"** in the left sidebar
2. Click **"Providers"** tab
3. Find **"Email"** in the list
4. **Toggle it ON** (should turn green/blue)
5. **Save** (if there's a save button)

### Step 3: Configure Email Settings (Optional but Recommended)
1. Still in **Authentication** → **Settings**
2. Scroll to **"Email Auth"** section
3. **Disable** "Enable email confirmations" (for testing)
   - This allows instant registration without email verification
4. **Save**

### Step 4: Test Again
1. Go back to your app
2. Try registering again
3. ✅ Should work now!

---

## Visual Guide

```
Supabase Dashboard
├── Authentication (left sidebar)
│   ├── Providers tab ← Click here
│   │   ├── Email [Toggle ON] ← Enable this!
│   │   ├── Google (optional)
│   │   └── ...
│   └── Settings tab
│       └── Email Auth
│           └── Enable email confirmations [Toggle OFF] ← For testing
```

---

## What This Does

- **Enables email/password authentication** for your app
- Allows users to register with email and password
- Without this, no one can sign up!

---

## After Enabling

1. **Restart your dev server** (optional but recommended):
   ```bash
   npm run dev
   ```

2. **Try registering** a new user
3. Should work without the "Email signups are disabled" error

---

## Still Getting Errors?

If you enable Email but still get errors:

1. **Check the toggle is actually ON** (green/blue, not gray)
2. **Refresh the Supabase page** and check again
3. **Wait a few seconds** - changes might take a moment to propagate
4. **Check browser console** for new error messages

---

## Alternative: Check All Providers

While you're in Authentication → Providers, you can also enable:
- **Google** (optional, for Google sign-in)
- **GitHub** (optional, for GitHub sign-in)
- **Email** ← **This one is REQUIRED!**

But for now, just enable **Email** and you're good to go!


# Fix: 400 Error on Authentication

## The Error
```
Failed to load resource: the server responded with a status of 400
/auth/v1/token?grant_type=password
```

This means Supabase is rejecting the authentication request.

---

## Common Causes & Solutions

### Cause 1: Invalid API Credentials

**Check your `.env.local` file:**

1. Open `.env.local` in your project root
2. Verify the values are correct:
   ```env
   VITE_SUPABASE_URL=https://lilkimfvownxjakyxuad.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

3. **Common mistakes:**
   - ❌ Extra spaces around `=`
   - ❌ Quotes around values (don't use quotes)
   - ❌ Wrong URL format
   - ❌ Missing `https://`
   - ❌ Using `service_role` key instead of `anon` key

**Correct format:**
```env
VITE_SUPABASE_URL=https://lilkimfvownxjakyxuad.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Incorrect format:**
```env
VITE_SUPABASE_URL="https://lilkimfvownxjakyxuad.supabase.co"  ❌ (quotes)
VITE_SUPABASE_URL = https://lilkimfvownxjakyxuad.supabase.co  ❌ (spaces)
```

---

### Cause 2: Email Confirmation Required

If email confirmation is enabled, you can't sign in until you confirm your email.

**Fix:**
1. Go to **Supabase Dashboard**
2. **Authentication** → **Settings**
3. Scroll to **"Email Auth"**
4. **Disable** "Enable email confirmations" (toggle OFF)
5. Save

---

### Cause 3: Wrong Password or Email Format

**Check:**
- Email must be valid format: `user@example.com`
- Password must be at least 6 characters
- No special characters that might cause issues

---

### Cause 4: Environment Variables Not Loaded

**Fix:**
1. **Stop your dev server** (Ctrl+C)
2. **Restart it:**
   ```bash
   npm run dev
   ```
3. Vite needs to be restarted to pick up `.env.local` changes

---

### Cause 5: Supabase Project Issues

**Check:**
1. Is your Supabase project **active**?
   - Go to dashboard
   - Check if project shows as "Active" or "Paused"
2. Is the project **fully initialized**?
   - Wait a few minutes if just created
3. Check **Project Settings** → **General**
   - Verify project is not paused or deleted

---

## Step-by-Step Fix

### Step 1: Verify .env.local

```bash
# Check file exists and has correct format
cat .env.local
```

Should show:
```
VITE_SUPABASE_URL=https://lilkimfvownxjakyxuad.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

**No quotes, no extra spaces!**

### Step 2: Get Fresh API Keys

1. Go to **Supabase Dashboard**
2. **Settings** → **API**
3. **Copy fresh keys** (they might have changed)
4. **Update `.env.local`** with new values
5. **Save file**

### Step 3: Disable Email Confirmation

1. **Authentication** → **Settings**
2. **Disable** "Enable email confirmations"
3. **Save**

### Step 4: Restart Dev Server

```bash
# Stop server
Ctrl+C

# Start again
npm run dev
```

### Step 5: Clear Browser Data

1. Open browser DevTools (F12)
2. **Application** tab (Chrome) or **Storage** tab (Firefox)
3. **Clear site data** or **Clear storage**
4. **Refresh page**

### Step 6: Test Again

1. Try registering a new user
2. Check browser console for errors
3. Check Network tab for the actual error response

---

## Debug: Check Actual Error

In browser console, the error might have more details:

1. Open **Network** tab in DevTools
2. Try to register/login
3. Click on the failed request (red)
4. Go to **Response** tab
5. **Copy the error message** - it will tell you exactly what's wrong

Common error messages:
- `"Invalid API key"` → Wrong anon key
- `"Email not confirmed"` → Need to disable email confirmation
- `"Invalid login credentials"` → Wrong email/password
- `"Email rate limit exceeded"` → Too many signup attempts

---

## Quick Test

Run this in browser console (on your app page):

```javascript
// Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

If either shows `undefined` or empty, your `.env.local` isn't being loaded.

---

## Still Not Working?

**Please share:**
1. The **exact error message** from Network tab → Response
2. Whether `.env.local` exists and what it contains (hide the actual keys)
3. Whether email confirmation is enabled/disabled
4. Any other console errors


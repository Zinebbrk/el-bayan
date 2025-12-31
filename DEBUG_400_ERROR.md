# Debug 400 Error - Step by Step

## ✅ Your .env.local looks correct!

I can see your Supabase URL and key are set up properly. The 400 error is likely one of these:

---

## 🔍 Step 1: Check the Actual Error Message

**This is the most important step!**

1. Open browser **DevTools** (F12)
2. Go to **Network** tab
3. Try to register/login
4. Find the failed request (red, status 400)
5. Click on it
6. Go to **Response** tab
7. **Copy the error message**

The response will tell you exactly what's wrong:
- `"Invalid API key"` → Key is wrong
- `"Email not confirmed"` → Need to disable email confirmation
- `"Invalid login credentials"` → Wrong email/password
- `"User already registered"` → User exists, try login instead

---

## 🔧 Step 2: Disable Email Confirmation (Most Common Fix)

**This is usually the problem!**

1. Go to **Supabase Dashboard**
2. **Authentication** → **Settings**
3. Scroll to **"Email Auth"** section
4. **Toggle OFF** "Enable email confirmations"
5. **Save**

**Why:** If email confirmation is ON, users can't sign in until they click the confirmation link in their email.

---

## 🔧 Step 3: Restart Dev Server

Even though `.env.local` looks correct, Vite might not have loaded it:

```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🔧 Step 4: Verify in Browser Console

Open browser console and check:

```javascript
// Check if env vars are loaded
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY?.length);
```

Should show:
- URL: `https://lilkimfvownxjakyxuad.supabase.co`
- Has Key: `true`

If either is `undefined` → restart server!

---

## 🔧 Step 5: Check Supabase Project Status

1. Go to **Supabase Dashboard**
2. Check if project shows as **"Active"**
3. If paused or has issues, reactivate it

---

## 🔧 Step 6: Test with Simple Request

In browser console (on your app page):

```javascript
// Test Supabase connection
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'test123456'
});
console.log('Result:', { data, error });
```

This will show the exact error message.

---

## Most Likely Solutions (in order):

1. **Disable email confirmation** (90% of cases)
2. **Restart dev server** (to load .env.local)
3. **Check Network tab Response** for exact error
4. **Verify API keys are correct** in Supabase dashboard

---

## What to Share

If still not working, please share:

1. **Network tab → Response** (the actual error message)
2. **Browser console output** (any errors or logs)
3. **Whether email confirmation is ON or OFF**

This will help me pinpoint the exact issue!


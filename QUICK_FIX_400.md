# Quick Fix for 400 Error

## The Problem
You're getting a 400 error when trying to register/login. This usually means:

1. **Invalid API credentials** in `.env.local`
2. **Email confirmation enabled** (blocks auto-login)
3. **Environment variables not loaded** (need to restart server)

---

## ✅ Fix Step 1: Check .env.local File

1. Open `.env.local` in your project root
2. Make sure it looks EXACTLY like this (no quotes, no spaces):

```env
VITE_SUPABASE_URL=https://lilkimfvownxjakyxuad.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpbGtpbWZ2b3dueGpha3l4dWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MjM5MDIsImV4cCI6MjA1MTIwOTkwMn0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:**
- ❌ NO quotes around values
- ❌ NO spaces around `=`
- ✅ Must start with `https://`
- ✅ Anon key is very long (200+ characters)

---

## ✅ Fix Step 2: Get Fresh API Keys

1. Go to **Supabase Dashboard**
2. Click **Settings** (gear icon) → **API**
3. **Copy fresh values:**
   - Project URL
   - anon public key
4. **Update `.env.local`** with these values
5. **Save the file**

---

## ✅ Fix Step 3: Disable Email Confirmation

**This is often the cause!**

1. In Supabase: **Authentication** → **Settings**
2. Scroll to **"Email Auth"**
3. **Toggle OFF** "Enable email confirmations"
4. **Save**

---

## ✅ Fix Step 4: Restart Dev Server

**Critical:** Vite must be restarted to load `.env.local`

```bash
# Stop server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

---

## ✅ Fix Step 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to register/login
4. Click on the failed request (red, status 400)
5. Go to **Response** tab
6. **Copy the error message** - it tells you exactly what's wrong

Common responses:
- `"Invalid API key"` → Wrong anon key
- `"Email not confirmed"` → Disable email confirmation
- `"Invalid login credentials"` → Wrong email/password

---

## Test Your Setup

In browser console (on your app page), run:

```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

If either is `undefined` or empty → `.env.local` not loaded (restart server!)

---

## Still Getting 400?

**Check the Network tab Response** - it will tell you the exact error!


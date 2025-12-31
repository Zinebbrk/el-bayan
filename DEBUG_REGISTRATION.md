# Debug: Registration Not Working

## What I Just Fixed

1. ✅ Added console logging to track registration flow
2. ✅ Added auto-redirect when user state changes
3. ✅ Added loading state
4. ✅ Better error handling

---

## Step 1: Check Browser Console

1. Open your app: `http://localhost:3000`
2. Open **Browser DevTools** (F12)
3. Go to **Console** tab
4. Try to register a new user
5. **Look for these messages:**
   - `"Signup successful, user: [uuid]"`
   - `"Auth state changed: SIGNED_IN User: [uuid]"`
   - Any error messages in red

**Share what you see in the console!**

---

## Step 2: Check Email Confirmation Setting

If email confirmation is enabled, users won't be automatically signed in after registration.

### Check in Supabase:

1. Go to **Supabase Dashboard**
2. Click **Authentication** (left sidebar)
3. Click **Settings** tab
4. Scroll to **"Email Auth"** section
5. Check **"Enable email confirmations"**

**If it's ON (enabled):**
- Users need to confirm email before they can sign in
- Registration will create the account but won't sign them in
- **Solution:** Disable it for testing (toggle OFF)

**If it's OFF (disabled):**
- Users should be automatically signed in after registration
- If not working, see Step 3

---

## Step 3: Verify User Was Created

1. Go to **Supabase Dashboard**
2. Click **Authentication** → **Users**
3. **Do you see your test user?**
   - ✅ Yes → User was created, but not signed in
   - ❌ No → Registration failed, check console errors

4. Click **Table Editor** → **user_profiles**
5. **Do you see a profile for your user?**
   - ✅ Yes → Profile was created (trigger worked!)
   - ❌ No → Trigger might not be set up

---

## Step 4: Check Auth State

In browser console, run:

```javascript
// Check if user is signed in
localStorage.getItem('sb-' + 'YOUR_PROJECT_REF' + '-auth-token')

// Or check Supabase directly
// (Open console in your app and type:)
supabase.auth.getSession().then(console.log)
```

---

## Common Issues & Solutions

### Issue: User created but not signed in
**Cause:** Email confirmation enabled
**Solution:** 
- Disable email confirmation in Supabase
- OR manually sign in after registration

### Issue: No console messages
**Cause:** JavaScript errors preventing code from running
**Solution:**
- Check browser console for errors
- Check Network tab for failed requests

### Issue: "Auth state changed" but user is null
**Cause:** Session not properly established
**Solution:**
- Check `.env.local` has correct Supabase credentials
- Restart dev server
- Clear browser cache

### Issue: Nothing happens after clicking "Create Account"
**Cause:** Form submission might be blocked
**Solution:**
- Check browser console for errors
- Verify form fields are filled
- Check if button is disabled

---

## Quick Test

1. **Open browser console** (F12)
2. **Register a new user**
3. **Watch the console** - you should see:
   ```
   Signup successful, user: [some-uuid]
   Auth state changed: SIGNED_IN User: [some-uuid]
   ```
4. **Check if page redirects** to dashboard

---

## What Should Happen

**Expected Flow:**
1. User fills registration form
2. Clicks "Create Account"
3. Console shows: "Signup successful"
4. Console shows: "Auth state changed: SIGNED_IN"
5. Page automatically redirects to Dashboard
6. User sees dashboard with their name/stats

**If this doesn't happen, check:**
- Browser console for errors
- Supabase Authentication → Users (user exists?)
- Supabase Authentication → Settings (email confirmation disabled?)

---

## Still Not Working?

**Please share:**
1. What you see in browser console (copy/paste)
2. Whether user appears in Supabase → Authentication → Users
3. Whether email confirmation is enabled or disabled
4. Any error messages (red text in console)


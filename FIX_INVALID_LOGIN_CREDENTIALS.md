# Fix: "Invalid login credentials" Error

## The Problem
```
AuthApiError: Invalid login credentials
```

This error can mean several things:

---

## 🔍 Common Causes

### 1. Email Confirmation Required (Most Common)
**If email confirmation is ENABLED:**
- User account exists ✅
- But email is not confirmed ❌
- User cannot sign in until they confirm email

**Solution:**
- **Option A**: Disable email confirmation in Supabase
- **Option B**: Check your email and click the confirmation link

### 2. Wrong Email or Password
- Typo in email address
- Wrong password
- Password changed

**Solution:**
- Double-check email and password
- Try resetting password if needed

### 3. User Account Doesn't Exist
- Registration didn't complete
- User was deleted

**Solution:**
- Register again
- Check Supabase → Authentication → Users

---

## ✅ Quick Fix: Disable Email Confirmation

### Steps:
1. Go to **Supabase Dashboard**
2. Click **Authentication** → **Settings**
3. Scroll to **"Email Auth"** section
4. **Toggle OFF** "Enable email confirmations"
5. **Save**

### After Disabling:
1. **Try signing in again**
2. Should work immediately!

---

## ✅ Alternative: Confirm Your Email

If you want to keep email confirmation enabled:

1. **Check your email inbox** (and spam folder)
2. **Look for email from Supabase** with subject like "Confirm your signup"
3. **Click the confirmation link**
4. **Then try signing in again**

---

## 🔍 Debug Steps

### Step 1: Verify User Exists
1. Go to **Supabase Dashboard**
2. Click **Authentication** → **Users**
3. **Do you see your email?**
   - ✅ Yes → User exists, likely email confirmation issue
   - ❌ No → User wasn't created, try registering again

### Step 2: Check Email Confirmation Status
In Supabase → Authentication → Users:
- Click on your user
- Check **"Email Confirmed"** status
- **False** = You need to confirm email
- **True** = Email is confirmed, issue might be password

### Step 3: Check Email Confirmation Setting
1. **Authentication** → **Settings**
2. Check **"Enable email confirmations"**
3. **ON** = Must confirm email before signing in
4. **OFF** = Can sign in immediately

---

## 🧪 Test After Fix

1. **Disable email confirmation** (if you want instant sign-in)
2. **Try signing in** with your registered email/password
3. **Check console** - should see:
   ```
   Attempting login...
   Sign-in successful, user: [uuid]
   Login successful!
   Auth state changed: SIGNED_IN User: [uuid]
   ```
4. **Dashboard should appear**

---

## 💡 Recommended Solution

**For testing/development:**
- **Disable email confirmation** in Supabase
- This allows instant sign-in after registration
- No need to check emails during development

**For production:**
- **Enable email confirmation** for security
- Users must confirm email before signing in
- Better security practice

---

## 🔧 What I Just Fixed

1. ✅ **Better error messages** - Now shows if email confirmation is the issue
2. ✅ **More logging** - See exactly what's happening during sign-in
3. ✅ **User existence check** - Detects if user exists but email isn't confirmed

---

## Next Steps

1. **Check Supabase** → Authentication → Settings → Email confirmations
2. **Disable it** if you want instant sign-in
3. **Try signing in again**
4. **Check console** for detailed error messages

---

## Still Not Working?

**Please share:**
1. **Is email confirmation ON or OFF?** (Supabase → Authentication → Settings)
2. **Does user exist?** (Supabase → Authentication → Users)
3. **Is email confirmed?** (Check user details in Supabase)
4. **Console error message** (exact text)

This will help pinpoint the exact issue!


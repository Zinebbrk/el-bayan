# Quick Database Setup Checklist

Follow these steps in order:

## ✅ Step 1: Create Supabase Account (5 minutes)

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub or Email
4. Verify email if needed

## ✅ Step 2: Create Project (3 minutes)

1. Click **"New Project"**
2. Name: `el-bayan`
3. Database Password: **Create a strong password** (save it!)
4. Region: Choose closest to you
5. Click **"Create new project"**
6. ⏳ Wait 2-3 minutes for setup

## ✅ Step 3: Get API Keys (2 minutes)

1. Click **⚙️ Settings** (bottom left)
2. Click **"API"**
3. Copy **Project URL** → Save it
4. Copy **anon public key** → Save it

## ✅ Step 4: Run Database Migrations (5 minutes)

1. Click **"SQL Editor"** (left sidebar)
2. Click **"New query"**

### Migration 1: Schema
1. Open: `src/supabase/migrations/001_initial_schema.sql`
2. Copy ALL content
3. Paste in SQL Editor
4. Click **"Run"**
5. ✅ Should see: "Success. No rows returned"

### Migration 2: Seed Data
1. Open: `src/supabase/migrations/002_seed_data.sql`
2. Copy ALL content
3. Paste in SQL Editor (new query)
4. Click **"Run"**
5. ✅ Should see: "Success. No rows returned"

## ✅ Step 5: Configure App (2 minutes)

1. Create `.env.local` in project root:
```env
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

2. Replace the placeholders with your actual values from Step 3

## ✅ Step 6: Enable Authentication (2 minutes)

1. Click **"Authentication"** (left sidebar)
2. Click **"Providers"** tab
3. Ensure **"Email"** is ON
4. Click **"Settings"** tab
5. **Disable** "Enable email confirmations" (for testing)

## ✅ Step 7: Test Connection (3 minutes)

1. Restart dev server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. Open `http://localhost:3000`
3. Click **"Sign In"**
4. Click **"Register"** tab
5. Create test account:
   - Name: Test User
   - Email: test@example.com
   - Password: test123456
6. Click **"Create Account"**
7. ✅ Should redirect to Dashboard!

## ✅ Step 8: Verify in Supabase (2 minutes)

1. In Supabase dashboard:
   - **Authentication** > **Users** → Should see your user
   - **Table Editor** > **user_profiles** → Should see profile
   - **Table Editor** > **lessons** → Should see sample lessons

## 🎉 Done!

Your database is now set up and working!

---

## Quick Test Commands

**Check if server is running:**
```bash
curl http://localhost:3000
```

**View your .env.local:**
```bash
cat .env.local
```

**Restart server:**
```bash
npm run dev
```

---

## Need Help?

- See `DATABASE_SETUP_GUIDE.md` for detailed instructions
- See `TROUBLESHOOTING.md` for common issues
- Check browser console (F12) for errors


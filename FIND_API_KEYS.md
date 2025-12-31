# How to Find Your Supabase API Keys

## Step-by-Step Guide

### Step 1: Log into Supabase Dashboard
1. Go to **https://supabase.com/dashboard**
2. Make sure you're logged in

### Step 2: Select Your Project
1. You should see a list of your projects
2. Click on your project name (e.g., "el-bayan")
3. Wait for the dashboard to load

### Step 3: Navigate to Settings
Look for the **Settings** icon. It can be in different places:

**Option A: Left Sidebar (Most Common)**
- Look at the **left sidebar** (vertical menu on the left)
- Scroll down to the bottom
- You'll see a **⚙️ Settings** icon (gear icon)
- Click on it

**Option B: Top Navigation**
- Sometimes Settings is in the top navigation bar
- Look for a gear icon or "Settings" text

**Option C: Project Settings**
- Click on your project name/icon in the top left
- Look for "Project Settings" or "Settings"

### Step 4: Go to API Section
Once you're in Settings:
1. You'll see a menu on the left with different sections:
   - General
   - API ← **Click this one!**
   - Database
   - Auth
   - Storage
   - etc.

2. Click on **"API"** in the settings menu

### Step 5: Find Your Credentials
In the API page, you'll see several sections:

#### **Project URL**
- Look for a section labeled **"Project URL"** or **"URL"**
- It looks like: `https://xxxxxxxxxxxxx.supabase.co`
- There should be a **copy icon** (📋) next to it
- Click the copy icon to copy it

#### **Project API keys**
- Look for a section labeled **"Project API keys"** or **"API Keys"**
- You'll see different keys:
  - **anon public** ← **This is the one you need!**
  - **service_role** ← Don't use this one (it's secret)
  
- The **anon public** key is a long string that starts with `eyJhbGci...`
- Click the **copy icon** (📋) or **eye icon** (👁️) to reveal and copy it

### Visual Guide

```
Supabase Dashboard
├── Left Sidebar
│   ├── Table Editor
│   ├── SQL Editor
│   ├── Authentication
│   ├── ...
│   └── ⚙️ Settings  ← Click here
│       ├── General
│       ├── API  ← Click here
│       │   ├── Project URL: https://xxx.supabase.co
│       │   └── anon public: eyJhbGci...
│       ├── Database
│       └── ...
```

---

## Alternative Method: Using URL

If you can't find Settings, try this direct URL:

1. Make sure you're logged into Supabase
2. Replace `YOUR_PROJECT_REF` with your actual project reference
3. Go to: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF/settings/api`

**To find your project reference:**
- Look at your project URL in the browser
- It should be something like: `https://supabase.com/dashboard/project/abcdefghijklmnop`
- The part after `/project/` is your project reference

---

## What the Keys Look Like

### Project URL
```
https://abcdefghijklmnop.supabase.co
```
- Always starts with `https://`
- Ends with `.supabase.co`
- Has a random string in the middle

### Anon Public Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Very long string (usually 200+ characters)
- Starts with `eyJ`
- Contains dots (.) separating different parts
- This is a JWT token

---

## Troubleshooting

### "I don't see Settings"
- Make sure you're logged in
- Make sure you've selected a project
- Try refreshing the page
- Check if you're on the correct Supabase dashboard (not a different page)

### "I see Settings but no API section"
- Make sure you clicked on the Settings icon first
- Then look for "API" in the left menu within Settings
- It might be collapsed - try expanding the Settings menu

### "I see API but no keys"
- Make sure your project has finished initializing
- Wait a few minutes if the project was just created
- Try refreshing the page

### "The keys are hidden/obscured"
- Look for an **eye icon** (👁️) or **"Reveal"** button
- Click it to show the full key
- Some keys might be partially hidden for security

---

## Quick Checklist

- [ ] Logged into Supabase dashboard
- [ ] Selected my project
- [ ] Found Settings (gear icon)
- [ ] Clicked on "API" in Settings menu
- [ ] Found "Project URL" section
- [ ] Found "anon public" key
- [ ] Copied both values

---

## Still Can't Find It?

Try these steps:

1. **Take a screenshot** of your Supabase dashboard and I can help you locate it
2. **Check the browser URL** - it should show your project
3. **Try a different browser** - sometimes UI elements load differently
4. **Check if project is still initializing** - wait a few more minutes

---

## Once You Have the Keys

1. Create `.env.local` file in your project root:
```env
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

2. Replace the placeholders with your actual values
3. Save the file
4. Restart your dev server

---

## Security Note

- ✅ **anon public key** is safe to use in frontend code
- ❌ **service_role key** should NEVER be used in frontend
- ❌ Never commit `.env.local` to git


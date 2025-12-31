# Testing Guide for El-Bayan Arabic Grammar Learning Platform

## Quick Start Testing (Without Supabase)

You can test the UI and frontend functionality without setting up Supabase first. The app will work with mock data.

### Step 1: Install Dependencies

```bash
npm install
```

If you encounter npm log errors, try:
```bash
npm install --cache ./.npm-cache
```

### Step 2: Create Environment File (Optional for UI Testing)

Create a `.env.local` file in the root directory:

```env
# For UI testing without Supabase, you can use placeholder values
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder_key

# The app will show warnings but UI will still work
```

**Note:** The app will show console warnings about Supabase, but the UI will still function for testing purposes.

### Step 3: Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000` (or the next available port).

### Step 4: Test the Application

1. **Landing Page**
   - Open `http://localhost:3000`
   - You should see the beautiful landing page with Quranic verse
   - Click "Sign In" to see the auth modal

2. **Authentication (Mock)**
   - Click "Sign In" button
   - Try the login/register modal
   - Note: Without Supabase, authentication won't persist, but you can see the UI

3. **Dashboard** (if you bypass auth)
   - The dashboard shows progress, stats, and quick access tiles
   - Click on different sections to navigate

4. **All Pages**
   - Navigate through: Lessons, Chatbot, Assessments, Games, Profile, Settings
   - All UI components should render correctly
   - Interactive elements should work (buttons, forms, etc.)

---

## Full Testing (With Supabase)

For complete functionality including authentication and data persistence:

### Step 1: Set Up Supabase

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up or log in
   - Create a new project

2. **Get API Credentials**
   - In your Supabase dashboard, go to **Settings** > **API**
   - Copy your **Project URL** and **anon/public key**

3. **Create `.env.local` File**
   ```env
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

4. **Run Database Migrations**
   - In Supabase dashboard, go to **SQL Editor**
   - Copy contents of `src/supabase/migrations/001_initial_schema.sql`
   - Paste and run it
   - Then run `src/supabase/migrations/002_seed_data.sql` (or `src/supabase/seeds/001_seed_data.sql`)

5. **Configure Authentication**
   - Go to **Authentication** > **Settings**
   - Enable Email provider
   - For testing, disable "Enable email confirmations" (optional)

### Step 2: Install and Run

```bash
npm install
npm run dev
```

### Step 3: Test Complete Flow

1. **Register New User**
   - Click "Sign In" on landing page
   - Go to "Register" tab
   - Create an account
   - You should be redirected to Dashboard

2. **Test Dashboard**
   - View your progress stats
   - Check streak counter
   - See daily tip

3. **Test Lessons**
   - Navigate to Lessons
   - Select a level (Beginner/Intermediate/Advanced)
   - Click on a lesson to view content
   - Progress should be tracked

4. **Test Chatbot**
   - Go to AI Tutor
   - Type questions in Arabic or English
   - Test quick prompts
   - Conversation should be saved

5. **Test Assessments**
   - Go to Assessments
   - Start an assessment
   - Answer questions
   - View results and feedback

6. **Test Games**
   - Go to Games
   - Play a game (e.g., "Build the Sentence")
   - Earn XP
   - Check leaderboard

7. **Test Profile**
   - View your stats
   - Check badges
   - See learning timeline
   - View topic mastery

8. **Test Settings**
   - Change preferences
   - Toggle settings
   - Update profile

---

## Testing Checklist

### UI/UX Testing
- [ ] Landing page loads correctly
- [ ] All navigation links work
- [ ] Responsive design (test on different screen sizes)
- [ ] Fonts load correctly (Amiri, Cairo)
- [ ] Colors and styling match design
- [ ] Animations and transitions work smoothly

### Component Testing
- [ ] Auth modal opens/closes correctly
- [ ] Sidebar navigation works
- [ ] All buttons are clickable
- [ ] Forms validate input
- [ ] Progress bars update
- [ ] Charts/graphs render (if applicable)

### Feature Testing (With Supabase)
- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Lesson progress saves
- [ ] Assessment scores save
- [ ] Chatbot conversations save
- [ ] Game sessions save
- [ ] XP and levels update
- [ ] Badges are awarded
- [ ] Streak tracking works

### Error Handling
- [ ] Invalid login shows error
- [ ] Network errors handled gracefully
- [ ] Missing data shows appropriate messages
- [ ] Console shows helpful warnings (not errors)

---

## Troubleshooting

### Issue: npm install fails
**Solution:** 
```bash
npm cache clean --force
npm install
```

### Issue: Port 3000 already in use
**Solution:** Vite will automatically use the next available port, or specify:
```bash
npm run dev -- --port 3001
```

### Issue: Supabase connection errors
**Solution:** 
- Check `.env.local` file exists and has correct values
- Verify Supabase project is active
- Check browser console for specific error messages

### Issue: Database errors
**Solution:**
- Ensure migrations have been run
- Check RLS policies are set correctly
- Verify user is authenticated

### Issue: Fonts not loading
**Solution:**
- Check internet connection (fonts load from Google Fonts)
- Verify FontLoader component is working

---

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Smooth scrolling
- [ ] No lag when switching pages
- [ ] Images load efficiently

---

## Next Steps After Testing

1. **Fix any bugs found**
2. **Set up production Supabase project**
3. **Configure environment variables for production**
4. **Set up CI/CD pipeline**
5. **Deploy to hosting (Vercel, Netlify, etc.)**

---

## Notes

- The app uses **mock AI service** by default - responses are pattern-based
- For production, integrate real AI (OpenAI/Anthropic)
- All data is stored in Supabase PostgreSQL database
- RLS (Row Level Security) ensures users can only access their own data


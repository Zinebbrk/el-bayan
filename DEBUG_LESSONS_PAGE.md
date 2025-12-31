# Debug: Lessons Page Shows Nothing

## Quick Checks

### 1. Open Browser Console
Press `F12` or `Cmd+Option+I` and check for errors.

### 2. Check Network Tab
- Open DevTools → Network tab
- Refresh the page
- Look for failed requests (red)
- Check if `/lessons` or Supabase requests are failing

### 3. Check Console Logs
Look for these messages:
- "Loading lessons..."
- "Error loading lessons: ..."
- "No lessons available for this level yet."

## Common Issues

### Issue 1: No Lessons in Database

**Symptom:** Page shows "No lessons available for this level yet."

**Solution:** Run the database seed script:
```bash
# In Supabase SQL Editor, run:
# src/supabase/migrations/002_seed_data.sql
```

Or check if lessons exist:
```sql
SELECT COUNT(*) FROM lessons WHERE level = 'beginner';
```

### Issue 2: Loading Forever

**Symptom:** Spinner keeps spinning, never shows lessons

**Possible causes:**
1. **Supabase connection issue**
   - Check `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Check browser console for Supabase errors

2. **RAG service blocking (if enabled)**
   - Check if RAG health check is hanging
   - Should timeout after 2 seconds now

**Solution:**
- Check browser console for errors
- Verify Supabase credentials
- Try disabling RAG temporarily

### Issue 3: Empty Lessons Array

**Symptom:** `lessons.length === 0` in console

**Check:**
```javascript
// In browser console on Lessons page:
// Check what useLessons returns
```

**Solution:**
- Verify database has lessons
- Check if level filter is correct
- Check Supabase RLS policies allow reading lessons

### Issue 4: Component Not Rendering

**Symptom:** Blank page, no loading spinner, no errors

**Check:**
1. Is the component mounting?
   - Add `console.log('Lessons component rendered')` at top of component
   
2. Is there a routing issue?
   - Check if URL is correct
   - Check if user is authenticated (if required)

3. Check React DevTools
   - Install React DevTools extension
   - Check if component is in the tree

## Debug Steps

### Step 1: Check Data Fetching

Add this to browser console on Lessons page:
```javascript
// Check if lessons are being fetched
// The component uses useLessons hook
```

### Step 2: Check State

In React DevTools, check:
- `lessons` state
- `lessonsLoading` state
- `lessonsError` state
- `lessonsWithProgress` state

### Step 3: Check Database

Run in Supabase SQL Editor:
```sql
-- Check if lessons exist
SELECT id, title, level, order_index 
FROM lessons 
WHERE level = 'beginner' 
ORDER BY order_index 
LIMIT 5;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'lessons';
```

### Step 4: Check Network Requests

In browser DevTools → Network:
1. Filter by "Fetch/XHR"
2. Look for requests to Supabase
3. Check response status and body

## Quick Fixes

### Fix 1: Clear Cache and Reload
```bash
# Hard refresh
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

### Fix 2: Check Authentication
If lessons require auth:
- Make sure you're signed in
- Check if `user` is not null in component

### Fix 3: Verify Environment Variables
```bash
# Check .env.local exists and has:
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Fix 4: Check Component Props
Make sure `onNavigate` and `onLogout` are passed correctly from App.tsx

## Expected Behavior

1. **On Load:**
   - Shows "Loading lessons..." spinner
   - Fetches lessons from Supabase
   - Shows lessons list or "No lessons available"

2. **With Lessons:**
   - Shows lesson cards with titles
   - Shows progress indicators
   - Shows stats (completed, in progress, total)

3. **On Error:**
   - Shows red error message
   - Logs error to console

## Still Not Working?

Share:
1. Browser console errors (screenshot)
2. Network tab - failed requests
3. React DevTools - component state
4. Supabase - lessons count query result


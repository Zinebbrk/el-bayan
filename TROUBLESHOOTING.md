# Troubleshooting Guide

## Issue: "Nothing Shows" / Blank Page

### Quick Fixes:

1. **Check Browser Console**
   - Open browser DevTools (F12 or Cmd+Option+I)
   - Go to "Console" tab
   - Look for red error messages
   - Share any errors you see

2. **Hard Refresh Browser**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
   - Safari: `Cmd+Option+R`

3. **Check Server Status**
   ```bash
   # Check if server is running
   curl http://localhost:3000
   
   # Or check the terminal where you ran `npm run dev`
   # You should see: "VITE v6.x.x  ready in xxx ms"
   ```

4. **Restart Server**
   ```bash
   # Stop the server (Ctrl+C in terminal)
   # Then restart:
   npm run dev
   ```

5. **Clear Browser Cache**
   - Clear cached images and files
   - Try incognito/private browsing mode

6. **Check Network Tab**
   - Open DevTools > Network tab
   - Refresh page
   - Look for failed requests (red status codes)
   - Check if `main.tsx` and other files are loading

### Common Issues:

#### Issue: White/Blank Page
**Possible Causes:**
- JavaScript error preventing React from rendering
- Missing environment variables
- Import path errors

**Solution:**
1. Check browser console for errors
2. Verify `.env.local` file exists
3. Restart dev server after creating `.env.local`

#### Issue: "Cannot find module" errors
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Port already in use
**Solution:**
```bash
# Kill process on port 3000
kill $(lsof -ti:3000)

# Or use different port
npm run dev -- --port 3001
```

#### Issue: Supabase warnings (expected)
- Console warnings about Supabase are normal if you haven't set up a real project
- The app will still work for UI testing
- To remove warnings, set up Supabase (see SUPABASE_SETUP.md)

### Debug Steps:

1. **Verify Server is Running**
   ```bash
   # Should return HTML
   curl http://localhost:3000
   ```

2. **Check for TypeScript Errors**
   ```bash
   # Run type check
   npx tsc --noEmit
   ```

3. **Check Browser Console**
   - Open http://localhost:3000
   - Press F12
   - Check Console tab for errors
   - Check Network tab for failed requests

4. **Verify File Structure**
   ```bash
   # Should exist:
   - index.html
   - src/main.tsx
   - src/App.tsx
   - src/index.css
   ```

### Still Not Working?

1. **Check Terminal Output**
   - Look at the terminal where `npm run dev` is running
   - Share any error messages

2. **Try Different Browser**
   - Chrome/Edge
   - Firefox
   - Safari

3. **Check Node Version**
   ```bash
   node --version
   # Should be Node 18+ or 20+
   ```

4. **Verify Dependencies**
   ```bash
   npm list --depth=0
   # Check if all packages installed correctly
   ```

### Expected Behavior:

When working correctly, you should see:
- ✅ Landing page with Arabic text "البيان"
- ✅ Quranic verse section
- ✅ "Explore" button
- ✅ Navigation menu at top
- ✅ Beautiful green/gold color scheme

If you see a blank page, check the browser console for JavaScript errors!


# Preview App in Cursor

## Option 1: Use Cursor's Built-in Terminal Preview

Cursor doesn't have a built-in browser preview, but you can:

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **The server will show the URL** (usually `http://localhost:3000`)

3. **Click the URL in the terminal** - Cursor will open it in your default browser

## Option 2: Use Cursor's Port Forwarding (if available)

Some Cursor versions have port forwarding:
- Look for a "Ports" tab in the bottom panel
- If available, it will show running ports
- Click to open in browser

## Option 3: Manual Browser Access

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Note the URL** shown (e.g., `http://localhost:3000`)

3. **Open browser manually** and go to that URL

## Option 4: Use Cursor's Command Palette

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
2. Type "Simple Browser" or "Preview"
3. If available, select to open a simple browser in Cursor

## Current Configuration

The server is configured to:
- Run on port 3000
- NOT auto-open browser (so you have control)
- Allow external connections

## Quick Access

Once the server is running, you can:
- **Bookmark** `http://localhost:3000` in your browser
- **Keep terminal open** to see the URL
- **Use browser's address bar** to navigate

## Note

Cursor is primarily a code editor, not a browser. For the best experience:
- Use your regular browser (Chrome, Firefox, Safari)
- The dev server provides hot-reload
- Changes will reflect immediately in the browser


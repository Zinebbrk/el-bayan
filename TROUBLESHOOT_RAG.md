# Troubleshoot: RAG Server Not Responding

## Current Issue
Server process is running but not responding to requests.

## Quick Fix: Use Lessons Without RAG

The Lessons page should work **even without RAG**. The AI features are optional.

### Check if Lessons Page Works

1. **Open browser console** (F12)
2. **Go to Lessons page**
3. **Check for errors**

If you see lessons listed, the page is working - RAG is just optional.

## Fix RAG Server

### Option 1: Kill and Restart

```bash
# Kill the stuck process
kill -9 $(lsof -ti:8001)

# Wait a moment
sleep 2

# Restart
cd el-bayan-Hamza-rag-ocr
python -m uvicorn backend.api:app --host 127.0.0.1 --port 8001 --reload
```

### Option 2: Check What's Blocking

The server might be stuck loading models. Check terminal output for:
- Model download progress
- Memory errors
- Import errors

### Option 3: Disable RAG Temporarily

If RAG keeps causing issues, you can disable it:

1. The frontend already handles RAG being unavailable
2. Lessons will show without AI features
3. You can enable RAG later when it's working

## Verify Server is Working

After restart, test:

```bash
curl http://localhost:8001/health
```

Should return JSON immediately (not hang).

## What "Nothing" Means

Please clarify:
- **Lessons page is blank?** → Check browser console for errors
- **Lessons show but no AI features?** → That's expected if RAG isn't working
- **Server won't start?** → Check terminal for error messages

## Next Steps

1. **Check browser console** - What errors do you see?
2. **Check terminal** - What does the server output show?
3. **Try restarting server** - Use the commands above

Share what you see and I'll help fix it!


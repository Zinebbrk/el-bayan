# Check if RAG Server is Ready

## What's Happening

The server is initializing and loading ML models. This can take 30-60 seconds, especially on first run.

## How to Check if It's Ready

### Option 1: Check Terminal Output

Look for these messages in your terminal:
```
INFO:     Application startup complete.
INFO:     Index loaded with X documents
```

### Option 2: Test the Health Endpoint

Open a **new terminal window** and run:

```bash
curl http://localhost:8001/health
```

**If working**, you'll see:
```json
{"status":"healthy","indexed":true,"num_documents":<number>}
```

**If still loading**, you'll get:
```
curl: (7) Failed to connect to localhost port 8001
```

### Option 3: Test in Browser

Open: http://localhost:8001/health

You should see JSON response if it's ready.

## Common Issues

### Issue 1: Server Stuck on "Started reloader process"

**Solution:** Wait 30-60 seconds. The model is loading in the background.

### Issue 2: Model Download Taking Too Long

If it's the first time, sentence-transformers downloads the model (~500MB). This can take several minutes depending on your internet.

**Check:** Look for download progress in terminal.

### Issue 3: Out of Memory

If you see memory errors, the model might be too large.

**Solution:** Try using a smaller model or increase available memory.

## What to Do

1. **Wait 1-2 minutes** for initial model loading
2. **Check terminal** for "Application startup complete"
3. **Test health endpoint** in new terminal
4. **If still not working after 2 minutes**, check terminal for error messages

## Expected Timeline

- **0-10 seconds:** Server starts
- **10-60 seconds:** Loading embedding model (first time only)
- **60-90 seconds:** Loading vector index
- **90+ seconds:** Ready to use

## Once Ready

1. Open your Lessons page in the browser
2. The "Smart exercises service not available" message should disappear
3. AI-generated exercises and examples should appear


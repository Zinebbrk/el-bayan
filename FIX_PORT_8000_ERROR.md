# Fix: "Operation not permitted" Error on Port 8000

## Problem
When trying to start the RAG backend, you get:
```
ERROR: [Errno 1] Operation not permitted
```

## Solutions

### Solution 1: Use a Different Port (Easiest)

The RAG service is now configured to use port **8001** by default.

**Start the server on port 8001:**
```bash
cd el-bayan-Hamza-rag-ocr
python -m uvicorn backend.api:app --host 127.0.0.1 --port 8001 --reload
```

**Or use localhost instead of 0.0.0.0:**
```bash
cd el-bayan-Hamza-rag-ocr
python -m uvicorn backend.api:app --host 127.0.0.1 --port 8000 --reload
```

### Solution 2: Fix macOS Permissions

If you need to use port 8000 specifically:

1. **Check what's using the port:**
   ```bash
   lsof -i :8000
   ```

2. **Kill any processes using it:**
   ```bash
   kill -9 <PID>
   ```

3. **Try binding to localhost only:**
   ```bash
   python -m uvicorn backend.api:app --host 127.0.0.1 --port 8000
   ```

### Solution 3: Use sudo (Not Recommended)

Only if absolutely necessary:
```bash
sudo python -m uvicorn backend.api:app --host 0.0.0.0 --port 8000
```

⚠️ **Warning:** Using sudo can cause permission issues with files.

### Solution 4: Configure Custom Port

If you want to use a different port, update `.env.local`:

```env
VITE_RAG_API_URL=http://localhost:8001
```

Then start the server on that port:
```bash
python -m uvicorn backend.api:app --host 127.0.0.1 --port 8001
```

## Current Configuration

The frontend is now configured to use **port 8001** by default, so:

1. **Start server on port 8001:**
   ```bash
   cd el-bayan-Hamza-rag-ocr
   python -m uvicorn backend.api:app --host 127.0.0.1 --port 8001 --reload
   ```

2. **Verify it's working:**
   ```bash
   curl http://localhost:8001/health
   ```

3. **The frontend will automatically connect to port 8001**

## Why This Happens

- macOS security restrictions on binding to `0.0.0.0`
- Another process might be using the port
- Firewall or network permissions

## Recommended Setup

**Use localhost (127.0.0.1) instead of 0.0.0.0:**
```bash
python -m uvicorn backend.api:app --host 127.0.0.1 --port 8001 --reload
```

This is safer and usually works without permission issues.


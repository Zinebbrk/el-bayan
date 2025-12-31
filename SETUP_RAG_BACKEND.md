# Setup RAG Backend - Quick Guide

## Error: ModuleNotFoundError: No module named 'sentence_transformers'

This means the Python dependencies for the RAG system are not installed.

## Solution: Install Dependencies

Run these commands in your terminal:

```bash
# Navigate to the RAG directory
cd el-bayan-Hamza-rag-ocr

# Install RAG dependencies
pip install -r rag_requirements.txt
```

### If you get permission errors:

**Option 1: Use conda (since you're using anaconda)**
```bash
conda install -c conda-forge sentence-transformers faiss-cpu fastapi uvicorn pydantic
pip install -r rag_requirements.txt
```

**Option 2: Install in a virtual environment (recommended)**
```bash
# Create virtual environment
python -m venv rag_env

# Activate it (macOS/Linux)
source rag_env/bin/activate

# Install dependencies
pip install -r rag_requirements.txt
```

**Option 3: Install with user flag**
```bash
pip install --user -r rag_requirements.txt
```

## After Installation

1. **Start the RAG backend:**
   ```bash
   cd el-bayan-Hamza-rag-ocr
   python -m uvicorn backend.api:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Verify it's running:**
   - You should see: `INFO:     Uvicorn running on http://0.0.0.0:8000`
   - Test in browser: http://localhost:8000/health

3. **If documents aren't indexed:**
   ```bash
   # Index documents (if needed)
   curl -X POST http://localhost:8000/index \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

## Common Issues

### Issue: torch installation fails
**Solution:** Install PyTorch separately first:
```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r rag_requirements.txt
```

### Issue: faiss-cpu installation fails
**Solution:** Try conda:
```bash
conda install -c conda-forge faiss-cpu
```

### Issue: Still getting import errors
**Solution:** Make sure you're in the correct Python environment:
```bash
which python  # Check which Python you're using
python --version  # Check version
```

## Quick Test

After installation, test if imports work:
```bash
cd el-bayan-Hamza-rag-ocr
python -c "from rag_system.pipeline.rag_pipeline import RAGPipeline; print('✓ Imports work!')"
```

If this works, you can start the server!


# Arabic Grammar RAG System (البيان)

A complete Arabic Grammar OCR and Question-Answering system using Retrieval-Augmented Generation (RAG).

## 📋 Features

### OCR Pipeline
- **PDF to Images**: High-quality extraction (300-400 DPI)
- **Image Preprocessing**: Grayscale, noise removal, binarization, deskewing
- **Arabic OCR**: Tesseract-based text extraction optimized for Arabic
- **Text Normalization**: Tashkeel removal, character normalization

### RAG System
- **Document Indexing**: FAISS vector store with Gemini embeddings
- **Semantic Search**: Find relevant passages from Arabic grammar books
- **LLM Integration**: Gemini/OpenRouter for answer generation
- **Web Interface**: React frontend with Arabic RTL support

## 📁 Project Structure

```
arabic_grammar_rag/
├── data/
│   ├── raw_pdfs/          # Input PDF files
│   ├── images/            # Generated page images
│   ├── text_raw/          # Raw OCR output
│   └── text_clean/        # Cleaned text (used for RAG)
├── src/                   # OCR system modules
│   ├── pdf/               # PDF to images conversion
│   ├── ocr/               # Tesseract OCR engine
│   ├── cleaning/          # Arabic text normalization
│   └── pipeline/          # OCR orchestration
├── rag_system/            # RAG system modules
│   ├── chunking/          # Text chunking
│   ├── embeddings/        # Gemini embeddings
│   ├── vector_store/      # FAISS vector database
│   ├── retrieval/         # Semantic search
│   ├── llm/               # LLM integration
│   └── pipeline/          # RAG orchestration
├── backend/               # FastAPI REST API
├── frontend/              # React web application
└── vector_store/          # FAISS index storage
```

---

## 🚀 Installation

### 1. System Dependencies

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y tesseract-ocr tesseract-ocr-ara poppler-utils nodejs npm
```

#### macOS:
```bash
brew install tesseract tesseract-lang poppler node
```

### 2. Python Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install -r rag_requirements.txt
```

### 3. Frontend Dependencies

```bash
cd frontend && npm install && cd ..
```

### 4. Configure API Key

```bash
cp .env.example .env
# Edit .env and add your API key:
# OPENROUTER_API_KEY=your_key_here
```

### 5. Verify Installation

```bash
tesseract --list-langs  # Should show 'ara'
python main.py --help
```

---

## 📖 Usage

### Quick Start (Web App)

```bash
# Start backend
./run_rag.sh

# In another terminal, start frontend
cd frontend && npm start
```

Access the app at http://localhost:3000

### OCR Processing

```bash
# Process all PDFs in data/raw_pdfs/
python main.py

# Process specific PDF
python main.py book.pdf

# With options
python main.py --overwrite --verbose
```

### Python API

```python
from pathlib import Path
from src.pipeline.ocr_pipeline import OCRPipeline

# Process a PDF
pipeline = OCRPipeline()
raw_text, clean_text = pipeline.process_pdf(Path("book.pdf"))
```

```python
from rag_system.pipeline.rag_pipeline import RAGPipeline
from rag_system.config import RAGConfig

# Query the RAG system
pipeline = RAGPipeline(RAGConfig())
pipeline.load_index("vector_store")
answer = pipeline.query("ما هو الإعراب؟")
```

---

## ⚙️ Configuration

### OCR Settings (`src/config.py`)

```python
TESSERACT_PATH = "/usr/bin/tesseract"
PDF_DPI = 350

PREPROCESS_CONFIG = {
    "apply_grayscale": True,
    "apply_noise_removal": True,
    "apply_binarization": True,
    "apply_deskew": True,
}

CLEANING_CONFIG = {
    "remove_tashkeel": True,
    "normalize_alef": True,
    "remove_non_arabic": True,
}
```

### RAG Settings (`rag_system/config.py`)

- Embedding model: `google/gemini-embedding-001`
- LLM model: `google/gemini-2.0-flash-exp:free`
- Chunk size: 500 tokens with 100 token overlap

---

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/query` | POST | Ask a question |
| `/sources` | GET | List indexed sources |

### Example Query

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "ما هو الفاعل؟"}'
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Tesseract not found | Update `TESSERACT_PATH` in config |
| Arabic lang missing | `sudo apt install tesseract-ocr-ara` |
| Poor OCR quality | Increase DPI to 400 |
| API errors | Check API key in `.env` |

---

## 📄 License

Educational and research purposes.

---

**Built with ❤️ for Arabic NLP research**

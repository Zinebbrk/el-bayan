#!/bin/bash

# RAG System Setup and Run Script

set -e

echo "=== Arabic Grammar RAG System Setup ==="
echo

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install RAG dependencies
echo "Installing RAG dependencies..."
pip install -r rag_requirements.txt

# Check for .env file
if [ ! -f ".env" ]; then
    echo
    echo "WARNING: .env file not found!"
    echo "Creating .env from template..."
    cp .env.example .env
    echo
    echo "Please edit .env and add your GEMINI_API_KEY"
    echo "Your API key is: AIzaSyBMNzSjNBJvLqW4oPj9O6t9Ynwkex8YWaE"
    echo "Then run this script again."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if API key is set
if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your_gemini_api_key_here" ]; then
    echo
    echo "ERROR: GEMINI_API_KEY not configured in .env"
    echo "Please add your actual API key to .env file"
    echo "Your API key is: AIzaSyBMNzSjNBJvLqW4oPj9O6t9Ynwkex8YWaE"
    exit 1
fi

echo
echo "=== Environment ready ==="
echo

# Check if index exists
if [ ! -f "vector_store/index.faiss" ]; then
    echo "No index found. Building index..."
    echo
    
    python3 << EOF
from rag_system.config import RAGConfig
from rag_system.pipeline.rag_pipeline import RAGPipeline
import os

config = RAGConfig()
config.gemini_api_key = os.getenv('GEMINI_API_KEY')

pipeline = RAGPipeline(config)
pipeline.index_documents(config.text_clean_dir)
pipeline.save_index(config.vector_store_path)
print('\n✓ Indexing complete!')
EOF
else
    echo "✓ Index found at vector_store/index.faiss"
fi

echo
echo "=== Starting Backend API ==="
echo "API will be available at http://localhost:8000"
echo
echo "In another terminal, run:"
echo "  cd frontend && npm start"
echo
echo "Press Ctrl+C to stop the server"
echo

cd backend
python api.py

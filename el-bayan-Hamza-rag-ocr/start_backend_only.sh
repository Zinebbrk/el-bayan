#!/bin/bash

# Quick Start - Backend Only (for testing)

cd /home/dia-hamza-abdelaziz/YEAR4/NLP/NLP_Project/AL\ BAYAN/arabic_grammar_rag

echo "🚀 Starting Backend API Only..."
echo

# Check if index exists
if [ ! -f "vector_store/index.faiss" ]; then
    echo "⚠️  No index found! Creating index first..."
    python3 << 'EOF'
from rag_system.pipeline.rag_pipeline import RAGPipeline
from rag_system.config import RAGConfig

pipeline = RAGPipeline(RAGConfig())
pipeline.index_documents('data/text_clean')
pipeline.save_index('vector_store')
print('\n✓ Index created!')
EOF
fi

echo
echo "✓ Starting API server at http://localhost:8000"
echo "✓ Test with: curl http://localhost:8000/health"
echo

cd backend
python3 api.py

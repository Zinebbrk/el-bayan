#!/bin/bash
# Run OCR pipeline in background, survives terminal closures

cd "/home/dia-hamza-abdelaziz/YEAR4/NLP/NLP_Project/AL BAYAN/arabic_grammar_rag"

# Activate virtual environment
source venv/bin/activate

# Run robust OCR with nohup (keeps running even if terminal closes)
nohup python main_robust.py > ocr_output.log 2>&1 &

# Get the process ID
PID=$!

echo "======================================"
echo "  ROBUST OCR PIPELINE STARTED"
echo "======================================"
echo "Process ID: $PID"
echo "Log file: ocr_output.log"
echo ""
echo "Features:"
echo "  ✓ Processes PDFs one at a time"
echo "  ✓ Saves after each page (no data loss)"
echo "  ✓ Lower memory usage (DPI 300)"
echo "  ✓ Auto-resizes large images"
echo "  ✓ Skips already processed PDFs"
echo "  ✓ Survives terminal crashes"
echo ""
echo "To check progress:"
echo "  tail -f ocr_output.log"
echo ""
echo "To check if still running:"
echo "  ps aux | grep main_robust"
echo ""
echo "To stop the process:"
echo "  kill $PID"
echo ""
echo "Output locations:"
echo "  Raw text:   data/text_raw/"
echo "  Clean text: data/text_clean/"
echo "======================================"

#!/bin/bash

# Simple script to start the entire application

echo "🚀 Starting Arabic Grammar RAG Web App"
echo "======================================"
echo

# Check if we're in the right directory
if [ ! -f "run_rag.sh" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

# Make scripts executable
chmod +x run_rag.sh

# Function to cleanup on exit
cleanup() {
    echo
    echo "Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Start backend in background
echo "Starting backend API..."
bash run_rag.sh > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 5

# Check if backend is running
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "⚠️  Backend may not be ready yet. Check backend.log for details."
    echo "Backend is starting in the background..."
fi

# Start frontend
echo
echo "Starting frontend..."
echo "======================================"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies (first time only)..."
    npm install
fi

# Start frontend
npm start

# Cleanup when npm start exits
cleanup

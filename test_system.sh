#!/bin/bash

# Test script to verify frontend-backend-RAG connection

echo "🧪 Testing Arabic Grammar RAG System"
echo "======================================"
echo

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Backend Health
echo "1️⃣  Testing Backend Health..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
    HEALTH=$(curl -s http://localhost:8000/health)
    echo "   $HEALTH"
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo "   Start with: ./start_backend_only.sh"
    exit 1
fi

echo

# Test 2: Index Status
echo "2️⃣  Checking Index Status..."
INDEXED=$(curl -s http://localhost:8000/health | grep -o '"indexed":[^,]*' | cut -d':' -f2)
if [ "$INDEXED" = "true" ]; then
    echo -e "${GREEN}✓ Documents are indexed${NC}"
else
    echo -e "${YELLOW}⚠ Documents not indexed${NC}"
    echo "   Create index with: curl -X POST http://localhost:8000/index"
fi

echo

# Test 3: Test Query
echo "3️⃣  Testing RAG Query..."
RESPONSE=$(curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "ما هو الإعراب؟"}' 2>&1)

if [ $? -eq 0 ] && echo "$RESPONSE" | grep -q "answer"; then
    echo -e "${GREEN}✓ RAG query successful${NC}"
    echo "   Question: ما هو الإعراب؟"
    ANSWER=$(echo "$RESPONSE" | grep -o '"answer":"[^"]*"' | cut -d':' -f2- | sed 's/"//g' | head -c 100)
    echo "   Answer: $ANSWER..."
else
    echo -e "${RED}✗ RAG query failed${NC}"
    echo "   Error: $RESPONSE"
fi

echo

# Test 4: Frontend Status
echo "4️⃣  Checking Frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is running at http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠ Frontend is not running${NC}"
    echo "   Start with: cd frontend && npm start"
fi

echo
echo "======================================"
echo "Test Complete!"
echo
echo "Access points:"
echo "  • Web App: http://localhost:3000"
echo "  • API Docs: http://localhost:8000/docs"
echo "  • Health: http://localhost:8000/health"

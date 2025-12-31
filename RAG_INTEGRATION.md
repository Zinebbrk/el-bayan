# RAG Integration Guide

This document explains how to set up and use the AI-powered features in the Lessons component.

## Overview

The Lessons component now includes AI-generated content powered by the RAG (Retrieval-Augmented Generation) system:

1. **Practice Exercises** - Generated based on lesson topic, proficiency level, and common mistakes
2. **Adaptive Examples** - Personalized examples relevant to user's interests/context
3. **Personalized Explanations** - Explanations adjusted based on user understanding level
4. **Review Questions** - Generated for completed lessons to test understanding

## Prerequisites

1. **RAG Backend Running**: The RAG system must be running on port 8000 (or configure `VITE_RAG_API_URL`)
2. **Indexed Documents**: The RAG system must have indexed Arabic grammar documents

## Setup Instructions

### 1. Start the RAG Backend

Navigate to the RAG directory and start the backend:

```bash
cd el-bayan-Hamza-rag-ocr
python -m uvicorn backend.api:app --host 0.0.0.0 --port 8000 --reload
```

Or use the provided script:

```bash
cd el-bayan-Hamza-rag-ocr
./start_backend_only.sh
```

### 2. Verify RAG is Running

Check the health endpoint:

```bash
curl http://localhost:8000/health
```

You should see:
```json
{
  "status": "healthy",
  "indexed": true,
  "num_documents": <number>
}
```

### 3. Configure Frontend (Optional)

If your RAG backend is running on a different URL, add to `.env.local`:

```env
VITE_RAG_API_URL=http://localhost:8000
```

## Features

### Practice Exercises

- **Location**: Below lesson content, in the "تمارين عملية" section
- **Generation**: Automatically generated when a lesson is opened
- **Refresh**: Click the refresh button to generate new exercises
- **Types**: Fill-in-the-blank, multiple-choice, sentence analysis

### Adaptive Examples

- **Location**: Above practice exercises
- **Content**: Personalized examples with Arabic text, transliteration, translation, and analysis
- **Context**: Can be customized based on user interests (future enhancement)

### Personalized Explanations

- **Location**: Toggle button "إظهار شرح مخصص حسب مستواك"
- **Features**:
  - Explanation depth adjusted to user level
  - Common mistakes highlighted
  - Examples included
- **Toggle**: Click to show/hide

### Review Questions

- **Location**: Below practice exercises (only for completed lessons)
- **Generation**: Automatically generated when a lesson is marked as complete
- **Types**: Multiple-choice, true/false, short answer
- **Purpose**: Test understanding of completed lessons

## How It Works

1. **User Opens Lesson**: When a user selects a lesson, the component:
   - Fetches lesson content from Supabase
   - Checks if RAG API is available
   - Generates AI content (exercises, examples, explanations)

2. **AI Generation Process**:
   - Sends prompts to RAG backend with lesson topic and user level
   - RAG system queries indexed Arabic grammar documents
   - Returns personalized content in Arabic

3. **Content Display**:
   - Exercises are displayed with interactive UI
   - Examples show Arabic text with transliteration and translation
   - Explanations can be toggled on/off
   - Review questions appear for completed lessons

## API Endpoints Used

The RAG service uses the following endpoints:

- `GET /health` - Check if RAG is available and indexed
- `POST /chat` - Query RAG with a question/prompt

## Error Handling

- **RAG Unavailable**: If RAG backend is not running, a message is shown and features are disabled
- **Generation Errors**: Errors are logged to console, but don't break the UI
- **Fallback**: If RAG fails, the component continues to work without AI features

## Future Enhancements

1. **User Interests**: Integrate user profile interests for more personalized examples
2. **Common Mistakes**: Track user mistakes and generate targeted exercises
3. **Weak Areas**: Use user progress data to identify weak areas and focus explanations
4. **Exercise Answers**: Implement answer checking and feedback
5. **Progress Tracking**: Track AI-generated exercise completion

## Troubleshooting

### RAG Not Available

**Problem**: "خدمة التمارين الذكية غير متاحة حالياً"

**Solutions**:
1. Check if RAG backend is running: `curl http://localhost:8000/health`
2. Verify port 8000 is not blocked
3. Check RAG backend logs for errors
4. Ensure documents are indexed (check `/health` response)

### Exercises Not Generating

**Problem**: Exercises section shows "جاري تحميل التمارين..." but nothing appears

**Solutions**:
1. Check browser console for errors
2. Verify RAG API is responding: `curl http://localhost:8000/chat -X POST -H "Content-Type: application/json" -d '{"question":"test"}'`
3. Check RAG backend logs
4. Verify documents are indexed

### CORS Errors

**Problem**: CORS errors in browser console

**Solutions**:
1. RAG backend should allow CORS (already configured in `api.py`)
2. Check if frontend URL is allowed in RAG backend CORS settings
3. For development, RAG backend allows all origins (`allow_origins=["*"]`)

## Code Structure

- **Service**: `src/services/ragService.ts` - RAG API client
- **Component**: `src/components/Lessons.tsx` - Integration and UI
- **Backend**: `el-bayan-Hamza-rag-ocr/backend/api.py` - RAG API server

## Notes

- AI features are optional - the Lessons component works without RAG
- All AI content is generated on-demand (not cached)
- RAG responses are in Arabic and formatted for display
- The system gracefully handles RAG unavailability


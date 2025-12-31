# AI Generation Pipeline - Current Implementation

## Overview

The application currently uses a **Smart Mock AI Service** for generating lesson content. This is a template-based system that provides topic-specific content without requiring external AI APIs.

---

## Current Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Lessons Component                     │
│              (src/components/Lessons.tsx)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Lesson AI Service                          │
│      (src/services/lessons/lessonAIService.ts)          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Decision Point: useHuggingFace = false (default) │  │
│  └──────────────────────────────────────────────────┘  │
│                     │                                    │
│         ┌───────────┴───────────┐                       │
│         │                       │                       │
│    [TRUE]                  [FALSE] ← Currently Active  │
│         │                       │                       │
│         ▼                       ▼                       │
│  ┌──────────────┐      ┌──────────────────┐            │
│  │ Hugging Face │      │  Smart Mock AI   │            │
│  │     API      │      │   (Template)     │            │
│  └──────────────┘      └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

---

## What We're Currently Using: Smart Mock AI

### Location
- **File**: `src/services/lessons/lessonAIService.ts`
- **Class**: `LessonAIService`
- **Default Mode**: `useHuggingFace = false`

### How It Works

1. **Input**: Lesson topic, proficiency level, count
2. **Processing**: 
   - Maps English lesson titles to Arabic concepts
   - Looks up topic-specific templates
   - Generates content based on templates
3. **Output**: Structured content (exercises, examples, questions)

### Example Flow

```typescript
// User opens lesson: "Introduction to Arabic Grammar"
lessonAIService.generateAdaptiveExamples("Introduction to Arabic Grammar", undefined, undefined, 3)

// Service maps to Arabic: "مقدمة في النحو"
// Looks up template for "مقدمة في النحو"
// Returns 3 examples from template:
//   - "الكتابُ مفيدٌ" (The book is useful)
//   - "قرأَ الطالبُ" (The student read)
//   - "في البيتِ" (In the house)
```

---

## Smart Mock Features

### ✅ Advantages
- **No API keys needed** - Works immediately
- **No rate limits** - Instant generation
- **No costs** - Completely free
- **Topic-specific** - Not generic, tailored to lesson topics
- **Reliable** - Always works, no network issues
- **Fast** - Synchronous, no waiting

### 📋 What It Generates

1. **Adaptive Examples** (أمثلة توضيحية مخصصة)
   - Arabic text with diacritics
   - Transliteration
   - Translation
   - Grammatical analysis

2. **Review Questions** (أسئلة مراجعة)
   - Multiple-choice questions
   - True/False questions
   - Short-answer questions
   - With correct answers and explanations

### 🎯 Topic Coverage

The mock service has templates for:
- Introduction to Arabic Grammar
- Harakāt (Vowel Marks)
- Definite/Indefinite Nouns
- Sentence Structure (Nominal & Verbal)
- Noun Cases (الإعراب)
- Verb Conjugation
- And more...

---

## Alternative: Hugging Face API (Optional)

### Configuration

To use real AI instead of mocks:

1. **Get API Key**: https://huggingface.co/settings/tokens
2. **Add to `.env.local`**:
   ```env
   VITE_HUGGINGFACE_API_KEY=your_key_here
   ```
3. **Enable in code**:
   ```typescript
   // In lessonAIService.ts
   private useHuggingFace = true; // Change from false to true
   ```

### Pipeline When Enabled

```
Lesson Topic → Build Prompt → Hugging Face API → Parse Response → Return Content
                                    │
                                    └─→ If fails → Fallback to Mock
```

### Model Used
- **Model**: `meta-llama/Meta-Llama-3-8B-Instruct`
- **API**: Hugging Face Inference API
- **Cost**: Free tier available

---

## RAG System (Not Currently Used)

### Location
- **Directory**: `el-bayan-Hamza-rag-ocr/`
- **Backend**: Python FastAPI server
- **Status**: Available but not integrated for lessons

### RAG Pipeline Components

```
Documents → Text Chunker → Embeddings → Vector Store (FAISS)
                                              │
                                              ▼
User Question → Embedding → Retrieval → Context → LLM → Answer
```

### RAG Components
1. **Text Chunker**: Splits documents into chunks
2. **Embeddings**: `GeminiEmbeddings` (Sentence Transformers)
3. **Vector Store**: FAISS (Facebook AI Similarity Search)
4. **Retriever**: Finds relevant chunks
5. **LLM**: Gemini via OpenRouter API

### Why Not Using RAG?
- RAG is designed for Q&A (chatbot)
- Lessons need structured content (exercises, examples)
- Smart mocks provide better control for educational content
- RAG requires Python backend running
- Smart mocks work immediately without setup

---

## Current Generation Flow

### When User Opens a Lesson

```
1. Lessons.tsx detects lesson selection
   ↓
2. Calls lessonAIService.generateAdaptiveExamples()
   ↓
3. Service checks: useHuggingFace = false
   ↓
4. Uses generateMockExamples()
   ↓
5. Maps topic to Arabic concept
   ↓
6. Looks up template or uses default
   ↓
7. Generates 3 examples from template
   ↓
8. Returns to Lessons.tsx
   ↓
9. Displays in UI
```

### For Review Questions

```
1. Lesson marked as completed
   ↓
2. Calls lessonAIService.generateReviewQuestions()
   ↓
3. Uses generateMockReviewQuestions()
   ↓
4. Topic-specific question templates
   ↓
5. Returns 5 questions
   ↓
6. Displays with interactive feedback
```

---

## Code Structure

```
src/services/lessons/
├── lessonAIService.ts          # Main AI service
│   ├── generateAdaptiveExamples()    # Generates examples
│   ├── generateReviewQuestions()     # Generates questions
│   ├── generateMockExamples()        # Mock examples generator
│   ├── generateMockReviewQuestions() # Mock questions generator
│   └── generateWithHuggingFace()     # Real AI (optional)
│
└── index.ts                    # Exports
```

---

## Summary

**Current Setup:**
- ✅ **Smart Mock AI** (Active) - Template-based, topic-specific
- ⚠️ **Hugging Face API** (Available but disabled) - Real AI, requires API key
- 📦 **RAG System** (Available but not used) - Python backend, for Q&A

**Recommendation:**
- Keep Smart Mock for now (works great, no setup needed)
- Enable Hugging Face if you want real AI generation
- Use RAG for chatbot Q&A features (separate from lessons)

---

## Future Enhancements

1. **Hybrid Approach**: Use real AI for generation, mocks as fallback
2. **Caching**: Cache generated content to avoid regeneration
3. **User Personalization**: Use user progress to customize content
4. **Multiple Providers**: Support OpenAI, Anthropic, etc.
5. **RAG Integration**: Use RAG for generating explanations from Arabic grammar texts


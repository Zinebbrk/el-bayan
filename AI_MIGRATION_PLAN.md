# AI Migration Plan: Mock AI → RAG / Fine-tuned LLMs

## Current State Analysis

### Mock AI Services Currently Used

1. **`aiService.ts`** (MockAIService)
   - Used by: Assessments, Games, Chatbot
   - Functions:
     - `generateQuestions()` - Assessment questions
     - `generateGameContent()` - Game challenges
     - `chat()` - Chatbot responses
     - `correctSentence()` - Sentence correction
     - `analyzeIrab()` - Iʿrāb analysis

2. **`lessonAIService.ts`** (LessonAIService)
   - Used by: Lessons component
   - Functions:
     - `generatePracticeExercises()` - Lesson exercises
     - `generateAdaptiveExamples()` - Personalized examples
     - `generatePersonalizedExplanation()` - Custom explanations
     - `generateReviewQuestions()` - Review questions
   - Has Hugging Face option (disabled by default)

3. **`ragService.ts`** (RAGService)
   - Status: ✅ Implemented but NOT used
   - Backend: ✅ RAG backend exists and works
   - Functions available:
     - `generatePracticeExercises()`
     - `generateAdaptiveExamples()`
     - `generatePersonalizedExplanation()`
     - `generateReviewQuestions()`
     - `checkHealth()`

### RAG Backend Status

- ✅ **Backend exists**: `el-bayan-Hamza-rag-ocr/backend/api.py`
- ✅ **Pipeline complete**: FAISS, embeddings, Gemini LLM
- ✅ **Endpoints available**: `/chat`, `/health`, `/index`
- ❌ **Not integrated**: Frontend not using it

---

## Migration Strategy

### Option 1: RAG (Retrieval-Augmented Generation)
**Best for:** Knowledge-based tasks, explanations, Q&A

**Pros:**
- ✅ Already implemented
- ✅ Uses your Arabic grammar documents
- ✅ Provides context-aware responses
- ✅ No training needed
- ✅ Can be updated by adding more documents

**Cons:**
- ⚠️ Requires document indexing
- ⚠️ May be slower than direct LLM calls
- ⚠️ Less control over structured output

**Use Cases:**
- Chatbot Q&A
- Personalized explanations
- Adaptive examples
- Review questions

### Option 2: Fine-tuned LLM
**Best for:** Structured generation, consistent formatting

**Pros:**
- ✅ Better structured output (JSON, specific formats)
- ✅ Faster response times
- ✅ More consistent results
- ✅ Can be optimized for specific tasks

**Cons:**
- ⚠️ Requires training data
- ⚠️ Training costs
- ⚠️ Model hosting/inference costs
- ⚠️ Less flexible for new topics

**Use Cases:**
- Assessment question generation
- Game content generation
- Exercise generation (structured)

### Option 3: Hybrid Approach (Recommended)
**Use RAG for knowledge-based, Fine-tuned for structured**

- **RAG**: Chatbot, explanations, examples
- **Fine-tuned LLM**: Questions, exercises, game content
- **Fallback**: Mock AI if both unavailable

---

## Implementation Plan

### Phase 1: RAG Integration (Week 1-2)

#### Step 1.1: Chatbot Integration
**Priority: High** | **Effort: Low** | **Impact: High**

**Current:** `ChatbotTutor.tsx` uses `aiService.chat()` (mock)

**Action:**
1. Update `ChatbotTutor.tsx` to use `ragService.queryRAG()`
2. Add fallback to mock if RAG unavailable
3. Test with various Arabic grammar questions

**Files to modify:**
- `src/components/ChatbotTutor.tsx`
- `src/services/chatbotService.ts`

**Implementation:**
```typescript
// In chatbotService.ts
async sendMessage(userId: string, message: string) {
  // Try RAG first
  const ragAvailable = await ragService.checkHealth();
  if (ragAvailable) {
    try {
      const response = await ragService.queryRAG(message);
      return response;
    } catch (error) {
      console.warn('RAG failed, using fallback');
    }
  }
  
  // Fallback to mock
  return aiService.chat(message);
}
```

---

#### Step 1.2: Lessons - Adaptive Examples
**Priority: Medium** | **Effort: Low** | **Impact: Medium**

**Current:** `lessonAIService.generateAdaptiveExamples()` uses mock

**Action:**
1. Update `lessonAIService.ts` to use `ragService.generateAdaptiveExamples()`
2. Keep mock as fallback
3. Test with different lesson topics

**Files to modify:**
- `src/services/lessons/lessonAIService.ts`

**Implementation:**
```typescript
async generateAdaptiveExamples(...) {
  const ragAvailable = await ragService.checkHealth();
  if (ragAvailable) {
    try {
      return await ragService.generateAdaptiveExamples(...);
    } catch (error) {
      console.warn('RAG failed, using mock');
    }
  }
  return this.generateMockExamples(...);
}
```

---

#### Step 1.3: Lessons - Personalized Explanations
**Priority: Medium** | **Effort: Low** | **Impact: Medium**

**Current:** `lessonAIService.generatePersonalizedExplanation()` uses mock

**Action:**
1. Update to use `ragService.generatePersonalizedExplanation()`
2. Add fallback
3. Test with different user levels

**Files to modify:**
- `src/services/lessons/lessonAIService.ts`

---

#### Step 1.4: Lessons - Review Questions
**Priority: Low** | **Effort: Low** | **Impact: Low**

**Current:** `lessonAIService.generateReviewQuestions()` uses mock

**Action:**
1. Update to use `ragService.generateReviewQuestions()`
2. Add fallback

**Files to modify:**
- `src/services/lessons/lessonAIService.ts`

---

### Phase 2: Structured Generation (Week 3-4)

#### Step 2.1: Assessment Questions
**Priority: High** | **Effort: Medium** | **Impact: High**

**Current:** `aiService.generateQuestions()` uses question bank

**Options:**
- **A) RAG with structured prompts** (Easier, faster)
- **B) Fine-tuned LLM** (Better quality, more work)

**Recommended: Start with RAG, migrate to fine-tuned later**

**Action:**
1. Create new function in `ragService.ts`: `generateAssessmentQuestions()`
2. Use structured prompts to get JSON output
3. Update `assessmentService.ts` to use RAG
4. Add fallback to mock

**Files to modify:**
- `src/services/ragService.ts` (add new function)
- `src/services/assessmentService.ts`

**Implementation:**
```typescript
// In ragService.ts
async generateAssessmentQuestions(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number
): Promise<Question[]> {
  const prompt = `Generate ${count} ${difficulty} Arabic grammar assessment questions about "${topic}".

Return JSON array with format:
[
  {
    "type": "multiple-choice",
    "question": "...",
    "options": ["...", "..."],
    "correct": "...",
    "explanation": "..."
  }
]`;

  const answer = await this.queryRAG(prompt);
  // Parse JSON from response
  return this.parseQuestionsJSON(answer);
}
```

---

#### Step 2.2: Game Content Generation
**Priority: Medium** | **Effort: Medium** | **Impact: Medium**

**Current:** `aiService.generateGameContent()` uses hardcoded challenges

**Action:**
1. Create `ragService.generateGameContent()` for dynamic game generation
2. Update `gameService.ts` to use RAG
3. Support different game types with structured prompts

**Files to modify:**
- `src/services/ragService.ts`
- `src/services/gameService.ts`

---

#### Step 2.3: Practice Exercises
**Priority: Medium** | **Effort: Low** | **Impact: Medium**

**Current:** `lessonAIService.generatePracticeExercises()` uses mock

**Action:**
1. Already has `ragService.generatePracticeExercises()` ✅
2. Update `lessonAIService.ts` to use it
3. Add fallback

**Files to modify:**
- `src/services/lessons/lessonAIService.ts`

---

### Phase 3: Advanced Features (Week 5-6)

#### Step 3.1: Sentence Correction
**Priority: Low** | **Effort: Medium** | **Impact: Low**

**Current:** `aiService.correctSentence()` returns mock

**Action:**
1. Create RAG endpoint for sentence correction
2. Use structured prompt for error detection
3. Return corrections with explanations

---

#### Step 3.2: Iʿrāb Analysis
**Priority: Low** | **Effort: Medium** | **Impact: Low**

**Current:** `aiService.analyzeIrab()` returns mock

**Action:**
1. Create RAG function for Iʿrāb analysis
2. Use structured prompts for word-by-word analysis
3. Return detailed grammatical breakdown

---

### Phase 4: Fine-tuned LLM (Optional, Future)

#### Step 4.1: Prepare Training Data
- Collect assessment questions
- Collect game content examples
- Format for fine-tuning

#### Step 4.2: Fine-tune Model
- Choose base model (e.g., Llama 3, Mistral)
- Fine-tune on Arabic grammar tasks
- Deploy model (Hugging Face, OpenAI, custom)

#### Step 4.3: Integrate Fine-tuned Model
- Create new service for fine-tuned model
- Update services to use fine-tuned for structured tasks
- Keep RAG for knowledge-based tasks

---

## Implementation Details

### Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Components                            │
│  (Assessments, Games, Chatbot, Lessons)                  │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│  Service Layer  │    │   AI Service     │
│                 │    │   (Unified)      │
│ - assessment    │───▶│                  │
│ - game          │    │  ┌────────────┐ │
│ - chatbot       │    │  │   RAG       │ │
│ - lesson        │    │  │   (Primary) │ │
└─────────────────┘    │  └────────────┘ │
                       │  ┌────────────┐ │
                       │  │ Fine-tuned │ │
                       │  │  (Future)  │ │
                       │  └────────────┘ │
                       │  ┌────────────┐ │
                       │  │   Mock     │ │
                       │  │ (Fallback) │ │
                       │  └────────────┘ │
                       └──────────────────┘
```

### Unified AI Service Pattern

Create a unified AI service that:
1. Checks RAG availability
2. Tries RAG first
3. Falls back to fine-tuned if available
4. Falls back to mock if both unavailable

```typescript
// src/services/unifiedAIService.ts
class UnifiedAIService {
  async generateQuestions(...) {
    // Try RAG
    if (await ragService.checkHealth()) {
      try {
        return await ragService.generateAssessmentQuestions(...);
      } catch (error) {
        console.warn('RAG failed');
      }
    }
    
    // Try fine-tuned (future)
    // if (fineTunedService.available) { ... }
    
    // Fallback to mock
    return aiService.generateQuestions(...);
  }
}
```

---

## Configuration

### Environment Variables

```env
# RAG Backend
VITE_RAG_API_URL=http://localhost:8001

# Fine-tuned LLM (future)
VITE_FINETUNED_API_URL=https://api.example.com
VITE_FINETUNED_API_KEY=your_key

# Feature Flags
VITE_USE_RAG=true
VITE_USE_FINETUNED=false
VITE_AI_FALLBACK_TO_MOCK=true
```

### Feature Flags

```typescript
// src/config/aiConfig.ts
export const aiConfig = {
  useRAG: import.meta.env.VITE_USE_RAG === 'true',
  useFineTuned: import.meta.env.VITE_USE_FINETUNED === 'true',
  fallbackToMock: import.meta.env.VITE_AI_FALLBACK_TO_MOCK === 'true',
  ragUrl: import.meta.env.VITE_RAG_API_URL || 'http://localhost:8001',
};
```

---

## Testing Strategy

### Unit Tests
- Test RAG service functions
- Test fallback logic
- Test JSON parsing

### Integration Tests
- Test RAG backend connection
- Test error handling
- Test fallback scenarios

### Manual Testing
- Test each feature with RAG enabled
- Test with RAG disabled (fallback)
- Test with invalid responses

---

## Migration Checklist

### Phase 1: RAG Integration
- [ ] Update ChatbotTutor to use RAG
- [ ] Update lessonAIService for adaptive examples
- [ ] Update lessonAIService for personalized explanations
- [ ] Update lessonAIService for review questions
- [ ] Test all RAG integrations
- [ ] Add error handling and fallbacks

### Phase 2: Structured Generation
- [ ] Add `generateAssessmentQuestions()` to ragService
- [ ] Update assessmentService to use RAG
- [ ] Add `generateGameContent()` to ragService
- [ ] Update gameService to use RAG
- [ ] Update lessonAIService for practice exercises
- [ ] Test structured JSON parsing

### Phase 3: Advanced Features
- [ ] Add sentence correction to RAG
- [ ] Add Iʿrāb analysis to RAG
- [ ] Test advanced features

### Phase 4: Fine-tuned LLM (Future)
- [ ] Prepare training data
- [ ] Fine-tune model
- [ ] Deploy model
- [ ] Integrate fine-tuned service
- [ ] Update services to use fine-tuned

---

## Rollback Plan

If RAG causes issues:
1. Set `VITE_USE_RAG=false` in environment
2. All services will fallback to mock
3. Fix RAG issues
4. Re-enable gradually

---

## Performance Considerations

### Caching
- Cache RAG responses for common queries
- Cache assessment questions per topic
- Cache game content per type

### Rate Limiting
- Implement rate limiting for RAG calls
- Queue requests if RAG is slow
- Use batch requests where possible

### Monitoring
- Log RAG response times
- Track success/failure rates
- Monitor fallback usage

---

## Cost Estimation

### RAG Backend
- **Current**: Free (self-hosted)
- **Future**: API costs if using cloud LLM (Gemini via OpenRouter)

### Fine-tuned LLM
- **Training**: $100-500 (one-time)
- **Inference**: $0.01-0.10 per 1000 requests (depends on model)

---

## Next Steps

1. **Immediate**: Start Phase 1 (RAG Integration)
2. **Week 1**: Complete Chatbot and Lessons RAG integration
3. **Week 2**: Complete Assessments and Games RAG integration
4. **Week 3-4**: Test and optimize
5. **Future**: Consider fine-tuned LLM for structured tasks

---

## Questions to Answer

1. **RAG Backend Status**: Is it running and indexed?
2. **Document Quality**: Are Arabic grammar documents properly indexed?
3. **Response Quality**: Test RAG responses for accuracy
4. **Performance**: Is RAG fast enough for real-time use?
5. **Cost**: What are the API costs for Gemini via OpenRouter?

---

## Resources

- RAG Backend: `el-bayan-Hamza-rag-ocr/backend/api.py`
- RAG Service: `src/services/ragService.ts`
- Current Mock AI: `src/services/aiService.ts`
- Lesson AI: `src/services/lessons/lessonAIService.ts`


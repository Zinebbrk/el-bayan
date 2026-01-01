# Unimplemented Features

This document lists all features that are **not yet implemented** or **partially implemented** in the Arabic Grammar Learning Platform.

---
### 3. **Chatbot RAG Integration**
- **Status**: UI exists with mock responses, but not connected to RAG backend
- **What's Missing**:
  - `ChatbotTutor.tsx` uses `generateAIResponse()` mock function
  - Not connected to `chatbotService` or RAG backend
  - No conversation persistence to database
  - RAG backend exists but not integrated
- **Files**:
  - `src/components/ChatbotTutor.tsx` - Uses mock `generateAIResponse()`
  - `src/services/chatbotService.ts` - ✅ Service exists but not used
  - `el-bayan-Hamza-rag-ocr/backend/api.py` - ✅ RAG backend exists but not connected

### 4. **Badge Awarding Logic**
- **Status**: Partially implemented - only checks XP and streak
- **What's Missing**:
  - `checkAndAwardBadges()` only checks `xp_earned` and `streak_days`
  - Missing checks for:
    - `lessons_completed` (First Steps, Knowledge Seeker badges)
    - `beginner_lessons_completed` (Grammar Master badge)
    - `perfect_assessment` (Perfect Score badge)
    - `chat_sessions` (Chat Master badge)
    - `games_won` (Game Champion badge)
- **Files**:
  - `src/services/userService.ts` - `checkAndAwardBadges()` function incomplete

### 5. **Admin Panel**
- **Status**: Not implemented
- **What's Missing**:
  - No admin interface for managing content
  - Cannot create/edit lessons through UI
  - Cannot create/edit assessments through UI
  - Cannot manage badges through UI
  - All content management must be done via SQL migrations

### 6. **Real AI Service**
- **Status**: Using mock AI service
- **What's Missing**:
  - `aiService.ts` and `aiMockService.ts` are mock implementations
  - No real AI integration (OpenAI, Anthropic, etc.)
  - TODO comments indicate need for real AI service
- **Files**:
  - `src/services/aiService.ts` - Mock implementation
  - `src/services/aiMockService.ts` - Mock implementation

---

## ⚠️ Partially Implemented (Needs Completion)

### 7. **RAG Backend Integration**
- **Status**: Backend exists but not connected to frontend
- **What's Implemented**:
  - ✅ RAG pipeline (FAISS, embeddings, LLM)
  - ✅ FastAPI server with endpoints
  - ✅ `ragService.ts` client exists
- **What's Missing**:
  - Frontend not using RAG backend
  - `ragService.ts` not called from components
  - Environment variable `VITE_RAG_API_URL` not used
  - Currently using Smart Mock AI instead

### 8. **Leaderboard**
- **Status**: Function exists but returns empty array
- **What's Missing**:
  - `gameService.getLeaderboard()` returns `[]`
  - No query joining `game_sessions` with `user_profiles`
  - No leaderboard UI component
- **Files**:
  - `src/services/gameService.ts` - `getLeaderboard()` method incomplete

### 9. **User Mistakes Tracking**
- **Status**: Database table exists but not used
- **What's Missing**:
  - `user_mistakes` table exists in schema
  - No service functions to track mistakes
  - No UI to display mistake patterns
  - No adaptive learning based on mistakes
- **Files**:
  - `src/supabase/migrations/001_initial_schema.sql` - Table defined
  - No service or component implementation

### 10. **Real-time Features**
- **Status**: Supabase Realtime available but not used
- **What's Missing**:
  - No real-time progress updates
  - No live leaderboard updates
  - No real-time notifications
  - No collaborative features

### 11. **File Storage**
- **Status**: Supabase Storage available but not used
- **What's Missing**:
  - No file upload functionality
  - No image/document storage
  - No user avatar uploads
  - No lesson content file attachments

### 12. **Edge Functions**
- **Status**: Supabase Edge Functions available but not used
- **What's Missing**:
  - No serverless functions for complex operations
  - No background jobs
  - No scheduled tasks
  - No webhook handlers

---

## 📋 Implementation Priority Recommendations

### High Priority (Core Features)
1. **Assessments Backend Integration** - Connect UI to `assessmentService`
2. **Games Backend Integration** - Connect UI to `gameService`
3. **Chatbot RAG Integration** - Connect UI to RAG backend via `chatbotService`
4. **Badge Awarding Logic** - Complete all badge criteria checks

### Medium Priority (Enhanced Features)
5. **Leaderboard** - Implement proper query and UI
6. **User Mistakes Tracking** - Build service and UI for adaptive learning
7. **Real AI Service** - Replace mock AI with real AI provider

### Low Priority (Nice-to-Have)
8. **Admin Panel** - Content management interface
9. **Real-time Features** - Live updates and notifications
10. **File Storage** - Avatar uploads and file attachments
11. **Edge Functions** - Background jobs and scheduled tasks

---

## 🔍 Quick Reference: What's Working vs Not Working

| Feature | UI | Backend Service | Database | Integration | Status |
|---------|----|-----------------|----------|-------------|--------|
| **Lessons** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| **Profile** | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| **Assessments** | ✅ | ✅ | ✅ | ❌ | ❌ Not Connected |
| **Games** | ✅ | ✅ | ✅ | ❌ | ❌ Not Connected |
| **Chatbot** | ✅ | ✅ | ✅ | ❌ | ❌ Not Connected |
| **Badges** | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ Partial |
| **RAG Backend** | ❌ | ✅ | N/A | ❌ | ❌ Not Integrated |
| **Leaderboard** | ❌ | ⚠️ | ✅ | ❌ | ❌ Not Implemented |
| **Mistakes Tracking** | ❌ | ❌ | ✅ | ❌ | ❌ Not Implemented |
| **Admin Panel** | ❌ | ❌ | ✅ | ❌ | ❌ Not Implemented |

---

## 📝 Notes

- All database schemas are complete and ready to use
- All service layers exist but some are not connected to UI
- The platform is functional for lessons and profile management
- Assessments, Games, and Chatbot need backend integration to be fully functional
- Badge system needs completion of awarding logic for all badge types


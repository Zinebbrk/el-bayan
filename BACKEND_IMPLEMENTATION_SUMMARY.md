# Backend Implementation Summary

## Overview

The Arabic Grammar Learning Platform uses **Supabase** as the primary backend (PostgreSQL database + Authentication) and has an optional **RAG (Retrieval-Augmented Generation) Python backend** for AI-powered features.

---

## 1. Supabase Backend (Primary)

### Technology Stack
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (Email/Password)
- **API**: Supabase REST API + Realtime subscriptions
- **Security**: Row Level Security (RLS) policies
- **Client**: `@supabase/supabase-js` (TypeScript)

### Database Schema

#### Core Tables

**1. `user_profiles`**
- Extends Supabase's `auth.users` table
- Stores user learning data:
  - `id` (UUID, references auth.users)
  - `name`, `email`
  - `level` (beginner/intermediate/advanced)
  - `xp` (experience points)
  - `current_level` (numeric level)
  - `streak_days` (daily learning streak)
  - `last_active_date`
  - `created_at`, `updated_at`

**2. `lessons`**
- Stores all grammar lessons:
  - `id` (UUID)
  - `title`, `description`
  - `level` (beginner/intermediate/advanced)
  - `order_index` (lesson order within level)
  - `content` (JSONB - flexible lesson content structure)
  - `is_locked` (boolean)
  - `created_at`

**3. `user_lesson_progress`**
- Tracks user progress per lesson:
  - `id` (UUID)
  - `user_id` (references user_profiles)
  - `lesson_id` (references lessons)
  - `progress_percentage` (0-100)
  - `completed_at` (timestamp, null if not completed)
  - `started_at`, `updated_at`
  - Unique constraint: (user_id, lesson_id)

**4. `assessments`**
- Quiz/test templates:
  - `id` (UUID)
  - `title`, `topic`
  - `difficulty` (easy/medium/hard)
  - `estimated_time_minutes`
  - `created_at`

**5. `assessment_sessions`**
- User assessment attempts:
  - `id` (UUID)
  - `user_id`, `assessment_id`
  - `questions` (JSONB array)
  - `answers` (JSONB array)
  - `score` (integer, nullable)
  - `completed_at` (nullable)
  - `created_at`

**6. `chatbot_conversations`**
- AI tutor chat history:
  - `id` (UUID)
  - `user_id`
  - `messages` (JSONB array of {role, content})
  - `created_at`, `updated_at`

**7. `game_sessions`**
- Educational game plays:
  - `id` (UUID)
  - `user_id`
  - `game_type` (text)
  - `game_data` (JSONB)
  - `score`, `xp_earned`
  - `completed_at`, `created_at`

**8. `user_mistakes`**
- Tracks common errors for adaptive learning:
  - `id` (UUID)
  - `user_id`
  - `topic`, `mistake_type`, `context`
  - `count` (frequency)
  - `last_occurred_at`

**9. `badges`**
- Achievement definitions:
  - `id` (UUID)
  - `name`, `description`, `icon`
  - `criteria` (JSONB - conditions for earning)
  - `created_at`

**10. `user_badges`**
- Earned achievements:
  - `user_id`, `badge_id` (composite primary key)
  - `earned_at`

### Database Features

#### Indexes
- Performance indexes on foreign keys:
  - `user_lesson_progress(user_id, lesson_id)`
  - `assessment_sessions(user_id)`
  - `chatbot_conversations(user_id)`
  - `game_sessions(user_id)`
  - `user_mistakes(user_id)`
  - `user_badges(user_id)`

#### Triggers
- **`update_updated_at_column()`**: Automatically updates `updated_at` timestamp
- **`handle_new_user()`**: Automatically creates `user_profiles` entry when a user signs up (solves RLS policy issues)

#### Row Level Security (RLS)

All tables have RLS enabled with policies:

**User Profiles:**
- Users can view/update only their own profile
- Profile creation handled by database trigger (bypasses RLS)

**Lessons, Assessments, Badges:**
- Public read access (everyone can view)
- No write access (managed by admin)

**User Data (Progress, Sessions, Conversations, etc.):**
- Users can only access their own records
- Full CRUD operations for own data

### Migrations

**1. `001_initial_schema.sql`**
- Creates all tables
- Sets up indexes
- Creates triggers
- Defines RLS policies

**2. `002_seed_data.sql`**
- Inserts initial lessons (beginner/intermediate/advanced)
- Inserts sample assessments
- Inserts badge definitions

**3. `003_fix_profile_creation.sql`**
- Creates `handle_new_user()` function
- Sets up trigger for automatic profile creation
- Grants necessary permissions

### API Access

**Client Setup:**
```typescript
// src/utils/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

**Usage:**
- Direct database queries via Supabase client
- Real-time subscriptions (not currently used)
- File storage (not currently used)
- Edge Functions (available but not used)

---

## 2. RAG Backend (Optional - Python FastAPI)

### Technology Stack
- **Framework**: FastAPI
- **Language**: Python 3.12+
- **Vector Store**: FAISS (Facebook AI Similarity Search)
- **Embeddings**: Sentence Transformers (Arabic models)
- **LLM**: Gemini via OpenRouter API
- **Port**: 8001 (configurable)

### Architecture

```
Documents → Text Chunker → Embeddings → Vector Store (FAISS)
                                              │
                                              ▼
User Question → Embedding → Retrieval → Context → LLM → Answer
```

### Components

**1. Text Chunker** (`rag_system/chunking/text_chunker.py`)
- Splits Arabic grammar documents into chunks
- Configurable chunk size and overlap

**2. Embeddings** (`rag_system/embeddings/gemini_embeddings.py`)
- Generates vector embeddings for Arabic text
- Uses Sentence Transformers models
- Lazy initialization (loads on first use)

**3. Vector Store** (`rag_system/vector_store/faiss_store.py`)
- Stores document embeddings in FAISS index
- Enables fast similarity search

**4. Retriever** (`rag_system/retrieval/retriever.py`)
- Finds relevant document chunks for queries
- Uses cosine similarity

**5. LLM** (`rag_system/llm/gemini_llm.py`)
- Generates answers using Gemini model
- Configured via OpenRouter API

**6. RAG Pipeline** (`rag_system/pipeline/rag_pipeline.py`)
- Orchestrates the entire RAG flow
- Handles indexing and querying

### API Endpoints

**Base URL**: `http://localhost:8001`

**1. `GET /`**
- Root endpoint
- Returns API information

**2. `GET /health`**
- Health check
- Returns:
  ```json
  {
    "status": "healthy" | "initializing",
    "indexed": true/false,
    "num_documents": <number>
  }
  ```

**3. `POST /chat`**
- Query RAG system with a question
- Request:
  ```json
  {
    "question": "string",
    "return_context": boolean
  }
  ```
- Response:
  ```json
  {
    "question": "string",
    "answer": "string",
    "context": "string (optional)",
    "sources": [array (optional)]
  }
  ```

**4. `POST /chat/stream`**
- Streaming chat endpoint (Server-Sent Events)
- Returns chunks of response as they're generated

**5. `POST /index`**
- Index documents from a directory
- Request:
  ```json
  {
    "text_dir": "path/to/documents (optional)"
  }
  ```
- Response:
  ```json
  {
    "status": "success",
    "message": "string",
    "num_documents": <number>
  }
  ```

### Features

**Lazy Initialization:**
- Pipeline initializes on first request (not at startup)
- Prevents server from hanging during model loading
- Health endpoint returns "initializing" status during load

**CORS:**
- Configured to allow all origins (development)
- Should be restricted in production

**Error Handling:**
- Graceful error messages
- Fallback to mock AI if RAG unavailable

### Current Status

- **Available**: RAG backend is implemented and can be started
- **Not Integrated**: Currently not used by the frontend (using Smart Mock AI instead)
- **Purpose**: Designed for chatbot Q&A features (separate from lesson content generation)

---

## 3. Profile Implementation (Full Authentication & Session Management)

### Overview

The Profile component provides complete user profile management with authentication, session management, and comprehensive statistics display. All features are fully integrated with the Supabase backend.

### Features

**1. Real Data Integration**
- Fetches user profile from `user_profiles` table
- Displays: name, email, level, XP, current level, streak days
- Shows join date and last active date
- Real-time statistics calculation

**2. Profile Editing**
- Edit user name and proficiency level
- Saves changes to database via `userService.updateUserProfile()`
- Real-time profile refresh after update
- Form validation and error handling

**3. Password Management**
- Change password functionality
- Uses Supabase Auth API (`supabase.auth.updateUser()`)
- Password validation:
  - Minimum 6 characters
  - New passwords must match
  - All fields required
- Secure password updates with error handling

**4. Session Management**
- Displays current session information
- Shows session expiration date
- Sign out functionality
- Visual indicator for active session

**5. Statistics Display**
- **Total XP**: Formatted with commas
- **Lessons Completed**: Count from `user_lesson_progress` table
- **In Progress Lessons**: Lessons with progress > 0% and < 100%
- **Badges Earned**: Count from `user_badges` table
- **Day Streak**: From user profile
- **Current Level**: Calculated from XP
- **Progress Bars**: Visual representation of progress

**6. Badges System**
- Fetches all badges from `badges` table
- Fetches user's earned badges from `user_badges` table
- Displays earned badges with:
  - Badge icon
  - Badge name
  - Date earned
- Shows unearned badges with locked icon
- Progress indicator: "X / Y badges earned"

### Data Flow

**Profile Load:**
```
1. Component mounts
   ↓
2. Check authentication (useAuth hook)
   ↓
3. Fetch user profile (userService.getUserProfile)
   ↓
4. Fetch all badges (userService.getAllBadges)
   ↓
5. Fetch user badges (useUserBadges hook)
   ↓
6. Fetch user progress (useUserProgress hook)
   ↓
7. Fetch all lessons (lessonService.getLessonsByLevel)
   ↓
8. Calculate statistics
   ↓
9. Display data
```

**Profile Update:**
```
1. User clicks "Edit Profile"
   ↓
2. Dialog opens with current data
   ↓
3. User modifies name/level
   ↓
4. User clicks "Save"
   ↓
5. userService.updateUserProfile() called
   ↓
6. Database updated (user_profiles table)
   ↓
7. Profile data refreshed
   ↓
8. Dialog closes
```

**Password Change:**
```
1. User clicks "Change Password"
   ↓
2. Dialog opens
   ↓
3. User enters passwords
   ↓
4. Validation (length, match)
   ↓
5. supabase.auth.updateUser() called
   ↓
6. Password updated in Supabase Auth
   ↓
7. Success message shown
   ↓
8. Dialog closes
```

### Database Integration

**Tables Used:**
- `user_profiles` - User profile data
- `user_lesson_progress` - Lesson completion statistics
- `badges` - All available badges
- `user_badges` - User's earned badges
- `lessons` - Total lesson count

**Services Used:**
- `userService.getUserProfile(userId)` - Fetch profile
- `userService.updateUserProfile(userId, updates)` - Update profile
- `userService.getAllBadges()` - Get all badges
- `lessonService.getLessonsByLevel(level)` - Get lessons for stats
- `useUserProgress()` - React hook for progress data
- `useUserBadges()` - React hook for badges data

**Supabase Auth:**
- `supabase.auth.updateUser()` - Change password
- `supabase.auth.signOut()` - Sign out
- Session information from `useAuth` hook

### Security Features

**1. Authentication Check:**
- Component checks if user is authenticated
- Shows message if not signed in
- Prevents unauthorized access

**2. Password Security:**
- Minimum 6 characters required
- Uses Supabase's secure password update
- No password stored in component state after change

**3. Session Management:**
- Shows current session info
- Secure sign out
- Session expiration display

**4. Data Privacy:**
- Only shows user's own data
- RLS policies enforced by Supabase
- No sensitive data exposed

### UI Components

**Dialogs:**
- Edit Profile Dialog - Name and level editing
- Change Password Dialog - Password management

**Visual Elements:**
- Progress bars with gradient colors
- Statistics cards with formatted numbers
- Badge grid (earned + unearned)
- Responsive layout

### Statistics Calculation

**Lessons:**
```typescript
- Total: Count all lessons across all levels
- Completed: Filter progress where completed_at is not null
- In Progress: Filter progress where percentage > 0 and < 100
```

**XP & Level:**
```typescript
- Total XP: From user_profiles.xp
- Current Level: From user_profiles.current_level
- Next Level: Calculate XP needed (1000 XP per level)
```

**Badges:**
```typescript
- Earned: Count from user_badges table
- Total: Count from badges table
- Progress: (earned / total) * 100
```

### Current Status

**✅ Fully Implemented:**
- Real database integration
- Profile editing
- Password management
- Session management
- Statistics display
- Badges system
- Progress visualization
- Error handling
- Security features
- Responsive design

**📝 Files:**
- `src/components/Profile.tsx` - Main profile component
- `src/services/userService.ts` - Profile service functions
- `src/hooks/useUserData.ts` - Data fetching hooks

---

## 4. Frontend Services (Backend Abstraction Layer)

### Services

**1. `src/services/lessonService.ts`**
- Functions for lesson data:
  - `getLessonsByLevel(level)`
  - `getLessonById(id)`
  - `getUserLessonProgress(userId)`
  - `updateLessonProgress(userId, lessonId, percentage)`
  - `isLevelComplete(userId, level)`
  - `getLessonsCountByLevel(level)`

**2. `src/services/ragService.ts`**
- RAG API client (not currently used)
- Functions:
  - `checkHealth()`
  - `generatePracticeExercises(...)`
  - `generateAdaptiveExamples(...)`
  - `generatePersonalizedExplanation(...)`
  - `generateReviewQuestions(...)`

**3. `src/services/lessons/lessonAIService.ts`**
- **Currently Active**: Smart Mock AI service
- Generates lesson-specific content:
  - Adaptive examples
  - Review questions
- Uses topic-specific templates
- No external API calls needed

**4. `src/services/userService.ts`**
- User profile operations:
  - `getUserProfile(userId)` - Fetch user profile
  - `updateUserProfile(userId, updates)` - Update profile
  - `getAllBadges()` - Get all available badges
  - `getUserBadges(userId)` - Get user's earned badges
  - `addXP(userId, amount)` - Add experience points
  - `updateStreak(userId)` - Update learning streak
  - `awardBadge(userId, badgeId)` - Award badge to user
  - `checkAndAwardBadges(userId)` - Auto-award badges based on criteria

**5. `src/hooks/useUserData.ts`**
- React hooks for data fetching:
  - `useUserProgress()` - Fetch and track lesson progress
  - `useLessons(level?)` - Fetch lessons by level
  - `useUserBadges()` - Fetch user's earned badges
  - `updateLessonProgress()` - Update lesson completion
  - `addXP()` - Add experience points

---

## 5. Authentication Backend

### Supabase Auth

**Features:**
- Email/Password authentication
- Session management
- JWT tokens
- Automatic user creation in `auth.users`

**Implementation:**
- `src/contexts/AuthContext.tsx`
- Functions:
  - `signUp(email, password, name)`
  - `signIn(email, password)`
  - `signOut()`
  - Auto-creates user profile via database trigger

**Security:**
- Email confirmation (can be disabled for development)
- Password hashing (handled by Supabase)
- Session tokens (managed by Supabase)

---

## 6. Data Flow

### User Registration Flow

```
1. User submits registration form
   ↓
2. AuthContext.signUp() called
   ↓
3. Supabase Auth creates user in auth.users
   ↓
4. Database trigger (handle_new_user) fires
   ↓
5. user_profiles entry created automatically
   ↓
6. User can now access the app
```

### Lesson Progress Flow

```
1. User opens lesson
   ↓
2. Frontend calls lessonService.getLessonById()
   ↓
3. Supabase query returns lesson data
   ↓
4. User completes lesson
   ↓
5. Frontend calls updateLessonProgress()
   ↓
6. Supabase updates user_lesson_progress table
   ↓
7. Progress tracked for level unlocking logic
```

### AI Content Generation Flow

```
1. User opens lesson
   ↓
2. Frontend calls lessonAIService.generateAdaptiveExamples()
   ↓
3. Service uses Smart Mock (topic-specific templates)
   ↓
4. Returns structured content (Arabic, transliteration, etc.)
   ↓
5. Frontend displays in UI
```

---

## 7. Environment Variables

### Required (Supabase)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional (RAG)
```env
VITE_RAG_API_URL=http://localhost:8001
```

### Optional (Hugging Face - not currently used)
```env
VITE_HUGGINGFACE_API_KEY=your_huggingface_key
```

---

## 8. Current Implementation Status

### ✅ Fully Implemented

1. **Database Schema**: Complete with all tables, indexes, triggers, RLS
2. **Authentication**: Email/password signup, signin, signout
3. **User Profiles**: Automatic creation, XP tracking, level management
4. **Profile Management**: Full profile editing, password change, session management
5. **Statistics**: Real-time calculation and display of progress, XP, badges, streak
6. **Lessons**: CRUD operations, progress tracking, level locking
7. **AI Content Generation**: Smart Mock AI with topic-specific templates
8. **Data Services**: All service layers for database access
9. **Badges System**: Badge display, earning tracking, progress indicators

### ⚠️ Partially Implemented

1. **RAG Backend**: Implemented but not integrated (available for future use)
2. **Assessments**: Schema exists, UI not fully implemented
3. **Chatbot**: Schema exists, UI exists but not connected to RAG
4. **Games**: Schema exists, UI not implemented
5. **Badges**: Schema exists, logic not fully implemented

### ❌ Not Implemented

1. **Real-time subscriptions**: Supabase Realtime not used
2. **File storage**: Supabase Storage not used
3. **Edge Functions**: Supabase Functions not used
4. **Admin panel**: No admin interface for managing content

---

## 9. Backend Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   Supabase      │    │   RAG Backend     │
│   (PostgreSQL)  │    │   (Python)       │
│                 │    │                   │
│ - Auth          │    │ - FAISS         │
│ - Database      │    │ - Embeddings     │
│ - RLS Policies  │    │ - LLM (Gemini)   │
│ - Triggers      │    │ - FastAPI        │
└─────────────────┘    └──────────────────┘
         │                       │
         │                       │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   Service Layer       │
         │   (TypeScript)        │
         │                       │
         │ - lessonService       │
         │ - lessonAIService     │
         │ - ragService          │
         └───────────────────────┘
```

---

## 10. Key Backend Files

### Database
- `src/supabase/migrations/001_initial_schema.sql` - Main schema
- `src/supabase/migrations/002_seed_data.sql` - Seed data
- `src/supabase/migrations/003_fix_profile_creation.sql` - Profile trigger

### Services
- `src/utils/supabase/client.ts` - Supabase client setup
- `src/services/lessonService.ts` - Lesson data operations
- `src/services/userService.ts` - User profile operations
- `src/services/lessons/lessonAIService.ts` - AI content generation
- `src/hooks/useUserData.ts` - React hooks for data
- `src/components/Profile.tsx` - Profile component with full auth

### RAG Backend
- `el-bayan-Hamza-rag-ocr/backend/api.py` - FastAPI server
- `el-bayan-Hamza-rag-ocr/rag_system/` - RAG pipeline components

---

## 11. Next Steps (Potential Enhancements)

1. **Integrate RAG Backend**: Connect RAG to chatbot component
2. **Real-time Updates**: Use Supabase Realtime for live progress updates
3. **Admin Panel**: Build admin interface for content management
4. **Analytics**: Track user behavior and learning patterns
5. **Caching**: Implement caching layer for frequently accessed data
6. **API Rate Limiting**: Add rate limiting for AI generation
7. **Background Jobs**: Use Supabase Edge Functions for async tasks

---

## Summary

**Primary Backend**: Supabase (PostgreSQL + Auth)
- ✅ Fully functional
- ✅ Secure (RLS policies)
- ✅ Scalable
- ✅ Production-ready

**Secondary Backend**: RAG Python API
- ⚠️ Implemented but not integrated
- ⚠️ Available for future chatbot features
- ⚠️ Optional (Smart Mock AI used instead)

**Current State**: The platform is fully functional with Supabase as the primary backend. The RAG backend exists but is not currently used, as the frontend uses Smart Mock AI for lesson content generation.


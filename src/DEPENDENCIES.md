# Required Dependencies for El-Bayan

This document lists all npm packages required for the El-Bayan platform.

## Installation

Run this command to install all dependencies:

```bash
npm install @supabase/supabase-js
```

All other dependencies (React, UI components, etc.) are already included in the Figma Make environment.

## Core Dependencies

### Backend Integration
- **@supabase/supabase-js** (^2.39.0) - Supabase client for authentication and database operations

### Already Included in Figma Make
The following are pre-installed:
- `react` - UI framework
- `lucide-react` - Icons
- `@radix-ui/*` - UI component primitives
- `tailwindcss` - CSS framework
- `class-variance-authority` - Styling utilities

## Environment Variables

Required in `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Optional: Real AI Integration

If you want to integrate with OpenAI or other AI services:

```bash
npm install openai
# or
npm install @anthropic-ai/sdk
```

Then add to `.env.local`:
```env
VITE_AI_API_KEY=your_ai_api_key
VITE_AI_ENABLED=true
```

## TypeScript Types

All TypeScript types are defined in:
- `/utils/supabase/client.ts` - Database types
- `/services/aiService.ts` - AI service interfaces

No additional type packages needed!

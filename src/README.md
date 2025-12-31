# El-Bayan (البيان) - Arabic Grammar Learning Platform

An adaptive Arabic grammar learning platform that combines Islamic aesthetics with modern EdTech features, powered by React, Supabase, and AI.

## 🌟 Features

### Core Functionality
- **Adaptive Lessons**: Progressive learning paths that adjust to your level
- **AI Chatbot Tutor**: Ask grammar questions and get instant explanations
- **Assessments**: Auto-graded quizzes with detailed feedback
- **Gamified Learning**: XP points, badges, streaks, and achievements
- **Progress Tracking**: Comprehensive analytics and personalized recommendations
- **Interactive Games**: Grammar challenges and daily puzzles

### Design
- **Islamic-Inspired Aesthetics**: Geometric patterns, calligraphic textures
- **Custom Color Palette**: Deep Arabic green (#688837), Sand-gold beige (#E1CB98), Off-white parchment (#FFFDF6)
- **Arabic Typography**: Amiri for headings, Cairo for body text
- **Fully Responsive**: Desktop and mobile optimized

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- A Supabase account ([sign up here](https://supabase.com))

### Installation

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase** (see detailed guide below)

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Supabase credentials

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📊 Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details and create

### Step 2: Get API Credentials

1. In your Supabase dashboard, go to Settings ⚙️ > API
2. Copy your **Project URL** and **anon/public key**
3. Add them to `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Step 3: Run Database Migrations

1. In Supabase dashboard, go to SQL Editor
2. Copy contents of `/supabase/migrations/001_initial_schema.sql`
3. Paste and run in SQL Editor
4. This creates all necessary tables with Row Level Security

### Step 4: Seed Initial Data

1. In SQL Editor, copy contents of `/supabase/seeds/001_seed_data.sql`
2. Paste and run
3. This populates lessons, assessments, and badges

### Step 5: Configure Authentication

1. Go to Authentication > Providers
2. Ensure **Email** is enabled
3. For development, disable email confirmation:
   - Go to Authentication > Settings
   - Toggle off "Enable email confirmations"

**✅ You're all set!** See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

## 🗄️ Database Schema

### Tables

- **user_profiles** - User data (XP, level, streak, preferences)
- **lessons** - Grammar lesson content (beginner/intermediate/advanced)
- **user_lesson_progress** - Tracks lesson completion and progress
- **assessments** - Quiz/test templates
- **assessment_sessions** - User assessment attempts and scores
- **chatbot_conversations** - AI tutor chat history
- **game_sessions** - Game plays and scores
- **user_mistakes** - Error tracking for adaptive learning
- **badges** - Achievement definitions
- **user_badges** - Earned user achievements

All tables have **Row Level Security (RLS)** enabled to ensure data privacy.

## 🤖 AI Mock Service

The platform includes a TypeScript mock AI service (`/services/aiService.ts`) that provides:

- Question generation for assessments
- Chatbot responses for common grammar topics
- Sentence correction and iʿrāb analysis
- Game content generation
- Daily tips and recommendations

### Replacing with Real AI

To integrate with OpenAI, Anthropic, or other AI services:

1. Create a new file `/services/realAIService.ts`
2. Implement the same interface as `MockAIService`
3. Update imports in service files to use the real implementation
4. Add API keys to `.env.local`:
   ```env
   VITE_AI_API_KEY=your_openai_api_key
   ```

Example integration:
```typescript
import OpenAI from 'openai';

export class RealAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_AI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  async chat(message: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an Arabic grammar expert...' },
        { role: 'user', content: message }
      ]
    });
    return response.choices[0].message.content || '';
  }
}
```

## 📁 Project Structure

```
├── /components           # React components
│   ├── Landing.tsx       # Landing page
│   ├── Dashboard.tsx     # User dashboard
│   ├── Lessons.tsx       # Lesson browser
│   ├── ChatbotTutor.tsx  # AI chat interface
│   ├── Assessments.tsx   # Quiz/test interface
│   ├── Games.tsx         # Game challenges
│   ├── Profile.tsx       # User profile
│   ├── Settings.tsx      # App settings
│   ├── AuthModal.tsx     # Login/register modal
│   └── /ui               # Reusable UI components
├── /contexts             # React contexts
│   └── AuthContext.tsx   # Authentication state
├── /services             # Business logic
│   ├── aiService.ts      # Mock AI service
│   ├── lessonService.ts  # Lesson data operations
│   ├── userService.ts    # User profile & badges
│   ├── chatbotService.ts # Chat operations
│   ├── assessmentService.ts # Quiz operations
│   └── gameService.ts    # Game operations
├── /utils/supabase       # Supabase configuration
│   └── client.ts         # Supabase client & types
├── /supabase
│   ├── /migrations       # SQL schema migrations
│   └── /seeds            # Sample data
├── /styles
│   └── globals.css       # Global styles & fonts
└── App.tsx               # Main app component
```

## 🎨 Design System

### Colors
- **Primary**: Deep Arabic Green `#688837`
- **Secondary**: Sand-gold Beige `#E1CB98`  
- **Background**: Off-white Parchment `#FFFDF6`
- **Accent**: Gold `#C8A560`
- **Text**: Dark `#2D2A26`

### Typography
- **Headings**: Amiri (serif) - Arabic calligraphic style
- **Body**: Cairo (sans-serif) - Modern Arabic font

### Components
- Rounded corners (border-radius: 12-24px)
- Subtle shadows and gradients
- Islamic geometric patterns as decorative elements
- Hover effects and smooth transitions

## 🔐 Security

### Row Level Security (RLS)
All user data is protected by Supabase RLS policies:
- Users can only read/write their own data
- Public content (lessons, assessments) is read-only
- Authentication required for all personal data

### API Keys
- **Never** commit `.env.local` to version control
- The anon/public key is safe for frontend use
- Never use the service_role key in client code

## 📦 Dependencies

### Core
- `react` - UI framework
- `@supabase/supabase-js` - Backend integration
- `lucide-react` - Icon library

### UI Components
- `@radix-ui/*` - Accessible component primitives
- `class-variance-authority` - CSS-in-JS styling
- `tailwindcss` - Utility-first CSS

## 🧪 Testing

To test the complete flow:

1. **Register** a new user via the Landing page
2. **Check** that user profile is created in Supabase
3. **Browse lessons** and view content
4. **Start a lesson** and track progress
5. **Chat** with the AI tutor
6. **Take an assessment** and view results
7. **Play a game** and earn XP/badges
8. **Check profile** to see stats and achievements

## 📱 Responsive Design

The platform is fully responsive:
- **Desktop**: Full sidebar navigation, multi-column layouts
- **Tablet**: Collapsible sidebar, adaptive grids
- **Mobile**: Bottom navigation, single-column layouts

## 🌍 Internationalization

Currently supports:
- English (UI labels and explanations)
- Arabic (grammar content, lessons, examples)

To add more languages, create translation files and use i18n library.

## 🚀 Deployment

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set environment variables in dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy!

### Build for Production

```bash
npm run build
```

Output will be in `/dist` directory.

## 📝 License

This project is for educational purposes. All rights reserved.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For questions or issues:
- Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Review Supabase docs: https://supabase.com/docs
- Open an issue on GitHub

---

**البيان (El-Bayan)** - Master Arabic Grammar with AI-Powered Learning

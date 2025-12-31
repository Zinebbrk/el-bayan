# Lesson AI Services

This folder contains AI services specifically for generating lesson-related content.

## Services

### `lessonAIService.ts`

Provides AI-generated content for lessons:
- **Practice Exercises** - Generated based on lesson topic and proficiency level
- **Adaptive Examples** - Personalized examples relevant to the topic
- **Personalized Explanations** - Explanations adjusted to user understanding
- **Review Questions** - Generated for completed lessons

## Configuration

### Current Setup: Smart Mock (Default)

The service uses **smart mock data** by default, which:
- ✅ Works immediately (no API setup needed)
- ✅ Provides topic-specific content
- ✅ Includes realistic Arabic grammar examples
- ✅ No external dependencies

### Using Real AI APIs (Optional)

To use a real AI API, you can:

#### Option 1: Hugging Face (Free)

1. Get API key from https://huggingface.co/settings/tokens
2. Add to `.env.local`:
   ```env
   VITE_HUGGINGFACE_API_KEY=your_key_here
   ```
3. Update `lessonAIService.ts`:
   ```typescript
   private useHuggingFace = true;
   ```

#### Option 2: OpenAI (Paid)

Modify the service to use OpenAI API:
```typescript
private async generateWithOpenAI(type, params) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  // ... parse response
}
```

#### Option 3: Other Free APIs

- **Cohere** (has free tier)
- **Anthropic Claude** (has free tier)
- **Google Gemini** (has free tier)

## Smart Mock Features

The mock service is "smart" because it:
- Provides topic-specific content (not generic)
- Includes realistic Arabic grammar examples
- Adapts to difficulty levels
- Includes proper explanations

## Usage

```typescript
import { lessonAIService } from '../services/lessons/lessonAIService';

// Generate exercises
const exercises = await lessonAIService.generatePracticeExercises(
  'الفاعل',
  'beginner',
  undefined,
  3
);

// Generate examples
const examples = await lessonAIService.generateAdaptiveExamples(
  'الفاعل',
  undefined,
  undefined,
  2
);

// Generate explanation
const explanation = await lessonAIService.generatePersonalizedExplanation(
  'الفاعل',
  'basic',
  'beginner',
  undefined
);
```

## Future Enhancements

- Add more topic-specific templates
- Integrate with user progress for personalized content
- Add caching to avoid regenerating same content
- Support multiple AI providers with fallback


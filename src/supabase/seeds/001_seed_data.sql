-- El-Bayan Arabic Grammar Learning Platform - Seed Data
-- This file populates the database with initial lessons, assessments, and badges

-- Insert Beginner Lessons
INSERT INTO lessons (title, description, level, order_index, content, is_locked) VALUES
(
  'Introduction to Arabic Grammar',
  'Learn the fundamentals of Arabic grammar including the three types of words',
  'beginner',
  1,
  '{"sections": [
    {"title": "Three Types of Words", "content": "Arabic has three types of words: اسم (noun), فعل (verb), and حرف (particle)"},
    {"title": "Examples", "content": "اسم: كتاب (book), فعل: كتب (wrote), حرف: في (in)"}
  ]}',
  false
),
(
  'Harakāt - Vowel Marks',
  'Master the vowel diacritics that indicate pronunciation',
  'beginner',
  2,
  '{"sections": [
    {"title": "The Four Harakāt", "content": "َ (fatha), ُ (dammah), ِ (kasra), ْ (sukun)"},
    {"title": "Usage", "content": "Each harakah changes the sound and meaning of words"}
  ]}',
  false
),
(
  'Definite and Indefinite Nouns',
  'Understand the use of ال (the definite article) and tanween',
  'beginner',
  3,
  '{"sections": [
    {"title": "Definite Nouns", "content": "Adding ال makes a noun definite: الكتاب (the book)"},
    {"title": "Indefinite Nouns", "content": "Tanween marks indefinite nouns: كتابٌ (a book)"}
  ]}',
  false
),
(
  'Sentence Structure: الجملة الاسمية',
  'Learn the nominal sentence structure',
  'beginner',
  4,
  '{"sections": [
    {"title": "Nominal Sentence", "content": "Subject (المبتدأ) + Predicate (الخبر)"},
    {"title": "Example", "content": "الطالبُ مجتهدٌ - The student is diligent"}
  ]}',
  false
),
(
  'Sentence Structure: الجملة الفعلية',
  'Learn the verbal sentence structure',
  'beginner',
  5,
  '{"sections": [
    {"title": "Verbal Sentence", "content": "Verb (الفعل) + Subject (الفاعل) + Object (المفعول به)"},
    {"title": "Example", "content": "كتبَ الطالبُ الدرسَ - The student wrote the lesson"}
  ]}',
  false
);

-- Insert Intermediate Lessons
INSERT INTO lessons (title, description, level, order_index, content, is_locked) VALUES
(
  'Noun Cases: الإعراب',
  'Master the three noun cases in Arabic grammar',
  'intermediate',
  1,
  '{"sections": [
    {"title": "Three Cases", "content": "Nominative (مرفوع), Accusative (منصوب), Genitive (مجرور)"},
    {"title": "Markers", "content": "Each case has specific markers based on noun type"}
  ]}',
  false
),
(
  'Verb Conjugation: Present Tense',
  'Learn how to conjugate present tense verbs',
  'intermediate',
  2,
  '{"sections": [
    {"title": "الفعل المضارع", "content": "Present tense verbs change based on subject"},
    {"title": "Example", "content": "يكتبُ، تكتبُ، أكتبُ، نكتبُ"}
  ]}',
  false
),
(
  'Verb Conjugation: Past Tense',
  'Master past tense verb conjugations',
  'intermediate',
  3,
  '{"sections": [
    {"title": "الفعل الماضي", "content": "Past tense verbs with different pronoun endings"},
    {"title": "Example", "content": "كتبَ، كتبتَ، كتبتِ، كتبنا"}
  ]}',
  false
),
(
  'The Five Nouns: الأسماء الخمسة',
  'Learn the special declension of five nouns',
  'intermediate',
  4,
  '{"sections": [
    {"title": "The Five Nouns", "content": "أب، أخ، حم، فو، ذو"},
    {"title": "Special Markers", "content": "These nouns use و، ا، ي as case markers"}
  ]}',
  false
),
(
  'Broken Plurals: جمع التكسير',
  'Understand irregular plural patterns',
  'intermediate',
  5,
  '{"sections": [
    {"title": "Irregular Plurals", "content": "Plurals that change the word structure"},
    {"title": "Patterns", "content": "فُعُول، فِعال، أفعال and many more"}
  ]}',
  false
);

-- Insert Advanced Lessons
INSERT INTO lessons (title, description, level, order_index, content, is_locked) VALUES
(
  'Advanced Morphology: الصرف',
  'Deep dive into word patterns and derivations',
  'advanced',
  1,
  '{"sections": [
    {"title": "Word Patterns", "content": "Understanding the root-pattern system"},
    {"title": "Verbal Forms", "content": "The 15 forms of the Arabic verb"}
  ]}',
  false
),
(
  'Rhetoric: البلاغة',
  'Study eloquence and rhetorical devices',
  'advanced',
  2,
  '{"sections": [
    {"title": "Three Sciences", "content": "المعاني، البيان، البديع"},
    {"title": "Applications", "content": "Understanding Quranic eloquence"}
  ]}',
  false
),
(
  'Complex Sentence Analysis',
  'Master the analysis of complex grammatical structures',
  'advanced',
  3,
  '{"sections": [
    {"title": "Embedded Clauses", "content": "Analyzing multi-level sentence structures"},
    {"title": "Advanced Iʿrāb", "content": "Detailed grammatical case analysis"}
  ]}',
  false
);

-- Insert Assessments
INSERT INTO assessments (title, difficulty, estimated_time_minutes, topic) VALUES
('Noun Cases Assessment', 'medium', 15, 'Iʿrāb - Noun Cases'),
('Verb Conjugation Quiz', 'medium', 20, 'Verb Conjugation'),
('Harakāt Mastery Test', 'easy', 10, 'Vowel Marks'),
('Sentence Structure Analysis', 'hard', 25, 'Sentence Analysis'),
('Comprehensive Grammar Test', 'hard', 30, 'Mixed Topics'),
('Beginner Fundamentals', 'easy', 12, 'Basic Grammar');

-- Insert Badges
INSERT INTO badges (name, description, icon, criteria) VALUES
('First Steps', 'Complete your first lesson', '🌱', '{"type": "lessons_completed", "count": 1}'),
('Grammar Explorer', 'Complete 5 lessons', '📚', '{"type": "lessons_completed", "count": 5}'),
('Dedicated Learner', 'Maintain a 7-day streak', '🔥', '{"type": "streak_days", "count": 7}'),
('Assessment Ace', 'Score 90% or higher on an assessment', '⭐', '{"type": "assessment_score", "threshold": 90}'),
('Chatbot Champion', 'Have 10 conversations with the AI tutor', '💬', '{"type": "chatbot_conversations", "count": 10}'),
('XP Master', 'Reach 1000 XP', '💎', '{"type": "xp_earned", "threshold": 1000}'),
('Game Master', 'Complete 20 game challenges', '🎮', '{"type": "games_completed", "count": 20}'),
('Beginner Graduate', 'Complete all beginner lessons', '🎓', '{"type": "level_completed", "level": "beginner"}'),
('Intermediate Scholar', 'Complete all intermediate lessons', '📖', '{"type": "level_completed", "level": "intermediate"}'),
('Advanced Expert', 'Complete all advanced lessons', '👑', '{"type": "level_completed", "level": "advanced"}');

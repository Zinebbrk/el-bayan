-- Seed Data for El-Bayan Arabic Grammar Learning Platform

-- Insert Badges
INSERT INTO badges (name, description, icon, criteria) VALUES
  ('First Steps', 'Complete your first lesson', '🌱', '{"lessons_completed": 1}'),
  ('Knowledge Seeker', 'Complete 10 lessons', '📚', '{"lessons_completed": 10}'),
  ('Grammar Master', 'Complete all beginner lessons', '👑', '{"beginner_lessons_completed": "all"}'),
  ('Perfect Score', 'Score 100% on an assessment', '⭐', '{"perfect_assessment": true}'),
  ('Consistent Learner', 'Maintain a 7-day streak', '🔥', '{"streak_days": 7}'),
  ('Chat Master', 'Have 50 chatbot conversations', '💬', '{"chat_sessions": 50}'),
  ('Game Champion', 'Win 20 games', '🏆', '{"games_won": 20}');

-- Insert Lessons - Beginner Level
INSERT INTO lessons (title, description, level, order_index, content, is_locked) VALUES
  ('Introduction to Arabic Grammar', 'Learn the foundational concepts of Arabic grammar (النحو)', 'beginner', 1, '{
    "sections": [
      {
        "title": "What is Arabic Grammar?",
        "content": "Arabic grammar (النحو) is the system of rules that govern the structure of the Arabic language. It helps us understand how words are formed and how they relate to each other in sentences.",
        "arabic": "النحو هو علم يبحث في أصول تكوين الجملة وقواعد الإعراب"
      },
      {
        "title": "The Three Types of Words",
        "content": "In Arabic, words are classified into three categories:",
        "list": [
          "اسم (Ism) - Noun: A word that names a person, place, thing, or idea",
          "فعل (Fiʿl) - Verb: A word that expresses an action or state",
          "حرف (Ḥarf) - Particle: A word that has grammatical function but no independent meaning"
        ]
      }
    ],
    "examples": [
      {"arabic": "الكتاب", "transliteration": "al-kitāb", "translation": "the book", "type": "noun"},
      {"arabic": "كتب", "transliteration": "kataba", "translation": "he wrote", "type": "verb"},
      {"arabic": "في", "transliteration": "fī", "translation": "in", "type": "particle"}
    ]
  }', false),
  
  ('Harakāt: The Vowel Marks', 'Master the essential vowel marks (التشكيل)', 'beginner', 2, '{
    "sections": [
      {
        "title": "The Short Vowels",
        "content": "Harakāt are the diacritical marks that indicate short vowels in Arabic.",
        "marks": [
          {"name": "Fatha", "symbol": "َ", "sound": "a", "example": "كَتَبَ (kataba)"},
          {"name": "Damma", "symbol": "ُ", "sound": "u", "example": "كُتُبٌ (kutubun)"},
          {"name": "Kasra", "symbol": "ِ", "sound": "i", "example": "كِتَابٌ (kitābun)"}
        ]
      },
      {
        "title": "Other Important Marks",
        "marks": [
          {"name": "Sukūn", "symbol": "ْ", "description": "Indicates absence of vowel"},
          {"name": "Shadda", "symbol": "ّ", "description": "Doubles the consonant"},
          {"name": "Tanwīn", "symbol": "ً ٌ ٍ", "description": "Adds -an, -un, -in sound"}
        ]
      }
    ]
  }', false),
  
  ('Nominal Sentences (الجملة الاسمية)', 'Construct basic nominal sentences', 'beginner', 3, '{
    "sections": [
      {
        "title": "Structure of Nominal Sentences",
        "content": "A nominal sentence (الجملة الاسمية) begins with a noun and consists of two parts:",
        "parts": [
          {"name": "المبتدأ (al-mubtadaʾ)", "description": "The subject (inchoative)", "case": "Nominative (مرفوع)"},
          {"name": "الخبر (al-khabar)", "description": "The predicate", "case": "Nominative (مرفوع)"}
        ]
      }
    ],
    "examples": [
      {"arabic": "الطالبُ مجتهدٌ", "transliteration": "aṭ-ṭālibu mujtahidun", "translation": "The student is diligent", "analysis": "Subject: الطالبُ (nominative), Predicate: مجتهدٌ (nominative)"}
    ]
  }', false),
  
  ('Verbal Sentences (الجملة الفعلية)', 'Learn to form verbal sentences', 'beginner', 4, '{
    "sections": [
      {
        "title": "Structure of Verbal Sentences",
        "content": "A verbal sentence (الجملة الفعلية) begins with a verb and has three parts:",
        "parts": [
          {"name": "الفعل (al-fiʿl)", "description": "The verb"},
          {"name": "الفاعل (al-fāʿil)", "description": "The doer/subject", "case": "Nominative (مرفوع)"},
          {"name": "المفعول به (al-mafʿūl bihi)", "description": "The object (if present)", "case": "Accusative (منصوب)"}
        ]
      }
    ],
    "examples": [
      {"arabic": "كتبَ الطالبُ الدرسَ", "transliteration": "kataba aṭ-ṭālibu ad-darsa", "translation": "The student wrote the lesson", "analysis": "Verb: كتبَ, Subject: الطالبُ (nominative), Object: الدرسَ (accusative)"}
    ]
  }', false),
  
  ('The Definite Article (ال)', 'Understanding the definite article', 'beginner', 5, '{
    "sections": [
      {
        "title": "Using ال (al-)",
        "content": "The definite article ال makes a noun definite, similar to \"the\" in English.",
        "rules": [
          "Added to the beginning of nouns",
          "Changes pronunciation with sun letters (الحروف الشمسية)",
          "Remains unchanged with moon letters (الحروف القمرية)"
        ]
      },
      {
        "title": "Sun and Moon Letters",
        "sun_letters": "ت ث د ذ ر ز س ش ص ض ط ظ ل ن",
        "moon_letters": "ا ب ج ح خ ع غ ف ق ك م ه و ي"
      }
    ]
  }', false);

-- Insert Lessons - Intermediate Level
INSERT INTO lessons (title, description, level, order_index, content, is_locked) VALUES
  ('Noun Cases (الإعراب)', 'Master the three cases of nouns', 'intermediate', 6, '{
    "sections": [
      {
        "title": "The Three Cases",
        "content": "Arabic nouns change their endings based on their grammatical function:",
        "cases": [
          {"name": "Nominative (المرفوع)", "marker": "ُ (ـُ/ـٌ)", "usage": "Subject of sentence, predicate"},
          {"name": "Accusative (المنصوب)", "marker": "َ (ـَ/ـً)", "usage": "Direct object, adverb"},
          {"name": "Genitive (المجرور)", "marker": "ِ (ـِ/ـٍ)", "usage": "After preposition, possessive"}
        ]
      }
    ],
    "examples": [
      {"case": "Nominative", "arabic": "جاءَ الطالبُ", "explanation": "الطالبُ is the subject"},
      {"case": "Accusative", "arabic": "رأيتُ الطالبَ", "explanation": "الطالبَ is the direct object"},
      {"case": "Genitive", "arabic": "ذهبتُ إلى الطالبِ", "explanation": "الطالبِ follows preposition إلى"}
    ]
  }', false),
  
  ('Verb Conjugation: Past Tense', 'Conjugate verbs in the past tense', 'intermediate', 7, '{
    "sections": [
      {
        "title": "Past Tense (الفعل الماضي)",
        "content": "The past tense verb changes based on the subject.",
        "conjugation": {
          "root": "ك-ت-ب (to write)",
          "forms": [
            {"person": "He", "arabic": "كَتَبَ", "transliteration": "kataba"},
            {"person": "She", "arabic": "كَتَبَتْ", "transliteration": "katabat"},
            {"person": "They (dual masculine)", "arabic": "كَتَبَا", "transliteration": "katabā"},
            {"person": "They (masculine)", "arabic": "كَتَبُوا", "transliteration": "katabū"},
            {"person": "I", "arabic": "كَتَبْتُ", "transliteration": "katabtu"},
            {"person": "We", "arabic": "كَتَبْنَا", "transliteration": "katabnā"}
          ]
        }
      }
    ]
  }', false),
  
  ('Verb Conjugation: Present Tense', 'Conjugate verbs in the present tense', 'intermediate', 8, '{
    "sections": [
      {
        "title": "Present Tense (الفعل المضارع)",
        "content": "The present tense uses prefixes and suffixes.",
        "conjugation": {
          "root": "ك-ت-ب (to write)",
          "forms": [
            {"person": "He", "arabic": "يَكْتُبُ", "transliteration": "yaktubu"},
            {"person": "She", "arabic": "تَكْتُبُ", "transliteration": "taktubu"},
            {"person": "They (masculine)", "arabic": "يَكْتُبُونَ", "transliteration": "yaktubūna"},
            {"person": "I", "arabic": "أَكْتُبُ", "transliteration": "aktubu"},
            {"person": "We", "arabic": "نَكْتُبُ", "transliteration": "naktubu"}
          ]
        }
      }
    ]
  }', false);

-- Insert Lessons - Advanced Level
INSERT INTO lessons (title, description, level, order_index, content, is_locked) VALUES
  ('إعراب Analysis', 'Perform detailed grammatical analysis', 'advanced', 9, '{
    "sections": [
      {
        "title": "Complete Sentence Analysis",
        "content": "Learn to analyze every word in a sentence grammatically.",
        "example": {
          "sentence": "قرأَ الطالبُ الكتابَ في المكتبةِ",
          "analysis": [
            {"word": "قرأَ", "function": "فعل ماضٍ", "description": "Past tense verb"},
            {"word": "الطالبُ", "function": "فاعل مرفوع", "description": "Subject in nominative case"},
            {"word": "الكتابَ", "function": "مفعول به منصوب", "description": "Direct object in accusative case"},
            {"word": "في", "function": "حرف جر", "description": "Preposition"},
            {"word": "المكتبةِ", "function": "اسم مجرور", "description": "Noun in genitive case after preposition"}
          ]
        }
      }
    ]
  }', false),
  
  ('Advanced Morphology', 'Study word patterns and derivations', 'advanced', 10, '{
    "sections": [
      {
        "title": "Verb Forms (الأوزان)",
        "content": "Arabic verbs follow patterns based on the root ف-ع-ل",
        "forms": [
          {"form": "Form I", "pattern": "فَعَلَ", "example": "كَتَبَ", "meaning": "Basic meaning"},
          {"form": "Form II", "pattern": "فَعَّلَ", "example": "كَتَّبَ", "meaning": "Intensive/causative"},
          {"form": "Form III", "pattern": "فَاعَلَ", "example": "كَاتَبَ", "meaning": "Reciprocal"},
          {"form": "Form IV", "pattern": "أَفْعَلَ", "example": "أَكْتَبَ", "meaning": "Causative"}
        ]
      }
    ]
  }', false);

-- Insert Assessments
INSERT INTO assessments (title, difficulty, estimated_time_minutes, topic) VALUES
  ('Beginner Grammar Fundamentals', 'easy', 15, 'Basic Concepts'),
  ('Harakāt and Pronunciation', 'easy', 10, 'Vowel Marks'),
  ('Sentence Structure Basics', 'easy', 20, 'Nominal and Verbal Sentences'),
  ('Noun Cases Assessment', 'medium', 25, 'Iʿrāb'),
  ('Verb Conjugation Test', 'medium', 20, 'Past and Present Tense'),
  ('Advanced Grammatical Analysis', 'hard', 30, 'Complete Iʿrāb Analysis');

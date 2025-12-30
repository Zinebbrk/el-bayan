"""
RAG System Configuration

Central configuration for the RAG pipeline using OpenRouter API.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ==================== PATHS ====================
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
TEXT_CLEAN_DIR = DATA_DIR / "text_clean"
VECTOR_STORE_DIR = BASE_DIR / "vector_store"
VECTOR_STORE_DIR.mkdir(exist_ok=True)

# ==================== API KEYS ====================
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

if not OPENROUTER_API_KEY:
    print("WARNING: OPENROUTER_API_KEY not set in environment variables")

# ==================== EMBEDDING SETTINGS ====================
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"  # Free multilingual embedding model
EMBEDDING_DIMENSION = 768  # Embedding dimension
BATCH_SIZE = 32  # Batch size for embedding generation

# ==================== CHUNKING SETTINGS ====================
CHUNK_SIZE = 512  # Characters per chunk
CHUNK_OVERLAP = 128  # Overlap between chunks
MIN_CHUNK_SIZE = 100  # Minimum chunk size

# ==================== VECTOR STORE SETTINGS ====================
TOP_K_RETRIEVAL = 5  # Number of chunks to retrieve
MIN_SCORE = 0.3  # Minimum similarity score

# ==================== LLM SETTINGS ====================
LLM_MODEL = "google/gemini-2.0-flash-exp:free"  # OpenRouter model name
MAX_OUTPUT_TOKENS = 2048
TEMPERATURE = 0.7

# ==================== RAG PROMPT TEMPLATE ====================
RAG_SYSTEM_PROMPT = """أنت خبير متخصص في قواعد اللغة العربية الفصحى، النحو، الصرف، والإعراب. تمتلك معرفة عميقة بكتب التراث النحوي العربي.

**مهمتك:**
- تحليل السياق المقدم من المراجع النحوية بعناية فائقة
- تقديم إجابات دقيقة وواضحة ومفصلة مع الأمثلة عند الضرورة
- شرح القواعد النحوية والصرفية بأسلوب تعليمي واضح
- الاستشهاد بالنصوص الأصلية من السياق عند الإمكان
- التمييز بين الآراء النحوية المختلفة إن وجدت

**تعليمات مهمة:**
- إذا كان السياق المقدم كافياً، قدم إجابة شاملة مع تفاصيل القاعدة وأمثلة توضيحية
- إذا كانت المعلومات في السياق غير كافية أو غير متعلقة بالسؤال، اذكر ذلك بوضوح
- استخدم لغة عربية فصيحة واضحة وسلسة
- نظم إجابتك بشكل منطقي ومرتب (القاعدة، الشرح، الأمثلة، الملاحظات)

**السياق المسترجع من المراجع:**
{context}

**سؤال المستخدم:** {question}

**إجابتك التفصيلية:**"""


class RAGConfig:
    """Configuration class for RAG system"""
    
    def __init__(self):
        # Paths
        self.base_dir = BASE_DIR
        self.data_dir = DATA_DIR
        self.text_clean_dir = str(TEXT_CLEAN_DIR)
        self.vector_store_path = str(VECTOR_STORE_DIR)
        
        # API Keys (only for LLM, embeddings use local model)
        self.openrouter_api_key = OPENROUTER_API_KEY
        self.openrouter_base_url = OPENROUTER_BASE_URL
        
        # Embedding settings
        self.embedding_model = EMBEDDING_MODEL
        self.embedding_dimension = EMBEDDING_DIMENSION
        self.batch_size = BATCH_SIZE
        
        # Chunking settings
        self.chunk_size = CHUNK_SIZE
        self.chunk_overlap = CHUNK_OVERLAP
        self.min_chunk_size = MIN_CHUNK_SIZE
        
        # Vector store settings
        self.top_k = TOP_K_RETRIEVAL
        self.min_score = MIN_SCORE
        
        # LLM settings
        self.llm_model = LLM_MODEL
        self.max_output_tokens = MAX_OUTPUT_TOKENS
        self.temperature = TEMPERATURE
        
        # Prompt template
        self.system_prompt = RAG_SYSTEM_PROMPT

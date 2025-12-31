"""
Retrieval Engine

Handles semantic search and retrieval of relevant context.
"""

import logging
import unicodedata
import re
from typing import List, Dict, Tuple
from rag_system.embeddings.gemini_embeddings import GeminiEmbeddings
from rag_system.vector_store.faiss_store import FAISSVectorStore

logger = logging.getLogger(__name__)


def normalize_arabic_text(text: str) -> str:
    """
    Normalize Arabic text by converting presentation forms to standard Arabic.
    
    Args:
        text: Input text that may contain malformed Arabic
        
    Returns:
        Normalized text with proper Arabic characters
    """
    if not text:
        return text
    
    # Normalize Unicode (NFKC converts presentation forms to standard)
    normalized = unicodedata.normalize('NFKC', text)
    
    # Clean up extra spaces
    normalized = re.sub(r' +', ' ', normalized)
    
    return normalized.strip()


class RetrievalEngine:
    """
    Retrieves relevant context for RAG using semantic search.
    """
    
    def __init__(self, embedder: GeminiEmbeddings, vector_store: FAISSVectorStore,
                 top_k: int = 5, min_score: float = 0.3):
        """
        Initialize retrieval engine.
        
        Args:
            embedder: Embeddings generator
            vector_store: Vector store for similarity search
            top_k: Number of results to retrieve
            min_score: Minimum similarity score
        """
        self.embedder = embedder
        self.vector_store = vector_store
        self.top_k = top_k
        self.min_score = min_score
        logger.info("RetrievalEngine initialized")
    
    def retrieve(self, query: str, top_k: int = None, min_score: float = None) -> List[Dict]:
        """
        Retrieve relevant context for a query.
        
        Args:
            query: User question
            top_k: Number of results to return (uses default if None)
            min_score: Minimum similarity score threshold (uses default if None)
            
        Returns:
            List of relevant chunks with metadata
        """
        if top_k is None:
            top_k = self.top_k
        if min_score is None:
            min_score = self.min_score
            
        logger.info(f"Retrieving context for query: {query[:50]}...")
        
        # Generate query embedding
        query_embedding = self.embedder.embed_query(query)
        
        # Search vector store
        results = self.vector_store.search(query_embedding, top_k=top_k)
        
        # Filter by minimum score
        filtered_results = [r for r in results if r.get('score', 0) >= min_score]
        
        logger.info(f"Retrieved {len(filtered_results)} relevant chunks")
        return filtered_results
    
    def format_context(self, results: List[Dict]) -> str:
        """
        Format retrieved chunks into context string.
        Applies Arabic text normalization to fix any malformed characters.
        
        Args:
            results: Retrieved chunks
            
        Returns:
            Formatted context string
        """
        if not results:
            return "لا توجد معلومات متاحة."
        
        context_parts = []
        for i, result in enumerate(results, 1):
            text = result.get('text', '')
            source = result.get('source', 'unknown')
            score = result.get('score', 0)
            
            # Normalize Arabic text to fix presentation forms
            text = normalize_arabic_text(text)
            
            context_parts.append(f"[مصدر {i}: {source} (درجة التشابه: {score:.2f})]\n{text}\n")
        
        return "\n".join(context_parts)
    
    def retrieve_and_format(self, query: str, top_k: int = 5) -> Tuple[str, List[Dict]]:
        """
        Retrieve and format context in one step.
        
        Args:
            query: User question
            top_k: Number of results
            
        Returns:
            Tuple of (formatted_context, raw_results)
        """
        results = self.retrieve(query, top_k=top_k)
        context = self.format_context(results)
        return context, results


if __name__ == "__main__":
    # Test retrieval
    import os
    logging.basicConfig(level=logging.INFO)
    
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        from pathlib import Path
        
        embedder = GeminiEmbeddings(api_key)
        vector_store = FAISSVectorStore(dimension=768)
        
        # Add some test data
        test_texts = [
            "النحو هو علم يبحث في أصول تكوين الجملة",
            "الفعل ما دل على حدث مقترن بزمان",
            "الاسم ما دل على معنى في نفسه غير مقترن بزمان"
        ]
        test_metadata = [{"text": t, "source": "test"} for t in test_texts]
        
        embeddings = embedder.embed_texts(test_texts, show_progress=False)
        vector_store.add_vectors(embeddings, test_metadata)
        
        # Test retrieval
        retriever = RetrievalEngine(embedder, vector_store)
        query = "ما هو الفعل؟"
        context, results = retriever.retrieve_and_format(query, top_k=2)
        
        print("Context:\n", context)
    else:
        print("Set GEMINI_API_KEY to test")

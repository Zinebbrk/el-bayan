"""
Sentence Transformers Embeddings Generator

Handles text embedding generation using Hugging Face sentence-transformers (free, local).
"""

import logging
import time
from typing import List, Dict
import numpy as np
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)


class GeminiEmbeddings:
    """
    Generates embeddings using Sentence Transformers (multilingual support for Arabic).
    """
    
    def __init__(self, api_key: str = None, model: str = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2", 
                 base_url: str = None):
        """
        Initialize Sentence Transformers embeddings (local, free).
        
        Args:
            api_key: Not used, kept for compatibility
            model: Sentence transformer model name
            base_url: Not used, kept for compatibility
        """
        self.model_name = model
        logger.info(f"Loading Sentence Transformer model: {model}")
        self.model = SentenceTransformer(model)
        logger.info(f"Embeddings model loaded successfully")
    
    def embed_text(self, text: str) -> List[float]:
        """
        Generate embedding for a single text.
        
        Args:
            text: Input text
            
        Returns:
            Embedding vector
        """
        try:
            embedding = self.model.encode(text, convert_to_numpy=True)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise
    
    def embed_texts(self, texts: List[str], batch_size: int = 32, 
                   show_progress: bool = True) -> List[List[float]]:
        """
        Generate embeddings for multiple texts.
        
        Args:
            texts: List of input texts
            batch_size: Number of texts per batch
            show_progress: Show progress information
            
        Returns:
            List of embedding vectors
        """
        embeddings = []
        total = len(texts)
        
        logger.info(f"Generating embeddings for {total} texts...")
        
        for i in range(0, total, batch_size):
            batch = texts[i:i + batch_size]
            batch_end = min(i + batch_size, total)
            
            if show_progress:
                logger.info(f"Processing batch {i//batch_size + 1}: texts {i+1}-{batch_end}/{total}")
            
            try:
                # Encode batch at once (much faster)
                batch_embeddings = self.model.encode(batch, convert_to_numpy=True, show_progress_bar=False)
                embeddings.extend([emb.tolist() for emb in batch_embeddings])
            except Exception as e:
                logger.error(f"Failed to embed batch: {e}")
                # Fallback: embed individually
                for text in batch:
                    try:
                        embedding = self.embed_text(text)
                        embeddings.append(embedding)
                    except Exception as e2:
                        logger.error(f"Failed to embed text: {e2}")
                        # Use zero vector as fallback
                        embeddings.append([0.0] * 768)
        
        logger.info(f"Generated {len(embeddings)} embeddings")
        return embeddings
    
    def embed_query(self, query: str) -> List[float]:
        """
        Generate embedding for a search query.
        
        Args:
            query: Search query text
            
        Returns:
            Query embedding vector
        """
        # For sentence-transformers, query embedding is the same as text embedding
        return self.embed_text(query)
    
    def embed_chunks(self, chunks: List[Dict]) -> List[Dict]:
        """
        Embed text chunks and attach embeddings to metadata.
        
        Args:
            chunks: List of chunk dictionaries
            
        Returns:
            Chunks with added 'embedding' field
        """
        texts = [chunk["text"] for chunk in chunks]
        embeddings = self.embed_texts(texts)
        
        for chunk, embedding in zip(chunks, embeddings):
            chunk["embedding"] = embedding
        
        logger.info(f"Embedded {len(chunks)} chunks")
        return chunks


if __name__ == "__main__":
    # Test embeddings
    import os
    logging.basicConfig(level=logging.INFO)
    
    embedder = GeminiEmbeddings()
    
    # Test single embedding
    text = "النحو هو علم يبحث في أصول تكوين الجملة"
    embedding = embedder.embed_text(text)
    print(f"Embedding dimension: {len(embedding)}")
    print(f"First 5 values: {embedding[:5]}")

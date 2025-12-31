"""
FAISS Vector Store

Manages vector storage and retrieval using FAISS index.
"""

import logging
import json
import pickle
from pathlib import Path
from typing import List, Dict, Tuple
import numpy as np
import faiss

logger = logging.getLogger(__name__)


class FAISSVectorStore:
    """
    Vector store using FAISS for efficient similarity search.
    """
    
    def __init__(self, dimension: int = 768, index_path: Path = None, metadata_path: Path = None):
        """
        Initialize FAISS vector store.
        
        Args:
            dimension: Embedding vector dimension
            index_path: Path to save/load FAISS index
            metadata_path: Path to save/load metadata
        """
        self.dimension = dimension
        self.index_path = index_path
        self.metadata_path = metadata_path
        
        # Create FAISS index (using cosine similarity)
        self.index = faiss.IndexFlatIP(dimension)  # Inner product for normalized vectors
        
        # Store text and metadata for each vector
        self.texts = []
        self.metadata = []
        self.id_to_metadata = {}
        
        logger.info(f"FAISSVectorStore initialized with dimension={dimension}")
    
    def add_vectors(self, embeddings: List[List[float]], texts: List[str], metadata: List[Dict]):
        """
        Add vectors and their metadata to the store.
        
        Args:
            embeddings: List of embedding vectors
            texts: List of text chunks
            metadata: List of metadata dictionaries
        """
        if len(embeddings) != len(metadata) or len(embeddings) != len(texts):
            raise ValueError("Embeddings, texts, and metadata must have same length")
        
        # Convert to numpy array and normalize
        vectors = np.array(embeddings).astype('float32')
        faiss.normalize_L2(vectors)  # Normalize for cosine similarity
        
        # Get current index size (for ID assignment)
        start_id = self.index.ntotal
        
        # Add to FAISS index
        self.index.add(vectors)
        
        # Store texts and metadata with IDs
        for i, (text, meta) in enumerate(zip(texts, metadata)):
            doc_id = start_id + i
            meta['id'] = doc_id
            meta['text'] = text
            self.texts.append(text)
            self.metadata.append(meta)
            self.id_to_metadata[doc_id] = meta
        
        logger.info(f"Added {len(embeddings)} vectors. Total: {self.index.ntotal}")
    
    def search(self, query_embedding: List[float], top_k: int = 5) -> List[Dict]:
        """
        Search for similar vectors.
        
        Args:
            query_embedding: Query vector
            top_k: Number of results to return
            
        Returns:
            List of metadata dictionaries with scores
        """
        if self.index.ntotal == 0:
            logger.warning("Index is empty")
            return []
        
        # Normalize query vector
        query_vector = np.array([query_embedding]).astype('float32')
        faiss.normalize_L2(query_vector)
        
        # Search
        scores, indices = self.index.search(query_vector, min(top_k, self.index.ntotal))
        
        # Gather results with metadata
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self.metadata):
                continue
            
            result = self.metadata[idx].copy()
            result['score'] = float(score)
            results.append(result)
        
        logger.debug(f"Found {len(results)} results")
        return results
    
    def save(self):
        """Save index and metadata to disk."""
        if self.index_path and self.metadata_path:
            # Save FAISS index
            faiss.write_index(self.index, str(self.index_path))
            logger.info(f"Saved FAISS index to {self.index_path}")
            
            # Save metadata
            with open(self.metadata_path, 'w', encoding='utf-8') as f:
                json.dump({
                    'metadata': self.metadata,
                    'id_to_metadata': {str(k): v for k, v in self.id_to_metadata.items()}
                }, f, ensure_ascii=False, indent=2)
            logger.info(f"Saved metadata to {self.metadata_path}")
        else:
            logger.warning("No save paths specified")
    
    def load(self):
        """Load index and metadata from disk."""
        if self.index_path and self.index_path.exists():
            self.index = faiss.read_index(str(self.index_path))
            logger.info(f"Loaded FAISS index from {self.index_path} ({self.index.ntotal} vectors)")
        else:
            logger.warning(f"Index file not found: {self.index_path}")
        
        if self.metadata_path and self.metadata_path.exists():
            with open(self.metadata_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.metadata = data['metadata']
                self.id_to_metadata = {int(k): v for k, v in data['id_to_metadata'].items()}
                # Rebuild texts list from metadata
                self.texts = [m.get('text', '') for m in self.metadata]
            logger.info(f"Loaded metadata ({len(self.metadata)} items)")
        else:
            logger.warning(f"Metadata file not found: {self.metadata_path}")
    
    def get_stats(self) -> Dict:
        """Get statistics about the vector store."""
        return {
            'total_vectors': self.index.ntotal,
            'dimension': self.dimension,
            'metadata_count': len(self.metadata),
        }
    
    def clear(self):
        """Clear all vectors and metadata."""
        self.index = faiss.IndexFlatIP(self.dimension)
        self.metadata = []
        self.id_to_metadata = {}
        logger.info("Cleared vector store")


if __name__ == "__main__":
    # Test vector store
    logging.basicConfig(level=logging.INFO)
    
    # Create sample data
    vectors = np.random.rand(100, 768).tolist()
    metadata = [{"text": f"Text {i}", "source": "test"} for i in range(100)]
    
    # Test store
    store = FAISSVectorStore(dimension=768)
    store.add_vectors(vectors, metadata)
    
    # Test search
    query = np.random.rand(768).tolist()
    results = store.search(query, top_k=5)
    
    print(f"Found {len(results)} results")
    for r in results[:3]:
        print(f"  Score: {r['score']:.4f}, Text: {r['text']}")

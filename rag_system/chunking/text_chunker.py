"""
Text Chunking Module

Handles splitting Arabic text into manageable chunks with overlap
for better context preservation in RAG.
"""

import logging
import re
from typing import List, Dict, Tuple
from pathlib import Path

logger = logging.getLogger(__name__)


class TextChunker:
    """
    Chunks Arabic text into smaller pieces with overlap.
    Handles sentence boundaries and preserves context.
    """
    
    def __init__(self, chunk_size: int = 512, overlap: int = 128, min_chunk_size: int = 100):
        """
        Initialize the text chunker.
        
        Args:
            chunk_size: Maximum characters per chunk
            overlap: Overlap characters between chunks
            min_chunk_size: Minimum chunk size to keep
        """
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.min_chunk_size = min_chunk_size
        logger.info(f"TextChunker initialized: size={chunk_size}, overlap={overlap}")
    
    def chunk_text(self, text: str, source: str = "unknown") -> List[Dict]:
        """
        Chunk text into smaller pieces with metadata.
        
        Args:
            text: Input text to chunk
            source: Source document name
            
        Returns:
            List of chunk dictionaries with text and metadata
        """
        if not text or len(text.strip()) < self.min_chunk_size:
            logger.warning(f"Text too short to chunk: {len(text)} chars")
            return []
        
        # Split into sentences (Arabic sentence endings)
        sentences = self._split_into_sentences(text)
        
        chunks = []
        current_chunk = ""
        current_chunk_sentences = []
        
        for sentence in sentences:
            # If adding this sentence exceeds chunk size
            if len(current_chunk) + len(sentence) > self.chunk_size and current_chunk:
                # Save current chunk
                chunks.append({
                    "text": current_chunk.strip(),
                    "source": source,
                    "chunk_id": len(chunks),
                    "sentences": current_chunk_sentences.copy()
                })
                
                # Start new chunk with overlap
                overlap_text = self._get_overlap_text(current_chunk_sentences)
                current_chunk = overlap_text + " " + sentence
                current_chunk_sentences = [sentence]
            else:
                current_chunk += " " + sentence
                current_chunk_sentences.append(sentence)
        
        # Add final chunk
        if current_chunk.strip() and len(current_chunk.strip()) >= self.min_chunk_size:
            chunks.append({
                "text": current_chunk.strip(),
                "source": source,
                "chunk_id": len(chunks),
                "sentences": current_chunk_sentences
            })
        
        logger.info(f"Created {len(chunks)} chunks from {source}")
        return chunks
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """
        Split Arabic text into sentences.
        
        Args:
            text: Input text
            
        Returns:
            List of sentences
        """
        # Arabic sentence endings: . ؟ ! ؛
        # Also handle line breaks as sentence boundaries
        text = text.replace('\n', ' . ')
        
        # Split on Arabic and English punctuation
        sentences = re.split(r'[.؟!؛]\s+', text)
        
        # Clean and filter
        sentences = [s.strip() for s in sentences if s.strip()]
        sentences = [s for s in sentences if len(s) >= 10]  # Filter very short sentences
        
        return sentences
    
    def _get_overlap_text(self, sentences: List[str]) -> str:
        """
        Get overlap text from previous chunk.
        
        Args:
            sentences: List of sentences from previous chunk
            
        Returns:
            Overlap text
        """
        overlap_text = ""
        for sentence in reversed(sentences):
            if len(overlap_text) + len(sentence) <= self.overlap:
                overlap_text = sentence + " " + overlap_text
            else:
                break
        
        return overlap_text.strip()
    
    def chunk_document(self, doc_path: Path) -> List[Dict]:
        """
        Read and chunk a document file.
        
        Args:
            doc_path: Path to text document
            
        Returns:
            List of chunks with metadata
        """
        try:
            with open(doc_path, 'r', encoding='utf-8') as f:
                text = f.read()
            
            source_name = doc_path.stem
            chunks = self.chunk_text(text, source=source_name)
            
            logger.info(f"Chunked document {doc_path.name}: {len(chunks)} chunks")
            return chunks
            
        except Exception as e:
            logger.error(f"Error chunking document {doc_path}: {e}")
            return []
    
    def chunk_directory(self, dir_path, pattern: str = "*.txt") -> Tuple[List[str], List[Dict]]:
        """
        Chunk all documents in a directory.
        
        Args:
            dir_path: Directory containing text files (str or Path)
            pattern: File pattern to match
            
        Returns:
            Tuple of (chunk_texts, chunk_metadata)
        """
        # Convert to Path if string
        if isinstance(dir_path, str):
            dir_path = Path(dir_path)
            
        all_chunks = []
        all_texts = []
        all_metadata = []
        
        files = list(dir_path.glob(pattern))
        logger.info(f"Found {len(files)} files to chunk in {dir_path}")
        
        for file_path in files:
            if file_path.stem.startswith('.'):  # Skip hidden files
                continue
            
            chunks = self.chunk_document(file_path)
            for chunk in chunks:
                all_texts.append(chunk['text'])
                all_metadata.append({
                    'source': chunk.get('source', str(file_path)),
                    'chunk_index': chunk.get('chunk_index', 0)
                })
            all_chunks.extend(chunks)
        
        logger.info(f"Total chunks created: {len(all_chunks)}")
        return all_texts, all_metadata


# Convenience function
def chunk_text_simple(text: str, chunk_size: int = 512, overlap: int = 128) -> List[str]:
    """
    Simple function to chunk text and return just the text strings.
    
    Args:
        text: Input text
        chunk_size: Characters per chunk
        overlap: Overlap between chunks
        
    Returns:
        List of chunk strings
    """
    chunker = TextChunker(chunk_size=chunk_size, overlap=overlap)
    chunks = chunker.chunk_text(text)
    return [chunk["text"] for chunk in chunks]


if __name__ == "__main__":
    # Test chunking
    logging.basicConfig(level=logging.INFO)
    
    sample_text = """
    النحو هو علم يبحث في أصول تكوين الجملة وقواعد الإعراب.
    الكلام في اللغة العربية ينقسم إلى اسم وفعل وحرف.
    الاسم هو ما دل على معنى في نفسه غير مقترن بزمان.
    """
    
    chunker = TextChunker(chunk_size=100, overlap=30)
    chunks = chunker.chunk_text(sample_text, source="test")
    
    for i, chunk in enumerate(chunks):
        print(f"Chunk {i}: {chunk['text'][:50]}...")

"""
Complete RAG Pipeline

Orchestrates retrieval-augmented generation flow.
"""

import logging
from typing import List, Dict, Optional, Generator
from pathlib import Path

from ..config import RAGConfig
from ..chunking.text_chunker import TextChunker
from ..embeddings.gemini_embeddings import GeminiEmbeddings
from ..vector_store.faiss_store import FAISSVectorStore
from ..retrieval.retriever import RetrievalEngine
from ..llm.gemini_llm import GeminiLLM

logger = logging.getLogger(__name__)


class RAGPipeline:
    """
    Complete RAG pipeline from documents to answers.
    """
    
    def __init__(self, config: RAGConfig = None):
        """
        Initialize RAG pipeline.
        
        Args:
            config: RAG configuration
        """
        self.config = config or RAGConfig()
        
        # Initialize components
        self.chunker = TextChunker(
            chunk_size=self.config.chunk_size,
            overlap=self.config.chunk_overlap
        )
        
        self.embeddings = GeminiEmbeddings(
            model=self.config.embedding_model
        )
        
        self.vector_store = FAISSVectorStore(
            dimension=self.config.embedding_dimension
        )
        
        self.retriever = RetrievalEngine(
            embedder=self.embeddings,
            vector_store=self.vector_store
        )
        
        self.llm = GeminiLLM(
            api_key=self.config.openrouter_api_key,
            model=self.config.llm_model,
            max_output_tokens=self.config.max_output_tokens,
            temperature=self.config.temperature,
            base_url=self.config.openrouter_base_url
        )
        
        logger.info("RAG pipeline initialized")
    
    def index_documents(self, text_dir: str) -> None:
        """
        Index all documents in directory.
        
        Args:
            text_dir: Path to directory with text files
        """
        logger.info(f"Indexing documents from: {text_dir}")
        
        text_path = Path(text_dir)
        if not text_path.exists():
            raise FileNotFoundError(f"Text directory not found: {text_dir}")
        
        # Chunk documents
        chunks, metadata = self.chunker.chunk_directory(str(text_path))
        logger.info(f"Created {len(chunks)} chunks from documents")
        
        if not chunks:
            logger.warning("No chunks created - check document directory")
            return
        
        # Generate embeddings
        logger.info("Generating embeddings...")
        vectors = self.embeddings.embed_texts(chunks)
        logger.info(f"Generated {len(vectors)} embeddings")
        
        # Add to vector store
        self.vector_store.add_vectors(vectors, chunks, metadata)
        logger.info("Documents indexed successfully")
    
    def save_index(self, path: str) -> None:
        """
        Save vector index to disk.    
            path: Directory to save index
        """
        from pathlib import Path
        path_obj = Path(path)
        path_obj.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"Saving index to: {path}")
        self.vector_store.index_path = path_obj / "index.faiss"
        self.vector_store.metadata_path = path_obj / "metadata.json"
        self.vector_store.save()
        logger.info("Index saved successfully")
    
    def load_index(self, path: str) -> None:
        """
        Load vector index from disk.
        
        Args:
            path: Directory with saved index
        """
        from pathlib import Path
        path_obj = Path(path)
        
        logger.info(f"Loading index from: {path}")
        self.vector_store.index_path = path_obj / "index.faiss"
        self.vector_store.metadata_path = path_obj / "metadata.json"
        self.vector_store.load()
        logger.info(f"Index loaded with {len(self.vector_store.texts)} documents")
    
    def query(self, question: str, return_context: bool = False) -> Dict:
        """
        Query the RAG system.
        
        Args:
            question: User question
            return_context: Whether to return retrieved context
            
        Returns:
            Dict with answer and optionally context
        """
        logger.info(f"Processing query: {question[:50]}...")
        
        # Retrieve relevant context
        context, results = self.retriever.retrieve_and_format(question)
        
        if not context or context == "لا توجد معلومات ذات صلة.":
            answer = "عذراً، لم أجد معلومات كافية للإجابة على هذا السؤال في المراجع المتاحة."
        else:
            # Generate answer - let exceptions propagate for proper error handling
            answer = self.llm.answer_question(
                question=question,
                context=context,
                system_prompt_template=self.config.system_prompt
            )
        
        response = {
            "question": question,
            "answer": answer
        }
        
        if return_context:
            response["context"] = context
            response["sources"] = [
                {
                    "text": r.get("text", ""),
                    "score": r.get("score", 0.0),
                    "metadata": {k: v for k, v in r.items() if k not in ["text", "score"]}
                }
                for r in results
            ]
        
        logger.info("Query processed successfully")
        return response
    
    def batch_query(self, questions: List[str]) -> List[Dict]:
        """
        Process multiple questions.
        
        Args:
            questions: List of questions
            
        Returns:
            List of answer dicts
        """
        logger.info(f"Processing {len(questions)} questions")
        return [self.query(q) for q in questions]

    def stream_query(self, question: str) -> Generator[str, None, None]:
        """
        Query the RAG system with streaming response.
        
        Args:
            question: User question
            
        Yields:
            Answer text chunks
            
        Raises:
            Exception: If there's an error during streaming
        """
        logger.info(f"Processing streaming query: {question[:50]}...")
        
        # Retrieve relevant context
        context, results = self.retriever.retrieve_and_format(question)
        
        if not context or context == "لا توجد معلومات ذات صلة.":
            yield "عذراً، لم أجد معلومات كافية للإجابة على هذا السؤال في المراجع المتاحة."
            return
        
        # Generate answer with streaming - let errors propagate
        for chunk in self.llm.stream_answer_question(
            question=question,
            context=context,
            system_prompt_template=self.config.system_prompt
        ):
            yield chunk
        
        logger.info("Streaming query processed successfully")

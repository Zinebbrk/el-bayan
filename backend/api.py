"""
FastAPI Backend for RAG System

REST API for Arabic grammar Q&A system.
"""

import logging
import sys
import json
from typing import Dict, List, Optional
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from rag_system.config import RAGConfig
from rag_system.pipeline.rag_pipeline import RAGPipeline

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="Arabic Grammar RAG API",
    description="Retrieval-Augmented Generation API for Arabic grammar questions",
    version="1.0.0"
)

# CORS configuration - allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG pipeline
config = RAGConfig()
pipeline = None


# Request/Response models
class ChatRequest(BaseModel):
    """Chat request model"""
    question: str
    return_context: bool = False


class ChatResponse(BaseModel):
    """Chat response model"""
    question: str
    answer: str
    context: Optional[str] = None
    sources: Optional[List[Dict]] = None


class IndexRequest(BaseModel):
    """Index request model"""
    text_dir: Optional[str] = None


class IndexResponse(BaseModel):
    """Index response model"""
    status: str
    message: str
    num_documents: int


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    indexed: bool
    num_documents: int


@app.on_event("startup")
async def startup_event():
    """Initialize pipeline on startup"""
    global pipeline
    
    logger.info("Starting API server...")
    
    try:
        # Initialize pipeline
        pipeline = RAGPipeline(config)
        
        # Try to load existing index
        index_path = config.vector_store_path
        if Path(index_path).exists() and (Path(index_path) / "index.faiss").exists():
            logger.info(f"Loading existing index from {index_path}")
            pipeline.load_index(index_path)
            logger.info(f"Index loaded with {len(pipeline.vector_store.texts)} documents")
        else:
            logger.warning("No existing index found - use /index endpoint to build index")
        
        logger.info("API server started successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize pipeline: {e}")
        raise


@app.get("/", response_model=Dict)
async def root():
    """Root endpoint"""
    return {
        "message": "Arabic Grammar RAG API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/chat",
            "index": "/index",
            "health": "/health"
        }
    }


@app.get("/favicon.ico")
async def favicon():
    """Favicon endpoint to prevent 404 errors"""
    return {"message": "No favicon"}


@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Pipeline not initialized")
    
    indexed = len(pipeline.vector_store.texts) > 0
    
    return HealthResponse(
        status="healthy",
        indexed=indexed,
        num_documents=len(pipeline.vector_store.texts)
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint for asking questions.
    
    Args:
        request: ChatRequest with question and options
        
    Returns:
        ChatResponse with answer and optional context
    """
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Pipeline not initialized")
    
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    if len(pipeline.vector_store.texts) == 0:
        raise HTTPException(
            status_code=400,
            detail="No documents indexed - use /index endpoint first"
        )
    
    try:
        logger.info(f"Processing question: {request.question[:50]}...")
        
        # Query pipeline
        result = pipeline.query(
            question=request.question,
            return_context=request.return_context
        )
        
        return ChatResponse(**result)
        
    except Exception as e:
        logger.error(f"Error processing question: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint using Server-Sent Events.
    
    Args:
        request: ChatRequest with question
        
    Returns:
        StreamingResponse with SSE events
    """
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Pipeline not initialized")
    
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    if len(pipeline.vector_store.texts) == 0:
        raise HTTPException(
            status_code=400,
            detail="No documents indexed - use /index endpoint first"
        )
    
    async def generate():
        has_content = False
        chunk_count = 0
        error_sent = False
        try:
            logger.info(f"Processing streaming question: {request.question[:50]}...")
            
            for chunk in pipeline.stream_query(request.question):
                # Skip empty chunks
                if not chunk:
                    continue
                has_content = True
                chunk_count += 1
                # Send each chunk as an SSE event
                data = json.dumps({"content": chunk}, ensure_ascii=False)
                yield f"data: {data}\n\n"
            
            # If streaming didn't yield any content, fall back to regular query
            if not has_content:
                logger.warning("Streaming returned no content, falling back to regular query")
                try:
                    result = pipeline.query(request.question)
                    if result and result.get('answer'):
                        data = json.dumps({"content": result['answer']}, ensure_ascii=False)
                        yield f"data: {data}\n\n"
                        has_content = True
                except Exception as fallback_error:
                    logger.error(f"Fallback query also failed: {fallback_error}")
                    # Send error only once
                    if not error_sent:
                        error_msg = "عذراً، حدث خطأ أثناء معالجة السؤال. يرجى المحاولة مرة أخرى لاحقاً."
                        error_data = json.dumps({"error": error_msg}, ensure_ascii=False)
                        yield f"data: {error_data}\n\n"
                        error_sent = True
            
            logger.info(f"Streaming complete, sent {chunk_count} chunks, has_content={has_content}")
            # Signal end of stream
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            logger.error(f"Error in streaming: {e}")
            # Always send error as error type, not content
            if not error_sent:
                error_msg = "عذراً، حدث خطأ أثناء معالجة السؤال. يرجى المحاولة مرة أخرى لاحقاً."
                error_data = json.dumps({"error": error_msg}, ensure_ascii=False)
                yield f"data: {error_data}\n\n"
                error_sent = True
            yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
            "X-Accel-Buffering": "no"
        }
    )


@app.post("/index", response_model=IndexResponse)
async def index_documents(request: IndexRequest):
    """
    Index documents endpoint.
    
    Args:
        request: IndexRequest with optional text directory
        
    Returns:
        IndexResponse with status
    """
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Pipeline not initialized")
    
    try:
        # Use provided directory or default
        text_dir = request.text_dir or config.text_clean_dir
        
        if not Path(text_dir).exists():
            raise HTTPException(
                status_code=400,
                detail=f"Text directory not found: {text_dir}"
            )
        
        logger.info(f"Indexing documents from: {text_dir}")
        
        # Index documents
        pipeline.index_documents(text_dir)
        
        # Save index
        pipeline.save_index(config.vector_store_path)
        
        num_docs = len(pipeline.vector_store.texts)
        
        logger.info(f"Indexing complete - {num_docs} documents")
        
        return IndexResponse(
            status="success",
            message=f"Successfully indexed {num_docs} documents",
            num_documents=num_docs
        )
        
    except Exception as e:
        logger.error(f"Error indexing documents: {e}")
        raise HTTPException(status_code=500, detail=f"Error indexing: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    
    # Run server
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

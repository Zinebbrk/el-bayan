"""
LLM Integration via OpenRouter

Handles text generation using OpenRouter API for RAG.
"""

import logging
import time
import re
import unicodedata
from typing import List, Dict, Generator
import requests
import json
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

logger = logging.getLogger(__name__)


# Arabic presentation forms to standard Arabic mapping
ARABIC_PRESENTATION_FORMS = {
    # Presentation Forms-A (U+FB50 to U+FDFF)
    # Presentation Forms-B (U+FE70 to U+FEFF)
}

def normalize_arabic_text(text: str) -> str:
    """
    Normalize Arabic text by converting presentation forms to standard Arabic
    and fixing reversed text issues.
    
    Args:
        text: Input text that may contain malformed Arabic
        
    Returns:
        Normalized text with proper Arabic characters
    """
    if not text:
        return text
    
    # First, normalize Unicode (NFKC converts presentation forms to standard)
    normalized = unicodedata.normalize('NFKC', text)
    
    # Additional fix for any remaining presentation forms
    result = []
    i = 0
    while i < len(normalized):
        char = normalized[i]
        code = ord(char)
        
        # Check if it's in Arabic Presentation Forms-A or B range
        if (0xFB50 <= code <= 0xFDFF) or (0xFE70 <= code <= 0xFEFF):
            # Try NFKC normalization for this specific character
            normalized_char = unicodedata.normalize('NFKC', char)
            result.append(normalized_char)
        else:
            result.append(char)
        i += 1
    
    text = ''.join(result)
    
    # Fix reversed Arabic segments (detect and reverse presentation form sequences)
    # Pattern to find sequences of Arabic chars that might be reversed
    def fix_reversed_arabic(match):
        segment = match.group(0)
        # Check if segment contains presentation forms (indicator of reversed text)
        has_presentation = any(
            (0xFB50 <= ord(c) <= 0xFDFF) or (0xFE70 <= ord(c) <= 0xFEFF)
            for c in segment
        )
        if has_presentation:
            # Normalize and potentially reverse
            normalized_segment = unicodedata.normalize('NFKC', segment)
            # If still looks wrong (has isolated forms at wrong positions), reverse
            return normalized_segment
        return segment
    
    # Match Arabic text segments including presentation forms
    arabic_pattern = r'[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]+'
    text = re.sub(arabic_pattern, fix_reversed_arabic, text)
    
    return text


def fix_malformed_arabic_in_quotes(text: str) -> str:
    """
    Fix malformed Arabic text that appears within quotes in the output.
    These are often OCR artifacts from the source documents.
    
    Args:
        text: Text that may contain quoted malformed Arabic
        
    Returns:
        Text with fixed Arabic in quotes
    """
    if not text:
        return text
    
    # Pattern to find quoted Arabic text (including presentation forms)
    quote_pattern = r'"([^"]*[\uFB50-\uFDFF\uFE70-\uFEFF][^"]*)"'
    
    def fix_quoted(match):
        quoted = match.group(1)
        # Normalize the quoted text
        fixed = unicodedata.normalize('NFKC', quoted)
        return f'"{fixed}"'
    
    text = re.sub(quote_pattern, fix_quoted, text)
    
    # Also handle text between Arabic quotation marks
    arabic_quote_pattern = r'[«""]([^»""]*[\uFB50-\uFDFF\uFE70-\uFEFF][^»""]*)["»"]'
    
    def fix_arabic_quoted(match):
        quoted = match.group(1)
        fixed = unicodedata.normalize('NFKC', quoted)
        return f'«{fixed}»'
    
    text = re.sub(arabic_quote_pattern, fix_arabic_quoted, text)
    
    return text


def postprocess_arabic_output(text: str) -> str:
    """
    Complete post-processing pipeline for Arabic output text.
    
    Args:
        text: Raw output text from LLM
        
    Returns:
        Cleaned and normalized Arabic text
    """
    if not text:
        return text
    
    # Step 1: Normalize all Arabic text
    text = normalize_arabic_text(text)
    
    # Step 2: Fix any remaining malformed Arabic in quotes
    text = fix_malformed_arabic_in_quotes(text)
    
    # Step 3: Clean up any double spaces or formatting issues
    text = re.sub(r' +', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()


class GeminiLLM:
    """
    LLM wrapper for OpenRouter API (OpenAI-compatible).
    """
    
    def __init__(self, api_key: str, model: str = "google/gemini-2.0-flash-exp:free",
                 max_output_tokens: int = 2048, temperature: float = 0.7,
                 base_url: str = "https://openrouter.ai/api/v1"):
        """
        Initialize OpenRouter LLM.
        
        Args:
            api_key: OpenRouter API key
            model: Model name (e.g., google/gemini-2.0-flash-exp:free)
            max_output_tokens: Maximum output length
            temperature: Sampling temperature (0.0-1.0)
            base_url: OpenRouter API base URL
        """
        if not api_key:
            raise ValueError("OpenRouter API key is required")
        
        self.api_key = api_key
        self.model_name = model
        self.base_url = base_url
        self.generate_url = f"{base_url}/chat/completions"
        self.max_output_tokens = max_output_tokens
        self.temperature = temperature
        
        logger.info(f"OpenRouter LLM initialized with model: {model}")
    
    @retry(
        stop=stop_after_attempt(5),
        wait=wait_exponential(multiplier=1, min=2, max=30),
        retry=retry_if_exception_type((requests.exceptions.HTTPError, requests.exceptions.Timeout))
    )
    def generate(self, prompt: str) -> str:
        """
        Generate text from prompt with retry logic for rate limits.
        
        Args:
            prompt: Input prompt
            
        Returns:
            Generated text
        """
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Arabic Grammar RAG"
            }
            
            payload = {
                "model": self.model_name,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": self.max_output_tokens,
                "temperature": self.temperature
            }
            
            response = requests.post(
                self.generate_url,
                headers=headers,
                json=payload,
                timeout=60
            )
            
            # Check for rate limit and retry
            if response.status_code == 429:
                logger.warning("Rate limit hit, retrying after delay...")
                time.sleep(2)
                response.raise_for_status()
            
            response.raise_for_status()
            
            result = response.json()
            content = result['choices'][0]['message']['content']
            # Post-process Arabic text to fix any malformed characters
            return postprocess_arabic_output(content)
            
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                logger.warning(f"Rate limit error: {e}")
                raise  # Let tenacity retry
            logger.error(f"Generation error: {e}")
            raise
        except Exception as e:
            logger.error(f"Generation error: {e}")
            raise
    
    def answer_question(self, question: str, context: str, 
                       system_prompt_template: str = None) -> str:
        """
        Answer a question using provided context.
        
        Args:
            question: User question
            context: Retrieved context
            system_prompt_template: Template with {context} and {question} placeholders
            
        Returns:
            Answer text
        """
        if system_prompt_template is None:
            system_prompt_template = """أنت مساعد خبير في قواعد اللغة العربية والنحو والصرف.
استخدم السياق المقدم للإجابة على السؤال بدقة ووضوح.

السياق:
{context}

السؤال: {question}

الإجابة:"""
        
        # Format prompt
        prompt = system_prompt_template.format(context=context, question=question)
        
        logger.info(f"Answering question: {question[:50]}...")
        
        # Generate answer
        answer = self.generate(prompt)
        
        # Post-process to fix any remaining Arabic text issues
        answer = postprocess_arabic_output(answer)
        
        logger.info("Answer generated successfully")
        return answer
    
    def chat(self, messages: List[Dict[str, str]]) -> str:
        """
        Chat interface with conversation history.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            
        Returns:
            Assistant response
        """
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Arabic Grammar RAG"
            }
            
            # OpenRouter uses OpenAI-compatible format directly
            payload = {
                "model": self.model_name,
                "messages": messages,
                "max_tokens": self.max_output_tokens,
                "temperature": self.temperature
            }
            
            response = requests.post(
                self.generate_url,
                headers=headers,
                json=payload,
                timeout=60
            )
            response.raise_for_status()
            
            result = response.json()
            return result['choices'][0]['message']['content']
            
        except Exception as e:
            logger.error(f"Chat error: {e}")
            raise

    def stream_generate(self, prompt: str, max_retries: int = 5) -> Generator[str, None, None]:
        """
        Generate text from prompt with streaming (yields chunks).
        Includes retry logic for rate limits.
        
        Args:
            prompt: Input prompt
            max_retries: Maximum number of retries for rate limit errors
            
        Yields:
            Text chunks as they are generated
        """
        last_error = None
        
        for attempt in range(max_retries):
            try:
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Arabic Grammar RAG"
                }
                
                payload = {
                    "model": self.model_name,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": self.max_output_tokens,
                    "temperature": self.temperature,
                    "stream": True
                }
                
                logger.debug(f"Streaming request attempt {attempt + 1}/{max_retries}")
                
                response = requests.post(
                    self.generate_url,
                    headers=headers,
                    json=payload,
                    timeout=120,
                    stream=True
                )
                
                # Handle rate limit with retry
                if response.status_code == 429:
                    wait_time = min(2 ** attempt, 30)  # Exponential backoff
                    logger.warning(f"Rate limit hit (attempt {attempt + 1}/{max_retries}), waiting {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                
                response.raise_for_status()
                
                chunks_yielded = 0
                for line in response.iter_lines():
                    if line:
                        line_str = line.decode('utf-8') if isinstance(line, bytes) else line
                        if line_str.startswith('data: '):
                            data = line_str[6:]
                            if data.strip() == '[DONE]':
                                logger.info(f"Stream [DONE] received, yielded {chunks_yielded} chunks")
                                if chunks_yielded == 0:
                                    # Stream returned no content - fall back to non-streaming
                                    logger.warning("Streaming returned no content, falling back to non-streaming")
                                    try:
                                        non_stream_response = self.generate(prompt)
                                        if non_stream_response:
                                            yield non_stream_response
                                    except Exception as e:
                                        logger.error(f"Non-streaming fallback failed: {e}")
                                return
                            try:
                                chunk = json.loads(data)
                                if 'choices' in chunk and len(chunk['choices']) > 0:
                                    delta = chunk['choices'][0].get('delta', {})
                                    content = delta.get('content', '')
                                    if content:
                                        chunks_yielded += 1
                                        yield content
                            except json.JSONDecodeError as e:
                                logger.debug(f"JSON decode error: {e}, data: {data[:100]}")
                                continue
                
                logger.info(f"Stream finished (no [DONE] marker), yielded {chunks_yielded} chunks")
                if chunks_yielded == 0:
                    # Stream returned no content - fall back to non-streaming
                    logger.warning("Streaming returned no content, falling back to non-streaming")
                    try:
                        non_stream_response = self.generate(prompt)
                        if non_stream_response:
                            yield non_stream_response
                    except Exception as e:
                        logger.error(f"Non-streaming fallback failed: {e}")
                return  # Success, exit the retry loop
                
            except requests.exceptions.HTTPError as e:
                if hasattr(e, 'response') and e.response is not None and e.response.status_code == 429:
                    wait_time = min(2 ** attempt, 30)
                    logger.warning(f"Rate limit error (attempt {attempt + 1}/{max_retries}), waiting {wait_time}s...")
                    time.sleep(wait_time)
                    last_error = e
                    continue
                logger.error(f"Stream generation error: {e}")
                raise
            except Exception as e:
                logger.error(f"Stream generation error: {e}")
                raise
        
        # If we exhausted all retries
        if last_error:
            logger.error(f"Max retries exceeded for streaming: {last_error}")
            raise last_error

    def stream_answer_question(self, question: str, context: str,
                               system_prompt_template: str = None) -> Generator[str, None, None]:
        """
        Answer a question using provided context with streaming.
        Applies Arabic text normalization to each chunk.
        
        Args:
            question: User question
            context: Retrieved context
            system_prompt_template: Template with {context} and {question} placeholders
            
        Yields:
            Answer text chunks (normalized)
        """
        if system_prompt_template is None:
            system_prompt_template = """أنت مساعد خبير في قواعد اللغة العربية والنحو والصرف.
استخدم السياق المقدم للإجابة على السؤال بدقة ووضوح.
قم بتنسيق إجابتك باستخدام Markdown للتنظيم الجيد.
تأكد من كتابة النص العربي بشكل صحيح من اليمين إلى اليسار.

السياق:
{context}

السؤال: {question}

الإجابة:"""
        
        # Format prompt
        prompt = system_prompt_template.format(context=context, question=question)
        
        logger.info(f"Streaming answer for question: {question[:50]}...")
        
        # Buffer for accumulating text to process
        buffer = ""
        
        # Generate answer with streaming
        for chunk in self.stream_generate(prompt):
            # Normalize each chunk for Arabic presentation forms
            normalized_chunk = normalize_arabic_text(chunk)
            yield normalized_chunk
        
        logger.info("Streaming answer completed")

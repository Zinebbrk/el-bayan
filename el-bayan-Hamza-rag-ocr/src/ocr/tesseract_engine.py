"""
Tesseract OCR engine wrapper for Arabic text recognition.

This module provides a clean interface to Tesseract OCR for extracting
Arabic text from preprocessed images.
"""

import logging
import pytesseract
import numpy as np
from pathlib import Path
from typing import Optional, Dict, Any
from PIL import Image

from src.config import TESSERACT_PATH, LANG, OEM, PSM

logger = logging.getLogger(__name__)


class TesseractEngine:
    """
    Wrapper class for Tesseract OCR engine.
    
    Provides methods to perform OCR on images with configurable parameters
    optimized for Arabic text recognition.
    """
    
    def __init__(self, tesseract_path: str = TESSERACT_PATH, lang: str = LANG,
                 oem: int = OEM, psm: int = PSM):
        """
        Initialize the Tesseract OCR engine.
        
        Args:
            tesseract_path: Path to Tesseract executable
            lang: Language code for OCR (default: 'ara' for Arabic)
            oem: OCR Engine Mode (0-3, default from config)
            psm: Page Segmentation Mode (0-13, default from config)
        """
        self.tesseract_path = tesseract_path
        self.lang = lang
        self.oem = oem
        self.psm = psm
        
        # Set Tesseract command path
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
        
        logger.info(f"TesseractEngine initialized")
        logger.info(f"  Path: {tesseract_path}")
        logger.info(f"  Language: {lang}")
        logger.info(f"  OEM: {oem}, PSM: {psm}")
        
        # Verify Tesseract installation
        self._verify_installation()
    
    def _verify_installation(self) -> bool:
        """
        Verify that Tesseract is properly installed and accessible.
        
        Returns:
            True if Tesseract is working, False otherwise
            
        Raises:
            RuntimeError: If Tesseract is not found or not working
        """
        try:
            version = pytesseract.get_tesseract_version()
            logger.info(f"Tesseract version: {version}")
            
            # Check if Arabic language data is available
            available_langs = pytesseract.get_languages()
            if self.lang not in available_langs:
                logger.error(f"Arabic language data '{self.lang}' not found!")
                logger.error(f"Available languages: {', '.join(available_langs)}")
                logger.error("Please install Arabic language data:")
                logger.error("  Ubuntu/Debian: sudo apt-get install tesseract-ocr-ara")
                logger.error("  macOS: brew install tesseract-lang")
                raise RuntimeError(f"Arabic language data '{self.lang}' not installed")
            
            logger.info(f"Arabic language data '{self.lang}' is available")
            return True
            
        except pytesseract.TesseractNotFoundError:
            logger.error(f"Tesseract not found at: {self.tesseract_path}")
            logger.error("Please install Tesseract OCR:")
            logger.error("  Ubuntu/Debian: sudo apt-get install tesseract-ocr")
            logger.error("  macOS: brew install tesseract")
            logger.error("  Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki")
            raise RuntimeError("Tesseract OCR not found")
        
        except Exception as e:
            logger.error(f"Error verifying Tesseract installation: {e}")
            raise
    
    def extract_text(self, image: np.ndarray, custom_config: Optional[str] = None) -> str:
        """
        Extract text from an image using Tesseract OCR.
        
        Args:
            image: Input image as numpy array (preprocessed)
            custom_config: Custom Tesseract configuration string (optional)
            
        Returns:
            Extracted text as UTF-8 string
        """
        try:
            # Build Tesseract configuration
            if custom_config is None:
                config = f"--oem {self.oem} --psm {self.psm}"
            else:
                config = custom_config
            
            logger.debug(f"Running OCR with config: {config}")
            
            # Convert numpy array to PIL Image if needed
            if isinstance(image, np.ndarray):
                image = Image.fromarray(image)
            
            # Perform OCR
            text = pytesseract.image_to_string(
                image,
                lang=self.lang,
                config=config
            )
            
            # Log result
            char_count = len(text)
            line_count = len(text.splitlines())
            logger.debug(f"Extracted {char_count} characters, {line_count} lines")
            
            return text
            
        except Exception as e:
            logger.error(f"Error during OCR: {e}")
            raise
    
    def extract_text_from_file(self, image_path: Path, 
                              custom_config: Optional[str] = None) -> str:
        """
        Extract text from an image file.
        
        Args:
            image_path: Path to image file
            custom_config: Custom Tesseract configuration string (optional)
            
        Returns:
            Extracted text as UTF-8 string
            
        Raises:
            FileNotFoundError: If image file doesn't exist
        """
        if not Path(image_path).exists():
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        logger.info(f"Processing image: {image_path}")
        
        try:
            # Load image
            image = Image.open(image_path)
            
            # Extract text
            text = self.extract_text(image, custom_config)
            
            return text
            
        except Exception as e:
            logger.error(f"Error processing {image_path}: {e}")
            raise
    
    def extract_with_confidence(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Extract text along with confidence scores.
        
        Args:
            image: Input image as numpy array
            
        Returns:
            Dictionary containing text and confidence information
        """
        try:
            # Convert numpy array to PIL Image if needed
            if isinstance(image, np.ndarray):
                image = Image.fromarray(image)
            
            # Get detailed OCR data
            data = pytesseract.image_to_data(
                image,
                lang=self.lang,
                config=f"--oem {self.oem} --psm {self.psm}",
                output_type=pytesseract.Output.DICT
            )
            
            # Extract text
            text = pytesseract.image_to_string(
                image,
                lang=self.lang,
                config=f"--oem {self.oem} --psm {self.psm}"
            )
            
            # Calculate average confidence (filter out -1 values)
            confidences = [conf for conf in data['conf'] if conf != -1]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            logger.info(f"Average confidence: {avg_confidence:.2f}%")
            
            return {
                'text': text,
                'confidence': avg_confidence,
                'word_count': len([w for w in data['text'] if w.strip()]),
                'data': data
            }
            
        except Exception as e:
            logger.error(f"Error extracting text with confidence: {e}")
            raise
    
    def extract_text_batch(self, images: list, show_progress: bool = True) -> list:
        """
        Extract text from multiple images in batch.
        
        Args:
            images: List of images (numpy arrays or PIL Images)
            show_progress: Whether to show progress information
            
        Returns:
            List of extracted text strings
        """
        texts = []
        total = len(images)
        
        for i, image in enumerate(images, 1):
            try:
                if show_progress:
                    logger.info(f"Processing image {i}/{total}")
                
                text = self.extract_text(image)
                texts.append(text)
                
            except Exception as e:
                logger.error(f"Error processing image {i}: {e}")
                texts.append("")  # Add empty string on failure
        
        logger.info(f"Batch OCR completed: {len(texts)}/{total} images processed")
        return texts
    
    def set_language(self, lang: str) -> None:
        """
        Change the OCR language.
        
        Args:
            lang: Language code (e.g., 'ara', 'eng', 'fra')
        """
        self.lang = lang
        logger.info(f"Language changed to: {lang}")
    
    def set_page_segmentation_mode(self, psm: int) -> None:
        """
        Change the page segmentation mode.
        
        Args:
            psm: Page Segmentation Mode (0-13)
        """
        if 0 <= psm <= 13:
            self.psm = psm
            logger.info(f"PSM changed to: {psm}")
        else:
            logger.warning(f"Invalid PSM value: {psm}. Must be 0-13.")
    
    def get_available_languages(self) -> list:
        """
        Get list of available Tesseract languages.
        
        Returns:
            List of language codes
        """
        try:
            langs = pytesseract.get_languages()
            logger.info(f"Available languages: {', '.join(langs)}")
            return langs
        except Exception as e:
            logger.error(f"Error getting available languages: {e}")
            return []


def extract_text_from_image(image: np.ndarray, lang: str = LANG) -> str:
    """
    Convenience function to extract text from an image.
    
    Args:
        image: Input image as numpy array
        lang: Language code (default: from config)
        
    Returns:
        Extracted text as string
    """
    engine = TesseractEngine(lang=lang)
    return engine.extract_text(image)


# Example usage
if __name__ == "__main__":
    # Configure logging for testing
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Example: Extract text from an image
    # engine = TesseractEngine()
    # text = engine.extract_text_from_file("data/images/example/page_001.png")
    # print(f"Extracted text:\n{text}")

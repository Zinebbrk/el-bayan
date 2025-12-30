"""
Arabic text normalizer and cleaner.

This module provides comprehensive Arabic text cleaning and normalization,
including tashkeel removal, character normalization, non-Arabic character
removal, and text reshaping for proper display.
"""

import re
import logging
from typing import Optional
import unicodedata

try:
    import arabic_reshaper
    from bidi.algorithm import get_display
    RESHAPING_AVAILABLE = True
except ImportError:
    RESHAPING_AVAILABLE = False
    logging.warning("arabic_reshaper or python-bidi not available. Text reshaping disabled.")

from src.config import TASHKEEL, CLEANING_CONFIG

logger = logging.getLogger(__name__)


class ArabicNormalizer:
    """
    Handles Arabic text cleaning and normalization.
    
    Provides methods to remove diacritics, normalize characters, remove
    non-Arabic text, and reshape text for proper bidirectional display.
    """
    
    def __init__(self, config: dict = None):
        """
        Initialize the Arabic text normalizer.
        
        Args:
            config: Configuration dictionary for cleaning parameters
                   (default: use CLEANING_CONFIG from config.py)
        """
        self.config = config if config is not None else CLEANING_CONFIG
        self.tashkeel = TASHKEEL
        logger.info("ArabicNormalizer initialized")
        logger.debug(f"Configuration: {self.config}")
        
        if self.config.get("apply_reshaping", True) and not RESHAPING_AVAILABLE:
            logger.warning("Reshaping requested but libraries not available")
    
    def normalize(self, text: str) -> str:
        """
        Apply full normalization pipeline to Arabic text.
        
        Args:
            text: Input Arabic text (raw OCR output)
            
        Returns:
            Cleaned and normalized Arabic text
        """
        if not text or not text.strip():
            return ""
        
        logger.debug("Starting text normalization")
        
        # Step 1: Remove tashkeel (diacritics)
        if self.config.get("remove_tashkeel", True):
            text = self.remove_tashkeel(text)
        
        # Step 2: Normalize Arabic characters
        if self.config.get("normalize_alef", True):
            text = self.normalize_alef(text)
        
        if self.config.get("normalize_teh_marbuta", True):
            text = self.normalize_teh_marbuta(text)
        
        if self.config.get("normalize_hamza", True):
            text = self.normalize_hamza(text)
        
        # Step 3: Remove non-Arabic characters
        if self.config.get("remove_non_arabic", True):
            text = self.remove_non_arabic(text)
        
        # Step 4: Clean up spaces
        if self.config.get("collapse_spaces", True):
            text = self.collapse_spaces(text)
        
        # Step 5: Apply reshaping (for proper display)
        if self.config.get("apply_reshaping", True) and RESHAPING_AVAILABLE:
            text = self.reshape_text(text)
        
        logger.debug("Text normalization completed")
        return text
    
    def remove_tashkeel(self, text: str) -> str:
        """
        Remove all Arabic diacritical marks (tashkeel).
        
        Tashkeel includes fatha, damma, kasra, sukun, shadda, tanween, etc.
        
        Args:
            text: Input text with diacritics
            
        Returns:
            Text without diacritics
        """
        for mark in self.tashkeel:
            text = text.replace(mark, '')
        
        logger.debug("Removed tashkeel")
        return text
    
    def normalize_alef(self, text: str) -> str:
        """
        Normalize different forms of Alef to a single form.
        
        Converts: آ أ إ ٱ → ا
        
        Args:
            text: Input text
            
        Returns:
            Text with normalized Alef
        """
        # Alef variants
        alef_variants = ['آ', 'أ', 'إ', 'ٱ']
        
        for variant in alef_variants:
            text = text.replace(variant, 'ا')
        
        logger.debug("Normalized Alef")
        return text
    
    def normalize_teh_marbuta(self, text: str) -> str:
        """
        Normalize Teh Marbuta to Heh.
        
        Converts: ة → ه
        
        Args:
            text: Input text
            
        Returns:
            Text with normalized Teh Marbuta
        """
        text = text.replace('ة', 'ه')
        logger.debug("Normalized Teh Marbuta")
        return text
    
    def normalize_hamza(self, text: str) -> str:
        """
        Normalize different forms of Hamza.
        
        Converts various Hamza forms to a consistent representation.
        
        Args:
            text: Input text
            
        Returns:
            Text with normalized Hamza
        """
        # Normalize Hamza on different carriers
        text = text.replace('ؤ', 'و')  # Hamza on Waw → Waw
        text = text.replace('ئ', 'ي')  # Hamza on Ya → Ya
        
        # Standalone Hamza variants
        text = text.replace('ء', '')  # Remove standalone Hamza (optional)
        
        logger.debug("Normalized Hamza")
        return text
    
    def normalize_yeh(self, text: str) -> str:
        """
        Normalize different forms of Yeh.
        
        Converts: ى → ي
        
        Args:
            text: Input text
            
        Returns:
            Text with normalized Yeh
        """
        text = text.replace('ى', 'ي')  # Alef Maksura → Ya
        logger.debug("Normalized Yeh")
        return text
    
    def remove_non_arabic(self, text: str) -> str:
        """
        Remove all non-Arabic characters except spaces and basic punctuation.
        
        Keeps: Arabic letters, spaces, Arabic punctuation, digits
        Removes: Latin characters, special symbols, etc.
        
        Args:
            text: Input text
            
        Returns:
            Text with only Arabic content
        """
        # Define Arabic character ranges and allowed punctuation
        # Arabic letters: \u0600-\u06FF (Arabic block)
        # Arabic Supplement: \u0750-\u077F
        # Arabic Extended-A: \u08A0-\u08FF
        # Arabic Presentation Forms: \uFB50-\uFDFF, \uFE70-\uFEFF
        # Also keep: spaces, newlines, Arabic punctuation, digits
        
        pattern = r'[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9\s\n\r،؛؟.!،]'
        text = re.sub(pattern, '', text)
        
        logger.debug("Removed non-Arabic characters")
        return text
    
    def collapse_spaces(self, text: str) -> str:
        """
        Collapse multiple consecutive spaces into a single space.
        
        Also removes leading/trailing whitespace from each line.
        
        Args:
            text: Input text
            
        Returns:
            Text with normalized spacing
        """
        # Replace multiple spaces with single space
        text = re.sub(r' +', ' ', text)
        
        # Replace multiple newlines with double newline (paragraph break)
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
        
        # Strip spaces from each line
        lines = [line.strip() for line in text.split('\n')]
        text = '\n'.join(lines)
        
        # Final trim
        text = text.strip()
        
        logger.debug("Collapsed spaces")
        return text
    
    def reshape_text(self, text: str) -> str:
        """
        Reshape Arabic text for proper bidirectional display.
        
        This is essential for correctly displaying Arabic text in systems
        that don't natively support RTL (right-to-left) rendering.
        
        Args:
            text: Input Arabic text
            
        Returns:
            Reshaped text suitable for display
        """
        if not RESHAPING_AVAILABLE:
            logger.warning("Reshaping libraries not available, returning original text")
            return text
        
        try:
            # Reshape Arabic text (handles character connections)
            reshaped_text = arabic_reshaper.reshape(text)
            
            # Apply bidirectional algorithm
            if self.config.get("apply_bidi", True):
                display_text = get_display(reshaped_text)
            else:
                display_text = reshaped_text
            
            logger.debug("Reshaped text for display")
            return display_text
            
        except Exception as e:
            logger.error(f"Error reshaping text: {e}")
            return text
    
    def remove_extra_punctuation(self, text: str) -> str:
        """
        Remove excessive punctuation marks.
        
        Args:
            text: Input text
            
        Returns:
            Text with normalized punctuation
        """
        # Remove multiple consecutive punctuation marks
        text = re.sub(r'([،؛؟.!])\1+', r'\1', text)
        logger.debug("Removed extra punctuation")
        return text
    
    def normalize_numbers(self, text: str, to_eastern: bool = False) -> str:
        """
        Normalize numbers between Eastern Arabic (٠-٩) and Western (0-9).
        
        Args:
            text: Input text
            to_eastern: If True, convert to Eastern Arabic; if False, convert to Western
            
        Returns:
            Text with normalized numbers
        """
        if to_eastern:
            # Convert Western to Eastern Arabic numerals
            translation = str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩')
            text = text.translate(translation)
            logger.debug("Converted to Eastern Arabic numerals")
        else:
            # Convert Eastern to Western Arabic numerals
            translation = str.maketrans('٠١٢٣٤٥٦٧٨٩', '0123456789')
            text = text.translate(translation)
            logger.debug("Converted to Western Arabic numerals")
        
        return text
    
    def get_text_statistics(self, text: str) -> dict:
        """
        Get statistics about the text.
        
        Args:
            text: Input text
            
        Returns:
            Dictionary with text statistics
        """
        stats = {
            'total_chars': len(text),
            'chars_without_spaces': len(text.replace(' ', '').replace('\n', '')),
            'words': len(text.split()),
            'lines': len(text.splitlines()),
            'arabic_chars': len(re.findall(r'[\u0600-\u06FF]', text)),
            'digits': len(re.findall(r'\d', text)),
            'punctuation': len(re.findall(r'[،؛؟.!]', text)),
        }
        
        logger.info(f"Text statistics: {stats}")
        return stats


def normalize_arabic_text(text: str, config: dict = None) -> str:
    """
    Convenience function to normalize Arabic text.
    
    Args:
        text: Input Arabic text
        config: Configuration dictionary (optional)
        
    Returns:
        Normalized text
    """
    normalizer = ArabicNormalizer(config)
    return normalizer.normalize(text)


# Example usage
if __name__ == "__main__":
    # Configure logging for testing
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Example: Normalize some Arabic text
    # normalizer = ArabicNormalizer()
    # raw_text = "مَثَالٌ عَلَى النَّصِّ العَرَبِيِّ"  # Example with diacritics
    # clean_text = normalizer.normalize(raw_text)
    # print(f"Original: {raw_text}")
    # print(f"Cleaned: {clean_text}")

"""
Complete OCR pipeline orchestrator.

This module coordinates all OCR system components (PDF conversion, preprocessing,
OCR, and text cleaning) into a unified pipeline for processing Arabic grammar books.
"""

import logging
import time
from pathlib import Path
from typing import Optional, List, Tuple
from tqdm import tqdm

from src.config import (
    PDF_DIR, IMG_DIR, TEXT_RAW_DIR, TEXT_CLEAN_DIR,
    get_image_dir, get_raw_text_path, get_clean_text_path,
    SAVE_PREPROCESSED_IMAGES, OVERWRITE_EXISTING
)
from src.pdf.pdf_to_images import PDFToImagesConverter
from src.preprocess.image_preprocess import ImagePreprocessor
from src.ocr.tesseract_engine import TesseractEngine
from src.cleaning.arabic_normalizer import ArabicNormalizer
from src.utils.file_utils import (
    ensure_dir_exists, list_images_sorted, write_text_file,
    get_filename_without_extension, file_exists, validate_pdf_path,
    format_file_size, get_file_size
)

logger = logging.getLogger(__name__)


class OCRPipeline:
    """
    Complete OCR pipeline for processing Arabic PDF documents.
    
    This class orchestrates the entire OCR workflow:
    1. Convert PDF to images
    2. Preprocess images for better OCR
    3. Extract text using Tesseract
    4. Clean and normalize Arabic text
    5. Save raw and cleaned text outputs
    """
    
    def __init__(self, save_preprocessed: bool = SAVE_PREPROCESSED_IMAGES,
                 overwrite: bool = OVERWRITE_EXISTING):
        """
        Initialize the OCR pipeline with all necessary components.
        
        Args:
            save_preprocessed: Whether to save preprocessed images
            overwrite: Whether to overwrite existing output files
        """
        self.save_preprocessed = save_preprocessed
        self.overwrite = overwrite
        
        # Initialize pipeline components
        logger.info("Initializing OCR pipeline components...")
        
        self.pdf_converter = PDFToImagesConverter()
        self.preprocessor = ImagePreprocessor()
        self.ocr_engine = TesseractEngine()
        self.normalizer = ArabicNormalizer()
        
        logger.info("OCR pipeline initialized successfully")
    
    def process_pdf(self, pdf_path: Path, pdf_name: Optional[str] = None) -> Tuple[Path, Path]:
        """
        Process a complete PDF document through the OCR pipeline.
        
        Args:
            pdf_path: Path to the PDF file
            pdf_name: Custom name for output (default: use PDF filename)
            
        Returns:
            Tuple of (raw_text_path, clean_text_path)
            
        Raises:
            FileNotFoundError: If PDF file doesn't exist
        """
        # Validate PDF
        if not validate_pdf_path(pdf_path):
            raise FileNotFoundError(f"Invalid PDF: {pdf_path}")
        
        # Determine PDF name
        if pdf_name is None:
            pdf_name = get_filename_without_extension(pdf_path)
        
        logger.info("=" * 70)
        logger.info(f"Starting OCR pipeline for: {pdf_name}")
        logger.info(f"PDF path: {pdf_path}")
        logger.info(f"PDF size: {format_file_size(get_file_size(pdf_path))}")
        logger.info("=" * 70)
        
        start_time = time.time()
        
        # Define output paths
        image_dir = get_image_dir(pdf_name)
        raw_text_path = get_raw_text_path(pdf_name)
        clean_text_path = get_clean_text_path(pdf_name)
        
        # Check if output already exists
        if not self.overwrite and file_exists(clean_text_path):
            logger.warning(f"Output already exists: {clean_text_path}")
            logger.warning("Skipping processing (set overwrite=True to force)")
            return raw_text_path, clean_text_path
        
        try:
            # Step 1: Convert PDF to images
            logger.info("\n[1/4] Converting PDF to images...")
            image_paths = self._convert_pdf_to_images(pdf_path, image_dir, pdf_name)
            logger.info(f"✓ Generated {len(image_paths)} images")
            
            # Step 2: Preprocess images and perform OCR
            logger.info("\n[2/4] Preprocessing images and extracting text...")
            raw_text = self._extract_text_from_images(image_paths)
            logger.info(f"✓ Extracted {len(raw_text)} characters (raw)")
            
            # Step 3: Save raw text
            logger.info("\n[3/4] Saving raw text...")
            self._save_raw_text(raw_text, raw_text_path)
            logger.info(f"✓ Raw text saved: {raw_text_path}")
            
            # Step 4: Clean and normalize text
            logger.info("\n[4/4] Cleaning and normalizing text...")
            clean_text = self._clean_text(raw_text)
            self._save_clean_text(clean_text, clean_text_path)
            logger.info(f"✓ Clean text saved: {clean_text_path}")
            
            # Log statistics
            elapsed_time = time.time() - start_time
            self._log_completion_stats(pdf_name, len(image_paths), raw_text, 
                                       clean_text, elapsed_time)
            
            return raw_text_path, clean_text_path
            
        except Exception as e:
            logger.error(f"Pipeline failed for {pdf_name}: {e}")
            raise
    
    def _convert_pdf_to_images(self, pdf_path: Path, image_dir: Path, 
                              pdf_name: str) -> List[Path]:
        """
        Convert PDF to images.
        
        Args:
            pdf_path: Path to PDF file
            image_dir: Output directory for images
            pdf_name: PDF name for logging
            
        Returns:
            List of image file paths
        """
        try:
            image_paths = self.pdf_converter.convert(pdf_path, image_dir, pdf_name)
            return image_paths
        except Exception as e:
            logger.error(f"PDF to images conversion failed: {e}")
            raise
    
    def _extract_text_from_images(self, image_paths: List[Path]) -> str:
        """
        Preprocess images and extract text using OCR.
        
        Args:
            image_paths: List of paths to image files
            
        Returns:
            Concatenated raw text from all pages
        """
        import cv2
        import gc
        
        all_text = []
        total_pages = len(image_paths)
        
        logger.info(f"Processing {total_pages} pages...")
        
        # Process each image with progress bar
        for i, image_path in enumerate(tqdm(image_paths, desc="OCR Progress"), 1):
            try:
                # Load and preprocess image
                image = cv2.imread(str(image_path))
                
                if image is None:
                    logger.error(f"Failed to load image: {image_path}")
                    continue
                
                # Resize very large images to prevent memory issues
                max_dimension = 4000
                height, width = image.shape[:2]
                if height > max_dimension or width > max_dimension:
                    scale = max_dimension / max(height, width)
                    new_width = int(width * scale)
                    new_height = int(height * scale)
                    image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
                    logger.info(f"Resized large image from {width}x{height} to {new_width}x{new_height}")
                
                # Preprocess
                preprocessed = self.preprocessor.preprocess(image)
                
                # Clear original image from memory
                del image
                
                # Save preprocessed image if requested
                if self.save_preprocessed:
                    preprocessed_path = image_path.parent / f"{image_path.stem}_preprocessed.png"
                    cv2.imwrite(str(preprocessed_path), preprocessed)
                
                # Extract text
                page_text = self.ocr_engine.extract_text(preprocessed)
                
                # Clear preprocessed image from memory
                del preprocessed
                
                # Add page separator
                all_text.append(f"\n{'='*50}\n")
                all_text.append(f"PAGE {i}\n")
                all_text.append(f"{'='*50}\n")
                all_text.append(page_text)
                all_text.append("\n")
                
                logger.debug(f"Page {i}/{total_pages}: {len(page_text)} characters extracted")
                
                # Force garbage collection every 10 pages
                if i % 10 == 0:
                    gc.collect()
                    logger.debug(f"Memory cleanup at page {i}")
                
            except Exception as e:
                logger.error(f"Error processing page {i}: {e}")
                # Clean up on error
                gc.collect()
                continue
        
        # Final cleanup
        gc.collect()
        
        # Combine all text
        combined_text = "".join(all_text)
        return combined_text
    
    def _clean_text(self, raw_text: str) -> str:
        """
        Clean and normalize raw OCR text.
        
        Args:
            raw_text: Raw text from OCR
            
        Returns:
            Cleaned and normalized text
        """
        try:
            clean_text = self.normalizer.normalize(raw_text)
            
            # Get statistics
            stats = self.normalizer.get_text_statistics(clean_text)
            logger.info(f"Text stats: {stats['words']} words, "
                       f"{stats['arabic_chars']} Arabic chars")
            
            return clean_text
            
        except Exception as e:
            logger.error(f"Text cleaning failed: {e}")
            return raw_text  # Return raw text on failure
    
    def _save_raw_text(self, text: str, output_path: Path) -> None:
        """
        Save raw OCR text to file.
        
        Args:
            text: Raw text to save
            output_path: Output file path
        """
        success = write_text_file(output_path, text, encoding='utf-8')
        if not success:
            raise IOError(f"Failed to save raw text to {output_path}")
    
    def _save_clean_text(self, text: str, output_path: Path) -> None:
        """
        Save cleaned text to file.
        
        Args:
            text: Clean text to save
            output_path: Output file path
        """
        success = write_text_file(output_path, text, encoding='utf-8')
        if not success:
            raise IOError(f"Failed to save clean text to {output_path}")
    
    def _log_completion_stats(self, pdf_name: str, page_count: int,
                             raw_text: str, clean_text: str, 
                             elapsed_time: float) -> None:
        """
        Log completion statistics.
        
        Args:
            pdf_name: Name of processed PDF
            page_count: Number of pages processed
            raw_text: Raw extracted text
            clean_text: Cleaned text
            elapsed_time: Processing time in seconds
        """
        logger.info("\n" + "=" * 70)
        logger.info("OCR PIPELINE COMPLETED SUCCESSFULLY")
        logger.info("=" * 70)
        logger.info(f"Document: {pdf_name}")
        logger.info(f"Pages processed: {page_count}")
        logger.info(f"Raw text length: {len(raw_text):,} characters")
        logger.info(f"Clean text length: {len(clean_text):,} characters")
        logger.info(f"Processing time: {elapsed_time:.2f} seconds")
        logger.info(f"Average time per page: {elapsed_time/page_count:.2f} seconds")
        logger.info("=" * 70 + "\n")
    
    def process_directory(self, pdf_dir: Path = PDF_DIR) -> List[Tuple[str, Path, Path]]:
        """
        Process all PDFs in a directory.
        
        Args:
            pdf_dir: Directory containing PDF files
            
        Returns:
            List of tuples: (pdf_name, raw_text_path, clean_text_path)
        """
        from src.utils.file_utils import get_pdf_files
        
        pdf_files = get_pdf_files(pdf_dir)
        
        if not pdf_files:
            logger.warning(f"No PDF files found in {pdf_dir}")
            return []
        
        logger.info(f"Found {len(pdf_files)} PDF files to process")
        
        results = []
        
        for i, pdf_path in enumerate(pdf_files, 1):
            pdf_name = get_filename_without_extension(pdf_path)
            logger.info(f"\n{'#'*70}")
            logger.info(f"Processing PDF {i}/{len(pdf_files)}: {pdf_name}")
            logger.info(f"{'#'*70}\n")
            
            try:
                raw_path, clean_path = self.process_pdf(pdf_path)
                results.append((pdf_name, raw_path, clean_path))
                logger.info(f"✓ Successfully processed: {pdf_name}\n")
                
            except Exception as e:
                logger.error(f"✗ Failed to process {pdf_name}: {e}\n")
                continue
        
        logger.info(f"\n{'='*70}")
        logger.info(f"BATCH PROCESSING COMPLETE")
        logger.info(f"Successfully processed: {len(results)}/{len(pdf_files)} PDFs")
        logger.info(f"{'='*70}\n")
        
        return results


# Example usage
if __name__ == "__main__":
    # Configure logging for testing
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Example: Process a single PDF
    # pipeline = OCRPipeline()
    # pdf_file = Path("data/raw_pdfs/example.pdf")
    # raw_path, clean_path = pipeline.process_pdf(pdf_file)
    # print(f"Raw text: {raw_path}")
    # print(f"Clean text: {clean_path}")

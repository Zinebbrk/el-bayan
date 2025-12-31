#!/usr/bin/env python3
"""
Robust OCR runner that processes PDFs with checkpointing and recovery.
Handles memory issues and can resume from where it left off.
"""

import sys
import logging
import time
from pathlib import Path
import gc

sys.path.insert(0, str(Path(__file__).parent))

from src.config import PDF_DIR, TEXT_RAW_DIR, TEXT_CLEAN_DIR, validate_config
from src.pdf.pdf_to_images import PDFToImagesConverter
from src.preprocess.image_preprocess import ImagePreprocessor
from src.ocr.tesseract_engine import TesseractEngine
from src.cleaning.arabic_normalizer import ArabicNormalizer
from src.utils.file_utils import (
    ensure_dir_exists, get_pdf_files, get_filename_without_extension,
    write_text_file, list_images_sorted
)
import cv2

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ocr_robust.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


def process_single_page(image_path, preprocessor, ocr_engine, page_num):
    """Process a single page and return text."""
    try:
        # Load image
        image = cv2.imread(str(image_path))
        if image is None:
            logger.error(f"Failed to load: {image_path}")
            return ""
        
        # Resize if too large
        height, width = image.shape[:2]
        max_dim = 3500  # Reduced from 4000 for more stability
        if height > max_dim or width > max_dim:
            scale = max_dim / max(height, width)
            new_w, new_h = int(width * scale), int(height * scale)
            image = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
            logger.info(f"Page {page_num}: Resized {width}x{height} -> {new_w}x{new_h}")
        
        # Preprocess
        preprocessed = preprocessor.preprocess(image)
        del image
        
        # OCR
        text = ocr_engine.extract_text(preprocessed)
        del preprocessed
        
        # Force cleanup
        gc.collect()
        
        return text
        
    except Exception as e:
        logger.error(f"Error on page {page_num}: {e}")
        gc.collect()
        return ""


def process_pdf_robust(pdf_path, output_raw, output_clean):
    """Process a PDF with robust error handling and checkpointing."""
    
    pdf_name = get_filename_without_extension(pdf_path)
    image_dir = PDF_DIR.parent / "images" / pdf_name
    
    logger.info(f"\n{'='*70}")
    logger.info(f"Processing: {pdf_name}")
    logger.info(f"{'='*70}")
    
    # Check if already processed
    if output_clean.exists():
        logger.info(f"Already processed: {pdf_name}")
        return True
    
    try:
        # Step 1: Convert PDF to images
        logger.info("Step 1/4: Converting PDF to images...")
        converter = PDFToImagesConverter(dpi=300)  # Lower DPI for stability
        image_paths = converter.convert(pdf_path, image_dir, pdf_name)
        logger.info(f"Generated {len(image_paths)} images")
        
        # Step 2: Process images page by page
        logger.info("Step 2/4: Processing pages with OCR...")
        preprocessor = ImagePreprocessor()
        ocr_engine = TesseractEngine()
        
        # Write raw text incrementally
        with open(output_raw, 'w', encoding='utf-8') as f:
            for i, img_path in enumerate(image_paths, 1):
                logger.info(f"Processing page {i}/{len(image_paths)}...")
                
                # Write page header
                f.write(f"\n{'='*50}\n")
                f.write(f"PAGE {i}\n")
                f.write(f"{'='*50}\n")
                
                # Process page
                page_text = process_single_page(img_path, preprocessor, ocr_engine, i)
                f.write(page_text)
                f.write("\n")
                f.flush()  # Force write to disk
                
                # Pause briefly to let system recover
                if i % 5 == 0:
                    time.sleep(1)
                    gc.collect()
        
        logger.info(f"Raw text saved: {output_raw}")
        
        # Step 3: Clean text
        logger.info("Step 3/4: Cleaning text...")
        with open(output_raw, 'r', encoding='utf-8') as f:
            raw_text = f.read()
        
        normalizer = ArabicNormalizer()
        clean_text = normalizer.normalize(raw_text)
        
        # Step 4: Save clean text
        with open(output_clean, 'w', encoding='utf-8') as f:
            f.write(clean_text)
        
        logger.info(f"Clean text saved: {output_clean}")
        logger.info(f"✓ Completed: {pdf_name}\n")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to process {pdf_name}: {e}")
        return False
    finally:
        # Cleanup
        gc.collect()


def main():
    """Main runner."""
    logger.info("="*70)
    logger.info("ROBUST OCR SYSTEM - CHECKPOINT MODE")
    logger.info("="*70)
    
    # Validate config
    try:
        validate_config()
    except Exception as e:
        logger.error(f"Config error: {e}")
        return
    
    # Get PDFs
    pdf_files = get_pdf_files(PDF_DIR)
    if not pdf_files:
        logger.error(f"No PDFs found in {PDF_DIR}")
        return
    
    logger.info(f"Found {len(pdf_files)} PDFs to process\n")
    
    # Process each PDF
    success_count = 0
    for i, pdf_path in enumerate(pdf_files, 1):
        pdf_name = get_filename_without_extension(pdf_path)
        
        output_raw = TEXT_RAW_DIR / f"{pdf_name}_raw.txt"
        output_clean = TEXT_CLEAN_DIR / f"{pdf_name}_clean.txt"
        
        logger.info(f"\n*** PDF {i}/{len(pdf_files)} ***")
        
        if process_pdf_robust(pdf_path, output_raw, output_clean):
            success_count += 1
        
        # Pause between PDFs
        if i < len(pdf_files):
            logger.info("Pausing 3 seconds before next PDF...")
            time.sleep(3)
            gc.collect()
    
    # Summary
    logger.info("\n" + "="*70)
    logger.info(f"COMPLETED: {success_count}/{len(pdf_files)} PDFs processed successfully")
    logger.info("="*70)


if __name__ == "__main__":
    main()

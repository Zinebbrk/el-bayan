#!/usr/bin/env python3
"""
Ultra-robust OCR that converts and processes PDFs in small batches.
Prevents memory issues by processing only a few pages at a time.
"""

import sys
import logging
import time
from pathlib import Path
import gc
import shutil

sys.path.insert(0, str(Path(__file__).parent))

from src.config import PDF_DIR, TEXT_RAW_DIR, TEXT_CLEAN_DIR, validate_config
from src.utils.file_utils import (
    ensure_dir_exists, get_pdf_files, get_filename_without_extension,
    list_images_sorted
)
import cv2
from pdf2image import convert_from_path
from src.preprocess.image_preprocess import ImagePreprocessor
from src.ocr.tesseract_engine import TesseractEngine
from src.cleaning.arabic_normalizer import ArabicNormalizer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    handlers=[
        logging.FileHandler('ocr_batch.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

BATCH_SIZE = 5  # Process 5 pages at a time


def convert_pdf_batch(pdf_path, output_dir, start_page, end_page):
    """Convert a batch of pages from PDF."""
    try:
        logger.info(f"  Converting pages {start_page}-{end_page}...")
        images = convert_from_path(
            pdf_path,
            dpi=300,
            first_page=start_page,
            last_page=end_page,
            fmt='png',
            thread_count=2
        )
        
        # Save images
        image_paths = []
        for i, image in enumerate(images):
            page_num = start_page + i
            filename = f"page_{page_num:03d}.png"
            img_path = output_dir / filename
            image.save(img_path, 'PNG')
            image_paths.append(img_path)
        
        # Clean up
        del images
        gc.collect()
        
        return image_paths
        
    except Exception as e:
        logger.error(f"  Error converting batch: {e}")
        return []


def process_image_to_text(image_path, preprocessor, ocr_engine, page_num):
    """Process one image and return text."""
    try:
        # Load
        image = cv2.imread(str(image_path))
        if image is None:
            return ""
        
        # Resize if needed
        h, w = image.shape[:2]
        if h > 3000 or w > 3000:
            scale = 3000 / max(h, w)
            image = cv2.resize(image, (int(w*scale), int(h*scale)))
        
        # Preprocess
        preprocessed = preprocessor.preprocess(image)
        del image
        
        # OCR
        text = ocr_engine.extract_text(preprocessed)
        del preprocessed
        gc.collect()
        
        return text
        
    except Exception as e:
        logger.error(f"  Error on page {page_num}: {e}")
        gc.collect()
        return ""


def get_pdf_page_count(pdf_path):
    """Get total pages in PDF."""
    try:
        from pdf2image import pdfinfo_from_path
        info = pdfinfo_from_path(pdf_path)
        return info.get("Pages", 0)
    except:
        return 0


def process_pdf_in_batches(pdf_path, output_raw, output_clean):
    """Process PDF in small batches to avoid memory issues."""
    
    pdf_name = get_filename_without_extension(pdf_path)
    image_dir = PDF_DIR.parent / "images" / pdf_name
    ensure_dir_exists(image_dir)
    
    logger.info(f"\n{'='*70}")
    logger.info(f"Processing: {pdf_name}")
    logger.info(f"{'='*70}")
    
    # Check if already done
    if output_clean.exists():
        logger.info(f"✓ Already processed, skipping")
        return True
    
    try:
        # Get page count
        total_pages = get_pdf_page_count(pdf_path)
        if total_pages == 0:
            logger.error("Could not determine page count")
            return False
        
        logger.info(f"Total pages: {total_pages}")
        
        # Initialize processors
        preprocessor = ImagePreprocessor()
        ocr_engine = TesseractEngine()
        
        # Open raw output file
        with open(output_raw, 'w', encoding='utf-8') as f:
            
            # Process in batches
            page_num = 1
            while page_num <= total_pages:
                batch_end = min(page_num + BATCH_SIZE - 1, total_pages)
                
                logger.info(f"\nBatch: pages {page_num}-{batch_end} of {total_pages}")
                
                # Convert this batch
                image_paths = convert_pdf_batch(pdf_path, image_dir, page_num, batch_end)
                
                if not image_paths:
                    logger.warning(f"No images generated for batch {page_num}-{batch_end}")
                    page_num = batch_end + 1
                    continue
                
                # Process each page in batch
                for img_path in image_paths:
                    current_page = page_num
                    
                    logger.info(f"  Page {current_page}/{total_pages}")
                    
                    # Write header
                    f.write(f"\n{'='*50}\n")
                    f.write(f"PAGE {current_page}\n")
                    f.write(f"{'='*50}\n")
                    
                    # OCR
                    text = process_image_to_text(img_path, preprocessor, ocr_engine, current_page)
                    f.write(text)
                    f.write("\n")
                    f.flush()
                    
                    # Delete image after processing to save space
                    try:
                        img_path.unlink()
                    except:
                        pass
                    
                    page_num += 1
                
                # Clean up batch
                gc.collect()
                time.sleep(1)
        
        logger.info(f"\n✓ Raw text saved: {output_raw}")
        
        # Clean text
        logger.info("Cleaning text...")
        with open(output_raw, 'r', encoding='utf-8') as f:
            raw_text = f.read()
        
        normalizer = ArabicNormalizer()
        clean_text = normalizer.normalize(raw_text)
        
        with open(output_clean, 'w', encoding='utf-8') as f:
            f.write(clean_text)
        
        logger.info(f"✓ Clean text saved: {output_clean}")
        
        # Clean up image directory
        try:
            shutil.rmtree(image_dir)
            logger.info(f"✓ Cleaned up temporary images")
        except:
            pass
        
        return True
        
    except Exception as e:
        logger.error(f"Failed: {e}")
        return False
    finally:
        gc.collect()


def main():
    """Main runner."""
    logger.info("="*70)
    logger.info("ULTRA-ROBUST OCR - BATCH MODE")
    logger.info(f"Processing {BATCH_SIZE} pages at a time")
    logger.info("="*70)
    
    validate_config()
    
    pdf_files = get_pdf_files(PDF_DIR)
    if not pdf_files:
        logger.error(f"No PDFs in {PDF_DIR}")
        return
    
    logger.info(f"Found {len(pdf_files)} PDFs\n")
    
    success = 0
    for i, pdf_path in enumerate(pdf_files, 1):
        pdf_name = get_filename_without_extension(pdf_path)
        output_raw = TEXT_RAW_DIR / f"{pdf_name}_raw.txt"
        output_clean = TEXT_CLEAN_DIR / f"{pdf_name}_clean.txt"
        
        logger.info(f"\n*** PDF {i}/{len(pdf_files)} ***")
        
        if process_pdf_in_batches(pdf_path, output_raw, output_clean):
            success += 1
        
        time.sleep(2)
        gc.collect()
    
    logger.info(f"\n{'='*70}")
    logger.info(f"COMPLETED: {success}/{len(pdf_files)} PDFs")
    logger.info(f"{'='*70}")


if __name__ == "__main__":
    main()

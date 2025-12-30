"""
Main entry point for the Arabic OCR system.

This script provides a simple command-line interface to run the OCR pipeline
on Arabic grammar books (PDFs).

Usage:
    python main.py                    # Process all PDFs in data/raw_pdfs/
    python main.py book.pdf           # Process a specific PDF file
    python main.py --help             # Show help message
"""

import sys
import logging
from pathlib import Path
import argparse

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from src.config import PDF_DIR, validate_config
from src.pipeline.ocr_pipeline import OCRPipeline
from src.utils.file_utils import get_pdf_files, validate_pdf_path


def setup_logging(verbose: bool = False):
    """
    Configure logging for the application.
    
    Args:
        verbose: If True, set DEBUG level; otherwise INFO level
    """
    log_level = logging.DEBUG if verbose else logging.INFO
    
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Reduce noise from some libraries
    logging.getLogger('PIL').setLevel(logging.WARNING)
    logging.getLogger('pdf2image').setLevel(logging.WARNING)


def process_single_pdf(pdf_path: Path, overwrite: bool = False):
    """
    Process a single PDF file through the OCR pipeline.
    
    Args:
        pdf_path: Path to PDF file
        overwrite: Whether to overwrite existing outputs
    """
    logger = logging.getLogger(__name__)
    
    logger.info(f"\n{'='*80}")
    logger.info("ARABIC GRAMMAR BOOK OCR SYSTEM")
    logger.info(f"{'='*80}\n")
    
    # Validate PDF path
    if not validate_pdf_path(pdf_path):
        logger.error(f"Invalid PDF file: {pdf_path}")
        sys.exit(1)
    
    try:
        # Initialize pipeline
        pipeline = OCRPipeline(overwrite=overwrite)
        
        # Process PDF
        raw_text_path, clean_text_path = pipeline.process_pdf(pdf_path)
        
        # Print results
        logger.info("\n" + "="*80)
        logger.info("✓ OCR COMPLETED SUCCESSFULLY")
        logger.info("="*80)
        logger.info(f"Raw text saved to:   {raw_text_path}")
        logger.info(f"Clean text saved to: {clean_text_path}")
        logger.info("="*80 + "\n")
        
        return True
        
    except Exception as e:
        logger.error(f"\n✗ OCR FAILED: {e}\n")
        return False


def process_all_pdfs(pdf_dir: Path, overwrite: bool = False):
    """
    Process all PDF files in a directory.
    
    Args:
        pdf_dir: Directory containing PDF files
        overwrite: Whether to overwrite existing outputs
    """
    logger = logging.getLogger(__name__)
    
    logger.info(f"\n{'='*80}")
    logger.info("ARABIC GRAMMAR BOOK OCR SYSTEM - BATCH MODE")
    logger.info(f"{'='*80}\n")
    
    # Get all PDFs
    pdf_files = get_pdf_files(pdf_dir)
    
    if not pdf_files:
        logger.error(f"No PDF files found in: {pdf_dir}")
        logger.info(f"Please place PDF files in: {pdf_dir}")
        sys.exit(1)
    
    logger.info(f"Found {len(pdf_files)} PDF file(s) to process")
    
    try:
        # Initialize pipeline
        pipeline = OCRPipeline(overwrite=overwrite)
        
        # Process all PDFs
        results = pipeline.process_directory(pdf_dir)
        
        # Print summary
        logger.info("\n" + "="*80)
        logger.info("✓ BATCH PROCESSING COMPLETED")
        logger.info("="*80)
        logger.info(f"Successfully processed: {len(results)}/{len(pdf_files)} PDFs")
        
        for pdf_name, raw_path, clean_path in results:
            logger.info(f"\n{pdf_name}:")
            logger.info(f"  Raw:   {raw_path}")
            logger.info(f"  Clean: {clean_path}")
        
        logger.info("="*80 + "\n")
        
        return len(results) > 0
        
    except Exception as e:
        logger.error(f"\n✗ BATCH PROCESSING FAILED: {e}\n")
        return False


def main():
    """
    Main entry point for the OCR system.
    """
    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description='Arabic Grammar Book OCR System',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py                      # Process all PDFs in data/raw_pdfs/
  python main.py book.pdf             # Process specific PDF file
  python main.py path/to/book.pdf     # Process PDF from custom location
  python main.py --overwrite          # Reprocess all PDFs (overwrite existing)
  python main.py --verbose            # Enable detailed logging
        """
    )
    
    parser.add_argument(
        'pdf',
        nargs='?',
        help='PDF file to process (optional). If not specified, processes all PDFs in data/raw_pdfs/'
    )
    
    parser.add_argument(
        '--overwrite',
        action='store_true',
        help='Overwrite existing output files'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose (debug) logging'
    )
    
    parser.add_argument(
        '--pdf-dir',
        type=Path,
        default=PDF_DIR,
        help=f'Directory containing PDF files (default: {PDF_DIR})'
    )
    
    args = parser.parse_args()
    
    # Setup logging
    setup_logging(verbose=args.verbose)
    logger = logging.getLogger(__name__)
    
    # Validate configuration
    try:
        validate_config()
    except Exception as e:
        logger.error(f"Configuration error: {e}")
        logger.error("Please check your configuration in src/config.py")
        sys.exit(1)
    
    # Process PDF(s)
    if args.pdf:
        # Single PDF mode
        pdf_path = Path(args.pdf)
        
        # If relative path, check in PDF_DIR
        if not pdf_path.exists():
            pdf_path = PDF_DIR / args.pdf
        
        success = process_single_pdf(pdf_path, overwrite=args.overwrite)
    else:
        # Batch mode - process all PDFs
        success = process_all_pdfs(args.pdf_dir, overwrite=args.overwrite)
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

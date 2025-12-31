"""
PDF to Images converter module.

This module handles conversion of PDF files to high-quality images suitable for OCR.
Uses pdf2image library with configurable DPI settings.
"""

import logging
from pathlib import Path
from typing import List, Optional
from pdf2image import convert_from_path
from pdf2image.exceptions import PDFPageCountError, PDFInfoNotInstalledError

from src.utils.file_utils import ensure_dir_exists, validate_pdf_path
from src.config import PDF_DPI, IMAGE_FORMAT

logger = logging.getLogger(__name__)


class PDFToImagesConverter:
    """
    Handles conversion of PDF files to images.
    
    This class provides methods to convert PDF pages into high-quality images
    optimized for OCR processing.
    """
    
    def __init__(self, dpi: int = PDF_DPI, image_format: str = IMAGE_FORMAT):
        """
        Initialize the PDF to images converter.
        
        Args:
            dpi: Resolution for image conversion (default from config)
            image_format: Output image format (PNG, JPEG, etc.)
        """
        self.dpi = dpi
        self.image_format = image_format.upper()
        logger.info(f"PDFToImagesConverter initialized with DPI={dpi}, format={image_format}")
    
    def convert(self, pdf_path: Path, output_dir: Path, 
                pdf_name: Optional[str] = None) -> List[Path]:
        """
        Convert a PDF file to images, one per page.
        
        Args:
            pdf_path: Path to the PDF file
            output_dir: Directory where images will be saved
            pdf_name: Custom name for output files (default: use PDF filename)
            
        Returns:
            List of paths to generated image files, ordered by page number
            
        Raises:
            FileNotFoundError: If PDF file doesn't exist
            PDFPageCountError: If PDF has no pages
            PDFInfoNotInstalledError: If poppler is not installed
        """
        # Validate PDF path
        if not validate_pdf_path(pdf_path):
            raise FileNotFoundError(f"Invalid PDF file: {pdf_path}")
        
        # Determine output name
        if pdf_name is None:
            pdf_name = Path(pdf_path).stem
        
        # Ensure output directory exists
        ensure_dir_exists(output_dir)
        
        logger.info(f"Converting PDF: {pdf_path}")
        logger.info(f"Output directory: {output_dir}")
        logger.info(f"DPI: {self.dpi}")
        
        try:
            # Convert PDF to images
            images = convert_from_path(
                pdf_path,
                dpi=self.dpi,
                fmt=self.image_format.lower(),
                thread_count=4,  # Use multiple threads for faster conversion
                grayscale=False,  # Keep color; preprocessing will handle grayscale
            )
            
            logger.info(f"Successfully converted {len(images)} pages from PDF")
            
            # Save images to disk
            image_paths = []
            for i, image in enumerate(images, start=1):
                # Format: page_001.png, page_002.png, etc.
                filename = f"page_{i:03d}.{self.image_format.lower()}"
                image_path = output_dir / filename
                
                # Save image
                image.save(image_path, self.image_format)
                image_paths.append(image_path)
                
                logger.debug(f"Saved page {i}/{len(images)}: {image_path}")
            
            logger.info(f"All {len(image_paths)} pages saved to {output_dir}")
            return image_paths
            
        except PDFInfoNotInstalledError:
            logger.error("poppler-utils is not installed. Please install it:")
            logger.error("  Ubuntu/Debian: sudo apt-get install poppler-utils")
            logger.error("  macOS: brew install poppler")
            logger.error("  Windows: Download from https://github.com/oschwartz10612/poppler-windows/releases/")
            raise
            
        except PDFPageCountError as e:
            logger.error(f"PDF has no pages or is corrupted: {e}")
            raise
            
        except Exception as e:
            logger.error(f"Error converting PDF to images: {e}")
            raise
    
    def convert_single_page(self, pdf_path: Path, page_number: int, 
                           output_path: Path) -> Path:
        """
        Convert a single page from a PDF to an image.
        
        Args:
            pdf_path: Path to the PDF file
            page_number: Page number to convert (1-indexed)
            output_path: Path where the image will be saved
            
        Returns:
            Path to the generated image file
            
        Raises:
            FileNotFoundError: If PDF file doesn't exist
            ValueError: If page_number is invalid
        """
        if not validate_pdf_path(pdf_path):
            raise FileNotFoundError(f"Invalid PDF file: {pdf_path}")
        
        if page_number < 1:
            raise ValueError("Page number must be >= 1")
        
        logger.info(f"Converting page {page_number} from {pdf_path}")
        
        try:
            # Convert single page
            images = convert_from_path(
                pdf_path,
                dpi=self.dpi,
                fmt=self.image_format.lower(),
                first_page=page_number,
                last_page=page_number,
            )
            
            if not images:
                raise ValueError(f"Page {page_number} does not exist in PDF")
            
            # Ensure output directory exists
            ensure_dir_exists(output_path.parent)
            
            # Save image
            images[0].save(output_path, self.image_format)
            logger.info(f"Saved page {page_number} to {output_path}")
            
            return output_path
            
        except Exception as e:
            logger.error(f"Error converting page {page_number}: {e}")
            raise
    
    def get_page_count(self, pdf_path: Path) -> int:
        """
        Get the number of pages in a PDF without converting it.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Number of pages in the PDF
            
        Raises:
            FileNotFoundError: If PDF file doesn't exist
        """
        if not validate_pdf_path(pdf_path):
            raise FileNotFoundError(f"Invalid PDF file: {pdf_path}")
        
        try:
            from pdf2image import pdfinfo_from_path
            info = pdfinfo_from_path(pdf_path)
            page_count = info.get("Pages", 0)
            logger.info(f"PDF has {page_count} pages: {pdf_path}")
            return page_count
            
        except Exception as e:
            logger.error(f"Error getting page count: {e}")
            # Fallback: try to convert and count
            try:
                images = convert_from_path(pdf_path, dpi=72)  # Low DPI for speed
                return len(images)
            except:
                return 0


def convert_pdf_to_images(pdf_path: Path, output_dir: Path, 
                         dpi: int = PDF_DPI) -> List[Path]:
    """
    Convenience function to convert a PDF to images.
    
    Args:
        pdf_path: Path to the PDF file
        output_dir: Directory where images will be saved
        dpi: Resolution for image conversion
        
    Returns:
        List of paths to generated image files
    """
    converter = PDFToImagesConverter(dpi=dpi)
    return converter.convert(pdf_path, output_dir)


# Example usage
if __name__ == "__main__":
    # Configure logging for testing
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Example: Convert a PDF
    # pdf_file = Path("data/raw_pdfs/example.pdf")
    # output_directory = Path("data/images/example")
    # converter = PDFToImagesConverter()
    # image_files = converter.convert(pdf_file, output_directory)
    # print(f"Converted {len(image_files)} pages")

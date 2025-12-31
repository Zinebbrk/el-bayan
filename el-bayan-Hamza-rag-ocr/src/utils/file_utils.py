"""
File utility functions for the OCR system.

This module provides helper functions for file and directory operations,
including path handling, directory creation, and file listing.
"""

import os
import re
from pathlib import Path
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


def ensure_dir_exists(directory: Path) -> None:
    """
    Ensure that a directory exists, creating it if necessary.
    
    Args:
        directory: Path object or string path to directory
        
    Raises:
        OSError: If directory cannot be created
    """
    directory = Path(directory)
    try:
        directory.mkdir(parents=True, exist_ok=True)
        logger.debug(f"Directory ensured: {directory}")
    except OSError as e:
        logger.error(f"Failed to create directory {directory}: {e}")
        raise


def get_pdf_files(directory: Path) -> List[Path]:
    """
    Get all PDF files in a directory.
    
    Args:
        directory: Path to directory containing PDFs
        
    Returns:
        List of Path objects for PDF files, sorted alphabetically
    """
    directory = Path(directory)
    if not directory.exists():
        logger.warning(f"Directory does not exist: {directory}")
        return []
    
    pdf_files = sorted(directory.glob("*.pdf"))
    logger.info(f"Found {len(pdf_files)} PDF files in {directory}")
    return pdf_files


def list_images_sorted(directory: Path, extension: str = "png") -> List[Path]:
    """
    List image files in a directory, sorted numerically by page number.
    
    This function handles filenames like 'page_001.png', 'page_002.png', etc.
    and sorts them in numerical order rather than alphabetical order.
    
    Args:
        directory: Path to directory containing images
        extension: Image file extension (default: "png")
        
    Returns:
        List of Path objects for image files, sorted numerically
    """
    directory = Path(directory)
    if not directory.exists():
        logger.warning(f"Directory does not exist: {directory}")
        return []
    
    # Get all images with the specified extension
    images = list(directory.glob(f"*.{extension}"))
    
    # Sort numerically by extracting page numbers
    def extract_page_number(filepath: Path) -> int:
        """Extract page number from filename like 'page_001.png'"""
        match = re.search(r'page_(\d+)', filepath.stem)
        return int(match.group(1)) if match else 0
    
    images_sorted = sorted(images, key=extract_page_number)
    logger.debug(f"Found {len(images_sorted)} images in {directory}")
    return images_sorted


def safe_join(*paths) -> Path:
    """
    Safely join path components and return a Path object.
    
    Args:
        *paths: Variable number of path components
        
    Returns:
        Path object with joined components
    """
    return Path(*paths)


def get_filename_without_extension(filepath: Path) -> str:
    """
    Get filename without extension from a path.
    
    Args:
        filepath: Path object or string path
        
    Returns:
        Filename without extension (stem)
    """
    return Path(filepath).stem


def file_exists(filepath: Path) -> bool:
    """
    Check if a file exists.
    
    Args:
        filepath: Path to file
        
    Returns:
        True if file exists, False otherwise
    """
    return Path(filepath).is_file()


def get_file_size(filepath: Path) -> int:
    """
    Get file size in bytes.
    
    Args:
        filepath: Path to file
        
    Returns:
        File size in bytes, or 0 if file doesn't exist
    """
    filepath = Path(filepath)
    if filepath.is_file():
        return filepath.stat().st_size
    return 0


def format_file_size(size_bytes: int) -> str:
    """
    Format file size in human-readable format.
    
    Args:
        size_bytes: File size in bytes
        
    Returns:
        Formatted string like "1.5 MB"
    """
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


def count_files_in_directory(directory: Path, pattern: str = "*") -> int:
    """
    Count files matching a pattern in a directory.
    
    Args:
        directory: Path to directory
        pattern: Glob pattern (default: "*" for all files)
        
    Returns:
        Number of matching files
    """
    directory = Path(directory)
    if not directory.exists():
        return 0
    return len(list(directory.glob(pattern)))


def clean_directory(directory: Path, pattern: str = "*", keep_dir: bool = True) -> int:
    """
    Remove files matching a pattern from a directory.
    
    Args:
        directory: Path to directory
        pattern: Glob pattern for files to remove (default: "*")
        keep_dir: If True, keep the directory itself (default: True)
        
    Returns:
        Number of files removed
    """
    directory = Path(directory)
    if not directory.exists():
        logger.warning(f"Directory does not exist: {directory}")
        return 0
    
    files_removed = 0
    for file in directory.glob(pattern):
        if file.is_file():
            try:
                file.unlink()
                files_removed += 1
                logger.debug(f"Removed file: {file}")
            except OSError as e:
                logger.error(f"Failed to remove {file}: {e}")
    
    if not keep_dir and files_removed > 0:
        try:
            directory.rmdir()
            logger.debug(f"Removed directory: {directory}")
        except OSError as e:
            logger.error(f"Failed to remove directory {directory}: {e}")
    
    logger.info(f"Removed {files_removed} files from {directory}")
    return files_removed


def read_text_file(filepath: Path, encoding: str = 'utf-8') -> Optional[str]:
    """
    Read text from a file.
    
    Args:
        filepath: Path to text file
        encoding: Text encoding (default: 'utf-8')
        
    Returns:
        File contents as string, or None if error occurs
    """
    filepath = Path(filepath)
    try:
        with open(filepath, 'r', encoding=encoding) as f:
            return f.read()
    except Exception as e:
        logger.error(f"Failed to read file {filepath}: {e}")
        return None


def write_text_file(filepath: Path, content: str, encoding: str = 'utf-8', 
                   append: bool = False) -> bool:
    """
    Write text to a file.
    
    Args:
        filepath: Path to text file
        content: Text content to write
        encoding: Text encoding (default: 'utf-8')
        append: If True, append to file; if False, overwrite (default: False)
        
    Returns:
        True if successful, False otherwise
    """
    filepath = Path(filepath)
    mode = 'a' if append else 'w'
    
    try:
        # Ensure parent directory exists
        ensure_dir_exists(filepath.parent)
        
        with open(filepath, mode, encoding=encoding) as f:
            f.write(content)
        logger.debug(f"{'Appended to' if append else 'Wrote'} file: {filepath}")
        return True
    except Exception as e:
        logger.error(f"Failed to write file {filepath}: {e}")
        return False


def get_relative_path(filepath: Path, base_path: Path) -> Path:
    """
    Get relative path from base path.
    
    Args:
        filepath: Full path to file
        base_path: Base path to calculate relative path from
        
    Returns:
        Relative path as Path object
    """
    try:
        return Path(filepath).relative_to(base_path)
    except ValueError:
        # If paths are not relative, return the original path
        return Path(filepath)


def validate_pdf_path(pdf_path: Path) -> bool:
    """
    Validate that a PDF file exists and is readable.
    
    Args:
        pdf_path: Path to PDF file
        
    Returns:
        True if valid, False otherwise
    """
    pdf_path = Path(pdf_path)
    
    if not pdf_path.exists():
        logger.error(f"PDF file does not exist: {pdf_path}")
        return False
    
    if not pdf_path.is_file():
        logger.error(f"Path is not a file: {pdf_path}")
        return False
    
    if pdf_path.suffix.lower() != '.pdf':
        logger.error(f"File is not a PDF: {pdf_path}")
        return False
    
    return True

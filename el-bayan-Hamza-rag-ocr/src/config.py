"""
Configuration settings for the Arabic OCR system.

This module contains all configurable parameters including paths,
Tesseract settings, image processing parameters, and system defaults.
"""

import os
from pathlib import Path

# ==================== BASE PATHS ====================
# Root directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Data directories
DATA_DIR = BASE_DIR / "data"
PDF_DIR = DATA_DIR / "raw_pdfs"
IMG_DIR = DATA_DIR / "images"
TEXT_RAW_DIR = DATA_DIR / "text_raw"
TEXT_CLEAN_DIR = DATA_DIR / "text_clean"

# ==================== TESSERACT SETTINGS ====================
# Tesseract executable path (update based on your system)
TESSERACT_PATH = "/usr/bin/tesseract"  # Linux default
# For Windows: r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# For macOS: "/usr/local/bin/tesseract"

# OCR language (Arabic)
LANG = "ara"

# Tesseract OCR Engine Mode (OEM)
# 0 = Legacy engine only
# 1 = Neural nets LSTM engine only
# 2 = Legacy + LSTM engines
# 3 = Default, based on what is available
OEM = 3

# Page Segmentation Mode (PSM)
# 3 = Fully automatic page segmentation, but no OSD (default)
# 6 = Assume a single uniform block of text
# 11 = Sparse text. Find as much text as possible in no particular order
PSM = 3

# ==================== IMAGE PROCESSING SETTINGS ====================
# DPI for PDF to image conversion (300-400 recommended for OCR)
PDF_DPI = 350

# Image format for conversion
IMAGE_FORMAT = "PNG"

# Preprocessing parameters
PREPROCESS_CONFIG = {
    "apply_grayscale": True,
    "apply_noise_removal": True,
    "apply_binarization": True,
    "apply_deskew": True,
    "apply_contrast_enhancement": True,
    "apply_morphological_cleanup": False,  # Optional, can be enabled if needed
    
    # Noise removal parameters
    "gaussian_kernel_size": (5, 5),
    
    # Morphological parameters
    "morph_kernel_size": (2, 2),
    "morph_iterations": 1,
}

# ==================== ARABIC TEXT CLEANING SETTINGS ====================
CLEANING_CONFIG = {
    "remove_tashkeel": True,
    "normalize_alef": True,
    "normalize_teh_marbuta": True,
    "normalize_hamza": True,
    "remove_non_arabic": True,
    "collapse_spaces": True,
    "apply_reshaping": True,
    "apply_bidi": True,
}

# Arabic tashkeel (diacritics) to remove
TASHKEEL = [
    '\u064B',  # Tanwin Fath
    '\u064C',  # Tanwin Damm
    '\u064D',  # Tanwin Kasr
    '\u064E',  # Fatha
    '\u064F',  # Damma
    '\u0650',  # Kasra
    '\u0651',  # Shadda
    '\u0652',  # Sukun
    '\u0653',  # Maddah
    '\u0654',  # Hamza Above
    '\u0655',  # Hamza Below
    '\u0656',  # Subscript Alef
    '\u0657',  # Inverted Damma
    '\u0658',  # Mark Noon Ghunna
    '\u0670',  # Superscript Alef
]

# ==================== LOGGING SETTINGS ====================
LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# ==================== PROCESSING SETTINGS ====================
# Whether to save intermediate images after preprocessing
SAVE_PREPROCESSED_IMAGES = False

# Whether to overwrite existing files
OVERWRITE_EXISTING = False

# Batch processing settings
BATCH_SIZE = 10  # Number of pages to process before writing to disk

# ==================== VALIDATION ====================
def validate_config():
    """
    Validate configuration settings and create necessary directories.
    
    Raises:
        FileNotFoundError: If Tesseract executable is not found.
        OSError: If directories cannot be created.
    """
    # Check if Tesseract is installed
    if not os.path.exists(TESSERACT_PATH):
        raise FileNotFoundError(
            f"Tesseract not found at {TESSERACT_PATH}. "
            "Please install Tesseract OCR or update TESSERACT_PATH in config.py"
        )
    
    # Create necessary directories if they don't exist
    for directory in [PDF_DIR, IMG_DIR, TEXT_RAW_DIR, TEXT_CLEAN_DIR]:
        directory.mkdir(parents=True, exist_ok=True)
    
    return True


# ==================== HELPER FUNCTIONS ====================
def get_image_dir(pdf_name: str) -> Path:
    """
    Get the image directory for a specific PDF.
    
    Args:
        pdf_name: Name of the PDF file (without extension)
    
    Returns:
        Path object for the PDF's image directory
    """
    return IMG_DIR / pdf_name


def get_raw_text_path(pdf_name: str) -> Path:
    """
    Get the raw text file path for a specific PDF.
    
    Args:
        pdf_name: Name of the PDF file (without extension)
    
    Returns:
        Path object for the raw text file
    """
    return TEXT_RAW_DIR / f"{pdf_name}_raw.txt"


def get_clean_text_path(pdf_name: str) -> Path:
    """
    Get the cleaned text file path for a specific PDF.
    
    Args:
        pdf_name: Name of the PDF file (without extension)
    
    Returns:
        Path object for the cleaned text file
    """
    return TEXT_CLEAN_DIR / f"{pdf_name}_clean.txt"


# Validate configuration on import
if __name__ != "__main__":
    try:
        validate_config()
    except FileNotFoundError as e:
        print(f"Warning: {e}")

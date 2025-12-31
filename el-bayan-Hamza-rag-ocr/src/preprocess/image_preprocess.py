"""
Image preprocessing module for OCR optimization.

This module provides comprehensive image preprocessing techniques to enhance
OCR accuracy for Arabic text, including grayscale conversion, noise reduction,
binarization, deskewing, and contrast enhancement.
"""

import logging
import cv2
import numpy as np
from pathlib import Path
from typing import Tuple, Optional

from src.config import PREPROCESS_CONFIG

logger = logging.getLogger(__name__)


class ImagePreprocessor:
    """
    Handles image preprocessing operations to optimize images for OCR.
    
    Applies various image processing techniques including grayscale conversion,
    noise removal, binarization, deskewing, and contrast enhancement.
    """
    
    def __init__(self, config: dict = None):
        """
        Initialize the image preprocessor.
        
        Args:
            config: Configuration dictionary for preprocessing parameters
                   (default: use PREPROCESS_CONFIG from config.py)
        """
        self.config = config if config is not None else PREPROCESS_CONFIG
        logger.info("ImagePreprocessor initialized")
        logger.debug(f"Configuration: {self.config}")
    
    def preprocess(self, image: np.ndarray) -> np.ndarray:
        """
        Apply full preprocessing pipeline to an image.
        
        Args:
            image: Input image as numpy array (can be BGR or grayscale)
            
        Returns:
            Preprocessed image as numpy array
        """
        logger.debug("Starting preprocessing pipeline")
        
        # Step 1: Convert to grayscale
        if self.config.get("apply_grayscale", True):
            image = self.convert_to_grayscale(image)
        
        # Step 2: Remove noise
        if self.config.get("apply_noise_removal", True):
            image = self.remove_noise(image)
        
        # Step 3: Enhance contrast
        if self.config.get("apply_contrast_enhancement", True):
            image = self.enhance_contrast(image)
        
        # Step 4: Apply binarization (threshold)
        if self.config.get("apply_binarization", True):
            image = self.binarize(image)
        
        # Step 5: Deskew (straighten)
        if self.config.get("apply_deskew", True):
            image = self.deskew(image)
        
        # Step 6: Morphological cleanup (optional)
        if self.config.get("apply_morphological_cleanup", False):
            image = self.morphological_cleanup(image)
        
        logger.debug("Preprocessing pipeline completed")
        return image
    
    def convert_to_grayscale(self, image: np.ndarray) -> np.ndarray:
        """
        Convert image to grayscale.
        
        Args:
            image: Input image (BGR or already grayscale)
            
        Returns:
            Grayscale image
        """
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            logger.debug("Converted to grayscale")
            return gray
        return image
    
    def remove_noise(self, image: np.ndarray) -> np.ndarray:
        """
        Remove noise from image using Gaussian blur.
        
        Args:
            image: Input grayscale image
            
        Returns:
            Denoised image
        """
        kernel_size = self.config.get("gaussian_kernel_size", (5, 5))
        denoised = cv2.GaussianBlur(image, kernel_size, 0)
        logger.debug(f"Applied noise removal with kernel size {kernel_size}")
        return denoised
    
    def enhance_contrast(self, image: np.ndarray) -> np.ndarray:
        """
        Enhance image contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization).
        
        This improves the visibility of text, especially in images with poor lighting.
        
        Args:
            image: Input grayscale image
            
        Returns:
            Contrast-enhanced image
        """
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(image)
        logger.debug("Applied contrast enhancement (CLAHE)")
        return enhanced
    
    def binarize(self, image: np.ndarray) -> np.ndarray:
        """
        Apply Otsu's binarization to convert image to black and white.
        
        Otsu's method automatically determines the optimal threshold value.
        
        Args:
            image: Input grayscale image
            
        Returns:
            Binary image (black text on white background)
        """
        # Apply Otsu's thresholding
        _, binary = cv2.threshold(
            image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )
        logger.debug("Applied Otsu's binarization")
        return binary
    
    def deskew(self, image: np.ndarray) -> np.ndarray:
        """
        Deskew (straighten) a tilted image.
        
        This corrects images that are slightly rotated, which can significantly
        improve OCR accuracy.
        
        Args:
            image: Input binary image
            
        Returns:
            Deskewed image
        """
        # Calculate skew angle
        coords = np.column_stack(np.where(image > 0))
        
        if len(coords) == 0:
            logger.warning("No foreground pixels found for deskewing")
            return image
        
        try:
            # Find minimum area rectangle
            angle = cv2.minAreaRect(coords)[-1]
            
            # Adjust angle
            if angle < -45:
                angle = -(90 + angle)
            else:
                angle = -angle
            
            # Only deskew if angle is significant (> 0.5 degrees)
            if abs(angle) < 0.5:
                logger.debug(f"Skew angle too small ({angle:.2f}°), skipping deskew")
                return image
            
            # Get image dimensions
            (h, w) = image.shape[:2]
            center = (w // 2, h // 2)
            
            # Calculate rotation matrix
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            
            # Perform rotation
            rotated = cv2.warpAffine(
                image, M, (w, h),
                flags=cv2.INTER_CUBIC,
                borderMode=cv2.BORDER_REPLICATE
            )
            
            logger.debug(f"Deskewed image by {angle:.2f} degrees")
            return rotated
            
        except Exception as e:
            logger.warning(f"Deskew failed: {e}, returning original image")
            return image
    
    def morphological_cleanup(self, image: np.ndarray) -> np.ndarray:
        """
        Apply morphological operations to clean up the image.
        
        This can help remove small artifacts and connect broken characters.
        
        Args:
            image: Input binary image
            
        Returns:
            Cleaned image
        """
        kernel_size = self.config.get("morph_kernel_size", (2, 2))
        iterations = self.config.get("morph_iterations", 1)
        
        kernel = np.ones(kernel_size, np.uint8)
        
        # Opening: erosion followed by dilation (removes small noise)
        opened = cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel, iterations=iterations)
        
        # Closing: dilation followed by erosion (closes small holes)
        closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, kernel, iterations=iterations)
        
        logger.debug(f"Applied morphological cleanup with kernel {kernel_size}")
        return closed
    
    def preprocess_from_file(self, image_path: Path, save_output: bool = False,
                           output_path: Optional[Path] = None) -> np.ndarray:
        """
        Load an image from file and preprocess it.
        
        Args:
            image_path: Path to input image file
            save_output: Whether to save the preprocessed image
            output_path: Path to save preprocessed image (if save_output is True)
            
        Returns:
            Preprocessed image as numpy array
            
        Raises:
            FileNotFoundError: If image file doesn't exist
            ValueError: If image cannot be loaded
        """
        if not Path(image_path).exists():
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        # Load image
        image = cv2.imread(str(image_path))
        
        if image is None:
            raise ValueError(f"Failed to load image: {image_path}")
        
        logger.info(f"Loaded image: {image_path} (shape: {image.shape})")
        
        # Preprocess
        preprocessed = self.preprocess(image)
        
        # Save if requested
        if save_output:
            if output_path is None:
                # Generate output path
                output_path = Path(str(image_path).replace('.png', '_preprocessed.png'))
            
            cv2.imwrite(str(output_path), preprocessed)
            logger.info(f"Saved preprocessed image to: {output_path}")
        
        return preprocessed
    
    def preprocess_batch(self, image_paths: list) -> list:
        """
        Preprocess multiple images in batch.
        
        Args:
            image_paths: List of paths to image files
            
        Returns:
            List of preprocessed images as numpy arrays
        """
        preprocessed_images = []
        
        for i, image_path in enumerate(image_paths, 1):
            try:
                logger.info(f"Preprocessing image {i}/{len(image_paths)}: {image_path}")
                image = cv2.imread(str(image_path))
                
                if image is None:
                    logger.error(f"Failed to load image: {image_path}")
                    continue
                
                preprocessed = self.preprocess(image)
                preprocessed_images.append(preprocessed)
                
            except Exception as e:
                logger.error(f"Error preprocessing {image_path}: {e}")
                continue
        
        logger.info(f"Successfully preprocessed {len(preprocessed_images)}/{len(image_paths)} images")
        return preprocessed_images


def preprocess_image(image: np.ndarray, config: dict = None) -> np.ndarray:
    """
    Convenience function to preprocess a single image.
    
    Args:
        image: Input image as numpy array
        config: Configuration dictionary (optional)
        
    Returns:
        Preprocessed image
    """
    preprocessor = ImagePreprocessor(config)
    return preprocessor.preprocess(image)


# Example usage
if __name__ == "__main__":
    # Configure logging for testing
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Example: Preprocess an image
    # preprocessor = ImagePreprocessor()
    # image_path = Path("data/images/example/page_001.png")
    # preprocessed = preprocessor.preprocess_from_file(image_path, save_output=True)
    # print(f"Preprocessed image shape: {preprocessed.shape}")

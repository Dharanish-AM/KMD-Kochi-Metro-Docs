import logging
import easyocr
from pdf2image import convert_from_path
from typing import List
from PIL import Image
import numpy as np
import warnings
from concurrent.futures import ThreadPoolExecutor

warnings.filterwarnings("ignore", message=".*pin_memory.*")

# Initialize EasyOCR once (reuse across calls)
READER = easyocr.Reader(["en"], gpu=True)


def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from any file using OCR with faster parallel processing.
    """
    text = ""

    try:
        if file_path.lower().endswith(".pdf"):
            images = pdf_to_images(file_path)

            # Use ThreadPoolExecutor to run OCR on pages in parallel
            with ThreadPoolExecutor(max_workers=min(4, len(images))) as executor:
                results = list(executor.map(_ocr_image, images))
            
            text = " ".join(results)

        else:
            logging.info(f"Performing OCR on image file {file_path}")
            text = _ocr_image(file_path)

    except Exception as e:
        logging.error(f"OCR extraction failed for {file_path}: {e}")
        text = ""

    logging.info(f"Final extracted text for {file_path}: {text.strip()}")
    return text.strip()


def _ocr_image(image_input) -> str:
    """
    Perform OCR on a single image or image file path.
    """
    try:
        if isinstance(image_input, Image.Image):
            img_array = np.array(image_input)
        else:
            img_array = image_input  # file path string, EasyOCR can handle it directly

        result = READER.readtext(img_array, detail=0)
        return " ".join(result)  # type: ignore
    except Exception as e:
        logging.error(f"OCR failed on image: {e}")
        return ""


def pdf_to_images(file_path: str) -> List[Image.Image]:
    """
    Convert a PDF file to a list of PIL Image objects, one per page.
    Uses faster settings for pdf2image.
    """
    try:
        logging.info(f"Starting PDF to image conversion for {file_path}")
        # You can reduce DPI to speed up conversion if high-res not needed
        images = convert_from_path(file_path, dpi=150, thread_count=4)
        logging.info(
            f"Completed PDF to image conversion for {file_path}, {len(images)} pages found"
        )
        return images
    except Exception as e:
        logging.error(f"PDF to image conversion failed for {file_path}: {e}")
        return []
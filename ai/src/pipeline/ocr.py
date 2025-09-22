import logging
import easyocr
from pdf2image import convert_from_path
from typing import List
from PIL import Image
import numpy as np
import warnings

warnings.filterwarnings("ignore", message=".*pin_memory.*")


def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from any file using OCR.
    """
    reader = easyocr.Reader(["en"], gpu=True)
    text = ""
    try:
        if file_path.lower().endswith(".pdf"):
            images = pdf_to_images(file_path)
            for idx, image in enumerate(images):
                logging.info(f"Performing OCR on page {idx + 1} of {file_path}")
                img_array = np.array(image)
                # EasyOCR for English text
                english_result = reader.readtext(img_array, detail=0)
                english_text = " ".join(english_result)  # type: ignore

                text += english_text + " "
        else:
            logging.info(f"Performing OCR on image file {file_path}")
            # EasyOCR for English text
            english_result = reader.readtext(file_path, detail=0)
            english_text = " ".join(english_result)  # type: ignore

            text = english_text
    except Exception as e:
        logging.error(f"OCR extraction failed for {file_path}: {e}")
        text = ""

    logging.info(f"Final extracted text for {file_path}: {text.strip()}")
    return text.strip()


def pdf_to_images(file_path: str) -> List[Image.Image]:
    """
    Convert a PDF file to a list of PIL Image objects, one per page.
    """
    try:
        logging.info(f"Starting PDF to image conversion for {file_path}")
        images = convert_from_path(file_path)
        logging.info(
            f"Completed PDF to image conversion for {file_path}, {len(images)} pages found"
        )
        return images
    except Exception as e:
        logging.error(f"PDF to image conversion failed for {file_path}: {e}")
        return []

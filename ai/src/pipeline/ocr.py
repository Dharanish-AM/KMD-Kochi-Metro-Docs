import logging
import easyocr
import pytesseract
from pdf2image import convert_from_path
from typing import List
from PIL import Image
import numpy as np

def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from any file using OCR.
    """
    reader = easyocr.Reader(['en'])
    text = ""
    try:
        if file_path.lower().endswith('.pdf'):
            images = pdf_to_images(file_path)
            for idx, image in enumerate(images):
                logging.info(f"Performing OCR on page {idx + 1} of {file_path}")
                img_array = np.array(image)
                # EasyOCR for English text
                english_result = reader.readtext(img_array, detail=0)
                english_text = " ".join(english_result) # type: ignore

                # Pytesseract for Malayalam text
                malayalam_text = ""
                try:
                    malayalam_text = pytesseract.image_to_string(image, lang='mal')
                except pytesseract.TesseractNotFoundError:
                    logging.warning(f"Tesseract OCR executable not found for Malayalam on page {idx + 1} of {file_path}. Skipping Malayalam OCR.")
                except pytesseract.pytesseract.TesseractError as e:
                    logging.warning(f"Pytesseract OCR failed for Malayalam on page {idx + 1} of {file_path}: {e}. Skipping Malayalam OCR.")
                except Exception as e:
                    logging.error(f"Unexpected error during Malayalam OCR on page {idx + 1} of {file_path}: {e}")

                page_text = english_text
                if malayalam_text:
                    page_text += " " + malayalam_text
                text += page_text + " "
        else:
            logging.info(f"Performing OCR on image file {file_path}")
            # EasyOCR for English text
            english_result = reader.readtext(file_path, detail=0)
            english_text = " ".join(english_result) # type: ignore

            malayalam_text = ""
            try:
                malayalam_text = pytesseract.image_to_string(file_path, lang='mal')
            except pytesseract.TesseractNotFoundError:
                logging.warning(f"Tesseract OCR executable not found for Malayalam on image file {file_path}. Skipping Malayalam OCR.")
            except pytesseract.pytesseract.TesseractError as e:
                logging.warning(f"Pytesseract OCR failed for Malayalam on image file {file_path}: {e}. Skipping Malayalam OCR.")
            except Exception as e:
                logging.error(f"Unexpected error during Malayalam OCR on image file {file_path}: {e}")

            text = english_text
            if malayalam_text:
                text += " " + malayalam_text
    except Exception as e:
        logging.error(f"OCR extraction failed for {file_path}: {e}")
        text = ""

    return text.strip()

def pdf_to_images(file_path: str) -> List[Image.Image]:
    """
    Convert a PDF file to a list of PIL Image objects, one per page.
    """
    try:
        logging.info(f"Starting PDF to image conversion for {file_path}")
        images = convert_from_path(file_path)
        logging.info(f"Completed PDF to image conversion for {file_path}, {len(images)} pages found")
        return images
    except Exception as e:
        logging.error(f"PDF to image conversion failed for {file_path}: {e}")
        return []
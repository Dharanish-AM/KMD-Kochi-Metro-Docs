import logging
from docx import Document
import pdfplumber

logger = logging.getLogger(__name__)

def extract_text_pdf(file_path: str) -> str:
    """
    Faster PDF text extraction using pdfplumber.
    Avoids repeated string concatenation by collecting page texts in a list.
    """
    logger.info(f"Starting PDF text extraction for: {file_path}")
    try:
        with pdfplumber.open(file_path) as pdf:
            # Collect all page texts in a list
            pages_text = [page.extract_text() or "" for page in pdf.pages]
        text = "\n".join(pages_text).strip()
        logger.info(f"Completed PDF text extraction for: {file_path}")
        logger.debug(f"Extracted text length: {len(text)}")
        return text
    except Exception as e:
        logger.error(f"Failed to extract text from PDF {file_path}: {e}")
        return ""


def extract_text_docx(file_path: str) -> str:
    """
    Faster DOCX text extraction by using list comprehension.
    """
    try:
        doc = Document(file_path)
        text = "\n".join([p.text for p in doc.paragraphs]).strip()
        logger.debug(f"Extracted DOCX text length: {len(text)}")
        return text
    except Exception as e:
        logger.error(f"Failed to extract text from DOCX {file_path}: {e}")
        return ""
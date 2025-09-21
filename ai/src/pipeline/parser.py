import logging


def extract_text_pdf(file_path):
    import pdfplumber

    logger = logging.getLogger(__name__)
    logger.info(f"Starting PDF text extraction using pdfplumber for file: {file_path}")
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                text += page_text
        text = text.strip()
        logger.info(f"Completed PDF text extraction for file: {file_path}")
    except Exception as e:
        logger.error(f"Failed to extract text from PDF file {file_path}: {e}")
        text = ""
    return text


def extract_text_docx(file_path):
    import logging
    from docx import Document

    logger = logging.getLogger(__name__)
    try:
        doc = Document(file_path)
        text = "\n".join([p.text for p in doc.paragraphs])
        return text.strip()
    except Exception as e:
        logger.error(f"Failed to extract text from docx file {file_path}: {e}")
        return ""

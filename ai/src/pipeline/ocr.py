def extract_text_image(image_path: str) -> str:
    """
    Extract text from image using EasyOCR for English and Tesseract for Malayalam.
    Falls back to English if Malayalam extraction fails.
    """
    import easyocr
    try:
        import pytesseract
    except ImportError:
        pytesseract = None

    text_ml = ""
    # Try Malayalam extraction using pytesseract if available
    if pytesseract:
        try:
            from PIL import Image
            img = Image.open(image_path)
            # Malayalam language code for Tesseract is 'mal'
            text_ml = pytesseract.image_to_string(img, lang='mal').strip()
        except Exception:
            text_ml = ""

    # If Malayalam text extraction failed or empty, try English with EasyOCR
    if not text_ml:
        try:
            reader = easyocr.Reader(['en'])
            result = reader.readtext(image_path, detail=0)
            return " ".join(result)  # type: ignore
        except Exception:
            return ""

    # If Malayalam extraction succeeded, return that text
    return text_ml
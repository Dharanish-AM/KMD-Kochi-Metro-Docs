from langdetect import detect, DetectorFactory

DetectorFactory.seed = 0  # consistent detection

def detect_language(text: str) -> str:
    """
    Safely detect language. Returns 'unknown' if text is empty.
    """
    if not text.strip():
        return "unknown"
    return detect(text)
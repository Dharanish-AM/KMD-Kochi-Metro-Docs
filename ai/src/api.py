from fastapi import FastAPI, UploadFile
from pipeline import parser, ocr, translate, classify, metadata, embeddings, summarize
from utils.langdetect_utils import detect_language
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()


@app.post("/process")
async def process_file(file: UploadFile):
    logger.info(f"Received file: {file.filename}")

    # Save uploaded file temporarily
    file_path = f"/tmp/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # --- Text Extraction ---
    text = ""
    if file.filename.endswith(".pdf"):
        logger.info("Extracting text from PDF")
        text = parser.extract_text_pdf(file_path)
        if not text.strip():  # fallback to OCR for scanned PDF
            logger.info("PDF text extraction empty, falling back to OCR")
            text = ocr.extract_text_image(file_path)
    elif file.filename.endswith(".docx"):
        logger.info("Extracting text from DOCX")
        text = parser.extract_text_docx(file_path)
    else:
        logger.info("Extracting text using OCR from image")
        text = ocr.extract_text_image(file_path)

    # --- Check if any text was extracted ---
    if not text.strip():
        logger.info("No text could be extracted from this document.")
        return {
            "file_name": file.filename,
            "error": "No text could be extracted from this document."
        }

    # --- Language Detection ---
    detected_lang = detect_language(text)
    logger.info(f"Detected language: {detected_lang}")

    # --- Translation (if not English) ---
    translated_text = text
    if detected_lang != "en" and detected_lang != "unknown":
        logger.info("Translating text to English")
        translated_text = translate.translate_to_english(text)
    else:
        logger.info("No translation needed")

    # --- Classification ---
    logger.info("Classifying document")
    doc_class = classify.classify_doc(translated_text)

    # --- Metadata / NER Extraction ---
    logger.info("Extracting metadata")
    meta = metadata.extract_metadata(translated_text)

    # --- Embeddings ---
    logger.info("Generating embeddings")
    embedding_vector = embeddings.embed_text([translated_text])[0].tolist()

    # --- Summarization ---
    logger.info("Summarizing text")
    summary = summarize.summarize_text(translated_text)

    # --- Return structured response ---
    return {
        "file_name": file.filename,
        "detected_language": detected_lang,
        "original_text": text[:500],  # truncated preview
        "translated_text": translated_text[:500],
        "classification": doc_class,
        "metadata": meta,
        "embedding_vector_preview": embedding_vector[:50],  # first 50 dims
        "summary": summary,
    }
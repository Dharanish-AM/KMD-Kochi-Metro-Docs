from fastapi import Body
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
    if file.filename.endswith(".pdf"):  # type: ignore
        logger.info("Extracting text from PDF")
        text = parser.extract_text_pdf(file_path)
        if not text.strip():  # fallback to OCR for scanned PDF
            logger.info("PDF text extraction empty, falling back to OCR")
            text = ocr.extract_text_from_file(file_path)  # type: ignore
    elif file.filename.endswith(".docx"):  # type: ignore
        logger.info("Extracting text from DOCX")
        text = parser.extract_text_docx(file_path)
    else:
        logger.info("Extracting text using OCR from image")
        text = ocr.extract_text_from_file(file_path)  # type: ignore

    # --- Check if any text was extracted ---
    if not text.strip():
        logger.info("No text could be extracted from this document.")
        return {
            "file_name": file.filename,
            "error": "No text could be extracted from this document.",
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
    
    # Generate English summary
    if detected_lang != "en" and detected_lang != "unknown":
        translated_for_summary = translate.translate_to_english(text)
    else:
        translated_for_summary = text
    
    summary_en = summarize.summarize_text(translated_for_summary)
    
    # Generate Malayalam summary by translating English summary
    try:
        logger.info("Translating English summary to Malayalam")
        summary_ml = translate.translate_to_malayalam(summary_en)
    except Exception as e:
        logger.error(f"Failed to translate summary to Malayalam: {e}")
        summary_ml = None

    # --- Return structured response ---
    return {
        "file_name": file.filename,
        "detected_language": detected_lang,
        "original_text": text,
        "translated_text": translated_text,
        "classification": doc_class,
        "metadata": meta,
        "embedding_vector": embedding_vector,
        "summary_en": summary_en,
        "summary_ml": summary_ml,
    }


# RAG search endpoint
from pydantic import BaseModel # type: ignore

class RAGSearchRequest(BaseModel):
    query: str


@app.post("/rag_search")
async def rag_search(request: RAGSearchRequest):
    logger.info(f"Received RAG search query: {request.query}")
    embedding_vector = embeddings.embed_text([request.query])[0].tolist()
    return {
        "query": request.query,
        "embedding_vector": embedding_vector,
    }
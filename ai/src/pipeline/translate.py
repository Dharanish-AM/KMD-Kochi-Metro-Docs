import logging
from langdetect import detect
from transformers import pipeline

logger = logging.getLogger(__name__)
translator = None


def translate_to_english(text):
    global translator
    try:
        detected_lang = detect(text)
        logger.info(f"Detected language: {detected_lang}")
    except Exception as e:
        logger.error(f"Language detection failed: {e}")
        return text

    if detected_lang != "en":
        if not translator:
            try:
                logger.info(
                    "Loading Helsinki-NLP/opus-mt-ml-en model for translation with src_lang='ml' and tgt_lang='en'"
                )
                translator = pipeline(
                    "translation",
                    model="Helsinki-NLP/opus-mt-ml-en",
                    src_lang="ml",
                    tgt_lang="en",
                )
            except Exception as e:
                logger.error(f"Failed to load translation model: {e}")
                return text
        try:
            if len(text.strip()) < 3 or len(text.split()) == 1:
                logger.info(
                    "Short or single word text detected, skipping translation to avoid placeholder outputs"
                )
                return text
            logger.info("Translating text")
            translated = translator(text, max_length=512)
            translated_text = translated[0]["translation_text"]
            logger.info(f"Translation result: {translated_text}")
            return translated_text
        except Exception as e:
            logger.error(f"Translation failed: {e}")
            return text
    return text


# Test
text = "ഹായ്, സുഖമാണോ?"

translated_text = translate_to_english(text)
print("Original:", text)
print("Translated:", translated_text)

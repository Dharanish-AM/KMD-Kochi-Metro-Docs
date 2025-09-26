import os
import logging
import requests
from langdetect import detect

logger = logging.getLogger(__name__)

GROQ_API_KEY = "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"

def translate_to_english(text: str) -> str:
    """
    Translates input text to English using the GROQ Chat Completions API.
    Falls back to original text if translation fails.
    """
    try:
        detected_lang = detect(text)
        logger.info(f"Detected language: {detected_lang}")
    except Exception as e:
        logger.error(f"Language detection failed: {e}")
        return text

    if detected_lang == "en" or len(text.strip()) < 3:
        return text

    try:
        clean_text = text.replace("”", "").replace("“", "").replace("‌", "")
        system_prompt = "You are a translation assistant that translates text to English."
        user_prompt = f"Translate the following text to English:\n{clean_text}"

        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 2048,
            "stream": False
        }
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        translated_text = response.json()["choices"][0]["message"]["content"]
        # Remove any prepended phrase like "Here's the translation of the given text to English:"
        remove_prefix = "Here's the translation of the given text to English:\n\n"
        if translated_text.startswith(remove_prefix):
            translated_text = translated_text[len(remove_prefix):].strip()
        logger.info(f"Translation result: {translated_text}")
        return translated_text
    except Exception as e:
        logger.error(f"GROQ API translation failed: {e}")
        return text

def translate_to_malayalam(text: str) -> str:
    """
    Translates input text to Malayalam using the GROQ Chat Completions API.
    Falls back to original text if translation fails.
    """
    try:
        detected_lang = detect(text)
        logger.info(f"Detected language: {detected_lang}")
    except Exception as e:
        logger.error(f"Language detection failed: {e}")
        return text

    if detected_lang == "ml" or len(text.strip()) < 3:
        return text

    try:
        clean_text = text.replace("”", "").replace("“", "").replace("‌", "")
        system_prompt = "You are a translation assistant that translates text to Malayalam."
        user_prompt = f"Translate the following text to Malayalam:\n{clean_text}"

        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 2048,
            "stream": False
        }
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        translated_text = response.json()["choices"][0]["message"]["content"]
        # Remove any prepended phrase like "Here's the translation of the given text to Malayalam:"
        remove_prefix = "Here's the translation of the given text to Malayalam:\n\n"
        if translated_text.startswith(remove_prefix):
            translated_text = translated_text[len(remove_prefix):].strip()
        logger.info(f"Translation result: {translated_text}")
        return translated_text
    except Exception as e:
        logger.error(f"GROQ API translation failed: {e}")
        return text
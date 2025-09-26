
import os
import requests
import logging

logger = logging.getLogger(__name__)
GROQ_API_KEY = "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"

def summarize_with_groq(text, language="en"):
    """
    Summarizes the given text using GROQ Chat Completions API.
    """
    system_prompt = f"You are a summarization assistant that summarizes text in {language}."
    user_prompt = f"Summarize the following text in {language}:\n{text}"

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

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        summary = response.json()["choices"][0]["message"]["content"]
        return summary
    except Exception as e:
        logger.error(f"GROQ summarization failed: {e}")
        return text  # fallback

def summarize_text(text, language="en"):
    print("Starting summarization with GROQ...")
    return summarize_with_groq(text, language=language)

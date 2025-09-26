import os
import requests
import logging

logger = logging.getLogger(__name__)
GROQ_API_KEY = "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"


def summarize_with_groq(text, language="en", max_lines=30):
    """
    Summarizes the given text using GROQ API.
    Produces a clean, structured paragraph limited to max_lines.
    """
    system_prompt = (
        f"You are an expert summarization assistant that produces concise, readable summaries in {language}. "
        "Ignore headers, page numbers, repetitive phrases, and administrative text."
    )

    user_prompt = (
        f"Summarize the following text in {language} as a single structured paragraph. "
        f"Limit the summary to approximately {max_lines} lines:\n{text}"
    )

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.1,
        "max_tokens": 2048,
        "stream": False,
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=30,
        )
        response.raise_for_status()
        summary = response.json()["choices"][0]["message"]["content"]

        # Remove any repeated prepended phrases
        summary = summary.replace("Here's a summary of the text:", "")
        summary = summary.replace("Here is a summary of the text:", "")
        summary = summary.replace("Summary:", "")
        summary = " ".join(
            line.strip() for line in summary.splitlines() if line.strip()
        )

        # Limit to max_lines roughly by splitting at periods
        sentences = summary.split(". ")
        limited_summary = ". ".join(sentences[:max_lines])
        if not limited_summary.endswith("."):
            limited_summary += "."

        return limited_summary.strip()
    except Exception as e:
        logger.error(f"GROQ summarization failed: {e}")
        # fallback
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        fallback_summary = " ".join(lines[:max_lines])
        return fallback_summary


def summarize_text(text, language="en"):
    print("Starting summarization with GROQ...")
    return summarize_with_groq(text, language=language)
